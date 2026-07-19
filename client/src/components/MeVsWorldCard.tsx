import { Gamepad2, Sword } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ARENA_R      = 6.0;
const BOT_COUNT    = 6;
const PLAYER_SPEED = 4.5;
const PLAYER_R     = 0.35;
const BOT_R        = 0.32;
const SLASH_R      = 1.6;
const SLASH_ARC    = Math.PI * 0.75;
const PLAYER_TARGET_HEIGHT = 1.35;
const PLAYER_AVATAR_URL = new URL("./gameassets/ver2.glb", import.meta.url).href;

const BOT_NAMES = [
  "BUGS","NULL PTR","MERGE CONFLICT","MEMORY LEAK",
  "RACE COND","BUILD FAIL","PROD FIRE","TIMEOUT",
  "SCOPE CREEP","API DRIFT","HOTFIX","BAD REQUEST",
];

// ─── Math helpers (flat XZ plane, Y is up) ───────────────────────────────────
type V2 = { x: number; z: number };
const v2len  = (v: V2) => Math.sqrt(v.x*v.x + v.z*v.z);
const v2norm = (v: V2): V2 => { const l = v2len(v)||1; return {x:v.x/l,z:v.z/l}; };
const v2add  = (a: V2, b: V2): V2 => ({x:a.x+b.x,z:a.z+b.z});
const v2sub  = (a: V2, b: V2): V2 => ({x:a.x-b.x,z:a.z-b.z});
const v2sc   = (v: V2, s: number): V2 => ({x:v.x*s,z:v.z*s});
const v2cl   = (v: V2, r: number): V2 => { const l=v2len(v); return l>r?v2sc(v2norm(v),r):v; };
const lerp   = (a:number,b:number,t:number) => a+(b-a)*t;
const rnd    = (a:number,b:number) => a+Math.random()*(b-a);
const rndName= () => BOT_NAMES[Math.floor(Math.random()*BOT_NAMES.length)]!;
const fromA  = (a:number,r:number): V2 => ({x:Math.cos(a)*r,z:Math.sin(a)*r});

// ─── Game state (pure data, no Three.js) ─────────────────────────────────────
type Bot = {
  id: number; pos: V2; vel: V2; name: string;
  speed: number; hitFlash: number; strafeT: number;
  strafeSign: number; spawnT: number; dead: boolean;
};
type Spark = { pos: THREE.Vector3; vel: THREE.Vector3; life: number; maxLife: number; color: THREE.Color };

type GS = {
  playerPos: V2; playerVel: V2; playerFacing: number;
  playerHP: number; hitCool: number;
  slashTimer: number; slashCool: number; slashQueued: boolean;
  slashOrigin: V2|null; slashAngle: number;
  score: number; combo: number; comboTimer: number;
  wave: number; elapsed: number;
  bots: Bot[]; nextId: number;
  sparks: Spark[];
  touchDir: V2|null;
  // UI dirty
  uiHP:number; uiScore:number; uiCombo:number; uiWave:number;
};

function mkBot(id:number, idx:number, wave=1): Bot {
  const angle = (idx/BOT_COUNT)*Math.PI*2+rnd(-0.4,0.4);
  const r     = rnd(ARENA_R*0.72,ARENA_R*0.94);
  const wb    = Math.min((wave-1)*0.09,0.8);
  return { id, pos:fromA(angle,r), vel:{x:0,z:0}, name:rndName(),
    speed:rnd(1.0+wb,1.65+wb), hitFlash:0,
    strafeT:Math.random()*Math.PI*2, strafeSign:Math.random()>0.5?1:-1,
    spawnT:0, dead:false };
}

function mkState(): GS {
  return {
    playerPos:{x:0,z:0}, playerVel:{x:0,z:0}, playerFacing:0,
    playerHP:100, hitCool:0,
    slashTimer:0, slashCool:0, slashQueued:false,
    slashOrigin:null, slashAngle:0,
    score:0, combo:0, comboTimer:0,
    wave:1, elapsed:0,
    bots: Array.from({length:BOT_COUNT},(_,i)=>mkBot(i,i)),
    nextId:BOT_COUNT, sparks:[], touchDir:null,
    uiHP:100, uiScore:0, uiCombo:0, uiWave:1,
  };
}

// ─── Tick (pure logic, no rendering) ─────────────────────────────────────────
type UI = {
  setHP: (n:number)=>void; setScore:(n:number)=>void;
  setCombo:(n:number)=>void; setWave:(n:number)=>void;
  setPhase:(p:Phase)=>void;
};

function tick(gs:GS, dt:number, keys:Set<string>, ui:UI): boolean {
  gs.elapsed += dt;
  const nw = 1+Math.floor(gs.elapsed/22);
  if (nw!==gs.wave) gs.wave=nw;

  // Player input
  let mx=0,mz=0;
  if (keys.has("KeyA")||keys.has("ArrowLeft"))  mx-=1;
  if (keys.has("KeyD")||keys.has("ArrowRight")) mx+=1;
  if (keys.has("KeyW")||keys.has("ArrowUp"))    mz-=1;
  if (keys.has("KeyS")||keys.has("ArrowDown"))  mz+=1;
  if (gs.touchDir) { mx+=gs.touchDir.x; mz+=gs.touchDir.z; }
  const il=Math.sqrt(mx*mx+mz*mz); if(il>1){mx/=il;mz/=il;}

  const fric=Math.exp(-11*dt);
  gs.playerVel.x=gs.playerVel.x*fric+mx*26*dt;
  gs.playerVel.z=gs.playerVel.z*fric+mz*26*dt;
  const spd=v2len(gs.playerVel);
  if(spd>PLAYER_SPEED){gs.playerVel.x=gs.playerVel.x/spd*PLAYER_SPEED;gs.playerVel.z=gs.playerVel.z/spd*PLAYER_SPEED;}

  gs.playerPos=v2add(gs.playerPos,v2sc(gs.playerVel,dt));
  gs.playerPos=v2cl(gs.playerPos,ARENA_R-PLAYER_R);
  if(spd>0.2) gs.playerFacing=Math.atan2(gs.playerVel.x,gs.playerVel.z);

  // Slash
  gs.slashCool=Math.max(0,gs.slashCool-dt);
  gs.slashTimer=Math.max(0,gs.slashTimer-dt);
  if((keys.has("Space")||gs.slashQueued)&&gs.slashCool<=0){
    gs.slashCool=0.36; gs.slashTimer=0.20;
    gs.slashOrigin={...gs.playerPos}; gs.slashAngle=gs.playerFacing;
  }
  gs.slashQueued=false;
  if(gs.slashTimer<=0) gs.slashOrigin=null;

  // Bots
  gs.hitCool=Math.max(0,gs.hitCool-dt);
  const kill=new Set<number>();

  for(const b of gs.bots){
    b.spawnT=Math.min(1,b.spawnT+dt*2.8);
    b.hitFlash=Math.max(0,b.hitFlash-dt*3.5);
    b.strafeT+=dt*1.3;

    const tp=v2sub(gs.playerPos,b.pos);
    const dist=v2len(tp); const dir=v2norm(tp);
    const tan={x:-dir.z,z:dir.x};
    const strafe=b.strafeSign*Math.sin(b.strafeT)*0.5;
    let sx=0,sz=0;
    for(const o of gs.bots){
      if(o.id===b.id)continue;
      const d=v2sub(b.pos,o.pos); const dl=v2len(d);
      if(dl<1.3&&dl>0.001){const p=(1.3-dl)/1.3*2.4;sx+=d.x/dl*p;sz+=d.z/dl*p;}
    }
    const tvx=dir.x*b.speed+tan.x*strafe+sx;
    const tvz=dir.z*b.speed+tan.z*strafe+sz;
    b.vel.x=lerp(b.vel.x,tvx,0.10); b.vel.z=lerp(b.vel.z,tvz,0.10);
    b.pos=v2add(b.pos,v2sc(b.vel,dt));
    b.pos=v2cl(b.pos,ARENA_R-BOT_R);

    // Slash hit
    if(gs.slashOrigin&&gs.slashTimer>0){
      const diff=v2sub(b.pos,gs.slashOrigin);
      const d2=v2len(diff);
      if(d2<SLASH_R){
        let a=Math.atan2(diff.x,diff.z)-gs.slashAngle;
        while(a>Math.PI)a-=Math.PI*2; while(a<-Math.PI)a+=Math.PI*2;
        if(Math.abs(a)<SLASH_ARC){
          kill.add(b.id);
          gs.score+=Math.min(5,1+Math.floor(gs.combo/4));
          gs.combo++; gs.comboTimer=2.5;
          // sparks
          const col=new THREE.Color(gs.combo>6?"#fbbf24":"#4ade80");
          for(let i=0;i<14;i++){
            const a2=Math.random()*Math.PI*2, s=rnd(1.5,4.5);
            gs.sparks.push({
              pos:new THREE.Vector3(b.pos.x,0.4,b.pos.z),
              vel:new THREE.Vector3(Math.cos(a2)*s,rnd(2,6),Math.sin(a2)*s),
              life:rnd(0.4,0.85),maxLife:0.85,
              color:col.clone(),
            });
          }
        }
      }
    }

    // Bot hits player
    if(dist<PLAYER_R+BOT_R&&gs.hitCool<=0){
      gs.hitCool=0.52; gs.playerHP=Math.max(0,gs.playerHP-9);
      gs.combo=0; gs.comboTimer=0;
      gs.playerVel.x-=dir.x*3; gs.playerVel.z-=dir.z*3;
      for(let i=0;i<6;i++){
        const a2=Math.random()*Math.PI*2;
        gs.sparks.push({
          pos:new THREE.Vector3(gs.playerPos.x,0.5,gs.playerPos.z),
          vel:new THREE.Vector3(Math.cos(a2)*2,rnd(1,4),Math.sin(a2)*2),
          life:0.5,maxLife:0.5,color:new THREE.Color("#f87171"),
        });
      }
    }
  }

  gs.bots=gs.bots.filter(b=>!kill.has(b.id));
  while(gs.bots.length<BOT_COUNT) gs.bots.push(mkBot(gs.nextId++,gs.bots.length,gs.wave));

  gs.comboTimer=Math.max(0,gs.comboTimer-dt);
  if(gs.comboTimer<=0&&gs.combo>0) gs.combo=0;

  for(const s of gs.sparks){
    s.pos.x+=s.vel.x*dt; s.pos.y+=s.vel.y*dt; s.pos.z+=s.vel.z*dt;
    s.vel.y-=12*dt; // gravity
    s.vel.x*=Math.exp(-1.5*dt); s.vel.z*=Math.exp(-1.5*dt);
    if(s.pos.y<0){s.pos.y=0;s.vel.y*=-0.25;}
    s.life-=dt;
  }
  gs.sparks=gs.sparks.filter(s=>s.life>0);

  if(gs.uiHP!==gs.playerHP){gs.uiHP=gs.playerHP;ui.setHP(gs.playerHP);}
  if(gs.uiScore!==gs.score){gs.uiScore=gs.score;ui.setScore(gs.score);}
  if(gs.uiCombo!==gs.combo){gs.uiCombo=gs.combo;ui.setCombo(gs.combo);}
  if(gs.uiWave!==gs.wave){gs.uiWave=gs.wave;ui.setWave(gs.wave);}

  if(gs.playerHP<=0){ui.setPhase("dead");return false;}
  return true;
}

// ─── Three.js scene builder ───────────────────────────────────────────────────
type SceneHandles = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  playerMesh: THREE.Group;
  swordPivot: THREE.Group;
  botMeshes: Map<number,THREE.Group>;
  botLabels: Map<number,THREE.Sprite>;
  sparkPoints: THREE.Points;
  sparkGeo: THREE.BufferGeometry;
  slashRing: THREE.Mesh;
  arenaRingMesh: THREE.Mesh;
  dispose: ()=>void;
};

function makeFallbackPlayerAvatar(playerMat: THREE.MeshStandardMaterial): THREE.Group {
  const fallback = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.75,14),playerMat);
  body.position.y = 0.6;
  body.castShadow = true;
  fallback.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2,14,14),
    new THREE.MeshStandardMaterial({color:"#e8fff2",roughness:0.25,metalness:0.1})
  );
  head.position.y = 1.2;
  head.castShadow = true;
  fallback.add(head);
  for (const sx of [-0.27,0.27]) {
    const shoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.1,10,10),
      new THREE.MeshStandardMaterial({color:"#4ade80",emissive:"#1a6b35",emissiveIntensity:0.5,roughness:0.3})
    );
    shoulder.position.set(sx,1.0,0);
    shoulder.castShadow = true;
    fallback.add(shoulder);
  }
  return fallback;
}

function buildScene(mount: HTMLElement): SceneHandles {
  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.cssText="position:absolute;inset:0;width:100%;height:100%;";

  // ── Camera — closer, soft tracking ──────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(82,1,0.1,120);
  camera.position.set(0,5.5,4.5);
  camera.lookAt(0,0,0);

  // ── Scene ──────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#060d0a");
  scene.fog = new THREE.FogExp2("#060d0a",0.012);

  // Lights
  scene.add(new THREE.AmbientLight("#a8d5b5",0.6));
  const sun=new THREE.DirectionalLight("#e0fff0",1.8);
  sun.position.set(5,14,7); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.near=0.5; sun.shadow.camera.far=40;
  sun.shadow.camera.left=-10; sun.shadow.camera.right=10;
  sun.shadow.camera.top=10; sun.shadow.camera.bottom=-10;
  scene.add(sun);
  const fill=new THREE.PointLight("#40e080",0.9,30,1.5);
  fill.position.set(-5,5,-5); scene.add(fill);
  const rim=new THREE.PointLight("#80ffb0",0.6,20,1.8);
  rim.position.set(0,4,8); scene.add(rim);

  // ── Arena floor ───────────────────────────────────────────────────────────
  const floorGeo=new THREE.CircleGeometry(ARENA_R,80);
  const floorMat=new THREE.MeshStandardMaterial({
    color:"#0d1f12",roughness:0.85,metalness:0.05,
    emissive:"#0a1a0f",emissiveIntensity:0.4,
  });
  const floor=new THREE.Mesh(floorGeo,floorMat);
  floor.rotation.x=-Math.PI/2; floor.receiveShadow=true;
  scene.add(floor);

  // Grid lines on floor (drawn with LineSegments)
  const gridLines:number[]=[];
  const gStep=1.0;
  for(let gx=-ARENA_R;gx<=ARENA_R;gx+=gStep){
    const gz=Math.sqrt(Math.max(0,ARENA_R*ARENA_R-gx*gx));
    gridLines.push(gx,0.01,-gz,gx,0.01,gz);
  }
  for(let gz=-ARENA_R;gz<=ARENA_R;gz+=gStep){
    const gx=Math.sqrt(Math.max(0,ARENA_R*ARENA_R-gz*gz));
    gridLines.push(-gx,0.01,gz,gx,0.01,gz);
  }
  const gridGeo=new THREE.BufferGeometry();
  gridGeo.setAttribute("position",new THREE.Float32BufferAttribute(gridLines,3));
  const gridMesh=new THREE.LineSegments(gridGeo,new THREE.LineBasicMaterial({color:"#1a3a22",transparent:true,opacity:0.5}));
  scene.add(gridMesh);

  // Arena border torus
  const arenaRingMesh=new THREE.Mesh(
    new THREE.TorusGeometry(ARENA_R,0.10,18,90),
    new THREE.MeshBasicMaterial({color:"#4ade80",transparent:true,opacity:0.7})
  );
  arenaRingMesh.rotation.x=Math.PI/2; arenaRingMesh.position.y=0.03;
  scene.add(arenaRingMesh);

  // Inner center ring
  const innerRing=new THREE.Mesh(
    new THREE.TorusGeometry(ARENA_R*0.28,0.04,12,60),
    new THREE.MeshBasicMaterial({color:"#4ade80",transparent:true,opacity:0.25})
  );
  innerRing.rotation.x=Math.PI/2; innerRing.position.y=0.02;
  scene.add(innerRing);

  // ── Stars / ambient particles ─────────────────────────────────────────────
  const starCount=320;
  const starPos=new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){
    const r=10+Math.random()*20, th=Math.random()*Math.PI*2;
    starPos[i*3]=Math.cos(th)*r;
    starPos[i*3+1]=2+Math.random()*12;
    starPos[i*3+2]=Math.sin(th)*r;
  }
  const starGeo=new THREE.BufferGeometry();
  starGeo.setAttribute("position",new THREE.Float32BufferAttribute(starPos,3));
  scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:"#88ffaa",size:0.055,sizeAttenuation:true,transparent:true,opacity:0.55})));

  // ── Player mesh ───────────────────────────────────────────────────────────
  const playerMat=new THREE.MeshStandardMaterial({color:"#d1fae5",roughness:0.3,metalness:0.2,emissive:"#0d3320",emissiveIntensity:0.5});
  const playerMesh=new THREE.Group();
  const avatarRoot = new THREE.Group();
  playerMesh.add(avatarRoot);
  avatarRoot.add(makeFallbackPlayerAvatar(playerMat));

  const avatarLoader = new GLTFLoader();
  avatarLoader.load(
    PLAYER_AVATAR_URL,
    (gltf) => {
      const avatar = gltf.scene;
      avatar.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });

      const box = new THREE.Box3().setFromObject(avatar);
      const size = new THREE.Vector3();
      box.getSize(size);
      const rawHeight = Math.max(size.y, 0.001);
      const uniformScale = PLAYER_TARGET_HEIGHT / rawHeight;
      avatar.scale.setScalar(uniformScale);

      box.setFromObject(avatar);
      const center = new THREE.Vector3();
      box.getCenter(center);
      avatar.position.set(-center.x, -box.min.y, -center.z);

      avatarRoot.clear();
      avatarRoot.add(avatar);
    },
    undefined,
    () => {
      avatarRoot.clear();
      avatarRoot.add(makeFallbackPlayerAvatar(playerMat));
    }
  );

  // Sword pivot (right shoulder)
  const swordPivot=new THREE.Group();
  swordPivot.position.set(0.3,0.85,0.1);
  const bladeMat=new THREE.MeshStandardMaterial({color:"#afffce",emissive:"#2fcc70",emissiveIntensity:1.4,roughness:0.1,metalness:0.7});
  const blade=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.9,0.07),bladeMat);
  blade.position.y=0.5; swordPivot.add(blade);
  const guard=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.07,0.09),
    new THREE.MeshStandardMaterial({color:"#6ee7a0",roughness:0.25,metalness:0.55}));
  guard.position.y=0.08; swordPivot.add(guard);
  playerMesh.add(swordPivot);

  // Player glow light
  const playerLight=new THREE.PointLight("#4ade80",0.8,4,2);
  playerLight.position.y=1; playerMesh.add(playerLight);

  scene.add(playerMesh);

  // ── Slash ring visual ─────────────────────────────────────────────────────
  const slashRing=new THREE.Mesh(
    new THREE.RingGeometry(0.5,SLASH_R,48,1,0,Math.PI*1.5),
    new THREE.MeshBasicMaterial({color:"#86efac",transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false})
  );
  slashRing.rotation.x=-Math.PI/2;
  slashRing.position.y=0.08;
  scene.add(slashRing);

  // ── Sparks (instanced points) ─────────────────────────────────────────────
  const MAX_SPARKS=300;
  const sparkGeo=new THREE.BufferGeometry();
  sparkGeo.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array(MAX_SPARKS*3),3));
  sparkGeo.setAttribute("color",new THREE.Float32BufferAttribute(new Float32Array(MAX_SPARKS*3),3));
  const sparkPoints=new THREE.Points(sparkGeo,new THREE.PointsMaterial({
    size:0.12,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:0.9,depthWrite:false,
  }));
  scene.add(sparkPoints);

  // ── Bot pool ──────────────────────────────────────────────────────────────
  const botMeshes=new Map<number,THREE.Group>();
  const botLabels=new Map<number,THREE.Sprite>();

  // ── Resize ────────────────────────────────────────────────────────────────
  const resize=()=>{
    const w=mount.clientWidth, h=mount.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro=new ResizeObserver(resize);
  ro.observe(mount);

  return {
    scene,camera,renderer,playerMesh,swordPivot,
    botMeshes,botLabels,sparkPoints,sparkGeo,slashRing,arenaRingMesh,
    dispose:()=>{
      ro.disconnect();
      scene.traverse((o:THREE.Object3D)=>{
        const m=o as THREE.Mesh;
        m.geometry?.dispose();
        if(Array.isArray(m.material)) m.material.forEach((x:THREE.Material)=>x.dispose());
        else (m.material as THREE.Material|undefined)?.dispose();
      });
      renderer.dispose();
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    },
  };
}

// ── Sprite label ──────────────────────────────────────────────────────────────
function makeLabel(text:string): THREE.Sprite {
  const c=document.createElement("canvas"); c.width=256;c.height=72;
  const x=c.getContext("2d")!;
  x.clearRect(0,0,256,72);
  x.fillStyle="rgba(4,14,8,0.92)"; x.strokeStyle="rgba(74,222,128,0.85)"; x.lineWidth=2;
  x.beginPath();
  const y0=6,h=52,r=10;
  x.moveTo(r,y0);x.lineTo(256-r,y0);x.quadraticCurveTo(254,y0,254,y0+r);
  x.lineTo(254,y0+h-r);x.quadraticCurveTo(254,y0+h,256-r,y0+h);
  x.lineTo(r,y0+h);x.quadraticCurveTo(2,y0+h,2,y0+h-r);
  x.lineTo(2,y0+r);x.quadraticCurveTo(2,y0,r,y0);
  x.fill();x.stroke();
  let fs=28; x.font=`800 ${fs}px monospace`;
  while(x.measureText(text).width>230&&fs>14){fs--;x.font=`800 ${fs}px monospace`;}
  x.shadowColor="rgba(74,222,128,0.7)";x.shadowBlur=8;
  x.fillStyle="#f0fff5";x.textAlign="center";x.textBaseline="middle";
  x.fillText(text,128,36);
  const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,depthTest:false}));
  sp.scale.set(2.2,0.62,1);sp.renderOrder=999;
  return sp;
}

function mkBotMesh(scene:THREE.Scene, botMeshes:Map<number,THREE.Group>, botLabels:Map<number,THREE.Sprite>, bot:Bot){
  const g=new THREE.Group();
  const core=new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.28+Math.random()*0.06,0),
    new THREE.MeshStandardMaterial({color:"#ff5577",emissive:"#6e1c3f",emissiveIntensity:1.1,roughness:0.2,metalness:0.15})
  );
  core.castShadow=true; g.add(core);
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(0.4,0.025,10,28),
    new THREE.MeshBasicMaterial({color:"#ff9ab5",transparent:true,opacity:0.7})
  );
  ring.rotation.x=Math.PI/2; g.add(ring);
  // Bot glow
  const bl=new THREE.PointLight("#ff4477",0.7,3,2.5);
  bl.position.y=0.4; g.add(bl);
  g.position.set(bot.pos.x,0.42,bot.pos.z);
  scene.add(g);
  botMeshes.set(bot.id,g);
  const label=makeLabel(bot.name);
  g.add(label); label.position.y=1.3;
  botLabels.set(bot.id,label);
}

// ─── Render sync (game state → Three.js) ─────────────────────────────────────
function syncScene(
  gs:GS, sh:SceneHandles, t:number, dt:number
){
  const {scene,playerMesh,swordPivot,botMeshes,botLabels,
         sparkPoints,sparkGeo,slashRing,arenaRingMesh,camera} = sh;

  // ── Player ────────────────────────────────────────────────────────────────
  playerMesh.position.set(gs.playerPos.x,0,gs.playerPos.z);
  // Rotate player to face movement direction (Y-axis rotation)
  playerMesh.rotation.y = -gs.playerFacing;

  // Sword swing animation
  const slashProg = gs.slashTimer>0 ? 1-gs.slashTimer/0.20 : 1;
  if(gs.slashTimer>0){
    swordPivot.rotation.z = -Math.sin(slashProg*Math.PI)*2.5;
  } else {
    swordPivot.rotation.z = lerp(swordPivot.rotation.z,0,1-Math.exp(-12*dt));
  }

  // Player glow color on hit
  const pl=playerMesh.getObjectByProperty("isPointLight",true) as THREE.PointLight|undefined;
  if(pl) pl.color.setStyle(gs.hitCool>0?"#ff4444":"#4ade80");

  // Bob
  playerMesh.position.y = Math.sin(t*2.8)*0.04;

  // ── Slash ring ────────────────────────────────────────────────────────────
  const slashMat = slashRing.material as THREE.MeshBasicMaterial;
  if(gs.slashOrigin&&gs.slashTimer>0){
    const p=1-gs.slashTimer/0.20;
    slashRing.position.set(gs.slashOrigin.x,0.08,gs.slashOrigin.z);
    slashRing.rotation.z = -gs.slashAngle - Math.PI/2;
    slashMat.opacity=Math.max(0,(1-p)*0.65);
  } else {
    slashMat.opacity=lerp(slashMat.opacity,0,1-Math.exp(-14*dt));
  }

  // ── Bots ──────────────────────────────────────────────────────────────────
  // Create meshes for new bots
  for(const b of gs.bots){
    if(!botMeshes.has(b.id)) mkBotMesh(scene,botMeshes,botLabels,b);
  }
  // Remove meshes for dead bots
  const liveIds=new Set(gs.bots.map(b=>b.id));
  for(const [id,g] of Array.from(botMeshes.entries())){
    if(!liveIds.has(id)){
      scene.remove(g);
      g.traverse((o:THREE.Object3D)=>{
        const m=o as THREE.Mesh;
        m.geometry?.dispose();
        if(Array.isArray(m.material)) m.material.forEach((x:THREE.Material)=>x.dispose());
        else (m.material as THREE.Material|undefined)?.dispose();
      });
      botLabels.get(id)?.material.map?.dispose();
      botLabels.get(id)?.material.dispose();
      botMeshes.delete(id);
      botLabels.delete(id);
    }
  }
  // Sync positions
  for(const b of gs.bots){
    const g=botMeshes.get(b.id); if(!g)continue;
    const s=b.spawnT;
    g.scale.setScalar(s);
    g.position.set(b.pos.x, 0.42+Math.sin(t*2.4+b.id*1.1)*0.08, b.pos.z);
    g.rotation.y+=dt*(1.8+b.speed*0.3);
    const core=g.children[0] as THREE.Mesh;
    const mat=core.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity=lerp(1.1,2.5,b.hitFlash);
    mat.color.setStyle(b.hitFlash>0.3?"#ffaaaa":"#ff5577");
    // Label faces camera always
    const lbl=botLabels.get(b.id);
    if(lbl){ lbl.position.y=1.6+Math.sin(t*1.8+b.id)*0.06; lbl.lookAt(camera.position); }
    const lightChild=g.getObjectByProperty("isPointLight",true) as THREE.PointLight|undefined;
    if(lightChild) lightChild.intensity=lerp(0.7,1.8,b.hitFlash);
  }

  // ── Sparks ────────────────────────────────────────────────────────────────
  const posArr = sparkGeo.attributes.position as THREE.BufferAttribute;
  const colArr = sparkGeo.attributes.color   as THREE.BufferAttribute;
  const maxS   = Math.min(gs.sparks.length, 300);
  for(let i=0;i<maxS;i++){
    const s=gs.sparks[i]!;
    posArr.setXYZ(i,s.pos.x,s.pos.y,s.pos.z);
    const alpha=s.life/s.maxLife;
    colArr.setXYZ(i,s.color.r*alpha,s.color.g*alpha,s.color.b*alpha);
  }
  // zero out unused
  for(let i=maxS;i<300;i++){posArr.setXYZ(i,0,-99,0);}
  posArr.needsUpdate=true; colArr.needsUpdate=true;
  sparkPoints.geometry.setDrawRange(0,maxS);

  // Arena ring pulse
  const arMat=arenaRingMesh.material as THREE.MeshBasicMaterial;
  arMat.opacity=0.5+0.2*Math.sin(t*2.2);
  arenaRingMesh.rotation.z+=dt*0.15;

  // ── Soft camera tracking ───────────────────────────────────────────────────
  // Camera stays elevated and slightly behind the arena center, but drifts
  // 35% toward the player so the action stays closer to center of frame.
  // Clamped so camera never leaves a comfortable overhead angle.
  const trackX = gs.playerPos.x * 0.35;
  const trackZ = gs.playerPos.z * 0.35;
  const baseCamX = 0, baseCamY = 5.5, baseCamZ = 4.5;
  camera.position.x += (baseCamX + trackX - camera.position.x) * (1 - Math.exp(-4 * dt));
  camera.position.y += (baseCamY            - camera.position.y) * (1 - Math.exp(-4 * dt));
  camera.position.z += (baseCamZ + trackZ   - camera.position.z) * (1 - Math.exp(-4 * dt));
  // Always look at a point slightly above the player
  camera.lookAt(gs.playerPos.x * 0.25, 0.5, gs.playerPos.z * 0.25);
}

// ─── Component ────────────────────────────────────────────────────────────────
type Phase="idle"|"playing"|"dead";

export function MeVsWorldCard() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const shRef     = useRef<SceneHandles|null>(null);
  const gsRef     = useRef<GS|null>(null);
  const keysRef   = useRef(new Set<string>());
  const rafRef    = useRef(0);
  const prevTRef  = useRef(0);
  const clockRef  = useRef(0);
  const touchRef  = useRef<{id:number;sx:number;sy:number}|null>(null);

  const [phase,  setPhase]  = useState<Phase>("idle");
  const [score,  setScore]  = useState(0);
  const [hp,     setHP]     = useState(100);
  const [combo,  setCombo]  = useState(0);
  const [wave,   setWave]   = useState(1);

  const uiRef=useRef({setHP,setScore,setCombo,setWave,setPhase});
  useEffect(()=>{uiRef.current={setHP,setScore,setCombo,setWave,setPhase};});

  const startGame=useCallback(()=>{
    keysRef.current.clear();
    setScore(0);setHP(100);setCombo(0);setWave(1);
    gsRef.current=mkState();
    setPhase("playing");
  },[]);

  // ── Three.js lifecycle ────────────────────────────────────────────────────
  useEffect(()=>{
    if(phase!=="playing") return;
    const mount=mountRef.current; if(!mount)return;

    const sh=buildScene(mount);
    shRef.current=sh;
    clockRef.current=0;
    prevTRef.current=performance.now();

    const downH=(e:KeyboardEvent)=>{
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();
      keysRef.current.add(e.code);
    };
    const upH=(e:KeyboardEvent)=>keysRef.current.delete(e.code);
    window.addEventListener("keydown",downH);
    window.addEventListener("keyup",upH);

    const loop=(now:number)=>{
      rafRef.current=requestAnimationFrame(loop);
      const dt=Math.min((now-prevTRef.current)/1000,0.05);
      prevTRef.current=now;
      clockRef.current+=dt;
      const gs=gsRef.current; if(!gs)return;
      const alive=tick(gs,dt,keysRef.current,uiRef.current);
      if(alive) syncScene(gs,sh,clockRef.current,dt);
      sh.renderer.render(sh.scene,sh.camera);
    };
    rafRef.current=requestAnimationFrame(loop);

    return ()=>{
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown",downH);
      window.removeEventListener("keyup",upH);
      sh.dispose();
      shRef.current=null;
    };
  },[phase]);

  // ── Touch ─────────────────────────────────────────────────────────────────
  const onTouchStart=useCallback((e:React.TouchEvent)=>{
    const t=e.changedTouches[0]!;
    touchRef.current={id:t.identifier,sx:t.clientX,sy:t.clientY};
  },[]);
  const onTouchMove=useCallback((e:React.TouchEvent)=>{
    if(!touchRef.current||!gsRef.current)return;
    const t=Array.from(e.touches).find(x=>x.identifier===touchRef.current!.id);
    if(!t)return;
    gsRef.current.touchDir={x:(t.clientX-touchRef.current.sx)/44,z:(t.clientY-touchRef.current.sy)/44};
  },[]);
  const onTouchEnd=useCallback(()=>{
    touchRef.current=null;
    if(gsRef.current)gsRef.current.touchDir=null;
  },[]);
  const slash=useCallback(()=>{if(gsRef.current)gsRef.current.slashQueued=true;},[]);

  const isPlaying=phase==="playing";
  const isDead=phase==="dead";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#1c2e1c] bg-[#07100a] shadow-[0_0_48px_rgba(0,0,0,0.7)]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c2e1c] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-3.5 w-3.5 text-[#4ade80]"/>
          <span className="text-[11px] font-black tracking-[0.18em] text-[#4ade80]">ME VS THE WORLD</span>
        </div>
        {isPlaying&&(
          <span className="rounded-full bg-[#4ade80]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#4ade80]/70">
            WAVE {wave}
          </span>
        )}
      </div>

      {/* Stats */}
      {isPlaying&&(
        <div className="grid grid-cols-3 divide-x divide-[#1c2e1c] border-b border-[#1c2e1c]">
          {[
            {l:"SCORE",v:score,c:"text-[#4ade80]"},
            {l:"HP",v:hp,c:hp<=30?"text-[#f87171]":"text-[#4ade80]"},
            {l:"COMBO",v:`×${Math.max(1,combo)}`,c:combo>=6?"text-[#fbbf24]":"text-[#4ade80]"},
          ].map(({l,v,c})=>(
            <div key={l} className="flex flex-col items-center py-2 bg-[#07100a]">
              <span className="text-[9px] tracking-[0.18em] text-[#4ade80]/35">{l}</span>
              <span className={`text-sm font-black tabular-nums ${c}`}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3D Viewport */}
      <div
        ref={mountRef}
        className="relative flex-1 select-none overflow-hidden"
        style={{aspectRatio:"4/3"}}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
      >
        {/* Idle */}
        {phase==="idle"&&(
          <div className="absolute inset-0 overflow-hidden bg-[#07100a]">
            {/* Scanline texture overlay */}
            <div className="pointer-events-none absolute inset-0 z-10"
              style={{backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.18) 0px,rgba(0,0,0,0.18) 1px,transparent 1px,transparent 3px)"}}/>
            {/* Green radial glow behind character */}
            <div className="pointer-events-none absolute inset-0"
              style={{background:"radial-gradient(ellipse 60% 70% at 72% 85%, rgba(74,222,128,0.13) 0%, transparent 70%)"}}/>
            {/* Grid floor lines */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
              style={{backgroundImage:"linear-gradient(rgba(74,222,128,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.4) 1px,transparent 1px)",backgroundSize:"40px 40px",maskImage:"linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)"}}/>

            {/* Layout: text left, character right */}
            <div className="absolute inset-0 flex items-end justify-between px-6 pb-6">
              {/* Left — title + CTA */}
              <div className="flex flex-col gap-4 z-20 max-w-[55%]">
                <div>
                  <p className="mb-2 text-[8px] tracking-[0.4em] text-[#4ade80]/50">BROWSER GAME</p>
                  <h2 className="text-[2.2rem] font-black leading-[0.92] tracking-tight text-[#4ade80] drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                    ME<br/>VS<br/><span className="text-white">THE<br/>WORLD</span>
                  </h2>
                </div>
                <p className="text-[10px] leading-relaxed text-[#4ade80]/50">
                  Slash the problem bots<br/>before they overwhelm you
                </p>
                <div className="flex flex-col gap-2">
                  <button onClick={startGame}
                    className="w-fit whitespace-nowrap rounded-full bg-[#4ade80] px-6 py-2.5 text-xs font-black tracking-[0.2em] text-[#07100a] shadow-[0_0_24px_rgba(74,222,128,0.5)] transition hover:bg-[#86efac] hover:shadow-[0_0_32px_rgba(74,222,128,0.7)] active:scale-95">
                    ▶ PLAY NOW
                  </button>
                  <p className="text-[8px] tracking-[0.25em] text-[#4ade80]/25">WASD · SPACE TO SLASH</p>
                </div>
              </div>

              {/* Right — character sticker */}
              <div className="relative z-20 flex-shrink-0" style={{height:"88%",maxHeight:"340px"}}>
                {/* Glow disc under feet */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full"
                  style={{background:"radial-gradient(ellipse,rgba(74,222,128,0.35) 0%,transparent 70%)",filter:"blur(6px)"}}/>
                <img
                  src="/gameassets/image.png"
                  alt="Player character"
                  className="h-full w-auto object-contain drop-shadow-[0_0_28px_rgba(74,222,128,0.4)]"
                  style={{filter:"drop-shadow(0 0 18px rgba(74,222,128,0.35))"}}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dead */}
        {isDead&&(
          <div className="absolute inset-0 flex items-center justify-center bg-[#07100a]/88 backdrop-blur-sm">
            {/* Dim character in background */}
            <img src="/gameassets/image.png" alt=""
              className="pointer-events-none absolute bottom-0 right-4 h-3/4 w-auto object-contain opacity-15 grayscale"
              style={{filter:"grayscale(1) drop-shadow(0 0 12px rgba(248,113,113,0.2))"}}/>
            <div className="relative z-10 flex flex-col items-center gap-3">
              <p className="text-[9px] tracking-[0.35em] text-[#f87171]/70">YOU WERE OVERRUN</p>
              <p className="text-6xl font-black tabular-nums text-white leading-none">{score}</p>
              <p className="text-[10px] text-[#4ade80]/40 tracking-widest">points · wave {wave}</p>
              <button onClick={startGame}
                className="mt-3 rounded-full bg-[#4ade80] px-7 py-2.5 text-xs font-black tracking-[0.2em] text-[#07100a] shadow-[0_0_20px_rgba(74,222,128,0.4)] transition hover:bg-[#86efac] active:scale-95">
                ▶ TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-[#1c2e1c] px-4 py-2">
        <p className="text-[9px] tracking-[0.18em] text-[#4ade80]/30">
          {isPlaying?"WASD · SPACE or tap Slash":isDead?"Press Try Again":"Click Play to start"}
        </p>
        <button onClick={slash} disabled={!isPlaying}
          className="flex items-center gap-1.5 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/8 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#4ade80] transition hover:bg-[#4ade80]/15 disabled:cursor-not-allowed disabled:opacity-25">
          <Sword className="h-3 w-3"/>SLASH
        </button>
      </div>
    </div>
  );
}

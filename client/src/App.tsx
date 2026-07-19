import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { caseStudies } from "./data/caseStudies";
import Home from "./pages/Home";
import CaseStudyPage from "./pages/work/CaseStudyPage";

function StudyRoute({ index }: { index: number }) {
  const study = caseStudies[index];
  const nextStudy = caseStudies[(index + 1) % caseStudies.length];
  return <CaseStudyPage study={study} nextStudy={nextStudy} />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {caseStudies.map((study, index) => (
        <Route key={study.slug} path={`/work/${study.slug}`}>
          <StudyRoute index={index} />
        </Route>
      ))}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <SpeedInsights />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

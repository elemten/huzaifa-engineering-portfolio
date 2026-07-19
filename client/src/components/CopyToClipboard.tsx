import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type CopyToClipboardProps = {
  text: string;
  className?: string;
  children: React.ReactNode;
  onCopiedChange?: (copied: boolean) => void;
};

export function CopyToClipboard({
  text,
  className,
  children,
  onCopiedChange,
}: CopyToClipboardProps) {
  const [, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopiedChange?.(true);
      window.setTimeout(() => {
        setCopied(false);
        onCopiedChange?.(false);
      }, 2000);
    } catch {
      setCopied(false);
      onCopiedChange?.(false);
    }
  }, [text, onCopiedChange]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "text-left transition-all duration-200 ease-out hover:opacity-70 hover:underline active:scale-[0.98]",
        className
      )}
      title="Click to copy"
    >
      {children}
    </button>
  );
}

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const render = (tex: string, displayMode: boolean) =>
  katex.renderToString(tex, { displayMode, throwOnError: false, strict: "ignore" });

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");

/** Renders text containing $inline$ and $$display$$ LaTeX. */
const MathText = ({ text, className }: { text: string; className?: string }) => {
  const html = useMemo(() => {
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
    return parts
      .map((part) => {
        if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4)
          return `<div class="math-display">${render(part.slice(2, -2), true)}</div>`;
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) return render(part.slice(1, -1), false);
        return escapeHtml(part);
      })
      .join("");
  }, [text]);

  return <div className={cn("math-text leading-relaxed", className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MathText;

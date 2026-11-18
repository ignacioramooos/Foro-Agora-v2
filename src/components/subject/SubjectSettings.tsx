import { useState } from "react";
import { Check, Copy, Cpu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { getClassroomMcpUrl } from "@/content/subjects/registry";
import { useSubject } from "./SubjectContext";

const SubjectSettings = () => {
  const { subject, goal, setGoal, t } = useSubject();
  const [copied, setCopied] = useState(false);
  const mcpUrl = getClassroomMcpUrl(subject.slug);

  const copyMcp = () => {
    navigator.clipboard?.writeText(mcpUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.settings.ariaLabel}>
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.settings.title}</DialogTitle>
          <DialogDescription>{t.settings.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">{t.settings.dailyGoal}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.settings.goalHint}</p>
              </div>
              <span className="font-heading text-3xl font-bold text-foreground" aria-live="polite">{goal}</span>
            </div>
            <Slider
              min={1}
              max={30}
              step={1}
              value={[goal]}
              onValueChange={([value]) => setGoal(value)}
              aria-label={t.settings.dailyGoal}
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>1</span><span>30</span></div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                <Cpu className="h-4 w-4 text-primary" /> MCP Server
              </p>
              <Button type="button" variant="outline" size="sm" onClick={copyMcp}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <code className="mt-2 block break-all rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              {mcpUrl}
            </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectSettings;

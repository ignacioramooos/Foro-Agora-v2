import { Settings } from "lucide-react";
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
import { useSubject } from "./SubjectContext";

const SubjectSettings = () => {
  const { goal, setGoal, t } = useSubject();

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
        <div className="py-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default SubjectSettings;

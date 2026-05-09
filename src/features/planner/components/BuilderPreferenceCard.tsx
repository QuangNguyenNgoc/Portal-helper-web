import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function BuilderPreferenceCard({
  fewerStudyDays,
  setFewerStudyDays,
  closeGapClasses,
  setCloseGapClasses,
  friendMatch,
  setFriendMatch,
}: {
  fewerStudyDays: boolean;
  setFewerStudyDays: (value: boolean) => void;
  closeGapClasses: boolean;
  setCloseGapClasses: (value: boolean) => void;
  friendMatch: boolean;
  setFriendMatch: (value: boolean) => void;
}) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-900">
          Secondary scoring modifiers
        </CardTitle>
        <CardDescription>
          These toggles refine ranking after constraints narrow the search
          space. They do not replace the constraint grid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Fewer study days
            </div>
            <div className="text-sm text-slate-500">
              Compress the week when score tradeoff is acceptable
            </div>
          </div>
          <Switch
            checked={fewerStudyDays}
            onCheckedChange={setFewerStudyDays}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Close-gap classes
            </div>
            <div className="text-sm text-slate-500">
              Prefer back-to-back sessions over long idle windows
            </div>
          </div>
          <Switch
            checked={closeGapClasses}
            onCheckedChange={setCloseGapClasses}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Friend matching
            </div>
            <div className="text-sm text-slate-500">
              Increase overlap with classmates where possible
            </div>
          </div>
          <Switch checked={friendMatch} onCheckedChange={setFriendMatch} />
        </div>
      </CardContent>
    </Card>
  );
}

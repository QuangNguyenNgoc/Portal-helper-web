import { Button } from "@/components/ui/button";

interface LabToggleProps {
  showLabPeriods: boolean;
  onToggle: (show: boolean) => void;
}

export function LabToggle({ showLabPeriods, onToggle }: LabToggleProps) {
  return (
    <Button
      variant={showLabPeriods ? "default" : "outline"}
      onClick={() => onToggle(!showLabPeriods)}
      className={`rounded-full ${showLabPeriods ? "bg-blue-600 hover:bg-blue-500" : "bg-white"}`}
    >
      Hiển thị ca Thực hành (Tiết 2.5 & 8.5)
    </Button>
  );
}

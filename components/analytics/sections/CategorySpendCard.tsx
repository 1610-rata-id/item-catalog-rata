import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CategorySpendCard() {
  return (
    <Card className="h-[380px]">
      <CardHeader>
        <CardTitle>Spend by Category</CardTitle>
      </CardHeader>

      <CardContent className="flex h-[280px] items-center justify-center rounded-lg border-2 border-dashed">
        Pie Chart Area
      </CardContent>
    </Card>
  );
}
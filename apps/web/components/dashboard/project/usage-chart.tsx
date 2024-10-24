import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Id } from "@/convex/_generated/dataModel";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Times Pulled",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function UsageChart({
  projectId,
  projectName,
}: {
  projectId: Id<"projects">;
  projectName: string;
}) {
  const chartData = useQuery(api.projects.getProjectAnalytics, {projectId, projectName});
  console.log(chartData);
  const processedChartData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    // Define the type for the accumulator in the reduce function
    type DateAggregate = {
      [key: string]: {
        date: string;
        views: number;
      };
    };

    // Aggregate data by date
    const dateAggregates = chartData.reduce((acc: DateAggregate, entry) => {
      const dateKey = new Date(entry.updatedAt).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          views: 0,
        };
      }
      acc[dateKey].views += entry.howManyTimes || 0;
      return acc;
    }, {});

    // Convert the aggregates object to an array and sort by date
    return Object.values(dateAggregates).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData]);

  if (!chartData) {
    return null;  
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Project Activity</CardTitle>
          <CardDescription>
            Showing total activity for: <span className="text-muted-foreground font-bold">{projectName.toLowerCase()}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={processedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}  
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar dataKey="views" fill={`hsl(var(--chart-2))`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
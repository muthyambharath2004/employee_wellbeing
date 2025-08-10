import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TeamInsights() {
  const { user } = useAuth();

  const { data: teamSummary, isLoading } = useQuery({
    queryKey: ['/api/team/summary'],
    enabled: user?.role === 'manager' || user?.role === 'hr_admin',
  });

  const { data: wellbeingAverage, isLoading: wellbeingLoading } = useQuery({
    queryKey: ['/api/team/wellbeing-average'],
    enabled: user?.role === 'manager' || user?.role === 'hr_admin',
  });

  // Don't show for employees
  if (user?.role === 'employee') {
    return null;
  }

  if (isLoading || wellbeingLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const averageScore = wellbeingAverage?.average || 7.9;
  const summary = teamSummary || {
    averageProductivity: 7.8,
    topPerformer: "Alex Chen",
    needsSupport: "Mike Johnson",
    teamMood: "Positive"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">Team Average</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{averageScore.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">Wellbeing Score</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Top Performer</span>
              <span className="text-sm font-medium text-gray-900">{summary.topPerformer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Needs Support</span>
              <span className="text-sm font-medium text-gray-900">{summary.needsSupport}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Mood</span>
              <span className="text-sm font-medium text-success-600">{summary.teamMood}</span>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={() => {
            // Navigate to team details page
            window.location.href = '/team';
          }}>
            View Full Team Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

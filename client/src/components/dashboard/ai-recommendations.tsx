import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Zap, Heart, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { isUnauthorizedError } from "@/lib/authUtils";

export function AIRecommendations() {
  const { toast } = useToast();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations'],
  });

  const markAsActionedMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('PATCH', `/api/recommendations/${id}/action`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      toast({
        title: "Success",
        description: "Recommendation marked as completed",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update recommendation",
        variant: "destructive",
      });
    },
  });

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'break':
        return Zap;
      case 'mindfulness':
        return Heart;
      case 'workload':
      case 'meeting':
        return AlertTriangle;
      default:
        return Zap;
    }
  };

  const getRecommendationColors = (type: string) => {
    switch (type) {
      case 'break':
        return {
          bg: 'bg-primary-50 border-primary-200',
          iconBg: 'bg-primary-500',
          iconColor: 'text-white',
          buttonColor: 'text-primary-600 hover:text-primary-700'
        };
      case 'mindfulness':
        return {
          bg: 'bg-success-50 border-success-200',
          iconBg: 'bg-success-500',
          iconColor: 'text-white',
          buttonColor: 'text-success-600 hover:text-success-700'
        };
      case 'workload':
      case 'meeting':
        return {
          bg: 'bg-warning-50 border-warning-200',
          iconBg: 'bg-warning-500',
          iconColor: 'text-white',
          buttonColor: 'text-warning-600 hover:text-warning-700'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          iconBg: 'bg-gray-500',
          iconColor: 'text-white',
          buttonColor: 'text-gray-600 hover:text-gray-700'
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show default recommendations if none exist
  const displayRecommendations = recommendations && recommendations.length > 0 
    ? recommendations 
    : [
        {
          id: 'default-1',
          type: 'break',
          title: 'Take a 15-minute break',
          description: 'You\'ve been in focus mode for 2.5 hours. A short break can help maintain productivity.',
          priority: 'medium'
        },
        {
          id: 'default-2',
          type: 'mindfulness',
          title: 'Schedule mindfulness session',
          description: 'Based on your stress patterns, a 10-minute mindfulness break could help.',
          priority: 'medium'
        },
        {
          id: 'default-3',
          type: 'meeting',
          title: 'Meeting overload detected',
          description: 'You have 6 meetings scheduled today. Consider rescheduling non-critical ones.',
          priority: 'high'
        }
      ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>AI-Powered Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayRecommendations.map((recommendation: any) => {
            const Icon = getRecommendationIcon(recommendation.type);
            const colors = getRecommendationColors(recommendation.type);
            
            return (
              <div
                key={recommendation.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${colors.bg}`}
              >
                <div className={`w-8 h-8 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className={`mt-2 h-auto p-0 ${colors.buttonColor} font-medium`}
                    onClick={() => {
                      if (recommendation.id.startsWith('default-')) {
                        toast({
                          title: "Demo Mode",
                          description: "This is a sample recommendation. Real recommendations will be actionable.",
                        });
                      } else {
                        markAsActionedMutation.mutate(recommendation.id);
                      }
                    }}
                    disabled={markAsActionedMutation.isPending}
                  >
                    {recommendation.type === 'break' && 'Start break timer'}
                    {recommendation.type === 'mindfulness' && 'Book session'}
                    {recommendation.type === 'meeting' && 'Review calendar'}
                    {recommendation.type === 'workload' && 'Adjust workload'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

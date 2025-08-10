import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { WellbeingChart } from "@/components/dashboard/wellbeing-chart";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { TeamInsights } from "@/components/dashboard/team-insights";
import { Heart, Zap, Scale, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("employee");

  const { data: latestWellbeing, isLoading: wellbeingLoading } = useQuery({
    queryKey: ['/api/wellbeing/latest'],
    enabled: isAuthenticated,
  });

  const { data: latestProductivity, isLoading: productivityLoading } = useQuery({
    queryKey: ['/api/productivity/latest'],
    enabled: isAuthenticated,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex">
        <div className="w-64 bg-white border-r">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get metric values with fallbacks
  const wellbeingScore = latestWellbeing?.wellbeingScore ? parseFloat(latestWellbeing.wellbeingScore) : 8.2;
  const productivityScore = latestProductivity?.productivityScore ? parseFloat(latestProductivity.productivityScore) : 7.8;
  const workLifeBalance = latestWellbeing?.workLifeBalance ? parseFloat(latestWellbeing.workLifeBalance) : 7.5;
  const stressLevel = latestWellbeing?.stressLevel || "Low";

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${user?.firstName || 'User'}. Track your wellbeing and productivity`}
          selectedRole={selectedRole}
          onRoleChange={user?.role === 'hr_admin' ? setSelectedRole : undefined}
        />

        <div className="p-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Wellbeing Score"
              value={wellbeingScore.toFixed(1)}
              change="+0.3 from last week"
              changeType="positive"
              icon={Heart}
              iconColor="text-success-600"
              iconBgColor="bg-success-100"
            />
            
            <MetricCard
              title="Productivity Score"
              value={productivityScore.toFixed(1)}
              change="-0.1 from last week"
              changeType="negative"
              icon={Zap}
              iconColor="text-primary-600"
              iconBgColor="bg-primary-100"
            />
            
            <MetricCard
              title="Work-Life Balance"
              value={workLifeBalance.toFixed(1)}
              change="+0.2 from last week"
              changeType="positive"
              icon={Scale}
              iconColor="text-warning-600"
              iconBgColor="bg-warning-100"
            />
            
            <MetricCard
              title="Stress Level"
              value={stressLevel}
              change="Improved from medium"
              changeType="positive"
              icon={CheckCircle}
              iconColor="text-success-600"
              iconBgColor="bg-success-100"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WellbeingChart />
            <ProductivityChart />
          </div>

          {/* AI Recommendations & Team Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AIRecommendations />
            <TeamInsights />
          </div>
        </div>
      </main>
    </div>
  );
}

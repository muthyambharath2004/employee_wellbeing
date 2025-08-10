import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Heart, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">WellnessHub</span>
          </div>
          <Button onClick={() => window.location.href = '/api/login'} className="bg-primary-500 hover:bg-primary-600">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Employee Wellbeing &<br />
            <span className="text-primary-500">Productivity Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor and improve employee mental health, work habits, and engagement with AI-powered insights and personalized recommendations.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary-500 hover:bg-primary-600 text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-success-600" />
              </div>
              <CardTitle className="text-lg">Wellbeing Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor employee mental health and work-life balance with comprehensive wellbeing metrics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle className="text-lg">Productivity Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track productivity patterns, focus hours, and task completion with detailed analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-warning-600" />
              </div>
              <CardTitle className="text-lg">Team Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get team-level analytics and insights for managers and HR administrators.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receive personalized AI-powered recommendations for improved wellbeing and productivity.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose WellnessHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Make informed decisions with comprehensive analytics and AI-powered insights into employee wellbeing and productivity patterns.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-600">
                Tailored dashboards for employees, managers, and HR administrators with appropriate access levels and insights.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise Ready</h3>
              <p className="text-gray-600">
                Secure, scalable, and compliant with enterprise security standards including GDPR and data privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">WellnessHub</span>
          </div>
          <p className="text-gray-600">
            Empowering organizations to create healthier, more productive workplaces.
          </p>
        </div>
      </footer>
    </div>
  );
}

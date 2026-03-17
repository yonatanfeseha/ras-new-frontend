import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, BarChart3, CreditCard, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const quickStats = [
  {
    label: "Total Members",
    value: "156",
    icon: Users,
    change: "+12 this month",
  },
  {
    label: "Active Payments",
    value: "120",
    icon: CreditCard,
    change: "77% paid",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at Ras Hailu Gym today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="stat-card-gradient">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-heading font-bold mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-primary mt-2">{stat.change}</p>
                </div>

                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Add Member */}
        <Link to="/add-member">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold">Add Member</p>
                <p className="text-sm text-muted-foreground">
                  Register a new member
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* View Members */}
        <Link to="/members">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold">View Members</p>
                <p className="text-sm text-muted-foreground">
                  Manage all members
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Statistics */}
        <Link to="/statistics">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold">Statistics</p>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Coaches ✅ NEW */}
        <Link to="/coaches">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold">Manage Coaches</p>
                <p className="text-sm text-muted-foreground">
                  Add and manage coaches
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CreditCard,
  AlertTriangle,
  UserCheck,
  Dumbbell,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    paid: 0,
    unpaid: 0,
    warning: 0,
    trainingType: [],
    schedule: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats");
        const data = await res.json();

        if (data.success) {
          setStats(data);
        } else {
          console.error("Failed to fetch stats:", data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading statistics...</p>;

  const membershipStats = [
    {
      label: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Paid Members",
      value: stats.paid,
      icon: CreditCard,
      color: "text-success",
    },
    {
      label: "Unpaid Members",
      value: stats.unpaid,
      icon: UserCheck,
      color: "text-destructive",
    },
    {
      label: "Warning Members",
      value: stats.warning,
      icon: AlertTriangle,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Statistics</h1>
        <p className="text-muted-foreground mt-1">
          Overview of membership and training data
        </p>
      </div>

      {/* Membership Stats */}
      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Membership Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {membershipStats.map((stat) => (
            <Card key={stat.label} className="stat-card-gradient">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-heading font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl bg-background flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Training Type */}
      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Training Type Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.trainingType.map((item) => (
            <Card key={item.type}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-2xl font-heading font-bold">
                    {item.count}
                  </span>
                </div>
                <Progress
                  value={(item.count / stats.totalMembers) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((item.count / stats.totalMembers) * 100)}% of
                  total members
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Schedule Stats */}
      <section className="space-y-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Training Schedule Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.schedule.map((item) => (
            <Card key={item.schedule}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">{item.schedule}</p>
                <p className="text-3xl font-heading font-bold mt-2">
                  {item.count}
                </p>
                <p className="text-xs text-muted-foreground mt-1">members</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Statistics;

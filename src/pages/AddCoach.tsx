import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Coach = {
  id: number;
  name: string;
  phone: string;
  training_type: string;
  schedule: string;
  gender: string;
};

const Coaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [showForm, setShowForm] = useState(false);

  // fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("http://localhost:5000/coaches");
        const data = await res.json();

        if (data.success) {
          setCoaches(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoaches();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coaches</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add Coach"}
        </Button>
      </div>

      {/* Toggle Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <p>👉 You can reuse your form here later</p>
          </CardContent>
        </Card>
      )}

      {/* Coaches Table */}
      <Card>
        <CardContent className="pt-6">
          <table className="w-full border">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Training Type</th>
                <th className="p-2">Schedule</th>
                <th className="p-2">Gender</th>
              </tr>
            </thead>

            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id} className="border-b">
                  <td className="p-2">
                    <Link
                      to={`/coaches/${coach.id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {coach.name}
                    </Link>
                  </td>
                  <td className="p-2">{coach.training_type}</td>
                  <td className="p-2">{coach.schedule}</td>
                  <td className="p-2">{coach.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {coaches.length === 0 && (
            <p className="text-center mt-4 text-muted-foreground">
              No coaches found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Coaches;

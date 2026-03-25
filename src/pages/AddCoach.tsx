import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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

type CoachForm = {
  name: string;
  gender: string;
  b_date: string;
  phone: string;
  url: string;
  trainingTypes: number[];
  schedules: number[];
};

const Coaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CoachForm>({
    name: "",
    gender: "",
    b_date: "",
    phone: "",
    url: "",
    trainingTypes: [],
    schedules: [],
  });

  // fetch coaches
  const fetchCoaches = async () => {
    try {
      const res = await fetch("http://localhost:5000/coaches");
      const data = await res.json();
      if (data.success) setCoaches(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // form handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    if (name === "trainingTypes" || name === "schedules") {
      const id = parseInt(value);
      const arr = form[name as "trainingTypes" | "schedules"];
      if (checked) {
        setForm({ ...form, [name]: [...arr, id] });
      } else {
        setForm({ ...form, [name]: arr.filter((x) => x !== id) });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Coach added successfully!");
        setForm({
          name: "",
          gender: "",
          b_date: "",
          phone: "",
          url: "",
          trainingTypes: [],
          schedules: [],
        });
        setShowForm(false);
        fetchCoaches();
      } else alert("Failed: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Error adding coach");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coach?")) return;
    try {
      const res = await fetch(`http://localhost:5000/coaches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Coach deleted!");
        fetchCoaches();
      } else alert("Failed: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Error deleting coach");
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="b_date"
                value={form.b_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="url"
                placeholder="Image URL"
                value={form.url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <fieldset className="space-y-2">
                <legend>Training Types</legend>
                {[1, 2, 3].map((id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      name="trainingTypes"
                      value={id}
                      checked={form.trainingTypes.includes(id)}
                      onChange={handleChange}
                    />{" "}
                    {id === 1 ? "Aerobics" : id === 2 ? "Machine" : "Both"}
                  </label>
                ))}
              </fieldset>

              <fieldset className="space-y-2">
                <legend>Schedules</legend>
                {[1, 2, 3, 4].map((id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      name="schedules"
                      value={id}
                      checked={form.schedules.includes(id)}
                      onChange={handleChange}
                    />{" "}
                    {id === 1
                      ? "MWF: Morning"
                      : id === 2
                        ? "MWF: Evening"
                        : id === 3
                          ? "TTS: Morning"
                          : "TTS: Evening"}
                  </label>
                ))}
              </fieldset>

              <Button type="submit" className="w-full">
                Save Coach
              </Button>
            </form>
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
                <th className="p-2">Actions</th>
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
                  <td className="p-2">
                    <Button
                      onClick={() => handleDelete(coach.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
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

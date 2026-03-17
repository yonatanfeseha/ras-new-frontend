import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CoachForm = {
  name: string;
  phone: string;
  type: string;
  schedule: string;
  image: string | null;
};

type Coach = CoachForm & {
  id: number;
};

const AddCoach = () => {
  const [form, setForm] = useState<CoachForm>({
    name: "",
    phone: "",
    type: "",
    schedule: "",
    image: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const existing: Coach[] = JSON.parse(
      localStorage.getItem("coaches") || "[]",
    );

    const newCoach: Coach = {
      ...form,
      id: Date.now(),
    };

    localStorage.setItem("coaches", JSON.stringify([...existing, newCoach]));

    alert("Coach added successfully!");

    setForm({
      name: "",
      phone: "",
      type: "",
      schedule: "",
      image: null,
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-xl font-bold mb-4">Add Coach</h1>

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

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Training Type</option>
              <option value="Aerobics">Aerobics</option>
              <option value="Machine">Machine</option>
            </select>

            <input
              type="text"
              name="schedule"
              placeholder="Training Schedule"
              value={form.schedule}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            {/* Image Upload / Camera */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="w-full"
            />

            <Button type="submit" className="w-full">
              Save Coach
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCoach;

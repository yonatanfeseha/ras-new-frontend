import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CoachDetails = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState<any>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      const res = await fetch(`http://localhost:5000/coaches/${id}`);
      const data = await res.json();

      if (data.success) {
        setCoach(data.data);
      }
    };

    fetchCoach();
  }, [id]);

  if (!coach) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{coach.name}</h1>

      <img src={coach.url} alt="coach" className="w-40 rounded" />

      <p>
        <strong>Phone:</strong> {coach.phone}
      </p>
      <p>
        <strong>Training Type:</strong> {coach.training_type}
      </p>
      <p>
        <strong>Schedule:</strong> {coach.schedule}
      </p>
    </div>
  );
};

export default CoachDetails;

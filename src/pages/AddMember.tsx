import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, Camera, Upload } from "lucide-react";
import { toast } from "sonner";

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/<your_cloud_name>/upload";
const CLOUDINARY_UPLOAD_PRESET = "<your_upload_preset>";

const AddMember = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    trainingType: "aerobics",
    trainingSchedule: "mwf-morning",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // Handle form text
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // Handle image selection
  const handleImage = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload image to Cloudinary
      const cloudData = new FormData();
      cloudData.append("file", imageFile);
      cloudData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: cloudData,
      });

      if (!cloudRes.ok) throw new Error("Image upload failed");

      const cloudJson = await cloudRes.json();
      const imageUrl = cloudJson.secure_url;

      // 2️⃣ Send member data to your backend
      const res = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you have JWT auth:
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          trainingType: formData.trainingType,
          trainingSchedule: formData.trainingSchedule,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to save member");

      toast.success("Member registered successfully!");

      // Reset form
      setFormData({
        fullName: "",
        trainingType: "aerobics",
        trainingSchedule: "mwf-morning",
      });
      setImageFile(null);
      setPreview("");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Register New Member</h1>
        <p className="text-muted-foreground mt-1">
          Add a new member to Ras Hailu Gym
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed">
                {preview ? (
                  <img
                    src={preview}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImage(file);
                }}
                className="hidden"
                id="upload"
              />

              <label htmlFor="upload">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" /> Upload
                </Button>
              </label>
            </div>

            {/* Full Name */}
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
              />
            </div>

            {/* Training Type */}
            <div>
              <Label>Training Type</Label>
              <RadioGroup
                value={formData.trainingType}
                onValueChange={(val) => handleChange("trainingType", val)}
                className="flex gap-4"
              >
                {["aerobics", "machine", "both"].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="capitalize cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Training Schedule */}
            <div>
              <Label>Training Schedule</Label>
              <RadioGroup
                value={formData.trainingSchedule}
                onValueChange={(val) => handleChange("trainingSchedule", val)}
                className="grid grid-cols-2 gap-3"
              >
                {["mwf-morning", "mwf-night", "tts-morning", "tts-night"].map(
                  (s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 p-3 border rounded"
                    >
                      <RadioGroupItem value={s} id={s} />
                      <Label htmlFor={s} className="cursor-pointer">
                        {s}
                      </Label>
                    </div>
                  ),
                )}
              </RadioGroup>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Register Member"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;

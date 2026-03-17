import { useState, useRef } from "react";
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

const schedules = [
  { value: "mwf-morning", label: "MWF Morning" },
  { value: "mwf-night", label: "MWF Night" },
  { value: "tts-morning", label: "TTS Morning" },
  { value: "tts-night", label: "TTS Night" },
];

const AddMember = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    trainingType: "aerobics",
    trainingSchedules: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Camera refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Handle text
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // Handle image
  const handleImage = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Toggle schedules
  const toggleSchedule = (value: string) => {
    setFormData((prev) => {
      const exists = prev.trainingSchedules.includes(value);

      return {
        ...prev,
        trainingSchedules: exists
          ? prev.trainingSchedules.filter((s) => s !== value)
          : [...prev.trainingSchedules, value],
      };
    });
  };

  // Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Camera access denied");
    }
  };

  // Take photo
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "camera.jpg", {
        type: "image/jpeg",
      });

      handleImage(file);
    });

    // Stop camera
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());

    setCameraOpen(false);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    if (formData.trainingSchedules.length === 0) {
      toast.error("Select at least one schedule");
      return;
    }

    try {
      setLoading(true);

      // Upload to Cloudinary
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

      // Send to backend
      const res = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}` // if JWT
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          trainingType: formData.trainingType,
          trainingSchedules: formData.trainingSchedules,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Member registered successfully!");

      // Reset
      setFormData({
        fullName: "",
        trainingType: "aerobics",
        trainingSchedules: [],
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
        <h1 className="text-2xl font-bold">Register New Member</h1>
        <p className="text-muted-foreground mt-1">
          Add a new member to Ras Hailu Gym
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* IMAGE */}
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border overflow-hidden">
                {preview ? (
                  <img src={preview} className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={openCamera}>
                  <Camera className="h-4 w-4 mr-1" />
                  Camera
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImage(file);
                }}
              />

              {/* CAMERA VIEW */}
              {cameraOpen && (
                <div className="flex flex-col items-center gap-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-64 h-48 rounded border"
                  />

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex gap-2">
                    <Button onClick={takePhoto}>Capture</Button>
                    <Button
                      variant="destructive"
                      onClick={() => setCameraOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* NAME */}
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
              />
            </div>

            {/* TRAINING TYPE */}
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
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* MULTIPLE SCHEDULE */}
            <div>
              <Label>Training Schedule</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {schedules.map((s) => (
                  <label
                    key={s.value}
                    className={`flex items-center gap-2 p-3 border rounded cursor-pointer ${
                      formData.trainingSchedules.includes(s.value)
                        ? "bg-primary/10 border-primary"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.trainingSchedules.includes(s.value)}
                      onChange={() => toggleSchedule(s.value)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <Button type="submit" disabled={loading} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? "Registering..." : "Register Member"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;

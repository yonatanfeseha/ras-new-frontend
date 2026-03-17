import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Pencil,
  Phone,
  User,
  Dumbbell,
  Clock,
  CreditCard,
  QrCode,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

// Sample data — in production this comes from your DB
const membersData: Record<string, {
  memberId: string;
  name: string;
  fatherName: string;
  trainingType: string;
  schedule: string;
  paymentStatus: "paid" | "unpaid" | "warning";
  lastPayment: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  imageUrl: string;
}> = {
  "RHG-001": {
    memberId: "RHG-001",
    name: "Abebe Kebede",
    fatherName: "Kebede Alemu",
    trainingType: "Aerobics",
    schedule: "MWF: Morning",
    paymentStatus: "paid",
    lastPayment: "2024-03-01",
    phone: "+251 911 234 567",
    emergencyContact: "Alemu Kebede",
    emergencyPhone: "+251 922 345 678",
    imageUrl: "",
  },
  "RHG-002": {
    memberId: "RHG-002",
    name: "Dawit Tadesse",
    fatherName: "Tadesse Hailu",
    trainingType: "Machine",
    schedule: "TTS: Night",
    paymentStatus: "unpaid",
    lastPayment: "2024-01-15",
    phone: "+251 912 345 678",
    emergencyContact: "Hailu Tadesse",
    emergencyPhone: "+251 923 456 789",
    imageUrl: "",
  },
  "RHG-003": {
    memberId: "RHG-003",
    name: "Meron Assefa",
    fatherName: "Assefa Gebre",
    trainingType: "Both",
    schedule: "MWF: Night",
    paymentStatus: "warning",
    lastPayment: "2024-02-10",
    phone: "+251 913 456 789",
    emergencyContact: "Gebre Assefa",
    emergencyPhone: "+251 924 567 890",
    imageUrl: "",
  },
  "RHG-004": {
    memberId: "RHG-004",
    name: "Sara Bekele",
    fatherName: "Bekele Desta",
    trainingType: "Aerobics",
    schedule: "TTS: Morning",
    paymentStatus: "paid",
    lastPayment: "2024-03-05",
    phone: "+251 914 567 890",
    emergencyContact: "Desta Bekele",
    emergencyPhone: "+251 925 678 901",
    imageUrl: "",
  },
  "RHG-005": {
    memberId: "RHG-005",
    name: "Yonas Getachew",
    fatherName: "Getachew Mekonnen",
    trainingType: "Machine",
    schedule: "MWF: Morning",
    paymentStatus: "paid",
    lastPayment: "2024-03-08",
    phone: "+251 915 678 901",
    emergencyContact: "Mekonnen Getachew",
    emergencyPhone: "+251 926 789 012",
    imageUrl: "",
  },
};

const statusConfig = {
  paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  unpaid: { label: "Unpaid", className: "bg-destructive/10 text-destructive border-destructive/20" },
  warning: { label: "Warning", className: "bg-warning/10 text-warning border-warning/20" },
};

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const member = id ? membersData[id] : null;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(member);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-heading font-bold">Member Not Found</h2>
        <p className="text-muted-foreground">No member exists with ID "{id}"</p>
        <Link to="/members">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Members
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[member.paymentStatus];

  const handleSave = () => {
    toast.success("Member updated successfully!");
    setIsEditing(false);
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/members">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold">Member Profile</h1>
          <p className="text-muted-foreground text-sm">View and manage member details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("ID card download coming soon!")}>
            <Download className="h-4 w-4 mr-2" /> Download ID
          </Button>
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ID Card Style Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <p className="text-xs font-medium opacity-80 tracking-wider uppercase">Ras Hailu Sport Education And Training Center</p>
        </div>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-6 -mt-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="h-28 w-28 rounded-xl border-4 border-card bg-muted flex items-center justify-center shadow-lg overflow-hidden">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Name & ID */}
            <div className="flex-1 pt-10 sm:pt-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-heading font-bold">{member.name}</h2>
                  <p className="text-muted-foreground text-sm">Son/Daughter of {member.fatherName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm bg-muted px-3 py-1.5 rounded-lg font-semibold">
                    ID: {member.memberId}
                  </span>
                  <Badge variant="outline" className={`${status.className} border`}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Training Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Training Information</h3>
              <Separator className="mb-1" />
              <InfoRow icon={Dumbbell} label="Training Type" value={member.trainingType} />
              <InfoRow icon={Clock} label="Training Schedule" value={member.schedule} />
              <InfoRow icon={CreditCard} label="Payment Status" value={status.label} />
              <InfoRow icon={CreditCard} label="Last Payment Date" value={member.lastPayment} />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Contact Information</h3>
              <Separator className="mb-1" />
              <InfoRow icon={Phone} label="Phone Number" value={member.phone} />
              <InfoRow icon={User} label="Emergency Contact" value={member.emergencyContact} />
              <InfoRow icon={Phone} label="Emergency Phone" value={member.emergencyPhone} />

              {/* QR Code placeholder */}
              <div className="mt-4 pt-4 border-t flex flex-col items-center gap-2">
                <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Member QR Code</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Edit Form */
        <Card>
          <CardContent className="pt-6 space-y-5">
            <h3 className="font-heading font-semibold">Edit Member</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editData?.name ?? ""} onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : prev)} />
              </div>
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input value={editData?.fatherName ?? ""} onChange={(e) => setEditData(prev => prev ? { ...prev, fatherName: e.target.value } : prev)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editData?.phone ?? ""} onChange={(e) => setEditData(prev => prev ? { ...prev, phone: e.target.value } : prev)} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <Input value={editData?.emergencyContact ?? ""} onChange={(e) => setEditData(prev => prev ? { ...prev, emergencyContact: e.target.value } : prev)} />
              </div>
              <div className="space-y-2">
                <Label>Emergency Phone</Label>
                <Input value={editData?.emergencyPhone ?? ""} onChange={(e) => setEditData(prev => prev ? { ...prev, emergencyPhone: e.target.value } : prev)} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Training Type</Label>
              <RadioGroup value={editData?.trainingType.toLowerCase() ?? "aerobics"} onValueChange={(val) => setEditData(prev => prev ? { ...prev, trainingType: val.charAt(0).toUpperCase() + val.slice(1) } : prev)} className="flex gap-4">
                {["aerobics", "machine", "both"].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <RadioGroupItem value={type} id={`edit-${type}`} />
                    <Label htmlFor={`edit-${type}`} className="capitalize cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Training Schedule</Label>
              <RadioGroup value={editData?.schedule ?? ""} onValueChange={(val) => setEditData(prev => prev ? { ...prev, schedule: val } : prev)} className="grid grid-cols-2 gap-3">
                {["MWF: Morning", "MWF: Night", "TTS: Morning", "TTS: Night"].map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value={s} id={`edit-${s}`} />
                    <Label htmlFor={`edit-${s}`} className="cursor-pointer">{s}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberProfile;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, Trash2, ToggleLeft } from "lucide-react";

type Member = {
  id: string;
  memberId: string;
  name: string;
  fatherName: string;
  trainingType: string;
  schedule: string;
  paymentStatus: "paid" | "unpaid" | "warning";
  lastPayment: string;
};

const sampleMembers: Member[] = [
  { id: "1", memberId: "RHG-001", name: "Abebe Kebede", fatherName: "Kebede Alemu", trainingType: "Aerobics", schedule: "MWF: Morning", paymentStatus: "paid", lastPayment: "2024-03-01" },
  { id: "2", memberId: "RHG-002", name: "Dawit Tadesse", fatherName: "Tadesse Hailu", trainingType: "Machine", schedule: "TTS: Night", paymentStatus: "unpaid", lastPayment: "2024-01-15" },
  { id: "3", memberId: "RHG-003", name: "Meron Assefa", fatherName: "Assefa Gebre", trainingType: "Both", schedule: "MWF: Night", paymentStatus: "warning", lastPayment: "2024-02-10" },
  { id: "4", memberId: "RHG-004", name: "Sara Bekele", fatherName: "Bekele Desta", trainingType: "Aerobics", schedule: "TTS: Morning", paymentStatus: "paid", lastPayment: "2024-03-05" },
  { id: "5", memberId: "RHG-005", name: "Yonas Getachew", fatherName: "Getachew Mekonnen", trainingType: "Machine", schedule: "MWF: Morning", paymentStatus: "paid", lastPayment: "2024-03-08" },
];

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success hover:bg-success/20",
  unpaid: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
};

const Members = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = sampleMembers.filter((m) => {
    const matchSearch = !search || m.memberId.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase());
    const matchPayment = paymentFilter === "all" || m.paymentStatus === paymentFilter;
    const matchType = typeFilter === "all" || m.trainingType.toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchPayment && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Members</h1>
          <p className="text-muted-foreground mt-1">{sampleMembers.length} registered members</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="aerobics">Aerobics</SelectItem>
                <SelectItem value="machine">Machine</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Father Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-sm">
                    <Link to={`/members/${member.memberId}`} className="text-primary hover:underline font-semibold cursor-pointer">
                      {member.memberId}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{member.fatherName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{member.trainingType}</TableCell>
                  <TableCell className="hidden lg:table-cell">{member.schedule}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusStyles[member.paymentStatus]}>
                      {member.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{member.lastPayment}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ToggleLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;

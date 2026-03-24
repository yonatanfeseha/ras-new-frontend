import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, Download, Trash2, ToggleLeft } from "lucide-react";

type Member = {
  id: number;
  memberId: string; // mapped from ras_id
  name: string;
  fatherName?: string; // optional if backend doesn't provide
  trainingType?: string;
  schedule?: string;
  paymentStatus: "paid" | "unpaid" | "warning";
  lastPayment?: string;
  phone: string;
};

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success hover:bg-success/20",
  unpaid: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
};

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(
        `http://localhost:5000/members?${params.toString()}`,
      );
      const data = await res.json();

      if (data.success) {
        // Map backend format to frontend format
        const mapped: Member[] = data.data.map((m: any) => ({
          id: m.id,
          memberId: m.ras_id,
          name: m.name,
          phone: m.phone,
          paymentStatus:
            m.payment_status === 0
              ? "unpaid"
              : m.payment_status === 1
                ? "paid"
                : "warning",
          fatherName: "", // optional
          trainingType: "Unknown", // optional
          schedule: "Unknown", // optional
          lastPayment: "", // optional
        }));

        setMembers(mapped);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page]);

  // Filtered members based on search & payment
  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      m.memberId.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());
    const matchPayment =
      paymentFilter === "all" || m.paymentStatus === paymentFilter;
    return matchSearch && matchPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Members</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} members shown
          </p>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Link
                      to={`/members/${member.memberId}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      {member.memberId}
                    </Link>
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusStyles[member.paymentStatus]}
                    >
                      {member.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ToggleLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="px-2 py-1 border rounded">
          {page} / {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Members;

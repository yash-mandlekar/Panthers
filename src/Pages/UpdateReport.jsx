import { useEffect, useState } from "react";
import { axiosI } from "../hooks/useAxios";
// Your configured axios instance
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

export default function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const { data } = await axiosI.get("/api/community");
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    if (user.role != "admin") {
      window.location.href = "/";
    }
    fetchReports();
  }, []);

  const paginated = reports.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await axiosI.patch(`/api/community/${selectedReport._id}`, { status });
      fetchReports();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
      setSelectedReport(null);
    }
  };

  const getBadge = (status) => {
    if (status === "pending") return "secondary";
    if (status === "validated") return "outline";
    return "destructive";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Community Reports</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((report) => (
            <TableRow key={report._id}>
              <TableCell>{report.url}</TableCell>
              <TableCell>{report.isPhishing ? "Phishing" : "Safe"}</TableCell>
              <TableCell>{report.reason || "N/A"}</TableCell>
              <TableCell>{report.userId?.email}</TableCell>
              <TableCell>
                <Badge variant={getBadge(report.status)}>{report.status}</Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedReport(report);
                        setStatus(report.status);
                      }}
                    >
                      Change Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="validated">Validated</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {loading?<Button>Please wait</Button>:<Button onClick={handleStatusUpdate}>Save</Button>}
                      
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

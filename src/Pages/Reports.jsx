// components/ReportsPage.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { axiosI } from "../hooks/useAxios";

// Fake reports data for demo
const reports = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  url: `http://malicious${i + 1}.com`,
  status: i % 3 === 0 ? "Malicious" : i % 3 === 1 ? "Suspicious" : "Safe",
  reportedBy: `user${i + 1}@example.com`,
  date: `2025-05-${(i % 30) + 1}`,
}));

const ITEMS_PER_PAGE = 10;

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [reports, setreports] = useState([]);
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const getBadgeVariant = (status) => {
    // enum: ["pending", "reviewed", "flagged", "rejected"],
    if (status === "rejected") return "destructive";
    if (status === "pending") return "secondary";
    if (status === "reviewed") return "default";
    if (status === "flagged") return "warning";
    return "default";
  };
  const getBadgeSpamVariant = (result) => {
    if (result === "Malicious") return "destructive";
    if (result === "Suspicious") return "secondary";
    return "default";
  };
  const getReportStatus = async () => {
    try {
      const { data } = await axiosI.get("/api/community");
      console.log(data);

      setreports(data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  useEffect(() => {
    getReportStatus();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Phishing Reports</h1>
        <Link to="/add-report">
          <Button>+ Submit Report</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report, i) => (
                <TableRow key={i}>
                  <TableCell>{report.url}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getBadgeSpamVariant(
                        report.isPhishing ? "Malicious" : "Safe"
                      )}
                    >
                      {report.isPhishing ? "Malicious" : "Safe"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.userId.email}</TableCell>
                  <TableCell>{report.createdAt.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

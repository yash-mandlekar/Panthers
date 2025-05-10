// components/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { axiosI } from "../hooks/useAxios";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axiosI.get("/api/user/history");

      setData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };
  const fetchStats = async () => {
    try {
      const res = await axiosI.get("/api/user/stats");
      console.log(res.data);

      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      {loadingHistory ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Scanned URLs", value: stats.scannedUrls || "..." },
            { title: "Threats Detected", value: stats.threatsDetected || "..." },
            { title: "Safe URLs", value: stats.safeUrls || "..." },
            { title: "Community Reports", value: stats.communityReports || "..." },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scanned On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.decryptedUrl}</TableCell>
                  <TableCell
                    className={
                      entry.isPhishing ? "text-red-500" : "text-green-500"
                    }
                  >
                    {entry.isPhishing ? "Malicious" : "Safe"}
                  </TableCell>
                  <TableCell>{entry.createdAt.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// components/ScanPage.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosI } from "../hooks/useAxios";

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await axiosI.post("/api/predict/url", { url });
      console.log(res.data);

      setResult(res.data);
    } catch (error) {
      console.error("Scan failed:", error);
      setResult("Error contacting prediction service.");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">URL Scanner</h1>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Scan a URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter a URL to scan..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleScan} disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </Button>
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Result</DialogTitle>
            <DialogDescription>
              {result?.isPhishing ? (
                <span className="text-lg font-semibold">
                  This URL is <span className="text-red-500">malicious</span>.
                </span>
              ) : (
                <span className="text-lg font-semibold">
                  This URL is <span className="text-green-500">safe</span>.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// components/CheckEmail.tsx
import { useState } from "react";
import axios from "axios";
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

export default function CheckEmail() {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCheckEmail = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosI.post("/api/predict/upload-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);

      setResult(res.data || "No result returned.");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error checking email.");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Check Suspicious Email</h1>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Upload Email File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".eml" onChange={handleFileChange} />
          <Button onClick={handleCheckEmail} disabled={loading || !file}>
            {loading ? "Checking..." : "Check Email"}
          </Button>
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Scan Result</DialogTitle>
            <DialogDescription>
              {result?.prediction === "safe" ? (
                <p className="text-lg font-semibold">
                  This email is safe to open.
                </p>
              ) : (
                <p className="text-lg font-semibold text-red-600">
                  This email is potentially dangerous.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

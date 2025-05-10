import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { axiosI } from "../hooks/useAxios"

export default function AddReport() {
  const [url, setUrl] = useState("")
  const [reason, setReason] = useState("")
  const [isPhishing, setIsPhishing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axiosI.post("/api/community/report", {
        url,
        reason,
        isPhishing,
      })

      // Clear form and show modal
      setUrl("")
      setReason("")
      setIsPhishing(false)
      setShowModal(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Community Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2">Suspicious URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="mb-2">Reason (optional)</Label>
              <Textarea
                placeholder="Explain why you think it's phishing"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPhishing"
                checked={isPhishing}
                onCheckedChange={setIsPhishing}
              />
              <Label htmlFor="isPhishing">
                {isPhishing ? "Phishing" : "Safe"}
              </Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal for confirmation */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Submitted</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your report has been submitted successfully and will be reviewed.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

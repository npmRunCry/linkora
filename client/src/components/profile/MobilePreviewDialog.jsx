import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PhonePreview from "@/components/profile/PhonePreview"

export default function MobilePreviewDialog() {
  return (
    <div className="fixed bottom-5 right-5 z-40 lg:hidden">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full shadow-lg">
            <Eye />
            Preview
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page preview</DialogTitle>
          </DialogHeader>
          <PhonePreview />
        </DialogContent>
      </Dialog>
    </div>
  )
}

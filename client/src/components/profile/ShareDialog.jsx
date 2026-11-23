import { useState } from "react"
import { Copy, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"

export default function ShareDialog() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const publicUrl = `${window.location.origin}/${user.username}`

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl)
    toast.success("Link copied")
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink()
      return
    }

    await navigator.share({
      title: `${user.name} on Linkora`,
      url: publicUrl,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Share2 />
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your Linkora</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center rounded-3xl bg-white p-6">
          <QRCodeSVG value={publicUrl} size={190} />
        </div>

        <div className="rounded-xl bg-neutral-100 p-3 text-center text-sm">
          {publicUrl}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copyLink}>
            <Copy />
            Copy link
          </Button>

          <Button onClick={nativeShare}>
            <Share2 />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

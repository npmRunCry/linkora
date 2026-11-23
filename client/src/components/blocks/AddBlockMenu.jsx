import { Hash, Link2, Share2, TvMinimalPlay } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProfile } from "@/context/ProfileContext"

const options = [
  { type: "link", label: "Link", icon: Link2 },
  { type: "heading", label: "Heading", icon: Hash },
  { type: "socials", label: "Social icons", icon: Share2 },
  { type: "youtube", label: "YouTube", icon: TvMinimalPlay },
]

export default function AddBlockMenu() {
  const { setBlocks } = useProfile()

  async function addBlock(type) {
    try {
      const { data } = await api.post("/blocks", { type })
      setBlocks((current) => [...current, data.block])
      toast.success(`${type} block added`)
    } catch {
      toast.error("Could not add block")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full">+ Add block</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {options.map((option) => {
          const Icon = option.icon

          return (
            <DropdownMenuItem
              key={option.type}
              onClick={() => addBlock(option.type)}
            >
              <Icon className="size-4" />
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

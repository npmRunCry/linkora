import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { toast } from "sonner"
import api from "@/lib/api"
import { useProfile } from "@/context/ProfileContext"
import SortableBlock from "@/components/blocks/SortableBlock"

export default function BlockList() {
  const { blocks, setBlocks } = useProfile()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  )

  async function handleDragEnd(event) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(
      (block) => block._id === active.id
    )
    const newIndex = blocks.findIndex(
      (block) => block._id === over.id
    )

    const reordered = arrayMove(blocks, oldIndex, newIndex)
    setBlocks(reordered)

    try {
      const { data } = await api.patch("/blocks/reorder", {
        orderedIds: reordered.map((block) => block._id),
      })

      setBlocks(data.blocks)
    } catch {
      toast.error("Could not save block order")
    }
  }

  if (!blocks.length) {
    return (
      <div className="rounded-3xl border border-dashed bg-white p-10 text-center">
        <p className="font-semibold">Your page is empty</p>
        <p className="mt-1 text-sm text-neutral-500">
          Add your first block to get started.
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((block) => block._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {blocks.map((block) => (
            <SortableBlock key={block._id} block={block} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

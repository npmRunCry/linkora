import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import BlockCard from "@/components/blocks/BlockCard"

export default function SortableBlock({ block }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: block._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <BlockCard
        block={block}
        dragHandleProps={attributes}
        dragHandleListeners={listeners}
      />
    </div>
  )
}

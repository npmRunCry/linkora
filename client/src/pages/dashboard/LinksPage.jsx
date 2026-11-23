import AddBlockMenu from "@/components/blocks/AddBlockMenu"
import BlockList from "@/components/blocks/BlockList"
import ProfileEditor from "@/components/profile/ProfileEditor"

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Content</p>
          <h1 className="text-3xl font-black">Build your page</h1>
        </div>

        <AddBlockMenu />
      </div>

      <ProfileEditor />

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold">Blocks</h2>
          <p className="text-sm text-neutral-500">
            Drag blocks to change their order.
          </p>
        </div>

        <BlockList />
      </section>
    </div>
  )
}

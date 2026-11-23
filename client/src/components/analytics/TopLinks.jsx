export default function TopLinks({ links }) {
  return (
    <section className="rounded-3xl border bg-white p-5">
      <h2 className="font-bold">Top links</h2>

      {!links.length ? (
        <p className="mt-4 text-sm text-neutral-500">
          No link clicks yet.
        </p>
      ) : (
        <div className="mt-4 divide-y">
          {links.map((link, index) => (
            <div
              key={link.blockId}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-neutral-400">
                  #{index + 1}
                </p>
                <p className="truncate font-medium">{link.title}</p>
              </div>
              <p className="font-bold">{link.clicks}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

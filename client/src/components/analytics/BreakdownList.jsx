export default function BreakdownList({
  title,
  items,
  emptyText = "No data yet",
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <section className="rounded-3xl border bg-white p-5">
      <h2 className="font-bold">{title}</h2>

      {!items.length ? (
        <p className="mt-4 text-sm text-neutral-500">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

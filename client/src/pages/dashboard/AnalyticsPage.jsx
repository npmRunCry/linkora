import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import MetricCard from "@/components/analytics/MetricCard"
import TrafficChart from "@/components/analytics/TrafficChart"
import BreakdownList from "@/components/analytics/BreakdownList"
import TopLinks from "@/components/analytics/TopLinks"

const ranges = [7, 30, 90]

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)

        const { data } = await api.get(
          `/analytics/overview?days=${days}`
        )

        setAnalytics(data)
      } catch {
        toast.error("Could not load analytics")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [days])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Performance</p>
          <h1 className="text-3xl font-black">Analytics</h1>
        </div>

        <div className="flex rounded-full border bg-white p-1">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDays(range)}
              className={`rounded-full px-4 py-2 text-sm ${
                days === range
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600"
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border bg-white p-10 text-center">
          Loading analytics...
        </div>
      ) : !analytics ? (
        <div className="rounded-3xl border bg-white p-10 text-center">
          Analytics is unavailable.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Profile views"
              value={analytics.summary.views}
            />
            <MetricCard
              label="Link clicks"
              value={analytics.summary.clicks}
            />
            <MetricCard
              label="CTR"
              value={analytics.summary.ctr}
              suffix="%"
            />
            <MetricCard
              label="Unique visitors"
              value={analytics.summary.uniqueVisitors}
            />
          </div>

          <section className="rounded-3xl border bg-white p-5">
            <div>
              <h2 className="font-bold">Views and clicks</h2>
              <p className="text-sm text-neutral-500">
                Daily activity for the selected range.
              </p>
            </div>

            <div className="mt-5">
              <TrafficChart data={analytics.chart} />
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <TopLinks links={analytics.topLinks} />
            <BreakdownList
              title="Traffic sources"
              items={analytics.referrers}
            />
            <BreakdownList
              title="Devices"
              items={analytics.devices}
            />
            <BreakdownList
              title="Browsers"
              items={analytics.browsers}
            />
            <BreakdownList
              title="Countries"
              items={analytics.countries}
            />
          </div>
        </>
      )}
    </div>
  )
}

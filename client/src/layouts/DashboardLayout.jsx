import { BarChart3, Link2, Palette, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import ShareDialog from "@/components/profile/ShareDialog";
import MobilePreviewDialog from "@/components/profile/MobilePreviewDialog";

const items = [
  { to: "/dashboard/links", label: "Links", icon: Link2 },
  { to: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];
export default function DashboardLayout({ children, preview }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">
          <p className="text-xl font-black">linkora</p>
          <p className="text-sm text-neutral-500">Creator dashboard</p>
          <ShareDialog />
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[220px_1fr_380px]">
        <aside className="border-r bg-white p-3">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100",
                    )
                  }
                >
                  <Icon className="size-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 p-5 lg:p-8">{children}</main>
        <aside className="hidden border-l bg-white p-6 lg:block">
          <div className="sticky top-24">{preview}</div>
        </aside>
      </div>
      <MobilePreviewDialog />
    </div>
  );
}

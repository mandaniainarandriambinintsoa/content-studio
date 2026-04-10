import Link from "next/link";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/scripts", label: "Scripts" },
  { href: "/studio", label: "Studio" },
  { href: "/calendar", label: "Calendar" },
  { href: "/analytics", label: "Analytics" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-5" style={{ background: "var(--color-surface)" }}>
        <div className="mb-8">
          <div className="text-lg font-semibold">Content Studio</div>
          <div className="text-xs" style={{ color: "var(--color-muted)" }}>Manda</div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm hover:bg-[var(--color-surface-hover)] transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

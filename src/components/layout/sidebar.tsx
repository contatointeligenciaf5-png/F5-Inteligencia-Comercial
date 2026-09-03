import Link from "next/link";
import { navItems } from "@/config/nav";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <span className="text-sm font-semibold tracking-wide text-neutral-900">
          PORTAL F5
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.description}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <form action="/api/logout" method="POST" className="border-t border-neutral-200 p-3">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        >
          Sair
        </button>
      </form>
    </aside>
  );
}

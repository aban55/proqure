"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Quote,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

const links = [
  { href: "/buyer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/rfqs", label: "RFQs", icon: FileText },
  { href: "/buyer/quotes", label: "Quotes", icon: Quote },
  { href: "/buyer/orders", label: "Orders", icon: ShoppingCart },
  { href: "/projects", label: "Projects", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin", label: "Admin", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-full p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Proqure</h1>

      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100",
              pathname.startsWith(href) &&
                "bg-gray-200 font-medium text-black"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-sm text-gray-500">
        Buyer / Seller Procurement
      </div>
    </aside>
  );
}

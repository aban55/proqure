import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
      <h2 className="font-semibold">Dashboard</h2>

      <button className="p-2 rounded hover:bg-gray-100">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}

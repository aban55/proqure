import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

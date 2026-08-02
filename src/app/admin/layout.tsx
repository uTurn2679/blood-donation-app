import Link from "next/link";
import { LayoutDashboard, FileSpreadsheet, Users, Activity } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 72px)' }}>
      {/* Admin Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--surface)', 
        borderRight: '1px solid var(--border)',
        padding: '2rem 1rem'
      }}>
        <h3 className="mb-6 px-4" style={{ fontSize: '1.25rem' }}>Admin Panel</h3>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-100 transition-colors" style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            <LayoutDashboard size={20} className="text-primary" /> Dashboard
          </Link>
          <Link href="/admin/import" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-100 transition-colors" style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            <FileSpreadsheet size={20} className="text-primary" /> Import Excel
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-100 transition-colors" style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            <Users size={20} className="text-primary" /> Manage Users
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-100 transition-colors" style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            <Activity size={20} className="text-primary" /> Blood Requests
          </Link>
        </nav>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1" style={{ background: 'var(--bg-color)' }}>
        {children}
      </main>
    </div>
  );
}

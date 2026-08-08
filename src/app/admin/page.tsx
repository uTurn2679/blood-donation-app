import { prisma } from "@/lib/prisma";
import { Users, FileSpreadsheet, Activity, Database } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Prevent build-time database queries on Vercel where DATABASE_URL is missing
  const isBuildTime = !process.env.DATABASE_URL;
  const totalDonors = isBuildTime ? 0 : await prisma.donorProfile.count();
  const totalRequests = isBuildTime ? 0 : await prisma.bloodRequest.count();
  const totalUsers = isBuildTime ? 0 : await prisma.user.count();

  return (
    <div className="p-8">
      <h2 className="mb-6">Admin Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card flex items-center gap-4" style={{ padding: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium mb-1">Total Donors</p>
            <h3 style={{ margin: 0 }}>{totalDonors}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4" style={{ padding: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={28} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium mb-1">Blood Requests</p>
            <h3 style={{ margin: 0 }}>{totalRequests}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4" style={{ padding: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={28} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium mb-1">Registered Users</p>
            <h3 style={{ margin: 0 }}>{totalUsers}</h3>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link href="/admin/import" className="btn btn-primary">
            <FileSpreadsheet size={18} /> Bulk Import Donors (Excel)
          </Link>
          <Link href="/search" className="btn btn-outline">
            View Donor List
          </Link>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Users, FileSpreadsheet, Activity, Database, Search, HeartPulse } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Prevent build-time database queries on Vercel where DATABASE_URL is missing
  const isBuildTime = !process.env.DATABASE_URL;
  const totalDonors = isBuildTime ? 0 : await prisma.donorProfile.count();
  const totalRequests = isBuildTime ? 0 : await prisma.bloodRequest.count();
  const totalUsers = isBuildTime ? 0 : await prisma.user.count();

  return (
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted text-sm md:text-base">Overview of your blood donation network and management tools.</p>
      </div>
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        <div className="glass-card flex items-center gap-4 p-5">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={26} />
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Total Donors</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{totalDonors}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 p-5">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={26} />
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Blood Requests</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{totalRequests}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4 p-5 sm:col-span-2 md:col-span-1">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Database size={26} />
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem' }}>{totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">Quick Management Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <Link href="/search" className="btn btn-primary gap-2 justify-center">
            <Search size={18} /> Search Donors Database
          </Link>
          <Link href="/blood-requests" className="btn btn-outline gap-2 justify-center bg-white">
            <HeartPulse size={18} /> Manage & Delete Requests
          </Link>
          <Link href="/admin/import" className="btn btn-outline gap-2 justify-center bg-white">
            <FileSpreadsheet size={18} /> Bulk Import (Excel)
          </Link>
        </div>
      </div>
    </div>
  );
}


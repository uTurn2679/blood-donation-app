import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Activity, Building, HeartPulse, Clock, Droplet, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BloodRequestsPage() {
  const requests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const urgentRequests = requests.filter(r => r.urgency === "URGENT");
  const normalRequests = requests.filter(r => r.urgency !== "URGENT");

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-primary" size={32} />
            All Blood Requests
          </h1>
          <p className="text-muted mt-2">
            {requests.length} total request{requests.length !== 1 ? "s" : ""} — 
            <span className="text-red-600 font-medium ml-1">{urgentRequests.length} urgent</span>
          </p>
        </div>
        <Link href="/request-blood" className="btn btn-primary gap-2">
          <Plus size={18} /> Post a Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Droplet size={56} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No blood requests yet</h3>
          <p className="text-muted mb-6">Be the first to post an urgent request.</p>
          <Link href="/request-blood" className="btn btn-primary">
            Post a Blood Request
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Urgent Requests */}
          {urgentRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4 pb-2 border-b border-red-100">
                <HeartPulse size={22} /> Urgent Requests ({urgentRequests.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {urgentRequests.map(req => (
                  <RequestCard key={req.id} req={req} urgent />
                ))}
              </div>
            </div>
          )}

          {/* Normal Requests */}
          {normalRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                <Activity size={22} /> Other Requests ({normalRequests.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {normalRequests.map(req => (
                  <RequestCard key={req.id} req={req} urgent={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, urgent }: { req: any; urgent: boolean }) {
  const timeAgo = getTimeAgo(new Date(req.createdAt));
  
  return (
    <div className={`glass-card relative overflow-hidden hover:shadow-md transition-shadow ${urgent ? 'border-l-4 border-red-500' : 'border-l-4 border-gray-200'}`}>
      {urgent && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
          🚨 URGENT
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-4 mt-1">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${urgent ? 'bg-red-500 text-white' : 'bg-red-100 text-primary'}`}>
          {req.bloodGroup}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{req.patientName}</h3>
          <p className="text-xs text-muted flex items-center gap-1 mt-1">
            <Clock size={12} /> {timeAgo}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="flex items-start gap-2 text-gray-600">
          <Building size={15} className="shrink-0 mt-0.5 text-muted" />
          <span>{req.location}</span>
        </p>
        <p className="flex items-start gap-2 text-gray-600">
          <HeartPulse size={15} className="shrink-0 mt-0.5 text-muted" />
          <span>Needs: <span className="font-semibold text-primary">{req.bloodGroup}</span> blood</span>
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <a
          href={`tel:${req.contactPhone}`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors ${urgent ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-50 hover:bg-red-100 text-primary border border-red-200'}`}
        >
          📞 Call Now: {req.contactPhone}
        </a>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

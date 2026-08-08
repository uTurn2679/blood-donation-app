import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Phone, User, Search, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { DEPARTMENTS, SESSIONS } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ bg?: string, dept?: string, session?: string, availableOnly?: string }>;
}) {
  // Admin-only guard
  const cookieStore = await cookies();
  const role = cookieStore.get("auth_role")?.value;
  if (role !== "ADMIN") {
    redirect("/login?reason=admin_only");
  }

  const { bg, dept, session, availableOnly } = await searchParams;

  const bloodGroup = bg || "";
  const department = dept || "";
  const sessionVal = session || "";
  const isAvailableOnly = availableOnly === "true";

  let donors: any[] = [];
  
  // Calculate the date 120 days ago (4 months)
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setDate(fourMonthsAgo.getDate() - 120);

  if (bloodGroup || department || sessionVal) {
    const whereClause: any = {
      ...(bloodGroup ? { bloodGroup } : {}),
      ...(department ? { department: { contains: department } } : {}),
      ...(sessionVal ? { session: { contains: sessionVal } } : {}),
    };

    if (isAvailableOnly) {
      whereClause.OR = [
        { lastDonation: null },
        { lastDonation: { lte: fourMonthsAgo } }
      ];
    }

    donors = await prisma.donorProfile.findMany({
      where: whereClause,
      include: {
        user: true,
      },
    });
  }

  return (
    <div className="container py-16 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <ShieldAlert size={16} /> Admin Only — Donor Database
        </div>
        <h1>Find Blood Donors</h1>
        <p className="text-muted">Search the full donor database. This page is visible to admins only.</p>
      </div>

      <div className="glass-card mb-12" style={{ maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="input-group md:col-span-3" style={{ marginBottom: 0 }}>
            <label className="input-label">Blood Group</label>
            <select name="bg" className="input-field" defaultValue={bloodGroup}>
              <option value="">Any</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          
          <div className="input-group md:col-span-3" style={{ marginBottom: 0 }}>
            <label className="input-label">Department</label>
            <select name="dept" className="input-field" defaultValue={department}>
              <option value="">Any</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="input-group md:col-span-3" style={{ marginBottom: 0 }}>
            <label className="input-label">Session</label>
            <select name="session" className="input-field" defaultValue={sessionVal}>
              <option value="">Any</option>
              {SESSIONS.map(session => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <button type="submit" className="btn btn-primary w-full justify-center" style={{ height: '44px' }}>
              <Search size={18} /> Search Donors
            </button>
          </div>
        </form>
      </div>

      {(bloodGroup || department || sessionVal) && (
        <div className="animate-fade-in">
          <h3 className="mb-6 text-center">Search Results ({donors.length} found)</h3>
          
          {donors.length === 0 ? (
            <div className="text-center p-8 glass-card" style={{ background: 'rgba(255,255,255,0.4)', maxWidth: '600px', margin: '0 auto' }}>
              <p className="text-muted mb-4">No donors found matching your exact criteria.</p>
              <Link href="/request-blood" className="btn btn-outline">Post an Urgent Blood Request</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {donors.map((donor) => {
                const isAvailable = !donor.lastDonation || new Date(donor.lastDonation) <= fourMonthsAgo;
                
                return (
                  <div key={donor.id} className="glass-card flex flex-col sm:flex-row gap-4 relative overflow-hidden group hover:border-red-200 transition-colors">
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
                      {donor.bloodGroup}
                    </div>
                    
                    <div className="flex-1 mt-1 sm:mt-0">
                      <h4 className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-primary" /> 
                        <span className="text-gray-900 font-bold">{donor.user.name}</span>
                      </h4>
                      <div className="text-muted text-sm flex flex-col gap-1 mb-3">
                        {donor.location && (
                          <span className="flex items-center gap-2"><MapPin size={14} /> {donor.location}</span>
                        )}
                        {(donor.department || donor.session) && (
                          <span className="flex items-center gap-2" style={{ marginLeft: '2px' }}>
                            <span style={{ fontWeight: 500 }}>Dept:</span> {donor.department || 'N/A'} {donor.session ? `(${donor.session})` : ''}
                          </span>
                        )}
                        {donor.lastDonation && (
                          <span className="flex items-center gap-2 mt-1" style={{ marginLeft: '2px' }}>
                            <span style={{ fontWeight: 500 }}>Last Donation:</span> {new Date(donor.lastDonation).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <a href={`tel:${donor.user.phone}`} className="text-primary font-semibold flex items-center gap-2 hover:underline">
                          <Phone size={16} /> {donor.user.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

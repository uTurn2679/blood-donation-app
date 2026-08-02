import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Phone, Droplet, User, Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ bg?: string, dept?: string, session?: string }>;
}) {
  const { bg, dept, session } = await searchParams;

  const bloodGroup = bg || "";
  const department = dept || "";
  const sessionVal = session || "";

  let donors: any[] = [];

  if (bloodGroup || department || sessionVal) {
    donors = await prisma.donorProfile.findMany({
      where: {
        isAvailable: true,
        ...(bloodGroup ? { bloodGroup } : {}),
        ...(department ? { department: { contains: department } } : {}),
        ...(sessionVal ? { session: { contains: sessionVal } } : {}),
      },
      include: {
        user: true,
      },
    });
  }

  return (
    <div className="container py-16">
      <div className="text-center mb-8">
        <h1>Find Blood Donors</h1>
        <p className="text-muted">Search for available blood donors in Gopalganj area.</p>
      </div>

      <div className="glass-card mb-12" style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Blood Group</label>
            <select name="bg" className="input-field" defaultValue={bloodGroup}>
              <option value="">Any</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Department</label>
            <input type="text" name="dept" className="input-field" placeholder="e.g. CSE, AGR" defaultValue={department} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Session</label>
            <input type="text" name="session" className="input-field" placeholder="e.g. 21-22" defaultValue={sessionVal} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '46px', width: '100%' }}>
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {(bloodGroup || department || sessionVal) && (
        <div className="animate-fade-in">
          <h3 className="mb-4 text-center">Search Results ({donors.length} found)</h3>
          
          {donors.length === 0 ? (
            <div className="text-center p-8 glass-card" style={{ background: 'rgba(255,255,255,0.4)' }}>
              <p className="text-muted mb-4">No donors found matching your criteria.</p>
              <Link href="/request" className="btn btn-outline">Post a Blood Request Instead</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {donors.map((donor) => (
                <div key={donor.id} className="glass-card flex gap-4">
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-muted" /> {donor.user.name}
                    </h4>
                    <div className="text-muted text-sm flex flex-col gap-1 mb-2">
                      {donor.location && (
                        <span className="flex items-center gap-2"><MapPin size={14} /> {donor.location}</span>
                      )}
                      {(donor.department || donor.session) && (
                        <span className="flex items-center gap-2" style={{ marginLeft: '2px' }}>
                          <span style={{ fontWeight: 500 }}>Dept:</span> {donor.department || 'N/A'} {donor.session ? `(${donor.session})` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-medium flex items-center gap-2">
                      <Phone size={16} /> {donor.user.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

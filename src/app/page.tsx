import Link from "next/link";
import { ArrowRight, Activity, HeartPulse, Droplet, Users, Building, CalendarClock, Phone } from "lucide-react";
import { getLiveStats, getRecentRequests } from "./actions";

export default async function Home() {
  const stats = await getLiveStats();
  const recentRequests = await getRecentRequests();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, rgba(211,47,47,0.05) 0%, rgba(211,47,47,0.15) 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container flex flex-col items-center justify-center text-center animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: 'rgba(211,47,47,0.1)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <Droplet size={16} />
            Welcome to Blood Donor GSTU
          </div>
          <h1 className="mb-4" style={{ maxWidth: '800px' }}>
            Give the Gift of Life, <br/><span className="text-primary">Donate Blood Today.</span>
          </h1>
          <p className="text-muted mb-8" style={{ fontSize: '1.125rem', maxWidth: '600px' }}>
            Join the largest community of blood donors. Your single donation can save up to three lives. Register today or request blood in emergencies.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blood-requests" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem' }}>
              <Activity size={20} /> View Blood Requests
            </Link>
            <Link href="/request-blood" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', background: 'white' }}>
              <HeartPulse size={20} /> Post Blood Request
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/login" className="text-primary font-semibold hover:underline flex items-center gap-1 justify-center">
              Register or Sign In as a Donor <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)' }}></div>
      </section>

      {/* Live Statistics Section */}
      <section className="py-12" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Users size={48} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl font-bold mb-2 text-white">{stats.totalDonors}+</h2>
              <p className="text-white/80 font-medium text-lg">Registered Donors</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Activity size={48} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl font-bold mb-2 text-white">{stats.totalRequests}</h2>
              <p className="text-white/80 font-medium text-lg">Blood Requests Handled</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Building size={48} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl font-bold mb-2 text-white">{stats.departmentsCovered}+</h2>
              <p className="text-white/80 font-medium text-lg">Departments Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Urgent Requests */}
      <section className="py-16 container">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="text-primary" /> Urgent Blood Requests
            </h2>
            <p className="text-muted mt-2">People who are currently in urgent need of blood.</p>
          </div>
          <Link href="/blood-requests" className="text-primary font-semibold hover:underline flex items-center gap-1">
            See All Requests <ArrowRight size={16} />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <Droplet size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No active requests</h3>
            <p className="text-muted mb-4">Currently there are no urgent blood requests.</p>
            <Link href="/request-blood" className="btn btn-primary">
              Post a Request
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRequests.map(req => (
              <div key={req.id} className="glass-card relative overflow-hidden flex flex-col justify-between" style={{ minHeight: '220px' }}>
                {req.urgency === 'URGENT' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    🚨 URGENT
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{req.patientName}</h3>
                      <p className="text-xs text-muted mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <Building size={16} className="text-muted shrink-0 mt-0.5" />
                      <span>{req.location}</span>
                    </p>
                  </div>
                </div>
                
                <a href={`tel:${req.contactPhone}`} className="btn btn-outline w-full justify-center gap-2 mt-2">
                  <Phone size={16} /> Call {req.contactPhone}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Section - Why Donate? */}
      <section className="py-16 bg-red-50/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Donate Blood?</h2>
            <p className="text-muted">Blood is the most precious gift that anyone can give to another person — the gift of life.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-primary flex items-center justify-center mb-4">
                <HeartPulse size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-3">Health Benefits</h3>
              <p className="text-muted text-sm leading-relaxed">
                Regular blood donation stimulates the production of new blood cells, maintains healthy iron levels, and reduces the risk of heart disease.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-primary flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-3">Save 3 Lives</h3>
              <p className="text-muted text-sm leading-relaxed">
                One pint of blood can be separated into red cells, plasma, and platelets, potentially saving up to three different patients in need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-primary flex items-center justify-center mb-4">
                <CalendarClock size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-3">Eligibility</h3>
              <p className="text-muted text-sm leading-relaxed">
                You can safely donate blood every 4 months (120 days). You must be at least 18 years old and weigh over 50 kg to be eligible.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16" style={{ background: 'var(--surface)' }}>
        <div className="container text-center">
          <h2 className="mb-4">Are you ready to be a hero?</h2>
          <p className="text-muted mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            There is a constant need for regular blood supply because blood can be stored for only a limited time before use.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Join as a Donor
            </Link>
            <Link href="/request-blood" className="btn btn-outline bg-white" style={{ padding: '0.875rem 2rem' }}>
              Request Blood
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


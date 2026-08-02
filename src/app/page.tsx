import Link from "next/link";
import { ArrowRight, Search, Activity, ShieldCheck, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, rgba(211,47,47,0.05) 0%, rgba(211,47,47,0.15) 100%)',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container flex flex-col items-center justify-center text-center animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(211,47,47,0.1)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <HeartPulse size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/>
            Save Lives in Gopalganj
          </div>
          <h1 className="mb-4" style={{ maxWidth: '800px' }}>
            Give the Gift of Life, <br/><span className="text-primary">Donate Blood Today.</span>
          </h1>
          <p className="text-muted mb-8" style={{ fontSize: '1.125rem', maxWidth: '600px' }}>
            Join the largest community of blood donors in Gopalganj. Your single donation can save up to three lives. Register today and make a difference.
          </p>
          
          <div className="flex gap-4">
            <Link href="/search" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem' }}>
              <Search size={20} /> Find Blood
            </Link>
            <Link href="/register" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', background: 'white' }}>
              Register as Donor <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)' }}></div>
      </section>

      {/* Stats / Features */}
      <section className="py-16 container">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Activity size={32} />
            </div>
            <h3 className="mb-2">Fast Response</h3>
            <p className="text-muted">Connect with available donors in your area within minutes during emergencies.</p>
          </div>
          
          <div className="glass-card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 className="mb-2">Verified Donors</h3>
            <p className="text-muted">All our donors are registered and verified to ensure safety and reliability.</p>
          </div>
          
          <div className="glass-card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(211,47,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <HeartPulse size={32} />
            </div>
            <h3 className="mb-2">Community Driven</h3>
            <p className="text-muted">A dedicated community focused entirely on the Gopalganj district and its upazilas.</p>
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
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
            Join as a Donor
          </Link>
        </div>
      </section>
    </div>
  );
}

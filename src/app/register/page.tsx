import { registerDonor } from "../actions";
import { UserPlus, Droplet, HeartPulse, ShieldCheck } from "lucide-react";
import { DEPARTMENTS, SESSIONS } from "@/lib/constants";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #fff5f5 100%)' }}>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: '0 8px 24px rgba(211,47,47,0.35)' }}>
            <Droplet size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Become a Blood Donor</h1>
          <p className="text-muted mt-2">Join thousands of heroes saving lives every day</p>
        </div>

        {/* Benefits row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: HeartPulse, label: "Save 3 Lives" },
            { icon: ShieldCheck, label: "Verified Profile" },
            { icon: UserPlus, label: "Free to Join" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white rounded-xl border border-red-100 p-3 flex flex-col items-center gap-1.5 text-center">
              <Icon size={20} className="text-primary" />
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-lg font-bold mb-6 text-gray-800">Your Information</h2>
          <form action={registerDonor} className="space-y-5">
            {/* Name + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="name">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  required
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-field"
                  required
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Blood Group + Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="bloodGroup">
                  Blood Group <span className="text-primary">*</span>
                </label>
                <select id="bloodGroup" name="bloodGroup" className="input-field" required defaultValue="">
                  <option value="" disabled>Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                  Password <span className="text-primary">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field"
                  required
                  placeholder="Choose a strong password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Department + Session */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="department">
                  Department <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select id="department" name="department" className="input-field" defaultValue="">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="session">
                  Session <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select id="session" name="session" className="input-field" defaultValue="">
                  <option value="">Select session</option>
                  {SESSIONS.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center text-base py-3 mt-2"
            >
              <UserPlus size={20} /> Register as Donor
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


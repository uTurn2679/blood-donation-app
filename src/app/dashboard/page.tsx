import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLastDonation, logoutUser } from "@/app/actions";
import { Calendar, User, LogOut, AlertCircle, Droplet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { donorProfile: true }
  });

  if (!user || !user.donorProfile) {
    redirect("/login");
  }

  const lastDonation = user.donorProfile.lastDonation;
  
  let isAvailable = true;
  let daysSinceDonation = null;

  if (lastDonation) {
    const diffTime = Math.abs(new Date().getTime() - new Date(lastDonation).getTime());
    daysSinceDonation = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysSinceDonation < 120) {
      isAvailable = false;
    }
  }

  return (
    <div className="container py-12 max-w-4xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="text-primary" size={32} />
            Donor Dashboard
          </h1>
          <p className="text-muted mt-2">Manage your donor profile and availability status.</p>
        </div>
        
        <form action={logoutUser}>
          <button type="submit" className="btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
            <LogOut size={18} /> Sign Out
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-card md:col-span-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 text-primary flex items-center justify-center text-3xl font-bold mb-4">
            {user.donorProfile.bloodGroup}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted mb-4">{user.phone}</p>
          
          <div className="w-full pt-4 border-t">
            <p className="text-sm text-muted mb-1">Current Status</p>
            {isAvailable ? (
              <span className="inline-block bg-green-100 text-green-800 font-bold px-4 py-1.5 rounded-full text-sm">
                AVAILABLE TO DONATE
              </span>
            ) : (
              <span className="inline-block bg-red-100 text-red-800 font-bold px-4 py-1.5 rounded-full text-sm">
                NOT ELIGIBLE (Wait {120 - (daysSinceDonation || 0)} days)
              </span>
            )}
          </div>
        </div>

        {/* Update Form */}
        <div className="glass-card md:col-span-2">
          <h3 className="flex items-center gap-2 mb-6">
            <Calendar className="text-primary" size={24} />
            Update Last Donation
          </h3>
          
          {!isAvailable && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 flex gap-3 items-start">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm">
                You recently donated blood on <strong>{lastDonation?.toLocaleDateString()}</strong>. 
                For your safety, you cannot donate again until 120 days have passed. Your profile is currently hidden from search results.
              </p>
            </div>
          )}

          <form action={updateLastDonation} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="lastDonation" className="font-medium">When did you last donate blood?</label>
              <input 
                type="date" 
                id="lastDonation" 
                name="lastDonation" 
                className="input-field max-w-md"
                required
                defaultValue={lastDonation ? lastDonation.toISOString().split('T')[0] : ''}
              />
              <p className="text-xs text-muted">
                If you haven't donated before, leave this empty. Updating this date automatically updates your availability.
              </p>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { submitBloodRequest } from "@/app/actions";
import { Activity } from "lucide-react";

export default function RequestBlood() {
  return (
    <div className="container py-12 max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-primary" size={32} />
          Request Blood
        </h1>
        <p className="text-muted mt-2">
          Post an urgent blood request to our network of donors. Your request will be visible to everyone on the platform.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <form action={submitBloodRequest} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="patientName" className="font-medium text-sm">Patient Name *</label>
              <input 
                id="patientName"
                name="patientName" 
                type="text" 
                required 
                className="input-field" 
                placeholder="E.g., John Doe" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className="font-medium text-sm">Required Blood Group *</label>
              <select 
                id="bloodGroup"
                name="bloodGroup" 
                required 
                className="input-field"
                defaultValue=""
              >
                <option value="" disabled>Select Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="font-medium text-sm">Hospital / Location *</label>
            <input 
              id="location"
              name="location" 
              type="text" 
              required 
              className="input-field" 
              placeholder="E.g., Dhaka Medical College Hospital" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="font-medium text-sm">Contact Number for Donors *</label>
              <input 
                id="contactPhone"
                name="contactPhone" 
                type="tel" 
                required 
                className="input-field" 
                placeholder="E.g., 017XXXXXXXX" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="font-medium text-sm">Your Account Phone *</label>
              <input 
                id="phone"
                name="phone" 
                type="tel" 
                required 
                className="input-field" 
                placeholder="To verify identity" 
              />
              <p className="text-xs text-muted">We will use this to link the request to you.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Urgency Level *</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="urgency" value="NORMAL" defaultChecked />
                <span>Normal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-red-600 font-medium">
                <input type="radio" name="urgency" value="URGENT" />
                <span>Urgent</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center text-lg py-3 mt-4">
            Submit Blood Request
          </button>
        </form>
      </div>
    </div>
  );
}

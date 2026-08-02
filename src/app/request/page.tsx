import { submitBloodRequest } from "../actions";
import { Heart } from "lucide-react";

export default function RequestPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-8">
        <h1>Request Blood</h1>
        <p className="text-muted">Post an urgent blood request to notify donors in Gopalganj.</p>
      </div>

      <div className="glass-card mx-auto" style={{ maxWidth: '600px' }}>
        <form action={submitBloodRequest}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="patientName">Patient Name</label>
              <input type="text" id="patientName" name="patientName" className="input-field" required placeholder="Patient's full name" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="bloodGroup">Blood Group Required</label>
              <select id="bloodGroup" name="bloodGroup" className="input-field" required>
                <option value="">Select</option>
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="location">Hospital / Location</label>
              <input type="text" id="location" name="location" className="input-field" required placeholder="Hospital name in Gopalganj" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="urgency">Urgency Level</label>
              <select id="urgency" name="urgency" className="input-field" required>
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="contactPhone">Contact Phone for this request</label>
              <input type="tel" id="contactPhone" name="contactPhone" className="input-field" required placeholder="01XXXXXXXXX" />
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="phone">Your Phone (to verify identity)</label>
              <input type="tel" id="phone" name="phone" className="input-field" required placeholder="01XXXXXXXXX" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary container mt-4">
            <Heart size={18} /> Post Request
          </button>
        </form>
      </div>
    </div>
  );
}

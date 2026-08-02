import { registerDonor } from "../actions";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-8">
        <h1>Register as a Donor</h1>
        <p className="text-muted">Join the Gopalganj Blood Bank and help save lives.</p>
      </div>

      <div className="glass-card mx-auto" style={{ maxWidth: '600px' }}>
        <form action={registerDonor}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name <span className="text-primary">*</span></label>
              <input type="text" id="name" name="name" className="input-field" required placeholder="Enter your full name" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="phone">Phone Number <span className="text-primary">*</span></label>
              <input type="tel" id="phone" name="phone" className="input-field" required placeholder="01XXXXXXXXX" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="bloodGroup">Blood Group <span className="text-primary">*</span></label>
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

            <div className="input-group">
              <label className="input-label" htmlFor="department">Department (Optional)</label>
              <input type="text" id="department" name="department" className="input-field" placeholder="e.g. CSE" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="session">Session (Optional)</label>
              <input type="text" id="session" name="session" className="input-field" placeholder="e.g. 2021-2022" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password (Optional)</label>
              <input type="password" id="password" name="password" className="input-field" placeholder="Choose a password for login" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary container mt-4">
            <UserPlus size={18} /> Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

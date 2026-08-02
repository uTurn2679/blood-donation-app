"use client";

import { useState } from "react";
import { importExcelData } from "@/app/actions";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      setMessage({ type: 'error', text: "Please select a valid Excel file." });
      setLoading(false);
      return;
    }

    try {
      const result = await importExcelData(formData);
      if (result.success) {
        setMessage({ type: 'success', text: `Successfully imported ${result.addedCount} new donors!` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to import data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2>Import Donors</h2>
        <p className="text-muted">Upload an Excel (.xlsx) file to bulk import donors into the database.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'rgba(211,47,47,0.05)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FileSpreadsheet size={18} className="text-primary" /> Expected Format
          </h4>
          <p className="text-sm text-muted">
            The Excel file must have a header row with the following exact column names:
            <strong> Name, Phone, BloodGroup</strong> (Required). 
            <br />
            Optional columns: <strong>Location, Department, Session</strong>.
            <br />
            Duplicates (based on Phone number) will be safely skipped.
          </p>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="file">Select Excel File</label>
            <input 
              type="file" 
              id="file" 
              name="file" 
              accept=".xlsx, .xls, .csv" 
              className="input-field" 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Importing...' : <><Upload size={18} /> Upload and Import</>}
          </button>
        </form>
      </div>
    </div>
  );
}

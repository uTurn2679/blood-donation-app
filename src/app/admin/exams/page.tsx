"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminExamsAction, createExamAction, deleteExamAction, updateExamAction } from "@/app/actions/examActions";
import { Plus, Calendar, Clock, FileText, Users, Eye, Edit3, Trash2, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";

export default function AdminExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state with default values
  const now = new Date();
  const defaultStart = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: "New MCQ Assessment Exam",
    description: "Assessment session. Click 'Manage Questions' to set up to 100 MCQs.",
    startTime: defaultStart,
    endTime: defaultEnd,
    durationMinutes: 30,
    totalMarks: 100,
    passMarks: 40,
  });

  const loadExams = async () => {
    setLoading(true);
    const res = await getAdminExamsAction();
    if (res.success) {
      setExams(res.exams || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Please fill in all required exam fields.");
      return;
    }

    const res = await createExamAction({
      ...formData,
      durationMinutes: Number(formData.durationMinutes),
      totalMarks: Number(formData.totalMarks),
      passMarks: Number(formData.passMarks),
    });

    if (res.success && res.exam) {
      // Automatically redirect to Question Builder Room for this exam!
      router.push(`/admin/exams/${res.exam.id}/edit`);
    } else {
      alert("Error creating exam: " + res.error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the exam "${title}"?`)) return;
    const res = await deleteExamAction(id);
    if (res.success) {
      loadExams();
    } else {
      alert("Failed to delete exam.");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    const res = await updateExamAction(id, { isPublished: !current });
    if (res.success) {
      loadExams();
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "3rem 0" }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
              Admin Exam Management
            </h1>
            <p style={{ color: "#64748b" }}>
              Create assessment sessions, design question papers, set timers, and grade student submissions.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/exams" className="btn btn-outline">
              <Eye size={18} /> View Student Portal
            </Link>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ background: "#2563eb" }}>
              <Plus size={18} /> Create New Exam
            </button>
          </div>
        </div>

        {/* Exams Table / Cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="animate-spin" style={{ width: "40px", height: "40px", border: "4px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
            <p style={{ color: "#64748b" }}>Loading Exams...</p>
          </div>
        ) : exams.length === 0 ? (
          <div style={{ background: "white", padding: "4rem 2rem", borderRadius: "1rem", textAlign: "center", border: "1px dashed #cbd5e1" }}>
            <FileText size={48} color="#94a3b8" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#334155", marginBottom: "0.5rem" }}>No Exams Created Yet</h3>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Click below to create your first online exam session.</p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus size={18} /> Create Exam Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span
                      onClick={() => handleTogglePublish(exam.id, exam.isPublished)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        background: exam.isPublished ? "#dcfce7" : "#f1f5f9",
                        color: exam.isPublished ? "#15803d" : "#64748b",
                      }}
                    >
                      {exam.isPublished ? "Published" : "Draft"}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                      {exam.totalMarks} Marks
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                    {exam.title}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    {exam.description || "No description provided."}
                  </p>

                  <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "0.65rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "#475569", marginBottom: "1.25rem" }}>
                    <div><strong>Start:</strong> {new Date(exam.startTime).toLocaleString()}</div>
                    <div><strong>End:</strong> {new Date(exam.endTime).toLocaleString()}</div>
                    <div><strong>Duration:</strong> {exam.durationMinutes} Mins</div>
                    <div><strong>Questions:</strong> {exam._count.questions} questions</div>
                    <div><strong>Submissions:</strong> {exam._count.submissions} student paper(s)</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/exams/${exam.id}/edit`}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      background: "#2563eb",
                      color: "white",
                      fontWeight: 700,
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.25)"
                    }}
                  >
                    <Sparkles size={16} /> Manage Questions / Set 100 MCQs ({exam._count.questions})
                  </Link>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem" }}>
                    <Link href={`/admin/exams/${exam.id}/submissions`} className="btn" style={{ background: "#f1f5f9", color: "#1e293b", justifyContent: "center" }}>
                      <Users size={16} /> Submissions ({exam._count.submissions})
                    </Link>
                    <button onClick={() => handleDelete(exam.id, exam.title)} className="btn" style={{ background: "#fee2e2", color: "#dc2626", padding: "0.5rem" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Creating New Exam */}
        {showCreateModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
            <div style={{ background: "white", borderRadius: "1.25rem", width: "100%", maxWidth: "600px", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", maxHeight: "90vh", overflowY: "auto" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.25rem", color: "#0f172a" }}>
                Create New Assessment Exam
              </h2>

              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="input-label">Exam Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Physics Assessment 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="input-label">Description / Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Instructions for students taking this exam..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="input-label">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Deadline End Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="input-label">Timer (Mins)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Total Marks</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Pass Marks</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.passMarks}
                      onChange={(e) => setFormData({ ...formData, passMarks: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: "#2563eb" }}>
                    Create Exam & Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

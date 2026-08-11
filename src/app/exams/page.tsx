import Link from "next/link";
import { getStudentExamsAction } from "@/app/actions/examActions";
import { Clock, Calendar, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentExamsPage() {
  const result = await getStudentExamsAction();
  const exams = result.exams || [];
  const now = new Date();

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "2.5rem 0" }}>
      <div className="container">
        {/* Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "1.25rem",
          padding: "2.5rem 2rem",
          color: "white",
          marginBottom: "2.5rem",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(59, 130, 246, 0.2)", color: "#93c5fd", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "0.35rem 0.85rem", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                <CheckCircle2 size={16} /> Live Student Assessment System
              </div>
              <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
                Online Examination Portal
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "600px" }}>
                View your scheduled exams, take live timed assessments with automatic time keeping, and check your answer paper results.
              </p>
            </div>
            <Link
              href="/admin/exams"
              className="btn"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <ShieldCheck size={18} /> Admin Exam Management
            </Link>
          </div>
        </div>

        {/* Exams Grid */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#1e293b" }}>
          Available Assessment Sessions
        </h2>

        {exams.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "4rem 2rem",
            textAlign: "center",
            border: "1px dashed #cbd5e1"
          }}>
            <FileText size={48} color="#94a3b8" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
              No Active Exams Currently Scheduled
            </h3>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              Check back later or contact your instructor for upcoming exam dates.
            </p>
            <Link href="/admin/exams" className="btn btn-primary">
              Create an Exam (Admin)
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const start = new Date(exam.startTime);
              const end = new Date(exam.endTime);
              const isActive = now >= start && now <= end;
              const isUpcoming = now < start;
              const isEnded = now > end;

              return (
                <div
                  key={exam.id}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    border: isActive ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                    boxShadow: isActive ? "0 10px 25px -5px rgba(59, 130, 246, 0.15)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Status Tag */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "9999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      background: isActive ? "#dbeafe" : isUpcoming ? "#fef3c7" : "#f1f5f9",
                      color: isActive ? "#1d4ed8" : isUpcoming ? "#b45309" : "#64748b"
                    }}>
                      {isActive ? "🟢 Active Now" : isUpcoming ? "⏳ Upcoming" : "🔴 Closed"}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                      {exam.totalMarks} Marks
                    </span>
                  </div>

                  {/* Exam Details */}
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                    {exam.title}
                  </h3>
                  {exam.description && (
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem", flexGrow: 1 }}>
                      {exam.description}
                    </p>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", background: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                      <Calendar size={16} color="#3b82f6" />
                      <span><strong>Date:</strong> {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                      <Clock size={16} color="#3b82f6" />
                      <span><strong>Time:</strong> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                      <FileText size={16} color="#3b82f6" />
                      <span><strong>Duration:</strong> {exam.durationMinutes} Minutes ({exam._count.questions} Questions)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {isActive ? (
                    <Link
                      href={`/exams/${exam.id}/take`}
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "0.75rem", background: "#2563eb", borderRadius: "0.75rem" }}
                    >
                      Start Exam Now <ArrowRight size={18} />
                    </Link>
                  ) : isUpcoming ? (
                    <button disabled className="btn" style={{ width: "100%", padding: "0.75rem", background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" }}>
                      Not Started Yet
                    </button>
                  ) : (
                    <button disabled className="btn" style={{ width: "100%", padding: "0.75rem", background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" }}>
                      Exam Concluded
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

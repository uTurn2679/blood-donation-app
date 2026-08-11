"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getExamWithQuestionsAction, getExamSubmissionsAction, getSubmissionDetailsAction, gradeSubmissionAction } from "@/app/actions/examActions";
import { ArrowLeft, CheckCircle, Clock, FileCheck, Eye, Save, Award, MessageSquare } from "lucide-react";

export default function AdminExamSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params);

  const [exam, setExam] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active modal/drawer state for grading a student paper
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [manualMarks, setManualMarks] = useState<Record<string, number>>({});
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const examRes = await getExamWithQuestionsAction(examId);
    if (examRes.success && examRes.exam) {
      setExam(examRes.exam);
    }

    const subRes = await getExamSubmissionsAction(examId);
    if (subRes.success) {
      setSubmissions(subRes.submissions || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [examId]);

  const handleOpenGradingPaper = async (subId: string) => {
    const res = await getSubmissionDetailsAction(subId);
    if (res.success && res.submission) {
      setSelectedSubmission(res.submission);
      setTeacherFeedback(res.submission.feedback || "");

      // Initialize manual marks for written questions
      const initMarks: Record<string, number> = {};
      res.submission.answers.forEach((ans: any) => {
        if (ans.question.questionType === "TEXT") {
          initMarks[ans.questionId] = ans.marksObtained ?? 0;
        }
      });
      setManualMarks(initMarks);
    } else {
      alert("Failed to load submission paper details.");
    }
  };

  const handleSaveGrades = async () => {
    if (!selectedSubmission) return;

    setIsSaving(true);
    const res = await gradeSubmissionAction(selectedSubmission.id, manualMarks, teacherFeedback);
    if (res.success) {
      alert("Grade and feedback saved successfully!");
      setSelectedSubmission(null);
      loadData();
    } else {
      alert("Error saving grades: " + res.error);
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 0" }}>
        <div className="animate-spin" style={{ width: "40px", height: "40px", border: "4px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
        <p style={{ color: "#64748b" }}>Loading Student Answer Papers...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container" style={{ padding: "4rem 0" }}>
        <h2>Exam Not Found</h2>
        <Link href="/admin/exams" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Admin Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <Link href="/admin/exams" className="nav-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem", fontWeight: 600, color: "#64748b" }}>
          <ArrowLeft size={16} /> Back to Exam Dashboard
        </Link>

        {/* Header */}
        <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Answer Paper Review Portal</span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>{exam.title} - Student Submissions</h1>
          <p style={{ color: "#64748b" }}>
            Total Answer Papers: <strong>{submissions.length}</strong> • Total Questions: <strong>{exam.questions.length}</strong> • Maximum Score: <strong>{exam.totalMarks}</strong>
          </p>
        </div>

        {/* Submissions Table */}
        {submissions.length === 0 ? (
          <div style={{ background: "white", padding: "4rem 2rem", borderRadius: "1rem", textAlign: "center", border: "1px dashed #cbd5e1" }}>
            <FileCheck size={48} color="#94a3b8" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#334155", marginBottom: "0.5rem" }}>No Answer Papers Submitted Yet</h3>
            <p style={{ color: "#64748b" }}>As soon as students participate in this exam, their answer papers will appear here for grading.</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "1rem 1.5rem", fontWeight: 700 }}>Student Name</th>
                  <th style={{ padding: "1rem", fontWeight: 700 }}>Submission Time</th>
                  <th style={{ padding: "1rem", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "1rem", fontWeight: 700 }}>Score</th>
                  <th style={{ padding: "1rem 1.5rem", fontWeight: 700, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const isGraded = sub.status === "GRADED";
                  return (
                    <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{sub.studentName}</div>
                        {sub.studentEmail && <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{sub.studentEmail}</div>}
                      </td>
                      <td style={{ padding: "1rem", color: "#475569" }}>
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "In Progress"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.65rem",
                          borderRadius: "9999px",
                          background: isGraded ? "#dcfce7" : "#fef3c7",
                          color: isGraded ? "#15803d" : "#b45309"
                        }}>
                          {isGraded ? "GRADED" : "NEEDS REVIEW"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontWeight: 800, color: (sub.totalScore || 0) >= exam.passMarks ? "#16a34a" : "#dc2626" }}>
                        {sub.totalScore ?? 0} / {exam.totalMarks}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <button
                          onClick={() => handleOpenGradingPaper(sub.id)}
                          className="btn btn-primary"
                          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", background: "#2563eb" }}
                        >
                          <Eye size={15} /> Review & Grade Paper
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal / Drawer for Grading Answer Paper */}
        {selectedSubmission && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
            <div style={{ background: "white", borderRadius: "1.25rem", width: "100%", maxWidth: "850px", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Grading Student Answer Paper</span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
                    Student: {selectedSubmission.studentName}
                  </h2>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="btn btn-outline" style={{ padding: "0.4rem 0.8rem" }}>
                  Close
                </button>
              </div>

              {/* Answers Review List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                {selectedSubmission.exam.questions.map((q: any, idx: number) => {
                  const ans = selectedSubmission.answers.find((a: any) => a.questionId === q.id);

                  return (
                    <div key={q.id} style={{ background: "#f8fafc", borderRadius: "0.75rem", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>
                          Q{idx + 1}. {q.questionText} ({q.marks} Marks)
                        </span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: ans?.isCorrect ? "#16a34a" : ans?.isCorrect === false ? "#dc2626" : "#b45309" }}>
                          Type: {q.questionType}
                        </span>
                      </div>

                      {q.questionType === "MCQ" ? (
                        <div style={{ fontSize: "0.9rem", color: "#475569", marginTop: "0.5rem" }}>
                          <div><strong>Selected Option:</strong> {ans?.selectedOption || "None"}</div>
                          <div><strong>Correct Key:</strong> {q.correctAnswer}</div>
                          <div style={{ marginTop: "0.25rem", fontWeight: 700, color: ans?.isCorrect ? "#16a34a" : "#dc2626" }}>
                            Auto-graded Marks: {ans?.marksObtained || 0} / {q.marks}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: "0.5rem" }}>
                          <div style={{ background: "white", padding: "0.85rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#0f172a", marginBottom: "0.75rem" }}>
                            <strong>Student Response:</strong>
                            <p style={{ marginTop: "0.35rem", whiteSpace: "pre-wrap" }}>{ans?.writtenAnswer || "No response submitted."}</p>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <label style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e293b" }}>Assign Marks (Max {q.marks}):</label>
                            <input
                              type="number"
                              min={0}
                              max={q.marks}
                              step={0.5}
                              value={manualMarks[q.id] ?? (ans?.marksObtained ?? 0)}
                              onChange={(e) => setManualMarks({ ...manualMarks, [q.id]: Number(e.target.value) })}
                              className="input-field"
                              style={{ width: "100px", padding: "0.4rem 0.75rem" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Teacher Feedback input */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label className="input-label" style={{ fontWeight: 700 }}>Overall Teacher Feedback for Student</label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback or comments for the student..."
                  value={teacherFeedback}
                  onChange={(e) => setTeacherFeedback(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button onClick={() => setSelectedSubmission(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleSaveGrades} disabled={isSaving} className="btn btn-primary" style={{ background: "#2563eb" }}>
                  <Save size={16} /> {isSaving ? "Saving Grades..." : "Save Grades & Publish Paper"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

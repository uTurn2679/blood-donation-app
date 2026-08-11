"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getExamWithQuestionsAction, startStudentExamSubmissionAction, submitExamAnswersAction } from "@/app/actions/examActions";
import ExamTimer from "@/app/components/ExamTimer";
import { AlertCircle, CheckCircle, Clock, FileText, Send, User, Mail, Phone, Lock } from "lucide-react";

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Student info form state
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isStarted, setIsStarted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionStartTime, setSubmissionStartTime] = useState<string | null>(null);

  // Answers state: questionId -> { selectedOption?: string, writtenAnswer?: string }
  const [answers, setAnswers] = useState<Record<string, { selectedOption?: string; writtenAnswer?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadExam() {
      const res = await getExamWithQuestionsAction(examId);
      if (res.success && res.exam) {
        setExam(res.exam);
      } else {
        setError(res.error || "Failed to load exam details.");
      }
      setLoading(false);
    }
    loadExam();
  }, [examId]);

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInfo.name.trim()) {
      alert("Please enter your full name to begin.");
      return;
    }

    setLoading(true);
    const res = await startStudentExamSubmissionAction(examId, studentInfo);
    if (res.success && res.submissionId) {
      setSubmissionId(res.submissionId);
      setSubmissionStartTime(new Date(res.startTime).toISOString());
      setIsStarted(true);
    } else {
      setError(res.error || "Could not start exam.");
    }
    setLoading(false);
  };

  const handleOptionSelect = (questionId: string, optionText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOption: optionText,
      },
    }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        writtenAnswer: text,
      },
    }));
  };

  const handleSubmitPaper = async () => {
    if (!submissionId) return;

    const confirmSubmit = window.confirm("Are you sure you want to submit your answer paper now?");
    if (!confirmSubmit) return;

    executeSubmission();
  };

  const executeSubmission = async () => {
    if (!submissionId || isSubmitting) return;
    setIsSubmitting(true);

    const res = await submitExamAnswersAction(submissionId, answers);
    if (res.success) {
      router.push(`/exams/${examId}/result/${submissionId}`);
    } else {
      alert("Error submitting exam: " + (res.error || "Please try again."));
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="animate-spin" style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Loading Exam Room...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "2rem", borderRadius: "1rem", textAlign: "center" }}>
          <AlertCircle size={48} color="#dc2626" style={{ margin: "0 auto 1rem auto" }} />
          <h2 style={{ color: "#991b1b", marginBottom: "0.5rem" }}>Exam Unavailable</h2>
          <p style={{ color: "#7f1d1d", marginBottom: "1.5rem" }}>{error || "Exam not found"}</p>
          <button onClick={() => router.push("/exams")} className="btn btn-primary">
            Return to Exams Portal
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Student Information Entry before timer starts
  if (!isStarted) {
    return (
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "3rem 0" }}>
        <div className="container" style={{ maxWidth: "650px" }}>
          <div style={{ background: "white", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "2rem", color: "white" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(59, 130, 246, 0.2)", color: "#93c5fd", padding: "0.3rem 0.75rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                <Lock size={14} /> Student Verification
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
                {exam.title}
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                {exam.description || "Official Student Examination Portal"}
              </p>
            </div>

            <div style={{ padding: "2rem" }}>
              {/* Exam Metadata summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", background: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.75rem", textAlign: "center" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>DURATION</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{exam.durationMinutes} Mins</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>QUESTIONS</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{exam.questions.length}</span>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>TOTAL MARKS</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{exam.totalMarks}</span>
                </div>
              </div>

              <form onSubmit={handleStartExam}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
                    Student Full Name *
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                      className="input-field"
                      style={{ paddingLeft: "2.75rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
                    Student Email Address (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      placeholder="e.g. student@university.edu"
                      value={studentInfo.email}
                      onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                      className="input-field"
                      style={{ paddingLeft: "2.75rem" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
                    Student ID / Phone (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="e.g. 01700000000"
                      value={studentInfo.phone}
                      onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                      className="input-field"
                      style={{ paddingLeft: "2.75rem" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", fontWeight: 700, borderRadius: "0.75rem", background: "#2563eb" }}
                >
                  Start Exam & Countdown Timer <Clock size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Live Exam Room with questions and sticky countdown timer
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Sticky Header with Timer */}
      <div style={{ background: "rgba(15, 23, 42, 0.95)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40, padding: "0.75rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{exam.title}</h2>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Student: <strong style={{ color: "#60a5fa" }}>{studentInfo.name}</strong> • Progress: {answeredCount} / {exam.questions.length} Answered
            </p>
          </div>
          {submissionStartTime && (
            <ExamTimer
              startTime={submissionStartTime}
              durationMinutes={exam.durationMinutes}
              onTimeUp={() => {
                alert("Time is up! Your answers are being submitted automatically.");
                executeSubmission();
              }}
            />
          )}
        </div>
      </div>

      <div className="container" style={{ maxWidth: "850px", paddingTop: "2rem" }}>
        {/* Questions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {exam.questions.map((q: any, idx: number) => {
            let optionsList: string[] = [];
            if (q.questionType === "MCQ" && q.options) {
              try {
                optionsList = JSON.parse(q.options);
              } catch (e) {
                optionsList = [];
              }
            }

            const currentAns = answers[q.id] || {};

            return (
              <div
                key={q.id}
                style={{
                  background: "#1e293b",
                  border: currentAns.selectedOption || currentAns.writtenAnswer ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  padding: "1.75rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "0.25rem 0.65rem", borderRadius: "0.5rem" }}>
                    Question {idx + 1} of {exam.questions.length}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8" }}>
                    {q.marks} Marks
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#f8fafc", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                  {q.questionText}
                </h3>

                {/* MCQ Choices */}
                {q.questionType === "MCQ" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {optionsList.map((opt, optIdx) => {
                      const isSelected = currentAns.selectedOption === opt;
                      return (
                        <label
                          key={optIdx}
                          onClick={() => handleOptionSelect(q.id, opt)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.85rem",
                            padding: "0.85rem 1.15rem",
                            borderRadius: "0.75rem",
                            background: isSelected ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.03)",
                            border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(q.id, opt)}
                            style={{ width: "18px", height: "18px", accentColor: "#3b82f6" }}
                          />
                          <span style={{ color: isSelected ? "#93c5fd" : "#cbd5e1", fontSize: "0.95rem", fontWeight: isSelected ? 600 : 400 }}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* TEXT / Short Answer */}
                {q.questionType === "TEXT" && (
                  <div>
                    <textarea
                      rows={4}
                      placeholder="Type your written answer paper response here..."
                      value={currentAns.writtenAnswer || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="input-field"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        color: "#f8fafc",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "0.75rem",
                        padding: "1rem",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Submit Action */}
        <div style={{ marginTop: "2.5rem", background: "#1e293b", padding: "1.5rem 2rem", borderRadius: "1rem", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h4 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Finished Answering?</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              Make sure you have answered all questions before submitting your paper.
            </p>
          </div>
          <button
            onClick={handleSubmitPaper}
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              padding: "0.85rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
              background: "#2563eb",
              borderRadius: "0.75rem",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Submitting Paper..." : "Submit Answer Paper"} <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

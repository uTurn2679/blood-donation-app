"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  getExamWithQuestionsAction,
  addQuestionAction,
  addBulkQuestionsAction,
  deleteQuestionAction,
  deleteAllQuestionsAction,
  updateQuestionActionDetails,
} from "@/app/actions/examActions";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  Save,
  RotateCcw,
  Sliders,
  Edit3,
} from "lucide-react";

type GeneratedMCQItem = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
};

export default function AdminQuestionBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: examId } = use(params);

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"template" | "single">("template");

  // Template Auto-Generator Config State
  const [mcqCount, setMcqCount] = useState<number>(10);
  const [defaultMarks, setDefaultMarks] = useState<number>(1);
  const [defaultOptionCount, setDefaultOptionCount] = useState<number>(4);
  const [replaceExisting, setReplaceExisting] = useState<boolean>(false);
  const [includeSampleData, setIncludeSampleData] = useState<boolean>(true);

  // Auto-Generated Template Items State
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedMCQItem[]>([]);
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  // Single Question Form State
  const [singleQuestionText, setSingleQuestionText] = useState("");
  const [singleQuestionType, setSingleQuestionType] = useState<"MCQ" | "TEXT">("MCQ");
  const [singleOptions, setSingleOptions] = useState<string[]>(["Option A", "Option B", "Option C", "Option D"]);
  const [singleCorrectAnswer, setSingleCorrectAnswer] = useState<string>("Option A");
  const [singleMarks, setSingleMarks] = useState<number>(1);
  const [isSavingSingle, setIsSavingSingle] = useState(false);

  // Edit Inline State for existing questions
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ questionText: string; marks: number; options: string[]; correctAnswer: string }>({
    questionText: "",
    marks: 1,
    options: [],
    correctAnswer: "",
  });

  const loadExam = async () => {
    setLoading(true);
    const res = await getExamWithQuestionsAction(examId);
    if (res.success && res.exam) {
      setExam(res.exam);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExam();
  }, [examId]);

  // Initial Auto-Generation of Template when component loads
  useEffect(() => {
    if (generatedTemplate.length === 0) {
      handleGenerateTemplate(10, 1, 4, true);
    }
  }, []);

  const handleGenerateTemplate = (count: number, marks: number, optionCount: number, fillSample: boolean) => {
    const validCount = Math.min(Math.max(1, count), 100);
    const items: GeneratedMCQItem[] = [];

    const alphabet = ["A", "B", "C", "D", "E", "F"];

    for (let i = 1; i <= validCount; i++) {
      const opts: string[] = [];
      for (let j = 0; j < optionCount; j++) {
        const letter = alphabet[j] || `Opt ${j + 1}`;
        opts.push(fillSample ? `Choice ${letter}` : `Option ${letter}`);
      }

      items.push({
        id: `temp-${Date.now()}-${i}`,
        questionText: fillSample ? `Sample Question ${i}: What is the correct answer?` : `Question ${i}`,
        options: opts,
        correctAnswer: opts[0] || "",
        marks: marks,
      });
    }

    setGeneratedTemplate(items);
  };

  const handleUpdateTemplateItem = (index: number, field: keyof GeneratedMCQItem, value: any) => {
    const updated = [...generatedTemplate];
    updated[index] = { ...updated[index], [field]: value };
    setGeneratedTemplate(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    const updated = [...generatedTemplate];
    const item = { ...updated[qIndex] };
    const oldOpt = item.options[optIndex];
    const newOptions = [...item.options];
    newOptions[optIndex] = val;
    item.options = newOptions;

    if (item.correctAnswer === oldOpt) {
      item.correctAnswer = val;
    }
    updated[qIndex] = item;
    setGeneratedTemplate(updated);
  };

  const handleAddOptionToTemplateItem = (qIndex: number) => {
    const updated = [...generatedTemplate];
    const item = { ...updated[qIndex] };
    if (item.options.length >= 6) {
      alert("Maximum 6 options allowed per MCQ question.");
      return;
    }
    const newOptName = `Option ${String.fromCharCode(65 + item.options.length)}`;
    item.options = [...item.options, newOptName];
    updated[qIndex] = item;
    setGeneratedTemplate(updated);
  };

  const handleRemoveOptionFromTemplateItem = (qIndex: number, optIndex: number) => {
    const updated = [...generatedTemplate];
    const item = { ...updated[qIndex] };
    if (item.options.length <= 2) {
      alert("At least 2 options are required for an MCQ question.");
      return;
    }
    const removedOpt = item.options[optIndex];
    item.options = item.options.filter((_, idx) => idx !== optIndex);
    if (item.correctAnswer === removedOpt) {
      item.correctAnswer = item.options[0] || "";
    }
    updated[qIndex] = item;
    setGeneratedTemplate(updated);
  };

  const handleRemoveTemplateItem = (qIndex: number) => {
    if (generatedTemplate.length <= 1) {
      alert("Template must contain at least 1 question.");
      return;
    }
    setGeneratedTemplate(generatedTemplate.filter((_, idx) => idx !== qIndex));
  };

  const handleAddTemplateItem = () => {
    if (generatedTemplate.length >= 100) {
      alert("Maximum 100 questions limit reached!");
      return;
    }
    const nextNum = generatedTemplate.length + 1;
    const opts = ["Choice A", "Choice B", "Choice C", "Choice D"];
    setGeneratedTemplate([
      ...generatedTemplate,
      {
        id: `temp-${Date.now()}-${nextNum}`,
        questionText: `Question ${nextNum}`,
        options: opts,
        correctAnswer: opts[0],
        marks: defaultMarks,
      },
    ]);
  };

  const handleApplyGlobalMarks = (marksVal: number) => {
    setGeneratedTemplate(generatedTemplate.map((q) => ({ ...q, marks: marksVal })));
  };

  const handleSaveBulkTemplate = async () => {
    if (generatedTemplate.length === 0) {
      alert("No questions in template to save.");
      return;
    }

    if (generatedTemplate.length > 100) {
      alert("Cannot save more than 100 questions.");
      return;
    }

    // Check if any question text is empty
    const emptyItem = generatedTemplate.find((q) => !q.questionText.trim());
    if (emptyItem) {
      alert("Please ensure all questions in the template have question text entered.");
      return;
    }

    const currentCount = exam?.questions?.length || 0;
    if (!replaceExisting && currentCount + generatedTemplate.length > 100) {
      alert(
        `Cannot add ${generatedTemplate.length} questions. Total questions will exceed the 100 max limit (Current: ${currentCount}). Check 'Replace existing questions' to overwrite.`
      );
      return;
    }

    const confirmMsg = replaceExisting
      ? `Are you sure you want to REPLACE all ${currentCount} existing questions with these ${generatedTemplate.length} new MCQs?`
      : `Save all ${generatedTemplate.length} generated MCQ questions to this exam set?`;

    if (!window.confirm(confirmMsg)) return;

    setIsSavingBulk(true);

    const questionsToSubmit = generatedTemplate.map((q) => ({
      questionText: q.questionText,
      questionType: "MCQ" as const,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: Number(q.marks),
    }));

    const res = await addBulkQuestionsAction(examId, questionsToSubmit, replaceExisting);

    if (res.success) {
      alert(`Successfully saved ${res.count} MCQ questions!`);
      loadExam();
    } else {
      alert("Error saving MCQ set: " + res.error);
    }
    setIsSavingBulk(false);
  };

  // Single Question Handlers
  const handleAddSingleQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleQuestionText.trim()) {
      alert("Please enter question text.");
      return;
    }

    if (exam.questions.length >= 100) {
      alert("Maximum 100 question limit reached for this exam set.");
      return;
    }

    setIsSavingSingle(true);
    const res = await addQuestionAction({
      examId,
      questionText: singleQuestionText,
      questionType: singleQuestionType,
      options: singleQuestionType === "MCQ" ? singleOptions.filter((o) => o.trim() !== "") : undefined,
      correctAnswer: singleQuestionType === "MCQ" ? singleCorrectAnswer : undefined,
      marks: Number(singleMarks),
    });

    if (res.success) {
      setSingleQuestionText("");
      setSingleOptions(["Option A", "Option B", "Option C", "Option D"]);
      setSingleCorrectAnswer("Option A");
      loadExam();
    } else {
      alert("Failed to add question: " + res.error);
    }
    setIsSavingSingle(false);
  };

  // Delete Handlers
  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    const res = await deleteQuestionAction(qId, examId);
    if (res.success) {
      loadExam();
    } else {
      alert("Failed to delete question.");
    }
  };

  const handleDeleteAllQuestions = async () => {
    if (!window.confirm("WARNING: Are you sure you want to DELETE ALL questions from this exam set?")) return;
    const res = await deleteAllQuestionsAction(examId);
    if (res.success) {
      loadExam();
    } else {
      alert("Failed to delete all questions.");
    }
  };

  // Edit Inline Existing Question
  const handleStartEditExisting = (q: any) => {
    setEditingQId(q.id);
    let parsed: string[] = [];
    if (q.options) {
      try {
        parsed = JSON.parse(q.options);
      } catch (e) {
        parsed = [];
      }
    }
    setEditForm({
      questionText: q.questionText,
      marks: q.marks,
      options: parsed.length > 0 ? parsed : ["Option A", "Option B"],
      correctAnswer: q.correctAnswer || (parsed[0] ?? ""),
    });
  };

  const handleSaveEditExisting = async (qId: string) => {
    const res = await updateQuestionActionDetails(qId, examId, {
      questionText: editForm.questionText,
      marks: editForm.marks,
      options: editForm.options,
      correctAnswer: editForm.correctAnswer,
    });
    if (res.success) {
      setEditingQId(null);
      loadExam();
    } else {
      alert("Failed to update question details.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 0" }}>
        <div className="animate-spin" style={{ width: "40px", height: "40px", border: "4px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
        <p style={{ color: "#64748b" }}>Loading MCQ Question Set Builder...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container" style={{ padding: "4rem 0" }}>
        <h2>Exam Not Found</h2>
        <Link href="/admin/exams" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Admin Exams</Link>
      </div>
    );
  }

  const questionCount = exam.questions?.length || 0;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "2.5rem 0" }}>
      <div className="container" style={{ maxWidth: "950px" }}>
        <Link href="/admin/exams" className="nav-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem", fontWeight: 600, color: "#64748b" }}>
          <ArrowLeft size={16} /> Back to Exam Dashboard
        </Link>

        {/* Exam Title Header */}
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", background: "#dbeafe", padding: "0.2rem 0.6rem", borderRadius: "9999px", textTransform: "uppercase" }}>
                MCQ Question Set Builder
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: questionCount >= 100 ? "#dc2626" : "#059669", background: questionCount >= 100 ? "#fee2e2" : "#d1fae5", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
                {questionCount} / 100 MCQs Max
              </span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>{exam.title}</h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Duration: <strong>{exam.durationMinutes} mins</strong> • Current Questions: <strong>{questionCount}</strong> • Total Marks: <strong>{exam.totalMarks}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href={`/admin/exams/${examId}/submissions`} className="btn btn-outline">
              Submissions ({exam._count.submissions})
            </Link>
          </div>
        </div>

        {/* Builder Mode Selector Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("template")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              background: activeTab === "template" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "template" ? "white" : "#475569",
              transition: "all 0.2s ease",
            }}
          >
            <Sparkles size={18} /> Bulk Auto-Generate MCQ Template (Up to 100)
          </button>
          <button
            onClick={() => setActiveTab("single")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              background: activeTab === "single" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "single" ? "white" : "#475569",
              transition: "all 0.2s ease",
            }}
          >
            <Plus size={18} /> Add Single Question
          </button>
        </div>

        {/* TAB 1: BULK AUTO-GENERATE TEMPLATE */}
        {activeTab === "template" && (
          <div>
            {/* Auto-Generator Config Box */}
            <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sliders size={20} color="#2563eb" /> MCQ Set Generator Settings
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Choose question count (1 - 100), option count, and default marks to generate your exam template.
                  </p>
                </div>

                {/* Quick Selection Preset Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Quick Set:</span>
                  {[5, 10, 20, 25, 50, 100].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        setMcqCount(cnt);
                        handleGenerateTemplate(cnt, defaultMarks, defaultOptionCount, includeSampleData);
                      }}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "0.5rem",
                        border: mcqCount === cnt ? "1px solid #2563eb" : "1px solid #cbd5e1",
                        background: mcqCount === cnt ? "#dbeafe" : "white",
                        color: mcqCount === cnt ? "#1d4ed8" : "#334155",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {cnt} MCQs
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="input-label">How many MCQs? (Max 100) *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={mcqCount}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(1, Number(e.target.value)));
                      setMcqCount(val);
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Default Marks / Question</label>
                  <input
                    type="number"
                    min={1}
                    value={defaultMarks}
                    onChange={(e) => {
                      const m = Math.max(1, Number(e.target.value));
                      setDefaultMarks(m);
                      handleApplyGlobalMarks(m);
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Options per MCQ</label>
                  <select
                    value={defaultOptionCount}
                    onChange={(e) => setDefaultOptionCount(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={2}>2 Choices (A, B)</option>
                    <option value={3}>3 Choices (A, B, C)</option>
                    <option value={4}>4 Choices (A, B, C, D)</option>
                    <option value={5}>5 Choices (A, B, C, D, E)</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeSampleData}
                      onChange={(e) => setIncludeSampleData(e.target.checked)}
                      style={{ width: "16px", height: "16px", accentColor: "#2563eb" }}
                    />
                    Pre-fill sample questions
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleGenerateTemplate(mcqCount, defaultMarks, defaultOptionCount, includeSampleData)}
                  className="btn btn-primary"
                  style={{ background: "#2563eb", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <RotateCcw size={16} /> Auto-Generate Template ({mcqCount} MCQs)
                </button>
              </div>
            </div>

            {/* Generated Template Items Form & Batch Action Bar */}
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "1.25rem", borderRadius: "1rem", marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e3a8a" }}>
                  Template Ready: {generatedTemplate.length} MCQ Questions
                </span>
                <p style={{ fontSize: "0.85rem", color: "#1e40af" }}>
                  Fill or customize questions below, then click &quot;Save All generated MCQs to Exam&quot;.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#1e3a8a", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#2563eb" }}
                  />
                  Replace existing questions ({questionCount})
                </label>

                <button
                  type="button"
                  onClick={handleSaveBulkTemplate}
                  disabled={isSavingBulk}
                  className="btn"
                  style={{ background: "#16a34a", color: "white", fontWeight: 700, padding: "0.7rem 1.4rem", borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgba(22, 163, 74, 0.3)" }}
                >
                  <Save size={18} /> {isSavingBulk ? "Saving MCQ Set..." : `Save All ${generatedTemplate.length} MCQs to Exam`}
                </button>
              </div>
            </div>

            {/* Template Questions Cards List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {generatedTemplate.map((item, qIdx) => (
                <div
                  key={item.id || qIdx}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    border: "1px solid #cbd5e1",
                    padding: "1.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ background: "#2563eb", color: "white", fontWeight: 800, fontSize: "0.85rem", padding: "0.25rem 0.65rem", borderRadius: "0.5rem" }}>
                        MCQ #{qIdx + 1}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                        Marks:
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={item.marks}
                        onChange={(e) => handleUpdateTemplateItem(qIdx, "marks", Number(e.target.value))}
                        style={{ width: "60px", padding: "0.25rem 0.5rem", borderRadius: "0.4rem", border: "1px solid #cbd5e1", fontSize: "0.85rem", fontWeight: 700 }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTemplateItem(qIdx)}
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.45rem", borderRadius: "0.5rem", cursor: "pointer" }}
                      title="Remove question from template"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label className="input-label" style={{ fontSize: "0.85rem" }}>Question Text #{qIdx + 1}</label>
                    <input
                      type="text"
                      required
                      value={item.questionText}
                      onChange={(e) => handleUpdateTemplateItem(qIdx, "questionText", e.target.value)}
                      placeholder={`Enter question #${qIdx + 1}...`}
                      className="input-field"
                    />
                  </div>

                  {/* MCQ Options */}
                  <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #f1f5f9" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: "0.6rem", display: "block" }}>
                      Choices / Options (Select radio button to mark correct answer key)
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      {item.options.map((opt, oIdx) => {
                        const isCorrect = item.correctAnswer === opt;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              background: isCorrect ? "#f0fdf4" : "white",
                              border: isCorrect ? "1px solid #86efac" : "1px solid #e2e8f0",
                              padding: "0.4rem 0.6rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <input
                              type="radio"
                              name={`correctKey-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => handleUpdateTemplateItem(qIdx, "correctAnswer", opt)}
                              style={{ width: "18px", height: "18px", accentColor: "#16a34a", cursor: "pointer" }}
                              title="Set as correct answer key"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              placeholder={`Option ${oIdx + 1}`}
                              style={{
                                border: "none",
                                outline: "none",
                                width: "100%",
                                background: "transparent",
                                fontSize: "0.9rem",
                                fontWeight: isCorrect ? 700 : 400,
                                color: isCorrect ? "#15803d" : "#0f172a",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionFromTemplateItem(qIdx, oIdx)}
                              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: "0.2rem" }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddOptionToTemplateItem(qIdx)}
                      style={{ background: "white", border: "1px dashed #cbd5e1", color: "#2563eb", padding: "0.35rem 0.75rem", borderRadius: "0.4rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      + Add Option Choice
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add & Save Action buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <button
                type="button"
                onClick={handleAddTemplateItem}
                className="btn btn-outline"
                style={{ background: "white" }}
              >
                <Plus size={16} /> Add Another MCQ (+1)
              </button>

              <button
                type="button"
                onClick={handleSaveBulkTemplate}
                disabled={isSavingBulk}
                className="btn"
                style={{ background: "#16a34a", color: "white", fontWeight: 800, padding: "0.85rem 2rem", borderRadius: "0.75rem" }}
              >
                <Save size={20} /> {isSavingBulk ? "Saving MCQ Set..." : `Save All ${generatedTemplate.length} MCQ Questions`}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SINGLE QUESTION ADDER */}
        {activeTab === "single" && (
          <div style={{ background: "white", padding: "2rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={20} color="#2563eb" /> Add Single Exam Question
            </h2>

            <form onSubmit={handleAddSingleQuestion}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="input-label">Question Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter question prompt..."
                  value={singleQuestionText}
                  onChange={(e) => setSingleQuestionText(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="input-label">Question Type</label>
                  <select
                    value={singleQuestionType}
                    onChange={(e: any) => setSingleQuestionType(e.target.value)}
                    className="input-field"
                  >
                    <option value="MCQ">Multiple Choice Question (MCQ)</option>
                    <option value="TEXT">Short Written Response / Essay</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Marks</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={singleMarks}
                    onChange={(e) => setSingleMarks(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              {singleQuestionType === "MCQ" && (
                <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #f1f5f9", marginBottom: "1.5rem" }}>
                  <label className="input-label" style={{ marginBottom: "0.75rem", display: "block" }}>
                    Options & Answer Key (Select radio button for correct answer)
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                    {singleOptions.map((opt, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <input
                          type="radio"
                          name="singleCorrectOpt"
                          checked={singleCorrectAnswer === opt}
                          onChange={() => setSingleCorrectAnswer(opt)}
                          style={{ width: "18px", height: "18px", accentColor: "#2563eb", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const updated = [...singleOptions];
                            const oldVal = updated[idx];
                            updated[idx] = e.target.value;
                            setSingleOptions(updated);
                            if (singleCorrectAnswer === oldVal) setSingleCorrectAnswer(e.target.value);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="input-field"
                          style={{ background: "white" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingSingle}
                className="btn btn-primary"
                style={{ background: "#2563eb", padding: "0.75rem 1.5rem", borderRadius: "0.75rem" }}
              >
                {isSavingSingle ? "Saving..." : "Save Question to Exam"}
              </button>
            </form>
          </div>
        )}

        {/* LIST OF SAVED EXISTING QUESTIONS IN EXAM */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
              Current Exam Questions ({questionCount} / 100)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              All saved questions in this exam paper.
            </p>
          </div>

          {questionCount > 0 && (
            <button
              onClick={handleDeleteAllQuestions}
              style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", padding: "0.45rem 0.85rem", borderRadius: "0.6rem", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Trash2 size={14} /> Clear All Questions
            </button>
          )}
        </div>

        {questionCount === 0 ? (
          <div style={{ background: "white", padding: "3rem 2rem", borderRadius: "1.25rem", textAlign: "center", border: "1px dashed #cbd5e1" }}>
            <FileSpreadsheet size={48} color="#94a3b8" style={{ margin: "0 auto 1rem auto" }} />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>No Questions Added Yet</h4>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Use the Auto-Generate Template above to quickly add 1 to 100 MCQ questions.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {exam.questions.map((q: any, idx: number) => {
              let parsedOptions: string[] = [];
              if (q.questionType === "MCQ" && q.options) {
                try {
                  parsedOptions = JSON.parse(q.options);
                } catch (e) {
                  parsedOptions = [];
                }
              }

              const isEditing = editingQId === q.id;

              return (
                <div
                  key={q.id}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    border: "1px solid #e2e8f0",
                    padding: "1.5rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 800, background: "#dbeafe", color: "#1d4ed8", padding: "0.25rem 0.65rem", borderRadius: "0.5rem" }}>
                        Q{idx + 1} • {q.questionType}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                        {q.marks} Marks
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditExisting(q)}
                          style={{ background: "#f1f5f9", color: "#334155", border: "none", padding: "0.45rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEditExisting(q.id)}
                          style={{ background: "#dcfce7", color: "#15803d", border: "none", padding: "0.45rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <Save size={14} /> Save
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.45rem", borderRadius: "0.5rem", cursor: "pointer" }}
                        title="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editForm.questionText}
                        onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                        className="input-field"
                        style={{ marginBottom: "0.75rem", fontWeight: 600 }}
                      />
                      {q.questionType === "MCQ" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {editForm.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <input
                                type="radio"
                                name={`editKey-${q.id}`}
                                checked={editForm.correctAnswer === opt}
                                onChange={() => setEditForm({ ...editForm, correctAnswer: opt })}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...editForm.options];
                                  const oldV = updated[oIdx];
                                  updated[oIdx] = e.target.value;
                                  setEditForm({
                                    ...editForm,
                                    options: updated,
                                    correctAnswer: editForm.correctAnswer === oldV ? e.target.value : editForm.correctAnswer,
                                  });
                                }}
                                className="input-field"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                        {q.questionText}
                      </h4>

                      {q.questionType === "MCQ" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem" }}>
                          {parsedOptions.map((opt, oIdx) => {
                            const isCorrect = q.correctAnswer === opt;
                            return (
                              <div
                                key={oIdx}
                                style={{
                                  padding: "0.6rem 0.85rem",
                                  borderRadius: "0.5rem",
                                  background: isCorrect ? "#dcfce7" : "#f8fafc",
                                  border: isCorrect ? "1px solid #86efac" : "1px solid #f1f5f9",
                                  color: isCorrect ? "#166534" : "#475569",
                                  fontSize: "0.875rem",
                                  fontWeight: isCorrect ? 700 : 400,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.4rem",
                                }}
                              >
                                {isCorrect && <CheckCircle2 size={14} color="#166534" />}
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
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

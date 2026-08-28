"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateExamInput = {
  title: string;
  description?: string;
  startTime: string; // ISO or datetime-local
  endTime: string;   // ISO or datetime-local
  durationMinutes: number;
  totalMarks?: number;
  passMarks?: number;
};

export async function createExamAction(input: CreateExamInput) {
  try {
    const exam = await prisma.exam.create({
      data: {
        title: input.title,
        description: input.description || "",
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        durationMinutes: Number(input.durationMinutes),
        totalMarks: Number(input.totalMarks || 100),
        passMarks: Number(input.passMarks || 40),
        isPublished: true,
      },
    });
    revalidatePath("/admin/exams");
    revalidatePath("/exams");
    return { success: true, exam };
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return { success: false, error: error?.message || "Failed to create exam" };
  }
}

export async function updateExamAction(id: string, input: Partial<CreateExamInput> & { isPublished?: boolean }) {
  try {
    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.startTime) updateData.startTime = new Date(input.startTime);
    if (input.endTime) updateData.endTime = new Date(input.endTime);
    if (input.durationMinutes !== undefined) updateData.durationMinutes = Number(input.durationMinutes);
    if (input.totalMarks !== undefined) updateData.totalMarks = Number(input.totalMarks);
    if (input.passMarks !== undefined) updateData.passMarks = Number(input.passMarks);
    if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;

    const exam = await prisma.exam.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/admin/exams");
    revalidatePath(`/admin/exams/${id}`);
    revalidatePath("/exams");
    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update exam" };
  }
}

export async function deleteExamAction(id: string) {
  try {
    await prisma.exam.delete({
      where: { id },
    });
    revalidatePath("/admin/exams");
    revalidatePath("/exams");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete exam" };
  }
}

export type AddQuestionInput = {
  examId: string;
  questionText: string;
  questionType: "MCQ" | "TEXT";
  options?: string[]; // Array of option strings
  correctAnswer?: string;
  marks: number;
};

export async function addQuestionAction(input: AddQuestionInput) {
  try {
    // get total questions count to calculate order
    const existingCount = await prisma.question.count({
      where: { examId: input.examId },
    });

    const question = await prisma.question.create({
      data: {
        examId: input.examId,
        questionText: input.questionText,
        questionType: input.questionType,
        options: input.options ? JSON.stringify(input.options) : null,
        correctAnswer: input.correctAnswer || null,
        marks: Number(input.marks),
        order: existingCount + 1,
      },
    });

    // Update total marks on the exam
    const totalExamMarks = await prisma.question.aggregate({
      where: { examId: input.examId },
      _sum: { marks: true },
    });

    if (totalExamMarks._sum.marks) {
      await prisma.exam.update({
        where: { id: input.examId },
        data: { totalMarks: totalExamMarks._sum.marks },
      });
    }

    revalidatePath(`/admin/exams/${input.examId}`);
    return { success: true, question };
  } catch (error: any) {
    console.error("Error adding question:", error);
    return { success: false, error: error?.message || "Failed to add question" };
  }
}

export async function addBulkQuestionsAction(
  examId: string,
  questions: {
    questionText: string;
    questionType: "MCQ" | "TEXT";
    options?: string[];
    correctAnswer?: string;
    marks: number;
  }[],
  replaceExisting: boolean = false
) {
  try {
    if (!questions || questions.length === 0) {
      return { success: false, error: "No questions provided to add." };
    }

    if (questions.length > 100) {
      return { success: false, error: "Maximum 100 MCQ questions allowed per batch template." };
    }

    if (replaceExisting) {
      await prisma.question.deleteMany({
        where: { examId },
      });
    }

    const existingCount = replaceExisting
      ? 0
      : await prisma.question.count({
          where: { examId },
        });

    if (!replaceExisting && (existingCount + questions.length > 100)) {
      return {
        success: false,
        error: `Cannot add ${questions.length} questions. Exceeds the maximum limit of 100 questions per exam (Current: ${existingCount}).`,
      };
    }

    const createData = questions.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 9)}`,
      examId,
      questionText: q.questionText.trim() || `Question ${existingCount + idx + 1}`,
      questionType: q.questionType || "MCQ",
      options: q.options && q.options.length > 0 ? JSON.stringify(q.options) : null,
      correctAnswer: q.correctAnswer || (q.options && q.options.length > 0 ? q.options[0] : null),
      marks: Number(q.marks || 1),
      order: existingCount + idx + 1,
    }));

    await prisma.question.createMany({
      data: createData,
    });

    const totalExamMarks = await prisma.question.aggregate({
      where: { examId },
      _sum: { marks: true },
    });

    await prisma.exam.update({
      where: { id: examId },
      data: { totalMarks: totalExamMarks._sum.marks || 0 },
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true, count: createData.length };
  } catch (error: any) {
    console.error("Error bulk adding questions:", error);
    return { success: false, error: error?.message || "Failed to add bulk questions" };
  }
}

export async function updateQuestionActionDetails(
  questionId: string,
  examId: string,
  input: {
    questionText?: string;
    questionType?: "MCQ" | "TEXT";
    options?: string[];
    correctAnswer?: string;
    marks?: number;
  }
) {
  try {
    const updateData: any = {};
    if (input.questionText !== undefined) updateData.questionText = input.questionText;
    if (input.questionType !== undefined) updateData.questionType = input.questionType;
    if (input.options !== undefined) updateData.options = JSON.stringify(input.options);
    if (input.correctAnswer !== undefined) updateData.correctAnswer = input.correctAnswer;
    if (input.marks !== undefined) updateData.marks = Number(input.marks);

    await prisma.question.update({
      where: { id: questionId },
      data: updateData,
    });

    const totalExamMarks = await prisma.question.aggregate({
      where: { examId },
      _sum: { marks: true },
    });

    await prisma.exam.update({
      where: { id: examId },
      data: { totalMarks: totalExamMarks._sum.marks || 0 },
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update question" };
  }
}

export async function deleteAllQuestionsAction(examId: string) {
  try {
    await prisma.question.deleteMany({
      where: { examId },
    });

    await prisma.exam.update({
      where: { id: examId },
      data: { totalMarks: 0 },
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete questions" };
  }
}

export async function deleteQuestionAction(questionId: string, examId: string) {
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });

    // Recalculate total marks
    const totalExamMarks = await prisma.question.aggregate({
      where: { examId },
      _sum: { marks: true },
    });

    await prisma.exam.update({
      where: { id: examId },
      data: { totalMarks: totalExamMarks._sum.marks || 0 },
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete question" };
  }
}


export async function getStudentExamsAction() {
  try {
    const exams = await prisma.exam.findMany({
      where: { isPublished: true },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { startTime: "asc" },
    });
    return { success: true, exams };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch exams", exams: [] };
  }
}

export async function startStudentExamSubmissionAction(examId: string, studentInfo: { name: string; email?: string; phone?: string }) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true },
    });

    if (!exam) throw new Error("Exam not found");

    const now = new Date();
    if (now < new Date(exam.startTime)) {
      throw new Error("This exam has not started yet.");
    }
    if (now > new Date(exam.endTime)) {
      throw new Error("This exam deadline has passed.");
    }

    // Check if student already has an in-progress submission
    let submission = await prisma.examSubmission.findFirst({
      where: {
        examId,
        studentName: studentInfo.name,
        status: "IN_PROGRESS",
      },
    });

    if (!submission) {
      submission = await prisma.examSubmission.create({
        data: {
          examId,
          studentName: studentInfo.name,
          studentEmail: studentInfo.email || null,
          studentPhone: studentInfo.phone || null,
          startTime: new Date(),
          status: "IN_PROGRESS",
        },
      });
    }

    return { success: true, submissionId: submission.id, startTime: submission.startTime };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to start exam" };
  }
}

export type SubmitAnswersMap = Record<
  string,
  { selectedOption?: string; writtenAnswer?: string }
>;

export async function submitExamAnswersAction(submissionId: string, answersMap: SubmitAnswersMap) {
  try {
    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: {
          include: { questions: true },
        },
      },
    });

    if (!submission) throw new Error("Submission not found");
    if (submission.status !== "IN_PROGRESS") {
      return { success: true, submissionId, message: "Exam already submitted" };
    }

    let calculatedScore = 0;
    let hasWrittenQuestions = false;

    // Delete any existing transient answers for safety
    await prisma.studentAnswer.deleteMany({
      where: { submissionId },
    });

    for (const question of submission.exam.questions) {
      const studentAns = answersMap[question.id];
      let isCorrect: boolean | null = null;
      let marksObtained: number | null = null;

      if (question.questionType === "MCQ") {
        const selected = studentAns?.selectedOption || "";
        if (selected && question.correctAnswer && selected.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
          isCorrect = true;
          marksObtained = question.marks;
          calculatedScore += question.marks;
        } else {
          isCorrect = false;
          marksObtained = 0;
        }
      } else {
        // TEXT question needs manual review
        hasWrittenQuestions = true;
      }

      await prisma.studentAnswer.create({
        data: {
          submissionId,
          questionId: question.id,
          selectedOption: studentAns?.selectedOption || null,
          writtenAnswer: studentAns?.writtenAnswer || null,
          isCorrect,
          marksObtained,
        },
      });
    }

    const updatedStatus = hasWrittenQuestions ? "SUBMITTED" : "GRADED";

    const updatedSubmission = await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        submittedAt: new Date(),
        totalScore: calculatedScore,
        status: updatedStatus,
      },
    });

    revalidatePath(`/exams/${submission.examId}/result/${submissionId}`);
    return { success: true, submissionId: updatedSubmission.id, score: calculatedScore, status: updatedStatus };
  } catch (error: any) {
    console.error("Error submitting exam:", error);
    return { success: false, error: error?.message || "Failed to submit exam" };
  }
}

export async function getAdminExamsAction() {
  try {
    let exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: { questions: true, submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (exams.length === 0) {
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.exam.create({
        data: {
          title: "MCQ Assessment Exam Set 1",
          description: "Default MCQ assessment session. Click 'Manage Questions / Set 100 MCQs' to build question set.",
          startTime: now,
          endTime: nextMonth,
          durationMinutes: 30,
          totalMarks: 100,
          passMarks: 40,
          isPublished: true,
        },
      });

      exams = await prisma.exam.findMany({
        include: {
          _count: {
            select: { questions: true, submissions: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return { success: true, exams };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch admin exams", exams: [] };
  }
}

export async function getExamWithQuestionsAction(examId: string) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });
    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load exam details" };
  }
}

export async function getExamSubmissionsAction(examId: string) {
  try {
    const submissions = await prisma.examSubmission.findMany({
      where: { examId },
      include: {
        answers: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, submissions };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch submissions", submissions: [] };
  }
}

export async function getSubmissionDetailsAction(submissionId: string) {
  try {
    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: {
          include: {
            questions: {
              orderBy: { order: "asc" },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });
    return { success: true, submission };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch submission" };
  }
}

export async function gradeSubmissionAction(submissionId: string, manualMarks: Record<string, number>, feedback?: string) {
  try {
    let totalScore = 0;

    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: { answers: true },
    });

    if (!submission) throw new Error("Submission not found");

    for (const answer of submission.answers) {
      if (answer.questionId in manualMarks) {
        const assignedMarks = Number(manualMarks[answer.questionId] || 0);
        await prisma.studentAnswer.update({
          where: { id: answer.id },
          data: {
            marksObtained: assignedMarks,
            isCorrect: assignedMarks > 0,
          },
        });
        totalScore += assignedMarks;
      } else {
        totalScore += Number(answer.marksObtained || 0);
      }
    }

    await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        totalScore,
        status: "GRADED",
        feedback: feedback || null,
      },
    });

    revalidatePath(`/admin/exams/${submission.examId}/submissions`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to grade submission" };
  }
}

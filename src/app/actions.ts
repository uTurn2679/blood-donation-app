"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function registerDonor(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const password = (formData.get("password") as string) || "password123"; 
  const bloodGroup = formData.get("bloodGroup") as string;
  
  const location = formData.get("location") as string | null;
  const department = formData.get("department") as string | null;
  const session = formData.get("session") as string | null;

  if (!name || !phone || !bloodGroup) {
    throw new Error("Missing required fields (Name, Phone, Blood Group)");
  }

  // Dynamically import prisma to prevent Vercel Turbopack build crash
  const { prisma } = await import("@/lib/prisma");

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingUser) {
    // Optionally handle this gracefully
    throw new Error("Phone number already registered.");
  }

  // Create User and DonorProfile
  await prisma.user.create({
    data: {
      name,
      phone,
      password, // In a real app, hash this with bcrypt!
      role: "DONOR",
      donorProfile: {
        create: {
          bloodGroup,
          ...(location && { location }),
          ...(department && { department }),
          ...(session && { session }),
        },
      },
    },
  });

  redirect("/search?bg=" + encodeURIComponent(bloodGroup));
}

export async function submitBloodRequest(formData: FormData) {
  const patientName = formData.get("patientName") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const bloodGroup = formData.get("bloodGroup") as string;
  const location = formData.get("location") as string;
  const urgency = formData.get("urgency") as string;
  const phone = formData.get("phone") as string; // user phone

  if (!patientName || !contactPhone || !bloodGroup || !location || !urgency || !phone) {
    throw new Error("Missing fields");
  }

  // Dynamically import prisma to prevent Vercel Turbopack build crash
  const { prisma } = await import("@/lib/prisma");

  // Ensure user exists (simple logic for MVP: create a temporary USER if they don't exist)
  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Guest",
        phone,
        password: "guest", // placeholder
        role: "USER",
      },
    });
  }

  await prisma.bloodRequest.create({
    data: {
      userId: user.id,
      patientName,
      contactPhone,
      bloodGroup,
      location,
      urgency,
    },
  });

  redirect("/");
}

export async function loginUser(formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    throw new Error("Phone and password are required");
  }

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { phone },
  });

  // In a production app, use bcrypt.compare(password, user.password)
  if (!user || user.password !== password) {
    throw new Error("Invalid phone number or password");
  }

  // Set a simple cookie session (Use NextAuth or JWT in production)
  const cookieStore = await cookies();
  cookieStore.set("auth_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/");
}

export async function importExcelData(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const xlsx = await import("xlsx");
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON
  const data = xlsx.utils.sheet_to_json(worksheet) as Array<{
    Name?: string;
    Phone?: string;
    BloodGroup?: string;
    Location?: string;
    Department?: string;
    Session?: string;
  }>;

  let addedCount = 0;

  for (const row of data) {
    const name = row.Name?.toString().trim();
    const phone = row.Phone?.toString().trim();
    const bloodGroup = row.BloodGroup?.toString().trim();
    const location = row.Location?.toString().trim();
    const department = row.Department?.toString().trim();
    const session = row.Session?.toString().trim();

    if (!name || !phone || !bloodGroup) {
      continue; // Skip rows missing required fields
    }

    const { prisma } = await import("@/lib/prisma");
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name,
          phone,
          password: "default_password", // Placeholder
          role: "DONOR",
          donorProfile: {
            create: {
              bloodGroup,
              ...(location && { location }),
              ...(department && { department }),
              ...(session && { session }),
            },
          },
        },
      });
      addedCount++;
    }
  }

  return { success: true, addedCount };
}

export async function getLiveStats() {
  const { prisma } = await import("@/lib/prisma");
  const totalDonors = await prisma.user.count({
    where: { role: "DONOR" }
  });
  const totalRequests = await prisma.bloodRequest.count();
  
  return {
    totalDonors,
    totalRequests,
    departmentsCovered: 30 // Hardcoded for now based on BSMRSTU data
  };
}

export async function getRecentRequests() {
  const { prisma } = await import("@/lib/prisma");
  const requests = await prisma.bloodRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  return requests;
}

export async function updateLastDonation(formData: FormData) {
  const dateString = formData.get("lastDonation") as string;
  if (!dateString) throw new Error("Date is required");

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  if (!userId) throw new Error("Unauthorized");

  const { prisma } = await import("@/lib/prisma");
  
  await prisma.donorProfile.update({
    where: { userId },
    data: { lastDonation: new Date(dateString) }
  });
  
  redirect("/dashboard");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/");
}

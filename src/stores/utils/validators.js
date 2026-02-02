// src/stores/utils/validators.js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z.string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(20, { message: "Password maksimal 20 karakter" })
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, { message: "Nama lengkap minimal 3 karakter" })
    .max(50, { message: "Nama lengkap maksimal 50 karakter" }),
  email: z.string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z.string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(20, { message: "Password maksimal 20 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar" })
    .regex(/[0-9]/, { message: "Password harus mengandung minimal 1 angka" })
});

export const quickLoginUsers = {
  admin: {
    email: "admin@wowotech.dev",
    password: "Admin123!",
    fullName: "Admin WowoTech",
    role: "admin"
  },
  user: {
    email: "user@wowotech.dev",
    password: "User123!",
    fullName: "Demo User",
    role: "user"
  }
};
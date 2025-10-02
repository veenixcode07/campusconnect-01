import { z } from 'zod';

// Authentication Validation
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
});

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  sapid: z
    .string()
    .trim()
    .min(5, "SAP ID must be at least 5 characters")
    .max(20, "SAP ID must be less than 20 characters")
});

// Notice Validation
export const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .trim()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  subject: z
    .string()
    .trim()
    .max(100, "Subject must be less than 100 characters")
    .optional(),
  category: z.enum(['general', 'exam', 'urgent'], {
    errorMap: () => ({ message: "Invalid category" })
  })
});

// Query Forum Validation
export const querySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  subject: z
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject must be less than 100 characters"),
  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters")
    .max(5000, "Content must be less than 5000 characters")
});

export const answerSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, "Answer must be at least 10 characters")
    .max(3000, "Answer must be less than 3000 characters")
});

// Student Notes Validation
export const studentNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, "Note must be at least 5 characters")
    .max(2000, "Note must be less than 2000 characters")
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type QueryInput = z.infer<typeof querySchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type StudentNoteInput = z.infer<typeof studentNoteSchema>;

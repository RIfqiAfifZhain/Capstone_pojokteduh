import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    username: z.string({ message: "Nama pengguna harus berkarakter string" }).min(1, "Username is required"),
    email: z.string({ message: "Email harus berkarakter string" }).email("Invalid email format"),
    password: z.string({ message: "Password harus berkarakter string" }).min(6, "Password must be at least 6 characters"),
  })
});

export const registerAdminSchema = z.object({
  body: z.object({
    username: z.string({ message: "Nama pengguna harus berkarakter string" }).min(1, "Username is required"),
    email: z.string({ message: "Email harus berkarakter string" }).email("Invalid email format"),
    password: z.string({ message: "Password harus berkarakter string" }).min(6, "Password must be at least 6 characters"),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email harus berkarakter string" }).email("Invalid email format"),
    password: z.string({ message: "Password harus berkarakter string" }).min(1, "Password is required"),
  })
});

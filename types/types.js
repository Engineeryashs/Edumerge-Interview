const { z } = require("zod");

// ================= SIGNUP =================
const userSignupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  lastName: z.string().min(2, "Last name is required"),

  email: z.email(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(14, "Password cannot exceed 14 characters"),

  role: z.enum(["ADMIN", "OFFICER", "MANAGEMENT"])
});


// ================= SIGNIN =================
const userSigninSchema = z.object({
  email: z.email(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(14, "Password cannot exceed 14 characters")
});

module.exports = { userSignupSchema, userSigninSchema };
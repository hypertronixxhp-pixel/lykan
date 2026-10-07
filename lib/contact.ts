import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().default(""),
  topic: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10, "Please share a little more detail").max(5000),
  website: z.string().max(200).optional(), // honeypot: real users leave it empty
});
export type ContactInput = z.infer<typeof contactSchema>;

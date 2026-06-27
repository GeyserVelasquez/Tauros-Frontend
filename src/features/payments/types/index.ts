import { z } from "zod"

export const paymentStatusSchema = z.enum(["pending", "processing", "success", "failed"])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: paymentStatusSchema,
  email: z.string().email(),
  createdAt: z.string(),
})

export type Payment = z.infer<typeof paymentSchema>

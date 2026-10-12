import { z } from "zod"

export const assessmentStatusSchema = z.enum(["NOT_ASSESSED", "COMPLIANT", "PARTIALLY_COMPLIANT", "NON_COMPLIANT", "NOT_APPLICABLE"])
export const documentStatusSchema = z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "OBSOLETE"])

export const requirementInputSchema = z.object({
  code: z.string().trim().min(1),
  title: z.string().trim().min(1),
  status: assessmentStatusSchema.default("NOT_ASSESSED"),
  justification: z.string().trim().optional(),
}).superRefine((value, ctx) => {
  if (value.status === "NOT_APPLICABLE" && !value.justification) {
    ctx.addIssue({ code: "custom", path: ["justification"], message: "Une exigence non applicable doit être justifiée." })
  }
})

export const documentInputSchema = z.object({
  code: z.string().trim().min(1),
  title: z.string().trim().min(1),
  status: documentStatusSchema.default("DRAFT"),
  obsoleteReason: z.string().trim().optional(),
}).superRefine((value, ctx) => {
  if (value.status === "OBSOLETE" && !value.obsoleteReason) {
    ctx.addIssue({ code: "custom", path: ["obsoleteReason"], message: "Un document obsolète doit avoir un motif." })
  }
})

import { z } from "zod"

export const assessmentStatusSchema = z.enum(["NOT_ASSESSED", "COMPLIANT", "PARTIALLY_COMPLIANT", "NON_COMPLIANT", "NOT_APPLICABLE"])
export const documentStatusSchema = z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "OBSOLETE"])
export const processStatusSchema = z.enum(["ACTIVE", "INACTIVE"])

export const processInputSchema = z.object({
  organizationId: z.string().uuid(),
  code: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().min(1).max(80),
  ownerReference: z.string().trim().max(160).optional(),
  status: processStatusSchema.default("ACTIVE"),
})

export const processStatusChangeSchema = z.object({
  id: z.string().uuid(),
  status: processStatusSchema,
})


export const requirementInputSchema = z.object({
  organizationId: z.string().uuid(),
  sourceId: z.string().uuid(),
  code: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  referenceClause: z.string().trim().max(160).optional(),
  category: z.string().trim().min(1).max(120),
  domain: z.string().trim().max(120).optional(),
  applicability: z.boolean().default(true),
  status: assessmentStatusSchema.default("NOT_ASSESSED"),
  justification: z.string().trim().optional(),
}).superRefine((value, ctx) => {
  if (value.status === "NOT_APPLICABLE" && !value.justification) {
    ctx.addIssue({ code: "custom", path: ["justification"], message: "Une exigence non applicable doit être justifiée." })
  }
})

export const assessmentInputSchema = z.object({
  requirementId: z.string().uuid(),
  status: assessmentStatusSchema,
  justification: z.string().trim().optional(),
  scopeReference: z.string().trim().max(240).optional(),
}).superRefine((value, ctx) => {
  if ((value.status === "NOT_APPLICABLE" || value.status === "PARTIALLY_COMPLIANT" || value.status === "NON_COMPLIANT") && !value.justification) {
    ctx.addIssue({ code: "custom", path: ["justification"], message: "Une justification est obligatoire pour ce statut." })
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

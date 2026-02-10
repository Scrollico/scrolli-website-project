/**
 * Zod Validation Schemas for API Routes
 * Centralized validation schemas for all API endpoints
 */

import { z } from "zod";

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters").trim(),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters").toLowerCase().trim(),
  message: z.string().min(1, "Message is required").max(5000, "Message must be less than 5000 characters").trim(),
});

/**
 * Gift Article Schema
 */
export const giftArticleSchema = z.object({
  articleId: z.string().uuid("Invalid article ID format"),
  toEmail: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters").toLowerCase().trim().optional(),
  shareMethod: z.enum(["link", "qr"]).default("link"),
});

/**
 * Redeem Gift Schema
 */
export const redeemGiftSchema = z.object({
  giftToken: z.string().min(1, "Gift token is required").max(100, "Invalid gift token format"),
  articleId: z.string().uuid("Invalid article ID format"),
});

/**
 * Payload CMS Update Featured Image Schema
 */
export const updateFeaturedImageSchema = z.object({
  collection: z.enum(["gundem", "hikayeler"], {
    errorMap: () => ({ message: "Collection must be 'gundem' or 'hikayeler'" }),
  }),
  articleId: z.string().min(1, "Article ID is required"),
  mediaId: z.string().min(1, "Media ID is required"),
});

/**
 * Payload CMS Auto Assign Images Schema
 */
export const autoAssignImagesSchema = z.object({
  collection: z.enum(["gundem", "hikayeler"]).optional(),
});

/**
 * Query parameter schemas
 */
export const listMediaQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(1000)).optional().default("1000"),
});

export const findArticlesQuerySchema = z.object({
  collection: z.enum(["gundem", "hikayeler"]),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(1000)).optional().default("100"),
});

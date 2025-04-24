import { pgTable, serial, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  // HGSI Ratings (1-10)
  impressionRating: integer('impression_rating').notNull(),
  punctualityRating: integer('punctuality_rating').notNull(),
  staffRating: integer('staff_rating').notNull(),
  qualityRating: integer('quality_rating').notNull(),
  valueRating: integer('value_rating').notNull(),
  npsRating: integer('nps_rating').notNull(),
  
  // Additional Questions
  offeredInspection: boolean('offered_inspection').notNull(),
  postServiceContact: text('post_service_contact').notNull(), // 'yes', 'no', 'didnt-want'
  visitReason: text('visit_reason').notNull(), // 'routine', 'free', 'warranty', 'recall', 'other'
  otherReason: text('other_reason'), // Optional, only if visitReason is 'other'
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert; 
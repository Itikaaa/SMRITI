import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const patientProfiles = mysqlTable(
  "patient_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    caregiverId: int("caregiverId").notNull(),
    preferredName: varchar("preferredName", { length: 120 }).notNull(),
    age: int("age"),
    background: text("background"),
    language: varchar("language", { length: 40 }).default("English").notNull(),
    childrenNames: text("childrenNames"),
    favouriteThings: text("favouriteThings"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({ caregiverUnique: uniqueIndex("patient_profiles_caregiver_unique").on(table.caregiverId) }),
);

export const storedFiles = mysqlTable("stored_files", {
  id: int("id").autoincrement().primaryKey(),
  caregiverId: int("caregiverId").notNull(),
  patientProfileId: int("patientProfileId"),
  consentStatus: mysqlEnum("consentStatus", ["pending", "confirmed", "declined"]).default("pending").notNull(),
  consentNote: text("consentNote"),
  consentRecordedAt: timestamp("consentRecordedAt"),
  fileKey: varchar("fileKey", { length: 512 }).notNull().unique(),
  fileUrl: varchar("fileUrl", { length: 768 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  purpose: mysqlEnum("purpose", ["memory-photo", "voice-note", "care-document", "other"]).default("other").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PatientProfile = typeof patientProfiles.$inferSelect;
export type InsertPatientProfile = typeof patientProfiles.$inferInsert;
export type StoredFile = typeof storedFiles.$inferSelect;
export type InsertStoredFile = typeof storedFiles.$inferInsert;

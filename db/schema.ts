import {
  pgTable,
  pgSchema,
  index,
  foreignKey,
  uuid,
  text,
  date,
  pgEnum,
  numeric,
  varchar,
  timestamp,
  unique,
  boolean,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const neonAuth = pgSchema("neon_auth");

export const category = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const room_location = pgTable("room_location", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const coverageTypeEnum = pgEnum("coverage_type", ["standard", "specialty"]);
export const item = pgTable("item", {
  id: uuid("id").primaryKey(),
  user_id: uuid("user_id").references(() => userInNeonAuth.id, { onDelete: "cascade" }),
  room_location: uuid("room_location_id")
    .references(() => room_location.id, {
      onDelete: "cascade",
    })
    .notNull(),
  coverage_type: coverageTypeEnum("coverage_type").default("standard").notNull(),
  category_id: uuid("category_id")
    .references(() => category.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  brand: varchar("brand", { length: 255 }),
  model: varchar("model", { length: 255 }),
  identification_number: varchar("identification_number", { length: 100 }),
  purchase_price: numeric("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchase_date: date("purchase_date"),
  current_value: numeric("current_value", { precision: 10, scale: 2 }),
  created_at: date("created_at").defaultNow(),
  updated_at: date("updated_at"),
});

// The items below were specifically generated via 'drizzle-kit pull' from the Neon Database,
// since I decided to have Neon handle the authentication data. They create a
// set of tables that automatically integrate with Neon Auth.
// I selected this option becuase it streamlines development and they already have many best-practices
// in place regarding security. This is a safer option.
// If necessary, I can "hand roll" authentication with my own tables, etc.

export const invitationInNeonAuth = neonAuth.table(
  "invitation",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organizationId: uuid().notNull(),
    email: text().notNull(),
    role: text(),
    status: text().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    inviterId: uuid().notNull(),
  },
  (table) => [
    index("invitation_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
    index("invitation_organizationId_idx").using(
      "btree",
      table.organizationId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizationInNeonAuth.id],
      name: "invitation_organizationId_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.inviterId],
      foreignColumns: [userInNeonAuth.id],
      name: "invitation_inviterId_fkey",
    }).onDelete("cascade"),
  ],
);

export const userInNeonAuth = neonAuth.table(
  "user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    image: text(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    role: text(),
    banned: boolean(),
    banReason: text(),
    banExpires: timestamp({ withTimezone: true, mode: "string" }),
  },
  (table) => [unique("user_email_key").on(table.email)],
);

export const sessionInNeonAuth = neonAuth.table(
  "session",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: uuid().notNull(),
    impersonatedBy: text(),
    activeOrganizationId: text(),
  },
  (table) => [
    index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
      name: "session_userId_fkey",
    }).onDelete("cascade"),
    unique("session_token_key").on(table.token),
  ],
);

export const organizationInNeonAuth = neonAuth.table(
  "organization",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    logo: text(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    metadata: text(),
  },
  (table) => [
    uniqueIndex("organization_slug_uidx").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops"),
    ),
    unique("organization_slug_key").on(table.slug),
  ],
);

export const accountInNeonAuth = neonAuth.table(
  "account",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true, mode: "string" }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: "string" }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
      name: "account_userId_fkey",
    }).onDelete("cascade"),
  ],
);

export const verificationInNeonAuth = neonAuth.table(
  "verification",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").using(
      "btree",
      table.identifier.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const jwksInNeonAuth = neonAuth.table("jwks", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: "string" }),
});

export const memberInNeonAuth = neonAuth.table(
  "member",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organizationId: uuid().notNull(),
    userId: uuid().notNull(),
    role: text().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [
    index("member_organizationId_idx").using(
      "btree",
      table.organizationId.asc().nullsLast().op("uuid_ops"),
    ),
    index("member_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizationInNeonAuth.id],
      name: "member_organizationId_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
      name: "member_userId_fkey",
    }).onDelete("cascade"),
  ],
);

export const projectConfigInNeonAuth = neonAuth.table(
  "project_config",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    endpointId: text("endpoint_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    trustedOrigins: jsonb("trusted_origins").notNull(),
    socialProviders: jsonb("social_providers").notNull(),
    emailProvider: jsonb("email_provider"),
    emailAndPassword: jsonb("email_and_password"),
    allowLocalhost: boolean("allow_localhost").notNull(),
    pluginConfigs: jsonb("plugin_configs"),
    webhookConfig: jsonb("webhook_config"),
  },
  (table) => [unique("project_config_endpoint_id_key").on(table.endpointId)],
);

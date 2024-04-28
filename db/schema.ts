import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const MemberRole = pgEnum("memberRole", ["ADMIN", "MODERATOR", "GUEST"]);

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  imageUrl: varchar("imageUrl", { length: 255 }),
  email: varchar("email", { length: 255 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const profileRelations = relations(profile, ({ many }) => ({
  members: many(member),
  servers: many(server),
  channels: many(channel),
}));

export const server = pgTable("server", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  imageUrl: varchar("imageUrl", { length: 255 }),
  inviteCode: varchar("inviteCode", { length: 255 }),
  profileId: uuid("profileId").references(() => profile.id, {
    onDelete: "cascade",
  }),
  channelId: uuid("channelId").references(() => channel.id, {
    onDelete: "cascade",
  }),
  memberId: uuid("memberId").references(() => member.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const serverRelations = relations(server, ({ one, many }) => ({
  profile: one(profile, {
    fields: [server.profileId],
    references: [profile.id],
  }),
  members: one(member, {
    fields: [server.memberId],
    references: [member.id],
  }),
  channels: one(channel, {
    fields: [server.channelId],
    references: [channel.id],
  }),
}));

export const member = pgTable("member", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: MemberRole("userRole").default("GUEST").notNull(),
  profileId: uuid("profileId").references(() => profile.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
  profile: one(profile, {
    fields: [member.profileId],
    references: [profile.id],
  }),
}));

export const ChannelType = pgEnum("channelType", ["TEXT", "AUDIO", "VIDEO"]);

export const channel = pgTable(
  "channel",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    type: ChannelType("type").default("TEXT").notNull(),
    profileId: uuid("profileId").references(() => profile.id, {
      onDelete: "cascade",
    }),
    memberId: uuid("memberId").references(() => member.id, {
      onDelete: "cascade",
    }),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      profileId: index("profileId").on(table.profileId),
    };
  }
);

export const channelRelations = relations(channel, ({ one, many }) => ({
  profile: one(profile, {
    fields: [channel.profileId],
    references: [profile.id],
  }),
  members: one(member, {
    fields: [channel.memberId],
    references: [member.id],
  }),
}));

// export const PostCategoryTable = pgTable(
// "postCategory",
// {
// postId: uuid("postId")
// .references(() => PostTable.id)
// .notNull(),
// categoryId: uuid("categoryId")
// .references(() => CategoryTable.id)
// .notNull(),
// },
// (table) => {
// return {
// pk: primaryKey({ columns: [table.postId, table.categoryId] }),
// };
// }
// );

// // RELATIONS
// export const UserTableRelations = relations(UserTable, ({ one, many }) => {
// return {
// preferences: one(UserPreferencesTable),
// posts: many(PostTable),
// };
// });

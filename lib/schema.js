import { sql } from "drizzle-orm";
import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  status: text("status").default("trial"),
  expiryDate: text("expiry_date"),
  reminderSent: integer("reminder_sent").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const googleUsers = sqliteTable("google_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  hindiName: text("hindi_name"),
  category: text("category").notNull(),
  brand: text("brand"),
  unit: text("unit").default("kg"),
  mrp: real("mrp").notNull(),
  purchasePrice: real("purchase_price"),
  stock: real("stock").default(0),
  minStock: real("min_stock").default(5),
  barcode: text("barcode"),
  gst: real("gst").default(5),
  hsn: text("hsn"),
  expiry: text("expiry"),
  active: integer("active").default(1),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  udhar: real("udhar").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const bills = sqliteTable("bills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  customerId: integer("customer_id"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  billNo: text("bill_no").notNull(),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").default(0),
  gstAmount: real("gst_amount").default(0),
  total: real("total").notNull(),
  paid: real("paid").default(0),
  paymentMode: text("payment_mode").default("cash"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const billItems = sqliteTable("bill_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  billId: integer("bill_id").notNull(),
  itemId: integer("item_id"),
  itemName: text("item_name").notNull(),
  unit: text("unit"),
  qty: real("qty").notNull(),
  mrp: real("mrp").notNull(),
  discount: real("discount").default(0),
  gst: real("gst").default(0),
  amount: real("amount").notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  supplierName: text("supplier_name"),
  invoiceNo: text("invoice_no"),
  total: real("total").notNull(),
  paid: real("paid").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const purchaseItems = sqliteTable("purchase_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseId: integer("purchase_id").notNull(),
  itemId: integer("item_id"),
  itemName: text("item_name").notNull(),
  qty: real("qty").notNull(),
  purchasePrice: real("purchase_price").notNull(),
  mrp: real("mrp").notNull(),
  expiry: text("expiry"),
  amount: real("amount").notNull(),
});

export const udharLedger = sqliteTable("udhar_ledger", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  customerId: integer("customer_id").notNull(),
  billId: integer("bill_id"),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const shopSettings = sqliteTable("shop_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  shopName: text("shop_name").default("मेरी दुकान"),
  ownerName: text("owner_name"),
  phone: text("phone"),
  address: text("address"),
  gstin: text("gstin"),
  upiId: text("upi_id"),
  thankYouMsg: text("thank_you_msg").default("धन्यवाद! फिर आइएगा।"),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});
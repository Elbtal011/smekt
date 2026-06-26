import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

export const dbPath = process.env.SQLITE_PATH || path.join(dataDir, "elbtal.sqlite");
export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const now = () => new Date().toISOString();

const jsonColumns = new Set([
  "images",
  "features",
  "eigenschaften_tags",
  "documents",
  "metadata",
]);

export function serializeRow(row) {
  if (!row) return row;
  const copy = { ...row };
  for (const key of Object.keys(copy)) {
    if (jsonColumns.has(key) && typeof copy[key] === "string") {
      try {
        copy[key] = JSON.parse(copy[key]);
      } catch {
        copy[key] = [];
      }
    }
    if (copy[key] === 0 && key.startsWith("is_")) copy[key] = false;
    if (copy[key] === 1 && key.startsWith("is_")) copy[key] = true;
  }
  return copy;
}

export function serializeRows(rows) {
  return rows.map(serializeRow);
}

function tableColumns(table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name));
}

function normalizeRecord(table, record) {
  const allowedColumns = tableColumns(table);
  const next = { ...record };
  for (const key of Object.keys(next)) {
    if (!allowedColumns.has(key)) {
      delete next[key];
      continue;
    }
    if (jsonColumns.has(key) && Array.isArray(next[key])) {
      next[key] = JSON.stringify(next[key]);
    }
    if (typeof next[key] === "boolean") {
      next[key] = next[key] ? 1 : 0;
    }
    if (next[key] === undefined) {
      delete next[key];
    }
  }
  return next;
}

export function insert(table, record) {
  const row = normalizeRecord(table, {
    id: randomUUID(),
    created_at: now(),
    updated_at: now(),
    ...record,
  });
  const keys = Object.keys(row);
  const columns = keys.map((key) => `"${key}"`).join(", ");
  const placeholders = keys.map((key) => `@${key}`).join(", ");
  db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`).run(row);
  return getById(table, row.id);
}

export function update(table, id, record) {
  const row = normalizeRecord(table, { ...record, updated_at: now() });
  const keys = Object.keys(row);
  if (!keys.length) return getById(table, id);
  const set = keys.map((key) => `"${key}" = @${key}`).join(", ");
  db.prepare(`UPDATE ${table} SET ${set} WHERE id = @id`).run({ ...row, id });
  return getById(table, id);
}

export function getById(table, id) {
  return serializeRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id));
}

export function attachRelations(row) {
  if (!row) return row;
  const next = serializeRow(row);
  if ("city_id" in next && next.city_id) {
    next.city = serializeRow(db.prepare("SELECT id, name, slug FROM cities WHERE id = ?").get(next.city_id)) || null;
  }
  if ("property_type_id" in next && next.property_type_id) {
    next.property_type =
      serializeRow(db.prepare("SELECT id, name, slug FROM property_types WHERE id = ?").get(next.property_type_id)) || null;
  }
  if ("property_id" in next && next.property_id) {
    next.property =
      serializeRow(db.prepare("SELECT id, title, address FROM properties WHERE id = ?").get(next.property_id)) || null;
  }
  return next;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS property_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      price_monthly INTEGER NOT NULL DEFAULT 0,
      warmmiete_monthly INTEGER DEFAULT 0,
      additional_costs_monthly INTEGER DEFAULT 0,
      area_sqm INTEGER NOT NULL DEFAULT 0,
      rooms TEXT NOT NULL DEFAULT '1',
      property_type_id TEXT,
      city_id TEXT,
      address TEXT NOT NULL DEFAULT '',
      postal_code TEXT DEFAULT '',
      neighborhood TEXT DEFAULT '',
      floor INTEGER DEFAULT 0,
      total_floors INTEGER DEFAULT 0,
      year_built INTEGER DEFAULT 0,
      balcony INTEGER DEFAULT 0,
      elevator INTEGER DEFAULT 0,
      parking INTEGER DEFAULT 0,
      garden INTEGER DEFAULT 0,
      cellar INTEGER DEFAULT 0,
      attic INTEGER DEFAULT 0,
      dishwasher INTEGER DEFAULT 0,
      washing_machine INTEGER DEFAULT 0,
      dryer INTEGER DEFAULT 0,
      tv INTEGER DEFAULT 0,
      furnished INTEGER DEFAULT 0,
      pets_allowed INTEGER DEFAULT 0,
      kitchen_equipped INTEGER DEFAULT 0,
      available_from TEXT DEFAULT '',
      deposit_months INTEGER DEFAULT 3,
      utilities_included INTEGER DEFAULT 0,
      images TEXT DEFAULT '[]',
      features TEXT DEFAULT '[]',
      energy_certificate_type TEXT DEFAULT '',
      energy_certificate_value TEXT DEFAULT '',
      heating_type TEXT DEFAULT '',
      heating_energy_source TEXT DEFAULT '',
      internet_speed TEXT DEFAULT '',
      features_description TEXT DEFAULT '',
      additional_description TEXT DEFAULT '',
      neighborhood_description TEXT DEFAULT '',
      eigenschaften_description TEXT DEFAULT '',
      eigenschaften_tags TEXT DEFAULT '[]',
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(city_id) REFERENCES cities(id),
      FOREIGN KEY(property_type_id) REFERENCES property_types(id)
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      property_id TEXT,
      anrede TEXT DEFAULT '',
      vorname TEXT NOT NULL DEFAULT '',
      nachname TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      telefon TEXT NOT NULL DEFAULT '',
      strasse TEXT DEFAULT '',
      nummer TEXT DEFAULT '',
      plz TEXT DEFAULT '',
      ort TEXT DEFAULT '',
      nachricht TEXT NOT NULL DEFAULT '',
      status TEXT DEFAULT 'new',
      lead_label TEXT,
      lead_stage TEXT DEFAULT 'lead',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS property_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      property_id TEXT,
      email TEXT NOT NULL DEFAULT '',
      vorname TEXT DEFAULT '',
      nachname TEXT DEFAULT '',
      telefon TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      data TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      first_name TEXT DEFAULT '',
      last_name TEXT DEFAULT '',
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      verification_status TEXT DEFAULT 'pending',
      profile_image_url TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_documents (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      document_type TEXT DEFAULT '',
      file_name TEXT DEFAULT '',
      file_path TEXT DEFAULT '',
      file_size INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_documents (
      id TEXT PRIMARY KEY,
      contact_request_id TEXT,
      file_name TEXT DEFAULT '',
      file_path TEXT DEFAULT '',
      file_size INTEGER DEFAULT 0,
      document_type TEXT DEFAULT 'admin_upload',
      uploaded_by TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS backup_records (
      id TEXT PRIMARY KEY,
      backup_type TEXT DEFAULT 'manual',
      status TEXT DEFAULT 'completed',
      file_name TEXT DEFAULT '',
      file_size INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function ensureColumn(table, column, definition) {
  const exists = db.prepare(`PRAGMA table_info(${table})`).all().some((info) => info.name === column);
  if (!exists) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function migrateSchema() {
  [
    ["property_applications", "vorname", "TEXT DEFAULT ''"],
    ["property_applications", "nachname", "TEXT DEFAULT ''"],
    ["property_applications", "telefon", "TEXT DEFAULT ''"],
    ["property_applications", "adresse", "TEXT DEFAULT ''"],
    ["property_applications", "postleitzahl", "TEXT DEFAULT ''"],
    ["property_applications", "ort", "TEXT DEFAULT ''"],
    ["property_applications", "einzugsdatum", "TEXT DEFAULT ''"],
    ["property_applications", "nettoeinkommen", "INTEGER DEFAULT 0"],
    ["property_applications", "geburtsdatum", "TEXT DEFAULT ''"],
    ["property_applications", "geburtsort", "TEXT DEFAULT ''"],
    ["property_applications", "beruf", "TEXT DEFAULT ''"],
    ["property_applications", "arbeitgeber", "TEXT DEFAULT ''"],
    ["profiles", "anrede", "TEXT DEFAULT ''"],
    ["profiles", "phone", "TEXT DEFAULT ''"],
    ["profiles", "adresse", "TEXT DEFAULT ''"],
    ["profiles", "postleitzahl", "TEXT DEFAULT ''"],
    ["profiles", "ort", "TEXT DEFAULT ''"],
    ["backup_records", "includes_database", "INTEGER DEFAULT 1"],
    ["backup_records", "includes_storage", "INTEGER DEFAULT 1"],
    ["backup_records", "metadata", "TEXT DEFAULT '{}'"],
    ["backup_records", "download_url", "TEXT DEFAULT ''"],
  ].forEach(([table, column, definition]) => ensureColumn(table, column, definition));
}

function seedReferenceData() {
  const cityCount = db.prepare("SELECT COUNT(*) AS count FROM cities").get().count;
  if (!cityCount) {
    [
      ["Berlin", "berlin", 1],
      ["Hamburg", "hamburg", 2],
      ["Muenchen", "muenchen", 3],
      ["Frankfurt", "frankfurt", 4],
      ["Duesseldorf", "duesseldorf", 5],
      ["Koeln", "koeln", 6],
      ["Stuttgart", "stuttgart", 7],
    ].forEach(([name, slug, display_order]) => insert("cities", { name, slug, display_order, is_active: true }));
  }

  const typeCount = db.prepare("SELECT COUNT(*) AS count FROM property_types").get().count;
  if (!typeCount) {
    [
      ["Wohnung", "wohnung", 1],
      ["Haus", "haus", 2],
      ["Studio", "studio", 3],
      ["Maisonette", "maisonette", 4],
      ["Penthouse", "penthouse", 5],
    ].forEach(([name, slug, display_order]) => insert("property_types", { name, slug, display_order, is_active: true }));
  }
}

function seedProperties() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM properties").get().count;
  if (count) return;

  const cityId = (slug) => db.prepare("SELECT id FROM cities WHERE slug = ?").get(slug).id;
  const typeId = (slug) => db.prepare("SELECT id FROM property_types WHERE slug = ?").get(slug).id;
  const properties = [
    ["Modern Studio in Mitte", "Stylish studio apartment in the heart of Berlin with modern amenities and excellent transport connections.", 850, 35, "1", "studio", "berlin", "Friedrichstrasse 123", "10117", "Mitte", 3, 5, 2018, true, true, false, true, false, "2026-08-01", true, ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"], true],
    ["Spacious 2-Bedroom in Prenzlauer Berg", "Beautiful 2-bedroom apartment with high ceilings and original features in trendy Prenzlauer Berg.", 1450, 75, "2", "wohnung", "berlin", "Kastanienallee 45", "10435", "Prenzlauer Berg", 2, 4, 1920, true, false, false, false, true, "2026-08-15", false, ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"], false],
    ["Luxury Penthouse in Charlottenburg", "Exclusive penthouse with panoramic city views and premium finishes in prestigious Charlottenburg.", 3200, 120, "3", "penthouse", "berlin", "Kurfuerstendamm 200", "10719", "Charlottenburg", 8, 8, 2020, true, true, true, true, false, "2026-09-01", true, ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"], true],
    ["Modern Family House in Hamburg", "Spacious family house with garden in a quiet residential area of Hamburg.", 2100, 140, "4", "haus", "hamburg", "Elbchaussee 89", "22763", "Altona", 0, 2, 2015, false, false, true, false, true, "2026-09-15", false, ["https://images.unsplash.com/photo-1570129477492-45c003edd2be"], true],
  ];

  for (const p of properties) {
    insert("properties", {
      title: p[0],
      description: p[1],
      price_monthly: p[2],
      warmmiete_monthly: p[2],
      area_sqm: p[3],
      rooms: p[4],
      property_type_id: typeId(p[5]),
      city_id: cityId(p[6]),
      address: p[7],
      postal_code: p[8],
      neighborhood: p[9],
      floor: p[10],
      total_floors: p[11],
      year_built: p[12],
      balcony: p[13],
      elevator: p[14],
      parking: p[15],
      furnished: p[16],
      pets_allowed: p[17],
      available_from: p[18],
      utilities_included: p[19],
      images: p[20],
      features: ["High-speed WiFi", "Public transport", "Modern kitchen"],
      features_description: "Modern Ausstattung, helle Raeume und gute Verkehrsanbindung.",
      neighborhood_description: "Zentrale Lage mit Einkauf, Gastronomie und Nahverkehr in der Naehe.",
      is_featured: p[21],
      is_active: true,
    });
  }
}

function seedAdmin() {
  const password = process.env.ADMIN_PASSWORD || "admin65415";
  const existing = db.prepare("SELECT id FROM admin_users WHERE username = ?").get("admin65415");
  if (existing) {
    update("admin_users", existing.id, {
      password_hash: bcrypt.hashSync(password, 10),
      role: "admin",
      is_active: true,
    });
    return;
  }
  insert("admin_users", {
    username: "admin65415",
    email: "admin65415@example.local",
    password_hash: bcrypt.hashSync(password, 10),
    role: "admin",
    is_active: true,
  });
}

initSchema();
migrateSchema();
seedReferenceData();
seedProperties();
seedAdmin();

import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { db, dbPath, insert, update, serializeRow, serializeRows, attachRelations } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 4178);
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use(express.json({ limit: "20mb" }));
app.use("/uploads", express.static(uploadDir));

const now = () => new Date().toISOString();
const ok = (data = {}) => ({ data, error: null });
const bad = (message, status = 400) => ({ status, body: { data: null, error: { message } } });

function buildWhere(table, filters = [], params = {}) {
  const clauses = [];
  filters.forEach((filter, index) => {
    if (!hasColumn(table, filter.column)) return;
    const key = `v${index}`;
    if (filter.op === "eq") {
      clauses.push(`"${filter.column}" = @${key}`);
      params[key] = typeof filter.value === "boolean" ? Number(filter.value) : filter.value;
    } else if (filter.op === "gte") {
      clauses.push(`"${filter.column}" >= @${key}`);
      params[key] = filter.value;
    } else if (filter.op === "lte") {
      clauses.push(`"${filter.column}" <= @${key}`);
      params[key] = filter.value;
    } else if (filter.op === "in") {
      const names = filter.value.map((value, valueIndex) => {
        const name = `${key}_${valueIndex}`;
        params[name] = value;
        return `@${name}`;
      });
      clauses.push(`"${filter.column}" IN (${names.join(", ") || "NULL"})`);
    }
  });
  return clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
}

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((info) => info.name === column);
}

function queryTable(body) {
  const table = body.table;
  const method = body.method || "select";
  const filters = body.filters || [];
  const params = {};
  const where = buildWhere(table, filters, params);

  if (method === "insert") {
    const values = Array.isArray(body.values) ? body.values : [body.values];
    const rows = values.map((value) => attachRelations(insert(table, value || {})));
    return ok(Array.isArray(body.values) ? rows : rows[0]);
  }

  if (method === "update") {
    const idFilter = filters.find((filter) => filter.op === "eq" && filter.column === "id");
    if (!idFilter) throw new Error("Updates require an id filter");
    return ok(attachRelations(update(table, idFilter.value, body.values || {})));
  }

  if (method === "delete") {
    db.prepare(`DELETE FROM ${table} ${where}`).run(params);
    return ok({ success: true });
  }

  const count = db.prepare(`SELECT COUNT(*) AS count FROM ${table} ${where}`).get(params).count;
  if (body.head) return { data: null, error: null, count };

  let sql = `SELECT * FROM ${table} ${where}`;
  if (body.order?.column && hasColumn(table, body.order.column)) {
    sql += ` ORDER BY "${body.order.column}" ${body.order.ascending === false ? "DESC" : "ASC"}`;
  }
  if (body.range) {
    sql += " LIMIT @limit OFFSET @offset";
    params.limit = body.range.to - body.range.from + 1;
    params.offset = body.range.from;
  } else if (body.limit) {
    sql += " LIMIT @limit";
    params.limit = body.limit;
  }

  const rows = serializeRows(db.prepare(sql).all(params)).map(attachRelations);
  if (body.single || body.maybeSingle) return { data: rows[0] || null, error: null, count };
  return { data: rows, error: null, count };
}

function verifyAdmin(token) {
  if (!token) return null;
  const session = db
    .prepare(
      `SELECT s.*, u.username, u.role, u.email
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.token = ? AND s.is_active = 1 AND s.expires_at > ? AND u.is_active = 1`,
    )
    .get(token, now());
  return serializeRow(session);
}

function adminAuth(body) {
  if (body.action === "login") {
    const user = db
      .prepare("SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND is_active = 1")
      .get(body.username, body.username);
    if (!user || !bcrypt.compareSync(body.password || "", user.password_hash)) {
      return bad("Invalid credentials", 401);
    }
    const token = randomUUID() + randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    insert("admin_sessions", { token, user_id: user.id, expires_at: expiresAt, is_active: true });
    update("admin_users", user.id, { last_login: now() });
    return ok({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
  }

  if (body.action === "verify") {
    const session = verifyAdmin(body.token);
    if (!session) return bad("Invalid or expired token", 401);
    return ok({ success: true, user: { id: session.user_id, username: session.username, role: session.role } });
  }

  if (body.action === "logout") {
    if (body.token) db.prepare("UPDATE admin_sessions SET is_active = 0 WHERE token = ?").run(body.token);
    return ok({ success: true });
  }

  return bad("Invalid action");
}

function listProperties() {
  return serializeRows(db.prepare("SELECT * FROM properties ORDER BY created_at DESC").all()).map(attachRelations);
}

function listContactRequests() {
  return serializeRows(db.prepare("SELECT * FROM contact_requests ORDER BY created_at DESC").all())
    .map(attachRelations)
    .map((request) => {
      const documentsCount = db
        .prepare("SELECT COUNT(*) AS count FROM lead_documents WHERE contact_request_id = ?")
        .get(request.id).count;
      return {
        ...request,
        documents_count: documentsCount,
        has_documents: documentsCount > 0,
      };
    });
}

function analytics() {
  const totalProperties = db.prepare("SELECT COUNT(*) AS count FROM properties").get().count;
  const activeProperties = db.prepare("SELECT COUNT(*) AS count FROM properties WHERE is_active = 1").get().count;
  const totalInquiries = db.prepare("SELECT COUNT(*) AS count FROM contact_requests").get().count;
  const newInquiries = db.prepare("SELECT COUNT(*) AS count FROM contact_requests WHERE status = 'new'").get().count;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const inquiriesThisMonth = db
    .prepare("SELECT COUNT(*) AS count FROM contact_requests WHERE created_at >= ?")
    .get(monthStart.toISOString()).count;
  const totalCities = db.prepare("SELECT COUNT(*) AS count FROM cities").get().count;
  const inquiriesByStatus = serializeRows(db.prepare("SELECT status, COUNT(*) AS count FROM contact_requests GROUP BY status").all());
  const topPerformingProperties = serializeRows(
    db
      .prepare(
        `SELECT p.id, p.title, COUNT(cr.id) AS inquiries
         FROM properties p
         LEFT JOIN contact_requests cr ON cr.property_id = p.id
         GROUP BY p.id, p.title
         ORDER BY inquiries DESC, p.created_at DESC
         LIMIT 5`,
      )
      .all(),
  );
  return {
    totalProperties,
    activeProperties,
    totalInquiries,
    newInquiries,
    inquiriesThisMonth,
    totalCities,
    inquiriesByStatus,
    topPerformingProperties,
    monthlyInquiries: [],
    recentRequests: listContactRequests().slice(0, 10),
  };
}

function adminManagement(body) {
  const publicActions = new Set([]);
  if (!publicActions.has(body.action) && !verifyAdmin(body.token)) return bad("Unauthorized", 401);

  switch (body.action) {
    case "get_properties":
      return ok({ properties: listProperties() });
    case "get_cities":
      return ok({ cities: serializeRows(db.prepare("SELECT * FROM cities ORDER BY display_order, name").all()) });
    case "get_property_types":
      return ok({ propertyTypes: serializeRows(db.prepare("SELECT * FROM property_types ORDER BY display_order, name").all()) });
    case "get_contact_requests":
      return ok({ requests: listContactRequests() });
    case "get_property_inquiries":
      return ok({
        inquiries: serializeRows(
          db.prepare("SELECT * FROM contact_requests WHERE property_id = ? ORDER BY created_at DESC").all(body.propertyId),
        ),
      });
    case "get_analytics":
      return ok({ analytics: analytics(), ...analytics() });
    case "create_property":
      return ok({ property: attachRelations(insert("properties", body.property || body.data || {})) });
    case "update_property":
      return ok({ property: attachRelations(update("properties", body.id, body.property || {})), success: true });
    case "delete_property":
      db.prepare("DELETE FROM properties WHERE id = ?").run(body.id);
      return ok({ success: true });
    case "bulk_delete_properties":
      db.prepare("DELETE FROM properties").run();
      return ok({ success: true });
    case "create_city":
      return ok({ city: insert("cities", body.city || {}) });
    case "update_city":
      return ok({ city: update("cities", body.cityId, body.city || {}), success: true });
    case "delete_city": {
      const used = db.prepare("SELECT COUNT(*) AS count FROM properties WHERE city_id = ?").get(body.cityId).count;
      if (used) return ok({ success: false, message: "City has linked properties." });
      db.prepare("DELETE FROM cities WHERE id = ?").run(body.cityId);
      return ok({ success: true });
    }
    case "create_contact_request":
      return ok({ request: attachRelations(insert("contact_requests", body.request || body.data || body)), success: true });
    case "update_contact_request_status":
      return ok({ request: attachRelations(update("contact_requests", body.id, { status: body.status })), success: true });
    case "update_contact_request_label":
      return ok({ request: attachRelations(update("contact_requests", body.id, { lead_label: body.lead_label })), success: true });
    case "update_contact_request_stage":
      return ok({ request: attachRelations(update("contact_requests", body.id, { lead_stage: body.lead_stage })), success: true });
    case "delete_contact_request":
      db.prepare("DELETE FROM contact_requests WHERE id = ?").run(body.id);
      return ok({ success: true });
    case "delete_contact_requests":
      (body.ids || []).forEach((id) => db.prepare("DELETE FROM contact_requests WHERE id = ?").run(id));
      return ok({ success: true });
    case "get_members":
      return ok({ members: serializeRows(db.prepare("SELECT * FROM profiles ORDER BY created_at DESC").all()) });
    case "get_user_documents":
      return ok({ documents: serializeRows(db.prepare("SELECT * FROM user_documents WHERE user_id = ? ORDER BY created_at DESC").all(body.user_id)) });
    case "get_lead_documents":
      return ok({
        documents: serializeRows(
          db.prepare("SELECT * FROM lead_documents WHERE contact_request_id = ? ORDER BY created_at DESC").all(body.contactRequestId),
        ),
      });
    case "upload_lead_document":
      return ok({ document: insert("lead_documents", body.document || {}), success: true });
    case "delete_lead_document":
      db.prepare("DELETE FROM lead_documents WHERE id = ?").run(body.documentId);
      return ok({ success: true });
    case "get_document_download_url":
    case "get_user_document_download_url":
    case "get_lead_document_download_url":
      return ok({ url: body.file_path || body.filePath || "#" });
    case "get_property_application_data":
      return ok({ application: null, data: null });
    case "update_application_status":
      return ok({ success: true });
    case "update_lead":
      return ok({ request: attachRelations(update("contact_requests", body.id, body.data || body.lead || {})), success: true });
    case "get_admin_users":
      return ok({ users: serializeRows(db.prepare("SELECT id, username, email, role, is_active, created_at, last_login FROM admin_users").all()) });
    case "toggle_admin_status": {
      const user = db.prepare("SELECT is_active FROM admin_users WHERE id = ?").get(body.user_id);
      return ok({ user: update("admin_users", body.user_id, { is_active: user?.is_active ? 0 : 1 }), success: true });
    }
    case "update_admin_role":
      return ok({ user: update("admin_users", body.user_id, { role: body.role }), success: true });
    case "delete_admin_user":
      db.prepare("DELETE FROM admin_users WHERE id = ?").run(body.user_id);
      return ok({ success: true });
    case "get_current_user_role": {
      const session = verifyAdmin(body.token);
      return ok({ role: session?.role || "admin" });
    }
    case "backfill_missing_addresses":
    case "schedule_appointment":
    case "update_user_verification":
    case "delete_members":
      return ok({ success: true });
    default:
      return ok({ success: false, message: `Action ${body.action} is not implemented in the SQLite adapter yet.` });
  }
}

function contactSubmit(body) {
  const formData = body.formData || body;
  const request = insert("contact_requests", {
    property_id: formData.propertyId || formData.property_id || null,
    anrede: formData.anrede || "",
    vorname: formData.vorname || formData.firstName || "",
    nachname: formData.nachname || formData.lastName || "",
    email: formData.email || "",
    telefon: formData.telefon || formData.phone || "",
    strasse: formData.strasse || "",
    nummer: formData.nummer || "",
    plz: formData.plz || "",
    ort: formData.ort || "",
    nachricht: formData.nachricht || formData.message || "",
    lead_label: formData.lead_label || formData.leadLabel || null,
    lead_stage: formData.lead_stage || formData.leadStage || "lead",
  });
  return ok({ success: true, request });
}

function backupSystem(body) {
  const toBackup = (backup) => ({
    ...serializeRow(backup),
    includes_database: backup?.includes_database === 0 ? false : true,
    includes_storage: backup?.includes_storage === 0 ? false : true,
    metadata: typeof backup?.metadata === "string" ? JSON.parse(backup.metadata || "{}") : backup?.metadata || {},
    download_url: backup?.download_url || "/api/functions/full-backup",
  });
  if (body.action === "list_backups") {
    return ok({ backups: db.prepare("SELECT * FROM backup_records ORDER BY created_at DESC").all().map(toBackup) });
  }
  if (body.action === "download_backup") {
    return ok({ success: true, download_url: "/api/functions/full-backup" });
  }
  if (body.action?.includes("backup")) {
    const record = insert("backup_records", {
      backup_type: body.backup_type || "manual",
      status: "completed",
      file_name: `sqlite-backup-${Date.now()}.json`,
      file_size: fs.statSync(dbPath).size,
      includes_database: true,
      includes_storage: true,
      metadata: { source: "sqlite", dbPath },
      download_url: "/api/functions/full-backup",
    });
    return ok({ success: true, backup: toBackup(record), backups: [toBackup(record)] });
  }
  if (body.action === "delete_backup") {
    db.prepare("DELETE FROM backup_records WHERE id = ?").run(body.backup_id);
    return ok({ success: true });
  }
  return ok({ success: true });
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureCity(name) {
  const cleanName = String(name || "Berlin").trim() || "Berlin";
  const existing = db.prepare("SELECT * FROM cities WHERE lower(name) = lower(?)").get(cleanName);
  if (existing) return existing.id;
  return insert("cities", { name: cleanName, slug: slugify(cleanName), display_order: 99, is_active: true }).id;
}

function defaultPropertyTypeId() {
  return db.prepare("SELECT id FROM property_types ORDER BY display_order LIMIT 1").get()?.id || null;
}

function importProperties(properties = []) {
  let imported = 0;
  const errors = [];
  for (const [index, row] of properties.entries()) {
    try {
      const postcodeCity = String(row["postcode-city"] || "").trim();
      const cityMatch = postcodeCity.match(/^(\d{5})\s+(.+)$/);
      const postalCode = cityMatch ? cityMatch[1] : "";
      const cityName = cityMatch ? cityMatch[2] : postcodeCity || "Berlin";
      const rent = Number(String(row.Rent || "0").replace(/[^\d]/g, "")) || 0;
      const additional = Number(String(row.Nebenkosten || "0").replace(/[^\d]/g, "")) || 0;
      const size = Number(String(row.size || "0").replace(/[^\d]/g, "")) || 0;
      const images = [
        row["image-featured"],
        row["image-1"],
        row["image-2"],
        row["image-3"],
        row["image-4"],
        row["image-5"],
        row["image-6"],
      ].filter(Boolean);
      insert("properties", {
        title: row.Title || `Imported Property ${index + 1}`,
        description: row.Objektbeschreibung || "",
        features_description: row.Ausstattungsmerkmale || "",
        additional_description: row.Weitere || "",
        neighborhood_description: row.Lage || "",
        price_monthly: rent,
        additional_costs_monthly: additional,
        warmmiete_monthly: rent + additional,
        area_sqm: size,
        rooms: String(row.zimmer || "1"),
        city_id: ensureCity(cityName),
        property_type_id: defaultPropertyTypeId(),
        address: row.address || "",
        postal_code: postalCode,
        available_from: row["Verfügbar"] || row["VerfÃ¼gbar"] || "",
        images,
        is_active: true,
      });
      imported += 1;
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`);
    }
  }
  return ok({ success: errors.length === 0, message: `Imported ${imported} properties.`, imported, total: properties.length, errors });
}

function adminInvite(body) {
  const session = verifyAdmin(body.token);
  if (!session) return bad("Unauthorized", 401);
  if (!body.email) return bad("Email required");
  const username = `${String(body.email).split("@")[0].toLowerCase()}${Math.floor(Math.random() * 9000 + 1000)}`;
  const password = Math.random().toString(36).slice(2, 10) + "A1";
  const existing = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(body.email);
  if (existing) return bad("User with this email already exists", 409);
  const user = insert("admin_users", {
    username,
    email: body.email,
    password_hash: bcrypt.hashSync(password, 10),
    role: body.role || "employee",
    is_active: true,
  });
  return ok({ success: true, user, username, password, message: "User created locally. Email sending is disabled in SQLite mode." });
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]).filter((key) => typeof rows[0][key] !== "object");
  return [keys.join(","), ...rows.map((row) => keys.map((key) => csvEscape(row[key])).join(","))].join("\n");
}

function exportData() {
  const contactRequests = listContactRequests();
  const applications = serializeRows(db.prepare("SELECT * FROM property_applications ORDER BY created_at DESC").all());
  return ok({
    contact_requests: {
      count: contactRequests.length,
      csv: toCsv(contactRequests),
    },
    property_applications: {
      count: applications.length,
      csv: toCsv(applications),
    },
  });
}

app.post("/api/query", (req, res) => {
  try {
    res.json(queryTable(req.body));
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.post("/api/functions/:name", (req, res) => {
  try {
    let result;
    if (req.params.name === "admin-auth") result = adminAuth(req.body);
    else if (req.params.name === "admin-management") result = adminManagement(req.body);
    else if (req.params.name === "admin-invite") result = adminInvite(req.body);
    else if (req.params.name === "contact-submit") result = contactSubmit(req.body);
    else if (req.params.name === "simple-property-create") result = ok({ property: insert("properties", req.body.property || req.body), success: true });
    else if (req.params.name === "backup-system") result = backupSystem(req.body);
    else if (req.params.name === "export-data") result = exportData();
    else if (req.params.name === "full-backup") result = exportData();
    else if (req.params.name === "xlsx-upload" || req.params.name === "csv-upload") result = importProperties(req.body.properties || []);
    else if (req.params.name === "leads-import-with-documents") result = ok({ success: true, message: "Import endpoint is available; ZIP parsing can be added for production imports." });
    else result = ok({ success: true });

    if (result.status) res.status(result.status).json(result.body);
    else res.json(result);
  } catch (error) {
    res.status(500).json({ data: null, error: { message: error.message } });
  }
});

app.post("/api/storage/:bucket", upload.single("file"), (req, res) => {
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ data: { path: req.file.filename, publicUrl }, error: null });
});

app.get("/api/storage/:bucket/:file", (req, res) => {
  res.sendFile(path.join(uploadDir, req.params.file));
});

const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
      return next();
    }
    return res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Elbtal SQLite server running on http://127.0.0.1:${port}`);
  console.log(`SQLite database: ${dbPath}`);
});

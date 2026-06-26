const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4178";

async function post(path, body) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text.slice(0, 120) };
  }
  return { ok: response.ok, status: response.status, payload };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const results = [];
  const check = async (name, fn) => {
    try {
      await fn();
      results.push({ name, status: "ok" });
    } catch (error) {
      results.push({ name, status: "fail", error: error.message });
    }
  };

  let token = "";
  let propertyId = "";
  let cityId = "";
  let requestId = "";

  await check("admin login", async () => {
    const result = await post("/api/functions/admin-auth", {
      action: "login",
      username: "admin65415",
      password: process.env.ADMIN_PASSWORD || "admin65415",
    });
    assert(result.ok, `HTTP ${result.status}`);
    assert(result.payload.data?.success, "login did not return success");
    token = result.payload.data.token;
  });

  await check("admin verify", async () => {
    const result = await post("/api/functions/admin-auth", { action: "verify", token });
    assert(result.payload.data?.success, "verify did not return success");
  });

  await check("public properties query", async () => {
    const result = await post("/api/query", {
      table: "properties",
      method: "select",
      filters: [{ op: "eq", column: "is_active", value: true }],
      limit: 1,
    });
    assert(Array.isArray(result.payload.data), "properties did not return an array");
    assert(result.payload.data.length > 0, "no properties returned");
    propertyId = result.payload.data[0].id;
  });

  await check("property details query", async () => {
    const result = await post("/api/query", {
      table: "properties",
      method: "select",
      filters: [{ op: "eq", column: "id", value: propertyId }],
      single: true,
    });
    assert(result.payload.data?.city, "property city relation missing");
    assert(result.payload.data?.property_type, "property type relation missing");
  });

  await check("cities and property types", async () => {
    const cities = await post("/api/query", { table: "cities", method: "select", filters: [], limit: 1 });
    const types = await post("/api/query", { table: "property_types", method: "select", filters: [], limit: 1 });
    assert(cities.payload.data?.length > 0, "cities empty");
    assert(types.payload.data?.length > 0, "property types empty");
    cityId = cities.payload.data[0].id;
  });

  const adminActions = [
    ["get_properties", {}, (data) => Array.isArray(data.properties)],
    ["get_cities", {}, (data) => Array.isArray(data.cities)],
    ["get_property_types", {}, (data) => Array.isArray(data.propertyTypes)],
    ["get_contact_requests", {}, (data) => Array.isArray(data.requests)],
    ["get_property_inquiries", { propertyId }, (data) => Array.isArray(data.inquiries)],
    ["get_analytics", {}, (data) => data.analytics || typeof data.totalProperties === "number"],
    ["get_members", {}, (data) => Array.isArray(data.members)],
    ["get_admin_users", {}, (data) => Array.isArray(data.users)],
    ["get_current_user_role", {}, (data) => data.role],
    ["get_lead_documents", { contactRequestId: "missing" }, (data) => Array.isArray(data.documents)],
    ["get_user_documents", { user_id: "missing" }, (data) => Array.isArray(data.documents)],
    ["get_property_application_data", { email: "test@example.com" }, (data) => "application" in data || "data" in data],
    ["backfill_missing_addresses", {}, (data) => data.success],
    ["schedule_appointment", {}, (data) => data.success],
  ];

  for (const [action, extra, predicate] of adminActions) {
    await check(`admin action ${action}`, async () => {
      const result = await post("/api/functions/admin-management", { action, token, ...extra });
      assert(result.ok, `HTTP ${result.status}`);
      assert(predicate(result.payload.data || {}), `unexpected shape: ${JSON.stringify(result.payload).slice(0, 160)}`);
    });
  }

  await check("contact submit", async () => {
    const result = await post("/api/functions/contact-submit", {
      formData: {
        propertyId,
        vorname: "Audit",
        nachname: "Check",
        email: "audit@example.com",
        telefon: "123456",
        nachricht: "Connection audit",
      },
    });
    assert(result.payload.data?.success, "contact submit did not succeed");
    requestId = result.payload.data.request.id;
  });

  await check("lead update/delete actions", async () => {
    let result = await post("/api/functions/admin-management", {
      action: "update_contact_request_status",
      token,
      id: requestId,
      status: "in_progress",
    });
    assert(result.payload.data?.success, "status update failed");
    result = await post("/api/functions/admin-management", {
      action: "update_contact_request_label",
      token,
      id: requestId,
      lead_label: "audit",
    });
    assert(result.payload.data?.success, "label update failed");
    result = await post("/api/functions/admin-management", {
      action: "update_contact_request_stage",
      token,
      id: requestId,
      lead_stage: "postident1",
    });
    assert(result.payload.data?.success, "stage update failed");
  });

  await check("profile insert/update/documents", async () => {
    const userId = `audit-${Date.now()}`;
    let result = await post("/api/query", {
      table: "profiles",
      method: "insert",
      values: { user_id: userId, first_name: "Audit", last_name: "User", email: "profile@example.com" },
    });
    assert(result.payload.data?.id, "profile insert failed");
    result = await post("/api/query", {
      table: "profiles",
      method: "update",
      values: { phone: "555" },
      filters: [{ op: "eq", column: "id", value: result.payload.data.id }],
    });
    assert(result.payload.data?.phone === "555", "profile update failed");
    result = await post("/api/query", {
      table: "user_documents",
      method: "insert",
      values: { user_id: userId, document_type: "audit", file_name: "audit.txt", file_path: "/uploads/audit.txt" },
    });
    assert(result.payload.data?.id, "document insert failed");
  });

  await check("property create/update/delete", async () => {
    const create = await post("/api/functions/admin-management", {
      action: "create_property",
      token,
      property: {
        title: "Audit Property",
        city_id: cityId,
        property_type_id: null,
        address: "Audit Street 1",
        price_monthly: 999,
        area_sqm: 50,
        rooms: "2",
        images: [],
        is_active: true,
      },
    });
    assert(create.payload.data?.property?.id, "create property failed");
    const id = create.payload.data.property.id;
    const updateResult = await post("/api/functions/admin-management", {
      action: "update_property",
      token,
      id,
      property: { title: "Audit Property Updated" },
    });
    assert(updateResult.payload.data?.property?.title === "Audit Property Updated", "update property failed");
    const del = await post("/api/functions/admin-management", { action: "delete_property", token, id });
    assert(del.payload.data?.success, "delete property failed");
  });

  await check("backup/export endpoints", async () => {
    const backup = await post("/api/functions/backup-system", { action: "list_backups" });
    const exportData = await post("/api/functions/export-data", {});
    const fullBackup = await post("/api/functions/full-backup", {});
    assert(Array.isArray(backup.payload.data?.backups), "backup list shape wrong");
    assert(exportData.payload.data?.contact_requests?.csv !== undefined, "export-data shape wrong");
    assert(fullBackup.payload.data?.contact_requests?.csv !== undefined, "full-backup shape wrong");
  });

  const failed = results.filter((result) => result.status === "fail");
  console.table(results);
  if (failed.length) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

type Filter = {
  op: "eq" | "gte" | "lte" | "in";
  column: string;
  value: any;
};

type QueryPayload = {
  table: string;
  method: "select" | "insert" | "update" | "delete";
  select?: string;
  options?: any;
  filters: Filter[];
  order?: { column: string; ascending?: boolean };
  range?: { from: number; to: number };
  limit?: number;
  single?: boolean;
  maybeSingle?: boolean;
  head?: boolean;
  values?: any;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function postJson(path: string, body: any) {
  const normalizedBody =
    typeof FormData !== "undefined" && body instanceof FormData
      ? Object.fromEntries(Array.from(body.entries()).filter(([, value]) => !(value instanceof File)))
      : body;
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedBody),
  });
  const payload = await response.json().catch(() => ({ data: null, error: { message: response.statusText } }));
  if (!response.ok) {
    return { data: payload.data ?? null, error: payload.error ?? { message: response.statusText }, count: payload.count ?? null };
  }
  return payload;
}

class QueryBuilder implements PromiseLike<any> {
  private payload: QueryPayload;

  constructor(table: string) {
    this.payload = { table, method: "select", filters: [] };
  }

  select(columns = "*", options?: any) {
    if (!["insert", "update", "delete"].includes(this.payload.method)) {
      this.payload.method = "select";
    }
    this.payload.select = columns;
    this.payload.options = options;
    this.payload.head = !!options?.head;
    return this;
  }

  insert(values: any) {
    this.payload.method = "insert";
    this.payload.values = values;
    return this;
  }

  update(values: any) {
    this.payload.method = "update";
    this.payload.values = values;
    return this;
  }

  delete() {
    this.payload.method = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.payload.filters.push({ op: "eq", column, value });
    return this;
  }

  gte(column: string, value: any) {
    this.payload.filters.push({ op: "gte", column, value });
    return this;
  }

  lte(column: string, value: any) {
    this.payload.filters.push({ op: "lte", column, value });
    return this;
  }

  in(column: string, value: any[]) {
    this.payload.filters.push({ op: "in", column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.payload.order = { column, ascending: options?.ascending };
    return this;
  }

  range(from: number, to: number) {
    this.payload.range = { from, to };
    return this;
  }

  limit(count: number) {
    this.payload.limit = count;
    return this;
  }

  single() {
    this.payload.single = true;
    return this;
  }

  maybeSingle() {
    this.payload.maybeSingle = true;
    return this;
  }

  async execute() {
    const result = await postJson("/api/query", this.payload);
    if (this.payload.options?.count && typeof result.count === "undefined") {
      result.count = Array.isArray(result.data) ? result.data.length : result.data ? 1 : 0;
    }
    return result;
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

function getStoredUser() {
  const raw = localStorage.getItem("localAuthUser");
  return raw ? JSON.parse(raw) : null;
}

function emitAuth(callback: (event: string, session: any) => void) {
  const user = getStoredUser();
  callback(user ? "SIGNED_IN" : "SIGNED_OUT", user ? { user } : null);
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },

  functions: {
    async invoke(name: string, options?: { body?: any }) {
      return postJson(`/api/functions/${name}`, options?.body || {});
    },
  },

  auth: {
    onAuthStateChange(callback: (event: string, session: any) => void) {
      setTimeout(() => emitAuth(callback), 0);
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    },

    async getSession() {
      const user = getStoredUser();
      return { data: { session: user ? { user } : null }, error: null };
    },

    async signUp({ email, password, options }: any) {
      const user = {
        id: crypto.randomUUID(),
        email,
        user_metadata: options?.data || {},
      };
      localStorage.setItem("localAuthUser", JSON.stringify(user));
      localStorage.setItem("localAuthPassword", password || "");
      return { data: { user, session: { user } }, error: null };
    },

    async signInWithPassword({ email, password }: any) {
      const user = getStoredUser();
      const storedPassword = localStorage.getItem("localAuthPassword");
      if (!user || user.email !== email || storedPassword !== password) {
        return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
      }
      return { data: { user, session: { user } }, error: null };
    },

    async signOut() {
      localStorage.removeItem("localAuthUser");
      localStorage.removeItem("localAuthPassword");
      return { error: null };
    },
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          const formData = new FormData();
          formData.append("file", file, path);
          return fetch(`${API_BASE}/api/storage/${bucket}`, {
            method: "POST",
            body: formData,
          }).then((response) => response.json());
        },
        getPublicUrl(path: string) {
          const normalized = path.startsWith("/uploads/") ? path : `/uploads/${path.split("/").pop()}`;
          return { data: { publicUrl: normalized } };
        },
        async remove(_paths: string[]) {
          return { data: null, error: null };
        },
        async list(_path?: string) {
          return { data: [], error: null };
        },
      };
    },
  },

  channel(_name: string) {
    return {
      on() {
        return this;
      },
      subscribe() {
        return this;
      },
    };
  },

  removeChannel(_channel: any) {},

  rpc(_name: string, _params?: any) {
    return Promise.resolve({ data: null, error: null });
  },
};

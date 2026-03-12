import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./superadmin.css";


const IcoGlobe  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IcoUsers  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoTool   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IcoLogout = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoEye    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoEyeOff = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IcoTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcoEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const NAV_ITEMS = [
  { key: "translation", label: "Translation",     Icon: IcoGlobe },
  { key: "users",       label: "User Management", Icon: IcoUsers },
];

const PAGE_META = {
  translation: { title: "Translation Dashboard",  sub: "Manage multilingual content" },
  users:       { title: "User Management",         sub: "Add and manage staff accounts" },
};

async function translateText(text, targetLang, sourceLang = "en") {
  if (!text?.trim() || sourceLang === targetLang) return "";
  try {
    const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const data = await fetch(url).then(r => r.json());
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const result = data.responseData.translatedText;
      return result.toLowerCase() === text.toLowerCase() ? "" : result;
    }
    return "";
  } catch { return ""; }
}

async function translateToAll(text, sourceLang = "en") {
  const out = { en: "", ta: "", hi: "" };
  out[sourceLang] = text;
  if (sourceLang !== "en") {
    const en = await translateText(text, "en", sourceLang);
    out.en = en || "";
    for (const lang of ["ta", "hi"].filter(l => l !== sourceLang)) {
      if (en) out[lang] = await translateText(en, lang, "en");
    }
  } else {
    await Promise.all(["ta", "hi"].map(async l => { out[l] = await translateText(text, l, "en"); }));
  }
  return out;
}

function detectSourceLang(nameObj) {
  if (!nameObj || typeof nameObj === "string") return "en";
  if (nameObj.en?.trim()) return "en";
  if (nameObj.ta?.trim()) return "ta";
  if (nameObj.hi?.trim()) return "hi";
  return "en";
}

function isMissingLang(nameObj, lang) {
  if (!nameObj || typeof nameObj === "string") return lang !== "en";
  const v  = nameObj[lang]?.trim() || "";
  const en = nameObj.en?.trim()    || "";
  if (!v) return true;
  if (lang === "ta" && v === en && en) return true;
  if (lang === "hi" && v === en && en) return true;
  return false;
}

const TYPE_LABEL = { menu: "Menu", category: "Category", grocery: "Stock" };

export default function SuperAdmin() {
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");
  const [page, setPage]           = useState("translation");
  const [collapsed, setCollapsed] = useState(false);

  const meta = PAGE_META[page] || {};

  return (
    <div className="sa-shell">

      {/* ── Sidebar ── */}
      <aside className={`sa-sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="sa-sidebar-brand">
          {/* <span className="sa-brand-icon">☕</span> */}
          {!collapsed && <span className="sa-brand-name">Super Admin</span>}
        </div>

        <nav className="sa-nav">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button key={key}
              className={`sa-nav-item${page === key ? " active" : ""}`}
              onClick={() => setPage(key)}
              title={collapsed ? label : undefined}>
              <span className="sa-nav-icon"><Icon /></span>
              {!collapsed && <span className="sa-nav-label">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="sa-sidebar-footer">
          <button className="sa-nav-item sa-nav-logout"
            onClick={() => { localStorage.clear(); navigate("/"); }}
            title={collapsed ? "Logout" : undefined}>
            <span className="sa-nav-icon"><IcoLogout /></span>
            {!collapsed && <span className="sa-nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="sa-main">
        <div className="sa-topbar">
          <button className="sa-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            <span className="sa-collapse-icon">{collapsed ? "›" : "‹"}</span>
          </button>
          <div className="sa-topbar-title">{meta.title}</div>
          <div className="sa-topbar-sub">{meta.sub}</div>
        </div>

        <div className="sa-page-body">
          {page === "translation" && <TranslationPage token={token} />}
          {page === "users"       && <UsersPage       token={token} />}
        </div>
      </div>
    </div>
  );
}

function TranslationPage({ token }) {
  const [data, setData]           = useState({ menu: [], categories: [], groceries: [] });
  const [loading, setLoading]     = useState(true);
  const [bulkLoad, setBulkLoad]   = useState(false);
  const [progress, setProgress]   = useState({ done: 0, total: 0 });
  const [migrating, setMigrating] = useState(false);
  const [showMig, setShowMig]     = useState(false);
  const [toast, setToast]         = useState({ msg: "", type: "ok" });
  const [editCell, setEditCell]   = useState(null);
  const [editVal, setEditVal]     = useState("");
  const [tab, setTab]             = useState("all");
  const [selected, setSelected]   = useState(new Set());
  const [selMode, setSelMode]     = useState(false);

  const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 4500); };
  const getN  = (f, l = "en") => !f ? "" : typeof f === "string" ? f : f[l] || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(await res.json());
      setSelected(new Set());
    } catch { flash("Failed to load items", "err"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const saveTrans = async (id, type, name) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/save-translation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, type, name })
    });
    return res.json();
  };

  const flat = () => [
    ...data.menu.map(i => ({ ...i, type: "menu" })),
    ...(data.categories || []).map(i => ({ ...i, type: "category" })),
    ...data.groceries.map(i => ({ ...i, type: "grocery" })),
  ];

  const displayItems =
    tab === "all"      ? flat() :
    tab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" })) :
    tab === "category" ? (data.categories||[]).map(i => ({ ...i, type: "category" })) :
    data.groceries.map(i => ({ ...i, type: "grocery" }));

  const translateBulk = async () => {
    const targets = selMode && selected.size > 0
      ? flat().filter(i => selected.has(String(i._id)))
      : displayItems;
    if (!targets.length) { flash("Nothing to translate"); return; }

    setBulkLoad(true);
    setProgress({ done: 0, total: targets.length });
    let ok = 0, fail = 0;

    for (const item of targets) {
      if (typeof item.name === "string") { fail++; setProgress(p => ({ ...p, done: p.done+1 })); continue; }
      try {
        const sl  = detectSourceLang(item.name);
        const src = item.name[sl];
        if (!src?.trim()) { fail++; continue; }
        const t   = await translateToAll(src, sl);
        const ex  = item.name;
        const upd = {
          en: t.en || ex.en || src,
          ta: (ex.ta?.trim() && ex.ta !== ex.en) ? ex.ta : (t.ta || ""),
          hi: (ex.hi?.trim() && ex.hi !== ex.en) ? ex.hi : (t.hi || ""),
        };
        (await saveTrans(item._id, item.type, upd)).success ? ok++ : fail++;
      } catch { fail++; }
      setProgress(p => ({ ...p, done: p.done+1 }));
      await new Promise(r => setTimeout(r, 380));
    }
    setBulkLoad(false);
    flash(`✓ ${ok} translated${fail ? `, ${fail} failed` : ""}`);
    load();
  };

  // const runMigrate = async () => {
  //   if (!window.confirm("Convert old string names to {en, ta, hi} format. Continue?")) return;
  //   setMigrating(true);
  //   try {
  //     const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
  //       method: "POST", headers: { Authorization: `Bearer ${token}` }
  //     }).then(r => r.json());
  //     flash(json.msg || "Migration done!");
  //     load();
  //   } catch { flash("Migration failed", "err"); }
  //   finally { setMigrating(false); }
  // };

  const saveEdit = async () => {
    if (!editCell) return;
    try {
      const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editVal })
      }).then(r => r.json());
      if (json.success) { flash("Saved!"); setEditCell(null); load(); }
    } catch { flash("Save failed", "err"); }
  };

  // const hasOld      = displayItems.some(i => typeof i.name === "string");
  const showType    = tab === "all";
  const allSel      = displayItems.length > 0 && displayItems.every(i => selected.has(String(i._id)));
  const selCount    = displayItems.filter(i => selected.has(String(i._id))).length;
  const toggle      = id => setSelected(p => { const n = new Set(p); n.has(String(id)) ? n.delete(String(id)) : n.add(String(id)); return n; });
  const toggleAll   = () => allSel ? setSelected(new Set()) : setSelected(new Set(displayItems.map(i => String(i._id))));
  const exitSel     = () => { setSelMode(false); setSelected(new Set()); };

  const tabs = [
    { key: "all",      label: "All",        count: flat().length },
    { key: "menu",     label: "Menu",       count: data.menu.length },
    { key: "category", label: "Categories", count: (data.categories||[]).length },
    { key: "grocery",  label: "Stock",      count: data.groceries.length },
  ];

  return (
    <div className="tp-wrap">
      <div className="tp-stats">
        {[
          { n: data.menu.length,            l: "Menu Items",  c: "orange" },
          { n: (data.categories||[]).length, l: "Categories", c: "purple" },
          { n: data.groceries.length,        l: "Stock",      c: "green"  },
          { n: flat().length,                l: "Pending",    c: "red"    },
        ].map((s, i) => (
          <div key={i} className={`tp-stat tp-stat-${s.c}`}>
            <div><div className="tp-stat-num">{s.n}</div><div className="tp-stat-label">{s.l}</div></div>
          </div>
        ))}
      </div>

      {/* <div className="tp-migrate-row">
        <button className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setShowMig(v => !v)}>
          <IcoTool /> {showMig ? "Hide Migration" : "Migration Tools"}
        </button>
      </div> */}
      {/* {showMig && (
        <div className="tp-migrate-panel">
          <p>Converts old <code>"Milk"</code> → <code>{`{en:"Milk", ta:"", hi:""}`}</code>. Run once for items added before multilingual support.</p>
          <button className="tp-btn tp-btn-primary" onClick={runMigrate} disabled={migrating}>
            {migrating ? "⏳ Migrating..." : "⚙ Run Migration Now"}
          </button>
        </div>
      )} */}
      {/* {hasOld && <div className="tp-notice">⚠ Old-format items found (highlighted). Run Migration Tools first.</div>} */}

      {bulkLoad && (
        <div className="tp-progress-wrap">
          <div className="tp-progress-track">
            <div className="tp-progress-fill" style={{ width: `${Math.round((progress.done/progress.total)*100)}%` }} />
          </div>
          <div className="tp-progress-text">Translating {progress.done} / {progress.total} items...</div>
        </div>
      )}

      <div className="tp-card">
        <div className="tp-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`tp-tab${tab === t.key ? " active" : ""}`}
              onClick={() => { setTab(t.key); setSelected(new Set()); setSelMode(false); }}>
              {t.label}<span className="tp-tab-pill">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="tp-toolbar">
          <div className="tp-toolbar-left">
            {!selMode ? (
              <button className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setSelMode(true)}>☑ Select Items</button>
            ) : (
              <>
                <label className="tp-check-all">
                  <input type="checkbox" checked={allSel} onChange={toggleAll} />
                  <span>{allSel ? "Deselect all" : "Select all"}</span>
                </label>
                {selCount > 0 && <span className="tp-selected-pill">{selCount} selected</span>}
                <button className="tp-btn tp-btn-ghost tp-btn-sm tp-btn-red" onClick={exitSel}>✕ Cancel</button>
              </>
            )}
          </div>
          <button className="tp-btn tp-btn-primary" onClick={translateBulk} disabled={bulkLoad}>
            <IcoGlobe />
            {bulkLoad
              ? `${progress.done}/${progress.total}...`
              : selMode && selCount > 0
              ? `Translate Selected (${selCount})`
              : `Translate All (${displayItems.length})`}
          </button>
        </div>

        {loading ? (
          <div className="tp-loading">Loading items...</div>
        ) : displayItems.length === 0 ? (
          <div className="tp-empty">
            {/* <div className="tp-empty-icon">✅</div> */}
            <div className="tp-empty-title">All translated!</div>
            <div className="tp-empty-sub">No pending translations in this tab.</div>
          </div>
        ) : (
          <div className="tp-table-scroll">
            <div className={`tp-table-head${showType ? " w-type" : ""}${selMode ? " w-check" : ""}`}>
              {selMode  && <span></span>}
              {showType && <span>Type</span>}
              <span>English</span><span>Tamil</span><span>Hindi</span>
            </div>

            {displayItems.map(item => {
              const isOld = typeof item.name === "string";
              const isChk = selected.has(String(item._id));
              return (
                <div key={item._id}
                  className={`tp-table-row${showType ? " w-type" : ""}${selMode ? " w-check" : ""}${isChk ? " checked" : ""}${isOld ? " old-fmt" : ""}`}>

                  {selMode && (
                    <span className="tp-check-cell">
                      <input type="checkbox" checked={isChk} onChange={() => toggle(item._id)} disabled={isOld} />
                    </span>
                  )}

                  {showType && (
                    <span><span className={`tp-type-badge tp-badge-${item.type}`}>{TYPE_LABEL[item.type]}</span></span>
                  )}

                  {["en", "ta", "hi"].map(lang => {
                    const val = getN(item.name, lang);
                    const bad = !isOld && isMissingLang(item.name, lang);

                    if (editCell?.id === String(item._id) && editCell?.lang === lang) {
                      return (
                        <span key={lang}>
                          <div className="tp-edit-row">
                            <input autoFocus value={editVal} className="tp-edit-input"
                              onChange={e => setEditVal(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && saveEdit()} />
                            <button className="tp-icon-btn green" onClick={saveEdit}><IcoCheck /></button>
                            <button className="tp-icon-btn red" onClick={() => setEditCell(null)}>✕</button>
                          </div>
                        </span>
                      );
                    }

                    return (
                      <span key={lang}>
                        <div className={`tp-cell${bad ? " missing" : ""}${isOld ? " old" : ""}`}
                          onClick={() => { if (isOld) return; setEditCell({ id: String(item._id), type: item.type, lang }); setEditVal(val); }}
                          title={isOld ? "Run migration first" : "Click to edit"}>
                          {isOld && lang === "en" ? item.name :
                           isOld                  ? <span className="tp-old-hint">migrate first</span> :
                           bad                    ? <MissingPill /> : val}
                        </div>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast.msg && <Toast msg={toast.msg} err={toast.type === "err"} onClose={() => setToast({ msg: "" })} />}
    </div>
  );
}

function UsersPage({ token }) {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState({ msg: "", type: "ok" });
  const [delTarget, setDelTgt]  = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSub]    = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", password: "", role: "cashier" });
  const [formErr, setFormErr]   = useState("");

  const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 4000); };

  const load = async () => {
    setLoading(true);
    try {
      const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setUsers(Array.isArray(json) ? json : []);
    } catch { flash("Failed to load users", "err"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const createUser = async () => {
    setFormErr("");
    if (!form.name.trim())        { setFormErr("Name is required"); return; }
    if (!form.email.trim())       { setFormErr("Email is required"); return; }
    if (!form.password.trim())    { setFormErr("Password is required"); return; }
    if (form.password.length < 6) { setFormErr("Password must be at least 6 characters"); return; }

    setSub(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) { setFormErr(json.msg || "Failed to create user"); return; }
      flash(`✓ ${form.name} added as ${form.role}`);
      setForm({ name: "", email: "", password: "", role: "cashier" });
      setShowForm(false);
      load();
    } catch { setFormErr("Network error. Try again."); }
    finally { setSub(false); }
  };

  const deleteUser = async () => {
    if (!delTarget) return;
    try {
      const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users/${delTarget._id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      if (json.success) { flash(`${delTarget.name} removed`); setDelTgt(null); load(); }
      else flash(json.msg || "Delete failed", "err");
    } catch { flash("Delete failed", "err"); }
  };

  const changeRole = async (userId, newRole) => {
    try {
      const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      }).then(r => r.json());
      if (json.success) { flash("Role updated"); setEditRole(null); load(); }
      else flash(json.msg || "Update failed", "err");
    } catch { flash("Update failed", "err"); }
  };

  const ROLE_COLOR = { admin: "orange", cashier: "blue", superadmin: "purple" };
  const admins     = users.filter(u => u.role === "admin").length;
  const cashiers   = users.filter(u => u.role === "cashier").length;

  return (
    <div className="up-wrap">
      <div className="up-header-row">
        <div>
          <div className="up-page-title">Staff Accounts</div>
          <div className="up-page-sub">
            {users.length} user{users.length !== 1 ? "s" : ""}
            {admins > 0   && ` · ${admins} admin${admins > 1 ? "s" : ""}`}
            {cashiers > 0 && ` · ${cashiers} cashier${cashiers > 1 ? "s" : ""}`}
          </div>
        </div>
        <button className="tp-btn tp-btn-primary"
          onClick={() => { setShowForm(true); setFormErr(""); setShowPass(false); }}>
          <IcoPlus /> Add User
        </button>
      </div>

      <div className="up-legend">
        <span className="up-legend-item"><span className="up-role-dot orange" />Admin — full access to menu, stock, sales</span>
        <span className="up-legend-item"><span className="up-role-dot blue" />Cashier — billing and orders only</span>
      </div>

      <div className="up-card">
        {loading ? (
          <div className="tp-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="tp-empty">
            <div className="tp-empty-icon">👥</div>
            <div className="tp-empty-title">No staff accounts yet</div>
            <div className="tp-empty-sub">Click "Add User" to create the first one.</div>
          </div>
        ) : (
          <>
            <div className="up-table-head">
              <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
            </div>
            {users.map(user => (
              <div key={user._id} className="up-table-row">
                <span className="up-user-name">
                  <span className="up-avatar">{user.name?.[0]?.toUpperCase() || "?"}</span>
                  {user.name}
                </span>
                <span className="up-user-email">{user.email}</span>
                <span>
                  {editRole === user._id ? (
                    <div className="up-role-edit">
                      <select defaultValue={user.role} className="up-role-select"
                        onChange={e => changeRole(user._id, e.target.value)}>
                        <option value="admin">admin</option>
                        <option value="cashier">cashier</option>
                      </select>
                      <button className="tp-icon-btn red" onClick={() => setEditRole(null)}>✕</button>
                    </div>
                  ) : (
                    <span className={`up-role-badge ${ROLE_COLOR[user.role] || "gray"}`}
                      onClick={() => user.role !== "superadmin" && setEditRole(user._id)}
                      title={user.role !== "superadmin" ? "Click to change role" : ""}
                      style={{ cursor: user.role !== "superadmin" ? "pointer" : "default" }}>
                      {user.role}
                      {user.role !== "superadmin" && <span className="up-edit-hint"><IcoEdit /></span>}
                    </span>
                  )}
                </span>
                <span className="up-actions">
                  {user.role !== "superadmin" && (
                    <button className="up-del-btn" onClick={() => setDelTgt(user)} title="Remove user">
                      <IcoTrash />
                    </button>
                  )}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {showForm && (
        <div className="sa-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="sa-modal">
            <div className="sa-modal-title">Add New Staff</div>
            <div className="sa-modal-sub">They'll use this email and password to log in.</div>
            {formErr && <div className="sa-modal-err">{formErr}</div>}

            <div className="sa-modal-field">
              <label>Full Name</label>
              <input placeholder="e.g. Ravi Kumar" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && createUser()} />
            </div>
            <div className="sa-modal-field">
              <label>Email Address</label>
              <input type="email" placeholder="ravi@yourcafe.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && createUser()} />
            </div>
            <div className="sa-modal-field">
              <label>Password</label>
              <div className="sa-pass-wrap">
                <input type={showPass ? "text" : "password"} placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && createUser()} />
                <button type="button" className="sa-pass-toggle" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </div>
            <div className="sa-modal-field">
              <label>Role</label>
              <div className="sa-role-picker">
                {[
                  { r: "cashier", icon: "💳", title: "Cashier", desc: "Billing & orders only" },
                  { r: "admin",   icon: "👑", title: "Admin",   desc: "Full menu & stock access" },
                ].map(({ r, icon, title, desc }) => (
                  <button key={r} type="button"
                    className={`sa-role-btn${form.role === r ? " active" : ""}`}
                    onClick={() => setForm(p => ({ ...p, role: r }))}>
                    {icon} {title}
                    <span className="sa-role-desc">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="sa-modal-actions">
              <button className="tp-btn tp-btn-primary" onClick={createUser} disabled={submitting}>
                {submitting ? "Creating..." : "Create Account"}
              </button>
              <button className="tp-btn tp-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {delTarget && (
        <div className="sa-modal-overlay" onClick={e => e.target === e.currentTarget && setDelTgt(null)}>
          <div className="sa-modal sa-modal-sm">
            <div className="sa-modal-title">Remove User?</div>
            <p className="sa-modal-body">
              <strong>{delTarget.name}</strong> ({delTarget.email}) will lose access immediately. This cannot be undone.
            </p>
            <div className="sa-modal-actions">
              <button className="tp-btn tp-btn-danger" onClick={deleteUser}>Yes, Remove</button>
              <button className="tp-btn tp-btn-ghost"  onClick={() => setDelTgt(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast.msg && <Toast msg={toast.msg} err={toast.type === "err"} onClose={() => setToast({ msg: "" })} />}
    </div>
  );
}

function MissingPill() {
  return (
    <span className="tp-missing-pill">
      <span className="tp-missing-dot" />
      not translated
    </span>
  );
}

function Toast({ msg, err, onClose }) {
  return (
    <div className={`sa-toast${err ? " error" : ""}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./superadmin.css";

// const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };
// const LANG_LABEL = { en: "English", ta: "Tamil", hi: "Hindi" };

// // ── Translate from browser (backend can't reach external APIs) ──
// async function translateText(text, targetLang, sourceLang = "en") {
//   if (!text?.trim() || sourceLang === targetLang) return "";
//   try {
//     const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
//     const res  = await fetch(url);
//     const data = await res.json();
//     if (data.responseStatus === 200 && data.responseData?.translatedText) {
//       const result = data.responseData.translatedText;
//       if (result.toLowerCase() === text.toLowerCase()) return "";
//       return result;
//     }
//     return "";
//   } catch { return ""; }
// }

// async function translateToAll(text, sourceLang = "en") {
//   const result = { en: "", ta: "", hi: "" };
//   result[sourceLang] = text;

//   // MyMemory is only reliable with English as source.
//   // So if source is Tamil or Hindi, first translate to English,
//   // then use that English to translate to the remaining language.
//   // This "bridge through English" gives much better results.
//   if (sourceLang !== "en") {
//     const englishText = await translateText(text, "en", sourceLang);
//     result["en"] = englishText || "";
//     // Now translate English → remaining language
//     const remaining = ["ta", "hi"].filter(l => l !== sourceLang);
//     for (const lang of remaining) {
//       if (englishText) {
//         result[lang] = await translateText(englishText, lang, "en");
//       }
//     }
//   } else {
//     // Source is English — translate directly to ta and hi
//     await Promise.all(
//       ["ta", "hi"].map(async lang => {
//         result[lang] = await translateText(text, lang, "en");
//       })
//     );
//   }
//   return result;
// }

// function detectSourceLang(nameObj) {
//   if (!nameObj || typeof nameObj === "string") return "en";
//   if (nameObj.en?.trim()) return "en";
//   if (nameObj.ta?.trim()) return "ta";
//   if (nameObj.hi?.trim()) return "hi";
//   return "en";
// }

// function isMissingLang(nameObj, lang) {
//   // Returns true if this specific language field needs translation
//   if (!nameObj || typeof nameObj === "string") return lang !== "en";
//   const val = nameObj[lang]?.trim() || "";
//   const en  = nameObj.en?.trim()   || "";
//   const ta  = nameObj.ta?.trim()   || "";
//   const hi  = nameObj.hi?.trim()   || "";
//   if (!val) return true;
//   // If only one language is filled and the others are same value → bad translation
//   if (lang === "ta" && ta === en && en) return true;
//   if (lang === "hi" && hi === en && en) return true;
//   if (lang === "en" && en === ta && ta) return true;
//   if (lang === "en" && en === hi && hi) return true;
//   return false;
// }

// export default function SuperAdmin() {
//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

//   const [data, setData]                 = useState({ menu: [], categories: [], groceries: [] });
//   const [loading, setLoading]           = useState(true);
//   const [translating, setTranslating]   = useState({});
//   const [bulkLoading, setBulkLoading]   = useState(false);
//   const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
//   const [migrating, setMigrating]       = useState(false);
//   const [showMigrate, setShowMigrate]   = useState(false);
//   const [toast, setToast]               = useState({ msg: "", type: "success" });
//   const [editCell, setEditCell]         = useState(null);
//   const [editValue, setEditValue]       = useState("");
//   const [activeTab, setActiveTab]       = useState("all");
//   const [selected, setSelected]         = useState(new Set());
//   const [selectMode, setSelectMode]     = useState(false); // checkboxes visible only when active

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "" }), 5000);
//   };

//   const getName = (nameField, lang = "en") => {
//     if (!nameField) return "";
//     if (typeof nameField === "string") return nameField;
//     return nameField[lang] || "";
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       setData(json);
//       setSelected(new Set());
//     } catch { showToast("Failed to load items", "error"); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const saveTranslation = async (id, type, updatedName) => {
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/save-translation`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ id, type, name: updatedName })
//     });
//     return res.json();
//   };

//   // ── Translate a single item ──
//   const translateOne = async (id, type, nameField) => {
//     setTranslating(prev => ({ ...prev, [id]: true }));
//     try {
//       const sourceLang = detectSourceLang(nameField);
//       const sourceText = typeof nameField === "string" ? nameField : nameField[sourceLang];
//       if (!sourceText?.trim()) { showToast("No text to translate", "error"); return; }

//       const translated = await translateToAll(sourceText, sourceLang);
//       if (!translated.ta && !translated.hi) {
//         showToast("Translation failed — check your internet connection", "error"); return;
//       }

//       const existing = typeof nameField === "object" ? nameField : { en: nameField, ta: "", hi: "" };
//       const updatedName = {
//         en: translated.en || existing.en || sourceText,
//         ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || ""),
//         hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || ""),
//       };

//       const result = await saveTranslation(id, type, updatedName);
//       if (result.success) {
//         showToast(`✓ "${sourceText}" → TA: "${translated.ta}" · HI: "${translated.hi}"`);
//         fetchData();
//       } else showToast("Save failed", "error");
//     } catch (err) { showToast("Error: " + err.message, "error"); }
//     finally { setTranslating(prev => ({ ...prev, [id]: false })); }
//   };

//   // ── Translate selected items ──
//   const translateSelected = async () => {
//     const allItems = [
//       ...data.menu.map(i => ({ ...i, type: "menu" })),
//       ...(data.categories || []).map(i => ({ ...i, type: "category" })),
//       ...data.groceries.map(i => ({ ...i, type: "grocery" })),
//     ];

//     const toTranslate = selected.size > 0
//       ? allItems.filter(i => selected.has(String(i._id)))
//       : displayItems; // if none selected, translate all visible

//     if (toTranslate.length === 0) { showToast("Nothing to translate"); return; }

//     setBulkLoading(true);
//     setBulkProgress({ done: 0, total: toTranslate.length });
//     let success = 0, errors = 0;

//     for (const item of toTranslate) {
//       if (typeof item.name === "string") { errors++; setBulkProgress(p => ({ ...p, done: p.done + 1 })); continue; }
//       try {
//         const sourceLang = detectSourceLang(item.name);
//         const sourceText = item.name[sourceLang];
//         if (!sourceText?.trim()) { errors++; continue; }

//         const translated = await translateToAll(sourceText, sourceLang);
//         const existing   = item.name;
//         const updatedName = {
//           en: translated.en || existing.en || sourceText,
//           ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || ""),
//           hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || ""),
//         };

//         const result = await saveTranslation(item._id, item.type, updatedName);
//         if (result.success) success++; else errors++;
//       } catch { errors++; }
//       setBulkProgress(p => ({ ...p, done: p.done + 1 }));
//       await new Promise(r => setTimeout(r, 400));
//     }

//     setBulkLoading(false);
//     showToast(`Done! ✓ ${success} translated${errors ? `, ${errors} failed` : ""}`);
//     fetchData();
//   };

//   // ── Migration ──
//   const runMigration = async () => {
//     if (!window.confirm("Convert old plain string names to {en, ta, hi} format. Run only if you see old-format items. Continue?")) return;
//     setMigrating(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
//         method: "POST", headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       showToast(json.msg || "Migration done!");
//       fetchData();
//     } catch { showToast("Migration failed", "error"); }
//     finally { setMigrating(false); }
//   };

//   const saveManualEdit = async () => {
//     if (!editCell) return;
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
//       });
//       const json = await res.json();
//       if (json.success) { showToast("Saved!"); setEditCell(null); fetchData(); }
//     } catch { showToast("Save failed", "error"); }
//   };

//   const allItems = [
//     ...data.menu.map(i => ({ ...i, type: "menu" })),
//     ...(data.categories || []).map(i => ({ ...i, type: "category" })),
//     ...data.groceries.map(i => ({ ...i, type: "grocery" })),
//   ];

//   const displayItems =
//     activeTab === "all"      ? allItems :
//     activeTab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" })) :
//     activeTab === "category" ? (data.categories || []).map(i => ({ ...i, type: "category" })) :
//     data.groceries.map(i => ({ ...i, type: "grocery" }));

//   const hasOldFormat   = displayItems.some(i => typeof i.name === "string");
//   const showTypeCol    = activeTab === "all";
//   const allSelected    = displayItems.length > 0 && displayItems.every(i => selected.has(String(i._id)));
//   const someSelected   = selected.size > 0;
//   const selectedCount  = displayItems.filter(i => selected.has(String(i._id))).length;

//   const toggleItem = (id) => {
//     setSelected(prev => {
//       const next = new Set(prev);
//       next.has(String(id)) ? next.delete(String(id)) : next.add(String(id));
//       return next;
//     });
//   };

//   const toggleAll = () => {
//     if (allSelected) { setSelected(new Set()); }
//     else setSelected(new Set(displayItems.map(i => String(i._id))));
//   };

//   const exitSelectMode = () => { setSelectMode(false); setSelected(new Set()); };

//   const tabs = [
//     { key: "all",      label: "All",        count: allItems.length },
//     { key: "menu",     label: "Menu",       count: data.menu.length },
//     { key: "category", label: "Categories", count: (data.categories || []).length },
//     { key: "grocery",  label: "Stock",      count: data.groceries.length },
//   ];

//   return (
//     <div className="sa-wrap">

//       {/* ── Header ── */}
//       <div className="sa-header">
//         <div className="sa-header-left">
//           <div className="sa-logo">🌐</div>
//           <div>
//             <div className="sa-title">Translation Dashboard</div>
//             <div className="sa-subtitle">Super Admin · Multilingual Content</div>
//           </div>
//         </div>
//         <div className="sa-header-right">
//           <button className="sa-btn sa-btn-migrate-toggle"
//             onClick={() => setShowMigrate(v => !v)}>
//             ⚙ Migration
//           </button>
//           <button className="sa-btn sa-btn-logout"
//             onClick={() => { localStorage.clear(); navigate("/"); }}>
//             → Logout
//           </button>
//         </div>
//       </div>

//       {/* ── Migration panel (hidden by default) ── */}
//       {showMigrate && (
//         <div className="sa-migrate-panel">
//           <div className="sa-migrate-info">
//             <strong>Migration</strong> converts old plain-string names like <code>"Milk"</code> to multilingual
//             format <code>{`{en:"Milk", ta:"", hi:""}`}</code>. Only needed for items added before the multilingual
//             update. Safe to run multiple times.
//           </div>
//           <button className="sa-btn sa-btn-run-migrate" onClick={runMigration} disabled={migrating}>
//             {migrating ? "⏳ Migrating..." : "⚙ Run Migration Now"}
//           </button>
//         </div>
//       )}

//       {hasOldFormat && (
//         <div className="sa-migrate-notice">
//           ⚠ Some items are in old format (shown in yellow). Click <strong>⚙ Migration</strong> → Run Migration first.
//         </div>
//       )}

//       {/* ── Progress bar ── */}
//       {bulkLoading && (
//         <div className="sa-progress-bar-wrap">
//           <div className="sa-progress-bar"
//             style={{ width: `${Math.round((bulkProgress.done / bulkProgress.total) * 100)}%` }} />
//           <div className="sa-progress-text">
//             Translating {bulkProgress.done} / {bulkProgress.total} items...
//           </div>
//         </div>
//       )}

//       {/* ── Stats ── */}
//       <div className="sa-stats">
//         {[
//           { num: data.menu.length,               label: "Menu Items" },
//           { num: (data.categories||[]).length,    label: "Categories" },
//           { num: data.groceries.length,           label: "Stock Items" },
//           { num: allItems.length, highlight: true, label: "Total Pending" },
//         ].map((s, i) => (
//           <div key={i} className={`sa-stat-card${s.highlight ? " sa-stat-highlight" : ""}`}>
//             <div className="sa-stat-num">{s.num}</div>
//             <div className="sa-stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Tabs ── */}
//       <div className="sa-tabs">
//         {tabs.map(tab => (
//           <button key={tab.key}
//             className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
//             onClick={() => { setActiveTab(tab.key); setSelected(new Set()); setSelectMode(false); }}>
//             {tab.label}
//             <span className="sa-tab-count">{tab.count}</span>
//           </button>
//         ))}
//       </div>

//       {/* ── Content ── */}
//       <div className="sa-content">
//         {loading ? (
//           <div className="sa-loading">Loading items...</div>
//         ) : displayItems.length === 0 ? (
//           <div className="sa-empty">
//             <div className="sa-empty-icon">✅</div>
//             <div className="sa-empty-title">All translated!</div>
//             <div className="sa-empty-sub">No pending translations here.</div>
//           </div>
//         ) : (
//           <div className="sa-table-wrap">

//             {/* ── Table toolbar ── */}
//             <div className="sa-toolbar">
//               <div className="sa-toolbar-left">
//                 {!selectMode ? (
//                   <button className="sa-btn sa-btn-select-toggle"
//                     onClick={() => setSelectMode(true)}>
//                     ☑ Select to Translate
//                   </button>
//                 ) : (
//                   <>
//                     <label className="sa-select-all-label">
//                       <input type="checkbox" checked={allSelected} onChange={toggleAll} />
//                       <span>{allSelected ? "Deselect all" : "Select all"}</span>
//                     </label>
//                     {someSelected && (
//                       <span className="sa-selected-info">{selectedCount} selected</span>
//                     )}
//                     <button className="sa-btn sa-btn-cancel-select" onClick={exitSelectMode}>
//                       ✕ Cancel
//                     </button>
//                   </>
//                 )}
//               </div>
//               <div className="sa-toolbar-right">
//                 <button
//                   className="sa-btn sa-btn-translate-bulk"
//                   onClick={translateSelected}
//                   disabled={bulkLoading}>
//                   {bulkLoading
//                     ? `⏳ ${bulkProgress.done}/${bulkProgress.total}`
//                     : selectMode && someSelected
//                     ? `🌐 Translate Selected (${selectedCount})`
//                     : `🌐 Translate All (${displayItems.length})`}
//                 </button>
//               </div>
//             </div>

//             {/* ── Table head ── */}
//             <div className={`sa-table-head ${showTypeCol ? "with-type" : ""} ${selectMode ? "with-check" : ""}`}>
//               {selectMode && <span></span>}
//               {showTypeCol && <span>Type</span>}
//               <span>English</span>
//               <span>Tamil</span>
//               <span>Hindi</span>
//             </div>

//             {/* ── Rows ── */}
//             {displayItems.map(item => {
//               const isOldFormat = typeof item.name === "string";
//               const isChecked   = selected.has(String(item._id));
//               const enVal       = getName(item.name, "en");

//               return (
//                 <div key={item._id}
//                   className={`sa-table-row ${showTypeCol ? "with-type" : ""} ${selectMode ? "with-check" : ""} ${isChecked ? "sa-row-selected" : ""} ${isOldFormat ? "sa-row-old" : ""}`}>

//                   {/* Checkbox — only visible in selectMode */}
//                   {selectMode && (
//                     <span className="sa-check-cell">
//                       <input type="checkbox" checked={isChecked}
//                         onChange={() => toggleItem(item._id)}
//                         disabled={isOldFormat} />
//                     </span>
//                   )}

//                   {/* Type badge — only in "All" tab */}
//                   {showTypeCol && (
//                     <span>
//                       <span className={`sa-badge sa-badge-${item.type}`}>
//                         {TYPE_LABEL[item.type]}
//                       </span>
//                     </span>
//                   )}

//                   {/* EN / TA / HI cells */}
//                   {["en", "ta", "hi"].map(lang => {
//                     const value  = getName(item.name, lang);
//                     const isBad  = lang !== "en" && (!value?.trim() || value === enVal);

//                     if (editCell?.id === String(item._id) && editCell?.lang === lang) {
//                       return (
//                         <span key={lang}>
//                           <div className="sa-edit-row">
//                             <input autoFocus value={editValue} className="sa-edit-input"
//                               onChange={e => setEditValue(e.target.value)}
//                               onKeyDown={e => e.key === "Enter" && saveManualEdit()} />
//                             <button className="sa-icon-btn sa-save-btn" onClick={saveManualEdit}>✓</button>
//                             <button className="sa-icon-btn sa-cancel-btn" onClick={() => setEditCell(null)}>✕</button>
//                           </div>
//                         </span>
//                       );
//                     }

//                     return (
//                       <span key={lang}>
//                         <div
//                           className={`sa-cell ${isBad && !isOldFormat ? "sa-cell-missing" : ""} ${isOldFormat ? "sa-cell-old" : ""}`}
//                           onClick={() => {
//                             if (isOldFormat) return;
//                             setEditCell({ id: String(item._id), type: item.type, lang });
//                             setEditValue(value);
//                           }}
//                           title={isOldFormat ? "Run migration first" : "Click to edit manually"}>
//                           {isOldFormat && lang === "en"  ? item.name :
//                            isOldFormat                   ? <span className="sa-old-hint">migrate first</span> :
//                            isBad                         ? <MissingBadge /> :
//                            value}
//                         </div>
//                       </span>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Toast ── */}
//       {toast.msg && (
//         <div className={`sa-toast ${toast.type === "error" ? "sa-toast-error" : ""}`}>
//           <span>{toast.msg}</span>
//           <button onClick={() => setToast({ msg: "" })}>✕</button>
//         </div>
//       )}
//     </div>
//   );
// }

// function MissingBadge() {
//   return (
//     <span className="sa-missing-badge">
//       <span className="sa-missing-dot" />
//       not translated
//     </span>
//   );
// }
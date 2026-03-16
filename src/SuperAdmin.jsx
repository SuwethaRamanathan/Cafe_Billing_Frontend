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
const IcoMenu   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;

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
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const [page, setPage]             = useState("translation");
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = PAGE_META[page] || {};
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="sa-shell">
      {mobileOpen && <div className="sa-sidebar-overlay visible" onClick={() => setMobileOpen(false)} />}
      <aside className={`sa-sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
        <div className="sa-sidebar-brand">
          {!collapsed && <span className="sa-brand-name">Super Admin</span>}
        </div>
        <nav className="sa-nav">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button key={key} className={`sa-nav-item${page === key ? " active" : ""}`}
              onClick={() => { setPage(key); setMobileOpen(false); }}
              title={collapsed ? label : undefined}>
              <span className="sa-nav-icon"><Icon /></span>
              {!collapsed && <span className="sa-nav-label">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="sa-sidebar-footer">
          <button className="sa-nav-item sa-nav-logout"
            // onClick={() => { localStorage.clear(); navigate("/"); }}

            onClick={() => setShowLogoutConfirm(true)}

            title={collapsed ? "Logout" : undefined}>
            <span className="sa-nav-icon"><IcoLogout /></span>
            {!collapsed && <span className="sa-nav-label">Logout</span>}
          </button>
        </div>
      </aside>
      <div className="sa-main">
        <div className="sa-topbar">
          <button className="sa-hamburger-btn" onClick={() => setMobileOpen(v => !v)}>
            {/* <IcoMenu /> */}

            {mobileOpen ? "✕" : <IcoMenu />}

          </button>
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
      
      {showLogoutConfirm && (
  <div
    className="sa-modal-overlay"
    onClick={e => e.target === e.currentTarget && setShowLogoutConfirm(false)}
  >
    <div className="sa-modal sa-modal-sm">
      <div className="sa-modal-title">Logout?</div>

      <p className="sa-modal-body">
        Are you sure you want to logout from the admin panel?
      </p>

      <div className="sa-modal-actions">
        <button
          className="tp-btn tp-btn-danger"
          onClick={() => {
            setShowLogoutConfirm(false);
            localStorage.clear();
            navigate("/");
          }}
        >
          Yes, Logout
        </button>

        <button
          className="tp-btn tp-btn-ghost"
          onClick={() => setShowLogoutConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

function TranslationPage({ token }) {
  const [data, setData]           = useState({ menu: [], categories: [], groceries: [] });
  const [loading, setLoading]     = useState(true);
  const [bulkLoad, setBulkLoad]   = useState(false);
  const [progress, setProgress]   = useState({ done: 0, total: 0 });
  const [toast, setToast]         = useState({ msg: "", type: "ok" });
  const [editCell, setEditCell]   = useState(null);
  const [editVal, setEditVal]     = useState("");
  const [tab, setTab]             = useState("all");
  const [selected, setSelected]   = useState(new Set());
  const [selMode, setSelMode]     = useState(false);
  // const [showMig, setShowMig]     = useState(false);
  // const [migrating, setMigrating] = useState(false);
  
  const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 4500); };
  const getN  = (f, l = "en") => !f ? "" : typeof f === "string" ? f : f[l] || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
        headers: { Authorization: `Bearer ${token}` },
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
      body: JSON.stringify({ id, type, name }),
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
    tab === "category" ? (data.categories || []).map(i => ({ ...i, type: "category" })) :
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
  //   if (!window.confirm("Convert old string names to {en, ta, hi} format and add them to the queue. Continue?")) return;
  //   setMigrating(true);
  //   try {
  //     const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
  //       method: "POST", headers: { Authorization: `Bearer ${token}` },
  //     }).then(r => r.json());
  //     flash(json.msg || "Migration done!");
  //     load();
  //   } catch { flash("Migration failed", "err"); }
  //   finally { setMigrating(false); }
  // };

  // Manual save: one language field edited by superadmin.
  // Backend returns fullyTranslated:true when all 3 langs are filled → item leaves queue.
  const saveEdit = async () => {
    if (!editCell) return;
    try {
      const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editVal }),
      }).then(r => r.json());
      if (json.success) {
        flash(json.fullyTranslated ? "✓ All languages filled — removed from queue!" : "Saved!");
        setEditCell(null);
        load();
      } else { flash("Save failed", "err"); }
    } catch { flash("Save failed", "err"); }
  };

  const showType  = tab === "all";
  const allSel    = displayItems.length > 0 && displayItems.every(i => selected.has(String(i._id)));
  const selCount  = displayItems.filter(i => selected.has(String(i._id))).length;
  const toggle    = id => setSelected(p => { const n = new Set(p); n.has(String(id)) ? n.delete(String(id)) : n.add(String(id)); return n; });
  const toggleAll = () => allSel ? setSelected(new Set()) : setSelected(new Set(displayItems.map(i => String(i._id))));
  const exitSel   = () => { setSelMode(false); setSelected(new Set()); };

  const tabs = [
    { key: "all",      label: "All",        count: flat().length },
    { key: "menu",     label: "Menu",       count: data.menu.length },
    { key: "category", label: "Categories", count: (data.categories || []).length },
    { key: "grocery",  label: "Stock",      count: data.groceries.length },
  ];

  return (
    <div className="tp-wrap">
      <div className="tp-stats">
        {[
          { n: data.menu.length,             l: "Menu Items",  c: "orange" },
          { n: (data.categories||[]).length,  l: "Categories", c: "purple" },
          { n: data.groceries.length,         l: "Stock",      c: "green"  },
          { n: flat().length,                 l: "Pending",    c: "red"    },
        ].map((s, i) => (
          <div key={i} className={`tp-stat tp-stat-${s.c}`}>
            <div><div className="tp-stat-num">{s.n}</div><div className="tp-stat-label">{s.l}</div></div>
          </div>
        ))}
      </div>

      <div className="tp-migrate-row">
        {/* <button className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setShowMig(v => !v)}>
          <IcoTool /> {showMig ? "Hide Migration" : "Migration Tools"}
        </button> */}
      </div>
      {/* {showMig && (
        <div className="tp-migrate-panel">
          <p>Converts old <code>"Milk"</code> to <code>{`{en:"Milk", ta:"", hi:""}`}</code> and adds them to this queue. Run once for items added before multilingual support.</p>
          <button className="tp-btn tp-btn-primary" onClick={runMigrate} disabled={migrating}>
            {migrating ? "⏳ Migrating..." : "⚙ Run Migration Now"}
          </button>
        </div>
      )} */}

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
            {bulkLoad ? `${progress.done}/${progress.total}...`
              : selMode && selCount > 0 ? `Translate Selected (${selCount})`
              : `Translate All (${displayItems.length})`}
          </button>
        </div>

        {loading ? (
          <div className="tp-loading">Loading translation queue...</div>
        ) : displayItems.length === 0 ? (
          <div className="tp-empty">
            <div className="tp-empty-title">Queue is empty!</div>
            <div className="tp-empty-sub">All items in this tab are fully translated.</div>
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
                    const val       = getN(item.name, lang);
                    const bad       = !isOld && isMissingLang(item.name, lang);
                    const isEditing = editCell?.id === String(item._id) && editCell?.lang === lang;

                    if (isEditing) {
                      return (
                        <span key={lang}>
                          <div className="tp-edit-row">
                            <input autoFocus value={editVal} className="tp-edit-input"
                              placeholder={lang === "en" ? "English" : lang === "ta" ? "தமிழ்" : "हिंदी"}
                              onChange={e => setEditVal(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditCell(null); }} />
                            <button className="tp-icon-btn green" onClick={saveEdit} title="Save (Enter)"><IcoCheck /></button>
                            <button className="tp-icon-btn red" onClick={() => setEditCell(null)} title="Cancel (Esc)">✕</button>
                          </div>
                        </span>
                      );
                    }


                    return (
                      <span key={lang}>
                        {/* tp-cell wraps the value + the edit pencil icon.
                            The pencil is always in the DOM but only VISIBLE on hover (via CSS).
                            Clicking it opens the inline editor for that specific language cell. */}
                        <div className={`tp-cell${bad ? " missing" : ""}${isOld ? " old" : ""}`}
                          title={isOld ? "Run Migration Tools first" : ""}>
                          <span className="tp-cell-content">
                            {isOld && lang === "en" ? item.name :
                             isOld                  ? <span className="tp-old-hint">migrate first</span> :
                             bad                    ? <MissingPill /> : val}
                          </span>
                          {!isOld && (
                            <button className="tp-cell-edit-btn"
                              title={`Manually edit ${lang === "en" ? "English" : lang === "ta" ? "Tamil" : "Hindi"}`}
                              onClick={() => { setEditCell({ id: String(item._id), type: item.type, lang }); setEditVal(val); }}>
                              <IcoEdit />
                            </button>
                          )}
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

      <div className="tp-queue-notice">
        <strong>How the queue works:</strong> Items appear here automatically when an admin adds or edits a
        menu item, category, or stock item in any language. Once all three languages are filled
        (by auto-translation or manual edit), the item is removed from this queue automatically — no full DB scan needed.
        If an admin later edits a name, the item re-enters the queue for re-translation.
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
        headers: { Authorization: `Bearer ${token}` },
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
        body: JSON.stringify(form),
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
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
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
        body: JSON.stringify({ role: newRole }),
      }).then(r => r.json());
      if (json.success) { flash("Role updated"); setEditRole(null); load(); }
      else flash(json.msg || "Update failed", "err");
    } catch { flash("Update failed", "err"); }
  };
  const ROLE_COLOR = { admin: "orange", cashier: "blue", superadmin: "purple" };
  const admins   = users.filter(u => u.role === "admin").length;
  const cashiers = users.filter(u => u.role === "cashier").length;
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
        <button className="tp-btn tp-btn-primary" onClick={() => { setShowForm(true); setFormErr(""); setShowPass(false); }}>
          <IcoPlus /> Add User
        </button>
      </div>
      <div className="up-legend">
        <span className="up-legend-item"><span className="up-role-dot orange" />Admin — full access to menu, stock, sales</span>
        <span className="up-legend-item"><span className="up-role-dot blue" />Cashier — billing and orders only</span>
      </div>
      <div className="up-card">
        {loading ? <div className="tp-loading">Loading users...</div>
        : users.length === 0 ? (
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
                    <button className="up-del-btn" onClick={() => setDelTgt(user)} title="Remove user"><IcoTrash /></button>
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
            <div className="sa-modal-field"><label>Full Name</label>
              <input placeholder="e.g. Ravi Kumar" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && createUser()} /></div>
            <div className="sa-modal-field"><label>Email Address</label>
              <input type="email" placeholder="ravi@yourcafe.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && createUser()} /></div>
            <div className="sa-modal-field"><label>Password</label>
              <div className="sa-pass-wrap">
                <input type={showPass ? "text" : "password"} placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && createUser()} />
                <button type="button" className="sa-pass-toggle" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div></div>
            <div className="sa-modal-field"><label>Role</label>
              <div className="sa-role-picker">
                {[{ r:"cashier", icon:"💳", title:"Cashier", desc:"Billing & orders only" },
                  { r:"admin",   icon:"👑", title:"Admin",   desc:"Full menu & stock access" }
                ].map(({ r, icon, title, desc }) => (
                  <button key={r} type="button"
                    className={`sa-role-btn${form.role === r ? " active" : ""}`}
                    onClick={() => setForm(p => ({ ...p, role: r }))}>
                    {icon} {title}<span className="sa-role-desc">{desc}</span>
                  </button>
                ))}
              </div></div>
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
            <p className="sa-modal-body"><strong>{delTarget.name}</strong> ({delTarget.email}) will lose access immediately. This cannot be undone.</p>
            <div className="sa-modal-actions">
              <button className="tp-btn tp-btn-danger" onClick={deleteUser}>Yes, Remove</button>
              <button className="tp-btn tp-btn-ghost" onClick={() => setDelTgt(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {toast.msg && <Toast msg={toast.msg} err={toast.type === "err"} onClose={() => setToast({ msg: "" })} />}
    </div>
  );
}


function MissingPill() {
  return <span className="tp-missing-pill"><span className="tp-missing-dot" />not translated</span>;
}
function Toast({ msg, err, onClose }) {
  return <div className={`sa-toast${err ? " error" : ""}`}><span>{msg}</span><button onClick={onClose}>✕</button></div>;
}



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./superadmin.css";


// const IcoGlobe  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
// const IcoUsers  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
// const IcoTool   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
// const IcoLogout = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
// const IcoPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
// const IcoEye    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
// const IcoEyeOff = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
// const IcoTrash  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
// const IcoEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
// const IcoCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
// const IcoMenu   = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// );

// const NAV_ITEMS = [
//   { key: "translation", label: "Translation",     Icon: IcoGlobe },
//   { key: "users",       label: "User Management", Icon: IcoUsers },
// ];

// const PAGE_META = {
//   translation: { title: "Translation Dashboard",  sub: "Manage multilingual content" },
//   users:       { title: "User Management",         sub: "Add and manage staff accounts" },
// };

// async function translateText(text, targetLang, sourceLang = "en") {
//   if (!text?.trim() || sourceLang === targetLang) return "";
//   try {
//     const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
//     const data = await fetch(url).then(r => r.json());
//     if (data.responseStatus === 200 && data.responseData?.translatedText) {
//       const result = data.responseData.translatedText;
//       return result.toLowerCase() === text.toLowerCase() ? "" : result;
//     }
//     return "";
//   } catch { return ""; }
// }

// async function translateToAll(text, sourceLang = "en") {
//   const out = { en: "", ta: "", hi: "" };
//   out[sourceLang] = text;
//   if (sourceLang !== "en") {
//     const en = await translateText(text, "en", sourceLang);
//     out.en = en || "";
//     for (const lang of ["ta", "hi"].filter(l => l !== sourceLang)) {
//       if (en) out[lang] = await translateText(en, lang, "en");
//     }
//   } else {
//     await Promise.all(["ta", "hi"].map(async l => { out[l] = await translateText(text, l, "en"); }));
//   }
//   return out;
// }

// function detectSourceLang(nameObj) {
//   if (!nameObj || typeof nameObj === "string") return "en";
//   if (nameObj.en?.trim()) return "en";
//   if (nameObj.ta?.trim()) return "ta";
//   if (nameObj.hi?.trim()) return "hi";
//   return "en";
// }

// function isMissingLang(nameObj, lang) {
//   if (!nameObj || typeof nameObj === "string") return lang !== "en";
//   const v  = nameObj[lang]?.trim() || "";
//   const en = nameObj.en?.trim()    || "";
//   if (!v) return true;
//   if (lang === "ta" && v === en && en) return true;
//   if (lang === "hi" && v === en && en) return true;
//   return false;
// }

// const TYPE_LABEL = { menu: "Menu", category: "Category", grocery: "Stock" };

// export default function SuperAdmin() {
//   const navigate   = useNavigate();
//   const token      = localStorage.getItem("token");
//   const [page, setPage]               = useState("translation");
//   const [collapsed, setCollapsed]     = useState(false);
//   // Mobile sidebar open/close state
//   const [mobileOpen, setMobileOpen]   = useState(false);

//   const meta = PAGE_META[page] || {};

//   // Close sidebar on page change (mobile)
//   const handleNavClick = (key) => {
//     setPage(key);
//     setMobileOpen(false);
//   };

//   return (
//     <div className="sa-shell">

//       {/* ── Mobile overlay ── */}
//       {mobileOpen && (
//         <div
//           className="sa-sidebar-overlay visible"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* ── Sidebar ── */}
//       <aside className={`sa-sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}>
//         <div className="sa-sidebar-brand">
//           {!collapsed && <span className="sa-brand-name">Super Admin</span>}
//         </div>

//         <nav className="sa-nav">
//           {NAV_ITEMS.map(({ key, label, Icon }) => (
//             <button key={key}
//               className={`sa-nav-item${page === key ? " active" : ""}`}
//               onClick={() => handleNavClick(key)}
//               title={collapsed ? label : undefined}>
//               <span className="sa-nav-icon"><Icon /></span>
//               {!collapsed && <span className="sa-nav-label">{label}</span>}
//             </button>
//           ))}
//         </nav>

//         <div className="sa-sidebar-footer">
//           <button className="sa-nav-item sa-nav-logout"
//             onClick={() => { localStorage.clear(); navigate("/"); }}
//             title={collapsed ? "Logout" : undefined}>
//             <span className="sa-nav-icon"><IcoLogout /></span>
//             {!collapsed && <span className="sa-nav-label">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       <div className="sa-main">
//         <div className="sa-topbar">
//           {/* Hamburger: visible only on mobile via CSS */}
//           <button
//             className="sa-hamburger-btn"
//             onClick={() => setMobileOpen(v => !v)}
//             aria-label="Open menu"
//           >
//             <IcoMenu />
//           </button>

//           {/* Collapse button: visible only on desktop via CSS */}
//           <button className="sa-collapse-btn" onClick={() => setCollapsed(v => !v)}>
//             <span className="sa-collapse-icon">{collapsed ? "›" : "‹"}</span>
//           </button>

//           <div className="sa-topbar-title">{meta.title}</div>
//           <div className="sa-topbar-sub">{meta.sub}</div>
//         </div>

//         <div className="sa-page-body">
//           {page === "translation" && <TranslationPage token={token} />}
//           {page === "users"       && <UsersPage       token={token} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// function TranslationPage({ token }) {
//   const [data, setData]           = useState({ menu: [], categories: [], groceries: [] });
//   const [loading, setLoading]     = useState(true);
//   const [bulkLoad, setBulkLoad]   = useState(false);
//   const [progress, setProgress]   = useState({ done: 0, total: 0 });
//   const [toast, setToast]         = useState({ msg: "", type: "ok" });
//   const [editCell, setEditCell]   = useState(null);
//   const [editVal, setEditVal]     = useState("");
//   const [tab, setTab]             = useState("all");
//   const [selected, setSelected]   = useState(new Set());
//   const [selMode, setSelMode]     = useState(false);

//   const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 4500); };
//   const getN  = (f, l = "en") => !f ? "" : typeof f === "string" ? f : f[l] || "";

//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setData(await res.json());
//       setSelected(new Set());
//     } catch { flash("Failed to load items", "err"); }
//     finally { setLoading(false); }
//   };
//   useEffect(() => { load(); }, []);

//   const saveTrans = async (id, type, name) => {
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/save-translation`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ id, type, name })
//     });
//     return res.json();
//   };

//   const flat = () => [
//     ...data.menu.map(i => ({ ...i, type: "menu" })),
//     ...(data.categories || []).map(i => ({ ...i, type: "category" })),
//     ...data.groceries.map(i => ({ ...i, type: "grocery" })),
//   ];

//   const displayItems =
//     tab === "all"      ? flat() :
//     tab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" })) :
//     tab === "category" ? (data.categories||[]).map(i => ({ ...i, type: "category" })) :
//     data.groceries.map(i => ({ ...i, type: "grocery" }));

//   const translateBulk = async () => {
//     const targets = selMode && selected.size > 0
//       ? flat().filter(i => selected.has(String(i._id)))
//       : displayItems;
//     if (!targets.length) { flash("Nothing to translate"); return; }

//     setBulkLoad(true);
//     setProgress({ done: 0, total: targets.length });
//     let ok = 0, fail = 0;

//     for (const item of targets) {
//       if (typeof item.name === "string") { fail++; setProgress(p => ({ ...p, done: p.done+1 })); continue; }
//       try {
//         const sl  = detectSourceLang(item.name);
//         const src = item.name[sl];
//         if (!src?.trim()) { fail++; continue; }
//         const t   = await translateToAll(src, sl);
//         const ex  = item.name;
//         const upd = {
//           en: t.en || ex.en || src,
//           ta: (ex.ta?.trim() && ex.ta !== ex.en) ? ex.ta : (t.ta || ""),
//           hi: (ex.hi?.trim() && ex.hi !== ex.en) ? ex.hi : (t.hi || ""),
//         };
//         (await saveTrans(item._id, item.type, upd)).success ? ok++ : fail++;
//       } catch { fail++; }
//       setProgress(p => ({ ...p, done: p.done+1 }));
//       await new Promise(r => setTimeout(r, 380));
//     }
//     setBulkLoad(false);
//     flash(`✓ ${ok} translated${fail ? `, ${fail} failed` : ""}`);
//     load();
//   };

//   const saveEdit = async () => {
//     if (!editCell) return;
//     try {
//       const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editVal })
//       }).then(r => r.json());
//       if (json.success) { flash("Saved!"); setEditCell(null); load(); }
//     } catch { flash("Save failed", "err"); }
//   };

//   const showType    = tab === "all";
//   const allSel      = displayItems.length > 0 && displayItems.every(i => selected.has(String(i._id)));
//   const selCount    = displayItems.filter(i => selected.has(String(i._id))).length;
//   const toggle      = id => setSelected(p => { const n = new Set(p); n.has(String(id)) ? n.delete(String(id)) : n.add(String(id)); return n; });
//   const toggleAll   = () => allSel ? setSelected(new Set()) : setSelected(new Set(displayItems.map(i => String(i._id))));
//   const exitSel     = () => { setSelMode(false); setSelected(new Set()); };

//   const tabs = [
//     { key: "all",      label: "All",        count: flat().length },
//     { key: "menu",     label: "Menu",       count: data.menu.length },
//     { key: "category", label: "Categories", count: (data.categories||[]).length },
//     { key: "grocery",  label: "Stock",      count: data.groceries.length },
//   ];

//   return (
//     <div className="tp-wrap">
//       <div className="tp-stats">
//         {[
//           { n: data.menu.length,            l: "Menu Items",  c: "orange" },
//           { n: (data.categories||[]).length, l: "Categories", c: "purple" },
//           { n: data.groceries.length,        l: "Stock",      c: "green"  },
//           { n: flat().length,                l: "Pending",    c: "red"    },
//         ].map((s, i) => (
//           <div key={i} className={`tp-stat tp-stat-${s.c}`}>
//             <div><div className="tp-stat-num">{s.n}</div><div className="tp-stat-label">{s.l}</div></div>
//           </div>
//         ))}
//       </div>

//       {bulkLoad && (
//         <div className="tp-progress-wrap">
//           <div className="tp-progress-track">
//             <div className="tp-progress-fill" style={{ width: `${Math.round((progress.done/progress.total)*100)}%` }} />
//           </div>
//           <div className="tp-progress-text">Translating {progress.done} / {progress.total} items...</div>
//         </div>
//       )}

//       <div className="tp-card">
//         <div className="tp-tabs">
//           {tabs.map(t => (
//             <button key={t.key} className={`tp-tab${tab === t.key ? " active" : ""}`}
//               onClick={() => { setTab(t.key); setSelected(new Set()); setSelMode(false); }}>
//               {t.label}<span className="tp-tab-pill">{t.count}</span>
//             </button>
//           ))}
//         </div>

//         <div className="tp-toolbar">
//           <div className="tp-toolbar-left">
//             {!selMode ? (
//               <button className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setSelMode(true)}>☑ Select Items</button>
//             ) : (
//               <>
//                 <label className="tp-check-all">
//                   <input type="checkbox" checked={allSel} onChange={toggleAll} />
//                   <span>{allSel ? "Deselect all" : "Select all"}</span>
//                 </label>
//                 {selCount > 0 && <span className="tp-selected-pill">{selCount} selected</span>}
//                 <button className="tp-btn tp-btn-ghost tp-btn-sm tp-btn-red" onClick={exitSel}>✕ Cancel</button>
//               </>
//             )}
//           </div>
//           <button className="tp-btn tp-btn-primary" onClick={translateBulk} disabled={bulkLoad}>
//             <IcoGlobe />
//             {bulkLoad
//               ? `${progress.done}/${progress.total}...`
//               : selMode && selCount > 0
//               ? `Translate Selected (${selCount})`
//               : `Translate All (${displayItems.length})`}
//           </button>
//         </div>

//         {loading ? (
//           <div className="tp-loading">Loading items...</div>
//         ) : displayItems.length === 0 ? (
//           <div className="tp-empty">
//             <div className="tp-empty-title">All translated!</div>
//             <div className="tp-empty-sub">No pending translations in this tab.</div>
//           </div>
//         ) : (
//           <div className="tp-table-scroll">
//             <div className={`tp-table-head${showType ? " w-type" : ""}${selMode ? " w-check" : ""}`}>
//               {selMode  && <span></span>}
//               {showType && <span>Type</span>}
//               <span>English</span><span>Tamil</span><span>Hindi</span>
//             </div>

//             {displayItems.map(item => {
//               const isOld = typeof item.name === "string";
//               const isChk = selected.has(String(item._id));
//               return (
//                 <div key={item._id}
//                   className={`tp-table-row${showType ? " w-type" : ""}${selMode ? " w-check" : ""}${isChk ? " checked" : ""}${isOld ? " old-fmt" : ""}`}>

//                   {selMode && (
//                     <span className="tp-check-cell">
//                       <input type="checkbox" checked={isChk} onChange={() => toggle(item._id)} disabled={isOld} />
//                     </span>
//                   )}

//                   {showType && (
//                     <span><span className={`tp-type-badge tp-badge-${item.type}`}>{TYPE_LABEL[item.type]}</span></span>
//                   )}

//                   {["en", "ta", "hi"].map(lang => {
//                     const val = getN(item.name, lang);
//                     const bad = !isOld && isMissingLang(item.name, lang);

//                     if (editCell?.id === String(item._id) && editCell?.lang === lang) {
//                       return (
//                         <span key={lang}>
//                           <div className="tp-edit-row">
//                             <input autoFocus value={editVal} className="tp-edit-input"
//                               onChange={e => setEditVal(e.target.value)}
//                               onKeyDown={e => e.key === "Enter" && saveEdit()} />
//                             <button className="tp-icon-btn green" onClick={saveEdit}><IcoCheck /></button>
//                             <button className="tp-icon-btn red" onClick={() => setEditCell(null)}>✕</button>
//                           </div>
//                         </span>
//                       );
//                     }

//                     return (
//                       <span key={lang}>
//                         <div className={`tp-cell${bad ? " missing" : ""}${isOld ? " old" : ""}`}
//                           onClick={() => { if (isOld) return; setEditCell({ id: String(item._id), type: item.type, lang }); setEditVal(val); }}
//                           title={isOld ? "Run migration first" : "Click to edit"}>
//                           {isOld && lang === "en" ? item.name :
//                            isOld                  ? <span className="tp-old-hint">migrate first</span> :
//                            bad                    ? <MissingPill /> : val}
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

//       {toast.msg && <Toast msg={toast.msg} err={toast.type === "err"} onClose={() => setToast({ msg: "" })} />}
//     </div>
//   );
// }

// function UsersPage({ token }) {
//   const [users, setUsers]       = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [toast, setToast]       = useState({ msg: "", type: "ok" });
//   const [delTarget, setDelTgt]  = useState(null);
//   const [editRole, setEditRole] = useState(null);
//   const [showPass, setShowPass] = useState(false);
//   const [submitting, setSub]    = useState(false);
//   const [form, setForm]         = useState({ name: "", email: "", password: "", role: "cashier" });
//   const [formErr, setFormErr]   = useState("");

//   const flash = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 4000); };

//   const load = async () => {
//     setLoading(true);
//     try {
//       const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       }).then(r => r.json());
//       setUsers(Array.isArray(json) ? json : []);
//     } catch { flash("Failed to load users", "err"); }
//     finally { setLoading(false); }
//   };
//   useEffect(() => { load(); }, []);

//   const createUser = async () => {
//     setFormErr("");
//     if (!form.name.trim())        { setFormErr("Name is required"); return; }
//     if (!form.email.trim())       { setFormErr("Email is required"); return; }
//     if (!form.password.trim())    { setFormErr("Password is required"); return; }
//     if (form.password.length < 6) { setFormErr("Password must be at least 6 characters"); return; }

//     setSub(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form)
//       });
//       const json = await res.json();
//       if (!res.ok) { setFormErr(json.msg || "Failed to create user"); return; }
//       flash(`✓ ${form.name} added as ${form.role}`);
//       setForm({ name: "", email: "", password: "", role: "cashier" });
//       setShowForm(false);
//       load();
//     } catch { setFormErr("Network error. Try again."); }
//     finally { setSub(false); }
//   };

//   const deleteUser = async () => {
//     if (!delTarget) return;
//     try {
//       const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users/${delTarget._id}`, {
//         method: "DELETE", headers: { Authorization: `Bearer ${token}` }
//       }).then(r => r.json());
//       if (json.success) { flash(`${delTarget.name} removed`); setDelTgt(null); load(); }
//       else flash(json.msg || "Delete failed", "err");
//     } catch { flash("Delete failed", "err"); }
//   };

//   const changeRole = async (userId, newRole) => {
//     try {
//       const json = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/users/${userId}/role`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ role: newRole })
//       }).then(r => r.json());
//       if (json.success) { flash("Role updated"); setEditRole(null); load(); }
//       else flash(json.msg || "Update failed", "err");
//     } catch { flash("Update failed", "err"); }
//   };

//   const ROLE_COLOR = { admin: "orange", cashier: "blue", superadmin: "purple" };
//   const admins     = users.filter(u => u.role === "admin").length;
//   const cashiers   = users.filter(u => u.role === "cashier").length;

//   return (
//     <div className="up-wrap">
//       <div className="up-header-row">
//         <div>
//           <div className="up-page-title">Staff Accounts</div>
//           <div className="up-page-sub">
//             {users.length} user{users.length !== 1 ? "s" : ""}
//             {admins > 0   && ` · ${admins} admin${admins > 1 ? "s" : ""}`}
//             {cashiers > 0 && ` · ${cashiers} cashier${cashiers > 1 ? "s" : ""}`}
//           </div>
//         </div>
//         <button className="tp-btn tp-btn-primary"
//           onClick={() => { setShowForm(true); setFormErr(""); setShowPass(false); }}>
//           <IcoPlus /> Add User
//         </button>
//       </div>

//       <div className="up-legend">
//         <span className="up-legend-item"><span className="up-role-dot orange" />Admin — full access to menu, stock, sales</span>
//         <span className="up-legend-item"><span className="up-role-dot blue" />Cashier — billing and orders only</span>
//       </div>

//       <div className="up-card">
//         {loading ? (
//           <div className="tp-loading">Loading users...</div>
//         ) : users.length === 0 ? (
//           <div className="tp-empty">
//             <div className="tp-empty-icon">👥</div>
//             <div className="tp-empty-title">No staff accounts yet</div>
//             <div className="tp-empty-sub">Click "Add User" to create the first one.</div>
//           </div>
//         ) : (
//           <>
//             <div className="up-table-head">
//               <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
//             </div>
//             {users.map(user => (
//               <div key={user._id} className="up-table-row">
//                 <span className="up-user-name">
//                   <span className="up-avatar">{user.name?.[0]?.toUpperCase() || "?"}</span>
//                   {user.name}
//                 </span>
//                 <span className="up-user-email">{user.email}</span>
//                 <span>
//                   {editRole === user._id ? (
//                     <div className="up-role-edit">
//                       <select defaultValue={user.role} className="up-role-select"
//                         onChange={e => changeRole(user._id, e.target.value)}>
//                         <option value="admin">admin</option>
//                         <option value="cashier">cashier</option>
//                       </select>
//                       <button className="tp-icon-btn red" onClick={() => setEditRole(null)}>✕</button>
//                     </div>
//                   ) : (
//                     <span className={`up-role-badge ${ROLE_COLOR[user.role] || "gray"}`}
//                       onClick={() => user.role !== "superadmin" && setEditRole(user._id)}
//                       title={user.role !== "superadmin" ? "Click to change role" : ""}
//                       style={{ cursor: user.role !== "superadmin" ? "pointer" : "default" }}>
//                       {user.role}
//                       {user.role !== "superadmin" && <span className="up-edit-hint"><IcoEdit /></span>}
//                     </span>
//                   )}
//                 </span>
//                 <span className="up-actions">
//                   {user.role !== "superadmin" && (
//                     <button className="up-del-btn" onClick={() => setDelTgt(user)} title="Remove user">
//                       <IcoTrash />
//                     </button>
//                   )}
//                 </span>
//               </div>
//             ))}
//           </>
//         )}
//       </div>

//       {showForm && (
//         <div className="sa-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
//           <div className="sa-modal">
//             <div className="sa-modal-title">Add New Staff</div>
//             <div className="sa-modal-sub">They'll use this email and password to log in.</div>
//             {formErr && <div className="sa-modal-err">{formErr}</div>}

//             <div className="sa-modal-field">
//               <label>Full Name</label>
//               <input placeholder="e.g. Ravi Kumar" value={form.name}
//                 onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
//                 onKeyDown={e => e.key === "Enter" && createUser()} />
//             </div>
//             <div className="sa-modal-field">
//               <label>Email Address</label>
//               <input type="email" placeholder="ravi@yourcafe.com" value={form.email}
//                 onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
//                 onKeyDown={e => e.key === "Enter" && createUser()} />
//             </div>
//             <div className="sa-modal-field">
//               <label>Password</label>
//               <div className="sa-pass-wrap">
//                 <input type={showPass ? "text" : "password"} placeholder="Minimum 6 characters"
//                   value={form.password}
//                   onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
//                   onKeyDown={e => e.key === "Enter" && createUser()} />
//                 <button type="button" className="sa-pass-toggle" onClick={() => setShowPass(v => !v)}>
//                   {showPass ? <IcoEyeOff /> : <IcoEye />}
//                 </button>
//               </div>
//             </div>
//             <div className="sa-modal-field">
//               <label>Role</label>
//               <div className="sa-role-picker">
//                 {[
//                   { r: "cashier", icon: "💳", title: "Cashier", desc: "Billing & orders only" },
//                   { r: "admin",   icon: "👑", title: "Admin",   desc: "Full menu & stock access" },
//                 ].map(({ r, icon, title, desc }) => (
//                   <button key={r} type="button"
//                     className={`sa-role-btn${form.role === r ? " active" : ""}`}
//                     onClick={() => setForm(p => ({ ...p, role: r }))}>
//                     {icon} {title}
//                     <span className="sa-role-desc">{desc}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="sa-modal-actions">
//               <button className="tp-btn tp-btn-primary" onClick={createUser} disabled={submitting}>
//                 {submitting ? "Creating..." : "Create Account"}
//               </button>
//               <button className="tp-btn tp-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {delTarget && (
//         <div className="sa-modal-overlay" onClick={e => e.target === e.currentTarget && setDelTgt(null)}>
//           <div className="sa-modal sa-modal-sm">
//             <div className="sa-modal-title">Remove User?</div>
//             <p className="sa-modal-body">
//               <strong>{delTarget.name}</strong> ({delTarget.email}) will lose access immediately. This cannot be undone.
//             </p>
//             <div className="sa-modal-actions">
//               <button className="tp-btn tp-btn-danger" onClick={deleteUser}>Yes, Remove</button>
//               <button className="tp-btn tp-btn-ghost"  onClick={() => setDelTgt(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {toast.msg && <Toast msg={toast.msg} err={toast.type === "err"} onClose={() => setToast({ msg: "" })} />}
//     </div>
//   );
// }

// function MissingPill() {
//   return (
//     <span className="tp-missing-pill">
//       <span className="tp-missing-dot" />
//       not translated
//     </span>
//   );
// }

// function Toast({ msg, err, onClose }) {
//   return (
//     <div className={`sa-toast${err ? " error" : ""}`}>
//       <span>{msg}</span>
//       <button onClick={onClose}>✕</button>
//     </div>
//   );
// }
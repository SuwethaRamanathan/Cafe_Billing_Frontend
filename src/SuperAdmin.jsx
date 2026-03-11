import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./superadmin.css";

// ── Label map for display ──
const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };
const LANG_LABEL = { en: "English", ta: "Tamil", hi: "Hindi" };

export default function SuperAdmin() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [data, setData]           = useState({ menu: [], categories: [], groceries: [] });
  const [loading, setLoading]     = useState(true);
  const [translating, setTranslating] = useState({}); // { id: true/false }
  const [bulkLoading, setBulkLoading] = useState(false);
  const [migrating, setMigrating]   = useState(false);
  const [toast, setToast]           = useState("");
  const [editCell, setEditCell]     = useState(null); // { id, type, lang }
  const [editValue, setEditValue]   = useState("");
  const [activeTab, setActiveTab]   = useState("all"); // "all" | "menu" | "category" | "grocery"

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Fetch all untranslated items ──
  const fetchUntranslated = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch {
      showToast("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUntranslated(); }, []);

  // ── Translate one item ──
  const translateOne = async (id, type) => {
    setTranslating(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-one`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, type })
      });
      const json = await res.json();
      if (json.success) {
        showToast("Translated successfully!");
        fetchUntranslated();
      } else {
        showToast("Translation failed");
      }
    } catch {
      showToast("Translation failed");
    } finally {
      setTranslating(prev => ({ ...prev, [id]: false }));
    }
  };

  // ── Translate all ──
  const translateAll = async (type = "all") => {
    setBulkLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type })
      });
      const json = await res.json();
      if (json.success) {
        const r = json.results;
        showToast(`Done! Menu: ${r.menu}, Categories: ${r.categories}, Stock: ${r.groceries}${r.errors ? `, Errors: ${r.errors}` : ""}`);
        fetchUntranslated();
      }
    } catch {
      showToast("Bulk translation failed");
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Run migration (one-time) ──
  const runMigration = async () => {
    if (!window.confirm("This will convert all old string names to multilingual format. Run once only. Continue?")) return;
    setMigrating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      showToast(json.msg || "Migration done");
      fetchUntranslated();
    } catch {
      showToast("Migration failed");
    } finally {
      setMigrating(false);
    }
  };

  // ── Save manual edit ──
  const saveManualEdit = async () => {
    if (!editCell) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
      });
      const json = await res.json();
      if (json.success) {
        showToast("Saved!");
        setEditCell(null);
        fetchUntranslated();
      }
    } catch {
      showToast("Save failed");
    }
  };

  // ── Build flat list based on active tab ──
  const allItems = [
    ...data.menu.map(i => ({ ...i, type: "menu" })),
    ...data.categories.map(i => ({ ...i, type: "category" })),
    ...data.groceries.map(i => ({ ...i, type: "grocery" })),
  ];

  const displayItems = activeTab === "all" ? allItems
    : activeTab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" }))
    : activeTab === "category" ? data.categories.map(i => ({ ...i, type: "category" }))
    : data.groceries.map(i => ({ ...i, type: "grocery" }));

  const totalUntranslated = allItems.length;

  return (
    <div className="sa-wrap">

      {/* ── Header ── */}
      <div className="sa-header">
        <div className="sa-header-left">
          <div className="sa-title">🌐 Translation Dashboard</div>
          <div className="sa-subtitle">Super Admin — Manage multilingual content</div>
        </div>
        <div className="sa-header-right">
          <button className="sa-btn sa-btn-warn" onClick={runMigration} disabled={migrating}>
            {migrating ? "Migrating..." : "⚙ Run Migration"}
          </button>
          <button
            className="sa-btn sa-btn-primary"
            onClick={() => translateAll("all")}
            disabled={bulkLoading || totalUntranslated === 0}
          >
            {bulkLoading ? "Translating..." : `⚡ Translate All (${totalUntranslated})`}
          </button>
          <button className="sa-btn sa-btn-ghost" onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>Logout</button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="sa-stats">
        <div className="sa-stat-card">
          <div className="sa-stat-num">{data.menu.length}</div>
          <div className="sa-stat-label">Menu Items</div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-num">{data.categories.length}</div>
          <div className="sa-stat-label">Categories</div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-num">{data.groceries.length}</div>
          <div className="sa-stat-label">Stock Items</div>
        </div>
        <div className="sa-stat-card sa-stat-total">
          <div className="sa-stat-num">{totalUntranslated}</div>
          <div className="sa-stat-label">Total Pending</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sa-tabs">
        {[
          { key: "all",      label: `All (${allItems.length})` },
          { key: "menu",     label: `Menu (${data.menu.length})` },
          { key: "category", label: `Categories (${data.categories.length})` },
          { key: "grocery",  label: `Stock (${data.groceries.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main table ── */}
      <div className="sa-content">
        {loading ? (
          <div className="sa-loading">Loading untranslated items...</div>
        ) : displayItems.length === 0 ? (
          <div className="sa-empty">
            <div className="sa-empty-icon">✅</div>
            <div className="sa-empty-title">All translated!</div>
            <div className="sa-empty-sub">No pending translations in this section.</div>
          </div>
        ) : (
          <div className="sa-table-wrap">
            <div className="sa-table-head">
              <span>Type</span>
              <span>English</span>
              <span>Tamil</span>
              <span>Hindi</span>
              <span>Action</span>
            </div>

            {displayItems.map(item => (
              <div key={item._id} className="sa-table-row">

                {/* Type badge */}
                <span>
                  <span className={`sa-type-badge sa-type-${item.type}`}>
                    {TYPE_LABEL[item.type]}
                  </span>
                </span>

                {/* EN / TA / HI cells */}
                {["en", "ta", "hi"].map(lang => (
                  <span key={lang}>
                    {editCell?.id === item._id && editCell?.lang === lang ? (
                      <div className="sa-edit-cell">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && saveManualEdit()}
                          className="sa-edit-input"
                        />
                        <button className="sa-edit-save" onClick={saveManualEdit}>✓</button>
                        <button className="sa-edit-cancel" onClick={() => setEditCell(null)}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={`sa-name-cell ${!item.name?.[lang] ? "sa-missing" : ""}`}
                        onClick={() => {
                          setEditCell({ id: item._id, type: item.type, lang });
                          setEditValue(item.name?.[lang] || "");
                        }}
                        title="Click to edit manually"
                      >
                        {item.name?.[lang] || <span className="sa-missing-text">— missing —</span>}
                      </div>
                    )}
                  </span>
                ))}

                {/* Translate button */}
                <span>
                  <button
                    className="sa-btn sa-btn-translate"
                    onClick={() => translateOne(item._id, item.type)}
                    disabled={translating[item._id]}
                  >
                    {translating[item._id] ? "..." : "🌐 Translate"}
                  </button>
                </span>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="sa-toast">
          {toast}
          <button onClick={() => setToast("")}>✕</button>
        </div>
      )}

    </div>
  );
}
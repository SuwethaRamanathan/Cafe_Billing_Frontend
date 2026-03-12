// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./superadmin.css";

// // ── Label map for display ──
// const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };
// const LANG_LABEL = { en: "English", ta: "Tamil", hi: "Hindi" };

// export default function SuperAdmin() {
//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

//   const [data, setData]           = useState({ menu: [], categories: [], groceries: [] });
//   const [loading, setLoading]     = useState(true);
//   const [translating, setTranslating] = useState({}); // { id: true/false }
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [migrating, setMigrating]   = useState(false);
//   const [toast, setToast]           = useState("");
//   const [editCell, setEditCell]     = useState(null); // { id, type, lang }
//   const [editValue, setEditValue]   = useState("");
//   const [activeTab, setActiveTab]   = useState("all"); // "all" | "menu" | "category" | "grocery"

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 3000);
//   };

//   // ── Fetch all untranslated items ──
//   const fetchUntranslated = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       setData(json);
//     } catch {
//       showToast("Failed to load items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUntranslated(); }, []);

//   // ── Translate one item ──
//   const translateOne = async (id, type) => {
//     setTranslating(prev => ({ ...prev, [id]: true }));
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-one`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id, type })
//       });
//       const json = await res.json();
//       if (json.success) {
//         showToast("Translated successfully!");
//         fetchUntranslated();
//       } else {
//         showToast("Translation failed");
//       }
//     } catch {
//       showToast("Translation failed");
//     } finally {
//       setTranslating(prev => ({ ...prev, [id]: false }));
//     }
//   };

//   // ── Translate all ──
//   const translateAll = async (type = "all") => {
//     setBulkLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-all`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ type })
//       });
//       const json = await res.json();
//       if (json.success) {
//         const r = json.results;
//         showToast(`Done! Menu: ${r.menu}, Categories: ${r.categories}, Stock: ${r.groceries}${r.errors ? `, Errors: ${r.errors}` : ""}`);
//         fetchUntranslated();
//       }
//     } catch {
//       showToast("Bulk translation failed");
//     } finally {
//       setBulkLoading(false);
//     }
//   };

//   // ── Run migration (one-time) ──
//   const runMigration = async () => {
//     if (!window.confirm("This will convert all old string names to multilingual format. Run once only. Continue?")) return;
//     setMigrating(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       showToast(json.msg || "Migration done");
//       fetchUntranslated();
//     } catch {
//       showToast("Migration failed");
//     } finally {
//       setMigrating(false);
//     }
//   };

//   // ── Save manual edit ──
//   const saveManualEdit = async () => {
//     if (!editCell) return;
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
//       });
//       const json = await res.json();
//       if (json.success) {
//         showToast("Saved!");
//         setEditCell(null);
//         fetchUntranslated();
//       }
//     } catch {
//       showToast("Save failed");
//     }
//   };

//   // ── Build flat list based on active tab ──
//   const allItems = [
//     ...data.menu.map(i => ({ ...i, type: "menu" })),
//     ...data.categories.map(i => ({ ...i, type: "category" })),
//     ...data.groceries.map(i => ({ ...i, type: "grocery" })),
//   ];

//   const displayItems = activeTab === "all" ? allItems
//     : activeTab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" }))
//     : activeTab === "category" ? data.categories.map(i => ({ ...i, type: "category" }))
//     : data.groceries.map(i => ({ ...i, type: "grocery" }));

//   const totalUntranslated = allItems.length;

//   return (
//     <div className="sa-wrap">

//       {/* ── Header ── */}
//       <div className="sa-header">
//         <div className="sa-header-left">
//           <div className="sa-title">🌐 Translation Dashboard</div>
//           <div className="sa-subtitle">Super Admin — Manage multilingual content</div>
//         </div>
//         <div className="sa-header-right">
//           <button className="sa-btn sa-btn-warn" onClick={runMigration} disabled={migrating}>
//             {migrating ? "Migrating..." : "⚙ Run Migration"}
//           </button>
//           <button
//             className="sa-btn sa-btn-primary"
//             onClick={() => translateAll("all")}
//             disabled={bulkLoading || totalUntranslated === 0}
//           >
//             {bulkLoading ? "Translating..." : `⚡ Translate All (${totalUntranslated})`}
//           </button>
//           <button className="sa-btn sa-btn-ghost" onClick={() => {
//             localStorage.clear();
//             navigate("/");
//           }}>Logout</button>
//         </div>
//       </div>

//       {/* ── Stats row ── */}
//       <div className="sa-stats">
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.menu.length}</div>
//           <div className="sa-stat-label">Menu Items</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.categories.length}</div>
//           <div className="sa-stat-label">Categories</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.groceries.length}</div>
//           <div className="sa-stat-label">Stock Items</div>
//         </div>
//         <div className="sa-stat-card sa-stat-total">
//           <div className="sa-stat-num">{totalUntranslated}</div>
//           <div className="sa-stat-label">Total Pending</div>
//         </div>
//       </div>

//       {/* ── Tabs ── */}
//       <div className="sa-tabs">
//         {[
//           { key: "all",      label: `All (${allItems.length})` },
//           { key: "menu",     label: `Menu (${data.menu.length})` },
//           { key: "category", label: `Categories (${data.categories.length})` },
//           { key: "grocery",  label: `Stock (${data.groceries.length})` },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
//             onClick={() => setActiveTab(tab.key)}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Main table ── */}
//       <div className="sa-content">
//         {loading ? (
//           <div className="sa-loading">Loading untranslated items...</div>
//         ) : displayItems.length === 0 ? (
//           <div className="sa-empty">
//             <div className="sa-empty-icon">✅</div>
//             <div className="sa-empty-title">All translated!</div>
//             <div className="sa-empty-sub">No pending translations in this section.</div>
//           </div>
//         ) : (
//           <div className="sa-table-wrap">
//             <div className="sa-table-head">
//               <span>Type</span>
//               <span>English</span>
//               <span>Tamil</span>
//               <span>Hindi</span>
//               <span>Action</span>
//             </div>

//             {displayItems.map(item => (
//               <div key={item._id} className="sa-table-row">

//                 {/* Type badge */}
//                 <span>
//                   <span className={`sa-type-badge sa-type-${item.type}`}>
//                     {TYPE_LABEL[item.type]}
//                   </span>
//                 </span>

//                 {/* EN / TA / HI cells */}
//                 {["en", "ta", "hi"].map(lang => (
//                   <span key={lang}>
//                     {editCell?.id === item._id && editCell?.lang === lang ? (
//                       <div className="sa-edit-cell">
//                         <input
//                           autoFocus
//                           value={editValue}
//                           onChange={e => setEditValue(e.target.value)}
//                           onKeyDown={e => e.key === "Enter" && saveManualEdit()}
//                           className="sa-edit-input"
//                         />
//                         <button className="sa-edit-save" onClick={saveManualEdit}>✓</button>
//                         <button className="sa-edit-cancel" onClick={() => setEditCell(null)}>✕</button>
//                       </div>
//                     ) : (
//                       <div
//                         className={`sa-name-cell ${!item.name?.[lang] ? "sa-missing" : ""}`}
//                         onClick={() => {
//                           setEditCell({ id: item._id, type: item.type, lang });
//                           setEditValue(item.name?.[lang] || "");
//                         }}
//                         title="Click to edit manually"
//                       >
//                         {item.name?.[lang] || <span className="sa-missing-text">— missing —</span>}
//                       </div>
//                     )}
//                   </span>
//                 ))}

//                 {/* Translate button */}
//                 <span>
//                   <button
//                     className="sa-btn sa-btn-translate"
//                     onClick={() => translateOne(item._id, item.type)}
//                     disabled={translating[item._id]}
//                   >
//                     {translating[item._id] ? "..." : "🌐 Translate"}
//                   </button>
//                 </span>

//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Toast ── */}
//       {toast && (
//         <div className="sa-toast">
//           {toast}
//           <button onClick={() => setToast("")}>✕</button>
//         </div>
//       )}

//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./superadmin.css";

// const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };

// export default function SuperAdmin() {
//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

//   const [data, setData]             = useState({ menu: [], categories: [], groceries: [] });
//   const [loading, setLoading]       = useState(true);
//   const [translating, setTranslating] = useState({});
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [migrating, setMigrating]   = useState(false);
//   const [toast, setToast]           = useState({ msg: "", type: "success" });
//   const [editCell, setEditCell]     = useState(null);
//   const [editValue, setEditValue]   = useState("");
//   const [activeTab, setActiveTab]   = useState("all");

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
//   };

//   const getName = (nameField, lang = "en") => {
//     if (!nameField) return "";
//     if (typeof nameField === "string") return nameField;
//     return nameField[lang] || "";
//   };

//   const fetchUntranslated = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       setData(json);
//     } catch {
//       showToast("Failed to load items", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUntranslated(); }, []);

//   const translateOne = async (id, type) => {
//     setTranslating(prev => ({ ...prev, [id]: true }));
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-one`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id, type })
//       });
//       const json = await res.json();
//       if (json.success) { showToast("Translated successfully!"); fetchUntranslated(); }
//       else showToast(json.msg || "Translation failed", "error");
//     } catch {
//       showToast("Translation failed", "error");
//     } finally {
//       setTranslating(prev => ({ ...prev, [id]: false }));
//     }
//   };

//   const translateAll = async (type = "all") => {
//     setBulkLoading(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/translate-all`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ type })
//       });
//       const json = await res.json();
//       if (json.success) {
//         const r = json.results;
//         showToast(`Done! Menu: ${r.menu}, Categories: ${r.categories}, Stock: ${r.groceries}${r.errors ? `, Errors: ${r.errors}` : ""}`);
//         fetchUntranslated();
//       }
//     } catch {
//       showToast("Bulk translation failed", "error");
//     } finally {
//       setBulkLoading(false);
//     }
//   };

//   const runMigration = async () => {
//     if (!window.confirm("This converts all old item names to multilingual format. Run once only. Continue?")) return;
//     setMigrating(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       showToast(json.msg || "Migration done!");
//       fetchUntranslated();
//     } catch {
//       showToast("Migration failed", "error");
//     } finally {
//       setMigrating(false);
//     }
//   };

//   const saveManualEdit = async () => {
//     if (!editCell) return;
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
//       });
//       const json = await res.json();
//       if (json.success) { showToast("Saved!"); setEditCell(null); fetchUntranslated(); }
//     } catch {
//       showToast("Save failed", "error");
//     }
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

//   const total = allItems.length;
//   const hasOldFormat = allItems.some(i => typeof i.name === "string");

//   return (
//     <div className="sa-wrap">

//       <div className="sa-header">
//         <div className="sa-header-left">
//           <div className="sa-logo">🌐</div>
//           <div>
//             <div className="sa-title">Translation Dashboard</div>
//             <div className="sa-subtitle">Super Admin · Multilingual Content</div>
//           </div>
//         </div>
//         <div className="sa-header-right">
//           <button className="sa-btn sa-btn-migrate" onClick={runMigration} disabled={migrating}>
//             {migrating ? "⏳ Migrating..." : "⚙ Run Migration"}
//           </button>
//           <button className="sa-btn sa-btn-primary" onClick={() => translateAll("all")}
//             disabled={bulkLoading || total === 0 || hasOldFormat}>
//             {bulkLoading ? "⏳ Translating..." : `⚡ Translate All (${total})`}
//           </button>
//           <button className="sa-btn sa-btn-logout"
//             onClick={() => { localStorage.clear(); navigate("/"); }}>
//             → Logout
//           </button>
//         </div>
//       </div>

//       {hasOldFormat && (
//         <div className="sa-migrate-notice">
//           ⚠ Your items are in old format (plain text). Click <strong>⚙ Run Migration</strong> first — this converts them to multilingual format. Then you can translate.
//         </div>
//       )}

//       <div className="sa-stats">
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.menu.length}</div>
//           <div className="sa-stat-label">Menu Items</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{(data.categories || []).length}</div>
//           <div className="sa-stat-label">Categories</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.groceries.length}</div>
//           <div className="sa-stat-label">Stock Items</div>
//         </div>
//         <div className="sa-stat-card sa-stat-highlight">
//           <div className="sa-stat-num">{total}</div>
//           <div className="sa-stat-label">Total Pending</div>
//         </div>
//       </div>

//       <div className="sa-tabs">
//         {[
//           { key: "all",      label: `All (${allItems.length})` },
//           { key: "menu",     label: `Menu (${data.menu.length})` },
//           { key: "category", label: `Categories (${(data.categories || []).length})` },
//           { key: "grocery",  label: `Stock (${data.groceries.length})` },
//         ].map(tab => (
//           <button key={tab.key}
//             className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
//             onClick={() => setActiveTab(tab.key)}>
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="sa-content">
//         {loading ? (
//           <div className="sa-loading">Loading items...</div>
//         ) : displayItems.length === 0 ? (
//           <div className="sa-empty">
//             <div className="sa-empty-icon">✅</div>
//             <div className="sa-empty-title">All translated!</div>
//             <div className="sa-empty-sub">No pending translations in this section.</div>
//           </div>
//         ) : (
//           <div className="sa-table-wrap">
//             <div className="sa-table-head">
//               <span>Type</span>
//               <span>English</span>
//               <span>Tamil</span>
//               <span>Hindi</span>
//               <span>Action</span>
//             </div>

//             {displayItems.map(item => {
//               const isOldFormat = typeof item.name === "string";
//               return (
//                 <div key={item._id} className="sa-table-row">
//                   <span>
//                     <span className={`sa-badge sa-badge-${item.type}`}>
//                       {TYPE_LABEL[item.type]}
//                     </span>
//                   </span>

//                   {["en", "ta", "hi"].map(lang => {
//                     const value = getName(item.name, lang);
//                     const isEmpty = !isOldFormat && !value;
//                     return (
//                       <span key={lang}>
//                         {editCell?.id === item._id && editCell?.lang === lang ? (
//                           <div className="sa-edit-row">
//                             <input autoFocus value={editValue} className="sa-edit-input"
//                               onChange={e => setEditValue(e.target.value)}
//                               onKeyDown={e => e.key === "Enter" && saveManualEdit()} />
//                             <button className="sa-icon-btn sa-save-btn" onClick={saveManualEdit}>✓</button>
//                             <button className="sa-icon-btn sa-cancel-btn" onClick={() => setEditCell(null)}>✕</button>
//                           </div>
//                         ) : (
//                           <div
//                             className={`sa-cell ${isEmpty ? "sa-cell-missing" : ""} ${isOldFormat ? "sa-cell-old" : ""}`}
//                             onClick={() => {
//                               if (isOldFormat) return;
//                               setEditCell({ id: item._id, type: item.type, lang });
//                               setEditValue(value);
//                             }}
//                             title={isOldFormat ? "Run migration first" : "Click to edit manually"}
//                           >
//                             {isOldFormat && lang === "en"
//                               ? <span>{item.name}</span>
//                               : isOldFormat
//                               ? <span className="sa-old-hint">migrate first</span>
//                               : isEmpty
//                               ? <span className="sa-missing-text">— missing —</span>
//                               : value
//                             }
//                           </div>
//                         )}
//                       </span>
//                     );
//                   })}

//                   <span>
//                     <button className="sa-btn sa-btn-translate"
//                       onClick={() => translateOne(item._id, item.type)}
//                       disabled={translating[item._id] || isOldFormat}
//                       title={isOldFormat ? "Run migration first" : "Auto translate"}>
//                       {translating[item._id] ? "..." : "🌐 Translate"}
//                     </button>
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {toast.msg && (
//         <div className={`sa-toast ${toast.type === "error" ? "sa-toast-error" : ""}`}>
//           <span>{toast.msg}</span>
//           <button onClick={() => setToast({ msg: "" })}>✕</button>
//         </div>
//       )}
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./superadmin.css";

// const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };

// // ── Translate via MyMemory — called from BROWSER, not backend ──
// async function translateText(text, targetLang, sourceLang = "en") {
//   if (!text?.trim()) return text;
//   if (sourceLang === targetLang) return text;
//   try {
//     const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
//     const res  = await fetch(url);
//     const data = await res.json();
//     if (data.responseStatus === 200 && data.responseData?.translatedText) {
//       const result = data.responseData.translatedText;
//       // MyMemory sometimes returns the original on failure
//       if (result.toLowerCase() === text.toLowerCase()) return "";
//       return result;
//     }
//     return "";
//   } catch {
//     return "";
//   }
// }

// async function translateToAll(text, sourceLang = "en") {
//   const langs   = ["en", "ta", "hi"];
//   const result  = { en: "", ta: "", hi: "" };
//   result[sourceLang] = text;

//   await Promise.all(
//     langs
//       .filter(l => l !== sourceLang)
//       .map(async lang => {
//         result[lang] = await translateText(text, lang, sourceLang);
//       })
//   );
//   return result;
// }

// function detectSourceLang(nameObj) {
//   if (!nameObj) return "en";
//   if (typeof nameObj === "string") return "en";
//   if (nameObj.en?.trim()) return "en";
//   if (nameObj.ta?.trim()) return "ta";
//   if (nameObj.hi?.trim()) return "hi";
//   return "en";
// }

// function isMissing(nameObj) {
//   if (!nameObj) return true;
//   if (typeof nameObj === "string") return true;
//   // missing if ta or hi is empty OR same as en (bad translation)
//   const en = nameObj.en?.trim() || "";
//   const ta = nameObj.ta?.trim() || "";
//   const hi = nameObj.hi?.trim() || "";
//   return !ta || !hi || ta === en || hi === en;
// }

// export default function SuperAdmin() {
//   const navigate = useNavigate();
//   const token    = localStorage.getItem("token");

//   const [data, setData]               = useState({ menu: [], categories: [], groceries: [] });
//   const [loading, setLoading]         = useState(true);
//   const [translating, setTranslating] = useState({});
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
//   const [migrating, setMigrating]     = useState(false);
//   const [toast, setToast]             = useState({ msg: "", type: "success" });
//   const [editCell, setEditCell]       = useState(null);
//   const [editValue, setEditValue]     = useState("");
//   const [activeTab, setActiveTab]     = useState("all");

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast({ msg: "", type: "success" }), 5000);
//   };

//   const getName = (nameField, lang = "en") => {
//     if (!nameField) return "";
//     if (typeof nameField === "string") return nameField;
//     return nameField[lang] || "";
//   };

//   const fetchUntranslated = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       setData(json);
//     } catch {
//       showToast("Failed to load items", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUntranslated(); }, []);

//   // ── Save translation to backend (just storing, no translate call) ──
//   const saveTranslation = async (id, type, updatedName) => {
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/save-translation`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ id, type, name: updatedName })
//     });
//     return res.json();
//   };

//   // ── Translate one item (browser calls MyMemory, then saves to backend) ──
//   const translateOne = async (id, type, nameField) => {
//     setTranslating(prev => ({ ...prev, [id]: true }));
//     try {
//       const sourceLang = detectSourceLang(nameField);
//       const sourceText = typeof nameField === "string"
//         ? nameField
//         : nameField[sourceLang];

//       if (!sourceText?.trim()) {
//         showToast("No text to translate", "error");
//         return;
//       }

//       showToast(`Translating "${sourceText}"...`);
//       const translated = await translateToAll(sourceText, sourceLang);

//       if (!translated.ta && !translated.hi) {
//         showToast("Translation API returned nothing. Check internet connection.", "error");
//         return;
//       }

//       // Merge — keep existing non-English values if they're real translations
//       const existing = typeof nameField === "object" ? nameField : { en: nameField, ta: "", hi: "" };
//       const updatedName = {
//         en: translated.en || existing.en || sourceText,
//         ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || existing.ta || ""),
//         hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || existing.hi || ""),
//       };

//       const result = await saveTranslation(id, type, updatedName);
//       if (result.success) {
//         showToast(`✓ Translated to Tamil: "${translated.ta}", Hindi: "${translated.hi}"`);
//         fetchUntranslated();
//       } else {
//         showToast("Save failed: " + (result.msg || "unknown error"), "error");
//       }
//     } catch (err) {
//       showToast("Translation failed: " + err.message, "error");
//     } finally {
//       setTranslating(prev => ({ ...prev, [id]: false }));
//     }
//   };

//   // ── Translate ALL — one by one with progress ──
//   const translateAll = async () => {
//     const allItems = [
//       ...data.menu.map(i => ({ ...i, type: "menu" })),
//       ...(data.categories || []).map(i => ({ ...i, type: "category" })),
//       ...data.groceries.map(i => ({ ...i, type: "grocery" })),
//     ];

//     if (allItems.length === 0) { showToast("Nothing to translate!"); return; }

//     setBulkLoading(true);
//     setBulkProgress({ done: 0, total: allItems.length });

//     let success = 0, errors = 0;

//     for (const item of allItems) {
//       try {
//         const sourceLang = detectSourceLang(item.name);
//         const sourceText = typeof item.name === "string"
//           ? item.name
//           : item.name[sourceLang];

//         if (!sourceText?.trim()) { errors++; continue; }

//         const translated = await translateToAll(sourceText, sourceLang);

//         const existing = typeof item.name === "object" ? item.name : { en: item.name, ta: "", hi: "" };
//         const updatedName = {
//           en: translated.en || existing.en || sourceText,
//           ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || ""),
//           hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || ""),
//         };

//         const result = await saveTranslation(item._id, item.type, updatedName);
//         if (result.success) success++; else errors++;

//         setBulkProgress(prev => ({ ...prev, done: prev.done + 1 }));

//         // Small delay to avoid rate limiting
//         await new Promise(r => setTimeout(r, 400));
//       } catch {
//         errors++;
//         setBulkProgress(prev => ({ ...prev, done: prev.done + 1 }));
//       }
//     }

//     setBulkLoading(false);
//     showToast(`Done! ✓ ${success} translated${errors ? `, ${errors} failed` : ""}`);
//     fetchUntranslated();
//   };

//   // ── Migration ──
//   const runMigration = async () => {
//     if (!window.confirm("Convert all old string names to multilingual format. Run once only. Continue?")) return;
//     setMigrating(true);
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();
//       showToast(json.msg || "Migration done!");
//       fetchUntranslated();
//     } catch {
//       showToast("Migration failed", "error");
//     } finally {
//       setMigrating(false);
//     }
//   };

//   // ── Manual edit save ──
//   const saveManualEdit = async () => {
//     if (!editCell) return;
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
//       });
//       const json = await res.json();
//       if (json.success) { showToast("Saved!"); setEditCell(null); fetchUntranslated(); }
//     } catch {
//       showToast("Save failed", "error");
//     }
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

//   const total = allItems.length;
//   const hasOldFormat = allItems.some(i => typeof i.name === "string");

//   return (
//     <div className="sa-wrap">

//       <div className="sa-header">
//         <div className="sa-header-left">
//           <div className="sa-logo">🌐</div>
//           <div>
//             <div className="sa-title">Translation Dashboard</div>
//             <div className="sa-subtitle">Super Admin · Multilingual Content</div>
//           </div>
//         </div>
//         <div className="sa-header-right">
//           <button className="sa-btn sa-btn-migrate" onClick={runMigration} disabled={migrating}>
//             {migrating ? "⏳ Migrating..." : "⚙ Run Migration"}
//           </button>
//           <button className="sa-btn sa-btn-primary"
//             onClick={translateAll}
//             disabled={bulkLoading || total === 0 || hasOldFormat}>
//             {bulkLoading
//               ? `⏳ ${bulkProgress.done}/${bulkProgress.total} translating...`
//               : `⚡ Translate All (${total})`}
//           </button>
//           <button className="sa-btn sa-btn-logout"
//             onClick={() => { localStorage.clear(); navigate("/"); }}>
//             → Logout
//           </button>
//         </div>
//       </div>

//       {hasOldFormat && (
//         <div className="sa-migrate-notice">
//           ⚠ Some items are in old format. Click <strong>⚙ Run Migration</strong> first, then translate.
//         </div>
//       )}

//       {bulkLoading && (
//         <div className="sa-progress-bar-wrap">
//           <div className="sa-progress-bar"
//             style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
//           <div className="sa-progress-text">
//             {bulkProgress.done} / {bulkProgress.total} items translated
//           </div>
//         </div>
//       )}

//       <div className="sa-stats">
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.menu.length}</div>
//           <div className="sa-stat-label">Menu Items</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{(data.categories || []).length}</div>
//           <div className="sa-stat-label">Categories</div>
//         </div>
//         <div className="sa-stat-card">
//           <div className="sa-stat-num">{data.groceries.length}</div>
//           <div className="sa-stat-label">Stock Items</div>
//         </div>
//         <div className="sa-stat-card sa-stat-highlight">
//           <div className="sa-stat-num">{total}</div>
//           <div className="sa-stat-label">Total Pending</div>
//         </div>
//       </div>

//       <div className="sa-tabs">
//         {[
//           { key: "all",      label: `All (${allItems.length})` },
//           { key: "menu",     label: `Menu (${data.menu.length})` },
//           { key: "category", label: `Categories (${(data.categories || []).length})` },
//           { key: "grocery",  label: `Stock (${data.groceries.length})` },
//         ].map(tab => (
//           <button key={tab.key}
//             className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
//             onClick={() => setActiveTab(tab.key)}>
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="sa-content">
//         {loading ? (
//           <div className="sa-loading">Loading items...</div>
//         ) : displayItems.length === 0 ? (
//           <div className="sa-empty">
//             {/* <div className="sa-empty-icon">✅</div> */}
//             <div className="sa-empty-title">All translated!</div>
//             <div className="sa-empty-sub">No pending translations here.</div>
//           </div>
//         ) : (
//           <div className="sa-table-wrap">
//             <div className="sa-table-head">
//               <span>Type</span>
//               <span>English</span>
//               <span>Tamil</span>
//               <span>Hindi</span>
//               <span>Action</span>
//             </div>

//             {displayItems.map(item => {
//               const isOldFormat = typeof item.name === "string";
//               return (
//                 <div key={item._id} className="sa-table-row">
//                   <span>
//                     <span className={`sa-badge sa-badge-${item.type}`}>
//                       {TYPE_LABEL[item.type]}
//                     </span>
//                   </span>

//                   {["en", "ta", "hi"].map(lang => {
//                     const value    = getName(item.name, lang);
//                     const enValue  = getName(item.name, "en");
//                     // highlight if ta/hi same as en (bad translation) or empty
//                     const isBad    = lang !== "en" && (!value || value === enValue);
//                     return (
//                       <span key={lang}>
//                         {editCell?.id === item._id && editCell?.lang === lang ? (
//                           <div className="sa-edit-row">
//                             <input autoFocus value={editValue} className="sa-edit-input"
//                               onChange={e => setEditValue(e.target.value)}
//                               onKeyDown={e => e.key === "Enter" && saveManualEdit()} />
//                             <button className="sa-icon-btn sa-save-btn" onClick={saveManualEdit}>✓</button>
//                             <button className="sa-icon-btn sa-cancel-btn" onClick={() => setEditCell(null)}>✕</button>
//                           </div>
//                         ) : (
//                           <div
//                             className={`sa-cell ${isBad ? "sa-cell-missing" : ""} ${isOldFormat ? "sa-cell-old" : ""}`}
//                             onClick={() => {
//                               if (isOldFormat) return;
//                               setEditCell({ id: item._id, type: item.type, lang });
//                               setEditValue(value);
//                             }}
//                             title={isOldFormat ? "Run migration first" : "Click to edit manually"}>
//                             {isOldFormat && lang === "en"
//                               ? item.name
//                               : isOldFormat
//                               ? <span className="sa-old-hint">migrate first</span>
//                               : isBad
//                               ? <span className="sa-missing-text">— missing —</span>
//                               : value
//                             }
//                           </div>
//                         )}
//                       </span>
//                     );
//                   })}

//                   <span>
//                     <button className="sa-btn sa-btn-translate"
//                       onClick={() => translateOne(item._id, item.type, item.name)}
//                       disabled={translating[item._id] || isOldFormat}
//                       title={isOldFormat ? "Run migration first" : "Auto translate"}>
//                       {translating[item._id] ? "⏳..." : "🌐 Translate"}
//                     </button>
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {toast.msg && (
//         <div className={`sa-toast ${toast.type === "error" ? "sa-toast-error" : ""}`}>
//           <span>{toast.msg}</span>
//           <button onClick={() => setToast({ msg: "" })}>✕</button>
//         </div>
//       )}
//     </div>
//   );
// }



 // last used after
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
//   await Promise.all(
//     ["en", "ta", "hi"].filter(l => l !== sourceLang).map(async lang => {
//       result[lang] = await translateText(text, lang, sourceLang);
//     })
//   );
//   return result;
// }

// function detectSourceLang(nameObj) {
//   if (!nameObj || typeof nameObj === "string") return "en";
//   if (nameObj.en?.trim()) return "en";
//   if (nameObj.ta?.trim()) return "ta";
//   if (nameObj.hi?.trim()) return "hi";
//   return "en";
// }

// function isMissing(nameObj) {
//   if (!nameObj || typeof nameObj === "string") return true;
//   const en = nameObj.en?.trim() || "";
//   const ta = nameObj.ta?.trim() || "";
//   const hi = nameObj.hi?.trim() || "";
//   return !ta || !hi || ta === en || hi === en;
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
//   const [selected, setSelected]         = useState(new Set()); // selected item ids

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
//     if (allSelected) setSelected(new Set());
//     else setSelected(new Set(displayItems.map(i => String(i._id))));
//   };

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
//             onClick={() => { setActiveTab(tab.key); setSelected(new Set()); }}>
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
//                 <label className="sa-select-all-label">
//                   <input type="checkbox" checked={allSelected} onChange={toggleAll} />
//                   <span>{allSelected ? "Deselect all" : someSelected ? `${selectedCount} selected` : "Select all"}</span>
//                 </label>
//               </div>
//               <div className="sa-toolbar-right">
//                 {someSelected && (
//                   <span className="sa-selected-info">{selectedCount} item{selectedCount > 1 ? "s" : ""} selected</span>
//                 )}
//                 <button
//                   className="sa-btn sa-btn-translate-bulk"
//                   onClick={translateSelected}
//                   disabled={bulkLoading}>
//                   {bulkLoading
//                     ? `⏳ ${bulkProgress.done}/${bulkProgress.total}`
//                     : someSelected
//                     ? `🌐 Translate Selected (${selectedCount})`
//                     : `🌐 Translate All (${displayItems.length})`}
//                 </button>
//               </div>
//             </div>

//             {/* ── Table head ── */}
//             <div className={`sa-table-head ${showTypeCol ? "with-type" : ""}`}>
//               <span></span> {/* checkbox col */}
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
//                   className={`sa-table-row ${showTypeCol ? "with-type" : ""} ${isChecked ? "sa-row-selected" : ""} ${isOldFormat ? "sa-row-old" : ""}`}>

//                   {/* Checkbox */}
//                   <span className="sa-check-cell">
//                     <input type="checkbox" checked={isChecked}
//                       onChange={() => toggleItem(item._id)}
//                       disabled={isOldFormat} />
//                   </span>

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



// after after last used
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
//                   className={`sa-table-row ${showTypeCol ? "with-type" : ""} ${isChecked ? "sa-row-selected" : ""} ${isOldFormat ? "sa-row-old" : ""}`}>

//                   {/* Checkbox */}
//                   <span className="sa-check-cell">
//                     <input type="checkbox" checked={isChecked}
//                       onChange={() => toggleItem(item._id)}
//                       disabled={isOldFormat} />
//                   </span>

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


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./superadmin.css";

const TYPE_LABEL = { menu: "Menu Item", category: "Category", grocery: "Stock Item" };
const LANG_LABEL = { en: "English", ta: "Tamil", hi: "Hindi" };

// ── Translate from browser (backend can't reach external APIs) ──
async function translateText(text, targetLang, sourceLang = "en") {
  if (!text?.trim() || sourceLang === targetLang) return "";
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const result = data.responseData.translatedText;
      if (result.toLowerCase() === text.toLowerCase()) return "";
      return result;
    }
    return "";
  } catch { return ""; }
}

async function translateToAll(text, sourceLang = "en") {
  const result = { en: "", ta: "", hi: "" };
  result[sourceLang] = text;

  // MyMemory is only reliable with English as source.
  // So if source is Tamil or Hindi, first translate to English,
  // then use that English to translate to the remaining language.
  // This "bridge through English" gives much better results.
  if (sourceLang !== "en") {
    const englishText = await translateText(text, "en", sourceLang);
    result["en"] = englishText || "";
    // Now translate English → remaining language
    const remaining = ["ta", "hi"].filter(l => l !== sourceLang);
    for (const lang of remaining) {
      if (englishText) {
        result[lang] = await translateText(englishText, lang, "en");
      }
    }
  } else {
    // Source is English — translate directly to ta and hi
    await Promise.all(
      ["ta", "hi"].map(async lang => {
        result[lang] = await translateText(text, lang, "en");
      })
    );
  }
  return result;
}

function detectSourceLang(nameObj) {
  if (!nameObj || typeof nameObj === "string") return "en";
  if (nameObj.en?.trim()) return "en";
  if (nameObj.ta?.trim()) return "ta";
  if (nameObj.hi?.trim()) return "hi";
  return "en";
}

function isMissingLang(nameObj, lang) {
  // Returns true if this specific language field needs translation
  if (!nameObj || typeof nameObj === "string") return lang !== "en";
  const val = nameObj[lang]?.trim() || "";
  const en  = nameObj.en?.trim()   || "";
  const ta  = nameObj.ta?.trim()   || "";
  const hi  = nameObj.hi?.trim()   || "";
  if (!val) return true;
  // If only one language is filled and the others are same value → bad translation
  if (lang === "ta" && ta === en && en) return true;
  if (lang === "hi" && hi === en && en) return true;
  if (lang === "en" && en === ta && ta) return true;
  if (lang === "en" && en === hi && hi) return true;
  return false;
}

export default function SuperAdmin() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [data, setData]                 = useState({ menu: [], categories: [], groceries: [] });
  const [loading, setLoading]           = useState(true);
  const [translating, setTranslating]   = useState({});
  const [bulkLoading, setBulkLoading]   = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [migrating, setMigrating]       = useState(false);
  const [showMigrate, setShowMigrate]   = useState(false);
  const [toast, setToast]               = useState({ msg: "", type: "success" });
  const [editCell, setEditCell]         = useState(null);
  const [editValue, setEditValue]       = useState("");
  const [activeTab, setActiveTab]       = useState("all");
  const [selected, setSelected]         = useState(new Set());
  const [selectMode, setSelectMode]     = useState(false); // checkboxes visible only when active

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "" }), 5000);
  };

  const getName = (nameField, lang = "en") => {
    if (!nameField) return "";
    if (typeof nameField === "string") return nameField;
    return nameField[lang] || "";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/untranslated`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
      setSelected(new Set());
    } catch { showToast("Failed to load items", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveTranslation = async (id, type, updatedName) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/save-translation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, type, name: updatedName })
    });
    return res.json();
  };

  // ── Translate a single item ──
  const translateOne = async (id, type, nameField) => {
    setTranslating(prev => ({ ...prev, [id]: true }));
    try {
      const sourceLang = detectSourceLang(nameField);
      const sourceText = typeof nameField === "string" ? nameField : nameField[sourceLang];
      if (!sourceText?.trim()) { showToast("No text to translate", "error"); return; }

      const translated = await translateToAll(sourceText, sourceLang);
      if (!translated.ta && !translated.hi) {
        showToast("Translation failed — check your internet connection", "error"); return;
      }

      const existing = typeof nameField === "object" ? nameField : { en: nameField, ta: "", hi: "" };
      const updatedName = {
        en: translated.en || existing.en || sourceText,
        ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || ""),
        hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || ""),
      };

      const result = await saveTranslation(id, type, updatedName);
      if (result.success) {
        showToast(`✓ "${sourceText}" → TA: "${translated.ta}" · HI: "${translated.hi}"`);
        fetchData();
      } else showToast("Save failed", "error");
    } catch (err) { showToast("Error: " + err.message, "error"); }
    finally { setTranslating(prev => ({ ...prev, [id]: false })); }
  };

  // ── Translate selected items ──
  const translateSelected = async () => {
    const allItems = [
      ...data.menu.map(i => ({ ...i, type: "menu" })),
      ...(data.categories || []).map(i => ({ ...i, type: "category" })),
      ...data.groceries.map(i => ({ ...i, type: "grocery" })),
    ];

    const toTranslate = selected.size > 0
      ? allItems.filter(i => selected.has(String(i._id)))
      : displayItems; // if none selected, translate all visible

    if (toTranslate.length === 0) { showToast("Nothing to translate"); return; }

    setBulkLoading(true);
    setBulkProgress({ done: 0, total: toTranslate.length });
    let success = 0, errors = 0;

    for (const item of toTranslate) {
      if (typeof item.name === "string") { errors++; setBulkProgress(p => ({ ...p, done: p.done + 1 })); continue; }
      try {
        const sourceLang = detectSourceLang(item.name);
        const sourceText = item.name[sourceLang];
        if (!sourceText?.trim()) { errors++; continue; }

        const translated = await translateToAll(sourceText, sourceLang);
        const existing   = item.name;
        const updatedName = {
          en: translated.en || existing.en || sourceText,
          ta: (existing.ta?.trim() && existing.ta !== existing.en) ? existing.ta : (translated.ta || ""),
          hi: (existing.hi?.trim() && existing.hi !== existing.en) ? existing.hi : (translated.hi || ""),
        };

        const result = await saveTranslation(item._id, item.type, updatedName);
        if (result.success) success++; else errors++;
      } catch { errors++; }
      setBulkProgress(p => ({ ...p, done: p.done + 1 }));
      await new Promise(r => setTimeout(r, 400));
    }

    setBulkLoading(false);
    showToast(`Done! ✓ ${success} translated${errors ? `, ${errors} failed` : ""}`);
    fetchData();
  };

  // ── Migration ──
  const runMigration = async () => {
    if (!window.confirm("Convert old plain string names to {en, ta, hi} format. Run only if you see old-format items. Continue?")) return;
    setMigrating(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/migrate`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      showToast(json.msg || "Migration done!");
      fetchData();
    } catch { showToast("Migration failed", "error"); }
    finally { setMigrating(false); }
  };

  const saveManualEdit = async () => {
    if (!editCell) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/superadmin/manual-translate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editCell.id, type: editCell.type, lang: editCell.lang, value: editValue })
      });
      const json = await res.json();
      if (json.success) { showToast("Saved!"); setEditCell(null); fetchData(); }
    } catch { showToast("Save failed", "error"); }
  };

  const allItems = [
    ...data.menu.map(i => ({ ...i, type: "menu" })),
    ...(data.categories || []).map(i => ({ ...i, type: "category" })),
    ...data.groceries.map(i => ({ ...i, type: "grocery" })),
  ];

  const displayItems =
    activeTab === "all"      ? allItems :
    activeTab === "menu"     ? data.menu.map(i => ({ ...i, type: "menu" })) :
    activeTab === "category" ? (data.categories || []).map(i => ({ ...i, type: "category" })) :
    data.groceries.map(i => ({ ...i, type: "grocery" }));

  const hasOldFormat   = displayItems.some(i => typeof i.name === "string");
  const showTypeCol    = activeTab === "all";
  const allSelected    = displayItems.length > 0 && displayItems.every(i => selected.has(String(i._id)));
  const someSelected   = selected.size > 0;
  const selectedCount  = displayItems.filter(i => selected.has(String(i._id))).length;

  const toggleItem = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(String(id)) ? next.delete(String(id)) : next.add(String(id));
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) { setSelected(new Set()); }
    else setSelected(new Set(displayItems.map(i => String(i._id))));
  };

  const exitSelectMode = () => { setSelectMode(false); setSelected(new Set()); };

  const tabs = [
    { key: "all",      label: "All",        count: allItems.length },
    { key: "menu",     label: "Menu",       count: data.menu.length },
    { key: "category", label: "Categories", count: (data.categories || []).length },
    { key: "grocery",  label: "Stock",      count: data.groceries.length },
  ];

  return (
    <div className="sa-wrap">

      {/* ── Header ── */}
      <div className="sa-header">
        <div className="sa-header-left">
          <div className="sa-logo">🌐</div>
          <div>
            <div className="sa-title">Translation Dashboard</div>
            <div className="sa-subtitle">Super Admin · Multilingual Content</div>
          </div>
        </div>
        <div className="sa-header-right">
          <button className="sa-btn sa-btn-migrate-toggle"
            onClick={() => setShowMigrate(v => !v)}>
            ⚙ Migration
          </button>
          <button className="sa-btn sa-btn-logout"
            onClick={() => { localStorage.clear(); navigate("/"); }}>
            → Logout
          </button>
        </div>
      </div>

      {/* ── Migration panel (hidden by default) ── */}
      {showMigrate && (
        <div className="sa-migrate-panel">
          <div className="sa-migrate-info">
            <strong>Migration</strong> converts old plain-string names like <code>"Milk"</code> to multilingual
            format <code>{`{en:"Milk", ta:"", hi:""}`}</code>. Only needed for items added before the multilingual
            update. Safe to run multiple times.
          </div>
          <button className="sa-btn sa-btn-run-migrate" onClick={runMigration} disabled={migrating}>
            {migrating ? "⏳ Migrating..." : "⚙ Run Migration Now"}
          </button>
        </div>
      )}

      {hasOldFormat && (
        <div className="sa-migrate-notice">
          ⚠ Some items are in old format (shown in yellow). Click <strong>⚙ Migration</strong> → Run Migration first.
        </div>
      )}

      {/* ── Progress bar ── */}
      {bulkLoading && (
        <div className="sa-progress-bar-wrap">
          <div className="sa-progress-bar"
            style={{ width: `${Math.round((bulkProgress.done / bulkProgress.total) * 100)}%` }} />
          <div className="sa-progress-text">
            Translating {bulkProgress.done} / {bulkProgress.total} items...
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="sa-stats">
        {[
          { num: data.menu.length,               label: "Menu Items" },
          { num: (data.categories||[]).length,    label: "Categories" },
          { num: data.groceries.length,           label: "Stock Items" },
          { num: allItems.length, highlight: true, label: "Total Pending" },
        ].map((s, i) => (
          <div key={i} className={`sa-stat-card${s.highlight ? " sa-stat-highlight" : ""}`}>
            <div className="sa-stat-num">{s.num}</div>
            <div className="sa-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="sa-tabs">
        {tabs.map(tab => (
          <button key={tab.key}
            className={`sa-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => { setActiveTab(tab.key); setSelected(new Set()); setSelectMode(false); }}>
            {tab.label}
            <span className="sa-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="sa-content">
        {loading ? (
          <div className="sa-loading">Loading items...</div>
        ) : displayItems.length === 0 ? (
          <div className="sa-empty">
            <div className="sa-empty-icon">✅</div>
            <div className="sa-empty-title">All translated!</div>
            <div className="sa-empty-sub">No pending translations here.</div>
          </div>
        ) : (
          <div className="sa-table-wrap">

            {/* ── Table toolbar ── */}
            <div className="sa-toolbar">
              <div className="sa-toolbar-left">
                {!selectMode ? (
                  <button className="sa-btn sa-btn-select-toggle"
                    onClick={() => setSelectMode(true)}>
                    ☑ Select to Translate
                  </button>
                ) : (
                  <>
                    <label className="sa-select-all-label">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                      <span>{allSelected ? "Deselect all" : "Select all"}</span>
                    </label>
                    {someSelected && (
                      <span className="sa-selected-info">{selectedCount} selected</span>
                    )}
                    <button className="sa-btn sa-btn-cancel-select" onClick={exitSelectMode}>
                      ✕ Cancel
                    </button>
                  </>
                )}
              </div>
              <div className="sa-toolbar-right">
                <button
                  className="sa-btn sa-btn-translate-bulk"
                  onClick={translateSelected}
                  disabled={bulkLoading}>
                  {bulkLoading
                    ? `⏳ ${bulkProgress.done}/${bulkProgress.total}`
                    : selectMode && someSelected
                    ? `🌐 Translate Selected (${selectedCount})`
                    : `🌐 Translate All (${displayItems.length})`}
                </button>
              </div>
            </div>

            {/* ── Table head ── */}
            <div className={`sa-table-head ${showTypeCol ? "with-type" : ""} ${selectMode ? "with-check" : ""}`}>
              {selectMode && <span></span>}
              {showTypeCol && <span>Type</span>}
              <span>English</span>
              <span>Tamil</span>
              <span>Hindi</span>
            </div>

            {/* ── Rows ── */}
            {displayItems.map(item => {
              const isOldFormat = typeof item.name === "string";
              const isChecked   = selected.has(String(item._id));
              const enVal       = getName(item.name, "en");

              return (
                <div key={item._id}
                  className={`sa-table-row ${showTypeCol ? "with-type" : ""} ${selectMode ? "with-check" : ""} ${isChecked ? "sa-row-selected" : ""} ${isOldFormat ? "sa-row-old" : ""}`}>

                  {/* Checkbox — only visible in selectMode */}
                  {selectMode && (
                    <span className="sa-check-cell">
                      <input type="checkbox" checked={isChecked}
                        onChange={() => toggleItem(item._id)}
                        disabled={isOldFormat} />
                    </span>
                  )}

                  {/* Type badge — only in "All" tab */}
                  {showTypeCol && (
                    <span>
                      <span className={`sa-badge sa-badge-${item.type}`}>
                        {TYPE_LABEL[item.type]}
                      </span>
                    </span>
                  )}

                  {/* EN / TA / HI cells */}
                  {["en", "ta", "hi"].map(lang => {
                    const value  = getName(item.name, lang);
                    const isBad  = lang !== "en" && (!value?.trim() || value === enVal);

                    if (editCell?.id === String(item._id) && editCell?.lang === lang) {
                      return (
                        <span key={lang}>
                          <div className="sa-edit-row">
                            <input autoFocus value={editValue} className="sa-edit-input"
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && saveManualEdit()} />
                            <button className="sa-icon-btn sa-save-btn" onClick={saveManualEdit}>✓</button>
                            <button className="sa-icon-btn sa-cancel-btn" onClick={() => setEditCell(null)}>✕</button>
                          </div>
                        </span>
                      );
                    }

                    return (
                      <span key={lang}>
                        <div
                          className={`sa-cell ${isBad && !isOldFormat ? "sa-cell-missing" : ""} ${isOldFormat ? "sa-cell-old" : ""}`}
                          onClick={() => {
                            if (isOldFormat) return;
                            setEditCell({ id: String(item._id), type: item.type, lang });
                            setEditValue(value);
                          }}
                          title={isOldFormat ? "Run migration first" : "Click to edit manually"}>
                          {isOldFormat && lang === "en"  ? item.name :
                           isOldFormat                   ? <span className="sa-old-hint">migrate first</span> :
                           isBad                         ? <MissingBadge /> :
                           value}
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

      {/* ── Toast ── */}
      {toast.msg && (
        <div className={`sa-toast ${toast.type === "error" ? "sa-toast-error" : ""}`}>
          <span>{toast.msg}</span>
          <button onClick={() => setToast({ msg: "" })}>✕</button>
        </div>
      )}
    </div>
  );
}

function MissingBadge() {
  return (
    <span className="sa-missing-badge">
      <span className="sa-missing-dot" />
      not translated
    </span>
  );
}
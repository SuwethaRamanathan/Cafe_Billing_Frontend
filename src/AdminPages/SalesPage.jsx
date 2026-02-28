// import { useEffect, useState, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Sidebar from "./SideBar";
// import { useSettings } from "../SettingsContext";

// import "./sidebar.css";
// import "./sales.css";

// function SalesPage() {
//   const pdfContentRef = useRef(); // points to the HIDDEN full-content div
 
//   const { settings } = useSettings();
  
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("today");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   useEffect(() => {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/orders`)
//       .then(res => res.json())
//       .then(data => setOrders(data));
//   }, []);

//   const normalize = (d) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate());

//   const today = normalize(new Date());

//   const getFilteredOrders = () => {
//     return orders.filter(o => {
//       const d = normalize(new Date(o.date));
//       if (filter === "today") return d.getTime() === today.getTime();
//       if (filter === "7")  { const s = new Date(today); s.setDate(s.getDate() - 7);  return d >= s; }
//       if (filter === "15") { const s = new Date(today); s.setDate(s.getDate() - 15); return d >= s; }
//       if (filter === "30") { const s = new Date(today); s.setDate(s.getDate() - 30); return d >= s; }
//       if (filter === "custom") {
//         if (!from || !to) return false;
//         const f = normalize(new Date(from));
//         const t = normalize(new Date(to));
//         return d >= f && d <= t;
//       }
//       return true;
//     });
//   };

//   const filtered = getFilteredOrders();

//   const totalRevenue = filtered.reduce((a, c) => a + c.total, 0);
//   const totalOrders  = filtered.length;
//   const avgBill      = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";
//   const highestBill  = totalOrders > 0 ? Math.max(...filtered.map(o => o.total)) : 0;

//   const filterLabel = {
//     today:  "Today",
//     "7":    "Last 7 Days",
//     "15":   "Last 15 Days",
//     "30":   "Last 30 Days",
//     custom: "Custom Range",
//   }[filter];

//   const getDateRangeString = () => {
//     if (filter === "today") {
//       return new Date().toLocaleDateString("en-GB");
//     }
//     if (filter === "custom") {
//       if (!from || !to) return "Custom Range";
//       return `${new Date(from).toLocaleDateString("en-GB")} → ${new Date(to).toLocaleDateString("en-GB")}`;
//     }
//     const days = { "7": 7, "15": 15, "30": 30 }[filter];
//     const start = new Date(today);
//     start.setDate(start.getDate() - days);
//     return `${start.toLocaleDateString("en-GB")} → ${today.toLocaleDateString("en-GB")}`;
//   };

//   // ── PDF Download — captures the HIDDEN full div, not the scrollable table ──
//   const downloadPDF = async () => {
//     if (filtered.length === 0) { alert("No records to download!"); return; }

//     // Ask for filename via browser prompt
//     const defaultName = `Cafe-Sales-Report-${filterLabel.replace(/ /g, "-")}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
//     const fileName = window.prompt("Enter file name for the PDF:", defaultName);
//     if (fileName === null) return; // user cancelled

//     const el = pdfContentRef.current;

//     // Temporarily make it visible for html2canvas
//     el.style.display = "block";
//     await new Promise(res => setTimeout(res, 200));

//     const canvas = await html2canvas(el, {
//       scale: 2,
//       useCORS: true,
//       scrollY: 0,
//       windowWidth: el.scrollWidth,
//       windowHeight: el.scrollHeight,
//     });

//     el.style.display = "none";

//     const imgData  = canvas.toDataURL("image/png");
//     const pdf      = new jsPDF("p", "mm", "a4");
//     const pdfW     = pdf.internal.pageSize.getWidth();
//     const pdfH     = pdf.internal.pageSize.getHeight();
//     const imgW     = pdfW;
//     const imgH     = (canvas.height * imgW) / canvas.width;

//     // If content is taller than one page, add more pages
//     let yPos = 0;
//     while (yPos < imgH) {
//       if (yPos > 0) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, -yPos, imgW, imgH);
//       yPos += pdfH;
//     }

//     // Use showSaveFilePicker if browser supports it (shows Save As dialog)
//     const pdfBlob = pdf.output("blob");
//     if (window.showSaveFilePicker) {
//       try {
//         const fileHandle = await window.showSaveFilePicker({
//           suggestedName: `${fileName}.pdf`,
//           types: [{ description: "PDF File", accept: { "application/pdf": [".pdf"] } }],
//         });
//         const writable = await fileHandle.createWritable();
//         await writable.write(pdfBlob);
//         await writable.close();
//         return;
//       } catch (e) {
//         if (e.name === "AbortError") return; // user cancelled the file dialog
//       }
//     }

//     // Fallback for browsers that don't support showSaveFilePicker (Firefox, Safari)
//     const url = URL.createObjectURL(pdfBlob);
//     const a   = document.createElement("a");
//     a.href     = url;
//     a.download = `${fileName}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="sales-page-wrap">

//       <Sidebar />

//       <div ref={pdfContentRef} className="pdf-print-area" style={{ display: "none" }}>

//         <div className="pdf-cafe-header">
          
//           <div className="pdf-cafe-name"> {settings?.cafeName || "Cafe & Snacks"}</div>
//           <div className="pdf-report-title">Sales Report</div>
//           <div className="pdf-meta-row">
//             <span><strong>Period:</strong> {filterLabel} ({getDateRangeString()})</span>
//             <span><strong>Generated:</strong> {new Date().toLocaleString("en-IN")}</span>
//           </div>
//         </div>

//         <div className="pdf-stats-row">
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Total Revenue</div>
//             <div className="pdf-stat-val">{settings.currency}{totalRevenue.toLocaleString()}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Total Orders</div>
//             <div className="pdf-stat-val">{totalOrders}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Average Bill</div>
//             <div className="pdf-stat-val">{settings.currency}{avgBill}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Highest Bill</div>
//             <div className="pdf-stat-val">{settings.currency}{highestBill}</div>
//           </div>
//         </div>

//         <table className="pdf-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Bill No.</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Amount ({settings.currency})</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((o, i) => {
//               const date = new Date(o.date);
//               return (
//                 <tr key={o._id} className={i % 2 === 0 ? "pdf-row-even" : "pdf-row-odd"}>
//                   <td>{i + 1}</td>
//                   <td>#{String(o.orderNumber || i + 1).padStart(4, "0")}</td>
//                   <td>{date.toLocaleDateString("en-GB")}</td>
//                   <td>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
//                   <td>{settings.currency}{o.total.toLocaleString()}</td>
//                   <td><span className="pdf-paid-badge">Paid</span></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="4"><strong>Grand Total</strong></td>
//               <td><strong>{settings.currency}{totalRevenue.toLocaleString()}</strong></td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>

//         <div className="pdf-footer">
//           This report was generated by {settings.cafeName} Admin System
//         </div>
//       </div>

//       <div className="sales-main">

//         <div className="sales-topbar">
//           <div className="sales-topbar-title">Sales Report</div>
//           <button className="sales-download-btn" onClick={downloadPDF}>
//             ⬇ Download PDF
//           </button>
//         </div>

//         <div className="sales-content">

//           <div className="sales-filter-bar">
//             {[
//               { key: "today",  label: "Today" },
//               { key: "7",      label: "7 Days" },
//               { key: "15",     label: "15 Days" },
//               { key: "30",     label: "30 Days" },
//               { key: "custom", label: "Custom" },
//             ].map(f => (
//               <button
//                 key={f.key}
//                 className={`sales-filter-btn${filter === f.key ? " active" : ""}`}
//                 onClick={() => setFilter(f.key)}
//               >
//                 {f.label}
//               </button>
//             ))}

//             {filter === "custom" && (
//               <div className="sales-date-range">
//                 <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="sales-date-input" />
//                 <span className="sales-date-sep">→</span>
//                 <input type="date" value={to} onChange={e => setTo(e.target.value)} className="sales-date-input" />
//               </div>
//             )}
//           </div>

//           <div className="sales-stat-row">
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Total Revenue</div>
//                 <div className="stat-value">{settings.currency}{totalRevenue.toLocaleString()}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Total Orders</div>
//                 <div className="stat-value">{totalOrders}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Average Bill</div>
//                 <div className="stat-value">{settings.currency}{avgBill}</div>
//                 <div className="stat-sub">Per order</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Highest Bill</div>
//                 <div className="stat-value">{settings.currency}{highestBill}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//           </div>

//           <div className="sales-table-card">
//             <div className="sales-table-toprow">
//               <div className="sales-table-heading">
//                 Orders
//                 <span className="sales-table-count">{totalOrders} records</span>
//               </div>
//               <div className="sales-table-total-label">
//                 Total &nbsp;<strong>{settings.currency}{totalRevenue.toLocaleString()}</strong>
//               </div>
//             </div>

//             <div className="sales-col-head">
//               <span>#</span>
//               <span>Bill No.</span>
//               <span>Date</span>
//               <span>Time</span>
//               <span>Amount</span>
//               <span>Status</span>
//             </div>

//             <div className="sales-table-body">
//               {filtered.length === 0 ? (
//                 <div className="sales-empty">No records found for this period </div>
//               ) : (
//                 filtered.map((o, i) => {
//                   const date = new Date(o.date);
//                   return (
//                     <div className="sales-table-row" key={o._id}>
//                       <span className="sales-row-index">{i + 1}</span>
//                       <span className="sales-row-bill">#{String(o.orderNumber || i + 1).padStart(4, "0")}</span>
//                       <span>{date.toLocaleDateString("en-GB")}</span>
//                       <span>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
//                       <span className="sales-row-amount">{settings.currency}{o.total.toLocaleString()}</span>
//                       <span><span className="sales-status-badge paid">Paid</span></span>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {filtered.length > 0 && (
//               <div className="sales-table-footer">
//                 <span>Grand Total</span>
//                 <span className="sales-footer-amount">{settings.currency}{totalRevenue.toLocaleString()}</span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SalesPage;

// import { useEffect, useState, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Sidebar from "./SideBar";
// import { useSettings } from "../SettingsContext";
// // --- Added Recharts Imports ---
// import { 
//   PieChart, 
//   Pie, 
//   Cell, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer 
// } from "recharts";

// import "./sidebar.css";
// import "./sales.css";

// function SalesPage() {
//   const pdfContentRef = useRef(); // points to the HIDDEN full-content div
 
//   const { settings } = useSettings();
  
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("today");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   // Professional colors for the Pie slices
//   const COLORS = ["#c0521a", "#8a7060", "#b0998a", "#1a0a00", "#dcb9a1"];

//   useEffect(() => {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/orders`)
//       .then(res => res.json())
//       .then(data => setOrders(data));
//   }, []);

//   const normalize = (d) =>
//     new Date(d.getFullYear(), d.getMonth(), d.getDate());

//   const today = normalize(new Date());

//   const getFilteredOrders = () => {
//     return orders.filter(o => {
//       const d = normalize(new Date(o.date));
//       if (filter === "today") return d.getTime() === today.getTime();
//       if (filter === "7")  { const s = new Date(today); s.setDate(s.getDate() - 7);  return d >= s; }
//       if (filter === "15") { const s = new Date(today); s.setDate(s.getDate() - 15); return d >= s; }
//       if (filter === "30") { const s = new Date(today); s.setDate(s.getDate() - 30); return d >= s; }
//       if (filter === "custom") {
//         if (!from || !to) return false;
//         const f = normalize(new Date(from));
//         const t = normalize(new Date(to));
//         return d >= f && d <= t;
//       }
//       return true;
//     });
//   };

//   const filtered = getFilteredOrders();

//   const totalRevenue = filtered.reduce((a, c) => a + c.total, 0);
//   const totalOrders  = filtered.length;
//   const avgBill      = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";
//   const highestBill  = totalOrders > 0 ? Math.max(...filtered.map(o => o.total)) : 0;

//   const filterLabel = {
//     today:  "Today",
//     "7":    "Last 7 Days",
//     "15":   "Last 15 Days",
//     "30":   "Last 30 Days",
//     custom: "Custom Range",
//   }[filter];

//   const getDateRangeString = () => {
//     if (filter === "today") {
//       return new Date().toLocaleDateString("en-GB");
//     }
//     if (filter === "custom") {
//       if (!from || !to) return "Custom Range";
//       return `${new Date(from).toLocaleDateString("en-GB")} → ${new Date(to).toLocaleDateString("en-GB")}`;
//     }
//     const days = { "7": 7, "15": 15, "30": 30 }[filter];
//     const start = new Date(today);
//     start.setDate(start.getDate() - days);
//     return `${start.toLocaleDateString("en-GB")} → ${today.toLocaleDateString("en-GB")}`;
//   };

//   // --- New Function: Prepare data for Best Selling Items Pie Chart ---
//   const getTopItemsData = () => {
//     const itemMap = {};
//     filtered.forEach((o) => {
//       o.items.forEach((item) => {
//         itemMap[item.name] = (itemMap[item.name] || 0) + item.qty;
//       });
//     });

//     return Object.keys(itemMap)
//       .map((name) => ({ 
//         name, 
//         value: itemMap[name] 
//       }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 5); // Take top 5 items
//   };

//   const topItemsData = getTopItemsData();

//   // ── PDF Download — captures the HIDDEN full div, not the scrollable table ──
//   const downloadPDF = async () => {
//     if (filtered.length === 0) { alert("No records to download!"); return; }

//     // Ask for filename via browser prompt
//     const defaultName = `Cafe-Sales-Report-${filterLabel.replace(/ /g, "-")}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
//     const fileName = window.prompt("Enter file name for the PDF:", defaultName);
//     if (fileName === null) return; // user cancelled

//     const el = pdfContentRef.current;

//     // Temporarily make it visible for html2canvas
//     el.style.display = "block";
//     await new Promise(res => setTimeout(res, 200));

//     const canvas = await html2canvas(el, {
//       scale: 2,
//       useCORS: true,
//       scrollY: 0,
//       windowWidth: el.scrollWidth,
//       windowHeight: el.scrollHeight,
//     });

//     el.style.display = "none";

//     const imgData  = canvas.toDataURL("image/png");
//     const pdf      = new jsPDF("p", "mm", "a4");
//     const pdfW     = pdf.internal.pageSize.getWidth();
//     const pdfH     = pdf.internal.pageSize.getHeight();
//     const imgW     = pdfW;
//     const imgH     = (canvas.height * imgW) / canvas.width;

//     // If content is taller than one page, add more pages
//     let yPos = 0;
//     while (yPos < imgH) {
//       if (yPos > 0) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, -yPos, imgW, imgH);
//       yPos += pdfH;
//     }

//     // Use showSaveFilePicker if browser supports it (shows Save As dialog)
//     const pdfBlob = pdf.output("blob");
//     if (window.showSaveFilePicker) {
//       try {
//         const fileHandle = await window.showSaveFilePicker({
//           suggestedName: `${fileName}.pdf`,
//           types: [{ description: "PDF File", accept: { "application/pdf": [".pdf"] } }],
//         });
//         const writable = await fileHandle.createWritable();
//         await writable.write(pdfBlob);
//         await writable.close();
//         return;
//       } catch (e) {
//         if (e.name === "AbortError") return; // user cancelled the file dialog
//       }
//     }

//     // Fallback for browsers that don't support showSaveFilePicker (Firefox, Safari)
//     const url = URL.createObjectURL(pdfBlob);
//     const a   = document.createElement("a");
//     a.href     = url;
//     a.download = `${fileName}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="sales-page-wrap">

//       <Sidebar />

//       <div ref={pdfContentRef} className="pdf-print-area" style={{ display: "none" }}>

//         <div className="pdf-cafe-header">
          
//           <div className="pdf-cafe-name"> {settings?.cafeName || "Cafe & Snacks"}</div>
//           <div className="pdf-report-title">Sales Report</div>
//           <div className="pdf-meta-row">
//             <span><strong>Period:</strong> {filterLabel} ({getDateRangeString()})</span>
//             <span><strong>Generated:</strong> {new Date().toLocaleString("en-IN")}</span>
//           </div>
//         </div>

//         <div className="pdf-stats-row">
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Total Revenue</div>
//             <div className="pdf-stat-val">{settings.currency}{totalRevenue.toLocaleString()}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Total Orders</div>
//             <div className="pdf-stat-val">{totalOrders}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Average Bill</div>
//             <div className="pdf-stat-val">{settings.currency}{avgBill}</div>
//           </div>
//           <div className="pdf-stat-box">
//             <div className="pdf-stat-label">Highest Bill</div>
//             <div className="pdf-stat-val">{settings.currency}{highestBill}</div>
//           </div>
//         </div>

//         <table className="pdf-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Bill No.</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Amount ({settings.currency})</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((o, i) => {
//               const date = new Date(o.date);
//               return (
//                 <tr key={o._id} className={i % 2 === 0 ? "pdf-row-even" : "pdf-row-odd"}>
//                   <td>{i + 1}</td>
//                   <td>#{String(o.orderNumber || i + 1).padStart(4, "0")}</td>
//                   <td>{date.toLocaleDateString("en-GB")}</td>
//                   <td>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
//                   <td>{settings.currency}{o.total.toLocaleString()}</td>
//                   <td><span className="pdf-paid-badge">Paid</span></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="4"><strong>Grand Total</strong></td>
//               <td><strong>{settings.currency}{totalRevenue.toLocaleString()}</strong></td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>

//         <div className="pdf-footer">
//           This report was generated by {settings.cafeName} Admin System
//         </div>
//       </div>

//       <div className="sales-main">

//         <div className="sales-topbar">
//           <div className="sales-topbar-title">Sales Report</div>
//           <button className="sales-download-btn" onClick={downloadPDF}>
//             ⬇ Download PDF
//           </button>
//         </div>

//         <div className="sales-content">

//           <div className="sales-filter-bar">
//             {[
//               { key: "today",  label: "Today" },
//               { key: "7",      label: "7 Days" },
//               { key: "15",     label: "15 Days" },
//               { key: "30",     label: "30 Days" },
//               { key: "custom", label: "Custom" },
//             ].map(f => (
//               <button
//                 key={f.key}
//                 className={`sales-filter-btn${filter === f.key ? " active" : ""}`}
//                 onClick={() => setFilter(f.key)}
//               >
//                 {f.label}
//               </button>
//             ))}

//             {filter === "custom" && (
//               <div className="sales-date-range">
//                 <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="sales-date-input" />
//                 <span className="sales-date-sep">→</span>
//                 <input type="date" value={to} onChange={e => setTo(e.target.value)} className="sales-date-input" />
//               </div>
//             )}
//           </div>

//           <div className="sales-stat-row">
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Total Revenue</div>
//                 <div className="stat-value">{settings.currency}{totalRevenue.toLocaleString()}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Total Orders</div>
//                 <div className="stat-value">{totalOrders}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Average Bill</div>
//                 <div className="stat-value">{settings.currency}{avgBill}</div>
//                 <div className="stat-sub">Per order</div>
//               </div>
//             </div>
//             <div className="sales-stat-card">
//               <div className="stat-body">
//                 <div className="stat-label">Highest Bill</div>
//                 <div className="stat-value">{settings.currency}{highestBill}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>
//             </div>
//           </div>

//           {/* --- New Analytics Section: Pie Chart --- */}
//           <div className="analytics-row" style={{ marginBottom: '24px' }}>
//             <div className="sales-table-card" style={{ padding: "20px", height: "400px" }}>
//               <h3 className="sales-table-heading" style={{ marginBottom: "20px" }}>
//                 Best Selling Items (Quantity)
//               </h3>
//               <ResponsiveContainer width="100%" height="90%">
//                 <PieChart>
//                   <Pie
//                     data={topItemsData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {topItemsData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend verticalAlign="bottom" height={36} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="sales-table-card">
//             <div className="sales-table-toprow">
//               <div className="sales-table-heading">
//                 Orders
//                 <span className="sales-table-count">{totalOrders} records</span>
//               </div>
//               <div className="sales-table-total-label">
//                 Total &nbsp;<strong>{settings.currency}{totalRevenue.toLocaleString()}</strong>
//               </div>
//             </div>

//             <div className="sales-col-head">
//               <span>#</span>
//               <span>Bill No.</span>
//               <span>Date</span>
//               <span>Time</span>
//               <span>Amount</span>
//               <span>Status</span>
//             </div>

//             <div className="sales-table-body">
//               {filtered.length === 0 ? (
//                 <div className="sales-empty">No records found for this period </div>
//               ) : (
//                 filtered.map((o, i) => {
//                   const date = new Date(o.date);
//                   return (
//                     <div className="sales-table-row" key={o._id}>
//                       <span className="sales-row-index">{i + 1}</span>
//                       <span className="sales-row-bill">#{String(o.orderNumber || i + 1).padStart(4, "0")}</span>
//                       <span>{date.toLocaleDateString("en-GB")}</span>
//                       <span>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
//                       <span className="sales-row-amount">{settings.currency}{o.total.toLocaleString()}</span>
//                       <span><span className="sales-status-badge paid">Paid</span></span>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {filtered.length > 0 && (
//               <div className="sales-table-footer">
//                 <span>Grand Total</span>
//                 <span className="sales-footer-amount">{settings.currency}{totalRevenue.toLocaleString()}</span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SalesPage;


// ... ALL YOUR IMPORTS SAME (unchanged)
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "./SideBar";
import { useSettings } from "../SettingsContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./sidebar.css";
import "./sales.css";

function SalesPage() {

  // ====== ALL YOUR EXISTING STATE + LOGIC (UNCHANGED) ======
  const pdfContentRef = useRef();
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const COLORS = ["#c0521a", "#8a7060", "#b0998a", "#1a0a00", "#dcb9a1"];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = normalize(new Date());

  const getFilteredOrders = () => {
    return orders.filter(o => {
      const d = normalize(new Date(o.date));
      if (filter === "today") return d.getTime() === today.getTime();
      if (filter === "7")  { const s = new Date(today); s.setDate(s.getDate() - 7);  return d >= s; }
      if (filter === "15") { const s = new Date(today); s.setDate(s.getDate() - 15); return d >= s; }
      if (filter === "30") { const s = new Date(today); s.setDate(s.getDate() - 30); return d >= s; }
      if (filter === "custom") {
        if (!from || !to) return false;
        const f = normalize(new Date(from));
        const t = normalize(new Date(to));
        return d >= f && d <= t;
      }
      return true;
    });
  };

  const filtered = getFilteredOrders();

  const totalRevenue = filtered.reduce((a, c) => a + c.total, 0);
  const totalOrders  = filtered.length;
  const avgBill      = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";
  const highestBill  = totalOrders > 0 ? Math.max(...filtered.map(o => o.total)) : 0;

  const filterLabel = {
    today:  "Today",
    "7":    "Last 7 Days",
    "15":   "Last 15 Days",
    "30":   "Last 30 Days",
    custom: "Custom Range",
  }[filter];

  const getDateRangeString = () => {
    if (filter === "today") return new Date().toLocaleDateString("en-GB");
    if (filter === "custom") {
      if (!from || !to) return "Custom Range";
      return `${new Date(from).toLocaleDateString("en-GB")} → ${new Date(to).toLocaleDateString("en-GB")}`;
    }
    const days = { "7": 7, "15": 15, "30": 30 }[filter];
    const start = new Date(today);
    start.setDate(start.getDate() - days);
    return `${start.toLocaleDateString("en-GB")} → ${today.toLocaleDateString("en-GB")}`;
  };

  const getTopItemsData = () => {
    const itemMap = {};
    filtered.forEach(o => {
      o.items.forEach(item => {
        itemMap[item.name] = (itemMap[item.name] || 0) + item.qty;
      });
    });
    return Object.keys(itemMap)
      .map(name => ({ name, value: itemMap[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const topItemsData = getTopItemsData();

  // ===== PDF LOGIC UNCHANGED =====
  const downloadPDF = async () => {
    if (filtered.length === 0) { alert("No records to download!"); return; }
    const defaultName = `Cafe-Sales-Report-${filterLabel.replace(/ /g, "-")}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
    const fileName = window.prompt("Enter file name for the PDF:", defaultName);
    if (fileName === null) return;

    const el = pdfContentRef.current;
    el.style.display = "block";
    await new Promise(res => setTimeout(res, 200));

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });

    el.style.display = "none";

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgW = pdfW;
    const imgH = (canvas.height * imgW) / canvas.width;

    let yPos = 0;
    while (yPos < imgH) {
      if (yPos > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -yPos, imgW, imgH);
      yPos += pdfH;
    }

    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sales-page-wrap">

      <Sidebar />

      {/* ===== PDF AREA UNCHANGED ===== */}
      <div ref={pdfContentRef} className="pdf-print-area" style={{ display: "none" }}>
        {/* SAME PDF CONTENT */}
      </div>

      <div className="sales-main">

        <div className="sales-topbar">
          <div className="sales-topbar-title">Sales Report</div>
          <button className="sales-download-btn" onClick={downloadPDF}>
            ⬇ Download PDF
          </button>
        </div>

        <div className="sales-content">

          {/* FILTER BAR SAME */}
          <div className="sales-filter-bar">
            {[
              { key: "today", label: "Today" },
              { key: "7", label: "7 Days" },
              { key: "15", label: "15 Days" },
              { key: "30", label: "30 Days" },
              { key: "custom", label: "Custom" },
            ].map(f => (
              <button
                key={f.key}
                className={`sales-filter-btn${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}

            {filter === "custom" && (
              <div className="sales-date-range">
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="sales-date-input" />
                <span className="sales-date-sep">→</span>
                <input type="date" value={to} onChange={e => setTo(e.target.value)} className="sales-date-input" />
              </div>
            )}
          </div>

          {/* ===== NEW PREMIUM ANALYTICS GRID ===== */}
          <div className="analytics-grid">

            {/* LEFT — PIE */}
            <div className="analytics-chart-card">
              <h3 className="analytics-title">Best Selling Items</h3>
              <div className="analytics-period">
  {filterLabel} ({getDateRangeString()})
</div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topItemsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topItemsData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip cursor={false}/>
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* RIGHT — STATS 2x2 */}
            <div className="analytics-stats-grid">

              <div className="stat-card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">{settings.currency}{totalRevenue.toLocaleString()}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{totalOrders}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Average Bill</div>
                <div className="stat-value">{settings.currency}{avgBill}</div>
                <div className="stat-sub">Per order</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Highest Bill</div>
                <div className="stat-value">{settings.currency}{highestBill}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>

            </div>
          </div>

          {/* ===== ORDERS TABLE SAME ===== */}
          <div className="sales-table-card">
            <div className="sales-table-toprow">
              <div className="sales-table-heading">
                Orders
                <span className="sales-table-count">{totalOrders} records</span>
              </div>
              <div className="sales-table-total-label">
                Total <strong>{settings.currency}{totalRevenue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="sales-col-head">
              <span>#</span>
              <span>Bill No.</span>
              <span>Date</span>
              <span>Time</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            <div className="sales-table-body">
              {filtered.length === 0 ? (
                <div className="sales-empty">No records found</div>
              ) : (
                filtered.map((o, i) => {
                  const date = new Date(o.date);
                  return (
                    <div className="sales-table-row" key={o._id}>
                      <span>{i + 1}</span>
                      <span>#{String(o.orderNumber || i + 1).padStart(4, "0")}</span>
                      <span>{date.toLocaleDateString("en-GB")}</span>
                      <span>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span>{settings.currency}{o.total.toLocaleString()}</span>
                      <span><span className="sales-status-badge paid">Paid</span></span>
                    </div>
                  );
                })
              )}
            </div>

            {filtered.length > 0 && (
              <div className="sales-table-footer">
                <span>Grand Total</span>
                <span>{settings.currency}{totalRevenue.toLocaleString()}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SalesPage;
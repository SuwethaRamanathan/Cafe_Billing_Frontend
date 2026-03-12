// import { useEffect, useState, useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Sidebar from "./SideBar";
// import { useSettings } from "../SettingsContext";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./sidebar.css";
// import "./sales.css";

// function SalesPage() {

//   const pdfContentRef = useRef();
//   const { settings } = useSettings();
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("today");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   const COLORS = ["#c0521a", "#8a7060", "#b0998a", "#1a0a00", "#dcb9a1"];

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
//       .then(res => res.json())
//       .then(data => setOrders(data));
//   }, []);

//   const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
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
//   const avgBill      = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
//   const highestBill  = totalOrders > 0 ? Math.max(...filtered.map(o => o.total.toFixed(2))) : 0;

//   const filterLabel = {
//     today:  "Today",
//     "7":    "Last 7 Days",
//     "15":   "Last 15 Days",
//     "30":   "Last 30 Days",
//     custom: "Custom Range",
//   }[filter];

//   const getDateRangeString = () => {
//     if (filter === "today") return new Date().toLocaleDateString("en-GB");
//     if (filter === "custom") {
//       if (!from || !to) return "Custom Range";
//       return `${new Date(from).toLocaleDateString("en-GB")} → ${new Date(to).toLocaleDateString("en-GB")}`;
//     }
//     const days = { "7": 7, "15": 15, "30": 30 }[filter];
//     const start = new Date(today);
//     start.setDate(start.getDate() - days);
//     return `${start.toLocaleDateString("en-GB")} → ${today.toLocaleDateString("en-GB")}`;
//   };

//   const getTopItemsData = () => {
//     const itemMap = {};
//     filtered.forEach(o => {
//       o.items.forEach(item => {
//         itemMap[item.name] = (itemMap[item.name] || 0) + item.qty;
//       });
//     });
//     return Object.keys(itemMap)
//       .map(name => ({ name, value: itemMap[name] }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 5);
//   };

//   const topItemsData = getTopItemsData();

//   const downloadPDF = async () => {
//     if (filtered.length === 0) { alert("No records to download!"); return; }
//     const defaultName = `Cafe-Sales-Report-${filterLabel.replace(/ /g, "-")}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
//     const fileName = window.prompt("Enter file name for the PDF:", defaultName);
//     if (fileName === null) return;

//     const el = pdfContentRef.current;
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

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfW = pdf.internal.pageSize.getWidth();
//     const pdfH = pdf.internal.pageSize.getHeight();
//     const imgW = pdfW;
//     const imgH = (canvas.height * imgW) / canvas.width;

//     let yPos = 0;
//     while (yPos < imgH) {
//       if (yPos > 0) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, -yPos, imgW, imgH);
//       yPos += pdfH;
//     }

//     const pdfBlob = pdf.output("blob");
//     const url = URL.createObjectURL(pdfBlob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${fileName}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="sales-page-wrap">

//       <Sidebar />

//       <div ref={pdfContentRef} className="pdf-print-area" style={{ display: "none" }}>
//         <div className="pdf-cafe-header">
//     <div className="pdf-cafe-name">{settings?.cafeName || "Cafe & Snacks"}</div>
//     <div className="pdf-report-title">Sales Report</div>
//     <div className="pdf-meta-row">
//       <span><strong>Period:</strong> {filterLabel} ({getDateRangeString()})</span>
//       <span><strong>Generated:</strong> {new Date().toLocaleString("en-IN")}</span>
//     </div>
//   </div>

//   <div className="pdf-stats-row">
//     <div className="pdf-stat-box">
//       <div className="pdf-stat-label">Total Revenue</div>
//       <div className="pdf-stat-val">{settings.currency}{totalRevenue.toLocaleString()}</div>
//     </div>
//     <div className="pdf-stat-box">
//       <div className="pdf-stat-label">Total Orders</div>
//       <div className="pdf-stat-val">{totalOrders}</div>
//     </div>
//     <div className="pdf-stat-box">
//       <div className="pdf-stat-label">Average Bill</div>
//       <div className="pdf-stat-val">{settings.currency}{avgBill}</div>
//     </div>
//     <div className="pdf-stat-box">
//       <div className="pdf-stat-label">Highest Bill</div>
//       <div className="pdf-stat-val">{settings.currency}{highestBill}</div>
//     </div>
//   </div>

//   <table className="pdf-table">
//     <thead>
//       <tr>
//         <th>#</th>
//         <th>Bill No.</th>
//         <th>Date</th>
//         <th>Time</th>
//         <th>Amount ({settings.currency})</th>
//         <th>Status</th>
//       </tr>
//     </thead>
//     <tbody>
//       {filtered.map((o, i) => {
//         const date = new Date(o.date);
//         return (
//           <tr key={o._id}>
//             <td>{i + 1}</td>
//             <td>#{String(o.orderNumber || i + 1).padStart(4, "0")}</td>
//             <td>{date.toLocaleDateString("en-GB")}</td>
//             <td>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
//             <td>{settings.currency}{o.total.toLocaleString()}</td>
//             <td>Paid</td>
//           </tr>
//         );
//       })}
//     </tbody>
//   </table>

//       </div>

//       <div className="sales-main">

//         <div className="sales-topbar">
//           <div className="sales-topbar-title">Sales Report</div>
//           <button className="sales-download-btn" onClick={downloadPDF}>
//             ⬇ Download PDF
//           </button>
//         </div>

//         <div className="page-help">

//   <div className="page-help-title">
//     Sales Analytics Overview
//   </div>

//   <div className="page-help-text">
//     This page displays your cafe's sales performance and analytics.
//   </div>

//   <ul className="page-help-list">
//     <li>Use filters to view sales for today, last 7 days, or custom ranges.</li>
//     <li>The pie chart shows your top selling menu items.</li>
//     {/* <li>Sales statistics show revenue, order count, and average bill value.</li> */}
//     {/* <li>You can export the report as a PDF for records or sharing.</li> */}
//   </ul>

// </div>

//         <div className="sales-content">

//           <div className="sales-filter-bar">
//             {[
//               { key: "today", label: "Today" },
//               { key: "7", label: "7 Days" },
//               { key: "15", label: "15 Days" },
//               { key: "30", label: "30 Days" },
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

//           <div className="analytics-grid">

//             <div className="analytics-chart-card">
//               <h3 className="analytics-title">Best Selling Items</h3>
//               <div className="analytics-period">
//   {filterLabel} ({getDateRangeString()})
// </div>

//               {/* <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={topItemsData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={110}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {topItemsData.map((entry, index) => (
//                       <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip cursor={false} click={false}/>
//                   <Legend verticalAlign="bottom" />
//                 </PieChart>
//               </ResponsiveContainer> */}

//              {topItemsData.length === 0 ? (

//   <div className="chart-empty">
//     <div className="chart-empty-title">No Sales Yet</div>
//     <div className="chart-empty-text">
//       Start billing orders to see best selling items.
//     </div>
//   </div>

// ) : (

//   <ResponsiveContainer width="100%" height={300}>
//     <PieChart>
//       <Pie
//         data={topItemsData}
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         outerRadius={110}
//         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//       >
//         {topItemsData.map((entry, index) => (
//           <Cell key={index} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>

//       <Tooltip cursor={false}/>
//       <Legend verticalAlign="bottom" />

//     </PieChart>
//   </ResponsiveContainer>

// )}

//             </div>

//             <div className="analytics-stats-grid">

//               <div className="stat-card">
//                 <div className="stat-label">Total Revenue</div>
//                 <div className="stat-value">{settings.currency}{totalRevenue.toLocaleString()}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-label">Total Orders</div>
//                 <div className="stat-value">{totalOrders}</div>
//                 <div className="stat-sub">{filterLabel}</div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-label">Average Bill</div>
//                 <div className="stat-value">{settings.currency}{avgBill}</div>
//                 <div className="stat-sub">Per order</div>
//               </div>

//               <div className="stat-card">
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
//                 Total <strong>{settings.currency}{totalRevenue.toLocaleString()}</strong>
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
//                 <div className="sales-empty">No records found</div>
//               ) : (
//                 filtered.map((o, i) => {
//                   const date = new Date(o.date);
//                   return (
//                     <div className="sales-table-row" key={o._id}>
//                       <span>{i + 1}</span>
//                       <span>#{String(o.orderNumber || i + 1).padStart(4, "0")}</span>
//                       <span>{date.toLocaleDateString("en-GB")}</span>
//                       <span>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
//                       <span>{settings.currency}{o.total.toLocaleString()}</span>
//                       <span><span className="sales-status-badge paid">Paid</span></span>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {filtered.length > 0 && (
//               <div className="sales-table-footer">
//                 <span>Grand Total</span>
//                 <span>{settings.currency}{totalRevenue.toLocaleString()}</span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SalesPage;



import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "./SideBar";
import { useSettings } from "../SettingsContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./sidebar.css";
import "./sales.css";

function SalesPage() {
  const { t } = useTranslation();
  const pdfContentRef = useRef();
  const { settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  const [showHelp, setShowHelp] = useState(false);

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
        const tDate = normalize(new Date(to));
        return d >= f && d <= tDate;
      }
      return true;
    });
  };

  const filtered = getFilteredOrders();

  const totalRevenue = filtered.reduce((a, c) => a + c.total, 0);
  const totalOrders  = filtered.length;
  const avgBill      = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const highestBill  = totalOrders > 0 ? Math.max(...filtered.map(o => o.total.toFixed(2))) : 0;

  const filterLabel = {
    today:  t("sales.filterToday"),
    "7":    t("sales.filter7"),
    "15":   t("sales.filter15"),
    "30":   t("sales.filter30"),
    custom: t("sales.filterCustom"),
  }[filter];

  const getDateRangeString = () => {
    if (filter === "today") return new Date().toLocaleDateString("en-GB");
    if (filter === "custom") {
      if (!from || !to) return t("sales.filterCustom");
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

  const downloadPDF = async () => {
    if (filtered.length === 0) { alert(t("sales.noRecordsAlert")); return; }
    const defaultName = `Cafe-Sales-Report-${filterLabel.replace(/ /g, "-")}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
    const fileName = window.prompt(t("sales.pdfFileNamePrompt"), defaultName);
    if (fileName === null) return;

    const el = pdfContentRef.current;
    el.style.display = "block";
    await new Promise(res => setTimeout(res, 200));

    const canvas = await html2canvas(el, {
      scale: 2, useCORS: true, scrollY: 0,
      windowWidth: el.scrollWidth, windowHeight: el.scrollHeight,
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

      <div ref={pdfContentRef} className="pdf-print-area" style={{ display: "none" }}>
        <div className="pdf-cafe-header">
          <div className="pdf-cafe-name">{settings?.cafeName || "Cafe & Snacks"}</div>
          <div className="pdf-report-title">{t("sales.title")}</div>
          <div className="pdf-meta-row">
            <span><strong>{t("sales.pdfPeriod")}:</strong> {filterLabel} ({getDateRangeString()})</span>
            <span><strong>{t("sales.pdfGenerated")}:</strong> {new Date().toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="pdf-stats-row">
          <div className="pdf-stat-box">
            <div className="pdf-stat-label">{t("sales.totalRevenue")}</div>
            <div className="pdf-stat-val">{settings.currency}{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="pdf-stat-box">
            <div className="pdf-stat-label">{t("sales.totalOrders")}</div>
            <div className="pdf-stat-val">{totalOrders}</div>
          </div>
          <div className="pdf-stat-box">
            <div className="pdf-stat-label">{t("sales.avgBill")}</div>
            <div className="pdf-stat-val">{settings.currency}{avgBill}</div>
          </div>
          <div className="pdf-stat-box">
            <div className="pdf-stat-label">{t("sales.highestBill")}</div>
            <div className="pdf-stat-val">{settings.currency}{highestBill}</div>
          </div>
        </div>

        <table className="pdf-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("sales.col.billNo")}</th>
              <th>{t("sales.col.date")}</th>
              <th>{t("sales.col.time")}</th>
              <th>{t("sales.col.amount")} ({settings.currency})</th>
              <th>{t("sales.col.status")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => {
              const date = new Date(o.date);
              return (
                <tr key={o._id}>
                  <td>{i + 1}</td>
                  <td>#{String(o.orderNumber || i + 1).padStart(4, "0")}</td>
                  <td>{date.toLocaleDateString("en-GB")}</td>
                  <td>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{settings.currency}{o.total.toLocaleString()}</td>
                  <td>{t("sales.paid")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sales-main">

        <div className="sales-topbar">
          <div className="sales-topbar-title">{t("sales.title")}</div>
          <button className="sales-download-btn" onClick={downloadPDF}>
            ⬇ {t("sales.downloadPdf")}
          </button>
        </div>


        {showHelp && (
  <div className="sales-help">
    <button
      className="help-close"
      onClick={() => setShowHelp(false)}
    >
      ✕
    </button>

    <div className="page-help-title">{t("sales.helpTitle")}</div>
    <div className="page-help-text">{t("sales.helpText")}</div>

    <ul className="page-help-list">
      <li>{t("sales.helpTip1")}</li>
      <li>{t("sales.helpTip2")}</li>
    </ul>
  </div>
)}

{!showHelp && (
  <button
    className="help-float-btn"
    onClick={() => setShowHelp(true)}
  >
    Help
  </button>
)}

        <div className="sales-content">

          <div className="sales-filter-bar">
            {[
              { key: "today", label: t("sales.filterToday") },
              { key: "7",     label: t("sales.filter7Days") },
              { key: "15",    label: t("sales.filter15Days") },
              { key: "30",    label: t("sales.filter30Days") },
              { key: "custom",label: t("sales.filterCustom") },
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

          <div className="analytics-grid">

            <div className="analytics-chart-card">
              <h3 className="analytics-title">{t("sales.bestSellingItems")}</h3>
              <div className="analytics-period">{filterLabel} ({getDateRangeString()})</div>

              {topItemsData.length === 0 ? (
                <div className="chart-empty">
                  <div className="chart-empty-title">{t("sales.noSalesYet")}</div>
                  <div className="chart-empty-text">{t("sales.noSalesDesc")}</div>
                </div>
              ) : (
                // <ResponsiveContainer width="100%" height={300}>
                //   <PieChart>
                //     <Pie data={topItemsData} dataKey="value" nameKey="name"
                //       cx="50%" cy="50%" outerRadius={110}
                //       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                //       {topItemsData.map((entry, index) => (
                //         <Cell key={index} fill={COLORS[index % COLORS.length]} />
                //       ))}
                //     </Pie>
                //     <Tooltip cursor={false} />
                //     <Legend verticalAlign="bottom" />
                //   </PieChart>
                // </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={topItemsData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={110}
      label={({ payload, percent }) =>
        `${payload.name} ${(percent * 100).toFixed(0)}%`
      }
    >
      {topItemsData.map((entry, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    <Tooltip
      formatter={(value, name, props) => [value, props.payload.name]}
    />

    <Legend verticalAlign="bottom" />
  </PieChart>
</ResponsiveContainer>
              )}
            </div>

            <div className="analytics-stats-grid">
              <div className="stat-card">
                <div className="stat-label">{t("sales.totalRevenue")}</div>
                <div className="stat-value">{settings.currency}{totalRevenue.toLocaleString()}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">{t("sales.totalOrders")}</div>
                <div className="stat-value">{totalOrders}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">{t("sales.avgBill")}</div>
                <div className="stat-value">{settings.currency}{avgBill}</div>
                <div className="stat-sub">{t("sales.perOrder")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">{t("sales.highestBill")}</div>
                <div className="stat-value">{settings.currency}{highestBill}</div>
                <div className="stat-sub">{filterLabel}</div>
              </div>
            </div>
          </div>

          <div className="sales-table-card">
            <div className="sales-table-toprow">
              <div className="sales-table-heading">
                {t("sales.orders")}
                <span className="sales-table-count">{totalOrders} {t("sales.records")}</span>
              </div>
              <div className="sales-table-total-label">
                {t("common.total")} <strong>{settings.currency}{totalRevenue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="sales-col-head">
              <span>#</span>
              <span>{t("sales.col.billNo")}</span>
              <span>{t("sales.col.date")}</span>
              <span>{t("sales.col.time")}</span>
              <span>{t("sales.col.amount")}</span>
              <span>{t("sales.col.status")}</span>
            </div>

            <div className="sales-table-body">
              {filtered.length === 0 ? (
                <div className="sales-empty">{t("sales.noRecords")}</div>
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
                      <span><span className="sales-status-badge paid">{t("sales.paid")}</span></span>
                    </div>
                  );
                })
              )}
            </div>

            {filtered.length > 0 && (
              <div className="sales-table-footer">
                <span>{t("sales.grandTotal")}</span>
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
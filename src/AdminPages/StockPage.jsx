// import { useEffect, useState } from "react";
// import ExcelJS from "exceljs";
// import Sidebar from "./SideBar";
// import "./sidebar.css";
// import "./stock.css";

// function StockPage({ mode }) {

//   const [groceries, setGroceries]       = useState([]);
//   const [searchTerm, setSearchTerm]     = useState("");
//   const [showForm, setShowForm]         = useState(false);
  
//   const [showDeleteMode, setShowDeleteMode] = useState(false);
//   const [successMsg, setSuccessMsg]     = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

// const [newGrocery, setNewGrocery] = useState({
//   name: "",
//   unitId: "",
//   quantity: "",
//   lastPurchasedDate: ""
// });

//   const [units,setUnits] = useState([]);
//   const [newUnit,setNewUnit] = useState({
//  name:"",
//  purchaseUnit:"",
//  reduceUnit:"",
//  displayUnit:"",
//  conversionFactor:""
// });
 
//  const [showUnitForm, setShowUnitForm] = useState(false);
//  const [showUnitsList, setShowUnitsList] = useState(false);
//  const selectedUnit = units.find(u => u._id === newGrocery.unitId);

//   const fetchGroceries = () => {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/groceries`)
//       .then(res => res.json())
//       .then(data =>
//         setGroceries(data.map(item => ({
//           ...item,
//           selected: false,
//           isEditing: false,
//           editedQuantity: item.displayQty ??item.quantity,
//           modified: false
//         })))
//       );
//   };


//   useEffect(() => { fetchGroceries(); }, []);

//   useEffect(()=>{
//  fetch(`${import.meta.env.VITE_API_URL}/api/units`)
//  .then(r=>r.json())
//  .then(setUnits);
// },[]);

//   useEffect(() => {
//     if (!successMsg) return;
//     const t = setTimeout(() => setSuccessMsg(""), 3000);
//     return () => clearTimeout(t);
//   }, [successMsg]);

//   const filteredGroceries = groceries.filter(g =>
//     g.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalItems    = groceries.length;
//   const lowStockItems = groceries.filter(
//   g => (g.displayQty ?? g.quantity) <= 5 && (g.displayQty ?? g.quantity) > 0
// ).length;
// const outOfStock = groceries.filter(g => (g.displayQty ?? g.quantity) === 0).length;
// const healthyItems = groceries.filter(g => (g.displayQty ?? g.quantity) > 5).length;

//   const getStockStatus = (qty) => {
//     if (qty === 0)  return { label: "Out of Stock", cls: "badge-out" };
//     if (qty <= 5)   return { label: "Low Stock",    cls: "badge-low" };
//     return               { label: "In Stock",      cls: "badge-ok"  };
//   };

// const addUnit = async () => {

//   if (!newUnit.purchaseUnit || !newUnit.reduceUnit || !newUnit.displayUnit) {
//     setSuccessMsg("Please fill all unit fields");
//     return;
//   }

//   await fetch(
//     `${import.meta.env.VITE_API_URL}/api/units`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newUnit)
//     }
//   );

//   setSuccessMsg("Unit added successfully");

//   setNewUnit({
//     purchaseUnit: "",
//     reduceUnit: "",
//     displayUnit: "",
//     conversionFactor: ""
//   });

//   fetch(`${import.meta.env.VITE_API_URL}/api/units`)
//     .then(r => r.json())
//     .then(setUnits);

//   setShowUnitForm(false);
// };

//   const addGrocery = async () => {
//     if (!newGrocery.name || !newGrocery.unitId || !newGrocery.quantity || !newGrocery.lastPurchasedDate) {
//       setSuccessMsg(" Please fill all fields"); return;
//     }
//     await fetch(
//       `${import.meta.env.VITE_API_URL}/api/groceries`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newGrocery)
//     });
//     setNewGrocery({
//   name: "",
//   purchaseUnit: "",
//   baseUnit: "",
//   conversionFactor: "",
//   quantity: "",
//   lastPurchasedDate: ""
// });
//     setShowForm(false);
//     setSuccessMsg(" New raw material added!");
//     fetchGroceries();
//   };

//   const exportExcel = async () => {
//     const res  = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/groceries/export`);
//     const blob = await res.blob();
//     const url  = window.URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href = url; a.download = "Raw_Material_Stock.xlsx"; a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleImport = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     const res  = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/groceries/import`, { method: "POST", body: formData });
//     const data = await res.json();
//     setSuccessMsg(` ${data.msg}`);
//     fetchGroceries();
//   };

//   const startEdit = (index) => {
//     if (showDeleteMode) return;
//     const updated = [...groceries];
//     updated[index].isEditing = true;
//     setGroceries(updated);
//   };

//   const changeEditedQty = (index, value) => {
//     const updated = [...groceries];
//     updated[index].editedQuantity = Number(value);
//     setGroceries(updated);
//   };

//   const saveEditedQty = (index) => {
//     const updated = [...groceries];
//     updated[index].quantity = updated[index].editedQuantity;
//     updated[index].isEditing = false;
//     updated[index].modified  = true;
//     setGroceries(updated);
//   };

//   const saveStock = async () => {
//     const modifiedItems = groceries.filter(g => g.modified);
//     if (modifiedItems.length === 0) { setSuccessMsg(" No changes made"); return; }
//     for (let item of modifiedItems) {
//       await fetch(
//         `${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ quantity: item.quantity })
//       });
//     }
//     setSuccessMsg(" Stock updated successfully!");
//     fetchGroceries();
//   };

//   const toggleSelect = (index) => {
//     const updated = [...groceries];
//     updated[index].selected = !updated[index].selected;
//     setGroceries(updated);
//   };

//   const deleteSelected = async () => {
//     const selectedItems = groceries.filter(g => g.selected);
//     if (selectedItems.length === 0) { setSuccessMsg(" No items selected"); return; }
//     for (let item of selectedItems) {
//       await fetch(
//         `${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, { method: "DELETE" });
//     }
//     setShowDeleteMode(false);
//     setSuccessMsg(` ${selectedItems.length} item(s) deleted!`);
//     fetchGroceries();
//   };

//   const isViewMode   = mode === "view";
//   const isUpdateMode = mode === "update";

//   return (
//     <div className="stock-page-wrap">

//       <Sidebar />

//       <div className="stock-main">

//         <div className="stock-topbar">
//           <div className="stock-topbar-left">
//             <div className="stock-topbar-title">
//               {isViewMode ? "View Stock" : "Update Stock"}
//             </div>
//             <div className="stock-topbar-sub">
//               {isViewMode ? "Raw Materials Overview" : "Manage & Update Stock"}
//             </div>
//           </div>

//           <div className="stock-topbar-actions">
//             <div className="stock-search-wrap">
//               <svg className="stock-search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
//                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//                 strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search for a stock..."
//                 value={searchTerm}
//                 onChange={e =>  {
//                 const value = e.target.value;
//                 setSearchTerm(value);
//                 if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                 const matches = groceries.filter(item =>
//                   item.name.toLowerCase().includes(value.toLowerCase())
//                 );
//                 setSuggestions(matches.slice(0, 6));
//                 setShowSuggestions(true);
//               }}
//                 className="stock-search-input"
//               />
          
//               {searchTerm && (
//                 <button className="stock-search-clear" onClick={() => {setSearchTerm(""); setSuggestions([]); setShowSuggestions(false);}}>✕</button>
//               )}

//             {showSuggestions && suggestions.length > 0 && (
//               <div className="search-dropdown">
//                 {suggestions.map(item => (
//                   <div key={item._id} className="search-dropdown-item"
//                     onClick={() => { setSearchTerm(item.name); setShowSuggestions(false); }}>
//                     {item.name}
//                   </div>
//                 ))}
//               </div>
//             )}

//             </div>

//             {isUpdateMode && !showDeleteMode && (
//               <>
//               <button
//                 className="stock-btn-primary"
//                 onClick={() =>{
//                   if(showUnitForm || showUnitsList){
//     setSuccessMsg("Please close the currently open form");
//     return;
//   }
//                setShowForm(!showForm)}}
//               >
//                 {showForm ? "✕ Close" : "+ Add New Stock"}
//               </button>

//               <button
//       className="stock-btn-blue"
//       onClick={() =>{
//           if(showForm || showUnitsList){
//     setSuccessMsg("Please close the currently open form ");
//     return;
//   }

//          setShowUnitForm(!showUnitForm)}}
//     >
//       {showUnitForm ? "✕ Close" : "+ Add Unit"}
//     </button>
      
//             <button
//   className="stock-btn-gray"
//   onClick={() => {
//       if(showForm || showUnitForm){
//     setSuccessMsg("Please close the currently open form");
//     return;
//   }
//     setShowUnitsList(!showUnitsList)}}
// >
//   {showUnitsList ? "✕ Hide Units" : " View Units"}
// </button>

//               </>
//             )}
 
//             {isViewMode && (
//               <>
//                 <button className="stock-btn-green" onClick={exportExcel}>
//                   ⬇ Export Excel
//                 </button>
//                 <label className="stock-btn-blue stock-import-label">
//                   ⬆ Import Excel
//                   <input type="file" accept=".xlsx" onChange={handleImport} hidden />
//                 </label>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="stock-content">

//           {isViewMode && (
//             <div className="stock-stat-row">
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">Total Materials</div>
//                   <div className="st-value">{totalItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">In Stock</div>
//                   <div className="st-value">{healthyItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">Low Stock</div>
//                   <div className="st-value">{lowStockItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">Out of Stock</div>
//                   <div className="st-value">{outOfStock}</div>
//                 </div>
//               </div>
//             </div>
//           )}

//               {isUpdateMode && showUnitForm && !showDeleteMode && (

//   <div className="stock-add-form">

//     <div className="stock-form-title">
//       Add Units For Stock
//     </div>
  
//     <div className="stock-info-box">
// Define how a product's stock is <b>purchased</b> and <b>used</b>.

// </div>


//     <div className="stock-form-grid">

//       <div className="stock-form-field">
//         <label>Purchased Unit of Stock</label>
//         <input
//           placeholder="e.g. Litre"
//           value={newUnit.purchaseUnit}
//           onChange={e =>
//             setNewUnit({ ...newUnit, purchaseUnit: e.target.value })
//           }
//         />
//       </div>

//       <div className="stock-form-field">
//         <label>Unit for Reducing Stock</label>
//         <input
//           placeholder="e.g. Millilitre"
//           value={newUnit.reduceUnit}
//           onChange={e =>
//             setNewUnit({ ...newUnit, reduceUnit: e.target.value })
//           }
//         />
//       </div>

//       <div className="stock-form-field">
//         <label> Unit for Displaying Stock</label>
//         <input
//           placeholder="e.g. Litre or Millilitre"
//           value={newUnit.displayUnit}
//           onChange={e =>
//             setNewUnit({ ...newUnit, displayUnit: e.target.value })
//           }
//         />
//       </div>

//       <div className="stock-form-field">
//         <label>Conversion Factor</label>
//         <input
//           type="number"
//           placeholder="e.g.1000(1000 Gram=1 Kilogram)"
//           value={newUnit.conversionFactor}
//           onChange={e =>
//             setNewUnit({
//               ...newUnit,
//               conversionFactor: Number(e.target.value)
//             })
//           }
//         />
//       </div>

//       <div className="stock-form-field stock-form-submit">
//         <button
//           className="stock-btn-primary"
//           onClick={addUnit}
//         > Add Unit </button>
//       </div>

//     </div>
//     <div className="stock-help-box">
// Conversion Factor - Defines how many reduce units exist in one purchase unit. <br /> 
// Example: <br />
//         &nbsp; 1. A Kilogram has <b>1000 </b>Grams. <br />
//         &nbsp; 2. A Packet may have <b>10</b> or <b>20</b> Pieces.
// </div>
//   </div>
// )}

//          {showUnitsList && units.length > 0 && (

// <div className="unit-table-card">

// <div className="unit-table-title">
// Available Units
// </div>
// <p>You can see the units you have defined in the Add Units form here.</p> <br />
// <div className="unit-table-head">
// <span>#</span>
// <span>Purchase Unit</span>
// <span>Reduce Unit</span>
// <span>Display Unit</span>
// <span>Conversion</span>
// </div>

// <div className="unit-table-body">

// {units.map((u,i)=>(
// <div key={u._id} className="unit-table-row">

// <span>{i+1}</span>

// <span>{u.purchaseUnit}</span>

// <span>{u.reduceUnit}</span>

// <span>{u.displayUnit}</span>

// <span>1 {u.purchaseUnit} = {u.conversionFactor} {u.reduceUnit}</span>

// </div>
// ))}

// </div>

// </div>

// )}
          
//           {isUpdateMode && showForm && !showDeleteMode && (
            
//             <div className="stock-add-form">
              
//               <div className="stock-form-title">Add a New Stock</div>

//                 <p className="stock-info-box">
// Add a Stock used in your cafe. Select the unit system that defines how a stock is purchased and consumed. The quantity entered here will 
// be converted based on the unit settings.
// </p>

//               <div className="stock-form-grid">
//                 <div className="stock-form-field">
//                   <label>Item Name</label>
//                   <input
//                     placeholder="e.g. Milk"
//                     value={newGrocery.name}
//                     onChange={e => setNewGrocery({ ...newGrocery, name: e.target.value })}
//                   />
//                 </div>
//                 <div className="stock-form-field">
//                   <label>Unit</label>

//                 <select
// value={newGrocery.unitId}
// onChange={e=>setNewGrocery({...newGrocery,unitId:e.target.value})}
// >

// <option value="">Select Unit</option>

// {units.map(u=>(
// <option key={u._id} value={u._id}>
// {u.purchaseUnit}
// </option>
// ))}

// </select>

//                 </div>

//                 <div className="stock-form-field">
//                   <label>Quantity</label>
//                   <div className="qty-with-unit">

//                   <input
//                     type="number"
//                     placeholder="e.g. 10"
//                     value={newGrocery.quantity}
//                     onChange={e => setNewGrocery({ ...newGrocery, quantity: e.target.value })}
//                   />
//                   {selectedUnit && (
//       <span className="qty-unit-label">
//         {selectedUnit.purchaseUnit}
//       </span>
//     )} </div>
//                 </div>
//                 <div className="stock-form-field">
//                   <label>Last Purchased Date</label>
//                   <input
//                     type="date"
//                     value={newGrocery.lastPurchasedDate}
//                     onChange={e => setNewGrocery({ ...newGrocery, lastPurchasedDate: e.target.value })}
//                   />
//                 </div>
//                 <div className="stock-form-field stock-form-submit">
//                   <button className="stock-btn-primary" onClick={addGrocery}>
//                     Add Item
//                   </button>
//                 </div>
//               </div>

//             </div>
//           )}

//           <div className="stock-table-card">

//             <div className="stock-table-toprow">

//   <div className="stock-table-header">

//     <div className="stock-table-heading">
//       {isViewMode ? "View Available Stock Quantities" : "Update Stock Quantities"}
//       <span className="stock-table-count">{filteredGroceries.length} items</span>
//     </div>

//     {isUpdateMode && (
//       <div className="stock-table-actions">
//         {!showDeleteMode ? (
//           <>
//             <button className="stock-btn-red" onClick={() => setShowDeleteMode(true)}>
//               🗑 Delete Items
//             </button>

//             <button className="stock-btn-save" onClick={saveStock}>
//               Save Changes
//             </button>
//           </>
//         ) : (
//           <>
//             <button className="stock-btn-red" onClick={deleteSelected}>
//               Confirm Delete
//             </button>

//             <button
//               className="stock-btn-gray"
//               onClick={() => {
//                 setShowDeleteMode(false);
//                 setGroceries(groceries.map(g => ({ ...g, selected: false })));
//               }}
//             >
//               Cancel
//             </button>
//           </>
//         )}
//       </div>
//     )}

//   </div>

//   <div className="stock-info-box">
//     {isViewMode
//       ? "You can see the stocks added through Add New Stock form here"
//       : "You can see, edit and delete the quantity of stock that are added through Add New Stock form here."
//     }
//   </div>

// </div>

//              <div className="stock-table-scroll"> 
//             <div className={`stock-col-head ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""}`}>
//               {showDeleteMode && <span></span>}
//               <span>#</span>
//               <span>Item Name</span>
//               <span>Unit</span>
//               <span>Quantity</span>
//               <span>Status</span>
//               <span>Last Purchased</span>
//               <span>Last Updated</span>
//             </div>

//             <div className="stock-table-body">
//               {filteredGroceries.length === 0 ? (
//                 <div className="stock-empty">No raw materials found </div>
//               ) : (
//                 filteredGroceries.map((g, i) => {
//                   const status = getStockStatus(g.quantity);
//                   return (
//                     <div
//                       key={g._id}
//                       className={`stock-table-row ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""} ${g.selected ? "row-selected" : ""} ${g.modified ? "row-modified" : ""} ${g.quantity > 0 && g.quantity <= 5 ? "row-low-stock" : ""}`}
//                     >

//                       {showDeleteMode && (
//                         <span className="stock-check-cell">
//                           <input
//                             type="checkbox"
//                             checked={g.selected}
//                             onChange={() => toggleSelect(groceries.indexOf(g))}
//                             className="stock-checkbox"
//                           />
//                         </span>
//                       )}

//                       <span className="stock-row-num">{i + 1}</span>

//                       <span className="stock-row-name">{g.name}</span>

//                       <span className="stock-row-unit">{g.purchaseUnit}</span>

//                       <span className="stock-qty-cell">
//                         {isUpdateMode && !showDeleteMode ? (
//                           g.isEditing ? (
//                             <div className="stock-qty-edit">
//                               <input
//                                 type="number"
//                                 value={g.editedQuantity}
//                                 onChange={e => changeEditedQty(groceries.indexOf(g), e.target.value)}
//                                 className="stock-qty-input"
//                                 autoFocus
//                               />
//                               <button
//                                 className="stock-qty-save-btn"
//                                 onClick={() => saveEditedQty(groceries.indexOf(g))}
//                                 title="Save"
//                               >✓ </button>
//                             </div>
//                           ) : (
//                             <div className="stock-qty-view">
//                               <span className={`stock-qty-num ${g.modified ? "qty-modified" : ""}`}>
//                                 {g.displayQty ?? g.quantity ?? 0}
//                                  <small className="qty-unit">{g.displayUnit}</small>
//                               </span>
//                               <button
//                                 className="stock-qty-edit-btn"
//                                 onClick={() => startEdit(groceries.indexOf(g))}
//                                 title="Edit quantity"
//                               >✎</button>
//                             </div>
//                           )
//                         ) : (
//                           <span className="stock-qty-plain">{g.displayQty?? g.quantity ?? 0}
//                            <small className="qty-unit">{g.displayUnit}</small>
//                           </span>
//                         )}
//                       </span>

//                       <span>
//                         <span className={`stock-status-badge ${status.cls}`}>{status.label}</span>
//                       </span>

//                       <span className="stock-row-date">
//                         {g.lastPurchasedDate
//                           ? new Date(g.lastPurchasedDate).toLocaleDateString("en-GB")
//                           : "—"}
//                       </span>

//                       <span className="stock-row-date">
//                         {g.lastStockUpdatedDate
//                           ? new Date(g.lastStockUpdatedDate).toLocaleDateString("en-GB")
//                           : "—"}
//                       </span>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//           </div>

//         </div>
//       </div>

//       {successMsg && (
//         <div className="stock-toast">
//           <span>{successMsg}</span>
//           <button onClick={() => setSuccessMsg("")}>✕</button>
//         </div>
//       )}

//     </div>
//   );
// }

// export default StockPage;


// last used


// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import Sidebar from "./SideBar";
// import { useLocalizedField } from "../hooks/useLocalizedField";

// import "./sidebar.css";
// import "./stock.css";

// function StockPage({ mode }) {
//   const { t } = useTranslation();

//   const localize = useLocalizedField();

//   const [groceries, setGroceries]       = useState([]);
//   const [searchTerm, setSearchTerm]     = useState("");
//   // const [showForm, setShowForm]         = useState(false);
//   const [showDeleteMode, setShowDeleteMode] = useState(false);
//   const [successMsg, setSuccessMsg]     = useState("");
//   const [suggestions, setSuggestions]   = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [newGrocery, setNewGrocery] = useState({
//     name: "", unitId: "", quantity: "", lastPurchasedDate: ""
//   });

//   const [units, setUnits] = useState([]);
//   const [newUnit, setNewUnit] = useState({
//     name: "", purchaseUnit: "", reduceUnit: "", displayUnit: "", conversionFactor: ""
//   });

//   // const [showUnitForm, setShowUnitForm]   = useState(false);
//   // const [showUnitsList, setShowUnitsList] = useState(false);
//   const selectedUnit = units.find(u => u._id === newGrocery.unitId);
//   const [activeTab, setActiveTab] = useState(null); 


//   const fetchGroceries = () => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
//       .then(res => res.json())
//       .then(data =>
//         setGroceries(data.map(item => ({
//           ...item,
//           selected: false,
//           isEditing: false,
//           editedQuantity: item.displayQty ?? item.quantity,
//           modified: false
//         })))
//       );
//   };

//   useEffect(() => { fetchGroceries(); }, []);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/units`)
//       .then(r => r.json())
//       .then(setUnits);
//   }, []);

//   useEffect(() => {
//     if (!successMsg) return;
//     const timer = setTimeout(() => setSuccessMsg(""), 3000);
//     return () => clearTimeout(timer);
//   }, [successMsg]);

//   const filteredGroceries = groceries.filter(g =>
//     localize(g.name).toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalItems    = groceries.length;
//   const lowStockItems = groceries.filter(g => (g.displayQty ?? g.quantity) <= 5 && (g.displayQty ?? g.quantity) > 0).length;
//   const outOfStock    = groceries.filter(g => (g.displayQty ?? g.quantity) === 0).length;
//   const healthyItems  = groceries.filter(g => (g.displayQty ?? g.quantity) > 5).length;

//   const getStockStatus = (qty) => {
//     if (qty === 0) return { label: t("common.outOfStock"), cls: "badge-out" };
//     if (qty <= 5)  return { label: t("common.lowStock"),    cls: "badge-low" };
//     return              { label: t("stock.inStock"),       cls: "badge-ok"  };
//   };

//   const addUnit = async () => {
//     if (!newUnit.purchaseUnit || !newUnit.reduceUnit || !newUnit.displayUnit) {
//       setSuccessMsg(t("stock.fillAllUnitFields")); return;
//     }
//     await fetch(`${import.meta.env.VITE_API_URL}/api/units`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newUnit)
//     });
//     setSuccessMsg(t("stock.unitAdded"));
//     setNewUnit({ purchaseUnit: "", reduceUnit: "", displayUnit: "", conversionFactor: "" });
//     fetch(`${import.meta.env.VITE_API_URL}/api/units`).then(r => r.json()).then(setUnits);
//     // setShowUnitForm(false);
//   };

//   const addGrocery = async () => {
//     if (!newGrocery.name || !newGrocery.unitId || !newGrocery.quantity || !newGrocery.lastPurchasedDate) {
//       setSuccessMsg(t("stock.fillAllFields")); return;
//     }
//     await fetch(`${import.meta.env.VITE_API_URL}/api/groceries`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newGrocery)
//     });
//     setNewGrocery({ name: "", purchaseUnit: "", baseUnit: "", conversionFactor: "", quantity: "", lastPurchasedDate: "" });
//     // setShowForm(false);
//     setSuccessMsg(t("stock.rawMaterialAdded"));
//     fetchGroceries();
//   };

//   const exportExcel = async () => {
//     const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/export`);
//     const blob = await res.blob();
//     const url  = window.URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href = url; a.download = "Raw_Material_Stock.xlsx"; a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleImport = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/import`, { method: "POST", body: formData });
//     const data = await res.json();
//     setSuccessMsg(data.msg);
//     fetchGroceries();
//   };

//   const startEdit = (index) => {
//     if (showDeleteMode) return;
//     const updated = [...groceries];
//     updated[index].isEditing = true;
//     setGroceries(updated);
//   };

//   const changeEditedQty = (index, value) => {
//     const updated = [...groceries];
//     updated[index].editedQuantity = Number(value);
//     setGroceries(updated);
//   };

//   const saveEditedQty = (index) => {
//     const updated = [...groceries];
//     updated[index].quantity  = updated[index].editedQuantity;
//     updated[index].isEditing = false;
//     updated[index].modified  = true;
//     setGroceries(updated);
//   };

//   const saveStock = async () => {
//     const modifiedItems = groceries.filter(g => g.modified);
//     if (modifiedItems.length === 0) { setSuccessMsg(t("stock.noChanges")); return; }
//     for (let item of modifiedItems) {
//       await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ quantity: item.quantity })
//       });
//     }
//     setSuccessMsg(t("stock.stockUpdated"));
//     fetchGroceries();
//   };

//   const toggleSelect = (index) => {
//     const updated = [...groceries];
//     updated[index].selected = !updated[index].selected;
//     setGroceries(updated);
//   };

//   const deleteSelected = async () => {
//     const selectedItems = groceries.filter(g => g.selected);
//     if (selectedItems.length === 0) { setSuccessMsg(t("stock.noItemsSelected")); return; }
//     for (let item of selectedItems) {
//       await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, { method: "DELETE" });
//     }
//     setShowDeleteMode(false);
//     setSuccessMsg(`${selectedItems.length} ${t("stock.itemsDeleted")}`);
//     fetchGroceries();
//   };

//   const isViewMode   = mode === "view";
//   const isUpdateMode = mode === "update";

//   return (
//     <div className="stock-page-wrap">

//       <Sidebar />

//       <div className="stock-main">

//         <div className="stock-topbar">
//           <div className="stock-topbar-left">
//             <div className="stock-topbar-title">
//               {isViewMode ? t("stock.viewTitle") : t("stock.updateTitle")}
//             </div>
//             <div className="stock-topbar-sub">
//               {isViewMode ? t("stock.viewSubtitle") : t("stock.updateSubtitle")}
//             </div>
//           </div>

//           <div className="stock-topbar-actions">
//             <div className="stock-search-wrap">
//               <svg className="stock-search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
//                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//                 strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//               </svg>
//               <input
//                 type="text"
//                 placeholder={t("stock.searchPlaceholder")}
//                 value={searchTerm}
//                 onChange={e => {
//                   const value = e.target.value;
//                   setSearchTerm(value);
//                   if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                   const matches = groceries.filter(item =>
//                     item.name.toLowerCase().includes(value.toLowerCase())
//                   );
//                   setSuggestions(matches.slice(0, 6));
//                   setShowSuggestions(true);
//                 }}
//                 className="stock-search-input"
//               />
//               {searchTerm && (
//                 <button className="stock-search-clear" onClick={() => { setSearchTerm(""); setSuggestions([]); setShowSuggestions(false); }}>✕</button>
//               )}
//               {showSuggestions && suggestions.length > 0 && (
//                 <div className="search-dropdown">
//                   {suggestions.map(item => (
//                     <div key={item._id} className="search-dropdown-item"
//                       onClick={() => { setSearchTerm(localize(item.name)); setShowSuggestions(false); }}>
//                        {localize(item.name)}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {isViewMode && (
//               <>
//                 <button className="stock-btn-green" onClick={exportExcel}>
//                   ⬇ {t("stock.exportExcel")}
//                 </button>
//                 <label className="stock-btn-blue stock-import-label">
//                   ⬆ {t("stock.importExcel")}
//                   <input type="file" accept=".xlsx" onChange={handleImport} hidden />
//                 </label>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="stock-content">

//           {isViewMode && (
//             <div className="stock-stat-row">
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">{t("stock.totalMaterials")}</div>
//                   <div className="st-value">{totalItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">{t("stock.inStock")}</div>
//                   <div className="st-value">{healthyItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">{t("common.lowStock")}</div>
//                   <div className="st-value">{lowStockItems}</div>
//                 </div>
//               </div>
//               <div className="stock-stat-card">
//                 <div className="st-body">
//                   <div className="st-label">{t("common.outOfStock")}</div>
//                   <div className="st-value">{outOfStock}</div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//          {isUpdateMode && (
//   <div className="stock-tabs">

//     <button
//       className={`stock-tab ${activeTab === "stock" ? "active" : ""}`}
//       onClick={() => setActiveTab(activeTab === "stock" ? null :"stock")}
//     >
//       + {t("stock.addNewStock")}
//     </button>

//     <button
//       className={`stock-tab ${activeTab === "addUnit" ? "active" : ""}`}
//       onClick={() => setActiveTab(activeTab === "addUnit" ? null :"addUnit")}
//     >
//       + {t("stock.addUnit")}
//     </button>

//     <button
//       className={`stock-tab ${activeTab === "units" ? "active" : ""}`}
//       onClick={() => setActiveTab(activeTab === "units" ? null :"units")}
//     >
//       {t("stock.viewUnits")}
//     </button>

//   </div>
// )}
 

//           {isUpdateMode && activeTab === "addUnit" && !showDeleteMode && (
//             <div className="stock-add-form">
//               <div className="stock-form-title">{t("stock.addUnitTitle")}</div>
//               <div className="stock-info-box">{t("stock.addUnitInfo")}</div>
//               <div className="stock-form-grid">
//                 <div className="stock-form-field">
//                   <label>{t("stock.purchaseUnit")}</label>
//                   <input placeholder={t("stock.purchaseUnitPlaceholder")}
//                     value={newUnit.purchaseUnit}
//                     onChange={e => setNewUnit({ ...newUnit, purchaseUnit: e.target.value })} />
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.reduceUnit")}</label>
//                   <input placeholder={t("stock.reduceUnitPlaceholder")}
//                     value={newUnit.reduceUnit}
//                     onChange={e => setNewUnit({ ...newUnit, reduceUnit: e.target.value })} />
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.displayUnit")}</label>
//                   <input placeholder={t("stock.displayUnitPlaceholder")}
//                     value={newUnit.displayUnit}
//                     onChange={e => setNewUnit({ ...newUnit, displayUnit: e.target.value })} />
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.conversionFactor")}</label>
//                   <input type="number" placeholder={t("stock.conversionFactorPlaceholder")}
//                     value={newUnit.conversionFactor}
//                     onChange={e => setNewUnit({ ...newUnit, conversionFactor: Number(e.target.value) })} />
//                 </div>
//                 <div className="stock-form-field stock-form-submit">
//                   <button className="stock-btn-primary" onClick={addUnit}>{t("stock.addUnit")}</button>
//                 </div>
//               </div>
//               <div className="stock-help-box" dangerouslySetInnerHTML={{ __html: t("stock.conversionHelp") }}>
//                           </div>
//             </div>
//           )}

//           {activeTab === "units" && units.length > 0 && (
//             <div className="unit-table-card">
//               <div className="unit-table-title">{t("stock.availableUnits")}</div>
//               <p>{t("stock.availableUnitsDesc")}</p><br />
//               <div className="unit-table-head">
//                 <span>#</span>
//                 <span>{t("stock.purchaseUnit")}</span>
//                 <span>{t("stock.reduceUnit")}</span>
//                 <span>{t("stock.displayUnit")}</span>
//                 <span>{t("stock.conversion")}</span>
//               </div>
//               <div className="unit-table-body">
//                 {units.map((u, i) => (
//                   <div key={u._id} className="unit-table-row">
//                     <span>{i + 1}</span>
//                     <span>{u.purchaseUnit}</span>
//                     <span>{u.reduceUnit}</span>
//                     <span>{u.displayUnit}</span>
//                     <span>1 {u.purchaseUnit} = {u.conversionFactor} {u.reduceUnit}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {isUpdateMode && activeTab === "stock"  && !showDeleteMode && (
//             <div className="stock-add-form">
//               <div className="stock-form-title">{t("stock.addNewStockTitle")}</div>
//               <p className="stock-info-box">{t("stock.addNewStockInfo")}</p>
//               <div className="stock-form-grid">
//                 <div className="stock-form-field">
//                   <label>{t("stock.itemName")}</label>
//                   <input placeholder={t("stock.itemNamePlaceholder")}
//                     value={newGrocery.name}
//                     onChange={e => setNewGrocery({ ...newGrocery, name: e.target.value })} />
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.unit")}</label>
//                   <select value={newGrocery.unitId}
//                     onChange={e => setNewGrocery({ ...newGrocery, unitId: e.target.value })}>
//                     <option value="">{t("stock.selectUnit")}</option>
//                     {units.map(u => (
//                       <option key={u._id} value={u._id}>{u.purchaseUnit}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.quantity")}</label>
//                   <div className="qty-with-unit">
//                     <input type="number" placeholder={t("stock.quantityPlaceholder")}
//                       value={newGrocery.quantity}
//                       onChange={e => setNewGrocery({ ...newGrocery, quantity: e.target.value })} />
//                     {selectedUnit && <span className="qty-unit-label">{selectedUnit.purchaseUnit}</span>}
//                   </div>
//                 </div>
//                 <div className="stock-form-field">
//                   <label>{t("stock.lastPurchasedDate")}</label>
//                   <input type="date" value={newGrocery.lastPurchasedDate}
//                     onChange={e => setNewGrocery({ ...newGrocery, lastPurchasedDate: e.target.value })} />
//                 </div>
//                 <div className="stock-form-field stock-form-submit">
//                   <button className="stock-btn-primary" onClick={addGrocery}>{t("stock.addItem")}</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="stock-table-card">
//             <div className="stock-table-toprow">
//               <div className="stock-table-header">
//                 <div className="stock-table-heading">
//                   {isViewMode ? t("stock.viewTableTitle") : t("stock.updateTableTitle")}
//                   <span className="stock-table-count">{filteredGroceries.length} {t("stock.items")}</span>
//                 </div>
//                 {isUpdateMode && (
//                   <div className="stock-table-actions">
//                     {!showDeleteMode ? (
//                       <>
//                         <button className="stock-btn-red" onClick={() => setShowDeleteMode(true)}>
//                           🗑 {t("stock.deleteItems")}
//                         </button>
//                         <button className="stock-btn-save" onClick={saveStock}>
//                           {t("stock.saveChanges")}
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button className="stock-btn-red" onClick={deleteSelected}>{t("stock.confirmDelete")}</button>
//                         <button className="stock-btn-gray" onClick={() => {
//                           setShowDeleteMode(false);
//                           setGroceries(groceries.map(g => ({ ...g, selected: false })));
//                         }}>{t("common.cancel")}</button>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="stock-info-box">
//                 {isViewMode ? t("stock.viewTableInfo") : t("stock.updateTableInfo")}
//               </div>
//             </div>

//             <div className="stock-table-scroll">
//               <div className={`stock-col-head ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""}`}>
//                 {showDeleteMode && <span></span>}
//                 <span>#</span>
//                 <span>{t("stock.col.itemName")}</span>
//                 <span>{t("stock.col.unit")}</span>
//                 <span>{t("stock.col.quantity")}</span>
//                 <span>{t("stock.col.status")}</span>
//                 <span>{t("stock.col.lastPurchased")}</span>
//                 <span>{t("stock.col.lastUpdated")}</span>
//               </div>

//               <div className="stock-table-body">
//                 {filteredGroceries.length === 0 ? (
//                   <div className="stock-empty">{t("stock.noMaterialsFound")}</div>
//                 ) : (
//                   filteredGroceries.map((g, i) => {
//                     const status = getStockStatus(g.quantity);
//                     return (
//                       <div key={g._id}
//                         className={`stock-table-row ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""} ${g.selected ? "row-selected" : ""} ${g.modified ? "row-modified" : ""} ${g.quantity > 0 && g.quantity <= 5 ? "row-low-stock" : ""}`}>

//                         {showDeleteMode && (
//                           <span className="stock-check-cell">
//                             <input type="checkbox" checked={g.selected}
//                               onChange={() => toggleSelect(groceries.indexOf(g))}
//                               className="stock-checkbox" />
//                           </span>
//                         )}

//                         <span className="stock-row-num">{i + 1}</span>
//                         <span className="stock-row-name"> {localize(g.name)}</span>
//                         <span className="stock-row-unit">{g.purchaseUnit}</span>

//                         <span className="stock-qty-cell">
//                           {isUpdateMode && !showDeleteMode ? (
//                             g.isEditing ? (
//                               <div className="stock-qty-edit">
//                                 <input type="number" value={g.editedQuantity}
//                                   onChange={e => changeEditedQty(groceries.indexOf(g), e.target.value)}
//                                   className="stock-qty-input" autoFocus />
//                                 <button className="stock-qty-save-btn"
//                                   onClick={() => saveEditedQty(groceries.indexOf(g))} title={t("common.save")}>✓</button>
//                               </div>
//                             ) : (
//                               <div className="stock-qty-view">
//                                 <span className={`stock-qty-num ${g.modified ? "qty-modified" : ""}`}>
//                                   {g.displayQty ?? g.quantity ?? 0}
//                                   <small className="qty-unit">{g.displayUnit}</small>
//                                 </span>
//                                 <button className="stock-qty-edit-btn"
//                                   onClick={() => startEdit(groceries.indexOf(g))} title={t("stock.editQuantity")}>✎</button>
//                               </div>
//                             )
//                           ) : (
//                             <span className="stock-qty-plain">
//                               {g.displayQty ?? g.quantity ?? 0}
//                               <small className="qty-unit">{g.displayUnit}</small>
//                             </span>
//                           )}
//                         </span>

//                         <span><span className={`stock-status-badge ${status.cls}`}>{status.label}</span></span>

//                         <span className="stock-row-date">
//                           {g.lastPurchasedDate ? new Date(g.lastPurchasedDate).toLocaleDateString("en-GB") : "—"}
//                         </span>
//                         <span className="stock-row-date">
//                           {g.lastStockUpdatedDate ? new Date(g.lastStockUpdatedDate).toLocaleDateString("en-GB") : "—"}
//                         </span>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {successMsg && (
//         <div className="stock-toast">
//           <span>{successMsg}</span>
//           <button onClick={() => setSuccessMsg("")}>✕</button>
//         </div>
//       )}

//     </div>
//   );
// }

// export default StockPage;


import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./SideBar";
import { useLocalizedField } from "../hooks/useLocalizedField";
import "../AdminPages/admin-lang.css";   // ← for lang selector styles

import "./sidebar.css";
import "./stock.css";

function StockPage({ mode }) {
  const { t } = useTranslation();
  const localize = useLocalizedField();

  const [groceries, setGroceries]       = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [suggestions, setSuggestions]   = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [newGrocery, setNewGrocery] = useState({
    name: { en: "", ta: "", hi: "" },   // ← now an object
    unitId: "", quantity: "", lastPurchasedDate: ""
  });

  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState({
    name: "", purchaseUnit: "", reduceUnit: "", displayUnit: "", conversionFactor: ""
  });

  const selectedUnit = units.find(u => u._id === newGrocery.unitId);
  const [activeTab, setActiveTab] = useState(null);

  // ── Which language the admin is typing the grocery name in ──
  const [stockNameLang, setStockNameLang] = useState("en");

  const fetchGroceries = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
      .then(res => res.json())
      .then(data =>
        setGroceries(data.map(item => ({
          ...item,
          selected: false,
          isEditing: false,
          editedQuantity: item.displayQty ?? item.quantity,
          modified: false
        })))
      );
  };

  useEffect(() => { fetchGroceries(); }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/units`)
      .then(r => r.json())
      .then(setUnits);
  }, []);

  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const filteredGroceries = groceries.filter(g =>
    localize(g.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems    = groceries.length;
  const lowStockItems = groceries.filter(g => (g.displayQty ?? g.quantity) <= 5 && (g.displayQty ?? g.quantity) > 0).length;
  const outOfStock    = groceries.filter(g => (g.displayQty ?? g.quantity) === 0).length;
  const healthyItems  = groceries.filter(g => (g.displayQty ?? g.quantity) > 5).length;

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: t("common.outOfStock"), cls: "badge-out" };
    if (qty <= 5)  return { label: t("common.lowStock"),    cls: "badge-low" };
    return              { label: t("stock.inStock"),       cls: "badge-ok"  };
  };

  const addUnit = async () => {
    if (!newUnit.purchaseUnit || !newUnit.reduceUnit || !newUnit.displayUnit) {
      setSuccessMsg(t("stock.fillAllUnitFields")); return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/api/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUnit)
    });
    setSuccessMsg(t("stock.unitAdded"));
    setNewUnit({ purchaseUnit: "", reduceUnit: "", displayUnit: "", conversionFactor: "" });
    fetch(`${import.meta.env.VITE_API_URL}/api/units`).then(r => r.json()).then(setUnits);
  };

  const addGrocery = async () => {
    // Validate: at least one language must have a name
    const nameValue = newGrocery.name[stockNameLang]?.trim();
    if (!nameValue || !newGrocery.unitId || !newGrocery.quantity || !newGrocery.lastPurchasedDate) {
      setSuccessMsg(t("stock.fillAllFields")); return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/api/groceries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ← send name as object + nameLang so backend knows which lang was entered
      body: JSON.stringify({ ...newGrocery, nameLang: stockNameLang })
    });
    setNewGrocery({ name: { en: "", ta: "", hi: "" }, unitId: "", quantity: "", lastPurchasedDate: "" });
    setStockNameLang("en");
    setSuccessMsg(t("stock.rawMaterialAdded"));
    fetchGroceries();
  };

  const exportExcel = async () => {
    const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/export`);
    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "Raw_Material_Stock.xlsx"; a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/import`, { method: "POST", body: formData });
    const data = await res.json();
    setSuccessMsg(data.msg);
    fetchGroceries();
  };

  const startEdit = (index) => {
    if (showDeleteMode) return;
    const updated = [...groceries];
    updated[index].isEditing = true;
    setGroceries(updated);
  };

  const changeEditedQty = (index, value) => {
    const updated = [...groceries];
    updated[index].editedQuantity = Number(value);
    setGroceries(updated);
  };

  const saveEditedQty = (index) => {
    const updated = [...groceries];
    updated[index].quantity  = updated[index].editedQuantity;
    updated[index].isEditing = false;
    updated[index].modified  = true;
    setGroceries(updated);
  };

  const saveStock = async () => {
    const modifiedItems = groceries.filter(g => g.modified);
    if (modifiedItems.length === 0) { setSuccessMsg(t("stock.noChanges")); return; }
    for (let item of modifiedItems) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity })
      });
    }
    setSuccessMsg(t("stock.stockUpdated"));
    fetchGroceries();
  };

  const toggleSelect = (index) => {
    const updated = [...groceries];
    updated[index].selected = !updated[index].selected;
    setGroceries(updated);
  };

  const deleteSelected = async () => {
    const selectedItems = groceries.filter(g => g.selected);
    if (selectedItems.length === 0) { setSuccessMsg(t("stock.noItemsSelected")); return; }
    for (let item of selectedItems) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, { method: "DELETE" });
    }
    setShowDeleteMode(false);
    setSuccessMsg(`${selectedItems.length} ${t("stock.itemsDeleted")}`);
    fetchGroceries();
  };

  // Helper: update the name object for a given language
  const handleNameChange = (lang, value) => {
    setNewGrocery(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value }
    }));
  };

  const isViewMode   = mode === "view";
  const isUpdateMode = mode === "update";

  return (
    <div className="stock-page-wrap">

      <Sidebar />

      <div className="stock-main">

        <div className="stock-topbar">
          <div className="stock-topbar-left">
            <div className="stock-topbar-title">
              {isViewMode ? t("stock.viewTitle") : t("stock.updateTitle")}
            </div>
            <div className="stock-topbar-sub">
              {isViewMode ? t("stock.viewSubtitle") : t("stock.updateSubtitle")}
            </div>
          </div>

          <div className="stock-topbar-actions">
            <div className="stock-search-wrap">
              <svg className="stock-search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder={t("stock.searchPlaceholder")}
                value={searchTerm}
                onChange={e => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
                  // ── FIX: use localize() for multilingual search ──
                  const matches = groceries.filter(item =>
                    localize(item.name).toLowerCase().includes(value.toLowerCase())
                  );
                  setSuggestions(matches.slice(0, 6));
                  setShowSuggestions(true);
                }}
                className="stock-search-input"
              />
              {searchTerm && (
                <button className="stock-search-clear" onClick={() => { setSearchTerm(""); setSuggestions([]); setShowSuggestions(false); }}>✕</button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-dropdown">
                  {suggestions.map(item => (
                    <div key={item._id} className="search-dropdown-item"
                      onClick={() => { setSearchTerm(localize(item.name)); setShowSuggestions(false); }}>
                      {localize(item.name)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isViewMode && (
              <>
                <button className="stock-btn-green" onClick={exportExcel}>
                  ⬇ {t("stock.exportExcel")}
                </button>
                <label className="stock-btn-blue stock-import-label">
                  ⬆ {t("stock.importExcel")}
                  <input type="file" accept=".xlsx" onChange={handleImport} hidden />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="stock-content">

          {isViewMode && (
            <div className="stock-stat-row">
              <div className="stock-stat-card"><div className="st-body"><div className="st-label">{t("stock.totalMaterials")}</div><div className="st-value">{totalItems}</div></div></div>
              <div className="stock-stat-card"><div className="st-body"><div className="st-label">{t("stock.inStock")}</div><div className="st-value">{healthyItems}</div></div></div>
              <div className="stock-stat-card"><div className="st-body"><div className="st-label">{t("common.lowStock")}</div><div className="st-value">{lowStockItems}</div></div></div>
              <div className="stock-stat-card"><div className="st-body"><div className="st-label">{t("common.outOfStock")}</div><div className="st-value">{outOfStock}</div></div></div>
            </div>
          )}

          {isUpdateMode && (
            <div className="stock-tabs">
              <button className={`stock-tab ${activeTab === "stock"   ? "active" : ""}`} onClick={() => setActiveTab(activeTab === "stock"   ? null : "stock")}>+ {t("stock.addNewStock")}</button>
              <button className={`stock-tab ${activeTab === "addUnit" ? "active" : ""}`} onClick={() => setActiveTab(activeTab === "addUnit" ? null : "addUnit")}>+ {t("stock.addUnit")}</button>
              <button className={`stock-tab ${activeTab === "units"   ? "active" : ""}`} onClick={() => setActiveTab(activeTab === "units"   ? null : "units")}>{t("stock.viewUnits")}</button>
            </div>
          )}

          {isUpdateMode && activeTab === "addUnit" && !showDeleteMode && (
            <div className="stock-add-form">
              <div className="stock-form-title">{t("stock.addUnitTitle")}</div>
              <div className="stock-info-box">{t("stock.addUnitInfo")}</div>
              <div className="stock-form-grid">
                <div className="stock-form-field">
                  <label>{t("stock.purchaseUnit")}</label>
                  <input placeholder={t("stock.purchaseUnitPlaceholder")} value={newUnit.purchaseUnit} onChange={e => setNewUnit({ ...newUnit, purchaseUnit: e.target.value })} />
                </div>
                <div className="stock-form-field">
                  <label>{t("stock.reduceUnit")}</label>
                  <input placeholder={t("stock.reduceUnitPlaceholder")} value={newUnit.reduceUnit} onChange={e => setNewUnit({ ...newUnit, reduceUnit: e.target.value })} />
                </div>
                <div className="stock-form-field">
                  <label>{t("stock.displayUnit")}</label>
                  <input placeholder={t("stock.displayUnitPlaceholder")} value={newUnit.displayUnit} onChange={e => setNewUnit({ ...newUnit, displayUnit: e.target.value })} />
                </div>
                <div className="stock-form-field">
                  <label>{t("stock.conversionFactor")}</label>
                  <input type="number" placeholder={t("stock.conversionFactorPlaceholder")} value={newUnit.conversionFactor} onChange={e => setNewUnit({ ...newUnit, conversionFactor: Number(e.target.value) })} />
                </div>
                <div className="stock-form-field stock-form-submit">
                  <button className="stock-btn-primary" onClick={addUnit}>{t("stock.addUnit")}</button>
                </div>
              </div>
              <div className="stock-help-box" dangerouslySetInnerHTML={{ __html: t("stock.conversionHelp") }} />
            </div>
          )}

          {activeTab === "units" && units.length > 0 && (
            <div className="unit-table-card">
              <div className="unit-table-title">{t("stock.availableUnits")}</div>
              <p>{t("stock.availableUnitsDesc")}</p><br />
              <div className="unit-table-head">
                <span>#</span>
                <span>{t("stock.purchaseUnit")}</span>
                <span>{t("stock.reduceUnit")}</span>
                <span>{t("stock.displayUnit")}</span>
                <span>{t("stock.conversion")}</span>
              </div>
              <div className="unit-table-body">
                {units.map((u, i) => (
                  <div key={u._id} className="unit-table-row">
                    <span>{i + 1}</span>
                    <span>{u.purchaseUnit}</span>
                    <span>{u.reduceUnit}</span>
                    <span>{u.displayUnit}</span>
                    <span>1 {u.purchaseUnit} = {u.conversionFactor} {u.reduceUnit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUpdateMode && activeTab === "stock" && !showDeleteMode && (
            <div className="stock-add-form">
              <div className="stock-form-title">{t("stock.addNewStockTitle")}</div>
              <p className="stock-info-box">{t("stock.addNewStockInfo")}</p>
              <div className="stock-form-grid">

                {/* ── Item Name — with language selector ── */}
                <div className="stock-form-field" style={{ gridColumn: "1 / -1" }}>
                  <label>{t("stock.itemName")}</label>
                  <div className="lang-inputs">
                    {/* Language picker */}
                    <div className="lang-selector-row">
                      <span className="lang-selector-label">Type in:</span>
                      {["en", "ta", "hi"].map(l => (
                        <button key={l} type="button"
                          className={`lang-selector-btn${stockNameLang === l ? " active" : ""}`}
                          onClick={() => setStockNameLang(l)}>
                          {l === "en" ? "English" : l === "ta" ? "தமிழ்" : "हिंदी"}
                        </button>
                      ))}
                    </div>
                    {/* Single input that shows the selected language */}
                    <div className="lang-input-row">
                      <input
                        placeholder={
                          stockNameLang === "en" ? "e.g. Milk" :
                          stockNameLang === "ta" ? "எ.கா. பால்" : "जैसे दूध"
                        }
                        value={newGrocery.name[stockNameLang] || ""}
                        onChange={e => handleNameChange(stockNameLang, e.target.value)}
                      />
                    </div>
                    <div className="lang-input-hint">
                      Type in any language — super admin will auto-translate the rest.
                    </div>
                  </div>
                </div>

                <div className="stock-form-field">
                  <label>{t("stock.unit")}</label>
                  <select value={newGrocery.unitId} onChange={e => setNewGrocery({ ...newGrocery, unitId: e.target.value })}>
                    <option value="">{t("stock.selectUnit")}</option>
                    {units.map(u => <option key={u._id} value={u._id}>{u.purchaseUnit}</option>)}
                  </select>
                </div>

                <div className="stock-form-field">
                  <label>{t("stock.quantity")}</label>
                  <div className="qty-with-unit">
                    <input type="number" placeholder={t("stock.quantityPlaceholder")}
                      value={newGrocery.quantity}
                      onChange={e => setNewGrocery({ ...newGrocery, quantity: e.target.value })} />
                    {selectedUnit && <span className="qty-unit-label">{selectedUnit.purchaseUnit}</span>}
                  </div>
                </div>

                <div className="stock-form-field">
                  <label>{t("stock.lastPurchasedDate")}</label>
                  <input type="date" value={newGrocery.lastPurchasedDate}
                    onChange={e => setNewGrocery({ ...newGrocery, lastPurchasedDate: e.target.value })} />
                </div>

                <div className="stock-form-field stock-form-submit">
                  <button className="stock-btn-primary" onClick={addGrocery}>{t("stock.addItem")}</button>
                </div>
              </div>
            </div>
          )}

          <div className="stock-table-card">
            <div className="stock-table-toprow">
              <div className="stock-table-header">
                <div className="stock-table-heading">
                  {isViewMode ? t("stock.viewTableTitle") : t("stock.updateTableTitle")}
                  <span className="stock-table-count">{filteredGroceries.length} {t("stock.items")}</span>
                </div>
                {isUpdateMode && (
                  <div className="stock-table-actions">
                    {!showDeleteMode ? (
                      <>
                        <button className="stock-btn-red" onClick={() => setShowDeleteMode(true)}>🗑 {t("stock.deleteItems")}</button>
                        <button className="stock-btn-save" onClick={saveStock}>{t("stock.saveChanges")}</button>
                      </>
                    ) : (
                      <>
                        <button className="stock-btn-red" onClick={deleteSelected}>{t("stock.confirmDelete")}</button>
                        <button className="stock-btn-gray" onClick={() => { setShowDeleteMode(false); setGroceries(groceries.map(g => ({ ...g, selected: false }))); }}>{t("common.cancel")}</button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="stock-info-box">
                {isViewMode ? t("stock.viewTableInfo") : t("stock.updateTableInfo")}
              </div>
            </div>

            <div className="stock-table-scroll">
              <div className={`stock-col-head ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""}`}>
                {showDeleteMode && <span></span>}
                <span>#</span>
                <span>{t("stock.col.itemName")}</span>
                <span>{t("stock.col.unit")}</span>
                <span>{t("stock.col.quantity")}</span>
                <span>{t("stock.col.status")}</span>
                <span>{t("stock.col.lastPurchased")}</span>
                <span>{t("stock.col.lastUpdated")}</span>
              </div>

              <div className="stock-table-body">
                {filteredGroceries.length === 0 ? (
                  <div className="stock-empty">{t("stock.noMaterialsFound")}</div>
                ) : (
                  filteredGroceries.map((g, i) => {
                    const status = getStockStatus(g.quantity);
                    return (
                      <div key={g._id}
                        className={`stock-table-row ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""} ${g.selected ? "row-selected" : ""} ${g.modified ? "row-modified" : ""} ${g.quantity > 0 && g.quantity <= 5 ? "row-low-stock" : ""}`}>

                        {showDeleteMode && (
                          <span className="stock-check-cell">
                            <input type="checkbox" checked={g.selected}
                              onChange={() => toggleSelect(groceries.indexOf(g))}
                              className="stock-checkbox" />
                          </span>
                        )}

                        <span className="stock-row-num">{i + 1}</span>
                        <span className="stock-row-name">{localize(g.name)}</span>
                        <span className="stock-row-unit">{g.purchaseUnit}</span>

                        <span className="stock-qty-cell">
                          {isUpdateMode && !showDeleteMode ? (
                            g.isEditing ? (
                              <div className="stock-qty-edit">
                                <input type="number" value={g.editedQuantity}
                                  onChange={e => changeEditedQty(groceries.indexOf(g), e.target.value)}
                                  className="stock-qty-input" autoFocus />
                                <button className="stock-qty-save-btn"
                                  onClick={() => saveEditedQty(groceries.indexOf(g))} title={t("common.save")}>✓</button>
                              </div>
                            ) : (
                              <div className="stock-qty-view">
                                <span className={`stock-qty-num ${g.modified ? "qty-modified" : ""}`}>
                                  {g.displayQty ?? g.quantity ?? 0}
                                  <small className="qty-unit">{g.displayUnit}</small>
                                </span>
                                <button className="stock-qty-edit-btn"
                                  onClick={() => startEdit(groceries.indexOf(g))} title={t("stock.editQuantity")}>✎</button>
                              </div>
                            )
                          ) : (
                            <span className="stock-qty-plain">
                              {g.displayQty ?? g.quantity ?? 0}
                              <small className="qty-unit">{g.displayUnit}</small>
                            </span>
                          )}
                        </span>

                        <span><span className={`stock-status-badge ${status.cls}`}>{status.label}</span></span>
                        <span className="stock-row-date">{g.lastPurchasedDate ? new Date(g.lastPurchasedDate).toLocaleDateString("en-GB") : "—"}</span>
                        <span className="stock-row-date">{g.lastStockUpdatedDate ? new Date(g.lastStockUpdatedDate).toLocaleDateString("en-GB") : "—"}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {successMsg && (
        <div className="stock-toast">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")}>✕</button>
        </div>
      )}

    </div>
  );
}

export default StockPage;
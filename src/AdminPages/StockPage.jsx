import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import Sidebar from "./SideBar";
import "./sidebar.css";
import "./stock.css";

function StockPage({ mode }) {
  // const navigate = useNavigate();

  const [groceries, setGroceries]       = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [showForm, setShowForm]         = useState(false);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

   const [newGrocery, setNewGrocery] = useState({
  name: "",
  purchaseUnit: "",
  baseUnit: "",
  conversionFactor: 1,
  quantity: "",
  lastPurchasedDate: ""
});

  const fetchGroceries = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/groceries`)
      .then(res => res.json())
      .then(data =>
        setGroceries(data.map(item => ({
          ...item,
          selected: false,
          isEditing: false,
          editedQuantity: item.displayQty ??item.quantity,
          modified: false
        })))
      );
  };


  useEffect(() => { fetchGroceries(); }, []);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const filteredGroceries = groceries.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems    = groceries.length;
  const lowStockItems = groceries.filter(
  g => (g.displayQty ?? g.quantity) <= 5 && (g.displayQty ?? g.quantity) > 0
).length;
const outOfStock = groceries.filter(g => (g.displayQty ?? g.quantity) === 0).length;
const healthyItems = groceries.filter(g => (g.displayQty ?? g.quantity) > 5).length;

  const getStockStatus = (qty) => {
    if (qty === 0)  return { label: "Out of Stock", cls: "badge-out" };
    if (qty <= 5)   return { label: "Low Stock",    cls: "badge-low" };
    return               { label: "In Stock",      cls: "badge-ok"  };
  };

  const addGrocery = async () => {
    if (!newGrocery.name || !newGrocery.purchaseUnit || !newGrocery.quantity || !newGrocery.lastPurchasedDate) {
      setSuccessMsg(" Please fill all fields"); return;
    }
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/groceries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGrocery)
    });
    setNewGrocery({
  name: "",
  purchaseUnit: "",
  baseUnit: "",
  conversionFactor: 1,
  quantity: "",
  lastPurchasedDate: ""
});
    setShowForm(false);
    setSuccessMsg(" New raw material added!");
    fetchGroceries();
  };

  const exportExcel = async () => {
    const res  = await fetch(
      `${import.meta.env.VITE_API_URL}/api/groceries/export`);
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
    const res  = await fetch(
      `${import.meta.env.VITE_API_URL}/api/groceries/import`, { method: "POST", body: formData });
    const data = await res.json();
    setSuccessMsg(` ${data.msg}`);
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
    updated[index].quantity = updated[index].editedQuantity;
    updated[index].isEditing = false;
    updated[index].modified  = true;
    setGroceries(updated);
  };

  const saveStock = async () => {
    const modifiedItems = groceries.filter(g => g.modified);
    if (modifiedItems.length === 0) { setSuccessMsg(" No changes made"); return; }
    for (let item of modifiedItems) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity })
      });
    }
    setSuccessMsg(" Stock updated successfully!");
    fetchGroceries();
  };

  const toggleSelect = (index) => {
    const updated = [...groceries];
    updated[index].selected = !updated[index].selected;
    setGroceries(updated);
  };

  const deleteSelected = async () => {
    const selectedItems = groceries.filter(g => g.selected);
    if (selectedItems.length === 0) { setSuccessMsg(" No items selected"); return; }
    for (let item of selectedItems) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/groceries/${item._id}`, { method: "DELETE" });
    }
    setShowDeleteMode(false);
    setSuccessMsg(` ${selectedItems.length} item(s) deleted!`);
    fetchGroceries();
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
              {isViewMode ? "View Stock" : "Update Stock"}
            </div>
            <div className="stock-topbar-sub">
              {isViewMode ? "Raw Materials Overview" : "Manage & Update Raw Materials"}
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
                placeholder="Search raw material..."
                value={searchTerm}
                onChange={e =>  {
                const value = e.target.value;
                setSearchTerm(value);
                if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
                const matches = groceries.filter(item =>
                  item.name.toLowerCase().includes(value.toLowerCase())
                );
                setSuggestions(matches.slice(0, 6));
                setShowSuggestions(true);
              }}
                className="stock-search-input"
              />
          
              {searchTerm && (
                <button className="stock-search-clear" onClick={() => {setSearchTerm(""); setSuggestions([]); setShowSuggestions(false);}}>✕</button>
              )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map(item => (
                  <div key={item._id} className="search-dropdown-item"
                    onClick={() => { setSearchTerm(item.name); setShowSuggestions(false); }}>
                    {item.name}
                  </div>
                ))}
              </div>
            )}

            </div>

            {isUpdateMode && !showDeleteMode && (
              <button
                className="stock-btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✕ Close" : "+ Add Material"}
              </button>
            )}

            {isViewMode && (
              <>
                <button className="stock-btn-green" onClick={exportExcel}>
                  ⬇ Export Excel
                </button>
                <label className="stock-btn-blue stock-import-label">
                  ⬆ Import Excel
                  <input type="file" accept=".xlsx" onChange={handleImport} hidden />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="stock-content">

          {isViewMode && (
            <div className="stock-stat-row">
              <div className="stock-stat-card">
                <div className="st-body">
                  <div className="st-label">Total Materials</div>
                  <div className="st-value">{totalItems}</div>
                </div>
              </div>
              <div className="stock-stat-card">
                <div className="st-body">
                  <div className="st-label">In Stock</div>
                  <div className="st-value">{healthyItems}</div>
                </div>
              </div>
              <div className="stock-stat-card">
                <div className="st-body">
                  <div className="st-label">Low Stock</div>
                  <div className="st-value">{lowStockItems}</div>
                </div>
              </div>
              <div className="stock-stat-card">
                <div className="st-body">
                  <div className="st-label">Out of Stock</div>
                  <div className="st-value">{outOfStock}</div>
                </div>
              </div>
            </div>
          )}

          {isUpdateMode && showForm && !showDeleteMode && (
            <div className="stock-add-form">
              <div className="stock-form-title">Add New Raw Material</div>
              <div className="stock-form-grid">
                <div className="stock-form-field">
                  <label>Item Name</label>
                  <input
                    placeholder="e.g. Milk"
                    value={newGrocery.name}
                    onChange={e => setNewGrocery({ ...newGrocery, name: e.target.value })}
                  />
                </div>
                <div className="stock-form-field">
                  <label>Unit</label>
                  
                  <select
  value={newGrocery.purchaseUnit}
  onChange={e => {
    const unit = e.target.value;

    let baseUnit = "";
    let factor = 1;

    if (unit === "Litre") { baseUnit = "ml"; factor = 1000; }
    if (unit === "Kilogram") { baseUnit = "g"; factor = 1000; }
    if (unit === "Gram") { baseUnit = "g"; factor = 1; }
    if (unit === "Millilitre") { baseUnit = "ml"; factor = 1; }
    if (unit === "Packets") { baseUnit = "piece"; factor = 1; }
    setNewGrocery(prev => ({
 ...prev,
    purchaseUnit: unit,
    baseUnit,
    conversionFactor: factor
}));
  }}
>
                    <option value="">Select unit</option>
                    <option>Kilogram</option>
                    <option>Litre</option>
                    <option>Gram</option>
                    <option>Packets</option>
                    <option>Millilitre</option>
                  </select>
                </div>

                {newGrocery.purchaseUnit === "Packets" && (
  <div className="stock-form-field">
    <label>Pieces per Packet</label>
    <input
      type="number"
      min="1"
      placeholder="e.g. 20"
      value={newGrocery.conversionFactor}
      onChange={(e) =>
        setNewGrocery({
          ...newGrocery,
          conversionFactor: Number(e.target.value)
        })
      }
    />
   
  </div>
)}

                <div className="stock-form-field">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={newGrocery.quantity}
                    onChange={e => setNewGrocery({ ...newGrocery, quantity: e.target.value })}
                  />
                </div>
                <div className="stock-form-field">
                  <label>Last Purchased Date</label>
                  <input
                    type="date"
                    value={newGrocery.lastPurchasedDate}
                    onChange={e => setNewGrocery({ ...newGrocery, lastPurchasedDate: e.target.value })}
                  />
                </div>
                <div className="stock-form-field stock-form-submit">
                  <button className="stock-btn-primary" onClick={addGrocery}>
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="stock-table-card">

            <div className="stock-table-toprow">
              <div className="stock-table-heading">
                {isViewMode ? "Raw Materials" : "Update Quantities"}
                <span className="stock-table-count">{filteredGroceries.length} items</span>
              </div>

              {isUpdateMode && (
                <div className="stock-table-actions">
                  {!showDeleteMode ? (
                    <>
                      <button className="stock-btn-red" onClick={() => setShowDeleteMode(true)}>
                        🗑 Delete Items
                      </button>
                      <button className="stock-btn-save" onClick={saveStock}>
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="stock-btn-red" onClick={deleteSelected}>
                        Confirm Delete
                      </button>
                      <button className="stock-btn-gray" onClick={() => {
                        setShowDeleteMode(false);
                        setGroceries(groceries.map(g => ({ ...g, selected: false })));
                      }}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
             <div className="stock-table-scroll"> 
            <div className={`stock-col-head ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""}`}>
              {showDeleteMode && <span></span>}
              <span>#</span>
              <span>Item Name</span>
              <span>Unit</span>
              <span>Quantity</span>
              <span>Status</span>
              <span>Last Purchased</span>
              <span>Last Updated</span>
            </div>

            <div className="stock-table-body">
              {filteredGroceries.length === 0 ? (
                <div className="stock-empty">No raw materials found </div>
              ) : (
                filteredGroceries.map((g, i) => {
                  const status = getStockStatus(g.quantity);
                  return (
                    <div
                      key={g._id}
                      className={`stock-table-row ${isUpdateMode ? "update-cols" : "view-cols"} ${showDeleteMode ? "with-check" : ""} ${g.selected ? "row-selected" : ""} ${g.modified ? "row-modified" : ""} ${g.quantity > 0 && g.quantity <= 5 ? "row-low-stock" : ""}`}
                    >

                      {showDeleteMode && (
                        <span className="stock-check-cell">
                          <input
                            type="checkbox"
                            checked={g.selected}
                            onChange={() => toggleSelect(groceries.indexOf(g))}
                            className="stock-checkbox"
                          />
                        </span>
                      )}

                      <span className="stock-row-num">{i + 1}</span>

                      <span className="stock-row-name">{g.name}</span>

                      <span className="stock-row-unit">{g.purchaseUnit}</span>

                      <span className="stock-qty-cell">
                        {isUpdateMode && !showDeleteMode ? (
                          g.isEditing ? (
                            <div className="stock-qty-edit">
                              <input
                                type="number"
                                value={g.editedQuantity}
                                onChange={e => changeEditedQty(groceries.indexOf(g), e.target.value)}
                                className="stock-qty-input"
                                autoFocus
                              />
                              <button
                                className="stock-qty-save-btn"
                                onClick={() => saveEditedQty(groceries.indexOf(g))}
                                title="Save"
                              >✓ </button>
                            </div>
                          ) : (
                            <div className="stock-qty-view">
                              <span className={`stock-qty-num ${g.modified ? "qty-modified" : ""}`}>
                                {/* {g.displayQty} */}
                                {g.displayQty ?? g.quantity ?? 0}
                              </span>
                              <button
                                className="stock-qty-edit-btn"
                                onClick={() => startEdit(groceries.indexOf(g))}
                                title="Edit quantity"
                              >✎</button>
                            </div>
                          )
                        ) : (
                          <span className="stock-qty-plain">{g.displayQty?? g.quantity ?? 0}</span>
                        )}
                      </span>

                      <span>
                        <span className={`stock-status-badge ${status.cls}`}>{status.label}</span>
                      </span>

                      <span className="stock-row-date">
                        {g.lastPurchasedDate
                          ? new Date(g.lastPurchasedDate).toLocaleDateString("en-GB")
                          : "—"}
                      </span>

                      <span className="stock-row-date">
                        {g.lastStockUpdatedDate
                          ? new Date(g.lastStockUpdatedDate).toLocaleDateString("en-GB")
                          : "—"}
                      </span>
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
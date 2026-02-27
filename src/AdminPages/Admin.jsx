import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import "./sidebar.css";
import "./admin.css";
import { useSettings } from "../SettingsContext";

export default function Admin() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", image: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [catToDelete, setCatToDelete] = useState(null);
  const [catDeleteBlocked, setCatDeleteBlocked] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [openCatMenu, setOpenCatMenu] = useState(null);
  const catMenuRef = useRef(null);

  const { settings } = useSettings();

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/menu`).then(r => r.json()).then(setMenu);
    fetch(
      `${import.meta.env.VITE_API_URL}/api/categories`).then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setOpenCatMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (editId) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMenu(menu.map(item => item._id === editId ? data : item));
      setEditId(null);
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMenu([...menu, data]);
    }
    setFormData({ name: "", price: "", stock: "", category: "", image: "" });
    setShowForm(false);
  };

  const editItem = (item) => {
    setEditId(item._id);
    setFormData({ name: item.name, price: item.price, stock: item.stock, category: item.category, image: item.image });
    setShowForm(true);
  };

  const deleteItem = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMenu(menu.filter(item => item._id !== deleteId));
    setDeleteId(null);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory }),
    });
    if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
    const data = await res.json();
    setCategories(prev => [...prev, data]);
    setNewCategory("");
    setShowAddCat(false);
  };

  const updateCategory = async () => {
    if (!editCatName.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editCat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editCatName.trim() }),
    });
    if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
    const data = await res.json();
    setCategories(prev => prev.map(c => c._id === data._id ? data : c));
    if (activeCategory?._id === data._id) setActiveCategory(data);
    setEditCat(null);
  };

  const tryDeleteCategory = (cat) => {
    const hasItems = menu.some(item => item.category === cat.name);
    setCatToDelete(cat);
    setCatDeleteBlocked(hasItems);
    setOpenCatMenu(null);
  };

  const deleteCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${catToDelete._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { const err = await res.json(); alert(err.msg); setCatToDelete(null); return; }
    setCategories(prev => prev.filter(cat => cat._id !== catToDelete._id));
    if (activeCategory?.name === catToDelete.name) setActiveCategory("All");
    setCatToDelete(null);
    setCatDeleteBlocked(false);
  };

  const filteredItems = (activeCategory === "All"
    ? menu
    : menu.filter(item => item.category === activeCategory.name)
  ).filter(item => !search.trim() || item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">

      <Sidebar />

      <div className="main-content">

        <div className="topbar">
          <div className="topbar-title">Menu Management</div>
          <div className="search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
                const matches = menu.filter(item =>
                  item.name.toLowerCase().includes(value.toLowerCase())
                );
                setSuggestions(matches.slice(0, 6));
                setShowSuggestions(true);
              }}
            />
            {search && (
              <button className="search-clear"
                onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}>
                ✕
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map(item => (
                  <div key={item._id} className="search-dropdown-item"
                    onClick={() => { setSearch(item.name); setShowSuggestions(false); }}>
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="content-area">

          <div className="category-bar" ref={catMenuRef}>
            <div className="category-wrapper">
              <button className={`cat-btn${activeCategory === "All" ? " active" : ""}`}
                onClick={() => setActiveCategory("All")}>
                All
              </button>
            </div>

            {categories.map(cat => (
              <div key={cat._id} className="category-wrapper">
                <button
                  className={`cat-btn${activeCategory?.name === cat.name ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}>
                  {cat.name}
                  <span className="cat-three-dot"
                    onClick={(e) => { e.stopPropagation(); setOpenCatMenu(openCatMenu === cat._id ? null : cat._id); }}>
                    ⋯
                  </span>
                </button>
                {openCatMenu === cat._id && (
                  <div className="cat-dropdown">
                    <button className="cat-dropdown-item"
                      onClick={() => { setEditCat(cat); setEditCatName(cat.name); setOpenCatMenu(null); }}>
                       Edit
                    </button>
                    <button className="cat-dropdown-item cat-dropdown-delete"
                      onClick={() => tryDeleteCategory(cat)}>
                       Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {showAddCat ? (
              <div className="add-cat-inline">
                <input placeholder="Category name" value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()} autoFocus />
                <button onClick={addCategory}>Add</button>
              </div>
            ) : (
              <button className="add-cat-btn" onClick={() => setShowAddCat(true)} title="Add Category">+</button>
            )}
          </div>

          <div className="action-bar">
            <div className="section-title">
              {activeCategory === "All" ? "All Items" : activeCategory.name} ({filteredItems.length})
            </div>
            <button className="btn-primary"
              onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", price: "", stock: "", category: "", image: "" }); }}>
              + Add New Item
            </button>
          </div>

          <div className="menu-grid">
            {filteredItems.length === 0 ? (
              <div className="no-items">No items found </div>
            ) : (
              filteredItems.map(item => (
                <div key={item._id}
                  className={`menu-card${item.stock === 0 ? " out-stock" : item.stock < 5 ? " low-stock" : ""}`}>
                  <div className="card-img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className={`stock-badge${item.stock === 0 ? " out" : item.stock < 5 ? " low" : ""}`}>
                      {item.stock}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-info">
                      <div className="card-name">{item.name}</div>
                      <div className="card-price">{settings.currency}{item.price}</div>
                      {item.stock === 0 && <span className="card-stock-alert out">Out of Stock</span>}
                      {item.stock > 0 && item.stock < 5 && (
                        <span className="card-stock-alert low">Low Stock ({item.stock} left)</span>
                      )}
                    </div>
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => editItem(item)}>Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteId(item._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-title">{editId ? "Edit Item" : "Add New Item"}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Item Name</label>
                <input name="name" placeholder="e.g. Cappuccino" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Price ({settings.currency})</label>
                <input type="number" name="price" placeholder="e.g. 120" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Stock</label>
                <input type="number" name="stock" placeholder="e.g. 10" value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Image URL</label>
                <input name="image" placeholder="https://..." value={formData.image} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <button type="submit" className="btn-save">{editId ? "Update Item" : "Save Item"}</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Delete Item?</div>
            <p className="confirm-text">Are you sure you want to permanently delete this item?</p>
            <div className="form-row">
              <button className="btn-danger" onClick={deleteItem}>Yes, Delete</button>
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editCat && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Edit Category</div>
            <div className="form-field">
              <label>Category Name</label>
              <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
            </div>
            <div className="form-row">
              <button className="btn-save" onClick={updateCategory}>Save</button>
              <button className="btn-cancel" onClick={() => setEditCat(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {catToDelete && catDeleteBlocked && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title modal-warn"> Cannot Delete</div>
            <p className="confirm-text">
              <strong>"{catToDelete.name}"</strong> still has items in it.
              Please delete or reassign all items first.
            </p>
            <div className="form-row">
              <button className="btn-cancel btn-cancel-full"
                onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>
                OK, Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {catToDelete && !catDeleteBlocked && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Delete Category?</div>
            <p className="confirm-text">
              Are you sure you want to delete <strong>"{catToDelete.name}"</strong>?
              This category is empty and can be safely removed.
            </p>
            <div className="form-row">
              <button className="btn-danger" onClick={deleteCategory}>Yes, Delete</button>
              <button className="btn-cancel"
                onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
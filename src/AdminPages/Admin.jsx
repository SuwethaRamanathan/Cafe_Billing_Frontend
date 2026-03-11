// import { useEffect, useState, useRef } from "react";
// import Sidebar from "./SideBar";
// import "./sidebar.css";
// import "./admin.css";
// import { useSettings } from "../SettingsContext";

// export default function Admin() {
//   const [menu, setMenu] = useState([]);
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", image: "" });
//   const [deleteId, setDeleteId] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [showAddCat, setShowAddCat] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [catToDelete, setCatToDelete] = useState(null);
//   const [catDeleteBlocked, setCatDeleteBlocked] = useState(false);
//   const [editCat, setEditCat] = useState(null);
//   const [editCatName, setEditCatName] = useState("");
//   const [openCatMenu, setOpenCatMenu] = useState(null);
//   const catMenuRef = useRef(null);
//   const [recipe, setRecipe] = useState([]);

//   const [groceries, setGroceries] = useState([]);
//   const { settings } = useSettings();

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
//   .then(r => r.json())
//   .then(data => {
//     const normalized = data.map(item => ({
//       ...item,
//       stock: Number(item.stock),
//       price: Number(item.price)
//     }));
//     setMenu(normalized);
//   });

//   fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
//   .then(r => r.json())
//   .then(setGroceries);


//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/categories`).then(r => r.json()).then(setCategories);
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
//         setOpenCatMenu(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     const payload = { ...formData, recipe }; 
    
//     if (editId) {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${editId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setMenu(menu.map(item =>
//   item._id === editId
//     ? { ...data, stock: Number(data.stock), price: Number(data.price) }
//     : item
// ));

//       setEditId(null);
//     } else {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       // setMenu([...menu, data]);
//       setMenu([...menu, {
//   ...data,
//   stock: Number(data.stock),
//   price: Number(data.price)
// }]);
//     }
//     setFormData({ name: "", price: "", stock: "", category: "", image: "" });
//     setRecipe([]);  
//     setShowForm(false);
//   };

//   const editItem = (item) => {
//     setEditId(item._id);
//     setFormData({ name: item.name, price: item.price, stock: item.stock, category: item.category, image: item.image });
//     setRecipe(item.recipe || []);
//     setShowForm(true);
//   };

//  const addIngredient = () => {
//   setRecipe([...recipe, { grocery: "", qty: "" }]);
// };

// const updateIngredient = (i, field, value) => {
//   const copy = [...recipe];
//   copy[i][field] = value;
//   setRecipe(copy);
// };

// const removeIngredient = (i) => {
//   setRecipe(recipe.filter((_, idx) => idx !== i));
// };


//   const deleteItem = async () => {
//     const token = localStorage.getItem("token");
//     await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${deleteId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setMenu(menu.filter(item => item._id !== deleteId));
//     setDeleteId(null);
//   };

//   const addCategory = async () => {
//     if (!newCategory.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: newCategory }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => [...prev, data]);
//     setNewCategory("");
//     setShowAddCat(false);
//   };

//   const updateCategory = async () => {
//     if (!editCatName.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editCat._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: editCatName.trim() }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => prev.map(c => c._id === data._id ? data : c));
//     if (activeCategory?._id === data._id) setActiveCategory(data);
//     setEditCat(null);
//   };

//   const tryDeleteCategory = (cat) => {
//     const hasItems = menu.some(item => item.category === cat.name);
//     setCatToDelete(cat);
//     setCatDeleteBlocked(hasItems);
//     setOpenCatMenu(null);
//   };

//   const deleteCategory = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${catToDelete._id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); setCatToDelete(null); return; }
//     setCategories(prev => prev.filter(cat => cat._id !== catToDelete._id));
//     if (activeCategory?.name === catToDelete.name) setActiveCategory("All");
//     setCatToDelete(null);
//     setCatDeleteBlocked(false);
//   };

//   const filteredItems = (activeCategory === "All"
//     ? menu
//     : menu.filter(item => item.category === activeCategory.name)
//   ).filter(item => !search.trim() || item.name.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="admin-page">

//       <Sidebar />

//       <div className="main-content">

//         <div className="topbar">
//           <div className="topbar-title">Menu Management</div>
//           <div className="search-wrapper">
//             <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//               strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={search}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setSearch(value);
//                 if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                 const matches = menu.filter(item =>
//                   item.name.toLowerCase().includes(value.toLowerCase())
//                 );
//                 setSuggestions(matches.slice(0, 6));
//                 setShowSuggestions(true);
//               }}
//             />
//             {search && (
//               <button className="search-clear"
//                 onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}>
//                 ✕
//               </button>
//             )}
//             {showSuggestions && suggestions.length > 0 && (
//               <div className="search-dropdown">
//                 {suggestions.map(item => (
//                   <div key={item._id} className="search-dropdown-item"
//                     onClick={() => { setSearch(item.name); setShowSuggestions(false); }}>
//                     {item.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="content-area">

//            <div className="page-help">

//   <div className="page-help-title">
//     Menu Management Guide
//   </div>

//   <div className="page-help-text">
//     This page allows you to manage all menu items available in your cafe.
//   </div>

//   <ul className="page-help-list">
//     <li>Add new food or beverage items using <b>Add New Item</b>.</li>
//     <li>Edit or delete items anytime using the card actions.</li>
//     <li>Recipe ingredients allow automatic stock reduction .</li>
//   </ul>

// </div>

//           <div className="category-bar" ref={catMenuRef}>
//             <div className="category-wrapper">
//               <button className={`cat-btn${activeCategory === "All" ? " active" : ""}`}
//                 onClick={() => setActiveCategory("All")}>
//                 All
//               </button>
//             </div>

//             {categories.map(cat => (
//               <div key={cat._id} className="category-wrapper">
//                 <button
//                   className={`cat-btn${activeCategory?.name === cat.name ? " active" : ""}`}
//                   onClick={() => setActiveCategory(cat)}>
//                   {cat.name}
//                   <span className="cat-three-dot"
//                     onClick={(e) => { e.stopPropagation(); setOpenCatMenu(openCatMenu === cat._id ? null : cat._id); }}>
//                     ⋯
//                   </span>
//                 </button>
//                 {openCatMenu === cat._id && (
//                   <div className="cat-dropdown">
//                     <button className="cat-dropdown-item"
//                       onClick={() => { setEditCat(cat); setEditCatName(cat.name); setOpenCatMenu(null); }}>
//                        Edit
//                     </button>
//                     <button className="cat-dropdown-item cat-dropdown-delete"
//                       onClick={() => tryDeleteCategory(cat)}>
//                        Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {showAddCat ? (
//               <div className="add-cat-inline">
//                 <input placeholder="Category name" value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addCategory()} autoFocus />
//                 <button onClick={addCategory}>Add</button>
//               </div>
//             ) : (
//               <button className="add-cat-btn" onClick={() => setShowAddCat(true)} title="Add Category">+</button>
//             )}
//           </div>

//           <div className="action-bar">
//             <div className="section-title">
//               {activeCategory === "All" ? "All Items" : activeCategory.name} ({filteredItems.length})
//             </div>
//             <button className="btn-primary"
//               onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", price: "", stock: "", category: "", image: "" }); setRecipe([]);}}>
//               + Add New Item
//             </button>
//           </div>

//           <div className="menu-grid">
//             {filteredItems.length === 0 ? (
//               <div className="no-items">No items found </div>
//             ) : (
//               filteredItems.map(item => (
//                 <div key={item._id}
//                   className={`menu-card${item.stock === 0 ? " out-stock" : item.stock < 5 ? " low-stock" : ""}`}>
//                   <div className="card-img-wrap">
//                     <img src={item.image} alt={item.name} />
//                     <span className={`stock-badge${item.stock === 0 ? " out" : item.stock < 5 ? " low" : ""}`}>
//                       {item.stock}
//                     </span>
//                   </div>
//                   <div className="card-body">
//                     <div className="card-info">
//                       <div className="card-name">{item.name}</div>
//                       <div className="card-price">{settings.currency}{item.price}</div>
//                       {item.stock === 0 && <span className="card-stock-alert out">Out of Stock</span>}
//                       {item.stock > 0 && item.stock < 5 && (
//                         <span className="card-stock-alert low">Low Stock ({item.stock} left)</span>
//                       )}
//                     </div>
//                     <div className="card-actions">
//                       <button className="btn-edit" onClick={() => editItem(item)}>Edit</button>
//                       <button className="btn-delete" onClick={() => setDeleteId(item._id)}>Delete</button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//         </div>
//       </div>

//       {showForm && (
//         <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
//           <div className="modal-box">
//             <div className="modal-title">{editId ? "Edit Item" : "Add New Item"}</div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-field">
//                 <label>Item Name</label>
//                 <input name="name" placeholder="e.g. Cappuccino" value={formData.name} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>Price ({settings.currency})</label>
//                 <input type="number" name="price" placeholder="e.g. 120" value={formData.price} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>Stock</label>
//                 <input type="number" name="stock" placeholder="e.g. 10" value={formData.stock} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>Category</label>
//                 <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
//                   <option value="">Select Category</option>
//                   {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>Image URL</label>
//                 <input name="image" placeholder="https://..." value={formData.image} onChange={handleChange} required />
//               </div>

//             <div className="form-field">
//   <label>Recipe Ingredients</label>

//    <div className="recipe-info-box">
//     Add the stock and its quantity required to prepare this item.  
//     These ingredients will be automatically deducted from stock
// whenever the item is sold.
//   </div>

//   {recipe.map((r, i) => (
//     <div key={i} className="recipe-row">
//       <select
//         value={r.grocery}
//         onChange={e => updateIngredient(i, "grocery", e.target.value)}
//       >
//         <option value="">Select</option>
//         {groceries.map(g => (
//           <option key={g._id} value={g._id}>
//             {g.name}
//             {/* ({g.purchaseUnit}) */}
//           </option>
//         ))}
//       </select>

//       <input
//         type="number"
//         placeholder="Qty (ml/g/piece)"
//         value={r.qty}
//         onChange={e => updateIngredient(i, "qty", e.target.value)}
//       />

//       <button
//         type="button"
//         className="recipe-remove-btn"
//         onClick={() => removeIngredient(i)}
//       >
//         ✕
//       </button>
//     </div>
//   ))}

//   <button
//     type="button"
//     className="recipe-add-btn"
//     onClick={addIngredient}
//   >
//     + Add Ingredient
//   </button>
// </div>

//               <div className="form-row">
//                 <button type="submit" className="btn-save">{editId ? "Update Item" : "Save Item"}</button>
//                 <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteId && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">Delete Item?</div>
//             <p className="confirm-text">Are you sure you want to permanently delete this item?</p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteItem}>Yes, Delete</button>
//               <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {editCat && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">Edit Category</div>
//             <div className="form-field">
//               <label>Category Name</label>
//               <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
//             </div>
//             <div className="form-row">
//               <button className="btn-save" onClick={updateCategory}>Save</button>
//               <button className="btn-cancel" onClick={() => setEditCat(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {catToDelete && catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title modal-warn"> Cannot Delete</div>
//             <p className="confirm-text">
//               <strong>"{catToDelete.name}"</strong> still has items in it.
//               Please delete or reassign all items first.
//             </p>
//             <div className="form-row">
//               <button className="btn-cancel btn-cancel-full"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>
//                 OK, Got it
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {catToDelete && !catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">Delete Category?</div>
//             <p className="confirm-text">
//               Are you sure you want to delete <strong>"{catToDelete.name}"</strong>?
//               This category is empty and can be safely removed.
//             </p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteCategory}>Yes, Delete</button>
//               <button className="btn-cancel"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }





import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./SideBar";
import "./sidebar.css";
import "./admin.css";
import { useSettings } from "../SettingsContext";
import { useLocalizedField } from "../hooks/useLocalizedField";
import "./admin-lang.css";

export default function Admin() {
  const { t } = useTranslation();
  const localize = useLocalizedField();

  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: { en: "", ta: "", hi: "" }, price: "", stock: "", category: "", image: "" });
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
  const [recipe, setRecipe] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const { settings } = useSettings();
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
      .then(r => r.json())
      .then(data => {
        const normalized = data.map(item => ({
          ...item,
          stock: Number(item.stock),
          price: Number(item.price)
        }));
        setMenu(normalized);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
      .then(r => r.json())
      .then(setGroceries);

    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(r => r.json())
      .then(setCategories);
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

  useEffect(() => {
    const saved = localStorage.getItem("adminHelpClosed");
    if (saved === "true") setShowHelp(false);
  }, []);

  const closeHelp = () => {
    setShowHelp(false);
    localStorage.setItem("adminHelpClosed", "true");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // name field is now { en, ta, hi } — handled separately via handleNameChange
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { ...formData, recipe };

    if (editId) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMenu(menu.map(item =>
        item._id === editId
          ? { ...data, stock: Number(data.stock), price: Number(data.price) }
          : item
      ));
      setEditId(null);
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMenu([...menu, { ...data, stock: Number(data.stock), price: Number(data.price) }]);
    }
    setFormData({ name: { en: "", ta: "", hi: "" }, price: "", stock: "", category: "", image: "" });
    setRecipe([]);
    setShowForm(false);
  };

  const editItem = (item) => {
    setEditId(item._id);
    setFormData({
      name: typeof item.name === "object"
        ? { en: item.name.en || "", ta: item.name.ta || "", hi: item.name.hi || "" }
        : { en: item.name || "", ta: "", hi: "" },
      price: item.price,
      stock: item.stock,
      category: item.category,
      image: item.image
    });
    setRecipe(item.recipe || []);
    setShowForm(true);
  };

  const addIngredient = () => setRecipe([...recipe, { grocery: "", qty: "" }]);

  const updateIngredient = (i, field, value) => {
    const copy = [...recipe];
    copy[i][field] = value;
    setRecipe(copy);
  };

  const removeIngredient = (i) => setRecipe(recipe.filter((_, idx) => idx !== i));

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
    // category in menu items is stored as a plain English string
    // so compare against the English version of the category name
    const catEnName = typeof cat.name === "object" ? cat.name.en : cat.name;
    const hasItems = menu.some(item => item.category === catEnName);
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
    // activeCategory.name is now an object — compare _id instead
    if (activeCategory?._id === catToDelete._id) setActiveCategory("All");
    setCatToDelete(null);
    setCatDeleteBlocked(false);
  };

  // category filter: menu items store category as plain English string
  // activeCategory.name is now { en, ta, hi } — use .en for comparison
  const activeCatEnName = activeCategory === "All"
    ? "All"
    : (typeof activeCategory.name === "object" ? activeCategory.name.en : activeCategory.name);

  const filteredItems = (activeCategory === "All"
    ? menu
    : menu.filter(item => item.category === activeCatEnName)
  ).filter(item => !search.trim() || localize(item.name).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">

      <Sidebar />

      <div className="main-content">

        <div className="topbar">
          <div className="topbar-title">{t("admin.title")}</div>
          <div className="search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={t("admin.searchPlaceholder")}
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
                const matches = menu.filter(item =>
                  localize(item.name).toLowerCase().includes(value.toLowerCase())
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
                    onClick={() => { setSearch(localize(item.name)); setShowSuggestions(false); }}>
                    {localize(item.name)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="content-area">

          {showHelp && (
            <div className="admin-help">
              <button className="help-close" onClick={closeHelp} title="Close">✕</button>
              <div className="page-help-title">{t("admin.helpTitle")}</div>
              <div className="page-help-text">{t("admin.helpText")}</div>
              <ul className="page-help-list">
                <li>{t("admin.helpTip1")}</li>
                <li>{t("admin.helpTip2")}</li>
                <li>{t("admin.helpTip3")}</li>
              </ul>
            </div>
          )}

          {!showHelp && (
            <button className="help-float-btn" onClick={() => setShowHelp(true)}>Help</button>
          )}

          <div className="category-bar" ref={catMenuRef}>
            <div className="category-wrapper">
              <button className={`cat-btn${activeCategory === "All" ? " active" : ""}`}
                onClick={() => setActiveCategory("All")}>
                {t("common.all")}
              </button>
            </div>

            {categories.map(cat => (
              <div key={cat._id} className="category-wrapper">
                <button
                  className={`cat-btn${activeCategory?._id === cat._id ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}>
                  {/* FIX: localize(cat.name) not cat.name — cat.name is now an object */}
                  {localize(cat.name)}
                  <span className="cat-three-dot"
                    onClick={(e) => { e.stopPropagation(); setOpenCatMenu(openCatMenu === cat._id ? null : cat._id); }}>
                    ⋯
                  </span>
                </button>
                {openCatMenu === cat._id && (
                  <div className="cat-dropdown">
                    <button className="cat-dropdown-item"
                      onClick={() => {
                        setEditCat(cat);
                        // FIX: editCatName must be a string, use English version
                        setEditCatName(typeof cat.name === "object" ? cat.name.en : cat.name);
                        setOpenCatMenu(null);
                      }}>
                      {t("common.edit")}
                    </button>
                    <button className="cat-dropdown-item cat-dropdown-delete"
                      onClick={() => tryDeleteCategory(cat)}>
                      {t("common.delete")}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {showAddCat ? (
              <div className="add-cat-inline">
                <input placeholder={t("admin.categoryNamePlaceholder")} value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()} autoFocus />
                <button onClick={addCategory}>{t("common.add")}</button>
              </div>
            ) : (
              <button className="add-cat-btn" onClick={() => setShowAddCat(true)} title={t("admin.addCategory")}>+</button>
            )}
          </div>

          <div className="action-bar">
            <div className="section-title">
              {activeCategory === "All" ? t("common.allItems") : localize(activeCategory.name)} ({filteredItems.length})
            </div>
            <button className="btn-primary"
              onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: { en: "", ta: "", hi: "" }, price: "", stock: "", category: "", image: "" }); setRecipe([]); }}>
              {t("admin.addNewItem")}
            </button>
          </div>

          <div className="menu-grid">
            {filteredItems.length === 0 ? (
              <div className="no-items">{t("common.noItemsFound")}</div>
            ) : (
              filteredItems.map(item => (
                <div key={item._id}
                  className={`menu-card${item.stock === 0 ? " out-stock" : item.stock < 5 ? " low-stock" : ""}`}>
                  <div className="card-img-wrap">
                    <img src={item.image} alt={localize(item.name)} />
                    <span className={`stock-badge${item.stock === 0 ? " out" : item.stock < 5 ? " low" : ""}`}>
                      {item.stock}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-info">
                      <div className="card-name">{localize(item.name)}</div>
                      <div className="card-price">{settings.currency}{item.price}</div>
                      {item.stock === 0 && <span className="card-stock-alert out">{t("common.outOfStock")}</span>}
                      {item.stock > 0 && item.stock < 5 && (
                        <span className="card-stock-alert low">{t("common.lowStock")} ({item.stock} {t("common.left")})</span>
                      )}
                    </div>
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => editItem(item)}>{t("common.edit")}</button>
                      <button className="btn-delete" onClick={() => setDeleteId(item._id)}>{t("common.delete")}</button>
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
            <div className="modal-title">{editId ? t("admin.editItem") : t("admin.addNewItem")}</div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>{t("admin.form.itemName")}</label>
                <div className="lang-inputs">
                  <div className="lang-input-row">
                    <span className="lang-tag">EN</span>
                    <input
                      placeholder="e.g. Cappuccino"
                      value={formData.name.en}
                      onChange={e => handleNameChange("en", e.target.value)}
                      required={!formData.name.ta && !formData.name.hi}
                    />
                  </div>
                  <div className="lang-input-row">
                    <span className="lang-tag">TA</span>
                    <input
                      placeholder="எ.கா. கப்புச்சினோ (விரும்பினால்)"
                      value={formData.name.ta}
                      onChange={e => handleNameChange("ta", e.target.value)}
                    />
                  </div>
                  <div className="lang-input-row">
                    <span className="lang-tag">HI</span>
                    <input
                      placeholder="जैसे कैप्पुचिनो (वैकल्पिक)"
                      value={formData.name.hi}
                      onChange={e => handleNameChange("hi", e.target.value)}
                    />
                  </div>
                  <div className="lang-input-hint">Enter at least English. Tamil and Hindi will be auto-translated by super admin if left empty.</div>
                </div>
              </div>
              <div className="form-field">
                <label>{t("admin.form.price")} ({settings.currency})</label>
                <input type="number" name="price" placeholder={t("admin.form.pricePlaceholder")} value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>{t("common.stock")}</label>
                <input type="number" name="stock" placeholder={t("admin.form.stockPlaceholder")} value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>{t("menu.category")}</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">{t("admin.form.selectCategory")}</option>
                  {categories.map(cat => {
                    // FIX: option value must be a plain string (English name)
                    // because menu items store category as a plain string
                    const catEnName = typeof cat.name === "object" ? cat.name.en : cat.name;
                    return (
                      <option key={cat._id} value={catEnName}>
                        {localize(cat.name)}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-field">
                <label>{t("admin.form.imageUrl")}</label>
                <input name="image" placeholder="https://..." value={formData.image} onChange={handleChange} required />
              </div>

              <div className="form-field">
                <label>{t("admin.form.recipeIngredients")}</label>
                <div className="recipe-info-box">{t("admin.form.recipeInfo")}</div>
                {recipe.map((r, i) => (
                  <div key={i} className="recipe-row">
                    <select value={r.grocery} onChange={e => updateIngredient(i, "grocery", e.target.value)}>
                      <option value="">{t("common.select")}</option>
                      {groceries.map(g => (
                        <option key={g._id} value={g._id}>{localize(g.name)}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder={t("admin.form.qtyPlaceholder")}
                      value={r.qty}
                      onChange={e => updateIngredient(i, "qty", e.target.value)}
                    />
                    <button type="button" className="recipe-remove-btn" onClick={() => removeIngredient(i)}>✕</button>
                  </div>
                ))}
                <button type="button" className="recipe-add-btn" onClick={addIngredient}>
                  {t("admin.form.addIngredient")}
                </button>
              </div>

              <div className="form-row">
                <button type="submit" className="btn-save">{editId ? t("admin.form.updateItem") : t("admin.form.saveItem")}</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>{t("common.cancel")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">{t("admin.deleteItem")}</div>
            <p className="confirm-text">{t("admin.deleteItemConfirm")}</p>
            <div className="form-row">
              <button className="btn-danger" onClick={deleteItem}>{t("common.yesDelete")}</button>
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>{t("common.cancel")}</button>
            </div>
          </div>
        </div>
      )}

      {editCat && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">{t("admin.editCategory")}</div>
            <div className="form-field">
              <label>{t("admin.categoryName")}</label>
              {/* editCatName is always a plain string — safe to use directly */}
              <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
            </div>
            <div className="form-row">
              <button className="btn-save" onClick={updateCategory}>{t("common.save")}</button>
              <button className="btn-cancel" onClick={() => setEditCat(null)}>{t("common.cancel")}</button>
            </div>
          </div>
        </div>
      )}

      {catToDelete && catDeleteBlocked && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title modal-warn">{t("admin.cannotDelete")}</div>
            <p className="confirm-text">
              <strong>"{localize(catToDelete.name)}"</strong> {t("admin.catHasItems")}
            </p>
            <div className="form-row">
              <button className="btn-cancel btn-cancel-full"
                onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>
                {t("common.okGotIt")}
              </button>
            </div>
          </div>
        </div>
      )}

      {catToDelete && !catDeleteBlocked && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">{t("admin.deleteCategory")}</div>
            <p className="confirm-text">
              {t("admin.deleteCategoryConfirm")} <strong>"{localize(catToDelete.name)}"</strong>?
              {t("admin.deleteCategorySafe")}
            </p>
            <div className="form-row">
              <button className="btn-danger" onClick={deleteCategory}>{t("common.yesDelete")}</button>
              <button className="btn-cancel"
                onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>{t("common.cancel")}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}




// import { useEffect, useState, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import Sidebar from "./SideBar";
// import "./sidebar.css";
// import "./admin.css";
// import { useSettings } from "../SettingsContext";
// import { useLocalizedField } from "../hooks/useLocalizedField";

// export default function Admin() {
//   const { t } = useTranslation();
//   const localize = useLocalizedField();

//   const [menu, setMenu] = useState([]);
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", image: "" });
//   const [deleteId, setDeleteId] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [showAddCat, setShowAddCat] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [catToDelete, setCatToDelete] = useState(null);
//   const [catDeleteBlocked, setCatDeleteBlocked] = useState(false);
//   const [editCat, setEditCat] = useState(null);
//   const [editCatName, setEditCatName] = useState("");
//   const [openCatMenu, setOpenCatMenu] = useState(null);
//   const catMenuRef = useRef(null);
//   const [recipe, setRecipe] = useState([]);
//   const [groceries, setGroceries] = useState([]);
//   const { settings } = useSettings();
//   const [showHelp, setShowHelp] = useState(true);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
//       .then(r => r.json())
//       .then(data => {
//         const normalized = data.map(item => ({
//           ...item,
//           stock: Number(item.stock),
//           price: Number(item.price)
//         }));
//         setMenu(normalized);
//       });

//     fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
//       .then(r => r.json())
//       .then(setGroceries);

//     fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
//       .then(r => r.json())
//       .then(setCategories);
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
//         setOpenCatMenu(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     const saved = localStorage.getItem("adminHelpClosed");
//     if (saved === "true") setShowHelp(false);
//   }, []);

//   const closeHelp = () => {
//     setShowHelp(false);
//     localStorage.setItem("adminHelpClosed", "true");
//   };

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const payload = { ...formData, recipe };

//     if (editId) {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${editId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setMenu(menu.map(item =>
//         item._id === editId
//           ? { ...data, stock: Number(data.stock), price: Number(data.price) }
//           : item
//       ));
//       setEditId(null);
//     } else {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setMenu([...menu, { ...data, stock: Number(data.stock), price: Number(data.price) }]);
//     }
//     setFormData({ name: "", price: "", stock: "", category: "", image: "" });
//     setRecipe([]);
//     setShowForm(false);
//   };

//   const editItem = (item) => {
//     setEditId(item._id);
//     setFormData({
//       name: typeof item.name === "object" ? (item.name.en || localize(item.name)) : item.name,
//       price: item.price,
//       stock: item.stock,
//       // category is stored as a plain string in menu items — keep as-is
//       category: item.category,
//       image: item.image
//     });
//     setRecipe(item.recipe || []);
//     setShowForm(true);
//   };

//   const addIngredient = () => setRecipe([...recipe, { grocery: "", qty: "" }]);

//   const updateIngredient = (i, field, value) => {
//     const copy = [...recipe];
//     copy[i][field] = value;
//     setRecipe(copy);
//   };

//   const removeIngredient = (i) => setRecipe(recipe.filter((_, idx) => idx !== i));

//   const deleteItem = async () => {
//     const token = localStorage.getItem("token");
//     await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${deleteId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setMenu(menu.filter(item => item._id !== deleteId));
//     setDeleteId(null);
//   };

//   const addCategory = async () => {
//     if (!newCategory.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: newCategory }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => [...prev, data]);
//     setNewCategory("");
//     setShowAddCat(false);
//   };

//   const updateCategory = async () => {
//     if (!editCatName.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editCat._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: editCatName.trim() }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => prev.map(c => c._id === data._id ? data : c));
//     if (activeCategory?._id === data._id) setActiveCategory(data);
//     setEditCat(null);
//   };

//   const tryDeleteCategory = (cat) => {
//     // category in menu items is stored as a plain English string
//     // so compare against the English version of the category name
//     const catEnName = typeof cat.name === "object" ? cat.name.en : cat.name;
//     const hasItems = menu.some(item => item.category === catEnName);
//     setCatToDelete(cat);
//     setCatDeleteBlocked(hasItems);
//     setOpenCatMenu(null);
//   };

//   const deleteCategory = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${catToDelete._id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); setCatToDelete(null); return; }
//     setCategories(prev => prev.filter(cat => cat._id !== catToDelete._id));
//     // activeCategory.name is now an object — compare _id instead
//     if (activeCategory?._id === catToDelete._id) setActiveCategory("All");
//     setCatToDelete(null);
//     setCatDeleteBlocked(false);
//   };

//   // category filter: menu items store category as plain English string
//   // activeCategory.name is now { en, ta, hi } — use .en for comparison
//   const activeCatEnName = activeCategory === "All"
//     ? "All"
//     : (typeof activeCategory.name === "object" ? activeCategory.name.en : activeCategory.name);

//   const filteredItems = (activeCategory === "All"
//     ? menu
//     : menu.filter(item => item.category === activeCatEnName)
//   ).filter(item => !search.trim() || localize(item.name).toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="admin-page">

//       <Sidebar />

//       <div className="main-content">

//         <div className="topbar">
//           <div className="topbar-title">{t("admin.title")}</div>
//           <div className="search-wrapper">
//             <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//               strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//             <input
//               type="text"
//               placeholder={t("admin.searchPlaceholder")}
//               value={search}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setSearch(value);
//                 if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                 const matches = menu.filter(item =>
//                   localize(item.name).toLowerCase().includes(value.toLowerCase())
//                 );
//                 setSuggestions(matches.slice(0, 6));
//                 setShowSuggestions(true);
//               }}
//             />
//             {search && (
//               <button className="search-clear"
//                 onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}>
//                 ✕
//               </button>
//             )}
//             {showSuggestions && suggestions.length > 0 && (
//               <div className="search-dropdown">
//                 {suggestions.map(item => (
//                   <div key={item._id} className="search-dropdown-item"
//                     onClick={() => { setSearch(localize(item.name)); setShowSuggestions(false); }}>
//                     {localize(item.name)}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="content-area">

//           {showHelp && (
//             <div className="admin-help">
//               <button className="help-close" onClick={closeHelp} title="Close">✕</button>
//               <div className="page-help-title">{t("admin.helpTitle")}</div>
//               <div className="page-help-text">{t("admin.helpText")}</div>
//               <ul className="page-help-list">
//                 <li>{t("admin.helpTip1")}</li>
//                 <li>{t("admin.helpTip2")}</li>
//                 <li>{t("admin.helpTip3")}</li>
//               </ul>
//             </div>
//           )}

//           {!showHelp && (
//             <button className="help-float-btn" onClick={() => setShowHelp(true)}>Help</button>
//           )}

//           <div className="category-bar" ref={catMenuRef}>
//             <div className="category-wrapper">
//               <button className={`cat-btn${activeCategory === "All" ? " active" : ""}`}
//                 onClick={() => setActiveCategory("All")}>
//                 {t("common.all")}
//               </button>
//             </div>

//             {categories.map(cat => (
//               <div key={cat._id} className="category-wrapper">
//                 <button
//                   className={`cat-btn${activeCategory?._id === cat._id ? " active" : ""}`}
//                   onClick={() => setActiveCategory(cat)}>
//                   {/* FIX: localize(cat.name) not cat.name — cat.name is now an object */}
//                   {localize(cat.name)}
//                   <span className="cat-three-dot"
//                     onClick={(e) => { e.stopPropagation(); setOpenCatMenu(openCatMenu === cat._id ? null : cat._id); }}>
//                     ⋯
//                   </span>
//                 </button>
//                 {openCatMenu === cat._id && (
//                   <div className="cat-dropdown">
//                     <button className="cat-dropdown-item"
//                       onClick={() => {
//                         setEditCat(cat);
//                         // FIX: editCatName must be a string, use English version
//                         setEditCatName(typeof cat.name === "object" ? cat.name.en : cat.name);
//                         setOpenCatMenu(null);
//                       }}>
//                       {t("common.edit")}
//                     </button>
//                     <button className="cat-dropdown-item cat-dropdown-delete"
//                       onClick={() => tryDeleteCategory(cat)}>
//                       {t("common.delete")}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {showAddCat ? (
//               <div className="add-cat-inline">
//                 <input placeholder={t("admin.categoryNamePlaceholder")} value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addCategory()} autoFocus />
//                 <button onClick={addCategory}>{t("common.add")}</button>
//               </div>
//             ) : (
//               <button className="add-cat-btn" onClick={() => setShowAddCat(true)} title={t("admin.addCategory")}>+</button>
//             )}
//           </div>

//           <div className="action-bar">
//             <div className="section-title">
//               {activeCategory === "All" ? t("common.allItems") : localize(activeCategory.name)} ({filteredItems.length})
//             </div>
//             <button className="btn-primary"
//               onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", price: "", stock: "", category: "", image: "" }); setRecipe([]); }}>
//               {t("admin.addNewItem")}
//             </button>
//           </div>

//           <div className="menu-grid">
//             {filteredItems.length === 0 ? (
//               <div className="no-items">{t("common.noItemsFound")}</div>
//             ) : (
//               filteredItems.map(item => (
//                 <div key={item._id}
//                   className={`menu-card${item.stock === 0 ? " out-stock" : item.stock < 5 ? " low-stock" : ""}`}>
//                   <div className="card-img-wrap">
//                     <img src={item.image} alt={localize(item.name)} />
//                     <span className={`stock-badge${item.stock === 0 ? " out" : item.stock < 5 ? " low" : ""}`}>
//                       {item.stock}
//                     </span>
//                   </div>
//                   <div className="card-body">
//                     <div className="card-info">
//                       <div className="card-name">{localize(item.name)}</div>
//                       <div className="card-price">{settings.currency}{item.price}</div>
//                       {item.stock === 0 && <span className="card-stock-alert out">{t("common.outOfStock")}</span>}
//                       {item.stock > 0 && item.stock < 5 && (
//                         <span className="card-stock-alert low">{t("common.lowStock")} ({item.stock} {t("common.left")})</span>
//                       )}
//                     </div>
//                     <div className="card-actions">
//                       <button className="btn-edit" onClick={() => editItem(item)}>{t("common.edit")}</button>
//                       <button className="btn-delete" onClick={() => setDeleteId(item._id)}>{t("common.delete")}</button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//         </div>
//       </div>

//       {showForm && (
//         <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
//           <div className="modal-box">
//             <div className="modal-title">{editId ? t("admin.editItem") : t("admin.addNewItem")}</div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-field">
//                 <label>{t("admin.form.itemName")}</label>
//                 <input name="name" placeholder={t("admin.form.itemNamePlaceholder")} value={formData.name} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("admin.form.price")} ({settings.currency})</label>
//                 <input type="number" name="price" placeholder={t("admin.form.pricePlaceholder")} value={formData.price} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("common.stock")}</label>
//                 <input type="number" name="stock" placeholder={t("admin.form.stockPlaceholder")} value={formData.stock} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("menu.category")}</label>
//                 <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
//                   <option value="">{t("admin.form.selectCategory")}</option>
//                   {categories.map(cat => {
//                     // FIX: option value must be a plain string (English name)
//                     // because menu items store category as a plain string
//                     const catEnName = typeof cat.name === "object" ? cat.name.en : cat.name;
//                     return (
//                       <option key={cat._id} value={catEnName}>
//                         {localize(cat.name)}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>{t("admin.form.imageUrl")}</label>
//                 <input name="image" placeholder="https://..." value={formData.image} onChange={handleChange} required />
//               </div>

//               <div className="form-field">
//                 <label>{t("admin.form.recipeIngredients")}</label>
//                 <div className="recipe-info-box">{t("admin.form.recipeInfo")}</div>
//                 {recipe.map((r, i) => (
//                   <div key={i} className="recipe-row">
//                     <select value={r.grocery} onChange={e => updateIngredient(i, "grocery", e.target.value)}>
//                       <option value="">{t("common.select")}</option>
//                       {groceries.map(g => (
//                         <option key={g._id} value={g._id}>{localize(g.name)}</option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       placeholder={t("admin.form.qtyPlaceholder")}
//                       value={r.qty}
//                       onChange={e => updateIngredient(i, "qty", e.target.value)}
//                     />
//                     <button type="button" className="recipe-remove-btn" onClick={() => removeIngredient(i)}>✕</button>
//                   </div>
//                 ))}
//                 <button type="button" className="recipe-add-btn" onClick={addIngredient}>
//                   {t("admin.form.addIngredient")}
//                 </button>
//               </div>

//               <div className="form-row">
//                 <button type="submit" className="btn-save">{editId ? t("admin.form.updateItem") : t("admin.form.saveItem")}</button>
//                 <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>{t("common.cancel")}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteId && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.deleteItem")}</div>
//             <p className="confirm-text">{t("admin.deleteItemConfirm")}</p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteItem}>{t("common.yesDelete")}</button>
//               <button className="btn-cancel" onClick={() => setDeleteId(null)}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {editCat && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.editCategory")}</div>
//             <div className="form-field">
//               <label>{t("admin.categoryName")}</label>
//               {/* editCatName is always a plain string — safe to use directly */}
//               <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
//             </div>
//             <div className="form-row">
//               <button className="btn-save" onClick={updateCategory}>{t("common.save")}</button>
//               <button className="btn-cancel" onClick={() => setEditCat(null)}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {catToDelete && catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title modal-warn">{t("admin.cannotDelete")}</div>
//             <p className="confirm-text">
//               <strong>"{localize(catToDelete.name)}"</strong> {t("admin.catHasItems")}
//             </p>
//             <div className="form-row">
//               <button className="btn-cancel btn-cancel-full"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>
//                 {t("common.okGotIt")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {catToDelete && !catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.deleteCategory")}</div>
//             <p className="confirm-text">
//               {t("admin.deleteCategoryConfirm")} <strong>"{localize(catToDelete.name)}"</strong>?
//               {t("admin.deleteCategorySafe")}
//             </p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteCategory}>{t("common.yesDelete")}</button>
//               <button className="btn-cancel"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }




// import { useEffect, useState, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import Sidebar from "./SideBar";
// import "./sidebar.css";
// import "./admin.css";
// import { useSettings } from "../SettingsContext";
// import { useLocalizedField } from "../hooks/useLocalizedField";
// export default function Admin() {
//   const { t } = useTranslation();

//   const localize = useLocalizedField();

//   const [menu, setMenu] = useState([]);
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", image: "" });
//   const [deleteId, setDeleteId] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [showAddCat, setShowAddCat] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [catToDelete, setCatToDelete] = useState(null);
//   const [catDeleteBlocked, setCatDeleteBlocked] = useState(false);
//   const [editCat, setEditCat] = useState(null);
//   const [editCatName, setEditCatName] = useState("");
//   const [openCatMenu, setOpenCatMenu] = useState(null);
//   const catMenuRef = useRef(null);
//   const [recipe, setRecipe] = useState([]);
//   const [groceries, setGroceries] = useState([]);
//   const { settings } = useSettings();
//  const [showHelp, setShowHelp] = useState(true);
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
//       .then(r => r.json())
//       .then(data => {
//         const normalized = data.map(item => ({
//           ...item,
//           stock: Number(item.stock),
//           price: Number(item.price)
//         }));
//         setMenu(normalized);
//       });

//     fetch(`${import.meta.env.VITE_API_URL}/api/groceries`)
//       .then(r => r.json())
//       .then(setGroceries);

//     fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
//       .then(r => r.json())
//       .then(setCategories);
//   }, []);

//   useEffect(() => {
//     const handler = (e) => {
//       if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
//         setOpenCatMenu(null);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//   const saved = localStorage.getItem("adminHelpClosed");
//   if(saved === "true") setShowHelp(false);
// }, []);

// const closeHelp = () => {
//   setShowHelp(false);
//   localStorage.setItem("adminHelpClosed","true");
// };


//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const payload = { ...formData, recipe };

//     if (editId) {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${editId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setMenu(menu.map(item =>
//         item._id === editId
//           ? { ...data, stock: Number(data.stock), price: Number(data.price) }
//           : item
//       ));
//       setEditId(null);
//     } else {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       setMenu([...menu, { ...data, stock: Number(data.stock), price: Number(data.price) }]);
//     }
//     setFormData({ name: "", price: "", stock: "", category: "", image: "" });
//     setRecipe([]);
//     setShowForm(false);
//   };

//   const editItem = (item) => {
//     setEditId(item._id);
//     setFormData({ 
//       // name: item.name,
//       name: typeof item.name === "object" ? (item.name.en || localize(item.name)) : item.name,
//        price: item.price, stock: item.stock, category: item.category, image: item.image });
       
//     setRecipe(item.recipe || []);
//     setShowForm(true);
//   };

//   const addIngredient = () => setRecipe([...recipe, { grocery: "", qty: "" }]);

//   const updateIngredient = (i, field, value) => {
//     const copy = [...recipe];
//     copy[i][field] = value;
//     setRecipe(copy);
//   };

//   const removeIngredient = (i) => setRecipe(recipe.filter((_, idx) => idx !== i));

//   const deleteItem = async () => {
//     const token = localStorage.getItem("token");
//     await fetch(`${import.meta.env.VITE_API_URL}/api/menu/${deleteId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setMenu(menu.filter(item => item._id !== deleteId));
//     setDeleteId(null);
//   };

//   const addCategory = async () => {
//     if (!newCategory.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: newCategory }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => [...prev, data]);
//     setNewCategory("");
//     setShowAddCat(false);
//   };

//   const updateCategory = async () => {
//     if (!editCatName.trim()) return;
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${editCat._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ name: editCatName.trim() }),
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); return; }
//     const data = await res.json();
//     setCategories(prev => prev.map(c => c._id === data._id ? data : c));
//     if (activeCategory?._id === data._id) setActiveCategory(data);
//     setEditCat(null);
//   };

//   const tryDeleteCategory = (cat) => {
//     const hasItems = menu.some(item => item.category === localize(cat.name) || item.category === cat.name?.en);
//     // menu.some(item => item.category === cat.name);
//     setCatToDelete(cat);
//     setCatDeleteBlocked(hasItems);
//     setOpenCatMenu(null);
//   };

//   const deleteCategory = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${catToDelete._id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) { const err = await res.json(); alert(err.msg); setCatToDelete(null); return; }
//     setCategories(prev => prev.filter(cat => cat._id !== catToDelete._id));
//     if (activeCategory?.name === catToDelete.name) setActiveCategory("All");
//     setCatToDelete(null);
//     setCatDeleteBlocked(false);
//   };

//   const filteredItems = (activeCategory === "All"
//     ? menu
//     : menu.filter(item => item.category === activeCategory.name)
//   )  .filter(item => !search.trim() || localize(item.name).toLowerCase().includes(search.toLowerCase()));

//   // .filter(item => !search.trim() || item.name.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="admin-page">

//       <Sidebar />

//       <div className="main-content">

//         <div className="topbar">
//           <div className="topbar-title">{t("admin.title")}</div>
//           <div className="search-wrapper">
//             <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//               strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//             <input
//               type="text"
//               placeholder={t("admin.searchPlaceholder")}
//               value={search}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setSearch(value);
//                 if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                 const matches = menu.filter(item =>
//                    localize(item.name).toLowerCase().includes(value.toLowerCase())
//                   // item.name.toLowerCase().includes(value.toLowerCase())
//                 );
//                 setSuggestions(matches.slice(0, 6));
//                 setShowSuggestions(true);
//               }}
//             />
//             {search && (
//               <button className="search-clear"
//                 onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}>
//                 ✕
//               </button>
//             )}
//             {showSuggestions && suggestions.length > 0 && (
//               <div className="search-dropdown">
//                 {suggestions.map(item => (
//                   <div key={item._id} className="search-dropdown-item"
//                     onClick={() => { setSearch(item.name); setShowSuggestions(false); }}>
//                     {localize(item.name)}
//                     {/* {item.name} */}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="content-area">


//           {showHelp && (
//   <div className="admin-help">
//     <button
//       className="help-close"
//     onClick={closeHelp}
//       // onClick={() => setShowHelp(false)}
//       title="Close"
//     >
//       ✕
//     </button>

//     <div className="page-help-title">{t("admin.helpTitle")}</div>
//     <div className="page-help-text">{t("admin.helpText")}</div>

//     <ul className="page-help-list">
//       <li>{t("admin.helpTip1")}</li>
//       <li>{t("admin.helpTip2")}</li>
//       <li>{t("admin.helpTip3")}</li>
//     </ul>
//   </div>
// )}

//   {!showHelp && (
//   <button
//     className="help-float-btn"
//     onClick={() => setShowHelp(true)}
//   >
//     Help
//   </button>
// )}

//           <div className="category-bar" ref={catMenuRef}>
//             <div className="category-wrapper">
//               <button className={`cat-btn${activeCategory === "All" ? " active" : ""}`}
//                 onClick={() => setActiveCategory("All")}>All
//                 {/* {t("common.all")} */}
//               </button>
//             </div>

//             {categories.map(cat => (
//               <div key={cat._id} className="category-wrapper">
//                 <button
//                   className={`cat-btn${activeCategory?.name === cat.name ? " active" : ""}`}
//                   onClick={() => setActiveCategory(cat)}>
//                   {cat.name}
//                   <span className="cat-three-dot"
//                     onClick={(e) => { e.stopPropagation(); setOpenCatMenu(openCatMenu === cat._id ? null : cat._id); }}>
//                     ⋯
//                   </span>
//                 </button>
//                 {openCatMenu === cat._id && (
//                   <div className="cat-dropdown">
//                     <button className="cat-dropdown-item"
//                       onClick={() => { setEditCat(cat); setEditCatName(cat.name); setOpenCatMenu(null); }}>
//                       {t("common.edit")}
//                     </button>
//                     <button className="cat-dropdown-item cat-dropdown-delete"
//                       onClick={() => tryDeleteCategory(cat)}>
//                       {t("common.delete")}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {showAddCat ? (
//               <div className="add-cat-inline">
//                 <input placeholder={t("admin.categoryNamePlaceholder")} value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addCategory()} autoFocus />
//                 <button onClick={addCategory}>{t("common.add")}</button>
//               </div>
//             ) : (
//               <button className="add-cat-btn" onClick={() => setShowAddCat(true)} title={t("admin.addCategory")}>+</button>
//             )}
//           </div>

//           <div className="action-bar">
//             <div className="section-title">
//               {activeCategory === "All" ? t("common.allItems") : localize(activeCategory.name)}
//               {/* activeCategory.name */}
//               ({filteredItems.length})
//             </div>
//             <button className="btn-primary"
//               onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", price: "", stock: "", category: "", image: "" }); setRecipe([]); }}>
//               {t("admin.addNewItem")}
//             </button>
//           </div>

//           <div className="menu-grid">
//             {filteredItems.length === 0 ? (
//               <div className="no-items">{t("common.noItemsFound")}</div>
//             ) : (
//               filteredItems.map(item => (
//                 <div key={item._id}
//                   className={`menu-card${item.stock === 0 ? " out-stock" : item.stock < 5 ? " low-stock" : ""}`}>
//                   <div className="card-img-wrap">
//                     <img src={item.image} alt={item.name} />
//                     <span className={`stock-badge${item.stock === 0 ? " out" : item.stock < 5 ? " low" : ""}`}>
//                       {item.stock}
//                     </span>
//                   </div>
//                   <div className="card-body">
//                     <div className="card-info">
//                       <div className="card-name">
//                         {/* {item.name} */}
//                         {localize(item.name)}
//                         </div>
//                       <div className="card-price">{settings.currency}{item.price}</div>
//                       {item.stock === 0 && <span className="card-stock-alert out">{t("common.outOfStock")}</span>}
//                       {item.stock > 0 && item.stock < 5 && (
//                         <span className="card-stock-alert low">{t("common.lowStock")} ({item.stock} {t("common.left")})</span>
//                       )}
//                     </div>
//                     <div className="card-actions">
//                       <button className="btn-edit" onClick={() => editItem(item)}>{t("common.edit")}</button>
//                       <button className="btn-delete" onClick={() => setDeleteId(item._id)}>{t("common.delete")}</button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//         </div>
//       </div>

//       {/* ── Add / Edit Item Modal ── */}
//       {showForm && (
//         <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
//           <div className="modal-box">
//             <div className="modal-title">{editId ? t("admin.editItem") : t("admin.addNewItem")}</div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-field">
//                 <label>{t("admin.form.itemName")}</label>
//                 <input name="name" placeholder={t("admin.form.itemNamePlaceholder")} value={formData.name} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("admin.form.price")} ({settings.currency})</label>
//                 <input type="number" name="price" placeholder={t("admin.form.pricePlaceholder")} value={formData.price} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("common.stock")}</label>
//                 <input type="number" name="stock" placeholder={t("admin.form.stockPlaceholder")} value={formData.stock} onChange={handleChange} required />
//               </div>
//               <div className="form-field">
//                 <label>{t("menu.category")}</label>
//                 <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
//                   <option value="">{t("admin.form.selectCategory")}</option>
//                   {categories.map(cat => 
//                   <option key={cat._id} value={cat.name}>{localize(cat.name)}</option>)}
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>{t("admin.form.imageUrl")}</label>
//                 <input name="image" placeholder="https://..." value={formData.image} onChange={handleChange} required />
//               </div>

//               <div className="form-field">
//                 <label>{t("admin.form.recipeIngredients")}</label>
//                 <div className="recipe-info-box">{t("admin.form.recipeInfo")}</div>

//                 {recipe.map((r, i) => (
//                   <div key={i} className="recipe-row">
//                     <select value={r.grocery} onChange={e => updateIngredient(i, "grocery", e.target.value)}>
//                       <option value="">{t("common.select")}</option>
//                       {groceries.map(g => (
//                         // <option key={g._id} value={g._id}>{g.name}</option>
//                         <option key={g._id} value={g._id}>{localize(g.name)}</option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       placeholder={t("admin.form.qtyPlaceholder")}
//                       value={r.qty}
//                       onChange={e => updateIngredient(i, "qty", e.target.value)}
//                     />
//                     <button type="button" className="recipe-remove-btn" onClick={() => removeIngredient(i)}>✕</button>
//                   </div>
//                 ))}

//                 <button type="button" className="recipe-add-btn" onClick={addIngredient}>
//                   {t("admin.form.addIngredient")}
//                 </button>
//               </div>

//               <div className="form-row">
//                 <button type="submit" className="btn-save">{editId ? t("admin.form.updateItem") : t("admin.form.saveItem")}</button>
//                 <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>{t("common.cancel")}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteId && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.deleteItem")}</div>
//             <p className="confirm-text">{t("admin.deleteItemConfirm")}</p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteItem}>{t("common.yesDelete")}</button>
//               <button className="btn-cancel" onClick={() => setDeleteId(null)}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {editCat && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.editCategory")}</div>
//             <div className="form-field">
//               <label>{t("admin.categoryName")}</label>
//               <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
//             </div>
//             <div className="form-row">
//               <button className="btn-save" onClick={updateCategory}>{t("common.save")}</button>
//               <button className="btn-cancel" onClick={() => setEditCat(null)}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

     
//       {catToDelete && catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title modal-warn">{t("admin.cannotDelete")}</div>
//             <p className="confirm-text">
//               <strong>"{localize(catToDelete.name)}"</strong> {t("admin.catHasItems")}
//             </p>
//             <div className="form-row">
//               <button className="btn-cancel btn-cancel-full"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>
//                 {t("common.okGotIt")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {catToDelete && !catDeleteBlocked && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-title">{t("admin.deleteCategory")}</div>
//             <p className="confirm-text">
//               {t("admin.deleteCategoryConfirm")} <strong>"{localize(catToDelete.name)}"</strong>?
//               {t("admin.deleteCategorySafe")}
//             </p>
//             <div className="form-row">
//               <button className="btn-danger" onClick={deleteCategory}>{t("common.yesDelete")}</button>
//               <button className="btn-cancel"
//                 onClick={() => { setCatToDelete(null); setCatDeleteBlocked(false); }}>{t("common.cancel")}</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
//}
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./index.css";
// import { useSettings } from "../SettingsContext";
// import html2pdf from "html2pdf.js";

// function Cashier() {
//   const navigate = useNavigate();
//   const { settings } = useSettings();  
//   // to pull live settings from DB
  
//   // if (!settings) return null;

//   const [menu, setMenu]                     = useState([]);
//   const [cart, setCart]                     = useState([]);
//   const [search, setSearch]                 = useState("");
//   const [categories, setCategories]         = useState([]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [orderNumber, setOrderNumber]       = useState(1);
//   const [showPreview, setShowPreview]       = useState(false);
//   const [showLogout, setShowLogout]         = useState(false);
//   const [discount, setDiscount]             = useState("");
//   const [isPrinting, setIsPrinting]         = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showHelp, setShowHelp] = useState(false);

//   const addItem = (item) => {
//     if (item.stock <= 0) return;
//     setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock - 1 } : m));
//     const exists = cart.find(c => c._id === item._id);
//     if (exists) {
//       setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
//     } else {
//       setCart([...cart, { ...item, qty: 1 }]);
//     }
//   };

//   const increaseQty = (item) => {
//     if (item.stock <= 0) return;
//     setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock - 1 } : m));
//     setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
//   };

//   const decreaseQty = (item) => {
//     setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock + 1 } : m));
//     if (item.qty === 1) {
//       setCart(cart.filter(c => c._id !== item._id));
//     } else {
//       setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty - 1 } : c));
//     }
//   };

//   const clearCart = () => {
//     setMenu(prev => prev.map(m => {
//       const cartItem = cart.find(c => c._id === m._id);
//       return cartItem ? { ...m, stock: m.stock + cartItem.qty } : m;
//     }));
//     setCart([]);
//     setDiscount("");
//   };

//   const cur          = settings.currency || "₹";
//   const gstPct       = settings.gstEnabled ? (settings.gstPercent || 0) : 0;
//   const subTotal     = cart.reduce((a, c) => a + c.price * c.qty, 0);
//   const discountPct  = parseFloat(discount) || 0;
//   const discountAmt  = (subTotal * discountPct) / 100;
//   const afterDisc    = subTotal - discountAmt;
//   const gst          = afterDisc * (gstPct / 100);
//   const grand        = afterDisc + gst;

//   const handleDiscountChange = (e) => {
//     const val = e.target.value;
//     if (val === "" || (Number(val) >= 0 && Number(val) <= 100)) {
//       setDiscount(val);
//     }
//   };

//   const confirmPrint = async () => {
//     if (cart.length === 0) return;
//     setIsPrinting(true);

//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/orders`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ items: cart, total: grand }),
//     });

//     const data = await res.json();
//     setOrderNumber(data.orderNumber+1);
//     setIsPrinting(false);

//     window.print();

//     setCart([]);
//     setDiscount("");
//     setShowPreview(false);

//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/menu`)
//       .then(res => res.json())
//       .then(data => setMenu(data));
//   };

//   const downloadBill = () => {
//   const element = document.getElementById("pos-receipt");
//   if (!element) return;

//   const opt = {
//     margin:       5,
//     filename:     `Bill_${orderNumber}.pdf`,
//     image:        { type: "jpeg", quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: "mm", format: [80, 200], orientation: "portrait" } // thermal style
//   };

//   html2pdf().set(opt).from(element).save();
// };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("name");
//     navigate("/");
//   };

//   const filteredMenu = menu.filter(item => {
//     const matchCat    = activeCategory === "All" || item.category === activeCategory;
//     const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
//     return matchCat && matchSearch;
//   });

// //   const fetchNextOrderNumber = async () => {
// //   const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
// //   const data = await res.json();

// //   if (data.length === 0) {
// //     setOrderNumber(1);
// //   } else {
// //     const last = data[data.length - 1];
// //     setOrderNumber(last.orderNumber + 1);
// //   }
// // };

// useEffect(() => {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/menu`)
//       .then(res => res.json())
//       .then(data => setMenu(data));
//     //  fetchNextOrderNumber(); 
//   }, []);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
//       .then(res => res.json())
//       .then(data => setCategories(data));
//   }, []);

//   return (
//     <div className="pos-wrap">

//       <header className="pos-header">
//         <div className="pos-header-logo">
//           <div className="pos-logo-name"> 
//              <h3>{settings.cafeName}</h3>
//           </div>
//         </div>

//         <div className="pos-search-wrap">
//           <svg className="pos-search-icon" xmlns="http://www.w3.org/2000/svg"
//             width="15" height="15" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//           </svg>
//           <input
//             type="text"
//             placeholder="Search menu items..."
//             value={search}
//             onChange={(e) => {
//                 const value = e.target.value;
//                 setSearch(value);
//                 if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
//                 const matches = menu.filter(item =>
//                   item.name.toLowerCase().includes(value.toLowerCase())
//                 );
//                 setSuggestions(matches.slice(0, 6));
//                 setShowSuggestions(true);
//               }}
//             className="pos-search-input"
//           />
         
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

//         </div>

//         <div className="pos-header-right">
//           <button className="help-btn" onClick={() => setShowHelp(true)} >
//               ℹ  Instructions </button>
//           <button className="pos-logout-btn" onClick={() => setShowLogout(true)}>
//             Logout
//           </button>
//         </div>
//       </header>


//       <div className="pos-body">

//         <div className="pos-left">
//           <div className="pos-cat-bar">
//             <button
//               className={`pos-cat-btn${activeCategory === "All" ? " active" : ""}`}
//               onClick={() => setActiveCategory("All")}
//             >All</button>
//             {categories.map(cat => (
//               <button
//                 key={cat._id}
//                 className={`pos-cat-btn${activeCategory === cat.name ? " active" : ""}`}
//                 onClick={() => setActiveCategory(cat.name)}
//               >{cat.name}</button>
//             ))}
//           </div>

//           <div className="pos-menu-grid">
//             {filteredMenu.length === 0 ? (
//               <div className="pos-no-items">No items found </div> ) : (
//               filteredMenu.map(item => {
//                 const isOut = item.stock === 0;
//                 const isLow = item.stock > 0 && item.stock < 5;
//                 return (
//                   <div
//                     key={item._id}
//                     className={`pos-card${isOut ? " pos-card-out" : ""}`}
//                     onClick={() => !isOut && addItem(item)}
//                   >
//                     <div className={`pos-stock-badge${isOut ? " badge-out" : isLow ? " badge-low" : ""}`}>
//                       {item.stock}
//                     </div>
//                     <div className="pos-card-img-wrap">
//                       <img
//                         src={item.image || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"}
//                         alt={item.name}
//                       />
//                     </div>
//                     <div className="pos-card-body">
//                       <div className="pos-card-name">{item.name}</div>
//                       <div className="pos-card-bottom">
//                         <span className="pos-card-price">{cur}{item.price}</span>
//                         {isOut ? (
//                           <span className="pos-card-out-label">Out of Stock</span>
//                         ) : (
//                           <button
//                             className="pos-add-btn"
//                             onClick={e => { e.stopPropagation(); addItem(item); }}
//                           >+ Add</button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         <div className="pos-right">
//           <div className="pos-bill-header">
//             <div>
//               <div className="pos-bill-title">Current Order</div>
//               <div className="pos-bill-sub">
//                 Order #{String(orderNumber).padStart(4, "0")} • {new Date().toLocaleDateString("en-GB")}
//               </div>
//             </div>
//             {cart.length > 0 && (
//               <button className="pos-clear-btn" onClick={clearCart}>Clear All</button>
//             )}
//           </div>

//           <div className="pos-cart-list">
//             {cart.map(item => (
//               <div key={item._id} className="pos-cart-row">
//                 <div className="pos-cart-info">
//                   <div className="pos-cart-name">{item.name}</div>
//                   <div className="pos-cart-unit-price">{cur}{item.price} each</div>
//                 </div>
//                 <div className="pos-qty-controls">
//                   <button className="pos-qty-btn" onClick={() => decreaseQty(item)}>−</button>
//                   <span className="pos-qty-num">{item.qty}</span>
//                   <button className="pos-qty-btn pos-qty-btn-plus" onClick={() => increaseQty(item)}>+</button>
//                 </div>
//                 <div className="pos-cart-row-right">
//                   <div className="pos-cart-total">{cur}{(item.price * item.qty).toLocaleString()}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="pos-bill-summary">

//             {settings.discountEnabled && (
//               <div className="pos-discount-row">
//                 <label className="pos-discount-label">Discount</label>
//                 <div className="pos-discount-input-wrap">
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     placeholder="0"
//                     value={discount}
//                     onChange={handleDiscountChange}
//                     className="pos-discount-input"
//                   />
//                   <span className="pos-discount-pct-symbol">%</span>
//                 </div>
//                 {discountAmt > 0 && (
//                   <span className="pos-discount-saved">−{cur}{discountAmt.toFixed(2)}</span>
//                 )}
//               </div>
//             )}

//             <div className="pos-summary-divider" />

//             <div className="pos-summary-line">
//               <span>Subtotal</span>
//               <span>{cur}{subTotal.toFixed(2)}</span>
//             </div>

//             {discountAmt > 0 && (
//               <div className="pos-summary-line pos-summary-discount">
//                 <span>Discount ({discountPct}%)</span>
//                 <span>−{cur}{discountAmt.toFixed(2)}</span>
//               </div>
//             )}

//             {settings.gstEnabled && (
//               <div className="pos-summary-line">
//                 <span>GST ({gstPct}%)</span>
//                 <span>{cur}{gst.toFixed(2)}</span>
//               </div>
//             )}

//             <div className="pos-summary-divider" />

//             <div className="pos-summary-grand">
//               <span>Grand Total</span>
//               <span>{cur}{grand.toFixed(2)}</span>
//             </div>

//             <button
//               className="pos-generate-btn"
//               disabled={cart.length === 0}
//               onClick={() => setShowPreview(true)}
//             >
//               Generate Bill
//             </button>

//           </div>
//         </div>
//       </div>

//       {showPreview && (
//         <div className="pos-modal-overlay" onClick={e => e.target === e.currentTarget && setShowPreview(false)}>
//           <div className="pos-preview-modal">

//             <div className="pos-receipt" id="pos-receipt">

//               <div className="receipt-header">
//                 <div className="receipt-cafe-name">{settings.cafeName}</div>
//                 <div className="receipt-tagline">{settings.tagline}</div>
//                 {settings.address && <div className="receipt-address">{settings.address}</div>}
//                 {settings.phone   && <div className="receipt-address">📞 {settings.phone}</div>}
//                 {settings.gstin   && <div className="receipt-address">GSTIN: {settings.gstin}</div>}
//                 <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
//                 <div className="receipt-meta">
//                   <span>Order #{String(orderNumber).padStart(4, "0")}</span>
//                   <span>{new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
//                 </div>
//                 <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
//               </div>

//               <div className="receipt-col-head">
//                 <span>Item</span>
//                 <span>Qty</span>
//                 <span>Total</span>
//               </div>
//               {cart.map(item => (
//                 <div key={item._id} className="receipt-row">
//                   <span className="receipt-item-name">{item.name}</span>
//                   <span className="receipt-item-qty">{item.qty}</span>
//                   <span className="receipt-item-total">{cur}{(item.price * item.qty).toFixed(2)}</span>
//                 </div>
//               ))}

//               <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
//               <div className="receipt-summary-line">
//                 <span>Subtotal</span>
//                 <span>{cur}{subTotal.toFixed(2)}</span>
//               </div>
//               {discountAmt > 0 && (
//                 <div className="receipt-summary-line receipt-discount-line">
//                   <span>Discount ({discountPct}%)</span>
//                   <span>−{cur}{discountAmt.toFixed(2)}</span>
//                 </div>
//               )}
//               {settings.gstEnabled && (
//                 <div className="receipt-summary-line">
//                   <span>GST ({gstPct}%)</span>
//                   <span>{cur}{gst.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
//               <div className="receipt-grand">
//                 <span>TOTAL</span>
//                 <span>{cur}{grand.toFixed(2)}</span>
//               </div>
//               {discountAmt > 0 && (
//                 <div className="receipt-saving">
//                    You saved {cur}{discountAmt.toFixed(2)} today!
//                 </div>
//               )}
//               <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
//               <div className="receipt-footer">
//                 <div>{settings.receiptFooter}</div>
//               </div>
//             </div>

//             <div className="pos-preview-actions">
//               <button className="pos-cancel-btn" onClick={() => setShowPreview(false)}>
//                 Back
//               </button>

//                 <button
//     className="pos-download-btn"
//     onClick={downloadBill}
//     disabled={cart.length === 0}
//   >
//     Download Bill
//   </button>

//               <button className="pos-print-btn" onClick={confirmPrint} disabled={isPrinting}>
//                 {isPrinting ? "Processing..." : "Print Bill"}
//               </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {showHelp && (
//   <div className="help-overlay">

//     <div className="help-modal">

//       <div className="help-title">
//         Cashier Instructions
//       </div>

//       <ul>
//         <li>Select menu items to add them to the order.</li>
//         <li>Adjust quantities using + and − buttons.</li>
//         <li>Apply discount if enabled.</li>
//         <li>Click Generate Bill to preview and print.</li>
//       </ul>

//       <button 
//       className="help-close"
//       onClick={() => setShowHelp(false)}
//       >
//         Close
//       </button>

//     </div>

//   </div>
// )}

//       {showLogout && (
//         <div className="pos-modal-overlay">
//           <div className="pos-confirm-modal">
//             <div className="pos-confirm-title">Confirm Logout</div>
//             <div className="pos-confirm-text">
//               Are you sure you want to log out?
//               {cart.length > 0 && (
//                 <span className="pos-confirm-warn">
//                   &nbsp;You have {cart.length} item(s) in the current order that will be lost.
//                 </span>
//               )}
//             </div>
//             <div className="pos-confirm-actions">
//               <button className="pos-cancel-btn" onClick={() => setShowLogout(false)}>
//                 Cancel
//               </button>
//               <button className="pos-danger-btn" onClick={handleLogout}>
//                 Yes, Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default Cashier;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useSettings } from "../SettingsContext";
import html2pdf from "html2pdf.js";

function Cashier() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [menu, setMenu]                     = useState([]);
  const [cart, setCart]                     = useState([]);
  const [search, setSearch]                 = useState("");
  const [categories, setCategories]         = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [orderNumber, setOrderNumber]       = useState(1);
  const [showPreview, setShowPreview]       = useState(false);
  const [showLogout, setShowLogout]         = useState(false);
  const [discount, setDiscount]             = useState("");
  const [isPrinting, setIsPrinting]         = useState(false);
  const [suggestions, setSuggestions]       = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHelp, setShowHelp]             = useState(false);

  const addItem = (item) => {
    if (item.stock <= 0) return;
    setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock - 1 } : m));
    const exists = cart.find(c => c._id === item._id);
    if (exists) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increaseQty = (item) => {
    if (item.stock <= 0) return;
    setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock - 1 } : m));
    setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
  };

  const decreaseQty = (item) => {
    setMenu(menu.map(m => m._id === item._id ? { ...m, stock: m.stock + 1 } : m));
    if (item.qty === 1) {
      setCart(cart.filter(c => c._id !== item._id));
    } else {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty - 1 } : c));
    }
  };

  const clearCart = () => {
    setMenu(prev => prev.map(m => {
      const cartItem = cart.find(c => c._id === m._id);
      return cartItem ? { ...m, stock: m.stock + cartItem.qty } : m;
    }));
    setCart([]);
    setDiscount("");
  };

  const cur         = settings.currency || "₹";
  const gstPct      = settings.gstEnabled ? (settings.gstPercent || 0) : 0;
  const subTotal    = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const discountPct = parseFloat(discount) || 0;
  const discountAmt = (subTotal * discountPct) / 100;
  const afterDisc   = subTotal - discountAmt;
  const gst         = afterDisc * (gstPct / 100);
  const grand       = afterDisc + gst;

  const handleDiscountChange = (e) => {
    const val = e.target.value;
    if (val === "" || (Number(val) >= 0 && Number(val) <= 100)) setDiscount(val);
  };

  const confirmPrint = async () => {
    if (cart.length === 0) return;
    setIsPrinting(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total: grand }),
    });
    const data = await res.json();
    setOrderNumber(data.orderNumber + 1);
    setIsPrinting(false);
    window.print();
    setCart([]);
    setDiscount("");
    setShowPreview(false);
    fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
      .then(res => res.json())
      .then(data => setMenu(data));
  };

  const downloadBill = () => {
    const element = document.getElementById("pos-receipt");
    if (!element) return;
    const opt = {
      margin: 5,
      filename: `Bill_${orderNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: [80, 200], orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const filteredMenu = menu.filter(item => {
    const matchCat    = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/menu`)
      .then(res => res.json())
      .then(data => setMenu(data));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="pos-wrap">

      <header className="pos-header">
        <div className="pos-header-logo">
          <div className="pos-logo-name">
            <h3>{settings.cafeName}</h3>
          </div>
        </div>

        <div className="pos-search-wrap">
          <svg className="pos-search-icon" xmlns="http://www.w3.org/2000/svg"
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder={t("cashier.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              if (!value) { setSuggestions([]); setShowSuggestions(false); return; }
              const matches = menu.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
              setSuggestions(matches.slice(0, 6));
              setShowSuggestions(true);
            }}
            className="pos-search-input"
          />
          {search && (
            <button className="search-clear"
              onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}>✕</button>
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

        <div className="pos-header-right">
          <button className="help-btn" onClick={() => setShowHelp(true)}>
            ℹ {t("cashier.instructions")}
          </button>
          <button className="pos-logout-btn" onClick={() => setShowLogout(true)}>
            {t("nav.logout")}
          </button>
        </div>
      </header>

      <div className="pos-body">

        <div className="pos-left">
          <div className="pos-cat-bar">
            <button
              className={`pos-cat-btn${activeCategory === "All" ? " active" : ""}`}
              onClick={() => setActiveCategory("All")}
            >{t("common.all")}</button>
            {categories.map(cat => (
              <button key={cat._id}
                className={`pos-cat-btn${activeCategory === cat.name ? " active" : ""}`}
                onClick={() => setActiveCategory(cat.name)}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pos-menu-grid">
            {filteredMenu.length === 0 ? (
              <div className="pos-no-items">{t("common.noItemsFound")}</div>
            ) : (
              filteredMenu.map(item => {
                const isOut = item.stock === 0;
                const isLow = item.stock > 0 && item.stock < 5;
                return (
                  <div key={item._id}
                    className={`pos-card${isOut ? " pos-card-out" : ""}`}
                    onClick={() => !isOut && addItem(item)}>
                    <div className={`pos-stock-badge${isOut ? " badge-out" : isLow ? " badge-low" : ""}`}>
                      {item.stock}
                    </div>
                    <div className="pos-card-img-wrap">
                      <img src={item.image || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"} alt={item.name} />
                    </div>
                    <div className="pos-card-body">
                      <div className="pos-card-name">{item.name}</div>
                      <div className="pos-card-bottom">
                        <span className="pos-card-price">{cur}{item.price}</span>
                        {isOut ? (
                          <span className="pos-card-out-label">{t("common.outOfStock")}</span>
                        ) : (
                          <button className="pos-add-btn"
                            onClick={e => { e.stopPropagation(); addItem(item); }}>
                            + {t("common.add")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pos-right">
          <div className="pos-bill-header">
            <div>
              <div className="pos-bill-title">{t("cashier.currentOrder")}</div>
              <div className="pos-bill-sub">
                {t("cashier.orderNo")} #{String(orderNumber).padStart(4, "0")} • {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>
            {cart.length > 0 && (
              <button className="pos-clear-btn" onClick={clearCart}>{t("cashier.clearAll")}</button>
            )}
          </div>

          <div className="pos-cart-list">
            {cart.map(item => (
              <div key={item._id} className="pos-cart-row">
                <div className="pos-cart-info">
                  <div className="pos-cart-name">{item.name}</div>
                  <div className="pos-cart-unit-price">{cur}{item.price} {t("cashier.each")}</div>
                </div>
                <div className="pos-qty-controls">
                  <button className="pos-qty-btn" onClick={() => decreaseQty(item)}>−</button>
                  <span className="pos-qty-num">{item.qty}</span>
                  <button className="pos-qty-btn pos-qty-btn-plus" onClick={() => increaseQty(item)}>+</button>
                </div>
                <div className="pos-cart-row-right">
                  <div className="pos-cart-total">{cur}{(item.price * item.qty).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pos-bill-summary">

            {settings.discountEnabled && (
              <div className="pos-discount-row">
                <label className="pos-discount-label">{t("common.discount")}</label>
                <div className="pos-discount-input-wrap">
                  <input type="number" min="0" max="100" placeholder="0"
                    value={discount} onChange={handleDiscountChange}
                    className="pos-discount-input" />
                  <span className="pos-discount-pct-symbol">%</span>
                </div>
                {discountAmt > 0 && (
                  <span className="pos-discount-saved">−{cur}{discountAmt.toFixed(2)}</span>
                )}
              </div>
            )}

            <div className="pos-summary-divider" />

            <div className="pos-summary-line">
              <span>{t("common.subtotal")}</span>
              <span>{cur}{subTotal.toFixed(2)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="pos-summary-line pos-summary-discount">
                <span>{t("common.discount")} ({discountPct}%)</span>
                <span>−{cur}{discountAmt.toFixed(2)}</span>
              </div>
            )}
            {settings.gstEnabled && (
              <div className="pos-summary-line">
                <span>{t("billing.gst")} ({gstPct}%)</span>
                <span>{cur}{gst.toFixed(2)}</span>
              </div>
            )}

            <div className="pos-summary-divider" />

            <div className="pos-summary-grand">
              <span>{t("billing.grandTotal")}</span>
              <span>{cur}{grand.toFixed(2)}</span>
            </div>

            <button className="pos-generate-btn"
              disabled={cart.length === 0}
              onClick={() => setShowPreview(true)}>
              {t("cashier.generateBill")}
            </button>
          </div>
        </div>
      </div>

      {/* ── Bill Preview Modal ── */}
      {showPreview && (
        <div className="pos-modal-overlay" onClick={e => e.target === e.currentTarget && setShowPreview(false)}>
          <div className="pos-preview-modal">
            <div className="pos-receipt" id="pos-receipt">
              <div className="receipt-header">
                <div className="receipt-cafe-name">{settings.cafeName}</div>
                <div className="receipt-tagline">{settings.tagline}</div>
                {settings.address && <div className="receipt-address">{settings.address}</div>}
                {settings.phone   && <div className="receipt-address">📞 {settings.phone}</div>}
                {settings.gstin   && <div className="receipt-address">GSTIN: {settings.gstin}</div>}
                <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
                <div className="receipt-meta">
                  <span>{t("cashier.orderNo")} #{String(orderNumber).padStart(4, "0")}</span>
                  <span>{new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
                <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
              </div>

              <div className="receipt-col-head">
                <span>{t("cashier.receipt.item")}</span>
                <span>{t("cashier.receipt.qty")}</span>
                <span>{t("cashier.receipt.total")}</span>
              </div>
              {cart.map(item => (
                <div key={item._id} className="receipt-row">
                  <span className="receipt-item-name">{item.name}</span>
                  <span className="receipt-item-qty">{item.qty}</span>
                  <span className="receipt-item-total">{cur}{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
              <div className="receipt-summary-line">
                <span>{t("common.subtotal")}</span><span>{cur}{subTotal.toFixed(2)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="receipt-summary-line receipt-discount-line">
                  <span>{t("common.discount")} ({discountPct}%)</span>
                  <span>−{cur}{discountAmt.toFixed(2)}</span>
                </div>
              )}
              {settings.gstEnabled && (
                <div className="receipt-summary-line">
                  <span>{t("billing.gst")} ({gstPct}%)</span>
                  <span>{cur}{gst.toFixed(2)}</span>
                </div>
              )}
              <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
              <div className="receipt-grand">
                <span>{t("common.total")}</span><span>{cur}{grand.toFixed(2)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="receipt-saving">
                  {t("cashier.receipt.saved")} {cur}{discountAmt.toFixed(2)} {t("cashier.receipt.today")}
                </div>
              )}
              <div className="receipt-divider">- - - - - - - - - - - - - - - - - -</div>
              <div className="receipt-footer">
                <div>{settings.receiptFooter}</div>
              </div>
            </div>

            <div className="pos-preview-actions">
              <button className="pos-cancel-btn" onClick={() => setShowPreview(false)}>{t("common.back")}</button>
              <button className="pos-download-btn" onClick={downloadBill} disabled={cart.length === 0}>
                {t("cashier.downloadBill")}
              </button>
              <button className="pos-print-btn" onClick={confirmPrint} disabled={isPrinting}>
                {isPrinting ? t("cashier.processing") : t("billing.printBill")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Help Modal ── */}
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <div className="help-title">{t("cashier.helpTitle")}</div>
            <ul>
              <li>{t("cashier.helpTip1")}</li>
              <li>{t("cashier.helpTip2")}</li>
              <li>{t("cashier.helpTip3")}</li>
              <li>{t("cashier.helpTip4")}</li>
            </ul>
            <button className="help-close" onClick={() => setShowHelp(false)}>{t("common.close")}</button>
          </div>
        </div>
      )}

      {/* ── Logout Modal ── */}
      {showLogout && (
        <div className="pos-modal-overlay">
          <div className="pos-confirm-modal">
            <div className="pos-confirm-title">{t("nav.confirmLogout")}</div>
            <div className="pos-confirm-text">
              {t("cashier.logoutConfirm")}
              {cart.length > 0 && (
                <span className="pos-confirm-warn">
                  &nbsp;{t("cashier.logoutCartWarn", { count: cart.length })}
                </span>
              )}
            </div>
            <div className="pos-confirm-actions">
              <button className="pos-cancel-btn" onClick={() => setShowLogout(false)}>{t("common.cancel")}</button>
              <button className="pos-danger-btn" onClick={handleLogout}>{t("nav.yesLogout")}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Cashier;
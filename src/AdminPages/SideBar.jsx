import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSettings } from "../SettingsContext";
import "./sidebar.css";

export default function SideBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showLogout,  setShowLogout]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { settings } = useSettings();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const navItems = [
    { label: "Menu Management", path: "/admin" },
    { label: "View Sales",      path: "/sales" },
    { label: "View Stock",      path: "/admin/stock/view" },
    { label: "Update Stock",    path: "/admin/stock/update" },
    { label: "Settings",        path: "/admin/settings" },
  ];

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false); 
  };

  return (
    <>
      <div className="mobile-topbar">
        <button
          className={`hamburger-btn${sidebarOpen ? " is-open" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>
        <div className="mobile-logo-name">
          <h1>{settings?.cafeName || "Cafe"}</h1>
          </div>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          {/* <h1>Cafe &amp; Snacks</h1> */}
          <h1>{settings?.cafeName || "Cafe"}</h1>
          <span>Admin Portal</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`sidebar-nav-item${location.pathname === item.path ? " active" : ""}`}
              onClick={() => handleNav(item.path)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button onClick={() => { setShowLogout(true); setSidebarOpen(false); }}>
            → Logout
          </button>
        </div>
      </aside>

      {showLogout && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Confirm Logout</div>
            <p className="confirm-text">Are you sure you want to log out of the admin panel?</p>
            <div className="form-row">
              <button className="btn-danger" onClick={handleLogout}>Yes, Logout</button>
              <button className="btn-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import "./sidebar.css";
import "./settings.css";
import { useSettings } from "../SettingsContext";

function SettingsPage() {
  const { fetchSettings } = useSettings();

  const [form, setForm] = useState({
    cafeName:        "",
    address:         "",
    phone:           "",
    gstin:           "",
    tagline:         "",
    receiptFooter:   "",
    gstEnabled:      true,
    gstPercent:      5,
    discountEnabled: true,
    currency:        "₹",
  });

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab,  setActiveTab]  = useState("cafe");

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setForm({
          cafeName:        data.cafeName        ?? "",
          address:         data.address         ?? "",
          phone:           data.phone           ?? "",
          gstin:           data.gstin           ?? "",
          tagline:         data.tagline         ?? "",
          receiptFooter:   data.receiptFooter   ?? "",
          gstEnabled:      data.gstEnabled      ?? true,
          gstPercent:      data.gstPercent      ?? 5,
          discountEnabled: data.discountEnabled ?? true,
          currency:        data.currency        ?? "₹",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccessMsg("✓ Settings saved successfully!");
        fetchSettings();   // to update globally
      } else {
        setSuccessMsg(" Failed to save settings");
      }
    } catch {
      setSuccessMsg(" Network error");
    }
    setSaving(false);
  };

  const tabs = [
    { key: "cafe",    label: "Cafe Profile" },
    { key: "tax",     label: "Tax & GST" },
    { key: "general", label: "General" },
    { key: "receipt", label: "Receipt" },
  ];

  if (loading) {
    return (
      <div className="settings-page-wrap">
        <Sidebar />
        <div className="settings-main">
          <div className="settings-loading">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page-wrap">

      <Sidebar />

      <div className="settings-main">

        <div className="settings-topbar">
          <div className="settings-topbar-left">
            <div className="settings-topbar-title">Settings</div>
            <div className="settings-topbar-sub">Manage your cafe configuration</div>
          </div>
          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "✓ Save Changes"}
          </button>
        </div>

        <div className="settings-content">

          <div className="settings-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`settings-tab-btn${activeTab === t.key ? " active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "cafe" && (
            <div className="settings-card">
              <div className="settings-card-title">Cafe Profile</div>
              <div className="settings-card-sub">This info appears on receipts and reports</div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Cafe Name</label>
                  <input
                    name="cafeName"
                    value={form.cafeName}
                    onChange={handleChange}
                    placeholder="e.g. Cafe & Snacks"
                  />
                </div>

                <div className="settings-field">
                  <label>Tagline</label>
                  <input
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Fresh Coffee • Tasty Snacks"
                  />
                </div>

                <div className="settings-field settings-field-full">
                  <label>Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. 12, Main Street, Chennai - 600001"
                  />
                </div>

                <div className="settings-field">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="settings-field">
                  <label>GSTIN</label>
                  <input
                    name="gstin"
                    value={form.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 33AAAAA0000A1Z5"
                  />
                </div>
              </div>

            </div>
          )}

          
          {activeTab === "tax" && (
            <div className="settings-card">
              <div className="settings-card-title">Tax & GST Configuration</div>
              <div className="settings-card-sub">Controls how GST is calculated on bills</div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-label">Enable GST</div>
                  <div className="settings-toggle-desc">When enabled, GST is added to every bill</div>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="gstEnabled"
                    checked={form.gstEnabled}
                    onChange={handleChange}
                  />
                  <span className="settings-slider" />
                </label>
              </div>

              {form.gstEnabled && (
                <div className="settings-field settings-gst-field">
                  <label>GST Percentage (%)</label>
                  <div className="settings-number-wrap">
                    <input
                      type="number"
                      name="gstPercent"
                      min="0"
                      max="100"
                      value={form.gstPercent}
                      onChange={handleChange}
                      className="settings-number-input"
                    />
                    <span className="settings-pct-symbol">%</span>
                  </div>
                  <div className="settings-field-hint">
                    Common rates: 5% (restaurant), 12%, 18%
                  </div>
                </div>
              )}
            </div>
          )}

         
          {activeTab === "general" && (
            <div className="settings-card">
              <div className="settings-card-title">General Settings</div>
              <div className="settings-card-sub">Currency and billing preferences</div>

              <div className="settings-field">
                <label>Currency Symbol</label>
                <div className="settings-currency-wrap">
                  {["₹", "$", "€", "£", "¥"].map(c => (
                    <button
                      key={c}
                      className={`settings-currency-btn${form.currency === c ? " active" : ""}`}
                      onClick={() => setForm(prev => ({ ...prev, currency: c }))}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="settings-field-hint">
                  Currently: <strong>{form.currency}</strong> — this symbol appears on all bills and reports
                </div>
              </div>

              <div className="settings-toggle-row" style={{ marginTop: "24px" }}>
                <div className="settings-toggle-info">
                  <div className="settings-toggle-label">Enable Discount Field</div>
                  <div className="settings-toggle-desc">Show the discount % input on the cashier billing screen</div>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    name="discountEnabled"
                    checked={form.discountEnabled}
                    onChange={handleChange}
                  />
                  <span className="settings-slider" />
                </label>
              </div>
            </div>
          )}

          {activeTab === "receipt" && (
            <div className="settings-card">
              <div className="settings-card-title">Receipt Customization</div>
              <div className="settings-card-sub">Customize what appears at the bottom of every receipt</div>

              <div className="settings-field settings-field-full">
                <label>Receipt Footer Message</label>
                <textarea
                  name="receiptFooter"
                  value={form.receiptFooter}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Thank you for visiting! Please come again "
                  className="settings-textarea"
                />
              </div>

            </div>
          )}

        </div>
      </div>

      {successMsg && (
        <div className="settings-toast">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")}>✕</button>
        </div>
      )}

    </div>
  );
}

export default SettingsPage;
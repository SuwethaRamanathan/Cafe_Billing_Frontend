// import { createContext, useContext, useEffect, useState } from "react";

// const SettingsContext = createContext(null);

// export function SettingsProvider({ children }) {
//   const [settings, setSettings] = useState({
//     cafeName:        "Cafe & Snacks",
//     address:         "",
//     phone:           "",
//     gstin:           "",
//     tagline:         "Fresh Coffee • Tasty Snacks",
//     receiptFooter:   "Thank you for visiting! Please come again ",
//     gstEnabled:      true,
//     gstPercent:      5,
//     discountEnabled: true,
//     currency:        "₹",
//   });

//   const fetchSettings = () => {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/settings`)
//       .then(res => res.json())
//       .then(data => setSettings(data))
//       .catch(() => {});  
//       // silently fail — defaults still work
//   };

//   useEffect(() => { 
//     fetchSettings(); 
//   }, []);

//   return (
//     <SettingsContext.Provider value={{ settings, fetchSettings }}>
//       {children}
//     </SettingsContext.Provider>
//   );
// }


// export function useSettings() {
//   return useContext(SettingsContext);
// }  
//    // to use in other components


import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./SideBar";
import "./sidebar.css";
import "./settings.css";
import { useSettings } from "../SettingsContext";

function SettingsPage() {
  const { t, i18n } = useTranslation();
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
    fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
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
    const timer = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timer);
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
        setSuccessMsg("✓ " + t("settings.savedSuccess"));
        fetchSettings();
      } else {
        setSuccessMsg("✗ " + t("settings.saveFailed"));
      }
    } catch {
      setSuccessMsg("✗ " + t("settings.networkError"));
    }
    setSaving(false);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("lang", langCode);
  };

  const tabs = [
    { key: "cafe",     label: t("settings.tabs.cafe") },
    { key: "tax",      label: t("settings.tabs.tax") },
    { key: "general",  label: t("settings.tabs.general") },
    { key: "receipt",  label: t("settings.tabs.receipt") },
    { key: "language", label: t("settings.tabs.language") },
  ];

  const languages = [
    { code: "en", label: "English",  native: "English" },
    { code: "ta", label: "Tamil",    native: "தமிழ்" },
    { code: "hi", label: "Hindi",    native: "हिन्दी" },
  ];

  if (loading) {
    return (
      <div className="settings-page-wrap">
        <Sidebar />
        <div className="settings-main">
          <div className="settings-loading">{t("settings.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page-wrap">

      <Sidebar />

      <div className="settings-main">

        {/* ── Top Bar ── */}
        <div className="settings-topbar">
          <div className="settings-topbar-left">
            <div className="settings-topbar-title">{t("settings.title")}</div>
            <div className="settings-topbar-sub">{t("settings.subtitle")}</div>
          </div>
          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t("settings.savingBtn") : "✓ " + t("settings.saveBtn")}
          </button>
        </div>

        <div className="settings-content">

          {/* ── Tabs ── */}
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`settings-tab-btn${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Cafe Profile Tab ── */}
          {activeTab === "cafe" && (
            <div className="settings-card">
              <div className="settings-card-title">{t("settings.cafe.title")}</div>
              <div className="settings-card-sub">{t("settings.cafe.subtitle")}</div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>{t("settings.cafe.cafeName")}</label>
                  <input
                    name="cafeName"
                    value={form.cafeName}
                    onChange={handleChange}
                    placeholder={t("settings.cafe.cafeNamePlaceholder")}
                  />
                </div>

                <div className="settings-field">
                  <label>{t("settings.cafe.tagline")}</label>
                  <input
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    placeholder={t("settings.cafe.taglinePlaceholder")}
                  />
                </div>

                <div className="settings-field settings-field-full">
                  <label>{t("settings.cafe.address")}</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder={t("settings.cafe.addressPlaceholder")}
                  />
                </div>

                <div className="settings-field">
                  <label>{t("settings.cafe.phone")}</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("settings.cafe.phonePlaceholder")}
                  />
                </div>

                <div className="settings-field">
                  <label>{t("settings.cafe.gstin")}</label>
                  <input
                    name="gstin"
                    value={form.gstin}
                    onChange={handleChange}
                    placeholder={t("settings.cafe.gstinPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Tax & GST Tab ── */}
          {activeTab === "tax" && (
            <div className="settings-card">
              <div className="settings-card-title">{t("settings.tax.title")}</div>
              <div className="settings-card-sub">{t("settings.tax.subtitle")}</div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-label">{t("settings.tax.enableGst")}</div>
                  <div className="settings-toggle-desc">{t("settings.tax.enableGstDesc")}</div>
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
                  <label>{t("settings.tax.gstPercent")}</label>
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
                  <div className="settings-field-hint">{t("settings.tax.gstHint")}</div>
                </div>
              )}
            </div>
          )}

          {/* ── General Tab ── */}
          {activeTab === "general" && (
            <div className="settings-card">
              <div className="settings-card-title">{t("settings.general.title")}</div>
              <div className="settings-card-sub">{t("settings.general.subtitle")}</div>

              <div className="settings-field">
                <label>{t("settings.general.currency")}</label>
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
                  {t("settings.general.currently")}: <strong>{form.currency}</strong> — {t("settings.general.currencyHint")}
                </div>
              </div>

              <div className="settings-toggle-row" style={{ marginTop: "24px" }}>
                <div className="settings-toggle-info">
                  <div className="settings-toggle-label">{t("settings.general.enableDiscount")}</div>
                  <div className="settings-toggle-desc">{t("settings.general.enableDiscountDesc")}</div>
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

          {/* ── Receipt Tab ── */}
          {activeTab === "receipt" && (
            <div className="settings-card">
              <div className="settings-card-title">{t("settings.receipt.title")}</div>
              <div className="settings-card-sub">{t("settings.receipt.subtitle")}</div>

              <div className="settings-field settings-field-full">
                <label>{t("settings.receipt.footer")}</label>
                <textarea
                  name="receiptFooter"
                  value={form.receiptFooter}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t("settings.receipt.footerPlaceholder")}
                  className="settings-textarea"
                />
              </div>
            </div>
          )}

          {/* ── Language Tab ── */}
          {activeTab === "language" && (
            <div className="settings-card">
              <div className="settings-card-title">{t("settings.language.title")}</div>
              <div className="settings-card-sub">{t("settings.language.subtitle")}</div>

              <div className="settings-language-wrap">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`settings-language-btn${i18n.language === lang.code ? " active" : ""}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="settings-language-native">{lang.native}</span>
                    <span className="settings-language-label">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Toast ── */}
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
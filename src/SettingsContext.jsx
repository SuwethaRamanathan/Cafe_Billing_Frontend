import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    cafeName:        "Cafe & Snacks",
    address:         "",
    phone:           "",
    gstin:           "",
    tagline:         "Fresh Coffee • Tasty Snacks",
    receiptFooter:   "Thank you for visiting! Please come again ",
    gstEnabled:      true,
    gstPercent:      5,
    discountEnabled: true,
    currency:        "₹",
  });

  const fetchSettings = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});  
      // silently fail — defaults still work
  };

  useEffect(() => { 
    fetchSettings(); 
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}


export function useSettings() {
  return useContext(SettingsContext);
}  
   // to use in other components
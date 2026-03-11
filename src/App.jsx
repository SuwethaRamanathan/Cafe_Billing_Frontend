import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Cashier from "./Cash/Cashier";
import Admin from "./AdminPages/Admin";
import SalesPage from "./AdminPages/SalesPage";
import ProtectedRoute from "./ProtectedRoute";
import StockPage from "./AdminPages/StockPage";
import SettingsPage from "./AdminPages/SettingsPage";
import { SettingsProvider } from "./SettingsContext";

import SuperAdmin from ".  /AdminPages/Superadmin";

export default function App() {
  return (
    <SettingsProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <Admin/>
    </ProtectedRoute>
  }
/>
  
<Route
 path="/superadmin"
 element={
   <ProtectedRoute role="superadmin">
     <SuperAdmin />
   </ProtectedRoute>
 }
/>

    <Route path="/cashier" element={ 
        <ProtectedRoute role="cashier">
      <Cashier/>  </ProtectedRoute>
  }
/>
        <Route path="/admin/stock/view" element={<StockPage mode="view" />} />
        <Route path="/admin/stock/update" element={<StockPage mode="update" />} />
        <Route path="/sales" element={
  <ProtectedRoute role="admin"><SalesPage /></ProtectedRoute>
} />
       <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
    </SettingsProvider>
  );
}
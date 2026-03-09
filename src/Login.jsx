import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useSettings } from "./SettingsContext";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const { settings } = useSettings();

  const handleLogin = async () => {

    if (!username || !password) {
      setError("Enter email and password");
      return;
    }

    setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: username,
            password: password
          })
        }
      );

      const data = await res.json();


      if (!data.token) {
        setError("Invalid email or password");
        return;
      }

     
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);


      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/cashier");  
      }

  };

  return (

    <div className="login-page">

      <div className="login-image"></div>

      <div className="login-wrapper">

        <h1>Welcome to {settings?.cafeName || "Cafe"} </h1>
        <p>{settings.tagline}</p>

        <div className="login-card">

          <h2>Login</h2>

          {error && (
            <p style={{ color: "red", fontSize: "13px" }}>
              {error}
            </p>
          )}


          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <button onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import "./login.css";
// import { useSettings } from "./SettingsContext";

// export default function Login() {
//   const { t } = useTranslation();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError]       = useState("");
//   const navigate  = useNavigate();
//   const { settings } = useSettings();

//   const handleLogin = async () => {
//     if (!username || !password) {
//       setError(t("login.enterCredentials"));
//       return;
//     }
//     setError("");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: username, password: password })
//     });
//     const data = await res.json();
//     if (!data.token) {
//       setError(t("login.invalidCredentials"));
//       return;
//     }
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);
//     localStorage.setItem("name", data.name);
//     if (data.role === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/cashier");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-image"></div>
//       <div className="login-wrapper">
//         <h1>{t("login.welcome")} {settings?.cafeName || "Cafe"}</h1>
//         <p>{settings.tagline}</p>
//         <div className="login-card">
//           <h2>{t("login.title")}</h2>
//           {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
//           <input
//             type="email"
//             placeholder={t("login.emailPlaceholder")}
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder={t("login.passwordPlaceholder")}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button onClick={handleLogin}>{t("login.loginBtn")}</button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = async () => {

    if (!username || !password) {
      setError("Enter email and password");
      return;
    }

    setError("");

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
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

        <h1>Welcome to Cafe & Snacks </h1>

        <p>Fresh Coffee • Tasty Snacks • Happy Moments</p>


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
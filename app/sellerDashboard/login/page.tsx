"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post("/api/auth/login", {
      email,
      password,
    });

    if (res.data.message === "Login successful") {
      alert("Login successful!");
      console.log(res.data);

      // Redirect to dashboard
      window.location.href = "/sellerDashboard";
    } else {
      alert("Login failed: " + res.data.message);
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed: " + err.response?.data?.message || err.message);
  }
};
  return (
    <div>
      <h2>Seller Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

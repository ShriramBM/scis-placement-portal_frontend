import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CoordinatorLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/coordinator/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/coordinator");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Placement Coordinator Login</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "300px",
  },
};

export default CoordinatorLogin;
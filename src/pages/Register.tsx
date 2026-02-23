import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "MCA",
    stream: "",
    rollNo: "",
    cgpa: "",
    batchYear: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", form);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Student Registration</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="University Email" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

        <select name="department" onChange={handleChange} style={styles.input}>
          <option value="MCA">MCA</option>
          <option value="MTECH">MTECH</option>
        </select>

        {form.department === "MTECH" && (
          <select name="stream" onChange={handleChange} required style={styles.input}>
            <option value="">Select Stream</option>
            <option value="CSE">CSE</option>
            <option value="AI">AI</option>
            <option value="IT">IT</option>
          </select>
        )}

        <input name="rollNo" placeholder="Roll Number" onChange={handleChange} required style={styles.input} />
        <input name="cgpa" type="number" step="0.01" placeholder="CGPA" onChange={handleChange} required style={styles.input} />
        <input name="batchYear" type="number" placeholder="Batch Year" onChange={handleChange} required style={styles.input} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required style={styles.input} />

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  title: {
    color: "white",
    textAlign: "center" as const,
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    padding: "10px",
    backgroundColor: "#22c55e",
    color: "black",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },
  error: {
    color: "#f87171",
    fontSize: "14px",
  },
  success: {
    color: "#4ade80",
    fontSize: "14px",
  },
};

export default Register;
import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CustomSelect = ({ 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Select",
  style = {}
}: { 
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.input,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "12px",
          backgroundColor: "#fff",
        }}
      >
        <span style={{ 
          color: value ? "#000" : "#666",
          fontFamily: "monospace",
          fontWeight: 600,
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ 
          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s ease",
          fontSize: "12px",
        }}>▼</span>
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(name, option.value);
                setIsOpen(false);
              }}
              style={{
                ...styles.dropdownItem,
                backgroundColor: value === option.value ? "#f0f0f0" : "#fff",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === option.value ? "#f0f0f0" : "#fff"}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();

  // Compute current year and set range for batch year (±5 years = 10-year span)
  const currentYear = new Date().getFullYear();
  const minBatchYear = currentYear - 10;
  const maxBatchYear = currentYear;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "MCA",
    stream: "",
    rollNo: "",
    batchYear: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
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

  const departmentOptions = [
    { value: "MCA", label: "MCA" },
    { value: "MTECH", label: "MTECH" },
    { value: "IMTECH", label: "IMTECH" },
  ];

  const streamOptions = [
    { value: "CSE", label: "CSE" },
    { value: "AI", label: "AI" },
    { value: "IT", label: "IT" },
  ];

  // Combined keyframes, responsive styles, and number input spinner removal
  const styleTag = `
    @keyframes popIn {
      0% { transform: scale(0.85) translateY(30px); opacity: 0; }
      100% { transform: scale(1) translateY(0px); opacity: 1; }
    }
    @keyframes fadeSlide {
      0% { opacity: 0; transform: translateY(-8px); }
      100% { opacity: 1; transform: translateY(0px); }
    }
    @keyframes dropdownFade {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Responsive styles for small devices (max-width: 480px) */
    @media (max-width: 480px) {
      .form-row {
        flex-direction: column !important;
        gap: 12px !important;
      }
      .register-card {
        width: 95% !important;
        padding: 20px !important;
      }
      .register-title {
        font-size: 24px !important;
      }
      input, .custom-select-trigger {
        font-size: 14px !important;
        padding: 10px !important;
      }
    }

    /* Hide spinner arrows on number inputs */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  `;

  return (
    <div style={styles.container} className="page-root">
      <form onSubmit={handleSubmit} style={styles.card} className="register-card">
        <h2 style={styles.title} className="register-title">Student Registration</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <style>{styleTag}</style>

        <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="University Email" onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

        <CustomSelect
          name="department"
          value={form.department}
          onChange={handleSelectChange}
          options={departmentOptions}
        />

        {form.department === "MTECH" && (
          <div style={{ animation: "fadeSlide 0.35s ease" }}>
            <CustomSelect
              name="stream"
              value={form.stream}
              onChange={handleSelectChange}
              options={streamOptions}
              placeholder="Select Stream"
            />
          </div>
        )}

        <input
          name="rollNo"
          placeholder="Roll Number"
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Row for phone and batch year - will stack on small screens */}
        <div style={styles.row} className="form-row">
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            style={{ ...styles.input, flex: 1 }}
          />
          <input
            name="batchYear"
            type="number"
            placeholder={String(currentYear)} // Show current year as placeholder
            onChange={handleChange}
            min={minBatchYear}
            max={maxBatchYear}
            title={`Batch year must be between ${minBatchYear} and ${maxBatchYear}`}
            required
            style={{ ...styles.input, flex: 1 }}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0px 0px 0px black";
            e.currentTarget.style.transform = "translate(4px,4px)";
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0px black";
            e.currentTarget.style.transform = "translate(0px,0px)";
            e.currentTarget.style.backgroundColor = "#fff";
          }}
        >
          Register
        </button>

        <p style={styles.prompt}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Login
          </span>
        </p>
        <p style={styles.prompt}>
          <span
            style={styles.link}
            onClick={() => navigate("/")}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            ← Back to Home
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace",
    overflowY: "auto" as const,
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "18px",
    width: "420px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    border: "2px solid black",
    boxShadow: "8px 8px 0px black",
    animation: "popIn 0.4s ease-out",
  },
  title: {
    color: "#000",
    fontSize: "28px",
    fontWeight: "bold" as const,
    fontFamily: "monospace",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid black",
    fontSize: "15px",
    fontFamily: "monospace",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    fontWeight: 600,
    letterSpacing: "0.5px",
    boxSizing: "border-box" as const,
  },
  row: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },
  button: {
    padding: "12px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    boxShadow: "4px 4px 0px black",
    fontSize: "15px",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
    fontFamily: "monospace",
  },
  error: {
    color: "#b91c1c",
    fontSize: "14px",
    minHeight: "18px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  success: {
    color: "#15803d",
    fontSize: "12px",
    minHeight: "18px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  prompt: {
    color: "#333",
    fontSize: "14px",
    textAlign: "center" as const,
    fontFamily: "monospace",
    margin: "8px 0 0",
  },
  link: {
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold" as const,
    textDecoration: "none",
  },
  dropdown: {
    position: "absolute" as const,
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "12px",
    boxShadow: "4px 4px 0px black",
    zIndex: 10,
    overflow: "hidden",
    animation: "dropdownFade 0.2s ease",
  },
  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "15px",
    fontFamily: "monospace",
    fontWeight: 600,
    color: "#000",
    borderBottom: "1px solid #ccc",
    transition: "background-color 0.2s ease",
  },
};

export default Register;
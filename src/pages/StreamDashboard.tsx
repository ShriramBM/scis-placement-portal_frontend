import { useEffect, useState } from "react";
import api from "../services/api";

interface Company {
  id: number;
  name: string;
  description: string;
  package: number;
  department: string;
  streamsAllowed: string[];
  deadline: string;
}

const StreamDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    package: "",
    department: "MTECH",
    streamsAllowed: [] as string[],
    deadline: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await api.get("/company");
    setCompanies(res.data);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStreamsChange = (e: any) => {
    const value = e.target.value;

    setForm({
      ...form,
      streamsAllowed: form.streamsAllowed.includes(value)
        ? form.streamsAllowed.filter((s) => s !== value)
        : [...form.streamsAllowed, value],
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/company/${editingId}`, form);
      setEditingId(null);
    } else {
      await api.post("/company", form);
    }

    resetForm();
    fetchCompanies();
  };

  const handleEdit = (company: Company) => {
    setEditingId(company.id);
    setForm({
      name: company.name,
      description: company.description,
      package: company.package.toString(),
      department: company.department,
      streamsAllowed: company.streamsAllowed,
      deadline: company.deadline.split("T")[0],
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this company?")) return;

    await api.delete(`/company/${id}`);
    fetchCompanies();
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      package: "",
      department: "MTECH",
      streamsAllowed: [],
      deadline: "",
    });
  };

  return (
    <div style={styles.container}>
      <h1>Coordinator Dashboard</h1>

      {/* Add / Edit Company */}
      <form onSubmit={handleSubmit} style={styles.card}>
        <h3>{editingId ? "Edit Company" : "Add Company"}</h3>

        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="package"
          type="number"
          placeholder="Package (LPA)"
          value={form.package}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <label>
            <input
              type="checkbox"
              value="CSE"
              checked={form.streamsAllowed.includes("CSE")}
              onChange={handleStreamsChange}
            />
            CSE
          </label>

          <label>
            <input
              type="checkbox"
              value="AI"
              checked={form.streamsAllowed.includes("AI")}
              onChange={handleStreamsChange}
            />
            AI
          </label>

          <label>
            <input
              type="checkbox"
              value="IT"
              checked={form.streamsAllowed.includes("IT")}
              onChange={handleStreamsChange}
            />
            IT
          </label>
        </div>

        <button type="submit" style={styles.button}>
          {editingId ? "Update Company" : "Add Company"}
        </button>
      </form>

      {/* Company List */}
      <h3 style={{ marginTop: "30px" }}>All Companies</h3>

      {companies.map((company) => (
        <div key={company.id} style={styles.card}>
          <h4>{company.name}</h4>
          <p>{company.description}</p>
          <p>Package: {company.package} LPA</p>
          <p>Streams: {company.streamsAllowed.join(", ")}</p>
          <p>Deadline: {new Date(company.deadline).toDateString()}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => handleEdit(company)}
              style={styles.edit}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(company.id)}
              style={styles.delete}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    padding: "30px",
    color: "white",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    padding: "8px",
    backgroundColor: "#22c55e",
    border: "none",
    cursor: "pointer",
  },
  edit: {
    backgroundColor: "#3b82f6",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
  delete: {
    backgroundColor: "#ef4444",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
};

export default StreamDashboard;
import { useEffect, useState } from "react";
import api from "../../services/api";

interface Company {
  id: number;
  name: string;
  description: string;
  package: number;
  department: string;
  streamsAllowed: string[];
  deadline: string;
}

const StreamHome = () => {
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
    try {
      const res = await api.get("/company");
      setCompanies(res.data);
    } catch (error) {
      alert("Failed to fetch companies");
    }
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

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      package: "",
      department: "MTECH",
      streamsAllowed: [],
      deadline: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/company/${editingId}`, form);
        alert("Company Updated Successfully");
      } else {
        await api.post("/company", form);
        alert("Company Created Successfully");
      }

      resetForm();
      fetchCompanies();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "Failed to save company"
      );
    }
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/company/${id}`);
      alert("Company Deleted Successfully");
      fetchCompanies();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "Failed to delete company"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>
        {editingId ? "Update Company" : "Create Company"}
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="package"
          type="number"
          placeholder="Package (LPA)"
          value={form.package}
          onChange={handleChange}
          required
        />

        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          required
        />

        <div style={{ display: "flex", gap: "15px" }}>
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

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={styles.saveBtn}>
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "30px 0" }} />

      {/* COMPANY LIST */}
      <h2>Company List</h2>

      {companies.map((company) => (
        <div key={company.id} style={styles.card}>
          <h4>{company.name}</h4>
          <p>{company.description}</p>
          <p>Package: {company.package} LPA</p>
          <p>
            Deadline:{" "}
            {new Date(company.deadline).toDateString()}
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleEdit(company)}
              style={styles.editBtn}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(company.id)}
              style={styles.deleteBtn}
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
    backgroundColor: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    maxWidth: "400px",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    padding: "8px",
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#64748b",
    padding: "8px",
    border: "none",
    cursor: "pointer",
  },
  editBtn: {
    backgroundColor: "#3b82f6",
    padding: "6px 10px",
    border: "none",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: "6px 10px",
    border: "none",
    cursor: "pointer",
  },
};

export default StreamHome;
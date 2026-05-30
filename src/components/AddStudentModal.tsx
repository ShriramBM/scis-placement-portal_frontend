import { useEffect, useState } from "react";
import api from "../services/api";
import {
  DEFAULT_STUDENT_PASSWORD,
  getDepartmentLabel,
  getStoredCoordinatorDepartment,
  getStoredCoordinatorStream,
  getStoredProgramLabel,
  getStreamLabel,
} from "../utils/coordinatorProgram";

interface AddStudentModalProps {
  onSuccess?: () => void;
}

const emptyForm = () => ({
  name: "",
  email: "",
  rollNo: "",
  batchYear: "",
});

const AddStudentModal = ({ onSuccess }: AddStudentModalProps) => {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [programLabel, setProgramLabel] = useState(getStoredProgramLabel());
  const [department, setDepartment] = useState(getStoredCoordinatorDepartment());
  const [stream, setStream] = useState(getStoredCoordinatorStream());

  useEffect(() => {
    if (!open) return;

    setProgramLabel(getStoredProgramLabel());
    setDepartment(getStoredCoordinatorDepartment());
    setStream(getStoredCoordinatorStream());
    setError("");
    setSuccess("");
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setOpen(false);
    setForm(emptyForm());
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/student", form);
      setSuccess(
        `Account created for ${form.name}. They can log in with the default password and complete their profile.`
      );
      setForm(emptyForm());
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String(err.response.data.message)
          : "Failed to create student account";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const showStream = department === "MTECH" && stream;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={styles.openBtn}>
        + Add Student
      </button>

      {open && (
        <div style={styles.overlay} onClick={closeModal}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-student-title"
          >
            <div style={styles.modalHeader}>
              <div>
                <h3 id="add-student-title" style={styles.title}>
                  Add Student Account
                </h3>
                <p style={styles.subTitle}>
                  Adding students for <strong>{programLabel}</strong>. They will sign in with the default password and can update the rest of their profile later.
                </p>
              </div>
              <button type="button" onClick={closeModal} style={styles.closeBtn} aria-label="Close">
                ×
              </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label htmlFor="add-student-name" style={styles.label}>
                  Full Name
                </label>
                <input
                  id="add-student-name"
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="add-student-email" style={styles.label}>
                  University Email
                </label>
                <input
                  id="add-student-email"
                  name="email"
                  type="email"
                  placeholder="name@uohyd.ac.in"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="add-student-rollNo" style={styles.label}>
                  Registration Number
                </label>
                <input
                  id="add-student-rollNo"
                  name="rollNo"
                  placeholder="Enter registration / roll number"
                  value={form.rollNo}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label htmlFor="add-student-department" style={styles.label}>
                    Department
                  </label>
                  <input
                    id="add-student-department"
                    type="text"
                    value={getDepartmentLabel(department)}
                    readOnly
                    style={{ ...styles.input, ...styles.readOnlyInput }}
                  />
                </div>

                {showStream && (
                  <div style={styles.field}>
                    <label htmlFor="add-student-stream" style={styles.label}>
                      Stream
                    </label>
                    <input
                      id="add-student-stream"
                      type="text"
                      value={getStreamLabel(stream)}
                      readOnly
                      style={{ ...styles.input, ...styles.readOnlyInput }}
                    />
                  </div>
                )}
              </div>

              <div style={styles.field}>
                <label htmlFor="add-student-batchYear" style={styles.label}>
                  Batch Year
                </label>
                <input
                  id="add-student-batchYear"
                  name="batchYear"
                  type="number"
                  placeholder={String(currentYear)}
                  value={form.batchYear}
                  onChange={handleChange}
                  min={currentYear - 10}
                  max={currentYear + 1}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="add-student-password" style={styles.label}>
                  Default Password
                </label>
                <input
                  id="add-student-password"
                  type="text"
                  value={DEFAULT_STUDENT_PASSWORD}
                  readOnly
                  style={{ ...styles.input, ...styles.readOnlyInput }}
                />
                <p style={styles.hint}>Same temporary password for all new students (for now).</p>
              </div>

              <div style={styles.actions}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>
                  {success ? "Close" : "Cancel"}
                </button>
                {!success && (
                  <button type="submit" disabled={submitting} style={styles.submitBtn}>
                    {submitting ? "Creating..." : "Create Account"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  openBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1a365d",
    color: "#fff",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a365d",
  },
  subTitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "28px",
    lineHeight: 1,
    color: "#64748b",
    cursor: "pointer",
    padding: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "13px",
    outline: "none",
  },
  readOnlyInput: {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    cursor: "not-allowed",
  },
  hint: {
    margin: 0,
    fontSize: "11px",
    color: "#94a3b8",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "4px",
  },
  cancelBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#334155",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1a365d",
    color: "#fff",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },
  error: {
    margin: "0 0 12px",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: 600,
  },
  success: {
    margin: "0 0 12px",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: 600,
  },
};

export default AddStudentModal;

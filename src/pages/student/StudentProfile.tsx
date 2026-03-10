import { useEffect, useState } from "react";
import api from "../../services/api";

interface AcademicRecord {
  id: number;
  level: "TENTH" | "TWELFTH" | "DIPLOMA" | "GRADUATION" | "POSTGRADUATION";
  institution_school_name: string;
  board: string | null;
  university: string | null;
  yearOfPassing: number;
  percentage_cgpa: number;
}

interface Profile {
  id: number;
  userId: number;
  rollNo: string;
  department: string;
  stream: string | null;
  phone: string;
  alternateEmail: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: string | null;
  category: string | null;
  permanentAddress: string;
  currentAddress: string;
  preferredJobLocation: string | null;
  carreerType: string | null;
  batchYear: number;
  resumeUrl: string | null;
  AcadamicDetails: AcademicRecord[];
}

type Tab = "personal" | "academic";

const DEPARTMENT_LABELS: Record<string, string> = {
  MCA: "Master of Computer Applications (MCA)",
  MTECH: "M.Tech",
  IMTECH: "Integrated M.Tech",
};

const LEVEL_LABELS: Record<string, string> = {
  TENTH: "X",
  TWELFTH: "XII",
  DIPLOMA: "Diploma",
  GRADUATION: "B.Tech / Graduation",
  POSTGRADUATION: "M.Tech / Post Graduation",
};

const formatDateForInput = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const StudentProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [edited, setEdited] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/me");
      setProfile(res.data);
      setEdited(res.data);
      if (res.data.permanentAddress && res.data.currentAddress &&
          res.data.permanentAddress === res.data.currentAddress) {
        setSameAddress(true);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!edited) return;
    const { name, value } = e.target;
    const updates: Partial<Profile> = { [name]: value };
    if (name === "currentAddress" && sameAddress) {
      updates.permanentAddress = value;
    }
    setEdited({ ...edited, ...updates });
  };

  const handleSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked && edited) {
      setEdited({ ...edited, permanentAddress: edited.currentAddress });
    }
  };

  const handleReset = () => {
    if (profile) setEdited({ ...profile });
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    if (!edited) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await api.put("/student/me", {
        phone: edited.phone,
        alternateEmail: edited.alternateEmail,
        linkedInUrl: edited.linkedInUrl,
        githubUrl: edited.githubUrl,
        gender: edited.gender,
        dob: edited.dob,
        category: edited.category,
        permanentAddress: edited.permanentAddress,
        currentAddress: edited.currentAddress,
        preferredJobLocation: edited.preferredJobLocation,
        carreerType: edited.carreerType,
        stream: edited.stream,
      });
      setProfile(res.data.profile);
      setEdited(res.data.profile);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={s.pageWrapper}>
        <div style={s.loadingBox}>
          <div style={s.spinner} />
          <p style={{ color: "#666", fontSize: 15, marginTop: 12 }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!edited) {
    return (
      <div style={s.pageWrapper}>
        <div style={{ padding: 40, textAlign: "center", color: "#ef4444", fontSize: 16 }}>
          Failed to load profile.
        </div>
      </div>
    );
  }

  const deptLabel = edited.stream
    ? `${DEPARTMENT_LABELS[edited.department] || edited.department} / ${edited.stream}`
    : DEPARTMENT_LABELS[edited.department] || edited.department;

  const schoolRecords = (edited.AcadamicDetails || [])
    .filter(r => r.level === "TENTH" || r.level === "TWELFTH")
    .sort((a, b) => (a.level === "TWELFTH" ? -1 : b.level === "TWELFTH" ? 1 : 0));

  const currentDegree = (edited.AcadamicDetails || [])
    .filter(r => r.level === "POSTGRADUATION");

  const priorEducation = (edited.AcadamicDetails || [])
    .filter(r => r.level === "GRADUATION" || r.level === "DIPLOMA");

  return (
    <div style={s.pageWrapper}>
      <style>{cssAnimations}</style>

      {/* Breadcrumb */}
      <div style={s.breadcrumb}>
        <span style={{ color: "#888" }}>Profile</span>
        <span style={{ color: "#ccc", margin: "0 8px" }}>/</span>
        <span style={{ color: "#333", fontWeight: 500 }}>
          {activeTab === "personal" ? "Personal Information" : "Academic Information"}
        </span>
      </div>

      {/* Back arrow */}
      <div
        style={s.backArrow}
        onClick={() => window.history.back()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        <div
          style={{
            ...s.tab,
            ...(activeTab === "personal" ? s.tabActive : {}),
          }}
          onClick={() => setActiveTab("personal")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={activeTab === "personal" ? "#1a73e8" : "#888"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginRight: 8, flexShrink: 0 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Personal Information
        </div>
        <div
          style={{
            ...s.tab,
            ...(activeTab === "academic" ? s.tabActive : {}),
          }}
          onClick={() => setActiveTab("academic")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={activeTab === "academic" ? "#1a73e8" : "#888"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginRight: 8, flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h10M7 12h10M7 17h6" />
          </svg>
          Academic Information
        </div>
      </div>

      {/* Message toast */}
      {message.text && (
        <div style={{
          ...s.toast,
          backgroundColor: message.type === "success" ? "#e8f5e9" : "#fce4ec",
          color: message.type === "success" ? "#2e7d32" : "#c62828",
        }}>
          {message.text}
        </div>
      )}

      {/* ─── Personal Information Tab ─── */}
      {activeTab === "personal" && (
        <div style={s.card}>
          <div style={s.statusBadge}>Profile Information</div>

          {/* Roll Number */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Roll Number</label>
            <input value={edited.rollNo} disabled style={{ ...s.input, ...s.disabledInput }} />
          </div>

          {/* Department & Phone */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Department</label>
              <input value={deptLabel} disabled style={{ ...s.input, ...s.disabledInput }} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Phone Number</label>
              <input
                name="phone"
                value={edited.phone}
                onChange={handleChange}
                style={s.input}
                placeholder="+91 XXXXX-XXXXX"
              />
            </div>
          </div>

          {/* Alternate Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Alternate Email ID</label>
            <input
              name="alternateEmail"
              value={edited.alternateEmail || ""}
              onChange={handleChange}
              style={s.input}
              placeholder="alternate@gmail.com"
            />
          </div>

          {/* LinkedIn & Github */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>LinkedIn Link</label>
              <input
                name="linkedInUrl"
                value={edited.linkedInUrl || ""}
                onChange={handleChange}
                style={s.input}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Github or Portfolio Link</label>
              <input
                name="githubUrl"
                value={edited.githubUrl || ""}
                onChange={handleChange}
                style={s.input}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {/* DOB & Gender */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Date of Birth</label>
              <input
                name="dob"
                type="date"
                value={formatDateForInput(edited.dob)}
                onChange={handleChange}
                style={s.input}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Gender</label>
              <select
                name="gender"
                value={edited.gender}
                onChange={handleChange}
                style={s.select}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Career Type & Category */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Career Type</label>
              <select
                name="carreerType"
                value={edited.carreerType || ""}
                onChange={handleChange}
                style={s.select}
              >
                <option value="">Select</option>
                <option value="Placement">Placement</option>
                <option value="Research">Research</option>
                <option value="Higher Studies">Higher Studies</option>
                <option value="Undecided">Undecided</option>
              </select>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Category</label>
              <select
                name="category"
                value={edited.category || ""}
                onChange={handleChange}
                style={s.select}
              >
                <option value="">Select</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          {/* Batch Year & Preferred Location */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Batch Year</label>
              <input
                value={edited.batchYear}
                disabled
                style={{ ...s.input, ...s.disabledInput }}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Preferred Job Location</label>
              <input
                name="preferredJobLocation"
                value={edited.preferredJobLocation || ""}
                onChange={handleChange}
                style={s.input}
                placeholder="City, State"
              />
            </div>
          </div>

          {/* Postal Address */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Postal Address</label>
            <input
              name="currentAddress"
              value={edited.currentAddress}
              onChange={handleChange}
              style={s.input}
              placeholder="Current postal address"
            />
          </div>

          {/* Permanent Address */}
          <div style={s.fieldGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={s.label}>Permanent Address</label>
              <label style={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={(e) => handleSameAddress(e.target.checked)}
                  style={{ accentColor: "#1a73e8", cursor: "pointer", width: 15, height: 15 }}
                />
                Same as Postal Address
              </label>
            </div>
            <input
              name="permanentAddress"
              value={edited.permanentAddress}
              onChange={handleChange}
              disabled={sameAddress}
              style={{ ...s.input, ...(sameAddress ? s.disabledInput : {}) }}
              placeholder="Permanent address"
            />
          </div>

          {/* Resume Link */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Resume Link</label>
            <input
              name="resumeUrl"
              value={edited.resumeUrl || ""}
              onChange={handleChange}
              style={s.input}
              placeholder="https://drive.google.com/..."
            />
          </div>

          {/* Action Buttons */}
          <div style={s.buttonRow}>
            <button type="button" onClick={handleReset} style={s.resetBtn}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d32f2f"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#d32f2f"; }}
            >
              Reset
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={s.saveBtn}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = "#1557b0"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#1a73e8"; }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ─── Academic Information Tab ─── */}
      {activeTab === "academic" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>

          {/* Schooling Information */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>Schooling Information</h3>

            {/* Table header */}
            <div style={s.tableHeader}>
              <div style={{ width: 50 }} />
              <div style={{ flex: 2 }}>Board</div>
              <div style={{ flex: 3 }}>School</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>CGPA/Percentage</div>
              <div style={{ flex: 1, textAlign: "center" as const }}>Year</div>
            </div>

            {schoolRecords.length > 0 ? schoolRecords.map(rec => (
              <div key={rec.id} style={s.tableRow}>
                <div style={{ width: 50, fontWeight: 700, fontSize: 13, color: "#333" }}>
                  {LEVEL_LABELS[rec.level]}
                </div>
                <div style={{ flex: 2 }}>
                  <input value={rec.board || "-"} disabled style={{ ...s.cellInput, ...s.disabledInput }} />
                </div>
                <div style={{ flex: 3 }}>
                  <input value={rec.institution_school_name} disabled style={{ ...s.cellInput, ...s.disabledInput }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <input value={rec.percentage_cgpa} disabled style={{ ...s.cellInput, ...s.disabledInput, textAlign: "center" as const }} />
                </div>
                <div style={{ flex: 1 }}>
                  <input value={rec.yearOfPassing} disabled style={{ ...s.cellInput, ...s.disabledInput, textAlign: "center" as const }} />
                </div>
              </div>
            )) : (
              <p style={s.emptyText}>No schooling records found.</p>
            )}
          </div>

          {/* Current Degree */}
          <div style={{ ...s.card, marginTop: 20 }}>
            <h3 style={s.sectionTitle}>Current Degree</h3>

            <div style={s.tableHeader}>
              <div style={{ flex: 4 }}>Degree</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>CGPA</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>Passing Year</div>
            </div>

            {currentDegree.length > 0 ? currentDegree.map(rec => (
              <div key={rec.id} style={s.tableRow}>
                <div style={{ flex: 4 }}>
                  <input value={deptLabel} disabled style={{ ...s.cellInput, ...s.disabledInput }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <input value={rec.percentage_cgpa} disabled style={{ ...s.cellInput, ...s.disabledInput, textAlign: "center" as const }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <input value={rec.yearOfPassing} disabled style={{ ...s.cellInput, ...s.disabledInput, textAlign: "center" as const }} />
                </div>
              </div>
            )) : (
              <p style={s.emptyText}>No current degree record found.</p>
            )}
          </div>

          {/* Prior Education */}
          {(edited.department === "MTECH" || edited.department === "IMTECH") && (
            <div style={{ ...s.card, marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ ...s.sectionTitle, marginBottom: 0 }}>
                  Education details prior to University (Only for P.G. & Ph.D Students)
                </h3>
              </div>

              {priorEducation.length > 0 ? priorEducation.map(rec => (
                <div key={rec.id} style={s.priorBlock}>
                  <div style={s.row}>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Degree</label>
                      <input value={LEVEL_LABELS[rec.level] || rec.level} disabled style={{ ...s.input, ...s.disabledInput }} />
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>CGPA/Percentage</label>
                      <input value={rec.percentage_cgpa} disabled style={{ ...s.input, ...s.disabledInput }} />
                    </div>
                  </div>
                  <div style={{ ...s.row, marginTop: 12 }}>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Institute</label>
                      <input value={rec.institution_school_name} disabled style={{ ...s.input, ...s.disabledInput }} />
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Passing Year</label>
                      <input value={rec.yearOfPassing} disabled style={{ ...s.input, ...s.disabledInput }} />
                    </div>
                  </div>
                </div>
              )) : (
                <p style={s.emptyText}>No prior education records found.</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ ...s.buttonRow, marginTop: 24 }}>
            <button type="button" onClick={handleReset} style={s.resetBtn}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#d32f2f"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#d32f2f"; }}
            >
              Reset
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={s.saveBtn}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = "#1557b0"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#1a73e8"; }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const cssAnimations = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const s: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    padding: "24px 32px",
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    color: "#333",
    overflowY: "auto",
  },
  breadcrumb: {
    fontSize: 14,
    marginBottom: 12,
  },
  backArrow: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 16,
    transition: "background-color 0.2s",
  },
  tabBar: {
    display: "flex",
    borderBottom: "2px solid #e0e0e0",
    marginBottom: 24,
    gap: 0,
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 0",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    color: "#888",
    borderBottom: "3px solid transparent",
    marginBottom: -2,
    transition: "all 0.2s ease",
    userSelect: "none",
  },
  tabActive: {
    color: "#1a73e8",
    borderBottomColor: "#1a73e8",
    fontWeight: 600,
  },
  toast: {
    padding: "10px 16px",
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    animation: "fadeIn 0.3s ease",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "28px 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #e8e8e8",
    animation: "fadeIn 0.3s ease",
  },
  statusBadge: {
    color: "#2e7d32",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 24,
  },
  row: {
    display: "flex",
    gap: 20,
  },
  fieldGroup: {
    flex: 1,
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #d0d5dd",
    backgroundColor: "#fff",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #d0d5dd",
    backgroundColor: "#fff",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "auto",
  },
  disabledInput: {
    backgroundColor: "#f0f2f5",
    color: "#555",
    cursor: "not-allowed",
    border: "1px solid #e0e0e0",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#555",
    cursor: "pointer",
    fontWeight: 400,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #eee",
  },
  resetBtn: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 6,
    border: "2px solid #d32f2f",
    backgroundColor: "#fff",
    color: "#d32f2f",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveBtn: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#1a73e8",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Academic tab styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#222",
    marginBottom: 16,
    marginTop: 0,
  },
  tableHeader: {
    display: "flex",
    gap: 12,
    padding: "10px 8px",
    borderBottom: "2px solid #e0e0e0",
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
  },
  tableRow: {
    display: "flex",
    gap: 12,
    padding: "10px 8px",
    alignItems: "center",
    borderBottom: "1px solid #f0f0f0",
  },
  cellInput: {
    width: "100%",
    padding: "8px 10px",
    fontSize: 13,
    borderRadius: 5,
    border: "1px solid #d0d5dd",
    backgroundColor: "#fff",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
  },
  priorBlock: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: "1px solid #e0e0e0",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    padding: "16px 0",
    textAlign: "center",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #e0e0e0",
    borderTopColor: "#1a73e8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default StudentProfile;

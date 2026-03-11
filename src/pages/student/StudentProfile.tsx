import { useEffect, useState } from "react";
import api from "../../services/api";

type AcadLevel = "TENTH" | "TWELFTH" | "DIPLOMA" | "GRADUATION" | "POSTGRADUATION";

interface AcademicRecord {
  id: number;
  level: AcadLevel;
  institution_school_name: string;
  board: string | null;
  university: string | null;
  yearOfPassing: number;
  percentage_cgpa: number;
}

const emptyAcademic = (
  level: AcadLevel
): AcademicRecord => ({
  id: 0,
  level,
  institution_school_name: "",
  board: null,
  university: null,
  yearOfPassing: 0,
  percentage_cgpa: 0,
});

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

  const ensureAcademicPlaceholders = (details: AcademicRecord[]): AcademicRecord[] => {
    const byLevel = (level: AcadLevel) =>
      details.find((r) => r.level === level) || emptyAcademic(level);
    const tenth = byLevel("TENTH");
    const twelfth = byLevel("TWELFTH");
    const postGrad = details.find((r) => r.level === "POSTGRADUATION") || emptyAcademic("POSTGRADUATION");
    const prior = details.filter((r) => r.level === "GRADUATION" || r.level === "DIPLOMA");
    return [tenth, twelfth, postGrad, ...prior];
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/student/me");
      const data = res.data;
      const withAcademic = {
        ...data,
        AcadamicDetails: ensureAcademicPlaceholders(data.AcadamicDetails || []),
      };
      setProfile(withAcademic);
      setEdited(withAcademic);
      if (data.permanentAddress && data.currentAddress &&
          data.permanentAddress === data.currentAddress) {
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

  const updateSchoolRecord = (level: "TENTH" | "TWELFTH", field: keyof AcademicRecord, value: string | number | null) => {
    if (!edited) return;
    const list = [...(edited.AcadamicDetails || [])];
    const idx = list.findIndex((r) => r.level === level);
    const rec = idx >= 0 ? list[idx] : emptyAcademic(level);
    const updated = { ...rec, [field]: value };
    const next = idx >= 0 ? list.map((r, i) => (i === idx ? updated : r)) : [...list, updated];
    setEdited({ ...edited, AcadamicDetails: next });
  };

  const updateCurrentDegree = (field: keyof AcademicRecord, value: string | number | null) => {
    if (!edited) return;
    const list = [...(edited.AcadamicDetails || [])];
    const idx = list.findIndex((r) => r.level === "POSTGRADUATION");
    const rec = idx >= 0 ? list[idx] : emptyAcademic("POSTGRADUATION");
    const updated = { ...rec, [field]: value };
    const next = idx >= 0 ? list.map((r, i) => (i === idx ? updated : r)) : [...list, updated];
    setEdited({ ...edited, AcadamicDetails: next });
  };

  const updatePriorRecord = (priorIndex: number, field: keyof AcademicRecord, value: string | number | null) => {
    if (!edited) return;
    const list = [...(edited.AcadamicDetails || [])];
    const priorIndices = list
      .map((r, i) => (r.level === "GRADUATION" || r.level === "DIPLOMA" ? i : -1))
      .filter((i) => i >= 0);
    const targetIndex = priorIndices[priorIndex];
    if (targetIndex == null) return;
    const next = list.map((r, i) =>
      i === targetIndex ? { ...r, [field]: value } : r
    );
    setEdited({ ...edited, AcadamicDetails: next });
  };

  const addPriorDegree = () => {
    if (!edited) return;
    const newRec = emptyAcademic("GRADUATION");
    setEdited({ ...edited, AcadamicDetails: [...(edited.AcadamicDetails || []), newRec] });
  };

  const removePriorDegree = (priorIndex: number) => {
    if (!edited) return;
    const list = edited.AcadamicDetails || [];
    const priorIndices = list
      .map((r, i) => (r.level === "GRADUATION" || r.level === "DIPLOMA" ? i : -1))
      .filter((i) => i >= 0);
    const targetIndex = priorIndices[priorIndex];
    if (targetIndex == null) return;
    const next = list.filter((_, i) => i !== targetIndex);
    setEdited({ ...edited, AcadamicDetails: next });
  };

  const handleSave = async () => {
    if (!edited) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      if (activeTab === "personal") {
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
        const data = res.data?.profile ?? res.data;
        const withAcademic = {
          ...data,
          AcadamicDetails: ensureAcademicPlaceholders(data.AcadamicDetails || []),
        };
        setProfile(withAcademic);
        setEdited(withAcademic);
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else if (activeTab === "academic") {
        const details = edited.AcadamicDetails || [];
        const payload = details.map((r) => ({
          level: r.level,
          institution_school_name: r.institution_school_name || "",
          board: r.board ?? undefined,
          university: r.university ?? undefined,
          yearOfPassing: Number(r.yearOfPassing) || 0,
          percentage_cgpa: Number(r.percentage_cgpa) || 0,
        }));
        await api.put("/student/me/academic", { academicDetails: payload });
        const withAcademic = {
          ...edited,
          AcadamicDetails: ensureAcademicPlaceholders(details),
        };
        setProfile(withAcademic);
        setEdited(withAcademic);
        setMessage({ type: "success", text: "Academic information updated successfully" });
      }
    } catch {
      setMessage({ type: "error", text: activeTab === "academic" ? "Failed to update academic information" : "Failed to update profile" });
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

  const academicList = edited.AcadamicDetails || [];
  const tenthRec = academicList.find((r) => r.level === "TENTH") || emptyAcademic("TENTH");
  const twelfthRec = academicList.find((r) => r.level === "TWELFTH") || emptyAcademic("TWELFTH");
  const currentDegreeRec = academicList.find((r) => r.level === "POSTGRADUATION") || emptyAcademic("POSTGRADUATION");
  const priorEducation = academicList.filter((r) => r.level === "GRADUATION" || r.level === "DIPLOMA");

  return (
    <div style={s.pageWrapper}>
      <style>{cssAnimations}</style>

      {/* Breadcrumb */}
      <div style={s.breadcrumb}>
        <span style={{ color: "#555" }}>Profile</span>
        <span style={{ color: "#999", margin: "0 8px" }}>/</span>
        <span style={{ color: "#000", fontWeight: 700 }}>
          {activeTab === "personal" ? "Personal Information" : "Academic Information"}
        </span>
      </div>

      {/* Back arrow */}
      <div
        style={s.backArrow}
        onClick={() => window.history.back()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            stroke={activeTab === "personal" ? "#000" : "#555"}
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
            stroke={activeTab === "academic" ? "#000" : "#555"}
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
          backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
          color: message.type === "success" ? "#15803d" : "#b91c1c",
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
                  style={{ accentColor: "#000", cursor: "pointer", width: 15, height: 15 }}
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
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0px 0px 0px black"; e.currentTarget.style.transform = "translate(4px,4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "4px 4px 0px black"; e.currentTarget.style.transform = "translate(0,0)"; }}
            >
              Reset
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={s.saveBtn}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.boxShadow = "0px 0px 0px #333"; e.currentTarget.style.transform = "translate(4px,4px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "4px 4px 0px #333"; e.currentTarget.style.transform = "translate(0,0)"; }}
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

            <div style={s.tableHeader}>
              <div style={{ width: 50 }} />
              <div style={{ flex: 2 }}>Board</div>
              <div style={{ flex: 3 }}>School</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>CGPA/Percentage</div>
              <div style={{ flex: 1, textAlign: "center" as const }}>Year</div>
            </div>

            {/* XII row */}
            <div style={s.tableRow}>
              <div style={{ width: 50, fontWeight: 700, fontSize: 13, color: "#333" }}>XII</div>
              <div style={{ flex: 2 }}>
                <input
                  value={twelfthRec.board ?? ""}
                  onChange={(e) => updateSchoolRecord("TWELFTH", "board", e.target.value || null)}
                  style={s.cellInput}
                  placeholder="Board"
                />
              </div>
              <div style={{ flex: 3 }}>
                <input
                  value={twelfthRec.institution_school_name}
                  onChange={(e) => updateSchoolRecord("TWELFTH", "institution_school_name", e.target.value)}
                  style={s.cellInput}
                  placeholder="School"
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <input
                  type="text"
                  value={twelfthRec.percentage_cgpa || ""}
                  onChange={(e) => updateSchoolRecord("TWELFTH", "percentage_cgpa", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="e.g. 8.75"
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={twelfthRec.yearOfPassing || ""}
                  onChange={(e) => updateSchoolRecord("TWELFTH", "yearOfPassing", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="Year"
                />
              </div>
            </div>

            {/* X row */}
            <div style={s.tableRow}>
              <div style={{ width: 50, fontWeight: 700, fontSize: 13, color: "#333" }}>X</div>
              <div style={{ flex: 2 }}>
                <input
                  value={tenthRec.board ?? ""}
                  onChange={(e) => updateSchoolRecord("TENTH", "board", e.target.value || null)}
                  style={s.cellInput}
                  placeholder="Board"
                />
              </div>
              <div style={{ flex: 3 }}>
                <input
                  value={tenthRec.institution_school_name}
                  onChange={(e) => updateSchoolRecord("TENTH", "institution_school_name", e.target.value)}
                  style={s.cellInput}
                  placeholder="School"
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <input
                  type="text"
                  value={tenthRec.percentage_cgpa || ""}
                  onChange={(e) => updateSchoolRecord("TENTH", "percentage_cgpa", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="e.g. 9.50"
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={tenthRec.yearOfPassing || ""}
                  onChange={(e) => updateSchoolRecord("TENTH", "yearOfPassing", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="Year"
                />
              </div>
            </div>
          </div>

          {/* Current Degree */}
          <div style={{ ...s.card, marginTop: 20 }}>
            <h3 style={s.sectionTitle}>Current Degree</h3>

            <div style={s.tableHeader}>
              <div style={{ flex: 4 }}>Degree</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>CGPA</div>
              <div style={{ flex: 1.5, textAlign: "center" as const }}>Passing Year</div>
            </div>

            <div style={s.tableRow}>
              <div style={{ flex: 4 }}>
                <input value={deptLabel} disabled style={{ ...s.cellInput, ...s.disabledInput }} />
              </div>
              <div style={{ flex: 1.5 }}>
                <input
                  type="text"
                  value={currentDegreeRec.percentage_cgpa || ""}
                  onChange={(e) => updateCurrentDegree("percentage_cgpa", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="e.g. 7.48"
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <input
                  type="text"
                  value={currentDegreeRec.yearOfPassing || ""}
                  onChange={(e) => updateCurrentDegree("yearOfPassing", e.target.value ? Number(e.target.value) : 0)}
                  style={{ ...s.cellInput, textAlign: "center" as const }}
                  placeholder="e.g. 2026"
                />
              </div>
            </div>
          </div>

          {/* Prior Education (P.G. & Ph.D) – all departments can add prior details */}
          <div style={{ ...s.card, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ ...s.sectionTitle, marginBottom: 0 }}>
                Education details prior to UOH (Only for P.G. & Ph.D Students)
              </h3>
              <button
                type="button"
                onClick={addPriorDegree}
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 8,
                  border: "2px solid black",
                  backgroundColor: "#000",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  boxShadow: "4px 4px 0px #333",
                }}
              >
                Add Degree
              </button>
            </div>

            {priorEducation.length === 0 ? (
              <p style={s.emptyText}>No prior education added. Click &quot;Add Degree&quot; to add.</p>
            ) : (
              priorEducation.map((rec, idx) => (
                <div key={rec.id || `prior-${idx}`} style={s.priorCard}>
                  <div style={s.row}>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Degree</label>
                      <input
                        value={rec.university ?? ""}
                        onChange={(e) => updatePriorRecord(idx, "university", e.target.value || null)}
                        style={s.input}
                        placeholder="e.g. B.Tech Computer Science & Engineering"
                      />
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Institute</label>
                      <input
                        value={rec.institution_school_name}
                        onChange={(e) => updatePriorRecord(idx, "institution_school_name", e.target.value)}
                        style={s.input}
                        placeholder="e.g. JNTUA College of Engineering, Pulivendula"
                      />
                    </div>
                  </div>
                  <div style={{ ...s.row, marginTop: 12, alignItems: "flex-end" }}>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>CGPA/Percentage</label>
                      <input
                        type="text"
                        value={rec.percentage_cgpa || ""}
                        onChange={(e) => updatePriorRecord(idx, "percentage_cgpa", e.target.value ? Number(e.target.value) : 0)}
                        style={s.input}
                        placeholder="e.g. 7.14"
                      />
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Passing Year</label>
                      <input
                        type="text"
                        value={rec.yearOfPassing || ""}
                        onChange={(e) => updatePriorRecord(idx, "yearOfPassing", e.target.value ? Number(e.target.value) : 0)}
                        style={s.input}
                        placeholder="e.g. 2023"
                      />
                    </div>
                    <div style={{ flex: 0, marginLeft: "auto", paddingBottom: 6 }}>
                      <button
                        type="button"
                        onClick={() => removePriorDegree(idx)}
                        style={s.deletePriorBtn}
                        title="Delete degree"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ ...s.buttonRow, marginTop: 24 }}>
            <button type="button" onClick={handleReset} style={s.resetBtn}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0px 0px 0px black"; e.currentTarget.style.transform = "translate(4px,4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "4px 4px 0px black"; e.currentTarget.style.transform = "translate(0,0)"; }}
            >
              Reset
            </button>
            <button type="button" onClick={handleSave} disabled={saving} style={s.saveBtn}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.boxShadow = "0px 0px 0px #333"; e.currentTarget.style.transform = "translate(4px,4px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "4px 4px 0px #333"; e.currentTarget.style.transform = "translate(0,0)"; }}
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
    backgroundColor: "#f2f2f2",
    minHeight: "100vh",
    padding: "24px 32px",
    fontFamily: "monospace",
    color: "#000",
    overflowY: "auto",
  },
  breadcrumb: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: "monospace",
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
    border: "2px solid black",
    backgroundColor: "#fff",
  },
  tabBar: {
    display: "flex",
    borderBottom: "2px solid black",
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
    fontWeight: 600,
    color: "#555",
    borderBottom: "3px solid transparent",
    marginBottom: -2,
    transition: "all 0.2s ease",
    userSelect: "none",
    fontFamily: "monospace",
  },
  tabActive: {
    color: "#000",
    borderBottomColor: "#000",
    fontWeight: 700,
  },
  toast: {
    padding: "10px 16px",
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    animation: "fadeIn 0.3s ease",
    border: "2px solid black",
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: "28px 32px",
    boxShadow: "8px 8px 0px black",
    border: "2px solid black",
    animation: "fadeIn 0.3s ease",
  },
  statusBadge: {
    color: "#000",
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 24,
    fontFamily: "monospace",
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
    fontWeight: 700,
    color: "#000",
    marginBottom: 6,
    fontFamily: "monospace",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "auto",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#555",
    cursor: "not-allowed",
    border: "2px solid #999",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#000",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "monospace",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTop: "2px solid #e0e0e0",
  },
  resetBtn: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px black",
  },
  saveBtn: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px #333",
  },

  // Academic tab styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#000",
    marginBottom: 16,
    marginTop: 0,
    fontFamily: "monospace",
  },
  tableHeader: {
    display: "flex",
    gap: 12,
    padding: "10px 8px",
    borderBottom: "2px solid black",
    fontSize: 13,
    fontWeight: 700,
    color: "#000",
    fontFamily: "monospace",
  },
  tableRow: {
    display: "flex",
    gap: 12,
    padding: "10px 8px",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
  },
  cellInput: {
    width: "100%",
    padding: "8px 10px",
    fontSize: 13,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  priorBlock: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: "2px solid #e0e0e0",
  },
  priorCard: {
    marginBottom: 20,
    padding: "16px 20px",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "2px solid black",
    boxShadow: "4px 4px 0px black",
  },
  deletePriorBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "2px 2px 0px black",
  },
  emptyText: {
    color: "#555",
    fontSize: 14,
    padding: "16px 0",
    textAlign: "center",
    fontFamily: "monospace",
    fontWeight: 600,
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
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default StudentProfile;

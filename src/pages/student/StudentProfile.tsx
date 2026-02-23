import { useEffect, useState } from "react";
import api from "../../services/api";

interface Profile {
  rollNo: string;
  department: string;
  stream?: string;
  cgpa: number;
  batchYear: number;
  phone: string;
  resumeLink?: string;
}

const StudentProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/student/me");
    setProfile(res.data);
  };

  const handleChange = (e: any) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!profile) return;

    await api.put("/student/me", profile);
    setEditing(false);
    alert("Profile Updated");
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>

      <div style={styles.card}>
        <label>Roll Number</label>
        <input
          name="rollNo"
          value={profile.rollNo}
          disabled={!editing}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Department</label>
        <input
          value={profile.department}
          disabled
          style={styles.input}
        />

        <label>Stream</label>
        <input
          value={profile.stream || "-"}
          disabled
          style={styles.input}
        />

        <label>CGPA</label>
        <input
          name="cgpa"
          type="number"
          step="0.01"
          value={profile.cgpa}
          disabled={!editing}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Batch Year</label>
        <input
          name="batchYear"
          type="number"
          value={profile.batchYear}
          disabled={!editing}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={profile.phone}
          disabled={!editing}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Resume Link</label>
        <input
          name="resumeLink"
          value={profile.resumeLink || ""}
          disabled={!editing}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={{ marginTop: "15px" }}>
          {!editing ? (
            <button onClick={() => setEditing(true)} style={styles.editBtn}>
              Edit Profile
            </button>
          ) : (
            <button onClick={saveProfile} style={styles.saveBtn}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    color: "white",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  input: {
    padding: "6px",
    borderRadius: "5px",
    border: "none",
  },
  editBtn: {
    padding: "8px",
    backgroundColor: "#3b82f6",
    border: "none",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px",
    backgroundColor: "#22c55e",
    border: "none",
    cursor: "pointer",
  },
};

export default StudentProfile;
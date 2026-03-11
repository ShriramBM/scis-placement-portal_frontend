import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface Company {
  id: number;
  name: string;
  description: string;
  package: number;
  department: string;
  streamsAllowed: string[];
  jobTitle: string;
  address: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  type_of_organization: string | null;
  skillsRequired: string[];
  jobLocation: string | null;
  remarks: string | null;
  no_vacancies: number | null;
  nature_of_business: string | null;
  deadline: string;
  jd_file_path: string | null;
  createdById?: number;
  createdAt?: string;
  updatedAt?: string;
}

type TabKey = "listings" | "posting";

interface JobPostForm {
  name: string;
  jobTitle: string;
  description: string;
  jd_file_path: string;
  skillsRequired: string;
  no_vacancies: string;
  department: "MCA" | "MTECH" | "IMTECH";
  streamsAllowed: string[];
  package: string;
  jobLocation: string;
  deadline: string;
  website: string;
  type_of_organization: string;
  nature_of_business: string;
  address: string;
  state: string;
  country: string;
  remarks: string;
}

const INITIAL_FORM: JobPostForm = {
  name: "",
  jobTitle: "",
  description: "",
  jd_file_path: "",
  skillsRequired: "",
  no_vacancies: "",
  department: "MTECH",
  streamsAllowed: [],
  package: "",
  jobLocation: "",
  deadline: "",
  website: "",
  type_of_organization: "",
  nature_of_business: "",
  address: "",
  state: "",
  country: "",
  remarks: "",
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const displayValue = (value: unknown) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return String(value);
};

const StreamDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("listings");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [postForm, setPostForm] = useState<JobPostForm>(INITIAL_FORM);
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/company");
      setCompanies(res.data);
    } catch {
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return companies;
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(search) ||
        company.jobTitle?.toLowerCase().includes(search) ||
        company.department.toLowerCase().includes(search)
    );
  }, [companies, query]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleStreamToggle = (stream: string) => {
    setPostForm((prev) => ({
      ...prev,
      streamsAllowed: prev.streamsAllowed.includes(stream)
        ? prev.streamsAllowed.filter((s) => s !== stream)
        : [...prev.streamsAllowed, stream],
    }));
  };

  const [jdUploading, setJdUploading] = useState(false);

  const handlePostFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPostForm((prev) => {
      if (name === "department") {
        return {
          ...prev,
          department: value as JobPostForm["department"],
          streamsAllowed: value === "MTECH" ? prev.streamsAllowed : [],
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleJdFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdUploading(true);
    try {
      const formData = new FormData();
      formData.append("jd", file);
      const res = await api.post("/company/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const path = res.data?.jd_file_path;
      if (path) setPostForm((prev) => ({ ...prev, jd_file_path: path }));
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPostMessage(msg || "JD upload failed");
    } finally {
      setJdUploading(false);
      e.target.value = "";
    }
  };

  const clearJdFile = () => {
    setPostForm((prev) => ({ ...prev, jd_file_path: "" }));
  };

  const resetForm = () => {
    setPostForm(INITIAL_FORM);
    setPostMessage("");
  };

  const handlePostCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setPostMessage("");

    try {
      const payload = {
        name: postForm.name,
        description: postForm.description,
        package: postForm.package,
        department: postForm.department,
        streamsAllowed:
          postForm.department === "MTECH" ? postForm.streamsAllowed : [],
        deadline: postForm.deadline,
        jobTitle: postForm.jobTitle,
        jd_file_path: postForm.jd_file_path || null,
        skillsRequired: postForm.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        no_vacancies: postForm.no_vacancies ? Number(postForm.no_vacancies) : null,
        jobLocation: postForm.jobLocation || null,
        website: postForm.website || null,
        type_of_organization: postForm.type_of_organization || null,
        nature_of_business: postForm.nature_of_business || null,
        address: postForm.address || null,
        state: postForm.state || null,
        country: postForm.country || null,
        remarks: postForm.remarks || null,
      };

      await api.post("/company", payload);
      setPostMessage("Job posting created successfully.");
      resetForm();
      await fetchCompanies();
      setTab("listings");
    } catch (err: any) {
      setPostMessage(err.response?.data?.message || "Failed to create job posting");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading companies...</div>;
  }

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.breadcrumb}>
            Jobs on Campus /
            {selectedCompany
              ? " Company details"
              : tab === "posting"
                ? " Create new Listing"
                : ""}
          </div>
          <button style={styles.logoutBtn} onClick={logout}>
            Log out
          </button>
        </div>

        {!selectedCompany && (
          <div style={styles.tabRow}>
            <button
              style={{ ...styles.topTab, ...(tab === "listings" ? styles.topTabActive : {}) }}
              onClick={() => setTab("listings")}
            >
              Companies List
            </button>
            <button
              style={{ ...styles.topTab, ...(tab === "posting" ? styles.topTabActive : {}) }}
              onClick={() => setTab("posting")}
            >
              Job Posting
            </button>
          </div>
        )}

        {!selectedCompany && tab === "listings" ? (
          <section style={styles.tableCard}>
            <div style={styles.tableTools}>
              <div style={styles.toolsLeft}>COLUMNS &nbsp; FILTERS &nbsp; DENSITY</div>
              <input
                style={styles.search}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={styles.tableHeader}>
              <div style={{ ...styles.cell, flex: 2.3 }}>Company</div>
              <div style={{ ...styles.cell, flex: 3.2 }}>Title</div>
              <div style={{ ...styles.cell, flex: 1.4 }}>CTC</div>
              <div style={{ ...styles.cell, flex: 1 }}>Eligibility</div>
              <div style={{ ...styles.cell, flex: 2 }}>Deadline</div>
            </div>

            {filteredCompanies.map((company) => (
              <button
                key={company.id}
                style={styles.rowBtn}
                onClick={() => setSelectedCompany(company)}
              >
                <div style={{ ...styles.cell, flex: 2.3 }}>{company.name}</div>
                <div style={{ ...styles.cell, flex: 3.2 }}>{company.jobTitle || "-"}</div>
                <div style={{ ...styles.cell, flex: 1.4 }}>{formatMoney(company.package)}</div>
                <div style={{ ...styles.cell, flex: 1 }}>{company.department === "MCA" ? "MCA" : (company.streamsAllowed?.length ? company.streamsAllowed.join(", ") : "All streams")}</div>
                <div style={{ ...styles.cell, flex: 2 }}>{formatDateTime(company.deadline)}</div>
              </button>
            ))}
          </section>
        ) : null}

        {!selectedCompany && tab === "posting" ? (
          <section style={styles.postingCard}>
            <h2 style={styles.postTitle}>Create new Listing</h2>
            <p style={styles.postMandatory}>All fields marked * are mandatory.</p>

            <form onSubmit={handlePostCompany}>
              <input
                name="name"
                value={postForm.name}
                onChange={handlePostFormChange}
                placeholder="Company Name *"
                style={styles.postInput}
                required
              />
              <input
                name="jobTitle"
                value={postForm.jobTitle}
                onChange={handlePostFormChange}
                placeholder="Job Title *"
                style={styles.postInput}
                required
              />
              <textarea
                name="description"
                value={postForm.description}
                onChange={handlePostFormChange}
                placeholder="Job Description *"
                style={{ ...styles.postInput, ...styles.postTextArea }}
                required
              />
              <div style={styles.jdUploadRow}>
                <label style={styles.jdUploadLabel}>
                  <span style={styles.jdUploadBtn}>
                    {jdUploading ? "Uploading…" : "Upload JD file"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleJdFileChange}
                    disabled={jdUploading}
                    style={{ display: "none" }}
                  />
                </label>
                {postForm.jd_file_path ? (
                  <span style={styles.jdUploaded}>
                    {postForm.jd_file_path.split("/").pop()}
                    <button type="button" onClick={clearJdFile} style={styles.jdClearBtn}>Clear</button>
                  </span>
                ) : (
                  <span style={styles.jdPlaceholder}>No file uploaded</span>
                )}
              </div>
              <input
                name="skillsRequired"
                value={postForm.skillsRequired}
                onChange={handlePostFormChange}
                placeholder="Required Skill Set (comma separated)"
                style={styles.postInput}
              />

              <div style={styles.formRow}>
                <input
                  name="no_vacancies"
                  type="number"
                  min={0}
                  value={postForm.no_vacancies}
                  onChange={handlePostFormChange}
                  placeholder="Tentative No. of Vacancies"
                  style={styles.postInput}
                />
                <input
                  name="jobLocation"
                  value={postForm.jobLocation}
                  onChange={handlePostFormChange}
                  placeholder="Job Location"
                  style={styles.postInput}
                />
              </div>

              <div style={styles.formRow}>
                <input
                  name="deadline"
                  type="datetime-local"
                  value={postForm.deadline}
                  onChange={handlePostFormChange}
                  style={styles.postInput}
                  required
                />
                <input
                  name="package"
                  type="number"
                  min={0}
                  value={postForm.package}
                  onChange={handlePostFormChange}
                  placeholder="CTC / Package *"
                  style={styles.postInput}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <select
                  name="department"
                  value={postForm.department}
                  onChange={handlePostFormChange}
                  style={styles.postInput}
                >
                  <option value="MCA">MCA</option>
                  <option value="MTECH">MTECH</option>
                  <option value="IMTECH">IMTECH</option>
                </select>
                <input
                  name="website"
                  value={postForm.website}
                  onChange={handlePostFormChange}
                  placeholder="Website"
                  style={styles.postInput}
                />
              </div>

              {postForm.department === "MTECH" && (
                <div style={styles.streamSection}>
                  <div style={styles.streamHeading}>SELECT APPLICABLE STREAMS</div>
                  <div style={styles.checkboxRow}>
                    {["CSE", "AI", "IT"].map((stream) => (
                      <label key={stream} style={styles.checkLabel}>
                        <input
                          type="checkbox"
                          checked={postForm.streamsAllowed.includes(stream)}
                          onChange={() => handleStreamToggle(stream)}
                        />
                        {stream}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.formRow}>
                <input
                  name="nature_of_business"
                  value={postForm.nature_of_business}
                  onChange={handlePostFormChange}
                  placeholder="Nature of Business"
                  style={styles.postInput}
                />
                <input
                  name="type_of_organization"
                  value={postForm.type_of_organization}
                  onChange={handlePostFormChange}
                  placeholder="Type of Organization"
                  style={styles.postInput}
                />
              </div>

              <div style={styles.formRow}>
                <input
                  name="address"
                  value={postForm.address}
                  onChange={handlePostFormChange}
                  placeholder="Address"
                  style={styles.postInput}
                />
                <input
                  name="state"
                  value={postForm.state}
                  onChange={handlePostFormChange}
                  placeholder="State"
                  style={styles.postInput}
                />
                <input
                  name="country"
                  value={postForm.country}
                  onChange={handlePostFormChange}
                  placeholder="Country"
                  style={styles.postInput}
                />
              </div>

              <textarea
                name="remarks"
                value={postForm.remarks}
                onChange={handlePostFormChange}
                placeholder="Remarks"
                style={{ ...styles.postInput, ...styles.postTextArea, minHeight: 70 }}
              />

              {postMessage && <p style={styles.postMessage}>{postMessage}</p>}

              <div style={styles.postActions}>
                <button
                  type="button"
                  style={{ ...styles.actionBtn, ...styles.resetBtn }}
                  onClick={resetForm}
                  disabled={posting}
                >
                  Reset
                </button>
                <button type="submit" style={styles.actionBtn} disabled={posting}>
                  {posting ? "Posting..." : "Create Job Posting"}
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {selectedCompany ? (
          <section style={styles.detailsPage}>
            <div style={styles.leftColumn}>
              <button style={styles.backBtn} onClick={() => setSelectedCompany(null)}>
                ← Jobs on Campus
              </button>

              <div style={styles.sideCard}>
                <h4 style={styles.sideCardTitle}>Minimum Credit Requirements</h4>
                <p style={styles.sideCardText}>Required Credits: 20</p>
              </div>

              <div style={styles.sideCard}>
                <h4 style={styles.sideCardTitle}>Coordinator Information</h4>
                <p style={styles.sideCardText}>Name: Stream Coordinator</p>
                <p style={styles.sideCardText}>Email: coordinator@uohyd.ac.in</p>
              </div>
            </div>

            <div style={styles.rightColumn}>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.companyTitle}>{selectedCompany.name}</h2>
                </div>
                <div style={styles.keyValueGrid}>
                  <div>Nature of Business</div>
                  <div>{displayValue(selectedCompany.nature_of_business)}</div>
                  <div>Website</div>
                  <div>{displayValue(selectedCompany.website)}</div>
                  <div>Type of Organization</div>
                  <div>{displayValue(selectedCompany.type_of_organization)}</div>
                  <div>Department</div>
                  <div>{displayValue(selectedCompany.department)}</div>
                  <div>Eligibility</div>
                  <div>{selectedCompany.department === "MCA" ? "MCA" : (selectedCompany.streamsAllowed?.length ? selectedCompany.streamsAllowed.join(", ") : "All streams")}</div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Job Description</h3>
                </div>
                <div style={styles.keyValueGrid}>
                  <div>Job Title</div>
                  <div>{displayValue(selectedCompany.jobTitle)}</div>
                  <div>Job Location</div>
                  <div>{displayValue(selectedCompany.jobLocation)}</div>
                  <div>No. of vacancies</div>
                  <div>{selectedCompany.no_vacancies ?? "-"}</div>
                  <div>Job Description Offered</div>
                  <div>{displayValue(selectedCompany.description)}</div>
                  <div>Remarks</div>
                  <div>{displayValue(selectedCompany.remarks)}</div>
                  <div>Required Skills</div>
                  <div>
                    {selectedCompany.skillsRequired?.length
                      ? selectedCompany.skillsRequired.join(", ")
                      : "-"}
                  </div>
                  <div>Deadline</div>
                  <div>{formatDateTime(selectedCompany.deadline)}</div>
                  <div>Address</div>
                  <div>{displayValue(selectedCompany.address)}</div>
                  <div>State</div>
                  <div>{displayValue(selectedCompany.state)}</div>
                  <div>Country</div>
                  <div>{displayValue(selectedCompany.country)}</div>
                  <div>JD File / Link</div>
                  <div>
                    {selectedCompany.jd_file_path ? (
                      <a
                        href={`${new URL(api.defaults.baseURL!).origin}${selectedCompany.jd_file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.jdDownloadLink}
                      >
                        Download JD ({selectedCompany.jd_file_path.split("/").pop()})
                      </a>
                    ) : (
                      displayValue(selectedCompany.jd_file_path)
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Eligible Programs</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Degree</th>
                      <th style={styles.th}>Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>{selectedCompany.department}</td>
                      <td style={styles.td}>
                        {selectedCompany.department === "MCA"
                          ? "—"
                          : (selectedCompany.streamsAllowed?.length
                            ? selectedCompany.streamsAllowed.join(", ")
                            : "All streams")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Programme-wise CTC</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Degree</th>
                      <th style={styles.th}>CTC</th>
                      <th style={styles.th}>Gross</th>
                      <th style={styles.th}>Min CGPA</th>
                      <th style={styles.th}>CTC Breakup</th>
                      <th style={styles.th}>Service Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>{selectedCompany.department}</td>
                      <td style={styles.td}>{formatMoney(selectedCompany.package)}</td>
                      <td style={styles.td}>{formatMoney(selectedCompany.package)}</td>
                      <td style={styles.td}>0.00</td>
                      <td style={styles.td}>Shared in process</td>
                      <td style={styles.td}>NA</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Company Metadata</h3>
                <div style={styles.keyValueGrid}>
                  <div>Company ID</div>
                  <div>{selectedCompany.id}</div>
                  <div>Created By</div>
                  <div>{displayValue(selectedCompany.createdById)}</div>
                  <div>Created At</div>
                  <div>
                    {selectedCompany.createdAt
                      ? formatDateTime(selectedCompany.createdAt)
                      : "-"}
                  </div>
                  <div>Updated At</div>
                  <div>
                    {selectedCompany.updatedAt
                      ? formatDateTime(selectedCompany.updatedAt)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    fontFamily: "monospace",
    color: "#000",
  },
  main: {
    padding: 22,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  breadcrumb: {
    fontSize: 12,
    color: "#555",
    fontWeight: 600,
  },
  logoutBtn: {
    border: "2px solid black",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: 8,
    fontSize: 12,
    padding: "8px 14px",
    cursor: "pointer",
    boxShadow: "4px 4px 0px black",
    fontWeight: 700,
    fontFamily: "monospace",
  },
  tabRow: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  topTab: {
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px black",
  },
  topTabActive: {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "4px 4px 0px #555",
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    border: "2px solid black",
    overflow: "hidden",
    boxShadow: "8px 8px 0px black",
  },
  tableTools: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid black",
    padding: "10px 14px",
  },
  toolsLeft: {
    fontSize: 11,
    color: "#000",
    fontWeight: 700,
    fontFamily: "monospace",
  },
  search: {
    border: "2px solid black",
    borderRadius: 8,
    fontSize: 12,
    padding: "7px 10px",
    width: 180,
    outline: "none",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  tableHeader: {
    display: "flex",
    padding: "9px 14px",
    borderBottom: "2px solid black",
    fontSize: 12,
    fontWeight: 700,
    color: "#000",
    fontFamily: "monospace",
    backgroundColor: "#f0f0f0",
  },
  rowBtn: {
    width: "100%",
    display: "flex",
    border: "none",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    padding: "10px 14px",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "monospace",
  },
  cell: {
    fontSize: 12,
    color: "#000",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontWeight: 600,
  },
  postingCard: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: 18,
    padding: "18px 18px 22px",
    boxShadow: "8px 8px 0px black",
  },
  postTitle: {
    margin: "0 0 4px",
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "monospace",
    color: "#000",
  },
  postMandatory: {
    margin: "0 0 12px",
    color: "#b91c1c",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  postInput: {
    width: "100%",
    border: "2px solid black",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 14,
    padding: "11px 12px",
    marginBottom: 10,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  postTextArea: {
    minHeight: 80,
    resize: "vertical",
  },
  jdUploadRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  jdUploadLabel: {
    cursor: "pointer",
  },
  jdUploadBtn: {
    display: "inline-block",
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    pointerEvents: "none",
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px black",
  },
  jdUploaded: {
    fontSize: 13,
    color: "#000",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "monospace",
  },
  jdPlaceholder: {
    fontSize: 13,
    color: "#555",
    fontFamily: "monospace",
  },
  jdClearBtn: {
    padding: "4px 10px",
    fontSize: 12,
    borderRadius: 8,
    border: "2px solid black",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "monospace",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  streamSection: {
    border: "2px solid black",
    backgroundColor: "#fff",
    padding: "10px 12px",
    marginBottom: 10,
    borderRadius: 12,
  },
  streamHeading: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    fontFamily: "monospace",
    color: "#000",
  },
  checkboxRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  checkLabel: {
    fontSize: 14,
    color: "#000",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "monospace",
    fontWeight: 600,
  },
  postActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    border: "2px solid black",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px #333",
  },
  resetBtn: {
    backgroundColor: "#fff",
    color: "#000",
  },
  postMessage: {
    fontSize: 13,
    color: "#000",
    margin: "2px 0 8px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  detailsPage: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: 18,
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  backBtn: {
    border: "none",
    backgroundColor: "transparent",
    color: "#000",
    fontWeight: 700,
    textAlign: "left",
    padding: 0,
    cursor: "pointer",
    fontFamily: "monospace",
  },
  sideCard: {
    border: "2px solid black",
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    boxShadow: "4px 4px 0px black",
  },
  sideCardTitle: {
    fontSize: 12,
    margin: "0 0 6px",
    fontWeight: 700,
    fontFamily: "monospace",
  },
  sideCardText: {
    fontSize: 11,
    margin: "4px 0",
    color: "#000",
    fontFamily: "monospace",
  },
  section: {
    border: "2px solid black",
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 12,
    boxShadow: "8px 8px 0px black",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid black",
    paddingBottom: 8,
    marginBottom: 10,
  },
  companyTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "monospace",
    color: "#000",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "monospace",
    color: "#000",
  },
  keyValueGrid: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    columnGap: 12,
    rowGap: 8,
    fontSize: 12,
    alignItems: "start",
    fontFamily: "monospace",
  },
  jdDownloadLink: {
    color: "#000",
    fontWeight: 700,
    textDecoration: "underline",
    fontFamily: "monospace",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "monospace",
  },
  th: {
    border: "2px solid black",
    backgroundColor: "#f0f0f0",
    fontSize: 12,
    padding: "7px 8px",
    textAlign: "left",
    fontWeight: 700,
  },
  td: {
    border: "2px solid black",
    fontSize: 12,
    padding: "7px 8px",
    verticalAlign: "top",
    fontWeight: 600,
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    backgroundColor: "#f2f2f2",
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: 700,
  },
};

export default StreamDashboard;
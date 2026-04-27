import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import "./public-pages.css";

interface YearRow {
  degree: string;
  students: number;
  registered: number;
  placedCount: number;
  higherStudiesCount: number;
  notPlacedCount: number;
  placedPct: number;
  higherStudiesPct: number;
  notPlacedPct: number;
  medianLpa: number;
}

interface CompanyHire {
  name: string;
  count: number;
}

interface InternshipDegreeStat {
  degree: string;
  internshipCount: number;
  avgStipendK: number;
  maxStipendK: number;
}

interface InternshipCompany {
  name: string;
  count: number;
  avgStipendK: number;
}

interface YearData {
  year: string;
  rows: YearRow[];
  companyHires: CompanyHire[];
  internshipByDegree: InternshipDegreeStat[];
  internshipCompanies: InternshipCompany[];
}

const STATS_DATA: YearData[] = [
  {
    year: "2024-25",
    rows: [
      { degree: "MCA", students: 40, registered: 35, placedCount: 18, higherStudiesCount: 0, notPlacedCount: 17, placedPct: 51.43, higherStudiesPct: 0, notPlacedPct: 48.57, medianLpa: 9 },
      { degree: "MTech (CSE)", students: 20, registered: 17, placedCount: 14, higherStudiesCount: 0, notPlacedCount: 3, placedPct: 82.35, higherStudiesPct: 0, notPlacedPct: 17.65, medianLpa: 12 },
      { degree: "MTech (AI)", students: 20, registered: 18, placedCount: 1, higherStudiesCount: 0, notPlacedCount: 17, placedPct: 5.56, higherStudiesPct: 0, notPlacedPct: 94.44, medianLpa: 6 },
      { degree: "IMTech", students: 60, registered: 50, placedCount: 11, higherStudiesCount: 0, notPlacedCount: 39, placedPct: 22.0, higherStudiesPct: 0, notPlacedPct: 78.0, medianLpa: 14.8 },
    ],
    companyHires: [
      { name: "Launched", count: 8 },
      { name: "Lloyds", count: 4 },
      { name: "Marvell", count: 3 },
      { name: "Teradata", count: 3 },
      { name: "Cognizant GenC", count: 3 },
      { name: "Quadratyx", count: 3 },
      { name: "Blaize", count: 2 },
      { name: "Micron", count: 2 },
      { name: "Aps Building Solution", count: 2 },
      { name: "Netelixir", count: 2 },
      { name: "GE", count: 2 },
      { name: "TCS", count: 2 },
      { name: "Citco", count: 1 },
      { name: "Curious Ed", count: 1 },
      { name: "Dheyo AI", count: 1 },
      { name: "Ola Krutrim", count: 1 },
      { name: "Paraxzen", count: 1 },
      { name: "ServiceNow", count: 1 },
    ],
    internshipByDegree: [
      { degree: "MCA", internshipCount: 11, avgStipendK: 24.18, maxStipendK: 36 },
      { degree: "MTech (CSE)", internshipCount: 12, avgStipendK: 42.92, maxStipendK: 50 },
      { degree: "MTech (AI)", internshipCount: 0, avgStipendK: 0, maxStipendK: 0 },
      { degree: "IMTech", internshipCount: 17, avgStipendK: 33.53, maxStipendK: 45 },
    ],
    internshipCompanies: [
      { name: "TCS", count: 7, avgStipendK: 15 },
      { name: "GE", count: 7, avgStipendK: 45 },
      { name: "Intel", count: 5, avgStipendK: 45 },
      { name: "Marvell", count: 4, avgStipendK: 45 },
      { name: "Citco", count: 3, avgStipendK: 50 },
      { name: "Caelius Consulting", count: 2, avgStipendK: 25 },
      { name: "Praxzen LLC", count: 2, avgStipendK: 20 },
      { name: "Zelis", count: 2, avgStipendK: 25 },
      { name: "Merck Life Science", count: 2, avgStipendK: 36 },
      { name: "Bosch", count: 1, avgStipendK: 35 },
      { name: "Coschool", count: 1, avgStipendK: 12 },
      { name: "Launched Global", count: 1, avgStipendK: 20 },
      { name: "Lloyds", count: 1, avgStipendK: 15 },
      { name: "Micron", count: 1, avgStipendK: 22 },
      { name: "Novartis", count: 1, avgStipendK: 35 },
      { name: "Progress", count: 1, avgStipendK: 40 },
    ],
  },
];

const DEGREE_OPTIONS = ["All", "MCA", "MTech (CSE)", "MTech (AI)", "IMTech"];
const COLORS = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];
const PIE_COLORS = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const StatsPage = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("All");
  const yearData = STATS_DATA[selectedYear];

  const filteredRows = useMemo(
    () => (degreeFilter === "All" ? yearData.rows : yearData.rows.filter((r) => r.degree === degreeFilter)),
    [yearData, degreeFilter]
  );

  const chartDataByDegree = useMemo(
    () =>
      filteredRows.map((r) => ({
        name: r.degree,
        "Placement %": r.placedPct,
        "Median CTC (LPA)": r.medianLpa,
      })),
    [filteredRows]
  );

  const pieOutcomeData = useMemo(() => {
    const placed = filteredRows.reduce((s, r) => s + r.placedCount, 0);
    const higher = filteredRows.reduce((s, r) => s + r.higherStudiesCount, 0);
    const notPlaced = filteredRows.reduce((s, r) => s + r.notPlacedCount, 0);
    return [
      { name: "Placed", value: placed, fill: "#1d4ed8" },
      { name: "Higher Studies", value: higher, fill: "#60a5fa" },
      { name: "Not Placed", value: notPlaced, fill: "#93c5fd" },
    ].filter((d) => d.value > 0);
  }, [filteredRows]);

  const pieDegreeData = useMemo(
    () =>
      filteredRows.map((r, i) => ({
        name: r.degree,
        value: r.placedCount,
        fill: PIE_COLORS[i % PIE_COLORS.length],
      })),
    [filteredRows]
  );

  const trendData = useMemo(
    () =>
      STATS_DATA[0].rows.map((row) => ({
        degree: row.degree,
        "2024-25": row.placedPct,
      })),
    []
  );

  const renderCustomPieLabel = ({ name = "", percent = 0 }: { name?: string; percent?: number }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="scis-page-root">
      <div className="scis-top-strip">
        <div className="scis-container scis-top-strip-inner">
          <span>University of Hyderabad</span>
          <span>School of Computer and Information Sciences</span>
        </div>
      </div>

      <header className="scis-header">
        <div className="scis-container scis-header-inner">
          <div className="scis-brand">
            <img src="/uoh-logo.png" alt="University of Hyderabad logo" className="scis-brand-logo" />
            <div>
              <p className="scis-brand-title">SCIS Placement Analytics</p>
              <p className="scis-brand-subtitle">Training and Placement Cell</p>
            </div>
          </div>
          <nav className="scis-nav-links">
            <button type="button" className="scis-link-btn" onClick={() => navigate("/")}>Home</button>
            <button type="button" className="scis-link-btn scis-link-btn-active">Statistics</button>
            <button type="button" className="scis-link-btn scis-link-btn-primary" onClick={() => navigate("/login")}>
              Portal Login
            </button>
          </nav>
        </div>
      </header>

      <main className="scis-container scis-main-content">
        <h1 className="scis-page-title">Placement Statistics</h1>
        <p className="scis-page-intro">
          View exact placement outcomes, median compensation, and company-wise hiring for each SCIS programme.
        </p>

        <section className="scis-panel">
          <div className="scis-filter-grid">
            <div>
              <label className="scis-filter-label">Year</label>
              <div className="scis-tab-row">
                {STATS_DATA.map((y, i) => (
                  <button
                    key={y.year}
                    type="button"
                    className={`scis-tab ${selectedYear === i ? "scis-tab-active" : ""}`}
                    onClick={() => setSelectedYear(i)}
                  >
                    {y.year}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="scis-filter-label">Degree</label>
              <select value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)} className="scis-select">
                {DEGREE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="scis-panel">
          <h2 className="scis-section-title">
            Year {yearData.year} {degreeFilter !== "All" ? `— ${degreeFilter}` : ""}
          </h2>
          <div className="scis-table-wrap">
            <table className="scis-table">
              <thead>
                <tr>
                  <th>Degree</th>
                  <th># Students</th>
                  <th># Registered</th>
                  <th># Placed</th>
                  <th># Higher Studies</th>
                  <th># Not Placed</th>
                  <th>% Placed</th>
                  <th>% Higher Studies</th>
                  <th>Median CTC (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.degree}>
                    <td>{row.degree}</td>
                    <td>{row.students}</td>
                    <td>{row.registered}</td>
                    <td>{row.placedCount}</td>
                    <td>{row.higherStudiesCount}</td>
                    <td>{row.notPlacedCount}</td>
                    <td>{row.placedPct.toFixed(2)}%</td>
                    <td>{row.higherStudiesPct.toFixed(2)}%</td>
                    <td>{row.medianLpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="scis-panel">
          <h2 className="scis-section-title">Visualization — {yearData.year}</h2>

          <div className="scis-chart-grid">
            <div className="scis-chart-card">
              <h3 className="scis-chart-title">Outcome Split</h3>
              <div className="scis-chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieOutcomeData} dataKey="value" nameKey="name" outerRadius={100} label={renderCustomPieLabel}>
                      {pieOutcomeData.map((_, i) => (
                        <Cell key={i} fill={pieOutcomeData[i].fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v ?? 0, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="scis-chart-card">
              <h3 className="scis-chart-title">Placed Students by Degree</h3>
              <div className="scis-chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieDegreeData} dataKey="value" nameKey="name" outerRadius={100} label={renderCustomPieLabel}>
                      {pieDegreeData.map((_, i) => (
                        <Cell key={i} fill={pieDegreeData[i].fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v ?? 0, "Hired"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="scis-chart-card">
            <h3 className="scis-chart-title">Company-wise Hires</h3>
            <div className="scis-chart-wrap scis-chart-wrap-tall">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={yearData.companyHires} layout="vertical" margin={{ top: 8, right: 24, left: 90, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis type="number" stroke="#1e3a8a" />
                  <YAxis type="category" dataKey="name" stroke="#1e3a8a" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Hires" fill="#2563eb" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="scis-chart-grid">
            <div className="scis-chart-card">
              <h3 className="scis-chart-title">Placement % by Degree</h3>
              <div className="scis-chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataByDegree}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                    <XAxis dataKey="name" stroke="#1e3a8a" />
                    <YAxis domain={[0, 100]} stroke="#1e3a8a" />
                    <Tooltip />
                    <Bar dataKey="Placement %" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="scis-chart-card">
              <h3 className="scis-chart-title">Median CTC (LPA)</h3>
              <div className="scis-chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataByDegree}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                    <XAxis dataKey="name" stroke="#1e3a8a" />
                    <YAxis stroke="#1e3a8a" />
                    <Tooltip />
                    <Bar dataKey="Median CTC (LPA)" radius={[6, 6, 0, 0]}>
                      {chartDataByDegree.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="scis-chart-card">
            <h3 className="scis-chart-title">Placement % Trend</h3>
            <div className="scis-chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="degree" stroke="#1e3a8a" />
                  <YAxis stroke="#1e3a8a" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="2024-25" stroke="#1d4ed8" strokeWidth={3} dot={{ fill: "#1d4ed8" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="scis-sub-title">Company-wise Hire Count</h3>
          <div className="scis-table-wrap">
            <table className="scis-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th># Hired</th>
                </tr>
              </thead>
              <tbody>
                {yearData.companyHires.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="scis-sub-title">Internships (with stipend)</h3>
          <div className="scis-table-wrap">
            <table className="scis-table">
              <thead>
                <tr>
                  <th>Degree</th>
                  <th># Internships</th>
                  <th>Avg Stipend (K / month)</th>
                  <th>Max Stipend (K / month)</th>
                </tr>
              </thead>
              <tbody>
                {yearData.internshipByDegree.map((row) => (
                  <tr key={row.degree}>
                    <td>{row.degree}</td>
                    <td>{row.internshipCount}</td>
                    <td>{row.avgStipendK.toFixed(2)}</td>
                    <td>{row.maxStipendK.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="scis-sub-title">Internship Company-wise Snapshot</h3>
          <div className="scis-table-wrap">
            <table className="scis-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th># Interns</th>
                  <th>Avg Stipend (K / month)</th>
                </tr>
              </thead>
              <tbody>
                {yearData.internshipCompanies.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.count}</td>
                    <td>{row.avgStipendK.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StatsPage;

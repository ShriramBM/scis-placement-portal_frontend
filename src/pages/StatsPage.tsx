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

interface YearData {
  year: string;
  rows: YearRow[];
  companyHires: CompanyHire[];
}

const STATS_DATA: YearData[] = [
  {
    year: "2024-25",
    rows: [
      { degree: "MCA", students: 48, registered: 48, placedCount: 41, higherStudiesCount: 4, notPlacedCount: 3, placedPct: 85.42, higherStudiesPct: 8.33, notPlacedPct: 6.25, medianLpa: 28 },
      { degree: "MTech (CSE)", students: 55, registered: 55, placedCount: 48, higherStudiesCount: 5, notPlacedCount: 2, placedPct: 87.27, higherStudiesPct: 9.09, notPlacedPct: 3.64, medianLpa: 32 },
      { degree: "MTech (AI)", students: 40, registered: 40, placedCount: 36, higherStudiesCount: 3, notPlacedCount: 1, placedPct: 90.0, higherStudiesPct: 7.5, notPlacedPct: 2.5, medianLpa: 30 },
      { degree: "IMTech", students: 28, registered: 28, placedCount: 23, higherStudiesCount: 3, notPlacedCount: 2, placedPct: 82.14, higherStudiesPct: 10.71, notPlacedPct: 7.14, medianLpa: 26 },
    ],
    companyHires: [
      { name: "TCS", count: 18 },
      { name: "Infosys", count: 14 },
      { name: "Wipro", count: 12 },
      { name: "Amazon", count: 10 },
      { name: "Microsoft", count: 8 },
      { name: "Accenture", count: 9 },
      { name: "Capgemini", count: 7 },
      { name: "Deloitte", count: 6 },
      { name: "Oracle", count: 5 },
      { name: "Intel", count: 4 },
      { name: "Others", count: 35 },
    ],
  },
  {
    year: "2023-24",
    rows: [
      { degree: "MCA", students: 45, registered: 45, placedCount: 37, higherStudiesCount: 5, notPlacedCount: 3, placedPct: 82.22, higherStudiesPct: 11.11, notPlacedPct: 6.67, medianLpa: 26 },
      { degree: "MTech (CSE)", students: 52, registered: 52, placedCount: 44, higherStudiesCount: 5, notPlacedCount: 3, placedPct: 84.62, higherStudiesPct: 9.62, notPlacedPct: 5.77, medianLpa: 29 },
      { degree: "MTech (AI)", students: 38, registered: 38, placedCount: 33, higherStudiesCount: 3, notPlacedCount: 2, placedPct: 86.84, higherStudiesPct: 7.89, notPlacedPct: 5.26, medianLpa: 28 },
      { degree: "IMTech", students: 25, registered: 25, placedCount: 20, higherStudiesCount: 3, notPlacedCount: 2, placedPct: 80.0, higherStudiesPct: 12.0, notPlacedPct: 8.0, medianLpa: 24 },
    ],
    companyHires: [
      { name: "TCS", count: 16 },
      { name: "Infosys", count: 13 },
      { name: "Wipro", count: 11 },
      { name: "Amazon", count: 8 },
      { name: "HCL", count: 7 },
      { name: "Accenture", count: 8 },
      { name: "Cognizant", count: 6 },
      { name: "Oracle", count: 5 },
      { name: "Others", count: 38 },
    ],
  },
  {
    year: "2022-23",
    rows: [
      { degree: "MCA", students: 43, registered: 43, placedCount: 34, higherStudiesCount: 6, notPlacedCount: 3, placedPct: 79.07, higherStudiesPct: 13.95, notPlacedPct: 6.98, medianLpa: 24 },
      { degree: "MTech (CSE)", students: 50, registered: 50, placedCount: 41, higherStudiesCount: 6, notPlacedCount: 3, placedPct: 82.0, higherStudiesPct: 12.0, notPlacedPct: 6.0, medianLpa: 27 },
      { degree: "MTech (AI)", students: 35, registered: 35, placedCount: 29, higherStudiesCount: 4, notPlacedCount: 2, placedPct: 82.86, higherStudiesPct: 11.43, notPlacedPct: 5.71, medianLpa: 26 },
      { degree: "IMTech", students: 23, registered: 23, placedCount: 18, higherStudiesCount: 3, notPlacedCount: 2, placedPct: 78.26, higherStudiesPct: 13.04, notPlacedPct: 8.7, medianLpa: 22 },
    ],
    companyHires: [
      { name: "TCS", count: 14 },
      { name: "Infosys", count: 12 },
      { name: "Wipro", count: 10 },
      { name: "Capgemini", count: 8 },
      { name: "Tech Mahindra", count: 6 },
      { name: "L&T Infotech", count: 5 },
      { name: "Others", count: 37 },
    ],
  },
];

const DEGREE_OPTIONS = ["All", "MCA", "MTech (CSE)", "MTech (AI)", "IMTech"];
const COLORS = ["#000", "#333", "#555", "#777", "#999"];
const PIE_COLORS = ["#000", "#333", "#555", "#777", "#999", "#bbb", "#ddd"];

const StatsPage = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("All");
  const yearData = STATS_DATA[selectedYear];

  const filteredRows = useMemo(
    () =>
      degreeFilter === "All"
        ? yearData.rows
        : yearData.rows.filter((r) => r.degree === degreeFilter),
    [yearData, degreeFilter]
  );

  const chartDataByDegree = useMemo(
    () =>
      filteredRows.map((r) => ({
        name: r.degree,
        "Placement %": r.placedPct,
        "Median CTC (LPA)": r.medianLpa,
        placedCount: r.placedCount,
        higherStudiesCount: r.higherStudiesCount,
        notPlacedCount: r.notPlacedCount,
      })),
    [filteredRows]
  );

  const pieOutcomeData = useMemo(() => {
    const placed = filteredRows.reduce((s, r) => s + r.placedCount, 0);
    const higher = filteredRows.reduce((s, r) => s + r.higherStudiesCount, 0);
    const notPlaced = filteredRows.reduce((s, r) => s + r.notPlacedCount, 0);
    return [
      { name: "Placed", value: placed, fill: "#000" },
      { name: "Higher Studies", value: higher, fill: "#333" },
      { name: "Not Placed", value: notPlaced, fill: "#777" },
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

  const companyChartData = useMemo(() => yearData.companyHires, [yearData]);

  const trendData = useMemo(() => {
    return STATS_DATA[0].rows.map((_, i) => ({
      degree: STATS_DATA[0].rows[i].degree,
      "2022-23": STATS_DATA[2].rows[i].placedPct,
      "2023-24": STATS_DATA[1].rows[i].placedPct,
      "2024-25": STATS_DATA[0].rows[i].placedPct,
    }));
  }, []);

  const renderCustomPieLabel = ({ name = "", percent = 0 }: { name?: string; percent?: number }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div style={s.page} className="page-root">
      <nav style={s.topNav}>
        <div style={s.topNavLeft}>
          <button type="button" style={s.navBtn} onClick={() => navigate("/")}>
            Home
          </button>
          <button type="button" style={s.navBtn} onClick={() => navigate("/stats")}>
            Stats
          </button>
        </div>
        <div style={s.topNavRight}>
          <button type="button" style={s.navBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      <main style={s.main}>
        <h1 style={s.title}>Placement Statistics</h1>
        <p style={s.intro}>
          The training and placement cell coordinates the placement activity for SCIS. View exact placement percentage, higher studies count, and company-wise hires for <strong>MCA</strong>, <strong>MTech (CSE)</strong>, <strong>MTech (AI)</strong>, and <strong>IMTech</strong>.
        </p>

        {/* Filters */}
        <div style={s.filterRow}>
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>Year</label>
            <div style={s.tabRow}>
              {STATS_DATA.map((y, i) => (
                <button
                  key={y.year}
                  type="button"
                  style={{
                    ...s.yearTab,
                    ...(selectedYear === i ? s.yearTabActive : {}),
                  }}
                  onClick={() => setSelectedYear(i)}
                >
                  {y.year}
                </button>
              ))}
            </div>
          </div>
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>Degree</label>
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              style={s.select}
            >
              {DEGREE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table with exact counts */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Year {yearData.year} {degreeFilter !== "All" ? `— ${degreeFilter}` : ""}</h2>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Degree</th>
                  <th style={s.th}># Students</th>
                  <th style={s.th}># Registered</th>
                  <th style={s.th}># Placed</th>
                  <th style={s.th}># Higher Studies</th>
                  <th style={s.th}># Not Placed</th>
                  <th style={s.th}>% Placed</th>
                  <th style={s.th}>% Higher Studies</th>
                  <th style={s.th}>Median CTC (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.degree} style={s.tr}>
                    <td style={s.td}>{row.degree}</td>
                    <td style={s.td}>{row.students}</td>
                    <td style={s.td}>{row.registered}</td>
                    <td style={s.td}>{row.placedCount}</td>
                    <td style={s.td}>{row.higherStudiesCount}</td>
                    <td style={s.td}>{row.notPlacedCount}</td>
                    <td style={s.td}>{row.placedPct.toFixed(2)} %</td>
                    <td style={s.td}>{row.higherStudiesPct.toFixed(2)} %</td>
                    <td style={s.td}>{row.medianLpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pie charts & bar charts */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Visualization — {yearData.year}</h2>

          <div style={s.chartGrid}>
            <div style={s.chartCard}>
              <h3 style={s.chartTitle}>Outcome: Placed vs Higher Studies vs Not Placed</h3>
              <div style={s.chartWrap}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieOutcomeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderCustomPieLabel}
                      stroke="#000"
                      strokeWidth={2}
                    >
                      {pieOutcomeData.map((_, i) => (
                        <Cell key={i} fill={pieOutcomeData[i].fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v ?? 0, "Count"]} contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                    <Legend wrapperStyle={{ fontFamily: "monospace", fontWeight: 700 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={s.chartCard}>
              <h3 style={s.chartTitle}>Placed Students by Degree</h3>
              <div style={s.chartWrap}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieDegreeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderCustomPieLabel}
                      stroke="#000"
                      strokeWidth={2}
                    >
                      {pieDegreeData.map((_, i) => (
                        <Cell key={i} fill={pieDegreeData[i].fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v ?? 0, "Hired"]} contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                    <Legend wrapperStyle={{ fontFamily: "monospace", fontWeight: 700 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Company-wise Hires (How many each company hired)</h3>
            <div style={{ ...s.chartWrap, height: "320px" }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={companyChartData} layout="vertical" margin={{ top: 8, right: 24, left: 80, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis type="number" tick={{ fontFamily: "monospace", fontSize: 11 }} stroke="#000" />
                  <YAxis type="category" dataKey="name" tick={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }} stroke="#000" width={70} />
                  <Tooltip contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                  <Bar dataKey="count" name="Hires" fill="#000" stroke="#000" strokeWidth={2} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={s.chartGrid}>
            <div style={s.chartCard}>
              <h3 style={s.chartTitle}>Placement % by Degree</h3>
              <div style={s.chartWrap}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataByDegree} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" tick={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }} stroke="#000" />
                    <YAxis tick={{ fontFamily: "monospace", fontSize: 11 }} stroke="#000" domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                    <Bar dataKey="Placement %" fill="#000" stroke="#000" strokeWidth={2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={s.chartCard}>
              <h3 style={s.chartTitle}>Median CTC (LPA) by Degree</h3>
              <div style={s.chartWrap}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartDataByDegree} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" tick={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }} stroke="#000" />
                    <YAxis tick={{ fontFamily: "monospace", fontSize: 11 }} stroke="#000" />
                    <Tooltip contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                    <Bar dataKey="Median CTC (LPA)" radius={[4, 4, 0, 0]}>
                      {chartDataByDegree.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Placement % Trend (2022-23 to 2024-25)</h3>
            <div style={s.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="degree" tick={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700 }} stroke="#000" />
                  <YAxis tick={{ fontFamily: "monospace", fontSize: 11 }} stroke="#000" domain={[70, 100]} />
                  <Tooltip contentStyle={{ fontFamily: "monospace", border: "2px solid black" }} />
                  <Legend wrapperStyle={{ fontFamily: "monospace", fontWeight: 700 }} />
                  <Line type="monotone" dataKey="2022-23" stroke="#000" strokeWidth={2} dot={{ fill: "#000", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="2023-24" stroke="#333" strokeWidth={2} dot={{ fill: "#333", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="2024-25" stroke="#555" strokeWidth={2} dot={{ fill: "#555", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Company-wise table */}
          <h3 style={s.subSectionTitle}>Company-wise Hire Count — {yearData.year}</h3>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Company</th>
                  <th style={s.th}># Hired</th>
                </tr>
              </thead>
              <tbody>
                {yearData.companyHires.map((c) => (
                  <tr key={c.name}>
                    <td style={s.td}>{c.name}</td>
                    <td style={s.td}>{c.count}</td>
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

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    fontFamily: "monospace",
    color: "#000"
  },
  topNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    backgroundColor: "#fff",
    borderBottom: "2px solid black",
    boxShadow: "0 4px 0 black",
  },
  topNavLeft: { display: "flex", alignItems: "center", gap: "12px" },
  topNavRight: { display: "flex", alignItems: "center", gap: "12px" },
  navBtn: {
    padding: "10px 18px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "2px 2px 0px black",
    transition: "all 0.2s ease",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: 0,
  },
  title: {
    margin: "24px 0 12px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#000",
  },
  intro: {
    margin: "0 0 24px",
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#000",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    alignItems: "flex-end",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "12px",
    boxShadow: "4px 4px 0px black",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  filterLabel: { fontSize: "12px", fontWeight: 700, color: "#000" },
  tabRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  yearTab: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "2px 2px 0px black",
    transition: "all 0.2s ease",
  },
  yearTabActive: {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "2px 2px 0px #333",
  },
  select: {
    padding: "10px 14px",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "monospace",
    backgroundColor: "#fff",
    minWidth: "160px",
  },
  section: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "8px 8px 0px black",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "20px",
    fontWeight: 700,
    color: "#000",
  },
  subSectionTitle: {
    margin: "24px 0 12px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#000",
  },
  tableWrap: {
    overflowX: "auto",
    border: "2px solid black",
    borderRadius: "12px",
    boxShadow: "4px 4px 0px black",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "monospace",
  },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    borderBottom: "2px solid black",
    backgroundColor: "#f0f0f0",
    color: "#000",
    fontSize: "12px",
    fontWeight: 700,
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #e0e0e0",
    color: "#000",
    fontSize: "13px",
  },
  tr: {},
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  chartCard: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "4px 4px 0px black",
  },
  chartTitle: {
    margin: "0 0 12px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#000",
  },
  chartWrap: {
    width: "100%",
    height: "280px",
  },
};

export default StatsPage;

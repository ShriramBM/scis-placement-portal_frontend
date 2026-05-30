import { useCallback, useEffect, useMemo, useState } from "react";
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
import PublicSiteHeader from "../components/PublicSiteHeader";
import PublicSiteFooter from "../components/PublicSiteFooter";
import api from "../services/api";
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

interface YearData {
  year: string;
  batchYear: number;
  isLive?: boolean;
  rows: YearRow[];
  companyHires: CompanyHire[];
  summary: {
    totalStudents: number;
    totalPlaced: number;
    highestPackage: number;
    topRecruiters: string[];
  };
}

const DEGREE_OPTIONS = ["All", "MCA", "MTech (CSE)", "MTech (AI)", "MTech (IT)", "IMTech"];
const COLORS = ["#1a365d", "#8b0000", "#b91c1c", "#94a3b8", "#475569"];
const PIE_COLORS = ["#1a365d", "#8b0000", "#b91c1c", "#c53030", "#94a3b8", "#cbd5e1", "#e2e8f0"];

const StatsPage = () => {
  const [statsData, setStatsData] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("All");

  const fetchStats = useCallback(async () => {
    try {
      setError("");
      const res = await api.get("/stats");
      setStatsData(res.data.years ?? []);
    } catch {
      setError("Failed to load placement statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchStats();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchStats]);

  const yearData = statsData[selectedYear];

  const filteredRows = useMemo(
    () =>
      yearData
        ? degreeFilter === "All"
          ? yearData.rows
          : yearData.rows.filter((r) => r.degree === degreeFilter)
        : [],
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
      { name: "Placed", value: placed, fill: "#1a365d" },
      { name: "Higher Studies", value: higher, fill: "#8b0000" },
      { name: "Not Placed", value: notPlaced, fill: "#94a3b8" },
    ].filter((d) => d.value > 0);
  }, [filteredRows]);

  const pieDegreeData = useMemo(
    () =>
      filteredRows
        .filter((r) => r.placedCount > 0)
        .map((r, i) => ({
          name: r.degree,
          value: r.placedCount,
          fill: PIE_COLORS[i % PIE_COLORS.length],
        })),
    [filteredRows]
  );

  const trendData = useMemo(() => {
    if (statsData.length < 2) return [];

    const degrees = new Set<string>();
    statsData.forEach((y) => y.rows.forEach((r) => degrees.add(r.degree)));

    return [...degrees].map((degree) => {
      const point: Record<string, string | number> = { degree };
      statsData.forEach((y) => {
        const row = y.rows.find((r) => r.degree === degree);
        point[y.year] = row?.placedPct ?? 0;
      });
      return point;
    });
  }, [statsData]);

  const trendYears = useMemo(() => statsData.map((y) => y.year), [statsData]);

  const renderCustomPieLabel = ({ name = "", percent = 0 }: { name?: string; percent?: number }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  if (loading) {
    return (
      <div className="scis-page-root">
        <PublicSiteHeader activeNav="stats" brandTitle="SCIS Placement Analytics" brandSubtitle="Training and Placement Cell" />
        <main className="scis-container scis-main-content">
          <p className="scis-page-intro">Loading placement statistics…</p>
        </main>
        <PublicSiteFooter />
      </div>
    );
  }

  if (error || !yearData) {
    return (
      <div className="scis-page-root">
        <PublicSiteHeader activeNav="stats" brandTitle="SCIS Placement Analytics" brandSubtitle="Training and Placement Cell" />
        <main className="scis-container scis-main-content">
          <p className="scis-auth-error">{error || "No placement data available yet."}</p>
          <button type="button" className="scis-btn-secondary" onClick={fetchStats}>
            Retry
          </button>
        </main>
        <PublicSiteFooter />
      </div>
    );
  }

  return (
    <div className="scis-page-root">
      <PublicSiteHeader
        activeNav="stats"
        brandTitle="SCIS Placement Analytics"
        brandSubtitle="Training and Placement Cell"
      />

      <main className="scis-container scis-main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h1 className="scis-page-title">Placement Statistics</h1>
            <p className="scis-page-intro">
              Batches from 2026-27 onward update live when coordinators mark students as placed.
              Earlier batches (e.g. 2025-26) show archived statistics.
            </p>
          </div>
          <button type="button" className="scis-btn-secondary" onClick={fetchStats}>
            Refresh
          </button>
        </div>

        <section className="scis-panel">
          <div className="scis-tag-row">
            <span className="scis-tag">{yearData.year}</span>
            {yearData.isLive && <span className="scis-tag">Live</span>}
            <span className="scis-tag">{yearData.summary.totalPlaced} placed</span>
            {yearData.summary.highestPackage > 0 && (
              <span className="scis-tag">Highest package: {yearData.summary.highestPackage} LPA</span>
            )}
            {yearData.summary.topRecruiters.length > 0 && (
              <span className="scis-tag">
                Top recruiters: {yearData.summary.topRecruiters.join(", ")}
              </span>
            )}
          </div>
        </section>

        <section className="scis-panel">
          <div className="scis-filter-grid">
            <div>
              <label className="scis-filter-label">Year</label>
              <div className="scis-tab-row">
                {statsData.map((y, i) => (
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
          {filteredRows.length === 0 ? (
            <p className="scis-page-intro">No student data for this filter yet.</p>
          ) : (
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
                      <td>{row.medianLpa || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {filteredRows.length > 0 && (
          <section className="scis-panel">
            <h2 className="scis-section-title">Visualization — {yearData.year}</h2>

            <div className="scis-chart-grid">
              {pieOutcomeData.length > 0 && (
                <div className="scis-chart-card">
                  <h3 className="scis-chart-title">Outcome Split</h3>
                  <div className="scis-chart-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={pieOutcomeData} dataKey="value" nameKey="name" outerRadius={100} label={renderCustomPieLabel}>
                          {pieOutcomeData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [v ?? 0, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {pieDegreeData.length > 0 && (
                <div className="scis-chart-card">
                  <h3 className="scis-chart-title">Placed Students by Degree</h3>
                  <div className="scis-chart-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={pieDegreeData} dataKey="value" nameKey="name" outerRadius={100} label={renderCustomPieLabel}>
                          {pieDegreeData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [v ?? 0, "Hired"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {yearData.companyHires.length > 0 && (
              <>
                <div className="scis-chart-card">
                  <h3 className="scis-chart-title">Company-wise Hires</h3>
                  <div className="scis-chart-wrap scis-chart-wrap-tall">
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={yearData.companyHires} layout="vertical" margin={{ top: 8, right: 24, left: 90, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#1a365d" />
                        <YAxis type="category" dataKey="name" stroke="#1a365d" width={80} />
                        <Tooltip />
                        <Bar dataKey="count" name="Hires" fill="#8b0000" radius={[0, 6, 6, 0]} />
                      </BarChart>
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
              </>
            )}

            <div className="scis-chart-grid">
              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Placement % by Degree</h3>
                <div className="scis-chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartDataByDegree}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#1a365d" />
                      <YAxis domain={[0, 100]} stroke="#1a365d" />
                      <Tooltip />
                      <Bar dataKey="Placement %" fill="#1a365d" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Median CTC (LPA)</h3>
                <div className="scis-chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartDataByDegree}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#1a365d" />
                      <YAxis stroke="#1a365d" />
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

            {trendData.length > 0 && trendYears.length > 1 && (
              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Placement % Trend</h3>
                <div className="scis-chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="degree" stroke="#1a365d" />
                      <YAxis stroke="#1a365d" />
                      <Tooltip />
                      <Legend />
                      {trendYears.map((year, i) => (
                        <Line
                          key={year}
                          type="monotone"
                          dataKey={year}
                          stroke={PIE_COLORS[i % PIE_COLORS.length]}
                          strokeWidth={3}
                          dot={{ fill: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default StatsPage;

import { useEffect, useMemo, useState } from "react";
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
import { PLACEMENT_STATS_DATA, type YearRow } from "../data/placementStatsData";
import "./public-pages.css";

const DEGREE_OPTIONS = ["All", "MCA", "MTech (CSE)", "MTech (AI)", "MTech (IT)", "IMTech"];
const COLORS = ["#1a365d", "#8b0000", "#b91c1c", "#94a3b8", "#475569"];
const PIE_COLORS = ["#1a365d", "#8b0000", "#b91c1c", "#c53030", "#94a3b8", "#cbd5e1", "#e2e8f0"];

/** No highlight box on tap/hover; no browser focus ring on tooltip */
const CHART_TOOLTIP = {
  cursor: false,
  wrapperStyle: { outline: "none" },
} as const;

const PIE_ACTIVE_SHAPE = { stroke: "none", strokeWidth: 0, outline: "none" } as const;

function useStatsViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return {
    isMobile,
    chartHeight: isMobile ? 240 : 280,
    chartHeightTall: isMobile ? 260 : 320,
    pieRadius: isMobile ? 68 : 100,
    axisTick: isMobile ? 10 : 12,
    barMargin: isMobile
      ? { top: 8, right: 8, left: 4, bottom: 8 }
      : { top: 8, right: 24, left: 90, bottom: 8 },
    categoryAxisWidth: isMobile ? 64 : 80,
    xAxisAngle: isMobile ? -32 : 0,
    xAxisHeight: isMobile ? 52 : 30,
    legendProps: isMobile
      ? { verticalAlign: "bottom" as const, wrapperStyle: { fontSize: 11, paddingTop: 8 } }
      : {},
  };
}

const STATS_CARD_FIELDS: { key: keyof YearRow | "medianLabel"; label: string; format?: (row: YearRow) => string }[] = [
  { key: "students", label: "Students" },
  { key: "registered", label: "Registered" },
  { key: "placedCount", label: "Placed" },
  { key: "medianLpa", label: "Median CTC", format: (r) => (r.medianLpa ? `${r.medianLpa} LPA` : "—") },
  { key: "lowestLpa", label: "Min CTC", format: (r) => (r.lowestLpa ? `${r.lowestLpa} LPA` : "—") },
  { key: "highestLpa", label: "Max CTC", format: (r) => (r.highestLpa ? `${r.highestLpa} LPA` : "—") },
];

const StatsRowCard = ({
  row,
  internedCount,
  combinedPct,
}: {
  row: YearRow;
  internedCount: number;
  combinedPct: number;
}) => (
  <article className="scis-stats-card">
    <h3 className="scis-stats-card-title">{row.degree}</h3>
    <ul className="scis-stats-card-grid">
      {STATS_CARD_FIELDS.map(({ key, label, format }) => (
        <li key={label}>
          <span className="scis-stats-card-label">{label}</span>
          <span className="scis-stats-card-value">
            {format ? format(row) : String(row[key as keyof YearRow])}
          </span>
        </li>
      ))}
      <li>
        <span className="scis-stats-card-label">Internship</span>
        <span className="scis-stats-card-value">{internedCount}</span>
      </li>
      <li>
        <span className="scis-stats-card-label">% Placed + Interned</span>
        <span className="scis-stats-card-value">{combinedPct.toFixed(2)}%</span>
      </li>
    </ul>
  </article>
);

const StatsPage = () => {
  const statsData = PLACEMENT_STATS_DATA;
  const [selectedYear, setSelectedYear] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [statsCategory, setStatsCategory] = useState<"placement" | "internship">("placement");
  const viewport = useStatsViewport();

  const yearData = statsData[selectedYear];
  // Summary years have no internship breakdown to show a tab for — always treat them as "placement".
  const effectiveCategory = yearData.dataLevel === "full" ? statsCategory : "placement";

  const filteredRows = useMemo(
    () =>
      degreeFilter === "All"
        ? yearData.rows
        : yearData.rows.filter((r) => r.degree === degreeFilter),
    [yearData, degreeFilter]
  );

  // Some summary years (e.g. 2022-23) don't have a registered count recorded yet —
  // hide the Registered/% Placed columns entirely rather than show a wall of "—".
  const hasRegisteredData = useMemo(() => filteredRows.some((r) => r.registered != null), [filteredRows]);

  const filteredInternshipRows = useMemo(
    () =>
      degreeFilter === "All"
        ? yearData.internshipRows
        : yearData.internshipRows.filter((r) => r.degree === degreeFilter),
    [yearData, degreeFilter]
  );

  // Placement + internship combined per degree — used by the cards, the main table's
  // "# Internship" and "% Placed + Interned" columns, and the pie chart below.
  const filteredRowsWithInternship = useMemo(
    () =>
      filteredRows.map((row) => {
        const internedCount = yearData.internshipRows.find((ir) => ir.degree === row.degree)?.internedCount ?? 0;
        const total = row.students ?? 0;
        const combinedPct = total > 0 ? ((row.placedCount + internedCount) / total) * 100 : 0;
        return { row, internedCount, combinedPct };
      }),
    [filteredRows, yearData.internshipRows]
  );

  const chartDataByDegree = useMemo(
    () =>
      filteredRowsWithInternship.map(({ row, combinedPct }) => ({
        name: row.degree,
        "Placement %": combinedPct,
        "Median CTC (LPA)": row.medianLpa,
      })),
    [filteredRowsWithInternship]
  );

  // Placed / Interns / Not Placed must be mutually exclusive shares of total students
  // for the percentages to add up to 100% — interns are drawn from the not-yet-placed
  // pool, so "Not Placed" here means neither placed nor currently interning.
  const pieOutcomeData = useMemo(() => {
    const placed = filteredRows.reduce((s, r) => s + r.placedCount, 0);
    const interned = filteredInternshipRows.reduce((s, r) => s + r.internedCount, 0);
    const totalStudents = filteredRows.reduce((s, r) => s + (r.students ?? 0), 0);
    const notPlaced = Math.max(totalStudents - placed - interned, 0);
    return [
      { name: "Placed", value: placed, fill: "#1a365d" },
      { name: "Interns", value: interned, fill: "#475569" },
      { name: "Not Placed", value: notPlaced, fill: "#94a3b8" },
    ].filter((d) => d.value > 0);
  }, [filteredRows, filteredInternshipRows]);

  // Only years with a full breakdown have a placement % to trend — summary years
  // (older years with just # placed and a CTC range) have no total-students figure
  // to compute a percentage from, so they're excluded here rather than shown as 0%.
  const fullYearsData = useMemo(() => statsData.filter((y) => y.dataLevel === "full"), [statsData]);

  const trendData = useMemo(() => {
    if (fullYearsData.length < 2) return [];

    const degrees = new Set<string>();
    fullYearsData.forEach((y) => y.rows.forEach((r) => degrees.add(r.degree)));

    return [...degrees].map((degree) => {
      const point: Record<string, string | number> = { degree };
      fullYearsData.forEach((y) => {
        const row = y.rows.find((r) => r.degree === degree);
        point[y.year] = row?.placedPct ?? 0;
      });
      return point;
    });
  }, [fullYearsData]);

  const trendYears = useMemo(() => fullYearsData.map((y) => y.year), [fullYearsData]);

  const summaryTotals = useMemo(() => {
    if (filteredRows.length === 0) return null;
    const placedTotal = filteredRows.reduce((s, r) => s + r.placedCount, 0);
    const lowestValues = filteredRows.map((r) => r.lowestLpa).filter((v): v is number => v != null);
    const highestValues = filteredRows.map((r) => r.highestLpa).filter((v): v is number => v != null);
    const allRegistered = filteredRows.every((r) => r.registered != null);
    const registeredTotal = allRegistered ? filteredRows.reduce((s, r) => s + (r.registered ?? 0), 0) : undefined;
    return {
      placedTotal,
      registeredTotal,
      placedPct: registeredTotal ? (placedTotal / registeredTotal) * 100 : undefined,
      lowestLpa: lowestValues.length ? Math.min(...lowestValues) : undefined,
      highestLpa: highestValues.length ? Math.max(...highestValues) : undefined,
    };
  }, [filteredRows]);

  // "Company-wise Hires" chart shows total engagement per company — placement
  // offers plus internships combined — rather than placement alone.
  const combinedCompanyHires = useMemo(() => {
    const counts = new Map<string, number>();
    yearData.companyHires.forEach((c) => counts.set(c.name, (counts.get(c.name) ?? 0) + c.count));
    yearData.internshipCompanyHires.forEach((c) => counts.set(c.name, (counts.get(c.name) ?? 0) + c.count));
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [yearData.companyHires, yearData.internshipCompanyHires]);

  // "Company-wise Hire Count" table — same merge as above, but keeping the placed
  // and interned counts separate per company (plus placement avg salary and intern avg stipend).
  const placementCompanyTable = useMemo(() => {
    const map = new Map<
      string,
      { name: string; hired: number; interns: number; avgLpa?: number; avgStipend?: number }
    >();
    yearData.companyHires.forEach((c) => {
      map.set(c.name, { name: c.name, hired: c.count, interns: 0, avgLpa: c.avgLpa });
    });
    yearData.internshipCompanyHires.forEach((c) => {
      const existing = map.get(c.name);
      if (existing) {
        existing.interns = c.count;
        existing.avgStipend = c.avgStipend;
      } else {
        map.set(c.name, { name: c.name, hired: 0, interns: c.count, avgStipend: c.avgStipend });
      }
    });
    return [...map.values()].sort((a, b) => b.hired + b.interns - (a.hired + a.interns));
  }, [yearData.companyHires, yearData.internshipCompanyHires]);

  const totalInterned = useMemo(
    () => yearData.internshipRows.reduce((s, r) => s + r.internedCount, 0),
    [yearData.internshipRows]
  );

  const companyChartHeight = useMemo(() => {
    const rows = combinedCompanyHires.length;
    const base = viewport.isMobile ? 260 : 320;
    return Math.max(base, rows * (viewport.isMobile ? 32 : 28));
  }, [combinedCompanyHires.length, viewport.isMobile]);

  const renderCustomPieLabel = ({ name = "", percent = 0 }: { name?: string; percent?: number }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  const degreeXAxis = {
    stroke: "#1a365d",
    tick: { fontSize: viewport.axisTick },
    angle: viewport.xAxisAngle,
    textAnchor: viewport.xAxisAngle ? ("end" as const) : ("middle" as const),
    height: viewport.xAxisHeight,
    interval: 0,
  };

  return (
    <div className="scis-page-root scis-stats-page">
      <PublicSiteHeader
        activeNav="stats"
        brandTitle="SCIS Placement Analytics"
        brandSubtitle="Training and Placement Cell"
      />

      <main className="scis-container scis-main-content">
        <h1 className="scis-page-title">Placement Statistics</h1>
        <p className="scis-page-intro">
          Year-wise placement outcomes across MCA, M.Tech, and Integrated M.Tech programmes.
        </p>

        <section className="scis-panel">
          <div className="scis-tag-row">
            <span className="scis-tag">{yearData.year}</span>
            <span className="scis-tag">
              {yearData.summary.totalStudents > 0
                ? `${(
                    ((yearData.summary.totalPlaced + totalInterned) / yearData.summary.totalStudents) *
                    100
                  ).toFixed(2)}% placed`
                : `${yearData.summary.totalPlaced} placed`}
            </span>
            {yearData.summary.lowestPackage !== undefined && yearData.summary.lowestPackage > 0 && (
              <span className="scis-tag">Lowest package: {yearData.summary.lowestPackage} LPA</span>
            )}
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

        <section className="scis-panel scis-stats-filters">
          <div className="scis-filter-grid">
            <div>
              <label className="scis-filter-label" htmlFor="stats-year-tabs">
                Year
              </label>
              <div id="stats-year-tabs" className="scis-tab-row" role="tablist" aria-label="Academic year">
                {statsData.map((y, i) => (
                  <button
                    key={y.year}
                    type="button"
                    role="tab"
                    aria-selected={selectedYear === i}
                    className={`scis-tab ${selectedYear === i ? "scis-tab-active" : ""}`}
                    onClick={() => setSelectedYear(i)}
                  >
                    {y.year}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="scis-filter-label" htmlFor="stats-degree-filter">
                Degree
              </label>
              <select
                id="stats-degree-filter"
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="scis-select"
              >
                {DEGREE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="scis-panel">
          {yearData.dataLevel === "full" && (
            <div className="scis-tab-row" role="tablist" aria-label="Statistics category">
              <button
                type="button"
                role="tab"
                aria-selected={statsCategory === "placement"}
                className={`scis-tab ${statsCategory === "placement" ? "scis-tab-active" : ""}`}
                onClick={() => setStatsCategory("placement")}
              >
                Placement
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statsCategory === "internship"}
                className={`scis-tab ${statsCategory === "internship" ? "scis-tab-active" : ""}`}
                onClick={() => setStatsCategory("internship")}
              >
                Internship
              </button>
            </div>
          )}

          {effectiveCategory === "placement" ? (
            <>
              <h2 className="scis-section-title">
                Year {yearData.year} {degreeFilter !== "All" ? `— ${degreeFilter}` : ""}
              </h2>
              {filteredRows.length === 0 ? (
                <p className="scis-page-intro">No data for this filter.</p>
              ) : yearData.dataLevel === "full" ? (
                <>
                  <div className="scis-stats-cards" aria-label="Placement data by degree">
                    {filteredRowsWithInternship.map(({ row, internedCount, combinedPct }) => (
                      <StatsRowCard
                        key={row.degree}
                        row={row}
                        internedCount={internedCount}
                        combinedPct={combinedPct}
                      />
                    ))}
                  </div>
                  <div className="scis-table-wrap scis-table-wrap--wide scis-stats-table-desktop">
                    <table className="scis-table">
                      <thead>
                        <tr>
                          <th>Degree</th>
                          <th>Students</th>
                          <th>Registered</th>
                          <th>Placed</th>
                          <th>Internship</th>
                          <th>% Placed </th>
                          <th>Median CTC (LPA)</th>
                          <th>Min CTC (LPA)</th>
                          <th>Max CTC (LPA)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRowsWithInternship.map(({ row, internedCount, combinedPct }) => (
                          <tr key={row.degree}>
                            <td>{row.degree}</td>
                            <td>{row.students}</td>
                            <td>{row.registered}</td>
                            <td>{row.placedCount}</td>
                            <td>{internedCount}</td>
                            <td>{combinedPct.toFixed(2)}%</td>
                            <td>{row.medianLpa || "—"}</td>
                            <td>{row.lowestLpa ?? "—"}</td>
                            <td>{row.highestLpa ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {placementCompanyTable.length > 0 && (
                    <>
                      <h3 className="scis-sub-title">Company-wise Hire Count</h3>
                      <div className="scis-table-wrap scis-stats-company-table">
                        <table className="scis-table scis-table--compact">
                          <thead>
                            <tr>
                              <th>Company</th>
                              <th>Hired</th>
                              <th>Interns</th>
                              <th>Avg Salary (LPA)</th>
                              <th>Avg Intern Salary (₹/month)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {placementCompanyTable.map((c) => (
                              <tr key={c.name}>
                                <td>{c.name}</td>
                                <td>{c.hired}</td>
                                <td>{c.interns}</td>
                                <td>{c.avgLpa ?? "—"}</td>
                                <td>{c.avgStipend ? c.avgStipend.toLocaleString("en-IN") : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="scis-table-wrap scis-table-wrap--wide scis-stats-table-desktop">
                    <table className="scis-table">
                      <thead>
                        <tr>
                          <th>Programme</th>
                          {hasRegisteredData && <th>Registered</th>}
                          <th>Placed</th>
                          {hasRegisteredData && <th>% Placed</th>}
                          <th>Lowest (LPA)</th>
                          <th>Highest (LPA)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row) => (
                          <tr key={row.degree}>
                            <td>{row.degree}</td>
                            {hasRegisteredData && <td>{row.registered ?? "—"}</td>}
                            <td>{row.placedCount}</td>
                            {hasRegisteredData && (
                              <td>
                                {row.registered
                                  ? `${((row.placedCount / row.registered) * 100).toFixed(2)}%`
                                  : "—"}
                              </td>
                            )}
                            <td>{row.lowestLpa ?? "—"}</td>
                            <td>{row.highestLpa ?? "—"}</td>
                          </tr>
                        ))}
                        {summaryTotals && filteredRows.length > 1 && (
                          <tr className="scis-table-total-row">
                            <td>Total</td>
                            {hasRegisteredData && <td>{summaryTotals.registeredTotal ?? "—"}</td>}
                            <td>{summaryTotals.placedTotal}</td>
                            {hasRegisteredData && (
                              <td>{summaryTotals.placedPct ? `${summaryTotals.placedPct.toFixed(2)}%` : "—"}</td>
                            )}
                            <td>{summaryTotals.lowestLpa ?? "—"}</td>
                            <td>{summaryTotals.highestLpa ?? "—"}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {yearData.highlights && (
                    <>
                      <h3 className="scis-sub-title">{yearData.highlights.title}</h3>
                      <ul className="scis-list">
                        {yearData.highlights.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="scis-section-title">
                Internships — {yearData.year} {degreeFilter !== "All" ? `— ${degreeFilter}` : ""}
              </h2>
              {filteredInternshipRows.length === 0 ? (
                <p className="scis-page-intro">No internship data for this filter.</p>
              ) : (
                <>
                  <div className="scis-table-wrap scis-stats-company-table">
                    <table className="scis-table scis-table--compact">
                      <thead>
                        <tr>
                          <th>Degree</th>
                          <th>Interned</th>
                          <th>Median Duration (Months)</th>
                          <th>Median Stipend (₹/month)</th>
                          <th>Min Stipend (₹/month)</th>
                          <th>Max Stipend (₹/month)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInternshipRows.map((row) => (
                          <tr key={row.degree}>
                            <td>{row.degree}</td>
                            <td>{row.internedCount}</td>
                            <td>{row.internedCount ? row.medianDurationMonths : "—"}</td>
                            <td>{row.internedCount ? row.medianStipend.toLocaleString("en-IN") : "—"}</td>
                            <td>{row.minStipend ? row.minStipend.toLocaleString("en-IN") : "—"}</td>
                            <td>{row.maxStipend ? row.maxStipend.toLocaleString("en-IN") : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {yearData.internshipCompanyHires.length > 0 && (
                    <>
                      <h3 className="scis-sub-title">Internship Company-wise Count</h3>
                      <div className="scis-table-wrap scis-stats-company-table">
                        <table className="scis-table scis-table--compact">
                          <thead>
                            <tr>
                              <th>Company</th>
                              <th>Interns</th>
                              <th>Avg Stipend (₹/month)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearData.internshipCompanyHires.map((c) => (
                              <tr key={c.name}>
                                <td>{c.name}</td>
                                <td>{c.count}</td>
                                <td>{c.avgStipend ? c.avgStipend.toLocaleString("en-IN") : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </section>

        {filteredRows.length > 0 && yearData.dataLevel === "full" && (
          <section className="scis-panel scis-stats-viz">
          <button
                type="button"
                role="tab"
                aria-selected={statsCategory === "placement"}
                className="scis-tab scis-tab-active"
               style={{marginBottom:"15px"}}
              >
                Placement
            </button>
            <h2 className="scis-section-title">Visualization — {yearData.year}</h2>

            <div className="scis-chart-grid">
              {pieOutcomeData.length > 0 && (
                <div className="scis-chart-card">
                  <h3 className="scis-chart-title">Outcome Split</h3>
                  <div className="scis-chart-wrap">
                    <ResponsiveContainer width="100%" height={viewport.chartHeight}>
                      <PieChart>
                        <Pie
                          data={pieOutcomeData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={viewport.pieRadius}
                          stroke="none"
                          activeShape={PIE_ACTIVE_SHAPE}
                          label={viewport.isMobile ? false : renderCustomPieLabel}
                        >
                          {pieOutcomeData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip {...CHART_TOOLTIP} formatter={(v) => [v ?? 0, "Count"]} />
                        <Legend {...viewport.legendProps} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              
            </div>

            {combinedCompanyHires.length > 0 && (
              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Company-wise Hires (Placement + Internship)</h3>
                <div
                  className="scis-chart-wrap scis-chart-wrap-tall"
                  style={{ height: companyChartHeight }}
                >
                  <ResponsiveContainer width="100%" height={companyChartHeight}>
                    <BarChart
                      data={combinedCompanyHires}
                      layout="vertical"
                      margin={viewport.barMargin}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#1a365d" tick={{ fontSize: viewport.axisTick }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#1a365d"
                        width={viewport.categoryAxisWidth}
                        tick={{ fontSize: viewport.axisTick }}
                      />
                      <Tooltip {...CHART_TOOLTIP} />
                      <Bar dataKey="count" name="Hires" fill="#8b0000" radius={[0, 6, 6, 0]} activeBar={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="scis-chart-grid" style={{marginTop:"15px"}}>
              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Placement % by Degree</h3>
                <div className="scis-chart-wrap">
                  <ResponsiveContainer width="100%" height={viewport.chartHeight}>
                    <BarChart
                      data={chartDataByDegree}
                      margin={{ top: 8, right: 8, left: viewport.isMobile ? -8 : 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" {...degreeXAxis} />
                      <YAxis domain={[0, 100]} stroke="#1a365d" tick={{ fontSize: viewport.axisTick }} width={viewport.isMobile ? 36 : 60} />
                      <Tooltip {...CHART_TOOLTIP} />
                      <Bar dataKey="Placement %" fill="#1a365d" radius={[6, 6, 0, 0]} activeBar={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="scis-chart-card">
                <h3 className="scis-chart-title">Median CTC (LPA)</h3>
                <div className="scis-chart-wrap">
                  <ResponsiveContainer width="100%" height={viewport.chartHeight}>
                    <BarChart
                      data={chartDataByDegree}
                      margin={{ top: 8, right: 8, left: viewport.isMobile ? -8 : 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" {...degreeXAxis} />
                      <YAxis stroke="#1a365d" tick={{ fontSize: viewport.axisTick }} width={viewport.isMobile ? 36 : 60} />
                      <Tooltip {...CHART_TOOLTIP} />
                      <Bar dataKey="Median CTC (LPA)" radius={[6, 6, 0, 0]} activeBar={false}>
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
                  <ResponsiveContainer width="100%" height={viewport.chartHeight}>
                    <LineChart
                      data={trendData}
                      margin={{ top: 8, right: 8, left: viewport.isMobile ? -4 : 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="degree" {...degreeXAxis} />
                      <YAxis stroke="#1a365d" tick={{ fontSize: viewport.axisTick }} width={viewport.isMobile ? 36 : 60} />
                      <Tooltip {...CHART_TOOLTIP} />
                      <Legend {...viewport.legendProps} />
                      {trendYears.map((year, i) => (
                        <Line
                          key={year}
                          type="monotone"
                          dataKey={year}
                          stroke={PIE_COLORS[i % PIE_COLORS.length]}
                          strokeWidth={viewport.isMobile ? 2 : 3}
                          dot={{ fill: PIE_COLORS[i % PIE_COLORS.length], r: viewport.isMobile ? 3 : 4 }}
                          activeDot={false}
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

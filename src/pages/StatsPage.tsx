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
  { key: "higherStudiesCount", label: "Higher studies" },
  { key: "notPlacedCount", label: "Not placed" },
  { key: "placedPct", label: "% Placed", format: (r) => `${r.placedPct.toFixed(2)}%` },
  { key: "higherStudiesPct", label: "% Higher studies", format: (r) => `${r.higherStudiesPct.toFixed(2)}%` },
  { key: "medianLpa", label: "Median CTC", format: (r) => (r.medianLpa ? `${r.medianLpa} LPA` : "—") },
];

const StatsRowCard = ({ row }: { row: YearRow }) => (
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
    </ul>
  </article>
);

const StatsPage = () => {
  const statsData = PLACEMENT_STATS_DATA;
  const [selectedYear, setSelectedYear] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("All");
  const viewport = useStatsViewport();

  const yearData = statsData[selectedYear];

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

  const companyChartHeight = useMemo(() => {
    const rows = yearData.companyHires.length;
    const base = viewport.isMobile ? 260 : 320;
    return Math.max(base, rows * (viewport.isMobile ? 32 : 28));
  }, [yearData.companyHires.length, viewport.isMobile]);

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
          <h2 className="scis-section-title">
            Year {yearData.year} {degreeFilter !== "All" ? `— ${degreeFilter}` : ""}
          </h2>
          {filteredRows.length === 0 ? (
            <p className="scis-page-intro">No data for this filter.</p>
          ) : (
            <>
              <div className="scis-stats-cards" aria-label="Placement data by degree">
                {filteredRows.map((row) => (
                  <StatsRowCard key={row.degree} row={row} />
                ))}
              </div>
              <div className="scis-table-wrap scis-table-wrap--wide scis-stats-table-desktop">
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
            </>
          )}
        </section>

        {filteredRows.length > 0 && (
          <section className="scis-panel scis-stats-viz">
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

              {pieDegreeData.length > 0 && (
                <div className="scis-chart-card">
                  <h3 className="scis-chart-title">Placed Students by Degree</h3>
                  <div className="scis-chart-wrap">
                    <ResponsiveContainer width="100%" height={viewport.chartHeight}>
                      <PieChart>
                        <Pie
                          data={pieDegreeData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={viewport.pieRadius}
                          stroke="none"
                          activeShape={PIE_ACTIVE_SHAPE}
                          label={viewport.isMobile ? false : renderCustomPieLabel}
                        >
                          {pieDegreeData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip {...CHART_TOOLTIP} formatter={(v) => [v ?? 0, "Hired"]} />
                        <Legend {...viewport.legendProps} />
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
                  <div
                    className="scis-chart-wrap scis-chart-wrap-tall"
                    style={{ height: companyChartHeight }}
                  >
                    <ResponsiveContainer width="100%" height={companyChartHeight}>
                      <BarChart
                        data={yearData.companyHires}
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

                <h3 className="scis-sub-title">Company-wise Hire Count</h3>
                <div className="scis-table-wrap scis-stats-company-table">
                  <table className="scis-table scis-table--compact">
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

export interface StatCard {
  label: string;
  value: number | string;
  hint?: string;
}

interface DashboardStatsProps {
  stats: StatCard[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div style={styles.grid}>
    {stats.map((stat) => (
      <div key={stat.label} style={styles.card}>
        <div style={styles.value}>{stat.value}</div>
        <div style={styles.label}>{stat.label}</div>
        {stat.hint ? <div style={styles.hint}>{stat.hint}</div> : null}
      </div>
    ))}
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#f8fafc",
    border: "none",
    borderRadius: "10px",
    padding: "14px 16px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  value: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1a365d",
    lineHeight: 1.1,
  },
  label: {
    marginTop: "6px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  hint: {
    marginTop: "4px",
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: 600,
  },
};

export default DashboardStats;

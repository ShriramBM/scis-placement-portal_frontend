interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const Pagination = ({
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) => {
  if (total === 0) return null;

  const pages = buildPageNumbers(page, totalPages);

  return (
    <div style={styles.wrap}>
      <span style={styles.summary}>
        {from}–{to} of {total} {itemLabel}
      </span>
      <div style={styles.controls}>
        <button
          type="button"
          style={{ ...styles.btn, ...(page <= 1 ? styles.btnDisabled : {}) }}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} style={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              style={{
                ...styles.btn,
                ...(p === page ? styles.btnActive : {}),
              }}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          style={{
            ...styles.btn,
            ...(page >= totalPages ? styles.btnDisabled : {}),
          }}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #e2e8f0",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  summary: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px",
  },
  btn: {
    minWidth: "36px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#1a365d",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  btnActive: {
    backgroundColor: "#1a365d",
    color: "#fff",
    borderColor: "#1a365d",
  },
  btnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  ellipsis: {
    padding: "0 4px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
  },
};

export default Pagination;

export interface YearRow {
  degree: string;
  placedCount: number;
  students?: number;
  registered?: number;
  higherStudiesCount?: number;
  notPlacedCount?: number;
  placedPct?: number;
  higherStudiesPct?: number;
  notPlacedPct?: number;
  medianLpa?: number;
  lowestLpa?: number;
  highestLpa?: number;
}

export interface CompanyHire {
  name: string;
  count: number;
  /** Average full-time CTC in LPA across that company's offers — omitted where
   *  the sheet's pay figure wasn't a clean annual LPA value (e.g. a monthly
   *  stipend-style entry or a foreign-currency figure). */
  avgLpa?: number;
  /** Average internship stipend in INR/month across that company's interns. */
  avgStipend?: number;
}

export interface InternshipRow {
  degree: string;
  internedCount: number;
  medianDurationMonths: number;
  medianStipend: number;
  minStipend?: number;
  maxStipend?: number;
}

export interface YearData {
  year: string;
  batchYear: number;
  /** "full": complete breakdown (students/registered/not-placed/etc), like 2025-26.
   *  "summary": only # placed and lowest/highest CTC are known, like older years —
   *  the UI renders a simpler table and skips charts that need the missing fields. */
  dataLevel: "full" | "summary";
  rows: YearRow[];
  companyHires: CompanyHire[];
  internshipRows: InternshipRow[];
  internshipCompanyHires: CompanyHire[];
  /** Free-text recruiter/internship notes for years with no structured internship
   *  breakdown — rendered as a titled bullet list below the placement table. */
  highlights?: {
    title: string;
    items: string[];
  };
  summary: {
    totalStudents: number;
    totalPlaced: number;
    highestPackage: number;
    lowestPackage?: number;
    topRecruiters: string[];
  };
}

/**
 * 2025–26 placement statistics, parsed directly from the "Total_Selctd_Studnt_Details"
 * tab of the placement cell's tracking sheet (Branch / Company / CTC / Duration /
 * Full-Time columns only — no student PII was read to produce these figures).
 *
 * `rows` counts ONLY records where the sheet's "Full-Time (Yes/No)/Salary" column is
 * "Yes" (including rows where it holds a salary figure instead of the literal word
 * "Yes") — records with that column blank or "No" are internship-only and are
 * excluded here, since they were previously miscounted as placements.
 * One Accenture / 4.5 LPA / Full-Time=Yes record has its Branch entered as the
 * generic "M.Tech.(Master of Technology)" with no CSE/AI/IT specified, so it could
 * not be attributed to a row below — it's counted in `companyHires` and
 * `summary.totalPlaced` but not in any per-degree row; worth checking against the
 * sheet directly.
 */
export const PLACEMENT_STATS_DATA: YearData[] = [
  {
    year: "2025-26",
    batchYear: 2025,
    dataLevel: "full",
    rows: [
      {
        degree: "MCA",
        students: 40,
        registered: 40,
        placedCount: 12,
        higherStudiesCount: 0,
        notPlacedCount: 28,
        placedPct: 30,
        higherStudiesPct: 0,
        notPlacedPct: 70,
        medianLpa: 6,
        lowestLpa: 3.6,
        highestLpa: 7.3,
      },
      {
        degree: "MTech (CSE)",
        students: 27,
        registered: 27,
        placedCount: 4,
        higherStudiesCount: 0,
        notPlacedCount: 23,
        placedPct: 14.81,
        higherStudiesPct: 0,
        notPlacedPct: 85.19,
        medianLpa: 6.5,
        lowestLpa: 6.5,
        highestLpa: 6.5,
      },
      {
        degree: "MTech (AI)",
        students: 23,
        registered: 23,
        placedCount: 3,
        higherStudiesCount: 0,
        notPlacedCount: 20,
        placedPct: 13.04,
        higherStudiesPct: 0,
        notPlacedPct: 86.96,
        medianLpa: 7.5,
        lowestLpa: 6.5,
        highestLpa: 11.59,
      },
      {
        degree: "MTech (IT)",
        students: 10,
        registered: 10,
        placedCount: 0,
        higherStudiesCount: 0,
        notPlacedCount: 10,
        placedPct: 0,
        higherStudiesPct: 0,
        notPlacedPct: 100,
        medianLpa: 0,
      },
      {
        degree: "IMTech",
        students: 27,
        registered: 27,
        placedCount: 2,
        higherStudiesCount: 0,
        notPlacedCount: 25,
        placedPct: 7.41,
        higherStudiesPct: 0,
        notPlacedPct: 92.59,
        medianLpa: 0,
      },
    ],
    companyHires: [
      { name: "Accenture", count: 10, avgLpa: 6.1 },
      { name: "TCS", count: 5, avgLpa: 5.94 },
      { name: "CuriousED", count: 2, avgLpa: 6 },
      { name: "Tapasya", count: 1, avgLpa: 6 },
      { name: "One Convergence", count: 1 },
      { name: "TrueID", count: 1, avgLpa: 7.5 },
      { name: "Teradata", count: 1 },
    ],
    internshipRows: [
      { degree: "MCA", internedCount: 0, medianDurationMonths: 0, medianStipend: 0 },
      { degree: "MTech (CSE)", internedCount: 6, medianDurationMonths: 10, medianStipend: 15000, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (AI)", internedCount: 6, medianDurationMonths: 10, medianStipend: 22500, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (IT)", internedCount: 3, medianDurationMonths: 10, medianStipend: 20000, minStipend: 15000, maxStipend: 50000 },
      { degree: "IMTech", internedCount: 19, medianDurationMonths: 10, medianStipend: 45000, minStipend: 10000, maxStipend: 50000 },
    ],
    internshipCompanyHires: [
      { name: "TCS", count: 10, avgStipend: 15000 },
      { name: "GE", count: 9, avgStipend: 45000 },
      { name: "Intel", count: 5, avgStipend: 49000 },
      { name: "Exim Bank", count: 3, avgStipend: 45000 },
      { name: "Signion", count: 2, avgStipend: 25000 },
      { name: "NetElixir", count: 2, avgStipend: 20000 },
      { name: "One Convergence", count: 1, avgStipend: 10000 },
      { name: "Novartis", count: 1, avgStipend: 35000 },
      { name: "Zelis", count: 1, avgStipend: 25000 },
       { name: "Members Co", count: 1 , avgStipend : 47640}
    ],
    summary: {
      totalStudents: 127,
      totalPlaced: 22,
      highestPackage: 11.59,
      topRecruiters: ["Accenture", "TCS", "CuriousED"],
    },
  },
  {
    year: "2024-25",
    batchYear: 2024,
    dataLevel: "summary",
    rows: [
      { degree: "IMTech", placedCount: 20, lowestLpa: 7.5, highestLpa: 38 },
      { degree: "MTech (CSE)", placedCount: 14, lowestLpa: 5.4, highestLpa: 46 },
      { degree: "MTech (AI)", placedCount: 8, lowestLpa: 9, highestLpa: 17 },
      { degree: "MCA", placedCount: 27, lowestLpa: 4.75, highestLpa: 15 },
    ],
    companyHires: [],
    internshipRows: [],
    internshipCompanyHires: [],
    summary: {
      totalStudents: 0,
      totalPlaced: 69,
      highestPackage: 46,
      topRecruiters: [],
    },
  },
  {
    year: "2023-24",
    batchYear: 2023,
    dataLevel: "summary",
    rows: [
      { degree: "IMTech", placedCount: 18, lowestLpa: 3.5, highestLpa: 17.89 },
      { degree: "MTech (CSE)", placedCount: 8, lowestLpa: 4.92, highestLpa: 17.89 },
      { degree: "MTech (AI)", placedCount: 3, lowestLpa: 5.64, highestLpa: 12 },
      { degree: "MTech (IT)", placedCount: 2, lowestLpa: 12, highestLpa: 15 },
      { degree: "MCA", placedCount: 24, lowestLpa: 3.5, highestLpa: 12 },
    ],
    companyHires: [],
    internshipRows: [],
    internshipCompanyHires: [],
    highlights: {
      title: "2023-24 Internships & Highlights",
      items: [
        "2 M.Tech and 4 I.M.Tech students selected as interns at GE Digital.",
        "Marvell recruited 8 interns (5 I.M.Tech + 3 M.Tech).",
        "MCA final semester converted into internship for industry exposure.",
      ],
    },
    summary: {
      totalStudents: 0,
      totalPlaced: 55,
      highestPackage: 17.89,
      topRecruiters: [],
    },
  },
  {
    year: "2022-23",
    batchYear: 2022,
    dataLevel: "summary",
    rows: [
      { degree: "IMTech", placedCount: 15, lowestLpa: 3.5, highestLpa: 15.52 },
      { degree: "MTech (CSE)", placedCount: 39, lowestLpa: 3.5, highestLpa: 7.9 },
      { degree: "MTech (AI)", placedCount: 21, lowestLpa: 3.5, highestLpa: 23 },
      { degree: "MTech (IT)", placedCount: 6, lowestLpa: 6.5, highestLpa: 47.47 },
      { degree: "MCA", placedCount: 50, lowestLpa: 3.5, highestLpa: 22.5 },
    ],
    companyHires: [],
    internshipRows: [],
    internshipCompanyHires: [],
    highlights: {
      title: "Top Recruiters & Internships",
      items: [
        "Intel: 7 interns (I.M.Tech, M.Tech CS, AI)",
        "GE: 2 students selected",
        "HEXAGON: 1 student recruited",
        "ACL Digital: 3 students recruited",
        "Companies: Samsung Semiconductors, Crisil, Quadratyx, One Convergence, Techsophy, Zentree Labs, LatentView Analytics, FactSet",
      ],
    },
    summary: {
      totalStudents: 0,
      totalPlaced: 131,
      highestPackage: 47.47,
      topRecruiters: [],
    },
  },
];

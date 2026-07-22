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
  /** Not available from years/sources where the sheet has no duration column
   *  (e.g. 2025-26's Branch/Company/Internship-Pay/Full-Time-Package sheet). */
  medianDurationMonths?: number;
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
 * 2025–26 placement statistics, recalculated from `placement2025_26Records.json`
 * (Branch / Company / Internship Pay / Full-Time Package columns only — no
 * student PII was read to produce these figures).
 *
 * `rows` counts a record as placed when its Full-Time Package cell is anything
 * other than blank/"No"/"-" (this includes a bare "Yes" with no figure, and any
 * numeric LPA value); `medianLpa`/`lowestLpa`/`highestLpa`/`avgLpa` only use
 * records where that cell was a clean numeric LPA figure, so placed-but-"Yes"-only
 * records raise placedCount without affecting those numbers.
 * `internshipRows`/`internshipCompanyHires` count a record as interned when its
 * Internship Pay cell is anything other than blank/"No"/"-"; `medianStipend`/
 * `minStipend`/`maxStipend`/`avgStipend` only use "Nk"-style figures (non-numeric
 * stipends, e.g. Members Co's original yen-denominated entry, are excluded from
 * those numbers but still counted in `internedCount`).
 * The sheet has no duration column for this year, so `medianDurationMonths` is
 * omitted on every 2025-26 internship row.
 * One Accenture / 4.5 LPA record has its Branch entered as the generic
 * "M.Tech.(Master of Technology)" with no CSE/AI/IT specified, so it could not
 * be attributed to a row below — it's counted in `companyHires` and
 * `summary.totalPlaced` but not in any per-degree row.
 * "One Convergence"/"One convergence" and "Exim Bank"/"INDIA EXIM BANK" were
 * merged as the same company (sheet has inconsistent casing/naming).
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
        placedCount: 15,
        placedPct: 37.5,
        medianLpa: 6,
        lowestLpa: 3.6,
        highestLpa: 11.38,
      },
      {
        degree: "MTech (CSE)",
        students: 27,
        registered: 27,
        placedCount: 8,
        placedPct: 29.63,
        medianLpa: 7.3,
        lowestLpa: 3.63,
        highestLpa: 15.75,
      },
      {
        degree: "MTech (AI)",
        students: 23,
        registered: 23,
        placedCount: 10,
        placedPct: 43.48,
        medianLpa: 7.3,
        lowestLpa: 3.6,
        highestLpa: 18,
      },
      {
        degree: "MTech (IT)",
        students: 10,
        registered: 10,
        placedCount: 3,
        placedPct: 30,
        medianLpa: 7.3,
        lowestLpa: 7,
        highestLpa: 7.3,
      },
      {
        degree: "IMTech",
        students: 27,
        registered: 27,
        placedCount: 17,
        placedPct: 62.97,
        medianLpa: 15.57,
        lowestLpa: 6.5,
        highestLpa: 30,
      },
    ],
    companyHires: [
      { name: "TCS", count: 20, avgLpa: 6.61 },
      { name: "Accenture", count: 10, avgLpa: 6.1 },
      { name: "GE", count: 10, avgLpa: 15.97 },
      { name: "One Convergence", count: 4, avgLpa: 9.75 },
      { name: "Intel", count: 3, avgLpa: 15.8 },
      { name: "CuriousED", count: 2, avgLpa: 6 },
      { name: "NetElixir", count: 2, avgLpa: 7 },
      { name: "Coforge", count: 1, avgLpa: 8 },
      { name: "Members Co", count: 1, avgLpa: 30 },
      { name: "Nano", count: 1, avgLpa: 8 },
      { name: "Sri Prakash", count: 1, avgLpa: 4.8 },
      { name: "Tapasya", count: 1, avgLpa: 6 },
      { name: "Teradata", count: 1, avgLpa: 21.23 },
      { name: "TrueID", count: 1, avgLpa: 7.5 },
      { name: "Zelis", count: 1, avgLpa: 10 },
    ],
    internshipRows: [
      { degree: "MCA", internedCount: 7, medianStipend: 15000, minStipend: 10000, maxStipend: 15000 },
      { degree: "MTech (CSE)", internedCount: 7, medianStipend: 15000, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (AI)", internedCount: 6, medianStipend: 22500, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (IT)", internedCount: 4, medianStipend: 17500, minStipend: 15000, maxStipend: 50000 },
      { degree: "IMTech", internedCount: 25, medianStipend: 45000, minStipend: 10000, maxStipend: 50000 },
    ],
    internshipCompanyHires: [
      { name: "TCS", count: 11, avgStipend: 15000 },
      { name: "GE", count: 10, avgStipend: 45000 },
      { name: "Exim Bank", count: 8, avgStipend: 45000 },
      { name: "Intel", count: 5, avgStipend: 49000 },
      { name: "Nighwan Tech", count: 5, avgStipend: 15000 },
      { name: "One Convergence", count: 5, avgStipend: 14000 },
      { name: "NetElixir", count: 2, avgStipend: 20000 },
      { name: "Signion", count: 2, avgStipend: 25000 },
      { name: "BrichX AI", count: 1, avgStipend: 10000 },
      { name: "Members Co", count: 1, avgStipend: 47000 },
      { name: "Novartis", count: 1, avgStipend: 35000 },
      { name: "Zelis", count: 1, avgStipend: 25000 },
    ],
    summary: {
      totalStudents: 127,
      totalPlaced: 59,
      highestPackage: 30,
      lowestPackage: 3.6,
      topRecruiters: ["TCS", "Accenture", "GE", "One Convergence", "Intel"],
    },
  },
  {
    year: "2024-25",
    batchYear: 2024,
    dataLevel: "summary",
    rows: [
      { degree: "IMTech", placedCount: 20, lowestLpa: 7.5, highestLpa: 38 ,registered: 24,},
      { degree: "MTech (CSE)", placedCount: 14, lowestLpa: 5.4, highestLpa: 46,registered: 17,},
      { degree: "MTech (AI)", placedCount: 8, lowestLpa: 9, highestLpa: 17 ,registered: 15,},
      { degree: "MCA", placedCount: 27, lowestLpa: 4.75, highestLpa: 15,registered: 32, },
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
      { degree: "IMTech", placedCount: 18, lowestLpa: 3.5, highestLpa: 17.89,registered: 20 },
      { degree: "MTech (CSE)", placedCount: 8, lowestLpa: 4.92, highestLpa: 17.89 ,registered: 17},
      { degree: "MTech (AI)", placedCount: 3, lowestLpa: 5.64, highestLpa: 12 ,registered: 10},
      { degree: "MTech (IT)", placedCount: 2, lowestLpa: 12, highestLpa: 15 ,registered: 4},
      { degree: "MCA", placedCount: 24, lowestLpa: 3.5, highestLpa: 12,registered: 36 },
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


/**doubts
one convergence - branch wise (4) - (3- imtech , 1 mca)
exim bank - branch (8)
GE -  (1 - cs) (1 -ai)(8 imetech)


tcs - (digital - 2mca , 2imtech , 3 ai,3 cs, 2it )(ningja - 3mca, 1ai, 2cs) (prime -1mca , 1ai )
nano - 1 imtech
coforge - 1 ai
sri prakash - 1mca

zelis - 1,  cs - 10
intel - 4imtech , 1it (3 - imtech full time)

exim - 1ai , 7 imtech intern 
tcs - 3itech , 2ai, 2it , 4cs
brichx .ai - mca
**/


//this are placement or internships , have to count


/**
 {
    year: "2025-26",
    batchYear: 2025,
    dataLevel: "full",
    rows: [
      {
        degree: "MCA",
        students: 40,
        registered: 40,
        placedCount: 14,
    
        notPlacedCount: 28,
        placedPct: 30,
        higherStudiesPct: 0,
        notPlacedPct: 70,
        medianLpa: 6,
        lowestLpa: 3.6,
        highestLpa: 11.38,
      },
      {
        degree: "MTech (CSE)",
        students: 27,
        registered: 27,
        placedCount: 10,
    
        notPlacedCount: 23,
        placedPct: 14.81,
        higherStudiesPct: 0,
        notPlacedPct: 85.19,
        medianLpa: 6.5,
        lowestLpa: 6.5,
        highestLpa: 15,
      },
      {
        degree: "MTech (AI)",
        students: 23,
        registered: 23,
        placedCount: 8,
    
        notPlacedCount: 20,
        placedPct: 13.04,
        higherStudiesPct: 0,
        notPlacedPct: 86.96,
        medianLpa: 7.5,
        lowestLpa: 6.5,
        highestLpa: 18,
      },
      {
        degree: "MTech (IT)",
        students: 10,
        registered: 10,
        placedCount: 2,
    
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
        placedCount: 8,
    
        notPlacedCount: 25,
        placedPct: 7.41,
        higherStudiesPct: 0,
        notPlacedPct: 92.59,
        medianLpa: 0,
        highestLpa: 16,
      },
    ],
    companyHires: [
      { name: "Accenture", count: 10, avgLpa: 6.1 },
      { name: "TCS", count: 5, avgLpa: 5.94 },
      { name: "CuriousED", count: 2, avgLpa: 6 },
      { name: "Tapasya", count: 1, avgLpa: 6 },
      { name: "One Convergence", count: 4 , avgLpa : 10 },
      { name: "TrueID", count: 1, avgLpa: 7.5 },
      { name: "Teradata", count: 1 , avgLpa : 21.23},
      { name: "Intel", count: 3, avgLpa: 16 },
      { name: "Coforge", count: 1, avgLpa: 8 },
      { name: "Nano", count: 1, avgLpa: 8 },
      { name: "Sri Prakash", count: 1, avgLpa: 4.8 },
    ],
    internshipRows: [
      { degree: "MCA", internedCount: 0, medianDurationMonths: 0, medianStipend: 0 },
      { degree: "MTech (CSE)", internedCount: 5, medianDurationMonths: 10, medianStipend: 15000, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (AI)", internedCount: 6, medianDurationMonths: 10, medianStipend: 22500, minStipend: 15000, maxStipend: 45000 },
      { degree: "MTech (IT)", internedCount: 4, medianDurationMonths: 10, medianStipend: 20000, minStipend: 15000, maxStipend: 50000 },
      { degree: "IMTech", internedCount: 21, medianDurationMonths: 10, medianStipend: 45000, minStipend: 10000, maxStipend: 50000 },
    ],
    internshipCompanyHires: [
      { name: "TCS", count: 11, avgStipend: 15000 },
      { name: "GE", count: 9, avgStipend: 45000 },
      { name: "Intel", count: 2, avgStipend: 49000 },
      { name: "Exim Bank", count: 8, avgStipend: 45000 },
      { name: "Signion", count: 2, avgStipend: 25000 },
      { name: "NetElixir", count: 2, avgStipend: 20000 , avgLpa : 7},
      { name: "One Convergence", count: 4, avgStipend: 10000 },
      { name: "Novartis", count: 1, avgStipend: 35000 },
      { name: "Zelis", count: 1, avgStipend: 25000 , avgLpa : 10},
      { name: "Members Co", count: 1 , avgStipend : 47640, avgLpa : 30},
      { name: "Tech Japan", count: 1 , avgStipend : 47640, avgLpa : 30},
      { name: "BrichX.ai", count: 1, avgStipend: 10000 },

    ],
    summary: {
      totalStudents: 127,
      totalPlaced: 22,
      highestPackage: 11.59,
      topRecruiters: ["Accenture", "TCS", "CuriousED"],
    },
  },
 */
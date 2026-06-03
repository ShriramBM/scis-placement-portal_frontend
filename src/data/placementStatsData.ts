export interface YearRow {
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

export interface CompanyHire {
  name: string;
  count: number;
}

export interface YearData {
  year: string;
  batchYear: number;
  rows: YearRow[];
  companyHires: CompanyHire[];
  summary: {
    totalStudents: number;
    totalPlaced: number;
    highestPackage: number;
    topRecruiters: string[];
  };
}

/** Placement statistics shown on the public stats page (frontend only). */
export const PLACEMENT_STATS_DATA: YearData[] = [
  {
    year: "2025-26",
    batchYear: 2025,
    rows: [
      {
        degree: "MCA",
        students: 40,
        registered: 35,
        placedCount: 18,
        higherStudiesCount: 0,
        notPlacedCount: 17,
        placedPct: 51.43,
        higherStudiesPct: 0,
        notPlacedPct: 48.57,
        medianLpa: 9,
      },
      {
        degree: "MTech (CSE)",
        students: 20,
        registered: 17,
        placedCount: 14,
        higherStudiesCount: 0,
        notPlacedCount: 3,
        placedPct: 82.35,
        higherStudiesPct: 0,
        notPlacedPct: 17.65,
        medianLpa: 12,
      },
      {
        degree: "MTech (AI)",
        students: 20,
        registered: 18,
        placedCount: 1,
        higherStudiesCount: 0,
        notPlacedCount: 17,
        placedPct: 5.56,
        higherStudiesPct: 0,
        notPlacedPct: 94.44,
        medianLpa: 6,
      },
      {
        degree: "IMTech",
        students: 60,
        registered: 50,
        placedCount: 11,
        higherStudiesCount: 0,
        notPlacedCount: 39,
        placedPct: 22.0,
        higherStudiesPct: 0,
        notPlacedPct: 78.0,
        medianLpa: 14.8,
      },
    ],
    companyHires: [
      { name: "TCS", count: 12 },
      { name: "Infosys", count: 8 },
      { name: "Wipro", count: 6 },
      { name: "Amazon", count: 5 },
      { name: "Microsoft", count: 4 },
      { name: "Google", count: 3 },
      { name: "Oracle", count: 2 },
    ],
    summary: {
      totalStudents: 140,
      totalPlaced: 44,
      highestPackage: 14.8,
      topRecruiters: ["TCS", "Infosys", "Wipro"],
    },
  },
];

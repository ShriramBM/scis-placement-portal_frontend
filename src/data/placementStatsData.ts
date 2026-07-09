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

/**
 * 2025–26 placement statistics from src/2025_2026.pdf
 * (batch strength / FT placed / internship counts from PDF summary tables;
 * company-wise hires from registration records; median CTC from full-time LPA offers).
 */
export const PLACEMENT_STATS_DATA: YearData[] = [
  {
    year: "2025-26",
    batchYear: 2025,
    rows: [
      {
        degree: "MCA",
        students: 40,
        registered: 40,
        placedCount: 10,
        higherStudiesCount: 0,
        notPlacedCount: 30,
        placedPct: 25,
        higherStudiesPct: 0,
        notPlacedPct: 75,
        medianLpa: 5.5,
      },
      {
        degree: "MTech (CSE)",
        students: 27,
        registered: 27,
        placedCount: 5,
        higherStudiesCount: 0,
        notPlacedCount: 22,
        placedPct: 18.52,
        higherStudiesPct: 0,
        notPlacedPct: 81.48,
        medianLpa: 6.5,
      },
      {
        degree: "MTech (AI)",
        students: 23,
        registered: 23,
        placedCount: 4,
        higherStudiesCount: 0,
        notPlacedCount: 19,
        placedPct: 17.39,
        higherStudiesPct: 0,
        notPlacedPct: 82.61,
        medianLpa: 6.5,
      },
      {
        degree: "MTech (IT)",
        students: 10,
        registered: 10,
        placedCount: 2,
        higherStudiesCount: 0,
        notPlacedCount: 8,
        placedPct: 20,
        higherStudiesPct: 0,
        notPlacedPct: 80,
        medianLpa: 0,
      },
      {
        degree: "IMTech",
        students: 27,
        registered: 27,
        placedCount: 16,
        higherStudiesCount: 0,
        notPlacedCount: 11,
        placedPct: 59.26,
        higherStudiesPct: 0,
        notPlacedPct: 40.74,
        medianLpa: 6.5,
      },
    ],
    companyHires: [
      { name: "TCS", count: 13 },
      { name: "GE", count: 9 },
      { name: "Accenture", count: 8 },
      { name: "Intel", count: 5 },
      { name: "India Exim Bank", count: 2 },
      { name: "NetElixir", count: 2 },
      { name: "CuriousED", count: 2 },
      { name: "Tapasya", count: 1 },
      { name: "One Convergence", count: 1 },
      { name: "Novartis", count: 1 },
      { name: "Signion", count: 1 },
      { name: "Zelis", count: 1 },
      { name: "Teradata", count: 1 },
      { name: "Members Co", count: 1 },
    ],
    summary: {
      totalStudents: 97,
      totalPlaced: 37,
      highestPackage: 7.3,
      topRecruiters: ["TCS", "GE", "Accenture"],
    },
  },
];

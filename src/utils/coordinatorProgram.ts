export const DEFAULT_STUDENT_PASSWORD = "Student@123";

export function getProgramLabel(
  department?: string | null,
  stream?: string | null
): string {
  if (!department) return "Unknown program";

  if (department === "MCA") return "MCA";
  if (department === "IMTECH") return "IMTech";
  if (department === "MTECH") {
    if (stream === "CSE") return "MTech CS";
    if (stream === "AI") return "MTech AI";
    if (stream === "IT") return "MTech IT";
    return "MTech";
  }

  return department;
}

export function getStoredProgramLabel(): string {
  return getProgramLabel(
    localStorage.getItem("coordinatorDepartment"),
    localStorage.getItem("coordinatorStream")
  );
}

export function getStoredCoordinatorDepartment(): string {
  return localStorage.getItem("coordinatorDepartment") || "";
}

export function getStoredCoordinatorStream(): string {
  return localStorage.getItem("coordinatorStream") || "";
}

export function getDepartmentLabel(department: string): string {
  if (department === "MCA") return "MCA";
  if (department === "IMTECH") return "IMTech";
  if (department === "MTECH") return "MTech";
  return department;
}

export function getStreamLabel(stream: string): string {
  if (stream === "CSE") return "CS";
  if (stream === "AI") return "AI";
  if (stream === "IT") return "IT";
  return stream;
}

export function storeCoordinatorScope(
  department?: string | null,
  stream?: string | null
) {
  if (department) {
    localStorage.setItem("coordinatorDepartment", department);
  } else {
    localStorage.removeItem("coordinatorDepartment");
  }

  if (stream) {
    localStorage.setItem("coordinatorStream", stream);
  } else {
    localStorage.removeItem("coordinatorStream");
  }
}

export function clearCoordinatorScope() {
  localStorage.removeItem("coordinatorDepartment");
  localStorage.removeItem("coordinatorStream");
}

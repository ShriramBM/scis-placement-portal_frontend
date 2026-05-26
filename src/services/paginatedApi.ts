import api from "./api";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function isPaginatedResponse<T>(
  payload: T[] | PaginatedResponse<T>
): payload is PaginatedResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    "pagination" in payload &&
    Array.isArray((payload as PaginatedResponse<T>).data)
  );
}

export async function fetchPaginated<T>(
  url: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<T>> {
  const res = await api.get(url, { params: { page, limit } });
  if (isPaginatedResponse<T>(res.data)) {
    return res.data;
  }
  const data = res.data as T[];
  return {
    data,
    pagination: {
      page: 1,
      limit: data.length,
      total: data.length,
      totalPages: 1,
    },
  };
}

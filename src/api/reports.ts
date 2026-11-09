import { apiFetch } from './client'

export type StockRow = {
  productId: string
  productName: string
  sku: string
  baseUnitCode: string
  baseUnitDecimals: number
  onHandMilli: number
  valueCents: number
}

export type StockReport = {
  rows: StockRow[]
}

export async function listReports(): Promise<string[]> {
  const data = await apiFetch<{ reports: string[] }>('/reports')
  return data.reports
}

export async function getReport(
  name: string,
  query?: Record<string, string | number | undefined | null>
): Promise<unknown> {
  return apiFetch(`/reports/${name}`, { query })
}

export async function getStock(): Promise<StockRow[]> {
  const data = await apiFetch<StockReport>('/reports/stock')
  return data.rows ?? []
}

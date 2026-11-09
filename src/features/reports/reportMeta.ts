export type ReportGroup =
  | 'Sales'
  | 'Inventory'
  | 'Profit'
  | 'Purchasing'
  | 'Customers'
  | 'Finance'

export type ReportMeta = {
  name: string
  title: string
  group: ReportGroup
  /** Needs from/to date range query params */
  needsDates: boolean
  /** sales-today rejects any query params */
  noParams?: boolean
}

export const REPORT_META: readonly ReportMeta[] = [
  { name: 'sales-today', title: 'Sales today', group: 'Sales', needsDates: false, noParams: true },
  { name: 'sales-daily', title: 'Daily sales', group: 'Sales', needsDates: true },
  { name: 'sales-monthly', title: 'Monthly sales', group: 'Sales', needsDates: true },
  { name: 'invoices', title: 'Invoices', group: 'Sales', needsDates: true },
  { name: 'cashiers', title: 'Sales by cashier', group: 'Sales', needsDates: true },
  { name: 'payment-methods', title: 'Payment methods', group: 'Sales', needsDates: true },
  { name: 'product-sales', title: 'Sales by product', group: 'Sales', needsDates: true },
  { name: 'category-sales', title: 'Sales by category', group: 'Sales', needsDates: true },
  { name: 'brand-sales', title: 'Sales by brand', group: 'Sales', needsDates: true },
  { name: 'sales-by-type', title: 'Sales by type', group: 'Sales', needsDates: true },
  { name: 'sales-by-option', title: 'Sales by option', group: 'Sales', needsDates: true },
  { name: 'profit-by-product', title: 'Profit by product', group: 'Profit', needsDates: true },
  { name: 'profit-by-category', title: 'Profit by category', group: 'Profit', needsDates: true },
  { name: 'profit-by-brand', title: 'Profit by brand', group: 'Profit', needsDates: true },
  { name: 'profit-by-invoice', title: 'Profit by invoice', group: 'Profit', needsDates: true },
  { name: 'stock', title: 'Stock on hand', group: 'Inventory', needsDates: false },
  { name: 'low-stock', title: 'Low stock', group: 'Inventory', needsDates: false },
  { name: 'expiry', title: 'Expiry alert', group: 'Inventory', needsDates: false },
  { name: 'stock-movement', title: 'Stock movement', group: 'Inventory', needsDates: true },
  { name: 'purchases', title: 'Purchases', group: 'Purchasing', needsDates: true },
  { name: 'suppliers', title: 'Suppliers', group: 'Purchasing', needsDates: true },
  { name: 'supplier-statement', title: 'Supplier statement', group: 'Purchasing', needsDates: true },
  { name: 'customer-credit', title: 'Customer credit', group: 'Customers', needsDates: true },
  { name: 'customer-statement', title: 'Customer statement', group: 'Customers', needsDates: true },
  { name: 'expenses', title: 'Expenses', group: 'Finance', needsDates: true },
  { name: 'audit', title: 'Audit log', group: 'Finance', needsDates: true },
  { name: 'price-history', title: 'Price history', group: 'Finance', needsDates: true },
]

export const GROUP_ORDER: readonly ReportGroup[] = [
  'Sales',
  'Inventory',
  'Profit',
  'Purchasing',
  'Customers',
  'Finance',
]

export function metaFor(name: string): ReportMeta {
  return (
    REPORT_META.find((r) => r.name === name) ?? {
      name,
      title: name,
      group: 'Finance',
      needsDates: true,
    }
  )
}

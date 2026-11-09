import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

/** Endpoints are injected per feature, in each feature folder (catalogApi, ordersApi, reportsApi). */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Orders'],
  endpoints: () => ({}),
})

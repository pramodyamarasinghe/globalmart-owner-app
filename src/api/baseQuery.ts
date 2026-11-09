import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { logout, type AuthState } from '@/src/features/auth/authSlice'
import { ApiError, request, type HttpRequest } from './http'
import { MESSAGES } from './messages'

/** What a failed call looks like in the store: plain data, safe to keep in Redux. */
export type ApiQueryError = { status: number; message: string }

export const baseQuery: BaseQueryFn<HttpRequest<any>, unknown, ApiQueryError> = async (
  req,
  api
) => {
  const { baseUrl, user, password } = (api.getState() as { auth: AuthState }).auth
  try {
    return { data: await request({ baseUrl, user, password }, req, api.signal) }
  } catch (e) {
    const err = e instanceof ApiError ? e : new ApiError(MESSAGES.generic, 0)
    // The server refused the saved login: drop it so the user is sent back to the login screen.
    if (err.status === 401) void api.dispatch(logout())
    return { error: { status: err.status, message: err.message } }
  }
}

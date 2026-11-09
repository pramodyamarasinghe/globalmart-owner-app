import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { baseApi } from '@/src/api/baseApi'
import { authReducer, logout } from '@/src/features/auth/authSlice'
import { periodReducer } from '@/src/features/reports/periodSlice'
import { cartReducer } from '@/src/features/sell/cartSlice'
import { themeReducer } from '@/src/features/theme/themeSlice'

// Logging out must also drop every cached server response (stock, orders, reports).
const listener = createListenerMiddleware()
listener.startListening({
  actionCreator: logout.fulfilled,
  effect: (_action, api) => {
    api.dispatch(baseApi.util.resetApiState())
  },
})

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    theme: themeReducer,
    cart: cartReducer,
    period: periodReducer,
  },
  middleware: (getDefault) => getDefault().prepend(listener.middleware).concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

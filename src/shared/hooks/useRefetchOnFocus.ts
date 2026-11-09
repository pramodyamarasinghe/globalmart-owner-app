import { useCallback, useEffect, useRef } from 'react'
import { useFocusEffect } from 'expo-router'

/** Refetches when a screen regains focus (tabs stay mounted); the first focus is the initial load, so it is skipped. */
export function useRefetchOnFocus(refetch: () => unknown): void {
  // A ref keeps the focus callback stable, so callers can pass an inline function without causing a refetch loop.
  const latest = useRef(refetch)
  useEffect(() => {
    latest.current = refetch
  })
  const first = useRef(true)
  useFocusEffect(
    useCallback(() => {
      if (first.current) first.current = false
      else void latest.current()
    }, [])
  )
}

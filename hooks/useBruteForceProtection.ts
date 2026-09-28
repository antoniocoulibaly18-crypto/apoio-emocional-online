"use client"

import { useState, useCallback } from "react"

interface BruteForceState {
  attempts: number
  lockedUntil: number | null
  isLocked: boolean
}

const STORAGE_KEY = "brute_force_protection"
const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 30 * 60 * 1000 // 30 minutos

export function useBruteForceProtection() {
  const [state, setState] = useState<BruteForceState>(() => {
    if (typeof window === "undefined") {
      return {
        attempts: 0,
        lockedUntil: null,
        isLocked: false,
      }
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const lockedUntil = parsed.lockedUntil
        const isLocked = lockedUntil && lockedUntil > Date.now()

        return {
          attempts: parsed.attempts || 0,
          lockedUntil: isLocked ? lockedUntil : null,
          isLocked: isLocked || false,
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    return {
      attempts: 0,
      lockedUntil: null,
      isLocked: false,
    }
  })

  const recordFailedAttempt = useCallback(() => {
    setState((prev) => {
      // Se já está bloqueado, não fazer nada
      if (prev.isLocked && prev.lockedUntil && prev.lockedUntil > Date.now()) {
        return prev
      }

      const newAttempts = prev.attempts + 1
      let newLockedUntil = prev.lockedUntil

      // Se atingiu o limite de tentativas
      if (newAttempts >= MAX_ATTEMPTS) {
        newLockedUntil = Date.now() + LOCK_DURATION_MS
      }

      const newState: BruteForceState = {
        attempts: newAttempts,
        lockedUntil: newLockedUntil,
        isLocked: newLockedUntil ? newLockedUntil > Date.now() : false,
      }

      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))

      return newState
    })
  }, [])

  const resetAttempts = useCallback(() => {
    const newState: BruteForceState = {
      attempts: 0,
      lockedUntil: null,
      isLocked: false,
    }

    setState(newState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getRemainingAttempts = useCallback(() => {
    return Math.max(0, MAX_ATTEMPTS - state.attempts)
  }, [state.attempts])

  const getRemainingLockTime = useCallback(() => {
    if (!state.lockedUntil) return 0

    const remaining = state.lockedUntil - Date.now()
    return remaining > 0 ? remaining : 0
  }, [state.lockedUntil])

  const getLockedMessage = useCallback(() => {
    if (!state.isLocked) return null

    const remainingMs = getRemainingLockTime()
    const minutes = Math.ceil(remainingMs / 60000)

    return `Muitas tentativas falhadas. Tente novamente em ${minutes} minuto${minutes > 1 ? "s" : ""}.`
  }, [state.isLocked, getRemainingLockTime])

  return {
    isLocked: state.isLocked,
    attempts: state.attempts,
    remainingAttempts: getRemainingAttempts(),
    recordFailedAttempt,
    resetAttempts,
    getRemainingLockTime,
    getLockedMessage,
  }
}

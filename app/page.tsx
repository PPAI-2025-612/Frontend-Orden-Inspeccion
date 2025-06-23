"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "../contexts/auth-context"
import LoginScreen from "../components/login-screen"
import Dashboard from "../components/dashboard"
import Header from "../components/header"
import CierreOrdenInspeccion from "../cierre-orden-inspeccion"

type Screen = "dashboard" | "cierre-orden"

function AppContent() {
  const { isAuthenticated } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  const handleNavigateToCierre = () => {
    setCurrentScreen("cierre-orden")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBackToDashboard={currentScreen === "cierre-orden" ? handleBackToDashboard : undefined} />

      {currentScreen === "dashboard" && <Dashboard onNavigateToCierre={handleNavigateToCierre} />}

      {currentScreen === "cierre-orden" && (
        <div className="container mx-auto p-6 max-w-4xl">
          <CierreOrdenInspeccion onCancel={handleBackToDashboard} />
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
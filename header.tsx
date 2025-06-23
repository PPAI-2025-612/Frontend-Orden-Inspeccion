"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, ArrowLeft, Home } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

interface HeaderProps {
  onBackToDashboard?: () => void
}

export default function Header({ onBackToDashboard }: HeaderProps) {
  const { usuario, logout } = useAuth()

  if (!usuario) return null

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "Jefe de Inspección":
        return "bg-red-100 text-red-800"
      case "Supervisor de Inspección":
        return "bg-blue-100 text-blue-800"
      case "Responsable de Inspección":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToDashboard && (
              <Button variant="ghost" size="sm" onClick={onBackToDashboard} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            )}

            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Inspección</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(usuario.nombre)}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{usuario.nombre}</p>
                <Badge className={`${getRolColor(usuario.rol)} text-xs`}>{usuario.rol}</Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
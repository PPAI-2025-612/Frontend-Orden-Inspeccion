"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, LogIn } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
}

const usuariosDisponibles: Usuario[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@empresa.com",
    rol: "Responsable de Inspección",
  },
  {
    id: "2",
    nombre: "María García",
    email: "maria.garcia@empresa.com",
    rol: "Responsable de Inspección",
  },
  {
    id: "3",
    nombre: "Carlos López",
    email: "carlos.lopez@empresa.com",
    rol: "Supervisor de Inspección",
  },
  {
    id: "4",
    nombre: "Ana Rodríguez",
    email: "ana.rodriguez@empresa.com",
    rol: "Responsable de Inspección",
  },
  {
    id: "5",
    nombre: "Luis Martínez",
    email: "luis.martinez@empresa.com",
    rol: "Jefe de Inspección",
  },
]

export default function LoginScreen() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()

  const handleSeleccionUsuario = (usuarioId: string) => {
    const usuario = usuariosDisponibles.find((u) => u.id === usuarioId)
    setUsuarioSeleccionado(usuario || null)
  }

  const handleLogin = async () => {
    if (!usuarioSeleccionado) return

    setCargando(true)

    // Simular validación/autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    login(usuarioSeleccionado)
    setCargando(false)
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Sistema de Inspección</CardTitle>
            <CardDescription>Seleccione su usuario para continuar</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Usuario */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario</label>
            <Select onValueChange={handleSeleccionUsuario}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione su usuario..." />
              </SelectTrigger>
              <SelectContent>
                {usuariosDisponibles.map((usuario) => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    <div className="flex items-center gap-3 py-1">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{getInitials(usuario.nombre)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{usuario.nombre}</span>
                        <span className="text-xs text-muted-foreground">{usuario.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Detalles del Usuario Seleccionado */}
          {usuarioSeleccionado && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{getInitials(usuarioSeleccionado.nombre)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{usuarioSeleccionado.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{usuarioSeleccionado.email}</p>
                </div>
              </div>
              <Badge className={getRolColor(usuarioSeleccionado.rol)}>{usuarioSeleccionado.rol}</Badge>
            </div>
          )}

          {/* Botón de Login */}
          <Button onClick={handleLogin} disabled={!usuarioSeleccionado || cargando} className="w-full" size="lg">
            {cargando ? (
              "Iniciando sesión..."
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>

          {/* Información adicional */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Sistema de Cierre de Órdenes de Inspección</p>
            <p>Versión 1.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

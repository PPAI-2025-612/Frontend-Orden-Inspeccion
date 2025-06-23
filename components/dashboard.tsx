"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ClipboardCheck, BarChart3, Settings } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

interface DashboardProps {
  onNavigateToCierre: () => void
}

export default function Dashboard({ onNavigateToCierre }: DashboardProps) {
  const { usuario } = useAuth()

  const estadisticasSimuladas = {
    ordenesCompletadas: 12,
    ordenesPendientes: 5,
    ordenesCerradas: 8,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-8">
          {/* Bienvenida */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Bienvenido, {usuario?.nombre}</h1>
            <p className="text-xl text-muted-foreground">Sistema de Gestión de Órdenes de Inspección</p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              {usuario?.rol}
            </Badge>
          </div>

          {/* Acción Principal */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Gestión de Órdenes</CardTitle>
                <CardDescription>
                  Procese las órdenes de inspección completadas y realice el cierre correspondiente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={onNavigateToCierre} size="lg" className="w-full h-14 text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Cerrar Orden de Inspección
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Tiene órdenes listas para cierre</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="cursor-not-allowed opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5" />
                  Reportes
                </CardTitle>
                <CardDescription>Ver estadísticas y reportes de inspecciones</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled className="w-full">
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-not-allowed opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Configuración
                </CardTitle>
                <CardDescription>Ajustar preferencias del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" disabled className="w-full">
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información del Usuario */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              Sesión iniciada como: <strong>{usuario?.nombre}</strong>
            </p>
            <p>Email: {usuario?.email}</p>
            <p>
              Última conexión:{" "}
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, FileText, Calendar, User } from "lucide-react"
import { useAuth } from "./contexts/auth-context"

// Formatos de los datos
interface OrdenInspeccion {
  id: string
  numero: string
  cliente: string
  identificadorSismografo: string
  fechaCreacion: string
  fechaFinalizacion: string
  responsable: string
  estado: string
  tareasCompletadas: number
  totalTareas: number
}

interface MotivoTipo {
  id: string
  nombre: string
  descripcion: string
}

interface MotivoSeleccionado {
  id: string
  comentario: string
}

interface CierreOrdenInspeccionProps {
  onCancel?: () => void
}

export default function CierreOrdenInspeccion({ onCancel }: CierreOrdenInspeccionProps) {
  const { usuario } = useAuth()

  const [ordenes, setOrdenes] = useState<OrdenInspeccion[]>([])
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenInspeccion | null>(null)
  const [observacionCierre, setObservacionCierre] = useState("")
  const [motivosTipo, setMotivosTipo] = useState<MotivoTipo[]>([])
  const [motivosSeleccionados, setMotivosSeleccionados] = useState<MotivoSeleccionado[]>([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)

  // Datos que vienen del back
  useEffect(() => {
    setCargando(true)
    Promise.all([fetch("/api/ordenes").then((r) => r.json()), fetch("/api/motivos").then((r) => r.json())])
      .then(([ordenesData, motivosData]) => {
        setOrdenes(ordenesData)
        setMotivosTipo(motivosData)
      })
      .catch((e) => setMensaje({ tipo: "error", texto: "Error cargando datos" }))
      .finally(() => setCargando(false))
  }, [])

  const handleSeleccionOrden = (ordenId: string) => {
    const orden = ordenes.find((o) => o.id === ordenId) || null
    setOrdenSeleccionada(orden)
    setObservacionCierre("")
    setMotivosSeleccionados([])
    setMensaje(null)
  }

  const handleMotivoChange = (motivoId: string, checked: boolean) => {
    if (checked) {
      setMotivosSeleccionados((prev) => [...prev, { id: motivoId, comentario: "" }])
    } else {
      setMotivosSeleccionados((prev) => prev.filter((m) => m.id !== motivoId))
    }
  }

  const handleComentarioChange = (motivoId: string, comentario: string) => {
    setMotivosSeleccionados((prev) =>
      prev.map((m) => (m.id === motivoId ? { ...m, comentario } : m)),
    )
  }

  const validarFormulario = (): string | null => {
    if (!observacionCierre.trim()) return "La observación de cierre es obligatoria"
    if (motivosSeleccionados.length === 0) return "Debe seleccionar al menos un motivo"
    const motivosSinComentario = motivosSeleccionados.filter((m) => !m.comentario.trim())
    if (motivosSinComentario.length > 0) return "Todos los motivos seleccionados deben tener un comentario"
    return null
  }

  const handleConfirmarCierre = async () => {
    const error = validarFormulario()
    if (error) {
      setMensaje({ tipo: "error", texto: error })
      return
    }

    setMensaje(null)
    setCargando(true)

    try {
      //Llamada al back
      console.log("URL final:", window.location.origin + "/api/cerrar-orden");
      const res = await fetch("http://localhost:8080/api/cerrar-orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ordenId: ordenSeleccionada?.id,
          responsableId: usuario?.id,
          responsableNombre: usuario?.nombre,
          observacionCierre,
          motivosSeleccionados,
          fechaCierre: new Date().toISOString(),
        }),
      });


      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      const mensajeOk = await res.text()
      setOrdenes((prev) => prev.filter((o) => o.id !== ordenSeleccionada?.id))
      setMensaje({ tipo: "success", texto: mensajeOk })

      setTimeout(() => {
        setOrdenSeleccionada(null)
        setObservacionCierre("")
        setMotivosSeleccionados([])
        setMensaje(null)
      }, 15000)
    } catch (error) {
      setMensaje({ tipo: "error", texto: (error as Error).message })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Cierre de Orden de Inspección</h1>
        <p className="text-muted-foreground">Seleccione una orden completada y registre la información de cierre</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Seleccionar Orden de Inspección
          </CardTitle>
          <CardDescription>Órdenes con todas las tareas completadas listas para cierre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={handleSeleccionOrden} value={ordenSeleccionada?.id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una orden de inspección..." />
              </SelectTrigger>
              <SelectContent>
                {ordenes.map((orden) => (
                  <SelectItem key={orden.id} value={orden.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{orden.numero}</span>
                      <span className="text-sm text-muted-foreground ml-2">{orden.cliente}</span>
                      <span className="text-sm text-muted-foreground ml-2">{orden.identificadorSismografo}</span>
                      <span className="text-xs text-muted-foreground ml-2">{orden.fechaFinalizacion}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Detalles de la orden seleccionada */}
            {ordenSeleccionada && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      <strong>Responsable:</strong> {ordenSeleccionada.responsable}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      <strong>Fecha de finalización:</strong> {ordenSeleccionada.fechaFinalizacion}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{ordenSeleccionada.estado}</Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Cierre */}
      {ordenSeleccionada && (
        <Card>
          <CardHeader>
            <CardTitle>Información de Cierre</CardTitle>
            <CardDescription>Complete la información requerida para cerrar la orden</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Observación de Cierre */}
            <div className="space-y-2">
              <Label htmlFor="observacion">
                Observación de Cierre <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="observacion"
                placeholder="Ingrese las observaciones generales del cierre de la orden..."
                value={observacionCierre}
                onChange={(e) => setObservacionCierre(e.target.value)}
                rows={4}
              />
            </div>

            <Separator />

            {/* Motivos Tipo */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Motivos de Cierre <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Seleccione los motivos aplicables y agregue comentarios específicos
              </p>

              <div className="space-y-4">
                {motivosTipo.map((motivo) => {
                  const isSelected = motivosSeleccionados.some((m) => m.id === motivo.id)
                  const comentario = motivosSeleccionados.find((m) => m.id === motivo.id)?.comentario || ""

                  return (
                    <div key={motivo.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`motivo-${motivo.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleMotivoChange(motivo.id, checked as boolean)}
                        />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`motivo-${motivo.id}`} className="font-medium cursor-pointer">
                            {motivo.nombre}
                          </Label>
                          <p className="text-sm text-muted-foreground">{motivo.descripcion}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor={`comentario-${motivo.id}`} className="text-sm">
                            Comentario específico <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`comentario-${motivo.id}`}
                            placeholder="Ingrese un comentario específico para este motivo..."
                            value={comentario}
                            onChange={(e) => handleComentarioChange(motivo.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Mensajes */}
            {mensaje && (
              <Alert variant={mensaje.tipo === "error" ? "destructive" : "default"}>
                {mensaje.tipo === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>{mensaje.texto}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} size="lg" className="min-w-[150px]" disabled={cargando}>
                  Cancelar Cierre
                </Button>
              )}
              <Button onClick={handleConfirmarCierre} disabled={cargando} size="lg" className="min-w-[200px]">
                {cargando ? "Procesando..." : "Confirmar Cierre"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

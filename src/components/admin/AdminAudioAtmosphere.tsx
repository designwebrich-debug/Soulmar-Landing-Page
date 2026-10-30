"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  Music, 
  UploadCloud, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  FileAudio, 
  Info, 
  Radio, 
  ExternalLink 
} from "lucide-react"

interface AudioAtmosphereSettings {
  isEnabled: boolean
  status: "draft" | "published" | "empty"
  title: string
  fileName: string
  size: string
  duration: string
  audioUrl: string | null
  storagePath: string | null
  updatedAt: string
}

interface AdminAudioAtmosphereProps {
  media: Record<string, string>
  onSyncMedia: () => Promise<void>
}

export function AdminAudioAtmosphere({ media, onSyncMedia }: AdminAudioAtmosphereProps) {
  // Estados de configuración
  const [settings, setSettings] = useState<AudioAtmosphereSettings>({
    isEnabled: true,
    status: "empty",
    title: "Soulmar Atmosphere — Un momento para volver a ti",
    fileName: "",
    size: "",
    duration: "",
    audioUrl: null,
    storagePath: null,
    updatedAt: ""
  })

  // Estados de carga de nuevo archivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDuration, setFileDuration] = useState<string>("")
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Estados de reproducción preview
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  // Estados de UI y llamadas API
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Cargar configuración existente desde `media["audio_atmosphere_meta"]` o `media["audio_atmosphere"]`
  useEffect(() => {
    const rawMeta = media["audio_atmosphere_meta"]
    const rawAudio = media["audio_atmosphere"]

    if (rawMeta && rawMeta !== "__EMPTY__") {
      try {
        const parsed = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta
        setSettings({
          isEnabled: parsed.isEnabled ?? true,
          status: parsed.status ?? (rawAudio && rawAudio !== "__EMPTY__" ? "published" : "empty"),
          title: parsed.title || "Soulmar Atmosphere — Un momento para volver a ti",
          fileName: parsed.fileName || "",
          size: parsed.size || "",
          duration: parsed.duration || "",
          audioUrl: parsed.audioUrl || (rawAudio !== "__EMPTY__" ? rawAudio : null),
          storagePath: parsed.storagePath || null,
          updatedAt: parsed.updatedAt || ""
        })
        return
      } catch (e) {
        console.warn("Error parsing audio_atmosphere_meta:", e)
      }
    }

    if (rawAudio && rawAudio !== "__EMPTY__") {
      setSettings(prev => ({
        ...prev,
        status: "published",
        audioUrl: rawAudio,
        isEnabled: true
      }))
    }
  }, [media])

  // Limpiar URL de blob temporal al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Formatear segundos a mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  // Manejar selección de archivo
  const handleFile = (file: File) => {
    setErrorMsg(null)
    setSuccessMsg(null)

    // Validación estricta de MP3
    const isMp3 = file.name.toLowerCase().endsWith(".mp3") || file.type === "audio/mpeg" || file.type === "audio/mp3"
    if (!isMp3) {
      setErrorMsg("Formato inválido. Por favor selecciona exclusivamente un archivo .MP3.")
      return
    }

    // Validación de tamaño (Máx 50MB)
    const maxSizeBytes = 50 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setErrorMsg("El archivo supera el límite de 50MB. Comprime el audio a 192kbps o 256kbps.")
      return
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + " MB"
    setFileSizeFormatted(sizeFormatted)
    setSelectedFile(file)

    // Crear URL blob para preview y cálculo de duración exacta
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    const tempAudio = new Audio(objectUrl)
    tempAudio.onloadedmetadata = () => {
      const dur = formatTime(tempAudio.duration)
      setFileDuration(dur)
      setDuration(tempAudio.duration)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Controles del reproductor preview
  const togglePlay = () => {
    if (!audioPreviewRef.current) return
    if (isPlaying) {
      audioPreviewRef.current.pause()
      setIsPlaying(false)
    } else {
      audioPreviewRef.current.play().then(() => setIsPlaying(true)).catch(e => {
        console.error("Preview play error:", e)
      })
    }
  }

  const handleTimeUpdate = () => {
    if (audioPreviewRef.current) {
      setCurrentTime(audioPreviewRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value)
    if (audioPreviewRef.current) {
      audioPreviewRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioPreviewRef.current) {
      audioPreviewRef.current.volume = val
      audioPreviewRef.current.muted = val === 0
      setIsMuted(val === 0)
    }
  }

  const toggleMute = () => {
    if (!audioPreviewRef.current) return
    if (isMuted) {
      audioPreviewRef.current.muted = false
      audioPreviewRef.current.volume = volume || 0.8
      setIsMuted(false)
    } else {
      audioPreviewRef.current.muted = true
      setIsMuted(true)
    }
  }

  const handleRestart = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.currentTime = 0
      setCurrentTime(0)
      if (!isPlaying) {
        audioPreviewRef.current.play().then(() => setIsPlaying(true))
      }
    }
  }

  // Subir archivo a Supabase Storage con URL firmada (soporta hasta 50MB sin límites de Vercel)
  const uploadMp3File = async (file: File): Promise<{ publicUrl: string; storagePath: string }> => {
    setUploadProgress(15)
    // 1. Obtener URL firmada
    const signRes = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get-upload-url",
        slotKey: "audio_atmosphere",
        fileName: file.name,
        fileType: "audio/mpeg",
        fileSize: file.size
      })
    })

    if (!signRes.ok) {
      const err = await signRes.json().catch(() => ({}))
      throw new Error(err.error || "No se pudo generar el enlace de subida segura.")
    }

    const { signedUrl, storagePath, publicUrl } = await signRes.json()
    setUploadProgress(50)

    // 2. Subir directamente el buffer binario a Supabase Storage
    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "audio/mpeg"
      },
      body: file
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "")
      throw new Error("Error transfiriendo el archivo de audio: " + errText)
    }

    setUploadProgress(85)
    return { publicUrl, storagePath }
  }

  // Guardar como Borrador (No publica en la web)
  const handleSaveDraft = async () => {
    setIsUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      let finalUrl = settings.audioUrl
      let finalPath = settings.storagePath

      if (selectedFile) {
        const result = await uploadMp3File(selectedFile)
        finalUrl = result.publicUrl
        finalPath = result.storagePath
      }

      if (!finalUrl) {
        throw new Error("No hay ningún audio para guardar. Selecciona un archivo MP3.")
      }

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-audio-settings",
          isEnabled: settings.isEnabled,
          status: "draft",
          title: settings.title,
          fileName: selectedFile ? selectedFile.name : settings.fileName,
          size: selectedFile ? fileSizeFormatted : settings.size,
          duration: selectedFile ? fileDuration : settings.duration,
          audioUrl: finalUrl,
          storagePath: finalPath
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al guardar borrador")
      }

      const data = await res.json()
      setSettings(data.settings)
      setSelectedFile(null)
      setUploadProgress(100)
      setSuccessMsg("¡Borrador guardado con éxito! No está publicado en la web pública aún.")
      await onSyncMedia()
    } catch (e: any) {
      setErrorMsg(e.message || "Error al guardar")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Guardar y Refrescar (Publica en vivo en www.soulmar.org)
  const handleSaveAndPublish = async () => {
    setIsUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      let finalUrl = settings.audioUrl
      let finalPath = settings.storagePath

      if (selectedFile) {
        const result = await uploadMp3File(selectedFile)
        finalUrl = result.publicUrl
        finalPath = result.storagePath
      }

      if (!finalUrl) {
        throw new Error("Selecciona un archivo MP3 antes de publicar.")
      }

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-audio-settings",
          isEnabled: settings.isEnabled,
          status: "published",
          title: settings.title,
          fileName: selectedFile ? selectedFile.name : settings.fileName,
          size: selectedFile ? fileSizeFormatted : settings.size,
          duration: selectedFile ? fileDuration : settings.duration,
          audioUrl: finalUrl,
          storagePath: finalPath
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al publicar")
      }

      const data = await res.json()
      setSettings(data.settings)
      setSelectedFile(null)
      setUploadProgress(100)
      setSuccessMsg("¡Audio publicado y sincronizado en vivo en www.soulmar.org!")
      await onSyncMedia()
    } catch (e: any) {
      setErrorMsg(e.message || "Error al publicar")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Cambiar toggle de activación pública en vivo
  const handleToggleEnabled = async () => {
    const nextState = !settings.isEnabled
    setSettings(prev => ({ ...prev, isEnabled: nextState }))

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-audio-settings",
          ...settings,
          isEnabled: nextState
        })
      })

      if (res.ok) {
        await onSyncMedia()
        setSuccessMsg(nextState ? "Música ambiental activada en la web pública." : "Música ambiental desactivada en la web pública.")
        setTimeout(() => setSuccessMsg(null), 3500)
      }
    } catch (e) {
      console.warn("Error toggling audio state:", e)
    }
  }

  // Eliminar audio con confirmación
  const handleDeleteAudio = async () => {
    setIsUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    setShowDeleteModal(false)

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-audio-settings",
          isEnabled: false,
          status: "empty",
          title: "Soulmar Atmosphere — Un momento para volver a ti",
          fileName: "",
          size: "",
          duration: "",
          audioUrl: null,
          storagePath: null
        })
      })

      if (!res.ok) {
        throw new Error("No se pudo eliminar el archivo")
      }

      setSettings({
        isEnabled: false,
        status: "empty",
        title: "Soulmar Atmosphere — Un momento para volver a ti",
        fileName: "",
        size: "",
        duration: "",
        audioUrl: null,
        storagePath: null,
        updatedAt: new Date().toISOString()
      })
      setSelectedFile(null)
      setPreviewUrl(null)
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause()
      }
      setIsPlaying(false)
      setSuccessMsg("Audio eliminado. El botón flotante ya no se mostrará en la web.")
      await onSyncMedia()
    } catch (e: any) {
      setErrorMsg(e.message || "Error al eliminar")
    } finally {
      setIsUploading(false)
    }
  }

  // URL activa de reproducción de preview (archivo nuevo o ya existente en servidor)
  const activeAudioSrc = previewUrl || settings.audioUrl

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Elemento de Audio Oculto para la vista previa */}
      {activeAudioSrc && (
        <audio
          ref={audioPreviewRef}
          src={activeAudioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioPreviewRef.current) {
              setDuration(audioPreviewRef.current.duration)
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Cabecera Principal de Sección AUDIO */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold tracking-wide">
              <Music className="w-3 h-3 text-[#8da9c4]" />
              <span>Soulmar Atmosphere • Identidad Sonora</span>
              <span className="w-1 h-1 rounded-full bg-blue-300" />
              <span className="font-mono text-blue-700">Audio MP3</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-black tracking-tight font-sans">
              Música Ambiental & Botón Liquid Glass
            </h3>
            <p className="text-xs text-neutral-500 max-w-2xl">
              Controla el audio de fondo y la experiencia inmersiva para los pacientes que visitan <strong>www.soulmar.org</strong>.
            </p>
          </div>

          {/* Badge de Estado Actual */}
          <div className="flex items-center gap-3 shrink-0">
            {settings.status === "published" && settings.isEnabled && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Publicado en vivo
              </span>
            )}
            {settings.status === "published" && !settings.isEnabled && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Pausado en la web
              </span>
            )}
            {settings.status === "draft" && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300/80 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Borrador (No publicado)
              </span>
            )}
            {settings.status === "empty" && !selectedFile && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                Sin audio activo
              </span>
            )}

            <a
              href="https://www.soulmar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>Ver en vivo</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>
        </div>

        {/* Master Switch: Activar/Desactivar en la web pública */}
        <div className="pt-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/70 p-4 rounded-2xl">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Radio className={`w-4 h-4 ${settings.isEnabled ? "text-emerald-500" : "text-neutral-400"}`} />
              Activar música ambiental en la web pública
            </span>
            <p className="text-xs text-neutral-500">
              Si está activo, los visitantes verán el botón Liquid Glass en la esquina inferior izquierda para reproducir la música voluntariamente.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.isEnabled}
              onChange={handleToggleEnabled}
              className="sr-only peer"
            />
            <div className="w-13 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#8da9c4]" />
          </label>
        </div>
      </div>

      {/* Alertas de Éxito o Error */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200/90 text-red-700 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Central: Subida y Reproductor de Vista Previa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Zona de Carga / Drag & Drop */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#8da9c4]" />
              Cargar Archivo MP3
            </h4>

            {/* Input Oculto */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".mp3,audio/mpeg,audio/mp3"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0])
                }
              }}
              className="hidden"
            />

            {/* Zona Drag & Drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#8da9c4] bg-blue-50/50 scale-[1.01]"
                  : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#8da9c4]/10 text-[#8da9c4] flex items-center justify-center mb-3">
                <FileAudio className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-neutral-900 mb-1">
                Haz clic para examinar o arrastra un MP3 aquí
              </span>
              <p className="text-xs text-neutral-500 max-w-xs mb-3">
                Archivos .mp3 en calidad de estudio (192kbps - 320kbps). Máximo 50MB.
              </p>
              <div className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                Directo a Supabase Storage (Sin límite de Vercel)
              </div>
            </div>

            {/* Archivo seleccionado pendiente de guardar */}
            {selectedFile && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-blue-200/80 text-blue-900 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-neutral-900 truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {fileSizeFormatted} • {fileDuration || "Calculando..."}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Barra de Progreso de Subida */}
            {isUploading && uploadProgress > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-neutral-600">
                  <span>Transfiriendo a servidor...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-[#8da9c4] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de Firma Sonora & Concepto */}
          <div className="bg-gradient-to-br from-[#f8fafc] to-[#edf2f7] rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ffc971]" />
              Firma Sonora Original Soulmar
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              <strong>Concepto:</strong> Un momento para volver a ti. Calma profunda, introspección, lluvia tenue y brisa marina envolvente sin percusión estridente (55–65 BPM).
            </p>
            <div className="p-3 rounded-2xl bg-white/80 border border-neutral-200/60 flex items-center justify-between text-xs font-mono text-neutral-700">
              <span>Motivo 4 Notas:</span>
              <strong className="text-neutral-900 font-bold">Fa — La — Do — Mi (F - A - C - E)</strong>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa, Reproductor y Botones de Acción */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Music className="w-4 h-4 text-[#8da9c4]" />
                Reproductor de Vista Previa
              </h4>

              {activeAudioSrc && (
                <span className="text-[11px] font-mono text-neutral-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            {/* Consola de Reproducción Estilo Apple */}
            {activeAudioSrc ? (
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 space-y-4">
                {/* Título y Estado */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      {selectedFile ? selectedFile.name : settings.fileName || "Soulmar Atmosphere"}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {selectedFile ? "Archivo local cargado" : "Almacenado en la nube"} • {selectedFile ? fileSizeFormatted : settings.size}
                    </div>
                  </div>

                  <div className="w-3 h-3 rounded-full bg-[#8da9c4]" />
                </div>

                {/* Scrubber / Barra de Progreso */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#8da9c4]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controles Principales */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleRestart}
                    title="Reiniciar"
                    className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-neutral-600 flex items-center justify-center border border-neutral-200 transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current pl-0.5" />
                    )}
                  </button>

                  {/* Volumen */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-neutral-500 hover:text-neutral-800 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 rounded-2xl bg-neutral-50/50 border border-dashed border-neutral-200 text-center space-y-2">
                <Music className="w-8 h-8 text-neutral-300 mx-auto" />
                <div className="text-xs font-bold text-neutral-600">
                  Sin pista seleccionada para previsualizar
                </div>
                <p className="text-[11px] text-neutral-400">
                  Carga un archivo MP3 en el panel izquierdo para escuchar cómo sonará.
                </p>
              </div>
            )}

            {/* Botones de Guardado y Publicación */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isUploading || (!selectedFile && !settings.audioUrl)}
                  className="h-11 px-4 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Guardar borrador</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndPublish}
                  disabled={isUploading || (!selectedFile && !settings.audioUrl)}
                  className="h-11 px-5 rounded-full bg-black hover:bg-[#8da9c4] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${isUploading ? "animate-spin" : ""}`} />
                  <span>Guardar y refrescar</span>
                </button>
              </div>

              {/* Botón Reemplazar / Eliminar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Reemplazar archivo de audio
                </button>

                {(settings.audioUrl || selectedFile) && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar audio
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación para Eliminar Audio */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900">
                ¿Eliminar audio ambiental de Soulmar?
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Esta acción removerá la pista de audio y ocultará automáticamente el botón flotante Liquid Glass de la web pública <strong>www.soulmar.org</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-10 px-5 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAudio}
                className="h-10 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  Upload, FileText, Image as ImageIcon, Trash2, 
  Download, X, Check, AlertCircle, File
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  uploadUserDocument,
  getUserDocuments,
  getDocumentUrl,
  deleteUserDocument,
  type UserDocument
} from '@/lib/actions/documents'

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG'
}

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
  return <FileText className="w-4 h-4" />
}

function getFileColor(type: string) {
  if (type === 'application/pdf') return 'text-red-500 bg-red-50 dark:bg-red-500/10'
  if (type.includes('wordprocessing')) return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
  if (type.startsWith('image/')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
  return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10'
}

interface DocumentUploadProps {
  userId: string
  t: (key: string, options?: Record<string, unknown>) => string
}

export default function DocumentUpload({ userId, t }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing documents
  useEffect(() => {
    async function loadDocs() {
      setIsLoading(true)
      const docs = await getUserDocuments(userId)
      setDocuments(docs)
      setIsLoading(false)
    }
    if (userId) loadDocs()
  }, [userId])

  const processFile = useCallback(async (file: File) => {
    // Validate type
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setUploadStatus('error')
      setStatusMessage('Formato no permitido. Usa PDF, DOCX, JPG o PNG.')
      return
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      setUploadStatus('error')
      setStatusMessage('El archivo excede el límite de 10MB.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('idle')

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 15, 90))
    }, 200)

    try {
      // Convert to base64
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const result = await uploadUserDocument(userId, file.name, base64, file.type)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setUploadStatus('success')
        setStatusMessage(`"${file.name}" subido correctamente.`)
        // Refresh file list
        const docs = await getUserDocuments(userId)
        setDocuments(docs)
      } else {
        setUploadStatus('error')
        setStatusMessage(result.error || 'Error desconocido.')
      }
    } catch {
      clearInterval(progressInterval)
      setUploadStatus('error')
      setStatusMessage('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsUploading(false)
      setTimeout(() => {
        setUploadStatus('idle')
        setUploadProgress(0)
      }, 4000)
    }
  }, [userId])

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [processFile])

  const handleDownload = async (doc: UserDocument) => {
    try {
      const result = await getDocumentUrl(doc.path)
      if (result.success && result.url) {
        // Excellence: Force actual download instead of just opening in tab
        const response = await fetch(result.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name) // Force original filename
        document.body.appendChild(link)
        link.click()
        
        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback to opening in new tab if blob fetch fails (e.g. CORS)
      const result = await getDocumentUrl(doc.path)
      if (result.success && result.url) {
        window.open(result.url, '_blank')
      }
    }
  }

  const handleDelete = async (doc: UserDocument) => {
    const result = await deleteUserDocument(doc.path)
    if (result.success) {
      setDocuments(prev => prev.filter(d => d.path !== doc.path))
    }
  }

  return (
    <div className="bg-white dark:bg-[#111111] rounded-[3rem] p-10 border border-slate-100 dark:border-[#222222] shadow-sm space-y-6 text-left">
      <h3 className="text-xl font-bold font-playfair uppercase tracking-tight">
        {t('dashboard.user.documentation', { defaultValue: "Documentación" })}
      </h3>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative min-h-[160px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300",
          isDragging
            ? "border-[#c9cba3] bg-[#c9cba3]/10 scale-[1.02]"
            : "border-slate-200 dark:border-[#222222] bg-slate-50/50 dark:bg-[#0A0A0A]/50 hover:border-[#c9cba3]/50",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        {isUploading ? (
          <div className="w-full space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#c9cba3]/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#c9cba3] animate-bounce" />
            </div>
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-slate-100 dark:bg-[#222222] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#c9cba3] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                {uploadProgress}% — Subiendo...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={cn(
              "w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-all duration-300",
              isDragging
                ? "bg-[#c9cba3] scale-110"
                : "bg-white dark:bg-[#111111] group-hover:scale-110"
            )}>
              <Upload className={cn(
                "w-5 h-5 transition-colors",
                isDragging ? "text-white" : "text-slate-300"
              )} />
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-600">
              {t('dashboard.user.drag_documents', { defaultValue: "Arrastra tus documentos o historia clínica aquí" })}
            </p>
            <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-1 font-medium">
              PDF, DOCX, JPG, PNG · Máx 10MB
            </p>
          </>
        )}
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {uploadStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold",
              uploadStatus === 'success'
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
            )}
          >
            {uploadStatus === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full h-14 rounded-2xl bg-[#c9cba3] text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-[#b8ba92] disabled:opacity-50"
      >
        {isUploading
          ? t('dashboard.user.uploading', { defaultValue: "SUBIENDO..." })
          : t('dashboard.user.upload_files', { defaultValue: "SUBIR ARCHIVOS" })
        }
      </Button>

      {/* File List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-slate-50 dark:bg-[#0A0A0A] animate-pulse" />
          ))}
        </div>
      ) : documents.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            {t('dashboard.user.uploaded_files', { defaultValue: "ARCHIVOS SUBIDOS" })} ({documents.length})
          </p>
          {documents.map((doc, i) => (
            <motion.div
              key={doc.path}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0A0A0A]/80 border border-slate-100 dark:border-[#1a1a1a] group hover:border-[#c9cba3]/30 transition-all"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", getFileColor(doc.type))}>
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">
                  {formatFileSize(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#222222] text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                  title="Descargar"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

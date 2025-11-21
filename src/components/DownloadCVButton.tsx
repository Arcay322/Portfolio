"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { trackCVDownload } from "@/lib/analytics"

export function DownloadCVButton() {
  const handleDownload = () => {
    // Track CV download
    trackCVDownload()
    
    // URL de tu CV en la carpeta public
    const cvUrl = "/CV_ArnieCalderon.pdf"
    
    // Crear un elemento 'a' temporal para forzar la descarga
    const link = document.createElement('a')
    link.href = cvUrl
    link.download = 'CV_ArnieCalderon.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleDownload}
        size="lg"
        className="gap-2"
        variant="outline"
      >
        <Download className="h-5 w-5" />
        Descargar CV
      </Button>
    </motion.div>
  )
}

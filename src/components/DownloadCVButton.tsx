"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { trackCVDownload } from "@/lib/analytics"
import { useTranslations } from 'next-intl';

export function DownloadCVButton() {
  const t = useTranslations('common');
  const [isDownloading, setIsDownloading] = useState(false)

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
        className="gap-2 h-14 px-8 text-lg rounded-full hover:scale-105 transition-all duration-300 backdrop-blur-md bg-background/30 border-muted-foreground/20 hover:bg-background/50 hover:border-primary/50"
        variant="outline"
      >
        <Download className="h-5 w-5" />
        {t('download_cv')}
      </Button>
    </motion.div>
  )
}

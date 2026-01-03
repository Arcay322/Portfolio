"use client"

import { useState } from "react"
import { Share2, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const t = useTranslations('common');
  const tSocial = useTranslations('social');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsOpen(!isOpen)
        }
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        aria-label={t('share')}
      >
        <Share2 className="w-4 h-4" />
        {t('share')}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] p-4 rounded-xl border bg-card text-card-foreground shadow-xl"
            >
              <div className="space-y-2">
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  <span className="font-medium">{tSocial('twitter')}</span>
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#4267B2]" />
                  <span className="font-medium">{tSocial('facebook')}</span>
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  <span className="font-medium">{tSocial('linkedin')}</span>
                </a>
                <a
                  href={shareLinks.email}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{tSocial('email')}</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-500">{t('copied')}</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-5 h-5" />
                      <span>{t('copy_link')}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

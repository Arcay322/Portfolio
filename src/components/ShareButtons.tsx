'use client';

import { useState } from 'react';
import {
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Use current page if no URL provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';
  const shareDescription = description || '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
      `${shareDescription}\n\n${shareUrl}`
    )}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      {/* Main share button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        aria-label="Compartir"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </button>

      {/* Share menu (shown on desktop or when native share is not available) */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="space-y-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span className="font-medium">Twitter</span>
              </a>
              
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#4267B2]" />
                <span className="font-medium">Facebook</span>
              </a>
              
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#0077B5]" />
                <span className="font-medium">LinkedIn</span>
              </a>
              
              <a
                href={shareLinks.email}
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Email</span>
              </a>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-500">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Copiar enlace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simple share button (just copy link)
export function SimpleShareButton({ url, className }: { url?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={
        className ||
        'flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm'
      }
      aria-label="Copiar enlace"
    >
      {copied ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-green-500">¡Copiado!</span>
        </>
      ) : (
        <>
          <LinkIcon className="w-4 h-4" />
          <span>Compartir</span>
        </>
      )}
    </button>
  );
}

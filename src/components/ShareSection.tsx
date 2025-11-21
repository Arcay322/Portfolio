'use client';

import { Share2 } from 'lucide-react';

interface ShareSectionProps {
  title: string;
  description: string;
}

export function ShareSection({ title, description }: ShareSectionProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="py-6 border-y border-border mb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Compartir artículo
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Compartir
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Copiar enlace
          </button>
        </div>
      </div>
    </div>
  );
}

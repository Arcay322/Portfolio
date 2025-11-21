'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Por favor ingresa un email válido');
      return;
    }

    setStatus('loading');

    try {
      // Replace with actual API call
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('¡Gracias por suscribirte! Revisa tu email para confirmar.');
        setEmail('');
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch {
      setStatus('error');
      setMessage('Algo salió mal. Por favor intenta de nuevo.');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border rounded-lg p-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Suscríbete al Newsletter</h3>
        <p className="text-muted-foreground mb-6">
          Recibe artículos sobre desarrollo web, tips de programación y novedades directamente en tu
          inbox. Sin spam, solo contenido de calidad.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {status === 'loading' ? 'Enviando...' : status === 'success' ? '¡Suscrito!' : 'Suscribirse'}
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                status === 'success'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </div>
          )}
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          Al suscribirte, aceptas recibir emails ocasionales. Puedes darte de baja en cualquier
          momento.
        </p>
      </div>
    </div>
  );
}

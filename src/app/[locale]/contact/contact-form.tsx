"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail } from "./actions";
import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { SendContactEmailInputSchema } from "@/ai/schemas/contact-email";
import { trackContactForm } from "@/lib/analytics";
import { clientContactLimiter } from "@/lib/rate-limiter";
import { useTranslations } from "next-intl";

const formSchema = SendContactEmailInputSchema;

const DRAFT_KEY = "contact-form-draft";
const DRAFT_TIMESTAMP_KEY = "contact-form-draft-timestamp";

export function ContactForm() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [draftAge, setDraftAge] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validación en tiempo real
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Función para calcular la edad del borrador
  const calculateDraftAge = useCallback((timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return t('time.days', { count: days });
    if (hours > 0) return t('time.hours', { count: hours });
    if (minutes > 0) return t('time.minutes', { count: minutes });
    return t('time.moment');
  }, [t]);

  // Cargar borrador del localStorage al montar
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);

      if (draft) {
        const parsedDraft = JSON.parse(draft);
        form.reset(parsedDraft);
        setHasDraft(true);

        if (timestamp) {
          setDraftAge(calculateDraftAge(parseInt(timestamp)));
        }

        toast({
          title: t('draft_recovered'),
          description: t('draft_recovered_desc'),
        });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }, [form, toast, calculateDraftAge]);

  // Guardar borrador automáticamente cada 3 segundos
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Solo guardar si hay algún campo con contenido
      if (values.name || values.email || values.message) {
        const timeoutId = setTimeout(() => {
          try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            localStorage.setItem(DRAFT_TIMESTAMP_KEY, Date.now().toString());
            setHasDraft(true);
            setDraftAge(calculateDraftAge(Date.now()));
          } catch (error) {
            console.error("Error saving draft:", error);
          }
        }, 3000);

        return () => clearTimeout(timeoutId);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, calculateDraftAge]);

  // Limpiar borrador
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      form.reset();
      setHasDraft(false);
      setDraftAge("");

      toast({
        title: t('draft_deleted'),
        description: t('draft_deleted_desc'),
      });
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Anti-spam: Si el honeypot tiene valor, es un bot
    if (honeypot) {
      console.warn("Bot detected via honeypot");
      return;
    }

    // Rate limiting del lado del cliente
    const rateLimitCheck = clientContactLimiter.check();
    if (!rateLimitCheck.allowed) {
      const timeLeft = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 60000);

      toast({
        title: t('rate_limit_title'),
        description: t('rate_limit_desc', { time: timeLeft }),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendContactEmail(values);
      if (result.success) {
        trackContactForm(true); // Track successful submission

        // Limpiar borrador después de envío exitoso
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
        setHasDraft(false);

        toast({
          title: t('success_title'),
          description: t('success_desc'),
        });
        form.reset();
      }
    } catch (error) {
      trackContactForm(false); // Track failed submission
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('error_desc');
      toast({
        title: t('error_title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Draft indicator */}
        {hasDraft && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Save className="h-4 w-4" />
              <span>{t('draft_saved', { time: draftAge })}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearDraft}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('clear_draft')}
            </Button>
          </div>
        )}

        {/* Honeypot field - hidden from users, visible to bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('name_placeholder')}
                  {...field}
                  disabled={isSubmitting}
                  className={fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('email_placeholder')}
                  type="email"
                  {...field}
                  disabled={isSubmitting}
                  className={fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('message_placeholder')}
                  className={`resize-none min-h-32 ${fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""}`}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t('draft_saved_auto')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('sending')}
            </>
          ) : (
            t('send')
          )}
        </Button>
      </form>
    </Form>
  );
}

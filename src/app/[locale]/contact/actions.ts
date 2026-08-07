'use server';

import { sendContactEmail as sendContactEmailFlow } from "@/ai/flows/send-contact-email-flow";
import { SendContactEmailInputSchema } from "@/ai/schemas/contact-email";
import { sanitizeContactForm, validateSecurity, checkDuplicateSubmission, sanitizeForLog } from "@/lib/sanitization";
import { contactFormLimiter, getClientIdentifier, getClientIp, isValidOrigin } from "@/lib/rate-limiter";
import { headers } from "next/headers";

export async function submitContactForm(values: unknown) {
    try {
        // Validar Origin para prevenir CSRF
        const headersList = await headers();
        if (!isValidOrigin(headersList.get("origin"))) {
            return {
                success: false,
                error: "Invalid request origin."
            };
        }

        // Rate limiting server-side por IP
        const rateLimit = contactFormLimiter.check(getClientIdentifier(headersList));
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            return {
                success: false,
                error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
            };
        }

        // Validar schema de forma segura
        const result = SendContactEmailInputSchema.safeParse(values);

        if (!result.success) {
            return {
                success: false,
                error: "Validation failed: " + result.error.errors.map(e => e.message).join(", ")
            };
        }

        const validatedData = result.data;

        // Sanitizar inputs
        const sanitized = sanitizeContactForm(validatedData);

        // Validar seguridad
        const messageCheck = validateSecurity(sanitized.message);
        if (!messageCheck.safe) {
            return {
                success: false,
                error: "Invalid input detected. Please check your message."
            };
        }

        // Verificar duplicados
        const isDuplicate = checkDuplicateSubmission(sanitized.message);
        if (isDuplicate) {
            return {
                success: false,
                error: "This message was already submitted. Please wait before sending again."
            };
        }

        // Log sanitizado para debugging
        const ip = getClientIp(headersList);
        console.log(`Contact form submission from ${sanitizeForLog(ip)}`);

        return await sendContactEmailFlow(sanitized);
    } catch (error) {
        console.error("Critical error in server action:", error);
        return {
            success: false,
            error: "Internal server error. Please try again later."
        };
    }
}

'use server';

import { sendContactEmail as sendContactEmailFlow } from "@/ai/flows/send-contact-email-flow";
import { SendContactEmailInputSchema } from "@/ai/schemas/contact-email";
import { sanitizeContactForm, validateSecurity, checkDuplicateSubmission } from "@/lib/sanitization";
import { headers } from "next/headers";

export async function submitContactForm(values: unknown) {
    try {
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

        // Rate limiting básico (se puede mejorar con base de datos)
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";

        // Log sanitizado para debugging
        console.log(`Contact form submission from ${ip.substring(0, 10)}...`);

        return await sendContactEmailFlow(sanitized);
    } catch (error) {
        console.error("Critical error in server action:", error);
        return {
            success: false,
            error: "Internal server error. Please try again later."
        };
    }
}

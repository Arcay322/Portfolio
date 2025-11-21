'use server';

import { sendContactEmail as sendContactEmailFlow } from "@/ai/flows/send-contact-email-flow";
import { SendContactEmailInputSchema } from "@/ai/schemas/contact-email";
import { sanitizeContactForm, validateSecurity, checkDuplicateSubmission } from "@/lib/sanitization";
import { headers } from "next/headers";

export async function sendContactEmail(values: unknown) {
    // Validar schema
    const validatedData = SendContactEmailInputSchema.parse(values);
    
    // Sanitizar inputs
    const sanitized = sanitizeContactForm(validatedData);
    
    // Validar seguridad
    const messageCheck = validateSecurity(sanitized.message);
    if (!messageCheck.safe) {
        throw new Error("Invalid input detected. Please check your message.");
    }
    
    // Verificar duplicados
    const isDuplicate = checkDuplicateSubmission(sanitized.message);
    if (isDuplicate) {
        throw new Error("This message was already submitted. Please wait before sending again.");
    }
    
    // Rate limiting básico (se puede mejorar con base de datos)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    // Log sanitizado para debugging
    console.log(`Contact form submission from ${ip.substring(0, 10)}...`);
    
    return await sendContactEmailFlow(sanitized);
}

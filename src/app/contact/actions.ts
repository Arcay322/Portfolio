'use server';

import { sendContactEmail as sendContactEmailFlow } from "@/ai/flows/send-contact-email-flow";
import { SendContactEmailInputSchema } from "@/ai/schemas/contact-email";

export async function sendContactEmail(values: unknown) {
    const validatedData = SendContactEmailInputSchema.parse(values);
    return await sendContactEmailFlow(validatedData);
}

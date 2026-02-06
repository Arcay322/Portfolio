/**
 * @fileOverview Schemas for the sendContactEmail action.
 *
 * - SendContactEmailInputSchema - The Zod schema for the input of the sendContactEmail function.
 */

import { z } from 'zod';

export const SendContactEmailInputSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().trim().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message cannot exceed 500 characters."
  }),
});

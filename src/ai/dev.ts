import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

genkit({
  plugins: [googleAI()],
  //   logLevel: 'debug',
});

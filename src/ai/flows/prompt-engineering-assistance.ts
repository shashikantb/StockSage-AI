// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Provides suggested prompts tailored to specific stock segments for in-depth analyses.
 *
 * - `getPromptSuggestions` - A function that retrieves prompt suggestions based on the provided stock segment.
 * - `PromptSuggestionsInput` - The input type for the `getPromptSuggestions` function.
 * - `PromptSuggestionsOutput` - The output type for the `getPromptSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptSuggestionsInputSchema = z.object({
  stockSegment: z
    .string()
    .describe(
      'The segment of the stock for which prompt suggestions are needed.'
    ),
});
export type PromptSuggestionsInput = z.infer<typeof PromptSuggestionsInputSchema>;

const PromptSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested prompts for the specified stock segment.'),
});
export type PromptSuggestionsOutput = z.infer<typeof PromptSuggestionsOutputSchema>;

export async function getPromptSuggestions(
  input: PromptSuggestionsInput
): Promise<PromptSuggestionsOutput> {
  return promptSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptSuggestionsPrompt',
  input: {schema: PromptSuggestionsInputSchema},
  output: {schema: PromptSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide prompt suggestions for stock analysis.

  Based on the stock segment provided by the user, suggest three prompts that can be used for in-depth analysis.
  The prompts should be diverse and cover different aspects of the stock segment.
  Format each prompt suggestion as a concise and clear question or instruction.

  Stock Segment: {{{stockSegment}}}

  Suggestions:`, // Prompt string updated
});

const promptSuggestionsFlow = ai.defineFlow(
  {
    name: 'promptSuggestionsFlow',
    inputSchema: PromptSuggestionsInputSchema,
    outputSchema: PromptSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

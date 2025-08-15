'use server';

/**
 * @fileOverview A stock search suggestion AI agent.
 *
 * - getStockSearchSuggestions - A function that handles the stock search suggestion process.
 * - StockSearchSuggestionsInput - The input type for the getStockSearchSuggestions function.
 * - StockSearchSuggestionsOutput - The return type for the getStockSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StockSearchSuggestionsInputSchema = z.object({
  searchTerm: z.string().describe('The search term entered by the user.'),
});
export type StockSearchSuggestionsInput = z.infer<
  typeof StockSearchSuggestionsInputSchema
>;

const StockSearchSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of stock search suggestions.'),
});
export type StockSearchSuggestionsOutput = z.infer<
  typeof StockSearchSuggestionsOutputSchema
>;

export async function getStockSearchSuggestions(
  input: StockSearchSuggestionsInput
): Promise<StockSearchSuggestionsOutput> {
  return stockSearchSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockSearchSuggestionsPrompt',
  input: {schema: StockSearchSuggestionsInputSchema},
  output: {schema: StockSearchSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides stock search suggestions based on the user's input.

  Return a JSON object with a "suggestions" key, which is an array of strings.
  Provide a maximum of 5 suggestions.

  Search Term: {{{searchTerm}}}`,
});

const stockSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'stockSearchSuggestionsFlow',
    inputSchema: StockSearchSuggestionsInputSchema,
    outputSchema: StockSearchSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

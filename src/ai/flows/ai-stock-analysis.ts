// This is an auto-generated file from Firebase Studio.

'use server';

/**
 * @fileOverview Provides AI-driven stock analysis with color-coded indicators.
 *
 * - aiStockAnalysis - Analyzes a given stock and provides insights with color-coded indicators.
 * - AiStockAnalysisInput - The input type for the aiStockAnalysis function.
 * - AiStockAnalysisOutput - The return type for the aiStockAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStockAnalysisInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock to analyze.'),
});
export type AiStockAnalysisInput = z.infer<typeof AiStockAnalysisInputSchema>;

const AiStockAnalysisOutputSchema = z.object({
  analysis: z.string().describe('AI-driven analysis of the stock.'),
  colorCode: z
    .string()
    .describe(
      'Color code indicating performance (green to red shades).' + 
      'Must be a valid CSS color value (e.g., "green", "#00FF00", "rgba(0, 255, 0, 1)").'
    ),
});
export type AiStockAnalysisOutput = z.infer<typeof AiStockAnalysisOutputSchema>;

export async function aiStockAnalysis(
  input: AiStockAnalysisInput
): Promise<AiStockAnalysisOutput> {
  return aiStockAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStockAnalysisPrompt',
  input: {schema: AiStockAnalysisInputSchema},
  output: {schema: AiStockAnalysisOutputSchema},
  prompt: `You are an AI assistant providing stock analysis.

  Analyze the stock with ticker symbol {{{ticker}}} and provide an AI-driven analysis of the stock's performance.

  Also, provide a color code (CSS color value) indicating the stock's performance, ranging from green (positive) to red (negative). Return a valid CSS color value (e.g., "green", "#00FF00", "rgba(0, 255, 0, 1)").
  `,
});

const aiStockAnalysisFlow = ai.defineFlow(
  {
    name: 'aiStockAnalysisFlow',
    inputSchema: AiStockAnalysisInputSchema,
    outputSchema: AiStockAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

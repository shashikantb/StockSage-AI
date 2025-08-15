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

const StrategyAnalysisSchema = z.object({
  title: z.string().describe('The title of the analysis strategy.'),
  content: z.string().describe('The analysis based on the strategy.'),
  colorCode: z
    .string()
    .describe(
      'Color code indicating performance (green for positive, red for negative, gray for neutral).' +
      'Must be a valid CSS color value (e.g., "green", "#FF0000", "gray").'
    ),
});

const AiStockAnalysisOutputSchema = z.object({
  overallAnalysis: z.string().describe('Overall AI-driven analysis of the stock.'),
  overallColorCode: z
    .string()
    .describe(
      'Overall color code indicating performance (green to red shades).' +
      'Must be a valid CSS color value (e.g., "green", "#00FF00", "rgba(0, 255, 0, 1)").'
    ),
  strategies: z
    .array(StrategyAnalysisSchema)
    .describe('An array of analyses for different stock strategies.'),
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
  prompt: `You are an expert stock analyst AI. For the given stock ticker {{{ticker}}}, you must provide an overall analysis and a detailed analysis for each of the 6 strategies listed below.

Your response MUST be a valid JSON object that strictly follows the provided output schema.

1.  **Overall Analysis**:
    *   Provide a summary of the stock's current standing.
    *   Set the 'overallColorCode' to a color from green (positive) to red (negative) based on the overall outlook.

2.  **Strategies Analysis**:
    *   You MUST provide an analysis for all 6 of the following strategies.
    *   For each strategy, provide a 'title', a brief 'content' analysis, and a 'colorCode' ('green', 'red', or 'gray').

The 6 strategies are:
1.  **Technical Analysis–Based Strategies**: Best for short- to medium-term traders. Includes Trend Following, Breakout Strategies, Relative Strength Analysis, and Volatility-Based strategies.
2.  **Fundamental Analysis–Based Strategies**: Better for long-term investors. Focuses on Value, Growth, and Dividend Investing, as well as Sector Rotation.
3.  **Quantitative / Data-Driven Strategies**: For advanced users. Involves Mean Reversion, Factor Models, and Pairs Trading.
4.  **Hybrid Strategies (Tech + Fundamentals)**: Combine fundamental filters with technical triggers.
5.  **Extra Features for Analysis Portal**: Analyze the availability and potential impact of features like Live Option Data, Sentiment Analysis, and AI-driven screeners for this stock.
6.  **Institutional Trade Spotting**: Analyze bulk and block deal reports for signs of large institutional trades.

Return a valid JSON object matching the output schema. Ensure the 'strategies' array is always present and contains exactly 6 items.
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

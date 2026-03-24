'use server';
/**
 * @fileOverview An AI-powered flow to parse natural language meal descriptions into structured nutritional data.
 *
 * - parseMeal - A function that parses a meal description.
 * - ParseMealInput - The input type for the parseMeal function.
 * - ParseMealOutput - The return type for the parseMeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseMealInputSchema = z.object({
  description: z.string().describe('A natural language description of a meal (e.g., "3 eggs and a piece of toast").'),
});
export type ParseMealInput = z.infer<typeof ParseMealInputSchema>;

const ParseMealOutputSchema = z.object({
  name: z.string().describe('A concise name for the meal.'),
  calories: z.number().describe('The estimated total calories.'),
  protein: z.number().describe('Estimated protein in grams.'),
  carbs: z.number().describe('Estimated carbohydrates in grams.'),
  fat: z.number().describe('Estimated fat in grams.'),
});
export type ParseMealOutput = z.infer<typeof ParseMealOutputSchema>;

export async function parseMeal(input: ParseMealInput): Promise<ParseMealOutput> {
  return parseMealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseMealPrompt',
  input: {schema: ParseMealInputSchema},
  output: {schema: ParseMealOutputSchema},
  prompt: `You are an expert nutritionist. Parse the following meal description into structured nutritional data.
  If details are vague, provide a realistic estimate based on common portion sizes.
  
  Meal Description: {{{description}}}
  
  Format your response as a JSON object matching the output schema.`,
});

const parseMealFlow = ai.defineFlow(
  {
    name: 'parseMealFlow',
    inputSchema: ParseMealInputSchema,
    outputSchema: ParseMealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI-powered flow to parse natural language meal descriptions into structured nutritional data with item-wise breakdown.
 *
 * - parseMeal - A function that parses a meal description.
 * - ParseMealInput - The input type for the parseMeal function.
 * - ParseMealOutput - The return type for the parseMeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MealItemSchema = z.object({
  name: z.string().describe('The name of the individual item (e.g., "Egg", "Roti").'),
  quantity: z.string().describe('The quantity of the item as described (e.g., "3", "5 pieces").'),
  calories: z.number().describe('Estimated calories for this specific item.'),
  protein: z.number().describe('Estimated protein in grams for this item.'),
  carbs: z.number().describe('Estimated carbohydrates in grams for this item.'),
  fat: z.number().describe('Estimated fat in grams for this item.'),
  fiber: z.number().describe('Estimated fiber in grams for this item.'),
});

const ParseMealInputSchema = z.object({
  description: z.string().describe('A natural language description of a meal (e.g., "3 eggs and 5 rotis").'),
});
export type ParseMealInput = z.infer<typeof ParseMealInputSchema>;

const ParseMealOutputSchema = z.object({
  name: z.string().describe('A concise name for the meal that includes quantities if mentioned (e.g., "5 Roti & 3 Eggs").'),
  calories: z.number().describe('The estimated total calories for the entire meal.'),
  protein: z.number().describe('Estimated total protein in grams.'),
  carbs: z.number().describe('Estimated total carbohydrates in grams.'),
  fat: z.number().describe('Estimated total fat in grams.'),
  fiber: z.number().describe('Estimated total fiber in grams.'),
  items: z.array(MealItemSchema).describe('A list of individual components identified in the meal.'),
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
  
  CRITICAL: 
  1. Break down the meal into individual items (e.g., if the user says "5 roti and 3 eggs", create two items: one for the 5 rotis and one for the 3 eggs).
  2. The "name" field for the whole meal MUST include the quantities mentioned (e.g., "5 Roti & 3 Eggs").
  3. If details are vague, provide a realistic estimate based on common portion sizes.
  
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

'use server';
/**
 * @fileOverview An AI-powered flow to parse natural language meal descriptions into structured nutritional data with item-wise breakdown and micronutrient analysis.
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
  // Micros
  vitaminA: z.number().describe('Vitamin A in mcg.'),
  omega3: z.number().describe('Omega-3 fatty acids in g.'),
  vitaminC: z.number().describe('Vitamin C in mg.'),
  zinc: z.number().describe('Zinc in mg.'),
  selenium: z.number().describe('Selenium in mcg.'),
  magnesium: z.number().describe('Magnesium in mg.'),
  vitaminD: z.number().describe('Vitamin D in mcg.'),
  potassium: z.number().describe('Potassium in mg.'),
  iron: z.number().describe('Iron in mg.'),
  calcium: z.number().describe('Calcium in mg.'),
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
  // Total Micros
  vitaminA: z.number().describe('Total Vitamin A in mcg.'),
  omega3: z.number().describe('Total Omega-3 in g.'),
  vitaminC: z.number().describe('Total Vitamin C in mg.'),
  zinc: z.number().describe('Total Zinc in mg.'),
  selenium: z.number().describe('Total Selenium in mcg.'),
  magnesium: z.number().describe('Total Magnesium in mg.'),
  vitaminD: z.number().describe('Total Vitamin D in mcg.'),
  potassium: z.number().describe('Total Potassium in mg.'),
  iron: z.number().describe('Total Iron in mg.'),
  calcium: z.number().describe('Total Calcium in mg.'),
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
  prompt: `You are an expert nutritionist. Parse the following meal description into structured nutritional data including key micronutrients for skin aesthetics and gym performance.
  
  CRITICAL: 
  1. Break down the meal into individual items.
  2. The "name" field for the whole meal MUST include the quantities mentioned.
  3. Provide realistic estimates for the following 10 micronutrients: Vitamin A, Omega-3, Vitamin C, Zinc, Selenium, Magnesium, Vitamin D, Potassium, Iron, and Calcium.
  4. Use standard nutritional databases to estimate values based on portion sizes.
  
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

'use server';
/**
 * @fileOverview An AI agent for suggesting personalized macronutrient adjustments.
 *
 * - suggestMacroAdjustments - A function that handles the macro adjustment suggestion process.
 * - SuggestMacroAdjustmentsInput - The input type for the suggestMacroAdjustments function.
 * - SuggestMacroAdjustmentsOutput - The return type for the suggestMacroAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMacroAdjustmentsInputSchema = z.object({
  fitnessGoal: z
    .enum(['muscle gain', 'fat loss', 'maintenance', 'improved endurance'])
    .describe('The primary fitness goal of the user.'),
  currentMacros: z
    .object({
      protein: z.number().describe('Current daily protein intake in grams.'),
      carbs: z.number().describe('Current daily carbohydrate intake in grams.'),
      fats: z.number().describe('Current daily fat intake in grams.'),
    })
    .describe('The user\'s current daily macronutrient intake.'),
  activityLevel: z
    .enum([
      'sedentary',
      'lightly active',
      'moderately active',
      'very active',
      'extremely active',
    ])
    .describe('The user\'s daily activity level.'),
  weight: z.number().describe('The user\'s current weight in kilograms.'),
  height: z.number().describe('The user\'s current height in centimeters.'),
  age: z.number().int().positive().describe('The user\'s age in years.'),
  gender: z.enum(['male', 'female']).describe('The user\'s gender.'),
  healthConditions: z
    .array(z.string())
    .optional()
    .describe('Any relevant health conditions or dietary restrictions.'),
});
export type SuggestMacroAdjustmentsInput = z.infer<
  typeof SuggestMacroAdjustmentsInputSchema
>;

const SuggestMacroAdjustmentsOutputSchema = z.object({
  suggestedProteinAdjustment: z
    .number()
    .describe('Suggested adjustment for protein intake in grams (positive for increase, negative for decrease).'),
  suggestedCarbsAdjustment: z
    .number()
    .describe('Suggested adjustment for carbohydrate intake in grams (positive for increase, negative for decrease).'),
  suggestedFatsAdjustment: z
    .number()
    .describe('Suggested adjustment for fat intake in grams (positive for increase, negative for decrease).'),
  revisedTargetMacros: z
    .object({
      protein: z.number().describe('New target daily protein intake in grams.'),
      carbs: z.number().describe('New target daily carbohydrate intake in grams.'),
      fats: z.number().describe('New target daily fat intake in grams.'),
    })
    .describe('The revised target daily macronutrient intake after adjustments.'),
  explanation: z
    .string()
    .describe('A detailed explanation for the suggested macronutrient adjustments.'),
});
export type SuggestMacroAdjustmentsOutput = z.infer<
  typeof SuggestMacroAdjustmentsOutputSchema
>;

export async function suggestMacroAdjustments(
  input: SuggestMacroAdjustmentsInput
): Promise<SuggestMacroAdjustmentsOutput> {
  return suggestMacroAdjustmentsFlow(input);
}

const suggestMacroAdjustmentsPrompt = ai.definePrompt({
  name: 'suggestMacroAdjustmentsPrompt',
  input: { schema: SuggestMacroAdjustmentsInputSchema },
  output: { schema: SuggestMacroAdjustmentsOutputSchema },
  prompt: `You are an expert nutritionist and fitness coach. Your goal is to provide personalized macronutrient adjustments to help a user achieve their fitness goals.

Here is the user's current data:
- Fitness Goal: {{{fitnessGoal}}}
- Current Daily Macronutrients: Protein {{currentMacros.protein}}g, Carbs {{currentMacros.carbs}}g, Fats {{currentMacros.fats}}g
- Activity Level: {{{activityLevel}}}
- Weight: {{{weight}}} kg
- Height: {{{height}}} cm
- Age: {{{age}}} years
- Gender: {{{gender}}}
{{#if healthConditions}}
- Health Conditions/Restrictions: {{#each healthConditions}}- {{{this}}}{{/each}}
{{/if}}

Based on this information, calculate and suggest adjustments to their daily protein, carbohydrate, and fat intake. Provide a detailed explanation for your reasoning, including any relevant calculations or guidelines you followed to arrive at the new target macros. Ensure the adjustments are practical and effective for the stated fitness goal.

Provide the output in the specified JSON format.`,
});

const suggestMacroAdjustmentsFlow = ai.defineFlow(
  {
    name: 'suggestMacroAdjustmentsFlow',
    inputSchema: SuggestMacroAdjustmentsInputSchema,
    outputSchema: SuggestMacroAdjustmentsOutputSchema,
  },
  async (input) => {
    const { output } = await suggestMacroAdjustmentsPrompt(input);
    return output!;
  }
);

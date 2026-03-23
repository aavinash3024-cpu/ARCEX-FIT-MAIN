'use server';
/**
 * @fileOverview A GenAI tool for suggesting a personalized daily hydration target.
 *
 * - suggestHydrationTarget - A function that handles the hydration target suggestion process.
 * - SuggestHydrationTargetInput - The input type for the suggestHydrationTarget function.
 * - SuggestHydrationTargetOutput - The return type for the suggestHydrationTarget function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHydrationTargetInputSchema = z.object({
  weightKg: z.number().min(1).describe('The user\u2019s weight in kilograms.'),
  activityLevel: z
    .enum(['sedentary', 'moderately active', 'very active', 'athlete'])
    .describe('The user\u2019s activity level.'),
  healthConditions: z
    .string()
    .optional()
    .describe('Any relevant health conditions the user has (e.g., kidney issues, diabetes).'),
  climate: z
    .string()
    .optional()
    .describe('The current climate the user is in (e.g., hot and humid, cold and dry).'),
});
export type SuggestHydrationTargetInput = z.infer<typeof SuggestHydrationTargetInputSchema>;

const SuggestHydrationTargetOutputSchema = z.object({
  hydrationTargetMl: z
    .number()
    .describe('The suggested daily hydration target in milliliters.'),
  reasoning: z.string().describe('The reasoning behind the suggested hydration target.'),
});
export type SuggestHydrationTargetOutput = z.infer<typeof SuggestHydrationTargetOutputSchema>;

export async function suggestHydrationTarget(
  input: SuggestHydrationTargetInput
): Promise<SuggestHydrationTargetOutput> {
  return suggestHydrationTargetFlow(input);
}

const hydrationTargetPrompt = ai.definePrompt({
  name: 'suggestHydrationTargetPrompt',
  input: {schema: SuggestHydrationTargetInputSchema},
  output: {schema: SuggestHydrationTargetOutputSchema},
  prompt: `You are an expert nutritionist and hydration specialist. Your task is to suggest a personalized daily hydration target in milliliters for a user based on their provided data.

Consider the following information about the user:
- Weight: {{{weightKg}}} kg
- Activity Level: {{{activityLevel}}}
{{#if healthConditions}}
- Health Conditions: {{{healthConditions}}}
{{/if}}
{{#if climate}}
- Climate: {{{climate}}}
{{/if}}

Provide the suggested daily hydration target in milliliters and a clear, concise reasoning for your recommendation. The reasoning should explain how the given factors influence the target.`,
});

const suggestHydrationTargetFlow = ai.defineFlow(
  {
    name: 'suggestHydrationTargetFlow',
    inputSchema: SuggestHydrationTargetInputSchema,
    outputSchema: SuggestHydrationTargetOutputSchema,
  },
  async input => {
    const {output} = await hydrationTargetPrompt(input);
    return output!;
  }
);

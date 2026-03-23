'use server';
/**
 * @fileOverview An AI-powered tool that provides personalized suggestions for daily tasks, hydration targets, and potential macro adjustments.
 *
 * - generateDailyTasks - A function that handles the generation of daily tasks.
 * - GenerateDailyTasksInput - The input type for the generateDailyTasks function.
 * - GenerateDailyTasksOutput - The return type for the generateDailyTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyTasksInputSchema = z.object({
  age: z.number().describe('The user\'s age in years.'),
  gender: z.enum(['male', 'female', 'other']).describe('The user\'s gender.'),
  weightKg: z.number().describe('The user\'s weight in kilograms.'),
  heightCm: z.number().describe('The user\'s height in centimeters.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The user\'s current fitness level.'),
  wellnessGoals: z.array(z.string()).describe('A list of the user\'s wellness goals (e.g., "lose weight", "gain muscle", "reduce stress").'),
  dailySteps: z.number().describe('The number of steps the user has taken today.'),
  lastWorkout: z.string().optional().describe('A description of the user\'s last workout (e.g., "strength training 60 mins").'),
  currentMacros: z.object({
    protein: z.number().describe('Current protein intake in grams.'),
    carbs: z.number().describe('Current carbohydrate intake in grams.'),
    fat: z.number().describe('Current fat intake in grams.'),
  }).describe('The user\'s current macro intake for today.'),
  currentHydrationLiters: z.number().describe('The user\'s current hydration intake in liters.'),
  dietaryPreferences: z.array(z.string()).optional().describe('Optional: Any specific dietary preferences or restrictions (e.g., "vegetarian", "low-carb").'),
  healthConditions: z.array(z.string()).optional().describe('Optional: Any existing health conditions (e.g., "diabetes", "high blood pressure").'),
});
export type GenerateDailyTasksInput = z.infer<typeof GenerateDailyTasksInputSchema>;

const GenerateDailyTasksOutputSchema = z.object({
  suggestedTasks: z.array(z.string()).describe('A list of personalized daily tasks (e.g., exercise, mindfulness).'),
  hydrationTargetLiters: z.number().describe('The recommended daily hydration target in liters.'),
  macroAdjustments: z.object({
    proteinChange: z.string().describe('Suggested adjustment for protein (e.g., "Increase by 10g").'),
    carbsChange: z.string().describe('Suggested adjustment for carbohydrates (e.g., "Decrease by 5g").'),
    fatChange: z.string().describe('Suggested adjustment for fat (e.g., "Maintain current intake").'),
  }).describe('Suggestions for macro adjustments to align with wellness goals.'),
  overallRecommendation: z.string().describe('An overall brief recommendation or encouraging message.'),
});
export type GenerateDailyTasksOutput = z.infer<typeof GenerateDailyTasksOutputSchema>;

export async function generateDailyTasks(input: GenerateDailyTasksInput): Promise<GenerateDailyTasksOutput> {
  return generateDailyTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyTasksPrompt',
  input: {schema: GenerateDailyTasksInputSchema},
  output: {schema: GenerateDailyTasksOutputSchema},
  prompt: `You are an intelligent wellness assistant named PulseFlow AI, designed to help users stay on track with their health and wellness goals by providing personalized daily suggestions.

Based on the following user data, provide personalized suggestions for daily tasks, hydration targets, and potential macro adjustments.

User Profile:
- Age: {{{age}}}
- Gender: {{{gender}}}
- Weight: {{{weightKg}}} kg
- Height: {{{heightCm}}} cm
- Fitness Level: {{{fitnessLevel}}}
- Wellness Goals: {{#each wellnessGoals}}
- {{{this}}}
{{/each}}
- Health Conditions: {{#if healthConditions}}{{#each healthConditions}}
- {{{this}}}
{{/each}}{{else}}None{{/if}}
- Dietary Preferences: {{#if dietaryPreferences}}{{#each dietaryPreferences}}
- {{{this}}}
{{/each}}{{else}}None{{/if}}

Today's Data:
- Daily Steps so far: {{{dailySteps}}}
- Last Workout: {{#if lastWorkout}}{{{lastWorkout}}}{{else}}None reported{{/if}}
- Current Macro Intake: Protein {{{currentMacros.protein}}}g, Carbs {{{currentMacros.carbs}}}g, Fat {{{currentMacros.fat}}}g
- Current Hydration: {{{currentHydrationLiters}}} liters

Please provide:
1.  A list of specific daily tasks (e.g., exercise, mindfulness, meal prep) to help the user achieve their wellness goals.
2.  A recommended hydration target for today in liters.
3.  Suggestions for macro adjustments (protein, carbs, fat) if beneficial for their goals, explaining the change.
4.  An overall brief recommendation or encouraging message.

Format your response as a JSON object matching the output schema.`,
});

const generateDailyTasksFlow = ai.defineFlow(
  {
    name: 'generateDailyTasksFlow',
    inputSchema: GenerateDailyTasksInputSchema,
    outputSchema: GenerateDailyTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

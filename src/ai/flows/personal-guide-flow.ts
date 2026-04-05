'use server';
/**
 * @fileOverview An AI-powered personal guide that provides deep insights into nutrition, macros, micros, and meal suggestions based on real-time user data.
 *
 * - personalGuide - A function that handles the guide's response generation.
 * - PersonalGuideInput - The input type for the personalGuide function.
 * - PersonalGuideOutput - The return type for the personalGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalGuideInputSchema = z.object({
  profile: z.any().describe('The user\'s current goal and profile data.'),
  todayNutrition: z.array(z.any()).describe('The list of meals logged today.'),
  queryType: z.enum(['overall', 'macros', 'micros', 'suggestion']).describe('The type of analysis requested.'),
});
export type PersonalGuideInput = z.infer<typeof PersonalGuideInputSchema>;

const PersonalGuideOutputSchema = z.object({
  response: z.string().describe('The AI generated helpful response in a friendly, professional tone.'),
});
export type PersonalGuideOutput = z.infer<typeof PersonalGuideOutputSchema>;

export async function personalGuide(input: PersonalGuideInput): Promise<PersonalGuideOutput> {
  return personalGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalGuidePrompt',
  input: {schema: PersonalGuideInputSchema},
  output: {schema: PersonalGuideOutputSchema},
  prompt: `You are PulseFlow AI, an elite wellness coach. 
Analyze the following user data and provide a concise, high-impact response for the requested query type.

User Profile/Goals:
{{{profile}}}

Today's Logged Meals:
{{#each todayNutrition}}
- {{{name}}}: {{{calories}}} kcal (P: {{{protein}}}g, C: {{{carbs}}}g, F: {{{fat}}}g)
{{/each}}

Query Type: {{{queryType}}}

Instructions based on Query Type:
1. overall: Summarize their total caloric intake vs target. Mention if they are on track.
2. macros: Analyze the protein, carb, and fat distribution. Point out any imbalances.
3. micros: Briefly mention if they've hit key micronutrient needs based on their meals.
4. suggestion: Calculate exactly what they have left (calories and macros). Suggest 1-2 specific "Elite" meal options to fill those gaps perfectly.

Keep the tone professional, encouraging, and focused on performance. Limit response to 3-4 sentences.`,
});

const personalGuideFlow = ai.defineFlow(
  {
    name: 'personalGuideFlow',
    inputSchema: PersonalGuideInputSchema,
    outputSchema: PersonalGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

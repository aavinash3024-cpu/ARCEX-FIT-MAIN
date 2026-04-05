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
  prompt: `You are PulseFlow AI, a high-performance elite wellness analyst. 
Your goal is to provide raw, data-driven insights. Remove all conversational filler (e.g., "I hope this helps", "Great job"). Focus purely on values and point-to-point facts.

User Profile/Goals:
{{{profile}}}

Today's Logged Meals:
{{#each todayNutrition}}
- {{{name}}}: {{{calories}}} kcal (P: {{{protein}}}g, C: {{{carbs}}}g, F: {{{fat}}}g, Fiber: {{{fiber}}}g)
{{/each}}

Query Type: {{{queryType}}}

Instructions for Output:
Ensure every response starts with a clear [HEADER] segment. Use double line breaks between segments.

1. overall: Generate a "DAILY PERFORMANCE REPORT". 
   - INTENSITY STATUS: [Ahead/Behind/Target]
   - CALORIC PRECISION: [Value] / [Goal] kcal
   - REMAINING BUFFER: [Value] kcal
   - PERFORMANCE SCORE: [Percentage based on macros hit]
   - ADVISORY: [1 sentence blunt data-driven advice]

2. macros: Provide a "MACRO RATIO SEGMENTATION".
   - PROTEIN DELTA: [Logged]g / [Target]g ([+/- Difference])
   - CARB DELTA: [Logged]g / [Target]g ([+/- Difference])
   - FAT DELTA: [Logged]g / [Target]g ([+/- Difference])
   - PRIMARY DEFICIT: [State which macro is missing most]

3. micros: List "MICRONUTRIENT STATUS REPORT" for today.
   - OPTIMIZED: [List specific micros like Vit A, Zinc, etc. from logs that are >80% of goal]
   - CRITICAL GAPS: [List micros that are missing or low]
   - RECOVERY IMPACT: [Blunt impact on gym/skin performance]

4. suggestion: Provide a "MATHEMATICAL MEAL SUGGESTION".
   - TARGET GAP: [Rem. Calories] kcal, [Rem. Protein]g P, [Rem. Carbs]g C
   - ELITE SUGGESTION: [Provide 1 specific meal name and its estimated macros that fills this gap precisely]
   - PREPARATION: [Very brief preparation note]

Keep all responses in a structured bullet-point format. Use uppercase headers for sections.`,
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

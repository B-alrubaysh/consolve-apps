import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanClientInfo, cleanLang } from '../../shared/assessmentInput.ts';

// Public: generates the 10 diagnostic questions for the Smart Assessment.
// The prompt and output schema are fixed server-side; only company info is accepted.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const info = cleanClientInfo(body.client_info);
    const lang = cleanLang(body.lang);
    if (!info.company_name || !info.industry || !info.company_size) {
      return Response.json({ error: 'Company name, industry and size are required' }, { status: 400 });
    }

    const langInstruction = lang === 'ar'
      ? 'IMPORTANT: Generate ALL questions, options, and category names in Arabic language only.'
      : 'Generate all questions in English.';

    const prompt = `You are an expert business consultant conducting a diagnostic assessment.

${langInstruction}

Company Info:
- Name: ${info.company_name}
- Industry: ${info.industry}
- Size: ${info.company_size} employees
- Main Activity: ${info.main_activity || 'Not specified'}
- Key Challenges: ${info.key_challenges || 'Not specified'}

Generate exactly 10 progressive diagnostic questions covering:
- Operations & processes (Q1-2)
- Management & organizational structure (Q3-4)
- Governance & compliance (Q5-6)
- Financial health (Q7-8)
- Marketing & growth (Q9-10)

Tailor questions to the company's industry and size. Return ONLY valid JSON.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                type: { type: 'string', enum: ['multiple_choice', 'yes_no', 'text'] },
                options: { type: 'array', items: { type: 'string' } },
                category: { type: 'string' },
              },
            },
          },
        },
      },
    });

    return Response.json({ questions: (result?.questions || []).slice(0, 10) });
  } catch (error) {
    console.error('generateAssessmentQuestions error:', error?.message);
    return Response.json({ error: 'Could not generate questions' }, { status: 500 });
  }
}
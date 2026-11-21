import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanClientInfo, cleanAnswers, cleanLang } from '../../shared/assessmentInput.ts';

// Public: generates the Smart Assessment diagnosis from company info + answers.
// The prompt and output schema are fixed server-side.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const info = cleanClientInfo(body.client_info);
    const answers = cleanAnswers(body.answers);
    const lang = cleanLang(body.lang);
    if (!info.company_name || !info.industry || answers.length === 0) {
      return Response.json({ error: 'Company info and answers are required' }, { status: 400 });
    }

    const langInstruction = lang === 'ar'
      ? 'IMPORTANT: Write ALL text fields (business_snapshot, identified_problems, risk_assessment, root_causes, focus_areas, suggested_services) in Arabic language only.'
      : 'Write all text fields in English.';

    const prompt = `You are an expert business consultant. Analyze this company and provide a comprehensive diagnosis.

${langInstruction}

Company: ${info.company_name}
Industry: ${info.industry}
Size: ${info.company_size} employees
Activity: ${info.main_activity || 'N/A'}
Challenges: ${info.key_challenges || 'N/A'}

Assessment Q&A:
${answers.map((a, i) => `Q${i + 1} [${a.category}]: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Provide a thorough, specific, and actionable diagnosis.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          business_snapshot: { type: 'string' },
          identified_problems: { type: 'string' },
          risk_assessment: { type: 'string' },
          risk_level: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          maturity_level: { type: 'string', enum: ['Early Stage', 'Growing', 'Structured', 'Advanced'] },
          suggested_services: { type: 'array', items: { type: 'string' } },
          operational_score: { type: 'number' },
          financial_score: { type: 'number' },
          marketing_score: { type: 'number' },
          root_causes: { type: 'array', items: { type: 'string' } },
          focus_areas: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return Response.json({ diagnosis: result || {} });
  } catch (error) {
    console.error('generateAssessmentDiagnosis error:', error?.message);
    return Response.json({ error: 'Could not generate diagnosis' }, { status: 500 });
  }
}
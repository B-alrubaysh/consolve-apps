import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import t from "../../lib/translations";

export default function AssessmentStep2({ clientInfo, onNext, onBack, lang }) {
  const tx = t[lang];
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    const langInstruction = lang === "ar"
      ? "IMPORTANT: Generate ALL questions, options, and category names in Arabic language only."
      : "Generate all questions in English.";

    const prompt = `You are an expert business consultant conducting a diagnostic assessment.

${langInstruction}

Company Info:
- Name: ${clientInfo.company_name}
- Industry: ${clientInfo.industry}
- Size: ${clientInfo.company_size} employees
- Main Activity: ${clientInfo.main_activity || "Not specified"}
- Key Challenges: ${clientInfo.key_challenges || "Not specified"}

Generate exactly 10 progressive diagnostic questions covering:
- Operations & processes (Q1-2)
- Management & organizational structure (Q3-4)
- Governance & compliance (Q5-6)
- Financial health (Q7-8)
- Marketing & growth (Q9-10)

Tailor questions to the company's industry and size. Return ONLY valid JSON.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                type: { type: "string", enum: ["multiple_choice", "yes_no", "text"] },
                options: { type: "array", items: { type: "string" } },
                category: { type: "string" }
              }
            }
          }
        }
      }
    });

    setQuestions(result.questions || []);
    setLoading(false);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, { question: questions[currentQ].question, answer, category: questions[currentQ].category }];
    setAnswers(newAnswers);
    setTextInput("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onNext(newAnswers);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 text-center py-20">
        <div className="inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-8 py-6">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-foreground font-medium">{tx.assess_generating}</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center mb-8">
        <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
          {tx.assess_question_of(currentQ + 1, questions.length)}
        </p>
        <div className="w-full bg-muted rounded-full h-1.5 mb-6">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        {q.category && <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{q.category}</span>}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-snug">{q.question}</h3>

        {q.type === "multiple_choice" && q.options && (
          <RadioGroup onValueChange={(val) => handleAnswer(val)} className="space-y-3">
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value={opt} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="text-sm text-foreground cursor-pointer flex-1">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {q.type === "yes_no" && (
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => handleAnswer(tx.assess_yes)} className="flex-1 h-14 text-base rounded-xl hover:border-primary/30 hover:bg-primary/5">{tx.assess_yes}</Button>
            <Button variant="outline" onClick={() => handleAnswer(tx.assess_no)} className="flex-1 h-14 text-base rounded-xl hover:border-primary/30 hover:bg-primary/5">{tx.assess_no}</Button>
          </div>
        )}

        {q.type === "text" && (
          <div className="space-y-4">
            <Input value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="..." className="h-12" onKeyDown={(e) => { if (e.key === "Enter" && textInput.trim()) handleAnswer(textInput.trim()); }} />
            <Button onClick={() => handleAnswer(textInput.trim())} disabled={!textInput.trim()} className="bg-primary text-primary-foreground rounded-full px-8 h-12 font-semibold">
              {tx.assess_continue_btn}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">{tx.assess_back}</Button>
        <p className="text-xs text-muted-foreground self-center">{tx.assess_answered(answers.length, questions.length)}</p>
      </div>
    </div>
  );
}
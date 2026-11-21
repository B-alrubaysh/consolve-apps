import { useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { getAttribution } from "@/lib/attribution";

// Saves diagnosis progress: the first call creates the lead (with campaign
// attribution), later calls update it. Calls are queued so they never race.
export default function useLeadSaver() {
  const ref = useRef({ id: null, token: null, chain: Promise.resolve() });

  return useCallback((data) => {
    const r = ref.current;
    r.chain = r.chain
      .then(async () => {
        const payload = r.id ? data : { ...getAttribution(), ...data };
        const res = await base44.functions.invoke("saveDiagnosisLead", { id: r.id, token: r.token, data: payload });
        if (!r.id) { r.id = res.data.id; r.token = res.data.token; }
      })
      .catch((e) => console.warn("Diagnosis progress save failed:", e));
    return r.chain;
  }, []);
}
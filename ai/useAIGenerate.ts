import { useState } from "react";

type GenerateType =
  | "summary"
  | "experience_bullets"
  | "skills"
  | "project_description";

interface UseAIGenerateOptions {
  onChunk?: (text: string) => void;
  onDone?: (fullText: string) => void;
}

export function useAIGenerate(options: UseAIGenerateOptions = {}) {
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function generate(type: GenerateType, context: Record<string, string>) {
    setStreaming(true);
    setStreamedText("");
    setError(null);
    let full = "";

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });

      if (!res.ok) {
        throw new Error(`AI request failed: ${res.statusText}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamedText((prev) => prev + chunk);
        options.onChunk?.(chunk);
      }

      options.onDone?.(full);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI generation failed";
      setError(msg);
    } finally {
      setStreaming(false);
    }
  }

  function reset() {
    setStreamedText("");
    setError(null);
  }

  return { generate, streaming, streamedText, error, reset };
}

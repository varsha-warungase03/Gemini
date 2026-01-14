import { createContext, useState, useRef } from "react";
import { url } from "../key";
import { formatApiResponse } from "./format";

export const apiContext = createContext();

const ContextProvider = ({ children }) => {
  const [result, setResult] = useState([]);
  const [recentprompt, setRecentprompt] = useState("");
  const [prevprompt, setPrevprompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  // debounce reference
  const apiTimeoutRef = useRef(null);

  // typing animation
  const delaypara = (index, word, speed, isLast) => {
    setTimeout(() => {
      setResult((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (updated[lastIndex]?.type === "a") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: updated[lastIndex].text + word,
          };
        }
        return updated;
      });

      if (isLast) {
        setLoading(false);
      }
    }, speed * index);
  };

  const handleApi = (prompt, source = "new") => {
    // debounce to prevent spam
    clearTimeout(apiTimeoutRef.current);

    apiTimeoutRef.current = setTimeout(async () => {
      if (!prompt?.trim()) return;

      setLoading(true);
      setRecentprompt(prompt);

      if (source === "new") {
        setPrevprompt((prev) =>
          prev.includes(prompt) ? prev : [...prev, prompt]
        );
      }

      // add question + empty answer
      setResult((prev) => [
        ...prev,
        { type: "q", text: prompt },
        { type: "a", text: "" },
      ]);

      try {
        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
        };

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // handle rate limit / server errors
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        // SAFE GUARD (prevents crash)
        if (!data.candidates || !data.candidates.length) {
          throw new Error("No response from Gemini (quota or error)");
        }

        const rawText =
          data.candidates[0].content.parts[0].text || "";

        const cleanData = formatApiResponse(rawText);

        for (let i = 0; i < cleanData.length; i++) {
          delaypara(
            i,
            cleanData[i],
            10,
            i === cleanData.length - 1
          );
        }
      } catch (error) {
        console.error(error.message);

        setResult((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          if (updated[lastIndex]?.type === "a") {
            updated[lastIndex].text =
              "⚠️ Too many requests. Please wait and try again.";
          }
          return updated;
        });

        setLoading(false);
      }
    }, 800); // debounce delay
  };

  const value = {
    handleApi,
    loading,
    recentprompt,
    prevprompt,
    setRecentprompt,
    setPrevprompt,
    question,
    setQuestion,
    result,
    setResult,
  };

  return (
    <apiContext.Provider value={value}>
      {children}
    </apiContext.Provider>
  );
};

export default ContextProvider;

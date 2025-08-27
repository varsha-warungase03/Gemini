import { createContext, useState } from "react";
import { url } from "../key";
import { formatApiResponse } from "./format";

export const apiContext = createContext();

const ContextProvider = ({ children }) => {

    const [formattedAnswer, setFormattedAnswer] = useState("");
    const [result, setResult] = useState([]);
    const [recentprompt, setRecentprompt] = useState("");
    const [prevprompt, setPrevprompt] = useState([])
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");




    const delaypara = (index, nextword, speed) => {
        setTimeout(function () {
            setFormattedAnswer(prev => prev + nextword);
        }, speed * index)
    }

    const handleApi = async (prompt, source = "new") => {


        setFormattedAnswer("");
        let payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        try {
            setLoading(true);
            setRecentprompt(prompt);

            // setPrevprompt(prev => [...prev, question])

            if (source === "new") {
                // Only add if not already present
                setPrevprompt((prev) =>
                    prev.includes(prompt) ? prev : [...prev, prompt]
                );
            }

            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload)
            })

            response = await response.json();
            let rawtext = response.candidates[0].content.parts[0].text;
            let cleardata = formatApiResponse(rawtext);
            setLoading(false);


            const updatedResult = [
                ...result,
                { type: "q", text: prompt },
                { type: "a", text: cleardata },
            ];

            setResult(updatedResult);


            let speed = 10;
            for (let i = 0; i < cleardata.length; i++) {
                const nextword = cleardata[i];
                delaypara(i, nextword, speed);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    let value = {
        handleApi,
        formattedAnswer,
        loading,
        setLoading,
        recentprompt,
        prevprompt,
        setRecentprompt,
        setPrevprompt,
        question,
        setQuestion,
        result,
        setResult
    }

    return (
        <div>
            <apiContext.Provider value={value}>
                {children}
            </apiContext.Provider>
        </div>
    )

}

export default ContextProvider;
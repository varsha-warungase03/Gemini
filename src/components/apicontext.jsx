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




    const delaypara = (index, nextword, speed, isLast) => {
        // setTimeout(function () {
        //     setFormattedAnswer(prev => prev + nextword);
        // }, speed * index)

        setTimeout(() => {
            setResult((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                if (updated[lastIndex]?.type === "a") {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        text: updated[lastIndex].text + nextword,
                    };
                }
                return updated;

            });
            if (isLast) {
                setLoading(false);
            }
        }, speed * index);
    }



    const handleApi = async (prompt, source = "new") => {


        setFormattedAnswer("");
        setLoading(true);
        setRecentprompt(prompt);


        if (source === "new") {
            // Only add if not already present
            setPrevprompt((prev) =>
                prev.includes(prompt) ? prev : [...prev, prompt]
            );
        }

        // const updatedResult = [...result, { type: "q", text: prompt }, { type: "loading" }];
        // setResult(updatedResult);

        setResult(prev => [...prev, { type: "q", text: prompt }, { type: "a", text: "" }]);

        try {

            let payload = {
                contents: [{ parts: [{ text: prompt }] }]
            };

            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload)
            })

            response = await response.json();
            let rawtext = response.candidates[0].content.parts[0].text;
            let cleardata = formatApiResponse(rawtext);



            for (let i = 0; i < cleardata.length; i++) {
                delaypara(i, cleardata[i], 10, i === 0);
            }



            // const updatedResult = [
            //     ...result,
            //     { type: "q", text: prompt },
            //     { type: "a", text: cleardata },
            // ];
            // setResult(updatedResult);


            setTimeout(() => {
                setLoading(false);
            }, cleardata.length * 10 + 200);



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
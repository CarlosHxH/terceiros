"use client"
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { streamText } from 'ai';

async function main(prompt: string, onStream: (text: string) => void) {
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words " + prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });

    console.log('>',{response});
    
    const result = streamText({ model: 'gemini-2.0-flash', prompt: prompt });
    
    let fullResponse = "";
    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
        fullResponse += textPart + " ";
        console.log(textPart);
        
        onStream(fullResponse);
    }

    return "OK"// response.text
}

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const HomePage = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const aiMessageId = Date.now().toString() + "-ai";
            let fullResponse = "";

            await main(userMessage.content, (textPart) => {
                fullResponse = textPart;
                // Update the AI message as it streams in
                setMessages(prev => {
                    const existingAiMessage = prev.find(m => m.id === aiMessageId);
                    if (existingAiMessage) {
                        return prev.map(m =>
                            m.id === aiMessageId ? { ...m, content: fullResponse } : m
                        );
                    } else {
                        return [...prev, {
                            id: aiMessageId,
                            content: fullResponse,
                            sender: 'ai' as const,
                            timestamp: new Date()
                        }];
                    }
                });
            }).then(e => console.log(e));

        } catch (error) {
            console.error("Error fetching Gemini response:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + "-error",
                content: "Sorry, I encountered an error processing your request.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <svg width={22} height={22} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Gemini AI Chat
                    </h1>
                    <p className="text-sm opacity-80">Powered by Google Gemini 2.0 Flash</p>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 my-8">
                            <svg width={22} height={22} xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p>Send a message to start chatting with Gemini AI</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${message.sender === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {message.sender === 'ai' && (
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 mt-0.5">
                                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 bg-gray-100 text-gray-800">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1">
                                        <svg width={22} height={22} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div className="flex space-x-1">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg width={12} height={12} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Gemini may produce inaccurate information about people, places, or facts.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default HomePage;

/*
async function main(prompt:string) {
    const result = streamText({
        model: 'gemini-2.0-flash',
        prompt: prompt,
    });

    for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
    }

    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
    return await result.finishReason
}
main(prompt).then(e=>setResponse(e)).catch(console.error);
*/
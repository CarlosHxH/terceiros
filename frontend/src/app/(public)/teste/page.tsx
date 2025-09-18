"use client"
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

// Configuração do cliente AI
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "", // Você precisa configurar esta variável de ambiente
});

// Definição do contexto padrão para a IA
const DEFAULT_CONTEXT = "Você é um assistente útil e prestativo. Responda de forma clara e concisa.";

async function main(prompt: string, context: string, onStream: (text: string) => void) {
  try {
    // Combinar o contexto com o prompt do usuário
    const fullPrompt = `${context}\n\nPor favor, responda à seguinte solicitação: ${prompt}`;
    
    const result = await ai.models.generateContentStream({
      model: "gemini-1.5-flash", // Modelo atualizado para a versão disponível
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    let fullResponse = "";
    
    for await (const response of result) {
      const text = response.text;
      if (text) {
        fullResponse += text;
        onStream(fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Error in main function:", error);
    throw error;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Tipos de contexto pré-definidos
const CONTEXT_TYPES = {
  DEFAULT: "Padrão",
  TEACHER: "Professor",
  CODING: "Assistente de Programação",
  WRITING: "Assistente de Escrita",
  TRAVEL: "Assistente de Viagens",
  CUSTOM: "Personalizado"
};

const HomePage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(DEFAULT_CONTEXT);
  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedContextType, setSelectedContextType] = useState("DEFAULT");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Aplicar contexto pré-definido baseado na seleção
  useEffect(() => {
    switch(selectedContextType) {
      case "TEACHER":
        setContext("Você é um professor especializado em explicar conceitos complexos de forma simples e acessível. Use exemplos práticos e analogias para facilitar o entendimento.");
        break;
      case "CODING":
        setContext("Você é um assistente de programação especializado. Forneça exemplos de código, explique conceitos técnicos e ajude a resolver problemas de desenvolvimento. Formate o código de forma legível.");
        break;
      case "WRITING":
        setContext("Você é um editor e assistente de escrita. Ajude a melhorar textos, sugira vocabulário, corrija erros gramaticais e forneça feedback construtivo sobre a escrita.");
        break;
      case "TRAVEL":
        setContext("Você é um especialista em viagens. Forneça recomendações de destinos, dicas de hospedagem, sugestões de roteiros e informações sobre culturas locais.");
        break;
      case "CUSTOM":
        // Mantém o contexto personalizado atual
        break;
      default:
        setContext(DEFAULT_CONTEXT);
    }
  }, [selectedContextType]);

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
      
      // Adiciona mensagem vazia da AI para ser preenchida durante o streaming
      setMessages(prev => [...prev, {
        id: aiMessageId,
        content: "",
        sender: 'ai',
        timestamp: new Date()
      }]);

      await main(userMessage.content, context, (textPart) => {
        // Atualiza a mensagem da AI com o conteúdo recebido
        setMessages(prev => 
          prev.map(m => 
            m.id === aiMessageId 
              ? { ...m, content: textPart } 
              : m
          )
        );
      });

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

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[90vh]">
        {/* Header com botões de contexto */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <svg width={22} height={22} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Gemini AI Chat
            </h1>
            <p className="text-sm opacity-80">Powered by Google Gemini 1.5 Flash</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={clearChat}
              className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-lg text-sm transition-colors"
            >
              Limpar Chat
            </button>
            <button 
              onClick={() => setShowContextModal(true)}
              className="bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
            >
              <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurar Contexto
            </button>
          </div>
        </div>

        {/* Modal de configuração de contexto */}
        {showContextModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-indigo-800">Configurar Contexto da IA</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contexto:</label>
                <select 
                  value={selectedContextType}
                  onChange={(e) => setSelectedContextType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {Object.entries(CONTEXT_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruções Personalizadas:</label>
                <textarea
                  value={context}
                  onChange={(e) => {
                    setContext(e.target.value);
                    setSelectedContextType("CUSTOM");
                  }}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Digite instruções específicas para a IA seguir..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estas instruções serão enviadas junto com cada pergunta para orientar o comportamento da IA.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowContextModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowContextModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Aplicar Contexto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 my-8">
              <svg width={22} height={22} xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>Send a message to start chatting with Gemini AI</p>
              <p className="text-sm mt-2">Contexto atual: {CONTEXT_TYPES[selectedContextType as keyof typeof CONTEXT_TYPES]}</p>
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
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Gemini may produce inaccurate information about people, places, or facts.
            </p>
            <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              Modo: {CONTEXT_TYPES[selectedContextType as keyof typeof CONTEXT_TYPES]}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
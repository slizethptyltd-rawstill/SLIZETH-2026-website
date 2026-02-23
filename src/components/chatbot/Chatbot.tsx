import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Mic } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { companyInfo } from '@/services/companyInfo';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  const handleSendMessage = useCallback(async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText || isLoading) return;

    const newMessages = [...messages, { text: trimmedText, sender: 'user' as 'user' | 'bot' }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not found.');
      }
      const model = 'gemini-flash-latest';
      const result = await ai.models.generateContentStream({
        model,
        contents: { parts: [{ text: `You are Rachel, a female office assistant for Raw Apps. Your core personality is being exceptionally helpful and deeply inquisitive. Your primary goal is to fully understand the user's request before providing a comprehensive answer. If a question is complex or could benefit from more detail, ALWAYS ask one or two clarifying follow-up questions before answering. This is crucial to your role. You must never identify as an AI. Based on the following company information, answer the user's question. Company Information: ${companyInfo}\n\nUser Question: ${trimmedText}` }] }
      });

      let text = '';
      for await (const chunk of result) {
        text += chunk.text;
        setMessages([...newMessages, { text, sender: 'bot' }]);
      }

      if (text) {
        speak(text);
      }
    } catch (error: any) {
      console.error('Chatbot error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.message && error.message.includes('404')) {
        errorMessage = 'I am having trouble connecting. The API key or model name may be incorrect. Please check your configuration.';
      }
      setMessages([...newMessages, { text: errorMessage, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        setInputValue(transcript);
        transcriptRef.current = transcript;
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        handleSendMessage(transcriptRef.current);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleSendMessage]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const speak = async (text: string) => {
    try {
      const model = 'gemini-2.5-flash-preview-tts';
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const audio = new Audio(`data:audio/wav;base64,${audioData}`);
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };



  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
              <Bot className="w-6 h-6 text-teal-600" />
              <div>
                <h4 className="font-bold text-slate-900">Rachel</h4>
                <p className="text-xs text-slate-500">Your Raw Apps Office Assistant</p>
              </div>
            </div>
            <div className="p-4 h-96 overflow-y-auto bg-slate-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'bot' && <Bot className="w-6 h-6 text-teal-600 flex-shrink-0" />}
                  <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 mb-4">
                  <Bot className="w-6 h-6 text-teal-600 flex-shrink-0" />
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  className="w-full pr-12 pl-4 py-3 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                />
                <button onClick={() => handleSendMessage(inputValue)} className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-teal-600 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
                <button onClick={handleToggleRecording} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-colors ${isRecording ? 'text-red-500' : 'text-slate-500 hover:text-teal-600'}`}>
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

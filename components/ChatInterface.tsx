import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessage, resetSession } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  Send, Bot, User, Loader2, Sparkles, Plane, Briefcase, MapPin, 
  Users, Building, Wallet, Calendar, ArrowRight, Settings2, Globe, Search 
} from 'lucide-react';

const ChatInterface: React.FC = () => {
  // Config State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [tripDetails, setTripDetails] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    accommodation: 'Hotel',
    budget: ''
  });

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "# Edwin AI Initialization Complete\n\nI am ready to process your travel parameters. Please confirm the details in the dashboard to begin the financial analysis of your trip.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isConfiguring]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I apologize, but I encountered a critical error in my calculation engine. Please retry your request.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startAnalysis = () => {
    if (!tripDetails.origin || !tripDetails.destination || !tripDetails.startDate) return;
    setIsConfiguring(false);
    
    // Reset session to prevent stale context/links from previous queries
    resetSession();

    // Construct a professional prompt based on the form data
    const currentYear = new Date().getFullYear();
    const datesString = tripDetails.endDate 
      ? `del ${tripDetails.startDate} al ${tripDetails.endDate}` 
      : `a partir del ${tripDetails.startDate}`;

    const prompt = `**Misión de Viaje Confirmada** ✈️

*   **Origen:** ${tripDetails.origin}
*   **Destino:** ${tripDetails.destination}
*   **Fechas:** ${datesString}
*   **Viajeros:** ${tripDetails.travelers}
*   **Alojamiento Preferido:** ${tripDetails.accommodation}
*   **Presupuesto Base:** ${tripDetails.budget ? `$${tripDetails.budget}` : 'No especificado'}

Por favor, inicia el análisis de opciones para maximizar mi presupuesto y sugiere el mejor itinerario con vuelos de ida y vuelta.`;
    
    setMessages([]); // Start fresh visually
    handleSend(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to ensure input fields are visible with light icon color
  const dateInputClass = "w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]";

  return (
    <div className="flex flex-col h-full bg-dark-950 relative overflow-hidden text-slate-200 font-sans">
        {/* Animated Background Elements */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Header */}
        <header className="absolute top-0 w-full glass z-30 px-6 py-4 flex items-center justify-between border-b border-white/5 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => setIsConfiguring(true)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 flex items-center justify-center text-white shadow-xl relative z-10">
                      <Briefcase size={20} className="text-blue-400" />
                  </div>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        Edwin AI <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold tracking-wider">PRO</span>
                    </h1>
                    <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Financial Travel Consultant</p>
                </div>
            </div>
            
            {!isConfiguring && (
              <button 
                onClick={() => setIsConfiguring(true)}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
              >
                <Settings2 size={14} />
                <span className="hidden sm:inline">Parametros de Viaje</span>
              </button>
            )}
        </header>

        {/* Configuration Dashboard Overlay */}
        {isConfiguring && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
             <div className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col relative my-auto">
                {/* Decorative top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                      <Globe className="text-blue-400" size={24}/>
                      Configuración de Misión
                    </h2>
                    <p className="text-slate-400 text-sm">Define los parámetros estratégicos para tu próximo viaje.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Origin */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Origen</label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="Ciudad de salida (ej. Madrid)" 
                          value={tripDetails.origin}
                          onChange={(e) => setTripDetails({...tripDetails, origin: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Destino</label>
                      <div className="relative group">
                        <Plane className="absolute left-3 top-3 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="Ciudad de destino (ej. Tokyo)" 
                          value={tripDetails.destination}
                          onChange={(e) => setTripDetails({...tripDetails, destination: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Dates - Split into Start and End */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Fechas de Viaje</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <Calendar className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                          <input 
                            type="date" 
                            value={tripDetails.startDate}
                            onChange={(e) => setTripDetails({...tripDetails, startDate: e.target.value})}
                            className={dateInputClass}
                          />
                          <span className="absolute -top-5 left-1 text-[10px] text-slate-500">Ida</span>
                        </div>
                        <div className="relative group">
                           <Calendar className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                           <input 
                            type="date" 
                            value={tripDetails.endDate}
                            min={tripDetails.startDate}
                            onChange={(e) => setTripDetails({...tripDetails, endDate: e.target.value})}
                            className={dateInputClass}
                          />
                          <span className="absolute -top-5 left-1 text-[10px] text-slate-500">Vuelta</span>
                        </div>
                      </div>
                    </div>

                    {/* Travelers */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Viajeros</label>
                      <div className="relative group">
                        <Users className="absolute left-3 top-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input 
                          type="number" 
                          min="1"
                          value={tripDetails.travelers}
                          onChange={(e) => setTripDetails({...tripDetails, travelers: parseInt(e.target.value) || 1})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Accommodation Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Alojamiento</label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-3 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <select 
                          value={tripDetails.accommodation}
                          onChange={(e) => setTripDetails({...tripDetails, accommodation: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option>Hotel</option>
                          <option>Airbnb / Casa</option>
                          <option>Apartamento</option>
                          <option>Hostal</option>
                          <option>Resort</option>
                          <option>Villa de Lujo</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">▼</div>
                      </div>
                    </div>

                     {/* Budget */}
                     <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Presupuesto Base</label>
                      <div className="relative group">
                        <Wallet className="absolute left-3 top-3 text-slate-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
                        <input 
                          type="number" 
                          placeholder="ej. 2000" 
                          value={tripDetails.budget}
                          onChange={(e) => setTripDetails({...tripDetails, budget: e.target.value})}
                          className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                        />
                        <span className="absolute right-4 top-2.5 text-slate-500 text-sm font-medium">USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={startAnalysis}
                      disabled={!tripDetails.origin || !tripDetails.destination || !tripDetails.startDate}
                      className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                      <span className="flex items-center gap-2">
                        Iniciar Análisis
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-6 space-y-8 scrollbar-hide z-10">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex gap-4 max-w-4xl mx-auto animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg mt-1 border ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 border-slate-700 text-slate-300' 
                        : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent text-white'
                    }`}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[90%] sm:max-w-[85%]`}>
                        <div className={`rounded-2xl px-6 py-5 shadow-xl backdrop-blur-md ${
                            msg.role === 'user'
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 text-slate-100 rounded-tr-sm'
                            : msg.isError 
                                ? 'bg-red-900/20 border border-red-500/30 text-red-200 rounded-tl-sm'
                                : 'glass text-slate-200 rounded-tl-sm'
                        }`}>
                           {msg.role === 'user' ? (
                               <div className="text-sm">
                                 <MarkdownRenderer content={msg.content} />
                               </div>
                           ) : (
                               <MarkdownRenderer content={msg.content} />
                           )}
                        </div>
                        <span className={`text-[10px] mt-2 px-1 text-slate-500 font-mono ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex gap-4 max-w-4xl mx-auto animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg border border-transparent text-white">
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                    <div className="glass rounded-2xl px-6 py-5 rounded-tl-sm flex items-center gap-3">
                        <span className="text-xs text-blue-300 font-mono tracking-wide uppercase">Processing Financial Models</span>
                         <div className="flex space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area (Only visible when not configuring) */}
        {!isConfiguring && (
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-dark-950 via-dark-950/90 to-transparent z-20">
              <div className="max-w-4xl mx-auto relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-end gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
                      <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ajusta los parámetros o haz una pregunta específica..."
                          className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-sm px-4 py-3 focus:outline-none resize-none min-h-[56px] max-h-[120px] scrollbar-hide"
                          rows={1}
                      />
                      <button 
                          onClick={() => handleSend()}
                          disabled={!inputText.trim() || isLoading}
                          className="mb-1 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                      >
                          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      </button>
                  </div>
              </div>
              <div className="text-center mt-3">
                  <p className="text-[10px] text-slate-500 font-mono">
                      Powered by Gemini 3 Pro • <span className="text-blue-500/70">Real-time Financial Data Simulation</span>
                  </p>
              </div>
          </div>
        )}
    </div>
  );
};

export default ChatInterface;

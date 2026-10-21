import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
  Flame,
  Droplets,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_RESTAURANTS } from '../data/mockData';
import { Dish } from '../types';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionType?: 'view-dish' | 'filter-diet' | 'none';
  actionData?: any;
}

interface AiVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: Dish) => void;
}

export const AiVoiceAssistant: React.FC<AiVoiceAssistantProps> = ({
  isOpen,
  onClose,
  onSelectDish
}) => {
  const { speak, isSpeaking, stopSpeaking } = useAccessibility();
  const { profile, hasAllergenConflict } = useCartAndOrder();
  const { t, currentLanguage } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! I am your AI Dietary Concierge. I can help you find allergen-safe Indian food, explain cooking oils and A2 Desi Ghee, or customize dishes for Jain, Celiac, or Vegan diets. How can I assist you today?',
      timestamp: 'Just now',
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening]);

  if (!isOpen) return null;

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  // AI Knowledge Engine for Indian Food & Allergens
  const generateAiResponse = (query: string): { reply: string; actionType?: 'view-dish'; actionData?: Dish } => {
    const q = query.toLowerCase();

    // 1. Celiac / Gluten-Free
    if (q.includes('gluten') || q.includes('celiac') || q.includes('wheat') || q.includes('hing')) {
      const dalBukhara = MOCK_RESTAURANTS[0].dishes[0];
      return {
        reply: 'For Celiac or Gluten sensitivity, I highly recommend our 100% naturally gluten-free stone-ground Red Rice Masala Dosa, Kanchipuram Pepper Idlis, and Slow-Simmered Dal Bukhara. Important note: We verify that all Hing (asafoetida) used in our certified rasois is 100% pure crystal gum without wheat maida.',
        actionType: 'view-dish',
        actionData: dalBukhara
      };
    }

    // 2. Jain / Satvik (No Onion, No Garlic)
    if (q.includes('jain') || q.includes('satvik') || q.includes('onion') || q.includes('garlic')) {
      const dosa = MOCK_RESTAURANTS[1].dishes[0];
      return {
        reply: 'We offer dedicated Jain Satvik preparations cooked in segregated handis with zero onion, garlic, or root vegetables. You can order the Ragi & Red Rice Dosa with Raw Banana (Kele) Masala, Kanchipuram Idlis, or Dal Bukhara prepared in a dedicated Jain pot.',
        actionType: 'view-dish',
        actionData: dosa
      };
    }

    // 3. Dairy-Free / Vegan / Lactose
    if (q.includes('dairy') || q.includes('vegan') || q.includes('lactose') || q.includes('ghee free') || q.includes('milk')) {
      const idli = MOCK_RESTAURANTS[1].dishes[1];
      return {
        reply: 'For a strict dairy-free or vegan diet, Steamed Kanchipuram Pepper Idlis and Bajra Methi Khichdi are 100% dairy-free by default. For curries like Dal Bukhara or Shahi Paneer, you can swap A2 Ghee with cold-pressed coconut or olive oil at ₹0 charge!',
        actionType: 'view-dish',
        actionData: idli
      };
    }

    // 4. Cashew / Almond / Nut allergy
    if (q.includes('nut') || q.includes('cashew') || q.includes('kaju') || q.includes('badam') || q.includes('peanut')) {
      const paneer = MOCK_RESTAURANTS[0].dishes[1];
      return {
        reply: 'Most creamy Indian gravies use cashew paste, which is dangerous for nut allergies. However, our Dum Pukht Shahi Paneer is specially prepared with watermelon seed (magaz) paste rather than cashews! Furthermore, Dakshin Sattva is a 100% peanut-free facility.',
        actionType: 'view-dish',
        actionData: paneer
      };
    }

    // 5. Protein rich
    if (q.includes('protein') || q.includes('gym') || q.includes('muscle')) {
      const chaap = MOCK_RESTAURANTS[2].dishes[0];
      return {
        reply: 'Our highest protein Indian options are the Tandoori Afghani Malai Soya Chaap (24g protein), Dum Pukht Shahi Paneer (21g protein), and 24-hr Slow-Simmered Dal Bukhara (16g plant protein).',
        actionType: 'view-dish',
        actionData: chaap
      };
    }

    // 6. Cooking Oils & Fats
    if (q.includes('oil') || q.includes('ghee') || q.includes('fat') || q.includes('seed oil') || q.includes('palm')) {
      return {
        reply: 'Our partner rasois operate under strict fat transparency: 100% Vedic A2 Gir Cow Bilona Ghee, Kachi Ghani Mustard Oil, or Cold-Pressed Coconut Oil. We strictly ban commercial palm oil, hydrogenated vegetable fats, and Dalda.'
      };
    }

    // 7. Cheap / Under ₹200
    if (q.includes('under 200') || q.includes('cheap') || q.includes('budget') || q.includes('low cost')) {
      const idli = MOCK_RESTAURANTS[1].dishes[1];
      return {
        reply: 'Under ₹200, you can enjoy Steamed Kanchipuram Pepper Idlis for ₹150 (Set of 3) or Crispy Ragi & Red Rice Masala Dosa for ₹180. Both are healthy, allergen-friendly, and cooked with pure cold-pressed oils.',
        actionType: 'view-dish',
        actionData: idli
      };
    }

    // 8. General fallback
    return {
      reply: `I can help customize any dish for your specific dietary needs. With your current allergen shield (${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'no active restrictions'}), all conflicting dishes will automatically be flagged. Would you like me to recommend dishes from a specific rasoi?`
    };
  };

  const handleSendQuery = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');

    // Generate response
    setTimeout(() => {
      const { reply, actionType, actionData } = generateAiResponse(query);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
        actionType,
        actionData
      };
      setMessages(prev => [...prev, aiMessage]);

      // Speak back response
      speak(reply);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-chat-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl flex flex-col h-[650px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-amber-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-chat-title" className="font-extrabold text-base sm:text-lg">
                  Clarity AI Dietary Assistant
                </h2>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Voice Enabled
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Ask about ingredients, Celiac/Jain options, cooking oils, or prices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                aria-label="Stop audio response"
                className="p-2 text-rose-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close AI assistant"
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors touch-target-accessible"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Try:</span>
          {[
            'Gluten & Celiac Safe',
            'Jain Satvik (No Onion/Garlic)',
            'Dairy-Free & Vegan',
            'High Protein Options',
            'Explain Cooking Oils',
            'Dishes under ₹200'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap text-xs font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {/* 1-Click Interactive Action Button */}
                {msg.actionType === 'view-dish' && msg.actionData && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectDish(msg.actionData);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
                    >
                      <span>Inspect {msg.actionData.name} (₹{msg.actionData.price})</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>AI Assistant</span>
                    <button
                      onClick={() => speak(msg.text)}
                      aria-label="Read this response aloud"
                      className="hover:text-amber-600 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-1 text-slate-700 dark:text-slate-200 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Active Listening Soundwave Indicator */}
          {isListening && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center gap-3 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Listening to your voice... Speak your dietary question now.
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice & Send */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              className={`p-3 rounded-2xl transition-all touch-target-accessible ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-300 animate-bounce'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-600'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask: 'Which dishes have zero dairy?', 'Find Jain food'..."
              aria-label="Dietary query for AI assistant"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:border-amber-600 focus:ring-0"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              aria-label="Send query"
              className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-all touch-target-accessible"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

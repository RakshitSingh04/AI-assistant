import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, Zap } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today? ✨",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const aiResponses = [
  //   "That's a great question! Let me think about that for you. 🤔",
  //   "I'd be happy to help you with that! Here's what I think... 💡",
  //   "Interesting perspective! From my analysis, I would suggest... 🔍",
  //   "That's a fascinating topic! Based on my knowledge... 🧠",
  //   "I understand what you're asking. Here's my take on it... ✨",
  //   "Let me process that for you... I believe the answer is... 🚀",
  //   "Great minds think alike! I was just considering that myself... 💭",
  //   "You've touched on something important there. In my experience... 🎯"
  // ];
  const getAIResponse = async (input) => {
          const response = await axios.post('https://ai-assistant-rk1v.onrender.com/api/chat/generate', { input });
          console.log('AI Response:', response.data);
          const responses = response.data;
          // console.log('AI Responses:', responses);
          return responses;
  };

  // const getRandomResponse = () => {
  //   return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  // };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    // console.log(' ai:',getAIResponse(inputText) );
    // Simulate AI thinking time
    setTimeout(async() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: await getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000); // 1-3 seconds delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-sm text-gray-500">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium hidden sm:block">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-fade-in ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-400 to-blue-400'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="w-4 h-4 text-white" /> : 
                    <Bot className="w-4 h-4 text-white" />
                  }
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                message.sender === 'user' ? 'ml-auto' : 'mr-auto'
              }`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... ✨"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-gray-50/50"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['Hello', 'Help me with...', 'What can you do?', 'Tell me a joke'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col space-y-2 sm:hidden">
        <button className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
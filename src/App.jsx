import React, { useState, useEffect, useRef } from "react";
const ChatBot = () => {
  const [messages, setMessages] = useState([
    { botReply: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [botJumping, setBotJumping] = useState(true);
  const messagesEndRef = useRef(null);
  const botRef = useRef(null);

  // Jumping bot animation
  useEffect(() => {
    if (!botRef.current || !botJumping) return;

    const jump = () => {
      botRef.current.style.transform = "translateY(-20px)";
      setTimeout(() => {
        botRef.current.style.transform = "translateY(0)";
      }, 300);
    };

    const jumpInterval = setInterval(jump, 3000);

    return () => {
      clearInterval(jumpInterval);
    };
  }, [botJumping]);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    // Add user message
    setMessages((prev) => [...prev, { userMessage: input.trim() }]);
    const userInput = input;
    setInput("");
    setIsSending(true);
    setBotJumping(false); // Stop jumping when thinking

    try {
      // Call your API endpoint
      const res = await fetch("https://chatbot-xy2i.onrender.com/api/Chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          body:JSON.stringify({ UserMessage: userInput}),
        },
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();
      const botReply =
        data?.botReply ||
        data?.data?.botReply ||
        "I didn't quite get that. Could you rephrase?";

      setMessages((prev) => [...prev, { botReply }]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          botReply:
            "Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsSending(false);
      setBotJumping(true); // Resume jumping animation
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-visible flex flex-col md:flex-row max-h-[90vh] md:h-[80vh]">
        {/* Left side - Jumping bot */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-indigo-500 to-purple-600 flex flex-col items-center justify-between p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white"></div>
          </div>

          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold text-white mb-2">AI Assistant</h2>
            <p className="text-indigo-200">Powered by ZID</p>
          </div>

          <div
            ref={botRef}
            className="relative transition-transform duration-300 ease-in-out"
          >
            <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-5xl">🤖</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSending ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                }`}
              ></div>
              <span className="text-indigo-100">
                {isSending ? "Thinking..." : "Online"}
              </span>
            </div>
            <p className="text-indigo-200 text-sm">
              Ready to answer your questions 24/7
            </p>
          </div>
        </div>

        {/* Right side - Chat interface */}
        <div className="w-full md:w-2/3 flex flex-col ">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center relative overflow-visible">
            {/* <h1 className="text-xl font-bold">Chat with AI Assistant</h1> */}
            <h1 className="text-xl font-bold flex items-center space-x-2">
  <span>Chat with AI Assistant</span>
  <span className="animate-jump text-2xl">🤖</span>
</h1>
            <div className="ml-auto flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
          </div>

          {/* <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-white to-indigo-50 custom-scrollbar"> */}
          <div className="flex-grow overflow-y-auto max-h-[70vh] md:max-h-full p-4 bg-gradient-to-b from-white to-indigo-50 custom-scrollbar">
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                {msg.userMessage && (
                  <div className="flex justify-end mb-3 animate-fade-in-right">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-none max-w-xs md:max-w-md shadow-md">
                      {msg.userMessage}
                    </div>
                  </div>
                )}

                {msg.botReply && (
                  <div className="flex mb-3 animate-fade-in-left">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none max-w-xs md:max-w-md shadow-md">
                      {msg.botReply}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {isSending && (
              <div className="flex mb-3 animate-pulse">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                className={`flex-grow px-4 py-3 rounded-l-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isSending
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 focus:ring-purple-500 focus:border-transparent"
                }`}
              />
              <button
                onClick={sendMessage}
                disabled={isSending || !input.trim()}
                className={`px-4 py-3 rounded-r-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                  input.trim() && !isSending
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-purple-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.3s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.3s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 0.8s infinite;
        }
           @keyframes jump {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .animate-jump {
    animation: jump 1s infinite;
    display: inline-block;
  }
      `}</style>
     
    </div>
  );
};

export default ChatBot;

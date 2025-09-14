import React, { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import UserSetup from './components/UserSetup';
import ChatInterface from './components/ChatInterface';
import CodingLoadingScreen from './components/CodingLoadingScreen';
import CodingTerminal from './components/CodingTerminal';

type AppState = 'landing' | 'loading' | 'setup' | 'chat' | 'coding-loading' | 'coding';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [username, setUsername] = useState('');
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const fullText = 'Claude AGI';
  
  useEffect(() => {
    // Start the animation after a brief delay
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showText) {
      let index = 0;
      const typewriter = setInterval(() => {
        if (index < fullText.length) {
          setCurrentText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typewriter);
        }
      }, 150);

      return () => clearInterval(typewriter);
    }
  }, [showText, fullText]);

  const handleChallengeClick = () => {
    setAppState('loading');
  };

  const handleCodeWithClaudeClick = () => {
    setAppState('coding-loading');
  };

  const handleCodingLoadingComplete = () => {
    setAppState('coding');
  };

  const handleLoadingComplete = () => {
    setAppState('setup');
  };

  const handleSetupComplete = (name: string, profilePic: string | null) => {
    setUsername(name);
    setUserProfilePic(profilePic);
    setAppState('chat');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setUsername('');
    setUserProfilePic(null);
  };

  if (appState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (appState === 'coding-loading') {
    return <CodingLoadingScreen onComplete={handleCodingLoadingComplete} />;
  }

  if (appState === 'coding') {
    return <CodingTerminal onBack={handleBackToLanding} />;
  }

  if (appState === 'setup') {
    return <UserSetup onComplete={handleSetupComplete} onBack={handleBackToLanding} />;
  }

  if (appState === 'chat') {
    return (
      <ChatInterface 
        username={username}
        userProfilePic={userProfilePic}
        onBack={handleBackToLanding}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background GIF */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="/Adobe Express - claude agi (1).gif" 
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end items-center h-screen pb-16 px-4">
        {/* Gradient overlay for text area */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Animated text container */}
        <div className="text-center relative z-20">
          <h1 
            className={`text-6xl md:text-8xl font-bold text-white tracking-wider transition-all duration-1000 transform ${
              showText 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {currentText}
            <span 
              className={`inline-block w-1 h-16 md:h-20 ml-2 bg-blue-400 transition-opacity duration-500 ${
                currentText.length === fullText.length ? 'opacity-0' : 'opacity-100 animate-pulse'
              }`}
            ></span>
          </h1>
          
          {/* Subtitle that appears after main text */}
          <div 
            className={`mt-6 transition-all duration-1000 delay-1000 transform ${
              currentText.length === fullText.length
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
              The Future is Here
            </p>
            
            {/* Additional text with gap */}
            <div className="mt-8">
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                Claude says true AGI cannot exist. So we turned Claude into AGI. How moronically ironic...
              </p>
            </div>
            
            {/* Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleChallengeClick}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Challenge Claude
              </button>
              <button 
                onClick={handleCodeWithClaudeClick}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Code With Claude
              </button>
              <button className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25">
                Gitbook
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { Terminal, Code, Zap } from 'lucide-react';

interface CodingLoadingScreenProps {
  onComplete: () => void;
}

const CodingLoadingScreen: React.FC<CodingLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200); // Small delay before transitioning
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background GIF */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="/Adobe Express - claude agi (1).gif" 
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-screen px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
            Claude Co-pilot Terminal
          </h1>
          <p className="text-xl text-gray-300">Preparing your AI-powered coding environment</p>
        </div>
        
        {/* Loading Bar */}
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="text-center text-gray-400">
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* Status Messages */}
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-lg">
            {progress < 30 && "Initializing Claude Co-pilot..."}
            {progress >= 30 && progress < 60 && "Loading development environment..."}
            {progress >= 60 && progress < 90 && "Preparing coding workspace..."}
            {progress >= 90 && "Ready to code..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodingLoadingScreen;
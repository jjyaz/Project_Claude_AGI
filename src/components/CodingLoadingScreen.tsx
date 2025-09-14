import React, { useEffect, useState } from 'react';
import { Terminal, Code, Zap } from 'lucide-react';

interface CodingLoadingScreenProps {
  onComplete: () => void;
}

const CodingLoadingScreen: React.FC<CodingLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing Claude Co-pilot...",
    "Loading development environment...",
    "Preparing coding workspace...",
    "Activating AI assistance...",
    "Ready to code!"
  ];

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-screen px-4">
        {/* Main Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 animate-pulse">
            <Terminal className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">
            Claude Co-pilot Terminal
          </h1>
          <p className="text-xl text-gray-300">Preparing your AI-powered coding environment</p>
        </div>
        
        {/* Loading Bar */}
        <div className="w-full max-w-md mb-8">
          <div className="bg-gray-800 rounded-full h-4 mb-4 overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white opacity-60 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>{Math.round(progress)}%</span>
            <span>Initializing...</span>
          </div>
        </div>
        
        {/* Status Messages */}
        <div className="text-center min-h-[60px] flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 text-lg font-medium">
              {steps[currentStep]}
            </p>
          </div>
        </div>
        
        {/* Feature Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="text-center p-4 bg-gray-800 bg-opacity-30 rounded-lg backdrop-blur-sm">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">AI-Powered Suggestions</p>
          </div>
          <div className="text-center p-4 bg-gray-800 bg-opacity-30 rounded-lg backdrop-blur-sm">
            <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Smart Code Generation</p>
          </div>
          <div className="text-center p-4 bg-gray-800 bg-opacity-30 rounded-lg backdrop-blur-sm">
            <Terminal className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Interactive Terminal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingLoadingScreen;
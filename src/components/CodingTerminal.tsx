import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Terminal, Gamepad2, Globe, Brain, Send, Play, FileDown, Download, Settings, Upload, ChevronDown, ChevronRight, Eye, Code } from 'lucide-react';

interface CodingTerminalProps {
  onBack: () => void;
}

type BuildMode = 'game' | 'website' | 'ai';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'claude' | 'system';
  content: string;
  timestamp: Date;
}

const CodingTerminal: React.FC<CodingTerminalProps> = ({ onBack }) => {
  const [selectedMode, setSelectedMode] = useState<BuildMode | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const modes = {
    game: {
      icon: Gamepad2,
      title: 'Game Build',
      description: 'Create interactive games with modern frameworks',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      examples: ['2D Platformer', 'Puzzle Game', 'RPG Adventure', 'Arcade Shooter']
    },
    website: {
      icon: Globe,
      title: 'Website Build',
      description: 'Build responsive web applications',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-500',
      examples: ['E-commerce Site', 'Portfolio', 'Blog Platform', 'Dashboard']
    },
    ai: {
      icon: Brain,
      title: 'AI Build',
      description: 'Develop AI-powered applications',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500',
      examples: ['Chatbot', 'Image Generator', 'Data Analyzer', 'ML Model']
    }
  };

  useEffect(() => {
    if (selectedMode) {
      const welcomeMessages = [
        {
          id: '1',
          type: 'system' as const,
          content: `🚀 Claude Co-pilot activated for ${modes[selectedMode].title} mode${projectName ? ` - ${projectName}` : ''}`,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'claude' as const,
          content: `Hello! I'm your coding co-pilot. I'll guide you through building your ${selectedMode === 'game' ? 'game' : selectedMode === 'website' ? 'website' : 'AI application'}${projectName ? ` "${projectName}"` : ''}. What would you like to create today?`,
          timestamp: new Date()
        }
      ];
      setTerminalLines(welcomeMessages);
    }
  }, [selectedMode, projectName]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const generateClaudeResponse = (command: string, mode: BuildMode): string => {
    const responses = {
      game: [
        "Great choice! For game development, I recommend starting with a simple game loop. Let's set up the canvas and basic player movement first.",
        "Excellent! Game physics can be tricky. I'll help you implement collision detection and smooth animations step by step.",
        "Perfect! Let's create engaging gameplay mechanics. We'll start with the core game logic and then add visual polish.",
        "Smart approach! For this game type, we'll need to handle user input efficiently. Let me show you the best practices."
      ],
      website: [
        "Fantastic! For web development, let's start with a solid foundation using modern React patterns and responsive design.",
        "Great idea! I'll help you structure your components for maximum reusability and maintainability.",
        "Perfect choice! Let's implement this feature with accessibility in mind and smooth user interactions.",
        "Excellent! For this website, we'll focus on performance optimization and SEO best practices."
      ],
      ai: [
        "Brilliant! AI development requires careful planning. Let's start by defining your model architecture and data flow.",
        "Great concept! I'll guide you through implementing the neural network layers and training pipeline.",
        "Perfect! For this AI application, we'll need to handle data preprocessing and model inference efficiently.",
        "Excellent choice! Let's build this AI feature with proper error handling and scalable architecture."
      ]
    };

    const modeResponses = responses[mode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim() || !selectedMode) return;

    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: currentCommand,
      timestamp: new Date()
    };

    setTerminalLines(prev => [...prev, commandLine]);
    setCurrentCommand('');
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: 'output',
        content: `✓ Executing: ${currentCommand}`,
        timestamp: new Date()
      };

      const claudeResponse: TerminalLine = {
        id: (Date.now() + 2).toString(),
        type: 'claude',
        content: generateClaudeResponse(currentCommand, selectedMode),
        timestamp: new Date()
      };

      setTerminalLines(prev => [...prev, outputLine, claudeResponse]);
      setIsProcessing(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Add file upload message to terminal
      const uploadLine: TerminalLine = {
        id: Date.now().toString(),
        type: 'system',
        content: `📁 File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        timestamp: new Date()
      };
      
      const claudeResponse: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: 'claude',
        content: `Great! I can see you've uploaded "${file.name}". I can help you integrate this ${file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file'} into your project. What would you like to do with it?`,
        timestamp: new Date()
      };
      
      setTerminalLines(prev => [...prev, uploadLine, claudeResponse]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportCode = () => {
    // Generate HTML content based on the project
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName || 'My Project'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .feature {
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${projectName || 'My Project'}</h1>
        <div class="feature">
            <h3>Project Type: ${modes[selectedMode].title}</h3>
            <p>${modes[selectedMode].description}</p>
        </div>
        <div class="feature">
            <h3>Generated with Claude AGI</h3>
            <p>This project was created using Claude Co-pilot Terminal.</p>
        </div>
        <div class="feature">
            <h3>Ready for Development</h3>
            <p>Your project structure is ready. Continue building with your favorite tools!</p>
        </div>
    </div>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'my-project'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Add export message to terminal
    const exportLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'system',
      content: `📁 Project exported as ${projectName || 'my-project'}.html`,
      timestamp: new Date()
    };
    
    setTerminalLines(prev => [...prev, exportLine]);
  };

  const updatePreview = () => {
    // Generate preview content based on project type and commands
    const previewHtml = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; margin-bottom: 20px;">${projectName || 'My Project'} Preview</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #667eea; margin-top: 0;">Project Type: ${modes[selectedMode].title}</h3>
          <p style="color: #666; margin-bottom: 0;">${modes[selectedMode].description}</p>
        </div>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h4 style="margin-top: 0; color: #1976d2;">Live Preview</h4>
          <p style="color: #666; margin-bottom: 0;">Your ${selectedMode} project will appear here as you build it with Claude.</p>
        </div>
      </div>
    `;
    setPreviewContent(previewHtml);
  };

  useEffect(() => {
    if (selectedMode) {
      updatePreview();
    }
  }, [selectedMode, projectName]);

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      setProjectName(newProjectName.trim());
      setTerminalLines([]);
      setShowProjectDialog(false);
      setNewProjectName('');
      
      // Re-trigger the welcome messages with the new project name
      if (selectedMode) {
        setTimeout(() => {
          const welcomeMessages = [
            {
              id: Date.now().toString(),
              type: 'system' as const,
              content: `🚀 New project "${newProjectName.trim()}" created for ${modes[selectedMode].title} mode`,
              timestamp: new Date()
            },
            {
              id: (Date.now() + 1).toString(),
              type: 'claude' as const,
              content: `Perfect! Let's start building "${newProjectName.trim()}". I'm here to help you every step of the way. What's your first move?`,
              timestamp: new Date()
            }
          ];
          setTerminalLines(welcomeMessages);
        }, 100);
      }
    }
  };

  if (!selectedMode) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gray-900">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Claude Co-pilot Terminal</h1>
            </div>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Build Mode</h2>
            <p className="text-xl text-gray-300">Select the type of project you want to create with Claude</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {Object.entries(modes).map(([key, mode]) => {
              const IconComponent = mode.icon;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedMode(key as BuildMode)}
                  className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border-2 ${mode.borderColor} hover:bg-opacity-70 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl`}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${mode.color} mb-6`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{mode.title}</h3>
                    <p className="text-gray-300 mb-6">{mode.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 font-semibold">Examples:</p>
                      {mode.examples.map((example, index) => (
                        <div key={index} className="text-sm text-gray-500 bg-gray-700 bg-opacity-50 rounded-lg px-3 py-1">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentMode = modes[selectedMode];
  const IconComponent = currentMode.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="relative z-10 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSelectedMode(null)}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Modes
          </button>
          
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${currentMode.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">
                {currentMode.title} Mode{projectName && ` - ${projectName}`}
              </h2>
              <p className="text-green-400 text-sm">Claude Co-pilot Active</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 transition-colors ${showPreview ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
              title="Toggle Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={handleExportCode}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Export Code"
            >
              <FileDown className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`flex h-[calc(100vh-80px)] ${showPreview ? 'divide-x divide-gray-700' : ''}`}>
        {/* Terminal */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'flex-1'}`}>
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="flex-1 bg-black bg-opacity-90 p-4 overflow-y-auto font-mono text-sm"
          >
            {terminalLines.map((line) => (
              <div key={line.id} className="mb-2 flex items-start space-x-2">
                <span className="text-gray-500 text-xs mt-1 w-16 flex-shrink-0">
                  {line.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex-1">
                  {line.type === 'command' && (
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">$</span>
                      <span className="text-white">{line.content}</span>
                    </div>
                  )}
                  {line.type === 'output' && (
                    <div className="text-blue-300">{line.content}</div>
                  )}
                  {line.type === 'claude' && (
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-400 font-bold">Claude:</span>
                      <span className="text-gray-300">{line.content}</span>
                    </div>
                  )}
                  {line.type === 'system' && (
                    <div className="text-yellow-400">{line.content}</div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xs">Processing</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Command Input */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <form onSubmit={handleCommand} className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600 flex-shrink-0">
                <img 
                  src="/claude ready.jpg" 
                  alt="Claude"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="Enter your command or describe what you want to build..."
                className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-gray-500"
                disabled={isProcessing}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                title="Upload file"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.gif"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="submit"
                disabled={!currentCommand.trim() || isProcessing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Execute</span>
              </button>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 flex flex-col">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-b border-gray-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Live Preview</span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 bg-white overflow-auto">
              <iframe
                srcDoc={previewContent}
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          </div>
        )}

        {/* Side Panel */}
        <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm border-l border-gray-700 p-4 ${showPreview ? 'w-64' : 'w-80'}`}>
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <button
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                className="w-full flex items-center justify-between text-white font-semibold mb-3 hover:text-gray-300 transition-colors"
              >
                <span>Quick Actions</span>
                {isQuickActionsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {isQuickActionsOpen && (
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Run Project</span>
                  </button>
                  <button 
                    onClick={() => setShowProjectDialog(true)}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create New Project
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Install Package
                  </button>
                </div>
              )}
            </div>

            {/* Project Stats */}
            <div>
              <h3 className="text-white font-semibold mb-3">Project Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Files:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Lines of Code:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Build Status:</span>
                  <span className="text-green-400">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Name Dialog */}
      {showProjectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-semibold mb-4">Create New Project</h3>
            <form onSubmit={handleProjectSubmit}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectDialog(false);
                    setNewProjectName('');
                  }}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingTerminal;
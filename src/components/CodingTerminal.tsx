import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Terminal, Gamepad2, Globe, Brain, Send, Play, FileDown, Download, Upload, ChevronDown, ChevronRight, Eye, Code } from 'lucide-react';

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

interface ProjectFile {
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json';
}

interface ProjectState {
  files: ProjectFile[];
  dependencies: string[];
  framework: string;
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
  const [projectState, setProjectState] = useState<ProjectState>({
    files: [],
    dependencies: [],
    framework: 'vanilla'
  });

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

  const generateCode = (command: string, mode: BuildMode): { files: ProjectFile[], response: string } => {
    const lowerCommand = command.toLowerCase();
    
    // Game mode code generation
    if (mode === 'game') {
      if (lowerCommand.includes('snake') || lowerCommand.includes('game')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 2px solid #fff;
            background: #000;
        }
        .score {
            color: white;
            text-align: center;
            margin-bottom: 10px;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div>
        <div class="score">Score: <span id="score">0</span></div>
        <canvas id="gameCanvas" width="400" height="400"></canvas>
    </div>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        
        const gridSize = 20;
        let snake = [{x: 200, y: 200}];
        let food = {x: 100, y: 100};
        let dx = 0, dy = 0;
        let score = 0;
        
        function drawSnake() {
            ctx.fillStyle = '#0f0';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            });
        }
        
        function drawFood() {
            ctx.fillStyle = '#f00';
            ctx.fillRect(food.x, food.y, gridSize, gridSize);
        }
        
        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            snake.unshift(head);
            
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }
        }
        
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * 20) * gridSize,
                y: Math.floor(Math.random() * 20) * gridSize
            };
        }
        
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            moveSnake();
            drawSnake();
            drawFood();
        }
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': if (dy === 0) { dx = 0; dy = -gridSize; } break;
                case 'ArrowDown': if (dy === 0) { dx = 0; dy = gridSize; } break;
                case 'ArrowLeft': if (dx === 0) { dx = -gridSize; dy = 0; } break;
                case 'ArrowRight': if (dx === 0) { dx = gridSize; dy = 0; } break;
            }
        });
        
        setInterval(gameLoop, 150);
    </script>
</body>
</html>`
            }
          ],
          response: "Perfect! I've created a fully functional Snake game for you. The game includes smooth movement, collision detection, scoring, and responsive controls. Use arrow keys to play!"
        };
      }
      
      if (lowerCommand.includes('platformer') || lowerCommand.includes('jump')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platformer Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom, #87CEEB, #98FB98);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 2px solid #333;
            background: linear-gradient(to bottom, #87CEEB, #98FB98);
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="400"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        const player = {
            x: 50,
            y: 300,
            width: 30,
            height: 30,
            velocityY: 0,
            onGround: false,
            color: '#ff6b6b'
        };
        
        const platforms = [
            {x: 0, y: 370, width: 800, height: 30},
            {x: 200, y: 300, width: 100, height: 20},
            {x: 400, y: 250, width: 100, height: 20},
            {x: 600, y: 200, width: 100, height: 20}
        ];
        
        const keys = {};
        const gravity = 0.5;
        const jumpPower = -12;
        const speed = 5;
        
        function drawPlayer() {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        
        function drawPlatforms() {
            ctx.fillStyle = '#8B4513';
            platforms.forEach(platform => {
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });
        }
        
        function updatePlayer() {
            // Horizontal movement
            if (keys['ArrowLeft'] && player.x > 0) {
                player.x -= speed;
            }
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
                player.x += speed;
            }
            
            // Jumping
            if (keys['Space'] && player.onGround) {
                player.velocityY = jumpPower;
                player.onGround = false;
            }
            
            // Apply gravity
            player.velocityY += gravity;
            player.y += player.velocityY;
            
            // Platform collision
            player.onGround = false;
            platforms.forEach(platform => {
                if (player.x < platform.x + platform.width &&
                    player.x + player.width > platform.x &&
                    player.y < platform.y + platform.height &&
                    player.y + player.height > platform.y) {
                    
                    if (player.velocityY > 0) {
                        player.y = platform.y - player.height;
                        player.velocityY = 0;
                        player.onGround = true;
                    }
                }
            });
        }
        
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updatePlayer();
            drawPlatforms();
            drawPlayer();
            requestAnimationFrame(gameLoop);
        }
        
        document.addEventListener('keydown', (e) => {
            keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
        
        gameLoop();
    </script>
</body>
</html>`
            }
          ],
          response: "Excellent! I've built a 2D platformer game with physics, jumping mechanics, and multiple platforms. Use arrow keys to move and spacebar to jump!"
        };
      }
    }
    
    // Website mode code generation
    if (mode === 'website') {
      if (lowerCommand.includes('portfolio') || lowerCommand.includes('personal')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease;
        }
        
        .hero p {
            font-size: 1.2rem;
            animation: fadeInUp 1s ease 0.3s both;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .section {
            padding: 80px 0;
        }
        
        .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: #333;
        }
        
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .project-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
        }
        
        .project-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .skills {
            background: #f8f9fa;
        }
        
        .skill-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .skill-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 1rem;
            transition: background 0.3s ease;
        }
        
        .btn:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>John Developer</h1>
            <p>Full Stack Developer & Creative Problem Solver</p>
            <a href="#projects" class="btn">View My Work</a>
        </div>
    </section>
    
    <section id="projects" class="section">
        <div class="container">
            <h2>My Projects</h2>
            <div class="projects">
                <div class="project-card">
                    <h3>E-Commerce Platform</h3>
                    <p>A full-featured online store built with React and Node.js, featuring payment integration and inventory management.</p>
                    <a href="#" class="btn">Learn More</a>
                </div>
                <div class="project-card">
                    <h3>Task Management App</h3>
                    <p>A collaborative project management tool with real-time updates and team collaboration features.</p>
                    <a href="#" class="btn">Learn More</a>
                </div>
                <div class="project-card">
                    <h3>Weather Dashboard</h3>
                    <p>An interactive weather application with beautiful visualizations and location-based forecasts.</p>
                    <a href="#" class="btn">Learn More</a>
                </div>
            </div>
        </div>
    </section>
    
    <section class="section skills">
        <div class="container">
            <h2>My Skills</h2>
            <div class="skill-grid">
                <div class="skill-item">
                    <h4>Frontend</h4>
                    <p>React, Vue.js, HTML5, CSS3, JavaScript</p>
                </div>
                <div class="skill-item">
                    <h4>Backend</h4>
                    <p>Node.js, Python, Express, MongoDB</p>
                </div>
                <div class="skill-item">
                    <h4>Tools</h4>
                    <p>Git, Docker, AWS, Figma</p>
                </div>
                <div class="skill-item">
                    <h4>Design</h4>
                    <p>UI/UX, Responsive Design, Accessibility</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
            }
          ],
          response: "Perfect! I've created a stunning portfolio website with modern design, smooth animations, and responsive layout. It includes hero section, projects showcase, and skills display!"
        };
      }
      
      if (lowerCommand.includes('dashboard') || lowerCommand.includes('admin')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        
        .sidebar {
            background: #2c3e50;
            color: white;
            padding: 2rem 0;
        }
        
        .sidebar h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #3498db;
        }
        
        .nav-item {
            padding: 1rem 2rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .nav-item:hover {
            background: #34495e;
        }
        
        .nav-item.active {
            background: #3498db;
        }
        
        .main-content {
            padding: 2rem;
        }
        
        .header {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .chart-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .chart {
            height: 300px;
            background: linear-gradient(45deg, #3498db, #2ecc71);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }
        
        .table-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }
        
        th {
            background: #34495e;
            color: white;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .status {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .status.active {
            background: #d4edda;
            color: #155724;
        }
        
        .status.inactive {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="sidebar">
            <h2>Dashboard</h2>
            <div class="nav-item active">📊 Overview</div>
            <div class="nav-item">👥 Users</div>
            <div class="nav-item">📈 Analytics</div>
            <div class="nav-item">⚙️ Settings</div>
            <div class="nav-item">🔐 Security</div>
        </div>
        
        <div class="main-content">
            <div class="header">
                <h1>Welcome back, Admin!</h1>
                <p>Here's what's happening with your platform today.</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">1,234</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">$12,345</div>
                    <div class="stat-label">Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">89%</div>
                    <div class="stat-label">Performance</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">456</div>
                    <div class="stat-label">Active Sessions</div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>Analytics Overview</h3>
                <div class="chart">
                    📈 Interactive Chart Would Go Here
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>john@example.com</td>
                            <td><span class="status active">Active</span></td>
                            <td>2 hours ago</td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>jane@example.com</td>
                            <td><span class="status active">Active</span></td>
                            <td>1 day ago</td>
                        </tr>
                        <tr>
                            <td>Bob Johnson</td>
                            <td>bob@example.com</td>
                            <td><span class="status inactive">Inactive</span></td>
                            <td>1 week ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`
            }
          ],
          response: "Excellent! I've built a comprehensive admin dashboard with sidebar navigation, statistics cards, data tables, and a clean professional design. Perfect for managing your platform!"
        };
      }
    }
    
    // AI mode code generation
    if (mode === 'ai') {
      if (lowerCommand.includes('chatbot') || lowerCommand.includes('chat')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-container {
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .chat-header h2 {
            margin-bottom: 5px;
        }
        
        .status {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .message.bot .message-bubble {
            background: #e9ecef;
            color: #333;
            border-bottom-left-radius: 4px;
        }
        
        .message.user .message-bubble {
            background: #667eea;
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .chat-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
        }
        
        .input-group input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            outline: none;
            font-size: 0.9rem;
        }
        
        .input-group input:focus {
            border-color: #667eea;
        }
        
        .send-btn {
            padding: 12px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s ease;
        }
        
        .send-btn:hover {
            background: #5a6fd8;
        }
        
        .typing-indicator {
            display: none;
            padding: 12px 16px;
            background: #e9ecef;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            max-width: 80%;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>🤖 AI Assistant</h2>
            <div class="status">Online • Ready to help</div>
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <div class="message bot">
                <div class="message-bubble">
                    Hello! I'm your AI assistant. How can I help you today?
                </div>
            </div>
        </div>
        
        <div class="chat-input">
            <div class="input-group">
                <input type="text" id="messageInput" placeholder="Type your message..." />
                <button class="send-btn" onclick="sendMessage()">Send</button>
            </div>
        </div>
    </div>
    
    <script>
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        
        const responses = [
            "That's an interesting question! Let me think about that...",
            "I understand what you're asking. Here's my perspective...",
            "Great point! I'd be happy to help you with that.",
            "That's a fascinating topic. Let me share some insights...",
            "I see what you mean. Here's what I think...",
            "Excellent question! Based on my knowledge...",
            "I appreciate you asking that. Here's my response...",
            "That's something I can definitely help with!"
        ];
        
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'bot'}\`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            bubbleDiv.textContent = content;
            
            messageDiv.appendChild(bubbleDiv);
            chatMessages.appendChild(messageDiv);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.innerHTML = \`
                <div class="typing-indicator" style="display: block;">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            \`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return typingDiv;
        }
        
        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;
            
            addMessage(message, true);
            messageInput.value = '';
            
            const typingIndicator = showTypingIndicator();
            
            setTimeout(() => {
                typingIndicator.remove();
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000 + Math.random() * 2000);
        }
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>`
            }
          ],
          response: "Perfect! I've created an intelligent chatbot interface with real-time messaging, typing indicators, and smooth animations. The AI responds naturally to user inputs!"
        };
      }
      
      if (lowerCommand.includes('analyzer') || lowerCommand.includes('data')) {
        return {
          files: [
            {
              name: 'index.html',
              type: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Data Analyzer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .upload-section {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .upload-area {
            border: 3px dashed #667eea;
            border-radius: 10px;
            padding: 3rem;
            margin: 1rem 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upload-area:hover {
            background: #f8f9ff;
            border-color: #5a6fd8;
        }
        
        .upload-area.dragover {
            background: #e3f2fd;
            border-color: #2196f3;
        }
        
        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .analysis-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .analysis-card h3 {
            color: #333;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-value {
            font-weight: bold;
            color: #667eea;
        }
        
        .chart-placeholder {
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
            margin-top: 1rem;
        }
        
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        }
        
        .btn:hover {
            background: #5a6fd8;
        }
        
        .insights {
            background: #e8f5e8;
            border-left: 4px solid #4caf50;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
        }
        
        .insights h4 {
            color: #2e7d32;
            margin-bottom: 0.5rem;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧠 AI Data Analyzer</h1>
        <p>Upload your data and get intelligent insights powered by AI</p>
    </div>
    
    <div class="container">
        <div class="upload-section">
            <h2>Upload Your Data</h2>
            <div class="upload-area" id="uploadArea">
                <div>
                    <h3>📊 Drop your CSV file here</h3>
                    <p>or click to browse files</p>
                    <input type="file" id="fileInput" accept=".csv,.json,.txt" style="display: none;">
                </div>
            </div>
            <button class="btn" onclick="analyzeData()">🔍 Analyze Data</button>
        </div>
        
        <div id="analysisResults" class="hidden">
            <div class="analysis-grid">
                <div class="analysis-card">
                    <h3>📈 Statistical Overview</h3>
                    <div class="metric">
                        <span>Total Records</span>
                        <span class="metric-value" id="totalRecords">1,234</span>
                    </div>
                    <div class="metric">
                        <span>Data Quality Score</span>
                        <span class="metric-value" id="qualityScore">94%</span>
                    </div>
                    <div class="metric">
                        <span>Missing Values</span>
                        <span class="metric-value" id="missingValues">2.3%</span>
                    </div>
                    <div class="metric">
                        <span>Outliers Detected</span>
                        <span class="metric-value" id="outliers">12</span>
                    </div>
                </div>
                
                <div class="analysis-card">
                    <h3>🎯 Key Insights</h3>
                    <div class="insights">
                        <h4>AI Recommendation</h4>
                        <p>Your data shows strong seasonal patterns with 23% growth in Q4. Consider increasing inventory during peak months.</p>
                    </div>
                    <div class="insights">
                        <h4>Trend Analysis</h4>
                        <p>Upward trend detected with 95% confidence. Projected growth of 15% over next quarter.</p>
                    </div>
                </div>
                
                <div class="analysis-card">
                    <h3>📊 Data Visualization</h3>
                    <div class="chart-placeholder">
                        📈 Interactive Chart
                        <br>
                        (Real chart would render here)
                    </div>
                </div>
                
                <div class="analysis-card">
                    <h3>🔮 Predictions</h3>
                    <div class="metric">
                        <span>Next Month Forecast</span>
                        <span class="metric-value">+18.5%</span>
                    </div>
                    <div class="metric">
                        <span>Confidence Level</span>
                        <span class="metric-value">87%</span>
                    </div>
                    <div class="metric">
                        <span>Risk Assessment</span>
                        <span class="metric-value">Low</span>
                    </div>
                    <div class="chart-placeholder">
                        🔮 Prediction Model
                        <br>
                        (ML predictions would show here)
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const analysisResults = document.getElementById('analysisResults');
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
        
        function handleFile(file) {
            uploadArea.innerHTML = \`
                <div>
                    <h3>✅ File uploaded: \${file.name}</h3>
                    <p>Size: \${(file.size / 1024).toFixed(1)} KB</p>
                </div>
            \`;
        }
        
        function analyzeData() {
            // Simulate analysis
            uploadArea.innerHTML = \`
                <div>
                    <h3>🔄 Analyzing data...</h3>
                    <p>AI is processing your data</p>
                </div>
            \`;
            
            setTimeout(() => {
                analysisResults.classList.remove('hidden');
                uploadArea.innerHTML = \`
                    <div>
                        <h3>✅ Analysis Complete!</h3>
                        <p>Check the results below</p>
                    </div>
                \`;
                
                // Animate metrics
                animateMetrics();
            }, 2000);
        }
        
        function animateMetrics() {
            const metrics = ['totalRecords', 'qualityScore', 'missingValues', 'outliers'];
            const values = ['1,234', '94%', '2.3%', '12'];
            
            metrics.forEach((id, index) => {
                setTimeout(() => {
                    document.getElementById(id).textContent = values[index];
                    document.getElementById(id).style.animation = 'pulse 0.5s ease';
                }, index * 200);
            });
        }
    </script>
</body>
</html>`
            }
          ],
          response: "Excellent! I've created a sophisticated AI data analyzer with drag-and-drop file upload, real-time analysis, statistical insights, and predictive modeling capabilities!"
        };
      }
    }
    
    // Default responses for unrecognized commands
    const defaultResponses = {
      game: "I can help you build games! Try commands like 'create snake game', 'build platformer', 'make puzzle game', or describe what kind of game you want to create.",
      website: "I can help you build websites! Try commands like 'create portfolio', 'build dashboard', 'make landing page', or describe what kind of website you need.",
      ai: "I can help you build AI applications! Try commands like 'create chatbot', 'build data analyzer', 'make image classifier', or describe what AI feature you want to implement."
    };
    
    return {
      files: [],
      response: defaultResponses[mode]
    };
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

    // Generate code and response
    setTimeout(() => {
      const result = generateCode(currentCommand, selectedMode);
      
      // Update project state with new files
      if (result.files.length > 0) {
        setProjectState(prev => ({
          ...prev,
          files: [...prev.files.filter(f => !result.files.find(nf => nf.name === f.name)), ...result.files]
        }));
        
        // Update preview with the main HTML file
        const htmlFile = result.files.find(f => f.type === 'html');
        if (htmlFile) {
          setPreviewContent(htmlFile.content);
        }
      }
      
      const lines: TerminalLine[] = [];
      
      if (result.files.length > 0) {
        lines.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: `✓ Generated ${result.files.length} file(s): ${result.files.map(f => f.name).join(', ')}`,
          timestamp: new Date()
        });
      }

      lines.push({
        id: (Date.now() + 2).toString(),
        type: 'claude',
        content: result.response,
        timestamp: new Date()
      });

      setTerminalLines(prev => [...prev, ...lines]);
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
    // Export the actual generated code or create a default export
    const htmlFile = projectState.files.find(f => f.type === 'html');
    
    const htmlContent = htmlFile ? htmlFile.content : `<!DOCTYPE html>
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
            <h3>Generated Files</h3>
            <p>Files: ${projectState.files.map(f => f.name).join(', ') || 'No files generated yet'}</p>
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
    // Check if we have generated files
    const htmlFile = projectState.files.find(f => f.type === 'html');
    
    if (htmlFile) {
      setPreviewContent(htmlFile.content);
    } else {
      // Default preview content
      const previewHtml = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; margin-bottom: 20px;">${projectName || 'My Project'} Preview</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Project Type: ${modes[selectedMode].title}</h3>
            <p style="color: #666; margin-bottom: 0;">${modes[selectedMode].description}</p>
          </div>
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h4 style="margin-top: 0; color: #1976d2;">Live Preview</h4>
            <p style="color: #666; margin-bottom: 0;">Your ${selectedMode} project will appear here as you build it with Claude. Try commands like:</p>
            <ul style="color: #666; margin-top: 10px;">
              ${modes[selectedMode].examples.map(example => `<li>"create ${example.toLowerCase()}"</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      setPreviewContent(previewHtml);
    }
  };

  useEffect(() => {
    if (selectedMode) {
      updatePreview();
    }
  }, [selectedMode, projectName]);

  useEffect(() => {
    updatePreview();
  }, [projectState.files]);

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
                  <span>{projectState.files.length}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Lines:</span>
                  <span>{projectState.files.reduce((total, file) => total + file.content.split('\n').length, 0)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Status:</span>
                  <span className={projectState.files.length > 0 ? "text-green-400" : "text-yellow-400"}>
                    {projectState.files.length > 0 ? "Built" : "Ready"}
                  </span>
                </div>
              </div>
              
              {/* File Explorer */}
              {projectState.files.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Project Files</h3>
                  <div className="space-y-1 text-sm">
                    {projectState.files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300 bg-gray-700 bg-opacity-50 rounded px-2 py-1">
                        <span className="text-blue-400">📄</span>
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{file.type.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
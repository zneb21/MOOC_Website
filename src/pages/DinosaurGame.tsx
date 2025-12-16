import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Trophy, Zap, X, Circle, Minus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Shuffle, Hand, Scissors, RotateCw, Clock, Target, TrendingUp, Gamepad2, Sparkles } from "lucide-react";
import LiquidEther from "@/components/ui/liquidether";

// ==================== TYPES ====================
type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
type Player = 'X' | 'O' | null;
type BoardState = Player[];
type TicTacToeGameState = 'menu' | 'playing' | 'gameover';
type Direction = 'up' | 'down' | 'left' | 'right';

interface Position {
  x: number;
  y: number;
}

// ==================== SNAKE GAME ====================
const SnakeGameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(100);
  
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>('right');
  const nextDirectionRef = useRef<Direction>('right');
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);

  // Draw function (for initial render and paused state)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    // Draw game
    canvasCtx.fillStyle = '#1a1a2e';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    canvasCtx.strokeStyle = '#16213e';
    canvasCtx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, 0);
      canvasCtx.lineTo(x, canvas.height);
      canvasCtx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, y);
      canvasCtx.lineTo(canvas.width, y);
      canvasCtx.stroke();
    }

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      
      if (index === 0) {
        // Head
        canvasCtx.fillStyle = '#4C8C4A';
        canvasCtx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        canvasCtx.fillStyle = '#5FA35F';
        canvasCtx.fillRect(x + 4, y + 4, CELL_SIZE - 8, CELL_SIZE - 8);
        // Eyes
        canvasCtx.fillStyle = '#fff';
        canvasCtx.beginPath();
        canvasCtx.arc(x + 8, y + 6, 2, 0, Math.PI * 2);
        canvasCtx.arc(x + 12, y + 6, 2, 0, Math.PI * 2);
        canvasCtx.fill();
      } else {
        // Body
        canvasCtx.fillStyle = '#4C8C4A';
        canvasCtx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        canvasCtx.fillStyle = '#5FA35F';
        canvasCtx.fillRect(x + 4, y + 4, CELL_SIZE - 8, CELL_SIZE - 8);
      }
    });

    // Draw food
    const foodX = foodRef.current.x * CELL_SIZE;
    const foodY = foodRef.current.y * CELL_SIZE;
    canvasCtx.fillStyle = '#FF6B6B';
    canvasCtx.beginPath();
    canvasCtx.arc(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    canvasCtx.fill();
    canvasCtx.fillStyle = '#FF8787';
    canvasCtx.beginPath();
    canvasCtx.arc(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    canvasCtx.fill();
  }, []);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const gridWidth = Math.floor(600 / CELL_SIZE);
    const gridHeight = Math.floor(600 / CELL_SIZE);
    canvas.width = gridWidth * CELL_SIZE;
    canvas.height = gridHeight * CELL_SIZE;

    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      const score = parseInt(savedHighScore);
      setHighScore(score);
      highScoreRef.current = score;
    }
    
    // Initial draw
    canvasCtx.fillStyle = '#1a1a2e';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Sync refs with state
  useEffect(() => {
    scoreRef.current = score;
    highScoreRef.current = highScore;
  }, [score, highScore]);

  // Generate new food position
  const generateFood = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gridWidth = Math.floor(canvas.width / CELL_SIZE);
    const gridHeight = Math.floor(canvas.height / CELL_SIZE);
    
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    foodRef.current = newFood;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update direction
    directionRef.current = nextDirectionRef.current;

    // Move snake
    const head = { ...snakeRef.current[0] };
    switch (directionRef.current) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    // Check wall collision
    const gridWidth = Math.floor(canvas.width / CELL_SIZE);
    const gridHeight = Math.floor(canvas.height / CELL_SIZE);
    
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      setGameState('gameover');
      if (scoreRef.current > highScoreRef.current) {
        const newHighScore = scoreRef.current;
        setHighScore(newHighScore);
        highScoreRef.current = newHighScore;
        localStorage.setItem('snakeHighScore', newHighScore.toString());
      }
      return;
    }

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameover');
        if (scoreRef.current > highScoreRef.current) {
          const newHighScore = scoreRef.current;
          setHighScore(newHighScore);
          highScoreRef.current = newHighScore;
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }
        return;
      }

    snakeRef.current.unshift(head);

    // Check food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const newScore = scoreRef.current + 1;
        setScore(newScore);
        scoreRef.current = newScore;
      generateFood();
      
      // Increase speed slightly
      if (newScore % 5 === 0) {
        setGameSpeed(prev => Math.max(50, prev - 5));
      }
    } else {
      snakeRef.current.pop();
    }

    draw();
  }, [gameState, generateFood, draw]);

  // Draw when not playing
  useEffect(() => {
    if (gameState !== 'playing' && canvasRef.current) {
      draw();
    }
  }, [gameState, draw]);

  const changeDirection = useCallback((newDirection: Direction) => {
    const currentDir = directionRef.current;
    // Prevent reversing into itself
    if (
      (currentDir === 'up' && newDirection === 'down') ||
      (currentDir === 'down' && newDirection === 'up') ||
      (currentDir === 'left' && newDirection === 'right') ||
      (currentDir === 'right' && newDirection === 'left')
    ) {
      return;
    }
    nextDirectionRef.current = newDirection;
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setGameSpeed(100);
    scoreRef.current = 0;
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'right';
    nextDirectionRef.current = 'right';
    generateFood();
  }, [generateFood]);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (gameState === 'playing') {
      lastUpdateRef.current = Date.now();
      const animate = () => {
        const now = Date.now();
        if (now - lastUpdateRef.current >= gameSpeed) {
          gameLoop();
          lastUpdateRef.current = now;
        }
        gameLoopRef.current = requestAnimationFrame(animate);
      };
      gameLoopRef.current = requestAnimationFrame(animate);

      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
  }, [gameState, gameLoop, gameSpeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowUp':
            changeDirection('up');
            break;
          case 'ArrowDown':
            changeDirection('down');
            break;
          case 'ArrowLeft':
            changeDirection('left');
            break;
          case 'ArrowRight':
            changeDirection('right');
            break;
        }
      } else if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (gameState === 'menu') {
          startGame();
        } else if (gameState === 'gameover') {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, startGame, resetGame, changeDirection]);

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };


  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="group bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-400/10 border-2 border-emerald-300/30 dark:border-emerald-600/30 rounded-2xl p-6 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 dark:from-emerald-500/40 dark:to-emerald-600/30 flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Score</span>
          </div>
          <div className="relative text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{score}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Current points</div>
          {score > 0 && (
            <div className="mt-3 w-full bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((score / Math.max(highScore, 10)) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* High Score Card */}
        <div className="group bg-gradient-to-br from-[#F4B942]/10 via-[#F4B942]/5 to-transparent dark:from-[#F4B942]/20 dark:via-[#F4B942]/10 border-2 border-[#F4B942]/30 dark:border-[#F4B942]/30 rounded-2xl p-6 shadow-lg hover:shadow-[#F4B942]/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4B942]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F4B942]/30 to-[#F4B942]/20 dark:from-[#F4B942]/40 dark:to-[#F4B942]/30 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-[#F4B942]" />
            </div>
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Best</span>
          </div>
          <div className="relative text-4xl font-bold text-[#F4B942] flex items-center gap-2 mb-1">
            {highScore}
            {score === highScore && score > 0 && (
              <span className="text-lg animate-pulse">✨</span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Personal record</div>
          {highScore > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-[#F4B942]/20 dark:bg-[#F4B942]/30 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F4B942] to-[#F4B942]/80 h-full rounded-full w-full"></div>
              </div>
              <span className="text-xs font-semibold text-[#F4B942]">🏆</span>
            </div>
          )}
        </div>

        {/* Length Card */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent dark:from-blue-500/20 dark:via-blue-400/10 border-2 border-blue-300/30 dark:border-blue-600/30 rounded-2xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Length</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{snakeRef.current.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Snake size</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-end gap-2">
        {gameState === 'playing' && (
          <Button onClick={togglePause} variant="outline" size="default" className="shadow-md">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
        {gameState === 'paused' && (
          <Button onClick={togglePause} variant="default" size="default" className="shadow-md bg-emerald-600 hover:bg-emerald-700">
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
        )}
        {(gameState === 'menu' || gameState === 'gameover') && (
          <Button onClick={startGame} variant="default" size="default" className="shadow-md bg-emerald-600 hover:bg-emerald-700">
            <Play className="w-4 h-4 mr-2" />
            {gameState === 'gameover' ? 'Play Again' : 'Start Game'}
          </Button>
        )}
        {gameState === 'gameover' && (
          <Button onClick={resetGame} variant="outline" size="default" className="shadow-md">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Game Canvas */}
        <div className="relative bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-zinc-900/90 dark:via-emerald-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-emerald-200/50 dark:border-emerald-800/30 rounded-3xl p-8 shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-all duration-300">
        {/* Game Info Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Iloilo River Run</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Glide along the Iloilo River, collect treats, and keep the run alive</p>
          </div>
          {gameState === 'playing' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Playing</span>
            </div>
          )}
        </div>
        
        <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 dark:from-slate-950/80 dark:via-slate-900/70 dark:to-slate-950/80 rounded-2xl p-6 border-2 border-emerald-500/30 dark:border-emerald-400/30 shadow-inner">
          <div className="absolute top-2 left-2 right-2 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-full"></div>
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl border-2 border-emerald-500/50 dark:border-emerald-400/50 mx-auto bg-slate-950 shadow-2xl"
            style={{ maxWidth: '600px', maxHeight: '600px' }}
          />
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-full"></div>
        </div>
        
        {/* Mobile Controls */}
        {gameState === 'playing' && (
          <div className="mt-4 flex flex-col items-center gap-2 md:hidden">
            <Button
              onClick={() => changeDirection('up')}
              variant="outline"
              size="sm"
              className="w-16"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => changeDirection('left')}
                variant="outline"
                size="sm"
                className="w-16"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => changeDirection('right')}
                variant="outline"
                size="sm"
                className="w-16"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => changeDirection('down')}
              variant="outline"
              size="sm"
              className="w-16"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-6 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
            <div className="text-center bg-gradient-to-br from-white/95 via-emerald-50/95 to-white/95 dark:from-black/95 dark:via-emerald-950/95 dark:to-black/95 rounded-2xl p-10 shadow-2xl border-2 border-emerald-200/50 dark:border-emerald-800/30 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Iloilo River Run
              </h2>
              <p className="text-slate-600 dark:text-white/70 mb-2 text-sm">
                Use <kbd className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-600 font-mono text-xs font-semibold">Arrow Keys</kbd> to steer your banca.
              </p>
              <p className="text-slate-500 dark:text-white/60 mb-6 text-xs">
                Collect Iloilo treats, keep the river clean, and avoid the banks.
              </p>
              <Button onClick={startGame} variant="default" size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Run
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-6 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
            <div className="text-center bg-gradient-to-br from-white/95 via-red-50/95 to-white/95 dark:from-black/95 dark:via-red-950/95 dark:to-black/95 rounded-2xl p-10 shadow-2xl border-2 border-red-200/50 dark:border-red-800/30 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 flex items-center justify-center shadow-lg">
                <Circle className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                Banca Stopped!
              </h2>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl p-4 mb-4 border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Final River Score</p>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
              </div>
              {score === highScore && score > 0 && (
                <div className="bg-gradient-to-r from-[#F4B942]/20 to-[#F4B942]/10 dark:from-[#F4B942]/30 dark:to-[#F4B942]/20 rounded-xl p-3 mb-4 border-2 border-[#F4B942]/40">
                  <p className="text-[#F4B942] font-bold text-lg flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" />
                    New High Score!
                    <Trophy className="w-5 h-5" />
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={resetGame} variant="default" size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-6 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
            <div className="text-center bg-white/90 dark:bg-black/90 rounded-2xl p-8 shadow-2xl">
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Paused
              </h2>
              <Button onClick={togglePause} variant="default" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-zinc-900/90 dark:via-emerald-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-emerald-200/50 dark:border-emerald-800/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>How to Play - Iloilo River Run</span>
          </h3>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/20">
            <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Iloilo River Theme</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/30 dark:border-emerald-800/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Paddle the River
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Use <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-600 font-mono text-xs">Arrow Keys</kbd> or on-screen buttons to steer along the Iloilo River path.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/30 dark:border-emerald-800/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Collect River Finds
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Grab floating treats to grow longer and boost your score—think batchoy bowls and barquillos along the riverbank.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/30 dark:border-emerald-800/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Avoid River Walls
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Don’t crash into the riverbanks or your own boat’s trail—either ends your Iloilo cruise.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-200/30 dark:border-emerald-800/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              4
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Faster Currents
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The river current speeds up every 5 points—keep calm and steer like a true Ilonggo navigator.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== TIC-TAC-TOE GAME ====================
const TicTacToeComponent = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<TicTacToeGameState>('menu');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem('ticTacToeStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setXWins(stats.xWins || 0);
      setOWins(stats.oWins || 0);
      setDraws(stats.draws || 0);
    }
  }, []);

  const checkWinner = (boardState: BoardState): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }

    if (boardState.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('gameover');
      
      if (gameWinner === 'X') {
        const newXWins = xWins + 1;
        setXWins(newXWins);
        localStorage.setItem('ticTacToeStats', JSON.stringify({ xWins: newXWins, oWins, draws }));
      } else if (gameWinner === 'O') {
        const newOWins = oWins + 1;
        setOWins(newOWins);
        localStorage.setItem('ticTacToeStats', JSON.stringify({ xWins, oWins: newOWins, draws }));
      } else if (gameWinner === 'draw') {
        const newDraws = draws + 1;
        setDraws(newDraws);
        localStorage.setItem('ticTacToeStats', JSON.stringify({ xWins, oWins, draws: newDraws }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
  };

  const resetGame = () => {
    startGame();
  };

  const resetStats = () => {
    setXWins(0);
    setOWins(0);
    setDraws(0);
    localStorage.setItem('ticTacToeStats', JSON.stringify({ xWins: 0, oWins: 0, draws: 0 }));
  };

  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <button
        onClick={() => handleCellClick(index)}
        disabled={!!value || gameState !== 'playing' || !!winner}
        className={`
          w-full h-full aspect-square flex items-center justify-center
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
          border-2 border-slate-300 dark:border-slate-600
          rounded-xl transition-all duration-200
          hover:bg-slate-50 dark:hover:bg-slate-700
          hover:scale-105 active:scale-95
          disabled:cursor-not-allowed disabled:opacity-50
          disabled:hover:scale-100
          ${value ? 'cursor-default' : 'cursor-pointer'}
        `}
      >
        {value === 'X' && (
          <X className="w-16 h-16 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
        )}
        {value === 'O' && (
          <Circle className="w-16 h-16 text-blue-600 dark:text-blue-400 stroke-[3]" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* X Wins Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-400/10 border-2 border-emerald-300/30 dark:border-emerald-600/30 rounded-2xl p-5 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center">
              <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">X Wins</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{xWins}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Player X victories</div>
        </div>

        {/* O Wins Card */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent dark:from-blue-500/20 dark:via-blue-400/10 border-2 border-blue-300/30 dark:border-blue-600/30 rounded-2xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
              <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">O Wins</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{oWins}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Player O victories</div>
        </div>

        {/* Draws Card */}
        <div className="bg-gradient-to-br from-slate-500/10 via-slate-400/5 to-transparent dark:from-slate-500/20 dark:via-slate-400/10 border-2 border-slate-300/30 dark:border-slate-600/30 rounded-2xl p-5 shadow-lg hover:shadow-slate-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 dark:bg-slate-500/30 flex items-center justify-center">
              <Minus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Draws</span>
          </div>
          <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">{draws}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tied games</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-end gap-2">
        {gameState === 'menu' && (
          <Button onClick={startGame} variant="default" size="default" className="shadow-md bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        )}
        {gameState === 'playing' && (
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/50 dark:to-emerald-950/50 rounded-lg border-2 border-blue-200/50 dark:border-blue-800/30 shadow-md">
            <span className="text-sm font-medium text-slate-600 dark:text-white/70">Current Player:</span>
            {currentPlayer === 'X' ? (
              <div className="flex items-center gap-2">
                <X className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Player X</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Circle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Player O</span>
              </div>
            )}
          </div>
        )}
        {gameState === 'gameover' && (
          <>
            <Button onClick={resetGame} variant="default" size="default" className="shadow-md bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={resetStats} variant="outline" size="default" className="shadow-md">
              Reset Stats
            </Button>
          </>
        )}
      </div>

      {/* Game Board */}
      <div className="relative bg-gradient-to-br from-white/90 via-blue-50/80 to-white/90 dark:from-zinc-900/90 dark:via-blue-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-blue-200/50 dark:border-blue-800/30 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
        {/* Game Info Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Plaza Squares</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Claim three tiles across Iloilo’s plazas to win</p>
          </div>
          {gameState === 'playing' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">In Progress</span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-800 dark:via-blue-950 dark:to-slate-800 rounded-2xl p-8 border-2 border-blue-300/30 dark:border-blue-700/30 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          <div className="relative grid grid-cols-3 gap-4 max-w-md mx-auto">
            {Array(9).fill(null).map((_, index) => (
              <div key={index} className="aspect-square">
                {renderCell(index)}
              </div>
            ))}
          </div>
        </div>

        {/* Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-6 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
            <div className="text-center bg-gradient-to-br from-white/95 via-blue-50/95 to-white/95 dark:from-black/95 dark:via-blue-950/95 dark:to-black/95 rounded-2xl p-10 shadow-2xl border-2 border-blue-200/50 dark:border-blue-800/30 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Plaza Squares
              </h2>
              <p className="text-slate-600 dark:text-white/70 mb-2 text-sm">
                Take turns marking <span className="font-semibold text-emerald-600 dark:text-emerald-400">X</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">O</span> on iconic Iloilo plaza tiles.
              </p>
              <p className="text-slate-500 dark:text-white/60 mb-6 text-xs">
                Line up three tiles to claim the plaza.
              </p>
              <Button onClick={startGame} variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Match
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && winner && (
          <div className="absolute inset-6 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
            <div className="text-center bg-gradient-to-br from-white/95 via-blue-50/95 to-white/95 dark:from-black/95 dark:via-blue-950/95 dark:to-black/95 rounded-2xl p-10 shadow-2xl border-2 border-blue-200/50 dark:border-blue-800/30 max-w-md">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                winner === 'draw' 
                  ? 'bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500' 
                  : winner === 'X'
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500'
              }`}>
                {winner === 'draw' ? (
                  <Minus className="w-10 h-10 text-white" />
                ) : winner === 'X' ? (
                  <X className="w-10 h-10 text-white stroke-[4]" />
                ) : (
                  <Circle className="w-10 h-10 text-white stroke-[4]" />
                )}
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">
                {winner === 'draw' ? (
                  <span className="text-slate-600 dark:text-slate-400">Plaza Split!</span>
                ) : (
                  <span className={winner === 'X' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}>
                    {winner} Claims the Plaza! 🏛️
                  </span>
                )}
              </h2>
              <div className="flex gap-2 justify-center mt-6">
                <Button onClick={resetGame} variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-white/90 dark:from-zinc-900/90 dark:via-blue-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-blue-200/50 dark:border-blue-800/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>How to Play - Plaza Squares</span>
          </h3>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/20">
            <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Plaza Tile Match</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Take Turns on the Plaza
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Players alternate placing <span className="font-semibold text-emerald-600 dark:text-emerald-400">X</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">O</span> on the plaza tiles. Click any empty tile to mark your spot.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Claim Three in a Row
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Win by lining up three tiles across the plaza—horizontal, vertical, or diagonal.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                Guard Iloilo’s Squares
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Place your mark to block your opponent from claiming the plaza stretch first.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-blue-200/30 dark:border-blue-800/20 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              4
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Minus className="w-4 h-4" />
                Plaza Draw
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If all 9 plaza tiles are filled with no winner, the round ends in a draw.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ROCK PAPER SCISSORS GAME ====================
const RockPaperScissorsComponent = () => {
  const [playerChoice, setPlayerChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [computerChoice, setComputerChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');

  useEffect(() => {
    const savedHighScore = localStorage.getItem('rpsHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const choices: Array<'rock' | 'paper' | 'scissors'> = ['rock', 'paper', 'scissors'];

  const getComputerChoice = (): 'rock' | 'paper' | 'scissors' => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: 'rock' | 'paper' | 'scissors', computer: 'rock' | 'paper' | 'scissors'): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleChoice = (choice: 'rock' | 'paper' | 'scissors') => {
    if (gameState === 'menu' || playerChoice !== null) return;
    
    setPlayerChoice(choice);
    
    setTimeout(() => {
      const compChoice = getComputerChoice();
      setComputerChoice(compChoice);
      
      const gameResult = determineWinner(choice, compChoice);
      setResult(gameResult);
      
      if (gameResult === 'win') {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('rpsHighScore', newScore.toString());
          }
          return newScore;
        });
      } else if (gameResult === 'lose') {
        setScore(0);
      }
      
      // Reset choices after showing result for next round
      setTimeout(() => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
      }, 2000);
    }, 500);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore(0);
    setGameState('menu');
  };

  const startGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore(0);
    setGameState('playing');
  };

  const getChoiceIcon = (choice: 'rock' | 'paper' | 'scissors') => {
    switch (choice) {
      case 'rock':
        return <Hand className="w-16 h-16" />;
      case 'paper':
        return <RotateCw className="w-16 h-16" />;
      case 'scissors':
        return <Scissors className="w-16 h-16" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Score Card - VIOLET */}
        <div className="bg-gradient-to-br from-violet-500/10 via-violet-400/5 to-transparent dark:from-violet-500/20 dark:via-violet-400/10 border-2 border-violet-300/30 dark:border-violet-600/30 rounded-2xl p-5 shadow-lg hover:shadow-violet-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 dark:bg-violet-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide">Win Streak</span>
          </div>
          <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{score}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consecutive wins</div>
        </div>

        {/* High Score Card - GOLD (Kept for consistency) */}
        <div className="bg-gradient-to-br from-[#F4B942]/10 via-[#F4B942]/5 to-transparent dark:from-[#F4B942]/20 dark:via-[#F4B942]/10 border-2 border-[#F4B942]/30 dark:border-[#F4B942]/30 rounded-2xl p-5 shadow-lg hover:shadow-[#F4B942]/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4B942]/20 dark:bg-[#F4B942]/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#F4B942]" />
            </div>
            <span className="text-xs font-semibold text-[#F4B942] uppercase tracking-wide">Best Streak</span>
          </div>
          <div className="text-3xl font-bold text-[#F4B942] flex items-center gap-2">
            {highScore}
            {score === highScore && score > 0 && (
              <span className="text-sm animate-pulse">🔥</span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Longest win streak</div>
        </div>
      </div>

      {/* Control Buttons - VIOLET */}
      <div className="flex justify-end gap-2">
        {gameState === 'menu' && (
          <Button onClick={startGame} variant="default" size="default" className="shadow-md bg-violet-600 hover:bg-violet-700">
            <Play className="w-4 h-4 mr-2" />
            Start Showdown
          </Button>
        )}
        {gameState === 'playing' && (
          <Button onClick={resetGame} variant="outline" size="default" className="shadow-md">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Streak
          </Button>
        )}
      </div>

      {/* Game Board - VIOLET */}
      <div className="relative bg-gradient-to-br from-white/90 via-violet-50/80 to-white/90 dark:from-zinc-900/90 dark:via-violet-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-violet-200/50 dark:border-violet-800/30 rounded-3xl p-8 shadow-2xl hover:shadow-violet-500/20 transition-all duration-300">
        {/* Game Info Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Festival Clash</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dinagyang-inspired duels—build your streak with every win</p>
          </div>
          {gameState === 'playing' && result && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              result === 'win' ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20' :
              result === 'lose' ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20' :
              'bg-slate-500/10 dark:bg-slate-500/20 border-slate-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                result === 'win' ? 'bg-emerald-500' :
                result === 'lose' ? 'bg-red-500' :
                'bg-slate-500'
              }`}></div>
              <span className={`text-xs font-semibold ${
                result === 'win' ? 'text-emerald-700 dark:text-emerald-300' :
                result === 'lose' ? 'text-red-700 dark:text-red-300' :
                'text-slate-700 dark:text-slate-300'
              }`}>
                {result === 'win' ? 'Won!' : result === 'lose' ? 'Lost' : 'Draw'}
              </span>
            </div>
          )}
        </div>

        {/* Choices Display - VIOLET */}
        <div className="bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-950 rounded-2xl p-6 mb-6 border-2 border-violet-300/30 dark:border-violet-700/30">
          <div className="flex justify-center items-center gap-8">
            {/* Player Choice */}
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-600 dark:text-white/70 mb-2">You</div>
              <div className={`
                w-24 h-24 rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${playerChoice 
                  ? 'bg-gradient-to-br from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-700 text-white shadow-lg scale-110' 
                  : 'bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-800 dark:to-violet-900'
                }
              `}>
                {playerChoice ? getChoiceIcon(playerChoice) : '?'}
              </div>
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-500">VS</div>

            {/* Computer Choice */}
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-600 dark:text-white/70 mb-2">Computer</div>
              <div className={`
                w-24 h-24 rounded-2xl flex items-center justify-center
                transition-all duration-300
                ${computerChoice 
                  ? 'bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 text-white shadow-lg scale-110' 
                  : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900'
                }
              `}>
                {computerChoice ? getChoiceIcon(computerChoice) : '?'}
              </div>
            </div>
          </div>
        </div>

        {/* Result Banner */}
        {result && (
          <div className={`text-center mb-6 p-6 rounded-2xl shadow-lg ${
            result === 'win' ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 dark:from-emerald-500/30 dark:via-emerald-400/20 dark:to-emerald-500/30 border-2 border-emerald-500/40' :
            result === 'lose' ? 'bg-gradient-to-r from-red-500/20 via-red-400/10 to-red-500/20 dark:from-red-500/30 dark:via-red-400/20 dark:to-red-500/30 border-2 border-red-500/40' :
            'bg-gradient-to-r from-slate-500/20 via-slate-400/10 to-slate-500/20 dark:from-slate-500/30 dark:via-slate-400/20 dark:to-slate-500/30 border-2 border-slate-500/40'
          }`}>
            <div className={`
              text-3xl font-bold mb-2 flex items-center justify-center gap-2
              ${result === 'win' ? 'text-emerald-600 dark:text-emerald-400' : ''}
              ${result === 'lose' ? 'text-red-600 dark:text-red-400' : ''}
              ${result === 'draw' ? 'text-slate-600 dark:text-slate-400' : ''}
            `}>
              {result === 'win' && (
                <>
                  <Trophy className="w-6 h-6" />
                  <span>You Win!</span>
                  <Trophy className="w-6 h-6" />
                </>
              )}
              {result === 'lose' && (
                <>
                  <Circle className="w-6 h-6" />
                  <span>You Lose!</span>
                  <Circle className="w-6 h-6" />
                </>
              )}
              {result === 'draw' && (
                <>
                  <Minus className="w-6 h-6" />
                  <span>It's a Draw!</span>
                  <Minus className="w-6 h-6" />
                </>
              )}
            </div>
            {result === 'win' && (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Streak continues! Keep going! 🔥</p>
            )}
            {result === 'lose' && (
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Streak broken. Try again!</p>
            )}
            {result === 'draw' && (
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No winner this round</p>
            )}
          </div>
        )}

        {/* Player Choices - VIOLET */}
        {gameState === 'playing' && (
          <div className="bg-gradient-to-br from-violet-50 via-slate-50 to-violet-50 dark:from-violet-950 dark:via-slate-900 dark:to-violet-950 rounded-2xl p-6 border-2 border-violet-300/30 dark:border-violet-700/30 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
            <div className="relative grid grid-cols-3 gap-4 max-w-md mx-auto">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  disabled={playerChoice !== null}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center gap-2
                    bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-800 dark:to-violet-900
                    hover:from-violet-300 hover:to-violet-400 dark:hover:from-violet-700 dark:hover:to-violet-800
                    transition-all duration-300 hover:scale-105 active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    text-violet-700 dark:text-violet-300 font-semibold
                    shadow-lg hover:shadow-xl border-2 border-violet-400/20 dark:border-violet-600/20
                  `}
                >
                  {getChoiceIcon(choice)}
                  <span className="text-sm capitalize font-bold">{choice}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Overlay - VIOLET */}
        {gameState === 'menu' && (
          <div className="absolute inset-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
            <div className="text-center bg-gradient-to-br from-white/95 via-violet-50/95 to-white/95 dark:from-black/95 dark:via-violet-950/95 dark:to-black/95 rounded-2xl p-10 shadow-2xl border-2 border-violet-200/50 dark:border-violet-800/30 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 flex items-center justify-center shadow-lg">
                <Hand className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Festival Clash
              </h2>
              <p className="text-slate-600 dark:text-white/70 mb-2 text-sm">
                Choose your move and out-dance the crowd in a Dinagyang showdown.
              </p>
              <p className="text-slate-500 dark:text-white/60 mb-6 text-xs">
                Build your win streak—lose or draw and the drums reset to zero.
              </p>
              <Button onClick={startGame} variant="default" size="lg" className="bg-violet-600 hover:bg-violet-700 shadow-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Showdown
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions - VIOLET */}
      <div className="bg-gradient-to-br from-white/90 via-violet-50/80 to-white/90 dark:from-zinc-900/90 dark:via-violet-950/80 dark:to-zinc-900/90 backdrop-blur-2xl border-2 border-violet-200/50 dark:border-violet-800/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 dark:bg-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span>How to Play - Festival Clash</span>
          </h3>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 dark:bg-violet-500/20 rounded-lg border border-violet-500/20">
            <Gamepad2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Dinagyang Duel</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-violet-200/30 dark:border-violet-800/20 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Hand className="w-4 h-4" />
                Choose Your Move
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Select <span className="font-semibold">Rock</span>, <span className="font-semibold">Paper</span>, or <span className="font-semibold">Scissors</span>—like picking your Dinagyang dance step.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-violet-200/30 dark:border-violet-800/20 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Game Rules
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold">Rock</span> beats <span className="font-semibold">Scissors</span>, <span className="font-semibold">Scissors</span> beats <span className="font-semibold">Paper</span>, <span className="font-semibold">Paper</span> beats <span className="font-semibold">Rock</span>—the simple rules behind every festival duel.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-violet-200/30 dark:border-violet-800/20 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Build Your Festival Streak
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Win consecutive rounds to build your crowd-cheer streak. Each victory adds +1 to your meter.
              </div>
            </div>
          </div>
          <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-violet-200/30 dark:border-violet-800/20 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              4
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Drumbeat Reset
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Lose or draw and the Dinagyang drumbeat resets to zero—try again to beat your best streak.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const DinosaurGame = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Background Layer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
        className="liquid-ether-container"
      >
        <LiquidEther
          colors={["#4C8C4A", "#98D198", "#70A370"]}
          mouseForce={30}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.3}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <Navbar />

      <main className="pt-16 lg:pt-20 relative z-10">
        {/* Header */}
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-[#F4B942]/10 to-emerald-100 dark:from-emerald-950/90 dark:via-[#F4B942]/5 dark:to-emerald-950/90 border-b border-emerald-200/50 dark:border-emerald-800/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,185,66,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(20,184,166,0.06),transparent_50%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-6 bg-gradient-to-r from-emerald-500/10 via-[#F4B942]/10 to-emerald-500/10 dark:from-emerald-500/20 dark:via-[#F4B942]/20 dark:to-emerald-500/20 backdrop-blur-xl border-2 border-emerald-500/30 dark:border-emerald-400/40 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 text-sm font-bold tracking-wide">
                  Iloilo Fun & Play
                </span>
                <Sparkles className="w-4 h-4 text-[#F4B942] dark:text-[#F4B942]" />
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-[#F4B942] to-emerald-600 dark:from-emerald-400 dark:via-[#F4B942] dark:to-emerald-400 leading-tight">
                Iloilo <span className="text-gradient">Game Arcade</span>
              </h1>
              <p className="text-slate-700/90 dark:text-white/80 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium mb-4">
                Experience Iloilo through interactive mini-games inspired by the City of Love.
              </p>
              <p className="text-slate-600/80 dark:text-white/70 text-base sm:text-lg">
                Navigate the Iloilo River, compete in Plaza Squares, and join the Dinagyang Festival Clash!
              </p>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="relative py-12 lg:py-16 bg-gradient-to-b from-emerald-50/50 via-slate-50 to-emerald-50/50 dark:from-emerald-950/90 dark:via-zinc-950 dark:to-emerald-950/90">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="snake" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-2 border-emerald-500/20 dark:border-emerald-400/20 rounded-2xl p-2 shadow-lg gap-2 ring-1 ring-[#F4B942]/10 h-auto">
                  <TabsTrigger 
                    value="snake" 
                    className="h-auto py-3 text-xs md:text-sm font-bold transition-all duration-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center"
                  >
                    <span className="text-lg md:text-xl">🌊</span>
                    <span className="hidden sm:inline">River Run</span>
                    <span className="sm:hidden">River</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tictactoe" 
                    className="h-auto py-3 text-xs md:text-sm font-bold transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center"
                  >
                    <span className="text-lg md:text-xl">🏛️</span>
                    <span className="hidden sm:inline">Plaza Squares</span>
                    <span className="sm:hidden">Plaza</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rps" 
                    className="h-auto py-3 text-xs md:text-sm font-bold transition-all duration-300 data-[state=active]:bg-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center"
                  >
                    <span className="text-lg md:text-xl">🎉</span>
                    <span className="hidden sm:inline">Festival Clash</span>
                    <span className="sm:hidden">Festival</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="snake" className="mt-0">
                  <SnakeGameComponent />
                </TabsContent>
                <TabsContent value="tictactoe" className="mt-0">
                  <TicTacToeComponent />
                </TabsContent>
                <TabsContent value="rps" className="mt-0">
                  <RockPaperScissorsComponent />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DinosaurGame;
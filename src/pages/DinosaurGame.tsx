import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trophy, Zap } from "lucide-react";
import LiquidEther from "@/components/ui/liquidether";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
}

const DinosaurGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(5);

  // Game state
  const dinoRef = useRef({
    x: 50,
    y: 0,
    width: 50,
    height: 50,
    velocityY: 0,
    isJumping: false,
    groundY: 0,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const cloudsRef = useRef<Array<{ x: number; y: number; width: number }>>([]);
  const groundOffsetRef = useRef(0);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Set ground Y position
    dinoRef.current.groundY = canvas.height - 100;
    dinoRef.current.y = dinoRef.current.groundY;

    // Initialize clouds
    for (let i = 0; i < 5; i++) {
      cloudsRef.current.push({
        x: Math.random() * canvas.width,
        y: 50 + Math.random() * 100,
        width: 40 + Math.random() * 30,
      });
    }

    // Load high score
    const savedHighScore = localStorage.getItem('dinoHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f7f5f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#f7f5f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - 100);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    cloudsRef.current.forEach((cloud) => {
      cloud.x -= gameSpeed * 0.3;
      if (cloud.x + cloud.width < 0) {
        cloud.x = canvas.width;
      }
      drawCloud(ctx, cloud.x, cloud.y, cloud.width);
    });

    // Draw ground
    drawGround(ctx, canvas, groundOffsetRef.current);
    groundOffsetRef.current -= gameSpeed;
    if (groundOffsetRef.current <= -50) {
      groundOffsetRef.current = 0;
    }

    // Update dinosaur
    const dino = dinoRef.current;
    const gravity = 0.8;
    dino.velocityY += gravity;
    dino.y += dino.velocityY;

    // Ground collision
    if (dino.y >= dino.groundY) {
      dino.y = dino.groundY;
      dino.velocityY = 0;
      dino.isJumping = false;
    }

    // Draw dinosaur
    drawDinosaur(ctx, dino.x, dino.y, dino.width, dino.height);

    // Update obstacles
    if (Math.random() < 0.005) {
      obstaclesRef.current.push({
        x: canvas.width,
        width: 30,
        height: 50,
        type: Math.random() > 0.7 ? 'bird' : 'cactus',
      });
    }

    obstaclesRef.current.forEach((obstacle, index) => {
      obstacle.x -= gameSpeed;

      // Draw obstacle
      if (obstacle.type === 'cactus') {
        drawCactus(ctx, obstacle.x, dino.groundY, obstacle.width, obstacle.height);
      } else {
        drawBird(ctx, obstacle.x, dino.groundY - 30, obstacle.width, obstacle.height);
      }

      // Collision detection
      if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < dino.groundY - obstacle.height &&
        dino.y + dino.height > dino.groundY - obstacle.height
      ) {
        // Game over
        setGameState('gameover');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('dinoHighScore', score.toString());
        }
        return;
      }

      // Remove off-screen obstacles
      if (obstacle.x + obstacle.width < 0) {
        obstaclesRef.current.splice(index, 1);
        setScore((prev) => prev + 1);
      }
    });

    // Increase game speed
    if (score > 0 && score % 10 === 0) {
      setGameSpeed((prev) => Math.min(prev + 0.1, 15));
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, highScore, gameSpeed]);

  // Start game loop when playing
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'menu') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        } else if (gameState === 'gameover') {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const jump = () => {
    if (!dinoRef.current.isJumping && gameState === 'playing') {
      dinoRef.current.velocityY = -15;
      dinoRef.current.isJumping = true;
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setGameSpeed(5);
    obstaclesRef.current = [];
    dinoRef.current.y = dinoRef.current.groundY;
    dinoRef.current.velocityY = 0;
    dinoRef.current.isJumping = false;
    groundOffsetRef.current = 0;
  };

  const resetGame = () => {
    startGame();
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  // Drawing functions
  const drawDinosaur = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = '#4C8C4A';
    ctx.fillRect(x, y - height, width, height);
    
    // Head
    ctx.fillRect(x + width - 20, y - height - 10, 20, 15);
    
    // Eye
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + width - 15, y - height - 8, 5, 5);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + width - 13, y - height - 6, 2, 2);
    
    // Legs
    ctx.fillStyle = '#4C8C4A';
    const legOffset = Math.sin(Date.now() / 100) * 5;
    ctx.fillRect(x + 5, y - 10, 8, 10);
    ctx.fillRect(x + 15, y - 10 + legOffset, 8, 10);
  };

  const drawCactus = (ctx: CanvasRenderingContext2D, x: number, groundY: number, width: number, height: number) => {
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(x, groundY - height, width, height);
    
    // Cactus arms
    ctx.fillRect(x - 8, groundY - height + 20, 12, 8);
    ctx.fillRect(x + width - 4, groundY - height + 30, 12, 8);
    
    // Spikes
    ctx.strokeStyle = '#1a3009';
    ctx.lineWidth = 2;
    for (let i = 0; i < height; i += 15) {
      ctx.beginPath();
      ctx.moveTo(x, groundY - height + i);
      ctx.lineTo(x - 3, groundY - height + i);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + width, groundY - height + i);
      ctx.lineTo(x + width + 3, groundY - height + i);
      ctx.stroke();
    }
  };

  const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const wingOffset = Math.sin(Date.now() / 50) * 5;
    ctx.fillStyle = '#8B4513';
    
    // Body
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + wingOffset, width * 0.6, height * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width + 8, y - 3);
    ctx.lineTo(x + width, y + 3);
    ctx.fill();
  };

  const drawGround = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, offset: number) => {
    const groundY = canvas.height - 100;
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, groundY, canvas.width, 100);
    
    // Ground pattern
    ctx.strokeStyle = '#6B5B3D';
    ctx.lineWidth = 2;
    for (let x = offset; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

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
        <section className="relative overflow-hidden py-8 lg:py-12 bg-slate-100 dark:bg-emerald-950/90 border-b border-black/10 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-black/55 dark:via-emerald-950/70 dark:to-black/55" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Dinosaur <span className="text-gradient">Game</span>
            </h1>
            <p className="text-slate-700/80 dark:text-white/70 text-lg">
              Jump over obstacles and see how far you can go!
            </p>
          </div>
        </section>

        {/* Game Section */}
        <section className="relative py-12 lg:py-16 bg-slate-100 dark:bg-emerald-950/90">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Game Stats */}
              <div className="flex justify-between items-center mb-6 bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {score}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-white/70">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#F4B942] dark:text-[#F4B942] flex items-center gap-1">
                      <Trophy className="w-5 h-5" />
                      {highScore}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-white/70">Best</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-coral dark:text-coral flex items-center gap-1">
                      <Zap className="w-5 h-5" />
                      {gameSpeed.toFixed(1)}x
                    </div>
                    <div className="text-xs text-slate-600 dark:text-white/70">Speed</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {gameState === 'playing' && (
                    <Button onClick={togglePause} variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {gameState === 'paused' && (
                    <Button onClick={togglePause} variant="teal" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  {(gameState === 'menu' || gameState === 'gameover') && (
                    <Button onClick={startGame} variant="teal" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      {gameState === 'gameover' ? 'Play Again' : 'Start'}
                    </Button>
                  )}
                  {gameState === 'gameover' && (
                    <Button onClick={resetGame} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Game Canvas */}
              <div className="relative bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-400/30"
                  style={{ maxHeight: '400px' }}
                />

                {/* Menu Overlay */}
                {gameState === 'menu' && (
                  <div className="absolute inset-6 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                    <div className="text-center bg-white/90 dark:bg-black/90 rounded-2xl p-8 shadow-2xl">
                      <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Ready to Play?
                      </h2>
                      <p className="text-slate-600 dark:text-white/70 mb-6">
                        Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">↑</kbd> to jump
                      </p>
                      <Button onClick={startGame} variant="teal" size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </div>
                )}

                {/* Game Over Overlay */}
                {gameState === 'gameover' && (
                  <div className="absolute inset-6 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
                    <div className="text-center bg-white/90 dark:bg-black/90 rounded-2xl p-8 shadow-2xl">
                      <h2 className="font-display text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Game Over!
                      </h2>
                      <p className="text-slate-600 dark:text-white/70 mb-2">
                        Your Score: <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
                      </p>
                      {score === highScore && score > 0 && (
                        <p className="text-[#F4B942] font-bold mb-4">🎉 New High Score! 🎉</p>
                      )}
                      <div className="flex gap-2 justify-center mt-6">
                        <Button onClick={resetGame} variant="teal" size="lg">
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
                      <Button onClick={togglePause} variant="teal" size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                  How to Play
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-slate-700 dark:text-white/70">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Jump</div>
                      <div className="text-sm">Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">↑</kbd> to jump over obstacles</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Avoid Obstacles</div>
                      <div className="text-sm">Jump over cacti and birds to keep running</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Score Points</div>
                      <div className="text-sm">Each obstacle you pass gives you 1 point</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Speed Up</div>
                      <div className="text-sm">Game speed increases every 10 points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DinosaurGame;



import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface BreathingGameProps {
  user: User;
}

const BreathingGame = ({ user }: BreathingGameProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [breathingPattern, setBreathingPattern] = useState({
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  });

  const patterns = {
    "4-4-6-2": { inhale: 4, hold: 4, exhale: 6, rest: 2, name: "Calming Breath" },
    "4-7-8-0": { inhale: 4, hold: 7, exhale: 8, rest: 0, name: "Sleep Breath" },
    "6-2-6-2": { inhale: 6, hold: 2, exhale: 6, rest: 2, name: "Balanced Breath" },
    "4-4-4-4": { inhale: 4, hold: 4, exhale: 4, rest: 4, name: "Box Breathing" },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (phase === "inhale") {
        if (breathingPattern.hold > 0) {
          setPhase("hold");
          setTimeLeft(breathingPattern.hold);
        } else {
          setPhase("exhale");
          setTimeLeft(breathingPattern.exhale);
        }
      } else if (phase === "hold") {
        setPhase("exhale");
        setTimeLeft(breathingPattern.exhale);
      } else if (phase === "exhale") {
        if (breathingPattern.rest > 0) {
          setPhase("rest");
          setTimeLeft(breathingPattern.rest);
        } else {
          // Complete cycle
          setCycle(cycle + 1);
          if (cycle + 1 >= totalCycles) {
            setIsActive(false);
            setPhase("inhale");
            setTimeLeft(breathingPattern.inhale);
            setCycle(0);
          } else {
            setPhase("inhale");
            setTimeLeft(breathingPattern.inhale);
          }
        }
      } else if (phase === "rest") {
        // Complete cycle
        setCycle(cycle + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          setPhase("inhale");
          setTimeLeft(breathingPattern.inhale);
          setCycle(0);
        } else {
          setPhase("inhale");
          setTimeLeft(breathingPattern.inhale);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle, totalCycles, breathingPattern]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(breathingPattern.inhale);
    setCycle(0);
  };

  const pauseBreathing = () => {
    setIsActive(false);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(breathingPattern.inhale);
    setCycle(0);
  };

  const getPhaseInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "rest":
        return "Rest";
      default:
        return "";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-blue-600";
      case "hold":
        return "from-purple-400 to-purple-600";
      case "exhale":
        return "from-green-400 to-green-600";
      case "rest":
        return "from-gray-400 to-gray-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getCircleScale = () => {
    if (!isActive) return "scale-100";
    
    switch (phase) {
      case "inhale":
        return "scale-150";
      case "hold":
        return "scale-150";
      case "exhale":
        return "scale-75";
      case "rest":
        return "scale-100";
      default:
        return "scale-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Breathing Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Breathing Exercise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Guide */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} 
                           transition-all duration-1000 ease-in-out ${getCircleScale()}
                           flex items-center justify-center shadow-lg`}
              >
                <div className="text-white font-bold text-xl">
                  {timeLeft}
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {getPhaseInstructions()}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline">
                  Cycle {cycle + 1} of {totalCycles}
                </Badge>
                <Badge variant="secondary">
                  {Math.round(((cycle * 4 + (phase === "inhale" ? 0 : phase === "hold" ? 1 : phase === "exhale" ? 2 : 3)) / (totalCycles * 4)) * 100)}% Complete
                </Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {!isActive ? (
                <Button onClick={startBreathing} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseBreathing} size="lg" variant="outline">
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetBreathing} size="lg" variant="outline">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Breathing Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(patterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => {
                  setBreathingPattern(pattern);
                  resetBreathing();
                }}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  JSON.stringify(breathingPattern) === JSON.stringify(pattern)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h3 className="font-medium mb-2">{pattern.name}</h3>
                <p className="text-sm text-gray-600">
                  Inhale: {pattern.inhale}s • 
                  {pattern.hold > 0 && ` Hold: ${pattern.hold}s •`}
                  Exhale: {pattern.exhale}s
                  {pattern.rest > 0 && ` • Rest: ${pattern.rest}s`}
                </p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t">
            <label className="block text-sm font-medium mb-2">
              Number of cycles: {totalCycles}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={totalCycles}
              onChange={(e) => setTotalCycles(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Breathing Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-green-700">Physical Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduces heart rate and blood pressure</li>
                <li>• Improves oxygen flow</li>
                <li>• Relaxes muscle tension</li>
                <li>• Boosts immune system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-blue-700">Mental Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduces anxiety and stress</li>
                <li>• Improves focus and clarity</li>
                <li>• Promotes emotional regulation</li>
                <li>• Enhances sleep quality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingGame;

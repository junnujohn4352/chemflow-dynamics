import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, Atom, Beaker, ArrowLeft } from "lucide-react";

// Define Chemistry Elements
const elements = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, description: "Lightest element, forms water with oxygen" },
  { symbol: "He", name: "Helium", atomicNumber: 2, description: "Noble gas used in balloons" },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, description: "Alkali metal used in batteries" },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, description: "Alkaline earth metal, toxic" },
  { symbol: "B", name: "Boron", atomicNumber: 5, description: "Metalloid used in detergents" },
  { symbol: "C", name: "Carbon", atomicNumber: 6, description: "Forms the basis of organic chemistry" },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, description: "Major component of Earth's atmosphere" },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, description: "Essential for respiration" },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, description: "Most reactive non-metal" },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, description: "Noble gas used in signs" },
  { symbol: "Na", name: "Sodium", atomicNumber: 11, description: "Alkali metal that reacts vigorously with water" },
  { symbol: "Mg", name: "Magnesium", atomicNumber: 12, description: "Essential for chlorophyll in plants" },
  { symbol: "Al", name: "Aluminum", atomicNumber: 13, description: "Common lightweight metal" },
  { symbol: "Si", name: "Silicon", atomicNumber: 14, description: "Used in electronics and glass" },
  { symbol: "P", name: "Phosphorus", atomicNumber: 15, description: "Essential for DNA and bones" },
  { symbol: "S", name: "Sulfur", atomicNumber: 16, description: "Yellow non-metal with distinctive smell" },
  { symbol: "Cl", name: "Chlorine", atomicNumber: 17, description: "Used for water purification" },
  { symbol: "Ar", name: "Argon", atomicNumber: 18, description: "Noble gas, third most abundant in Earth's atmosphere" },
  { symbol: "K", name: "Potassium", atomicNumber: 19, description: "Essential for nerve function" },
  { symbol: "Ca", name: "Calcium", atomicNumber: 20, description: "Essential for bones and teeth" },
];

// Define Chemical Reactions
const reactions = [
  { 
    reactants: ["H", "O"], 
    products: ["H2O"], 
    name: "Hydrogen + Oxygen → Water",
    description: "This is the formation of water from hydrogen and oxygen gases."
  },
  { 
    reactants: ["Na", "Cl"], 
    products: ["NaCl"], 
    name: "Sodium + Chlorine → Salt",
    description: "This forms table salt from sodium metal and chlorine gas."
  },
  { 
    reactants: ["C", "O"], 
    products: ["CO2"], 
    name: "Carbon + Oxygen → Carbon Dioxide",
    description: "Complete combustion of carbon in oxygen."
  },
  { 
    reactants: ["H", "N"], 
    products: ["NH3"], 
    name: "Hydrogen + Nitrogen → Ammonia",
    description: "The Haber process for ammonia synthesis."
  },
  { 
    reactants: ["Ca", "O"], 
    products: ["CaO"], 
    name: "Calcium + Oxygen → Calcium Oxide",
    description: "Formation of quicklime from calcium and oxygen."
  }
];

const ChemistryGame = () => {
  const [gameMode, setGameMode] = useState<'elements' | 'reactions'>('elements');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const { toast } = useToast();

  // Generate questions based on game mode
  const questions = gameMode === 'elements' 
    ? elements.map(el => ({ 
        question: `What is the name of element with symbol ${el.symbol}?`, 
        answer: el.name,
        options: [el.name, ...getRandomElements(3, el.name).map(e => e.name)]
      }))
    : reactions.map(rx => ({
        question: `What forms when ${rx.reactants.join(" + ")} react?`,
        answer: rx.products[0],
        options: [rx.products[0], ...getRandomReactions(3, rx.products[0]).map(r => r.products[0])]
      }));

  // Shuffle options
  for (let q of questions) {
    q.options = shuffleArray(q.options);
  }

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          endGame();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, timeLeft, gameOver]);

  // Helper function to get random elements
  function getRandomElements(count: number, excludeName: string) {
    const filtered = elements.filter(e => e.name !== excludeName);
    return shuffleArray(filtered).slice(0, count);
  }

  // Helper function to get random reactions
  function getRandomReactions(count: number, excludeProduct: string) {
    const filtered = reactions.filter(r => r.products[0] !== excludeProduct);
    return shuffleArray(filtered).slice(0, count);
  }

  // Shuffle array
  function shuffleArray(array: any[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setFeedback('');
    setTimeLeft(30);
    setGameOver(false);
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    toast({
      title: "Game Over!",
      description: `Your final score: ${score} out of ${questions.length}`,
      variant: "default",
    });
  };

  // Check answer
  const checkAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption.toLowerCase() === questions[currentQuestion].answer.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct!');
      toast({
        title: "Correct!",
        description: `+1 point`,
        variant: "success",
      });
    } else {
      setFeedback(`Wrong! The correct answer is ${questions[currentQuestion].answer}`);
      toast({
        title: "Incorrect",
        description: `The correct answer is ${questions[currentQuestion].answer}`,
        variant: "destructive",
      });
    }
    
    // Move to next question or end game
    setTimeout(() => {
      setFeedback('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        endGame();
      }
    }, 1500);
  };

  // Select game mode
  const selectMode = (mode: 'elements' | 'reactions') => {
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
        
        <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-gray-100 pb-6">
            <div className="flex justify-center space-x-2 mb-4">
              <FlaskConical className="h-10 w-10 text-blue-500" />
              <Atom className="h-10 w-10 text-purple-500" />
              <Beaker className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              ChemFlow Chemistry Game
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg mt-2">
              Test your knowledge of chemical elements and reactions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {!gameStarted ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium mb-2">Select Game Mode</h3>
                  <p className="text-gray-600">Choose what you want to be tested on</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${gameMode === 'elements' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => selectMode('elements')}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Atom className="h-5 w-5 mr-2 text-blue-500" />
                        Elements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Identify chemical elements by their symbols, names, and properties
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${gameMode === 'reactions' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => selectMode('reactions')}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <FlaskConical className="h-5 w-5 mr-2 text-purple-500" />
                        Reactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Test your knowledge of chemical reactions and the products they form
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Game Header */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-purple-50 border-purple-200 text-purple-700">
                    Score: {score}
                  </Badge>
                  
                  <Badge variant="outline" className={`px-3 py-1 text-sm ${
                    timeLeft > 10 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-red-50 border-red-200 text-red-700 animate-pulse"
                  }`}>
                    Time: {timeLeft}s
                  </Badge>
                </div>
                
                {!gameOver ? (
                  <>
                    {/* Question */}
                    <div className="text-center py-4">
                      <h3 className="text-xl font-medium mb-2">{questions[currentQuestion].question}</h3>
                      {feedback && (
                        <p className={`mt-2 font-medium ${
                          feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {feedback}
                        </p>
                      )}
                    </div>
                    
                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions[currentQuestion].options.map((option, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="py-6 text-left justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => checkAnswer(option)}
                          disabled={!!feedback}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                    <p className="text-xl mb-4">Your final score: {score} out of {questions.length}</p>
                    <Button 
                      onClick={startGame}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {gameMode === 'elements' ? 'Testing knowledge of the periodic table' : 'Testing knowledge of chemical reactions'}
            </p>
            {gameStarted && !gameOver && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={endGame}
                className="text-gray-500 hover:text-gray-700"
              >
                End Game
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChemistryGame;


import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, FileText, BookMarked, GraduationCap, Play, Star, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Sample learning resources data
const videoLessons = [
  {
    id: 'vid1',
    title: 'Introduction to ChemFlow',
    level: 'Beginner',
    duration: '8:24',
    tags: ['ChemFlow Basics'],
    type: 'Tutorial',
    rating: '4.9',
    thumbnail: 'blue-400',
    completed: false
  },
  {
    id: 'vid2',
    title: 'VLE Calculations Explained',
    level: 'Intermediate',
    duration: '12:37',
    tags: ['Thermodynamics', 'VLE'],
    type: 'Tutorial',
    rating: '4.7',
    thumbnail: 'purple-500',
    completed: false
  },
  {
    id: 'vid3',
    title: 'Advanced Reactor Modeling',
    level: 'Advanced',
    duration: '24:18',
    tags: ['Reactors', 'Modeling'],
    type: 'Tutorial',
    rating: '4.8',
    thumbnail: 'indigo-500',
    completed: false
  }
];

const recentVideos = [
  { id: 'rec1', title: 'Distillation Column Design', duration: '15:42', thumbnail: 'blue-300' },
  { id: 'rec2', title: 'Heat Exchanger Basics', duration: '8:12', thumbnail: 'indigo-400' },
  { id: 'rec3', title: 'Process Control Fundamentals', duration: '18:30', thumbnail: 'purple-400' },
  { id: 'rec4', title: 'Safety in Chemical Plants', duration: '12:45', thumbnail: 'blue-500' }
];

const textbooks = [
  { id: 'tb1', title: 'Chemical Engineering Thermodynamics', author: 'Smith & Van Ness', currentChapter: 3 },
  { id: 'tb2', title: 'Unit Operations of Chemical Engineering', author: 'McCabe & Smith', currentChapter: 1 },
  { id: 'tb3', title: 'Chemical Reaction Engineering', author: 'Levenspiel', currentChapter: 5 },
  { id: 'tb4', title: 'Transport Phenomena', author: 'Bird, Stewart & Lightfoot', currentChapter: 2 },
  { id: 'tb5', title: 'Process Dynamics and Control', author: 'Seborg & Edgar', currentChapter: 4 },
  { id: 'tb6', title: 'Separation Processes', author: 'Seader & Henley', currentChapter: 7 }
];

const tutorials = [
  { id: 'tut1', title: 'Getting Started with ChemFlow', level: 'Beginner', duration: '15 min', type: 'Interactive' },
  { id: 'tut2', title: 'Mass Balance Calculations', level: 'Beginner', duration: '20 min', type: 'Hands-on' },
  { id: 'tut3', title: 'Fluid Flow in Pipes', level: 'Intermediate', duration: '25 min', type: 'Case Study' },
  { id: 'tut4', title: 'Heat Exchanger Design', level: 'Intermediate', duration: '30 min', type: 'Simulation' },
  { id: 'tut5', title: 'Advanced Distillation', level: 'Advanced', duration: '40 min', type: 'Interactive' },
  { id: 'tut6', title: 'Chemical Reactor Design', level: 'Advanced', duration: '45 min', type: 'Case Study' }
];

const practiceProblems = [
  { id: 'pp1', title: 'Material Balances in Distillation', count: '10', level: 'Intermediate', progress: 25 },
  { id: 'pp2', title: 'Pressure Drop Calculations', count: '8', level: 'Beginner', progress: 100 },
  { id: 'pp3', title: 'Reactor Sizing Problems', count: '12', level: 'Advanced', progress: 50 },
  { id: 'pp4', title: 'Heat Transfer Analysis', count: '6', level: 'Intermediate', progress: 75 }
];

const quizzes = [
  { id: 'qz1', title: 'Thermodynamics Fundamentals', questions: '20', duration: '30 min', difficulty: 'Medium' },
  { id: 'qz2', title: 'Fluid Mechanics', questions: '15', duration: '20 min', difficulty: 'Easy' },
  { id: 'qz3', title: 'Heat Transfer', questions: '25', duration: '40 min', difficulty: 'Hard' },
  { id: 'qz4', title: 'Mass Transfer', questions: '18', duration: '25 min', difficulty: 'Medium' },
  { id: 'qz5', title: 'Chemical Reaction Engineering', questions: '22', duration: '35 min', difficulty: 'Hard' },
  { id: 'qz6', title: 'Process Control', questions: '16', duration: '30 min', difficulty: 'Medium' }
];

const Resources: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [myVideos, setMyVideos] = useState(videoLessons);
  const videoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Track visible items for animation
  const [visibleItems, setVisibleItems] = useState<{[key: number]: boolean}>({});
  const observerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = Number(entry.target.getAttribute('data-id'));
        if (entry.isIntersecting) {
          setVisibleItems(prev => ({...prev, [id]: true}));
        }
      });
    }, { threshold: 0.1 });
    
    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      observerRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  const playVideo = (index: number) => {
    // Mark the video as playing
    setActiveVideo(index);
    
    // Add the playing class for animation
    videoRefs.current[index]?.classList.add('playing');
    
    // Show toast notification
    toast({
      title: `Playing: ${myVideos[index].title}`,
      description: "Video lesson started",
    });
  };

  const markAsCompleted = (id: string) => {
    setMyVideos(prev => 
      prev.map(video => 
        video.id === id 
          ? {...video, completed: true} 
          : video
      )
    );
    
    toast({
      title: "Lesson completed!",
      description: "Your progress has been saved",
      variant: "success",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real app, this would filter results
  };

  const startTutorial = (tutorial: any) => {
    toast({
      title: `Starting Tutorial: ${tutorial.title}`,
      description: `${tutorial.level} • ${tutorial.duration}`,
    });
  };

  const startQuiz = (quiz: any) => {
    toast({
      title: `Starting Quiz: ${quiz.title}`,
      description: `${quiz.questions} questions • ${quiz.duration}`,
    });
  };

  const openTextbook = (textbook: any) => {
    toast({
      title: `Opening Textbook: ${textbook.title}`,
      description: `Currently at Chapter ${textbook.currentChapter}`,
    });
  };

  const continuePractice = (problem: any) => {
    toast({
      title: problem.progress === 100 ? `Reviewing: ${problem.title}` : `Continuing: ${problem.title}`,
      description: problem.progress === 100 ? "Review your completed work" : `Current progress: ${problem.progress}%`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Educational materials for chemical engineering students and professionals
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Search resources..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" onClick={() => toast({ title: "My Learning Path", description: "Your personalized learning journey" })}>
            <GraduationCap className="h-4 w-4 mr-2" />
            My Learning Path
          </Button>
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="videos">Video Lessons</TabsTrigger>
          <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="problems">Practice Problems</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="animate-fade-in space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Video Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {myVideos.map((video, i) => {
                const isVideoVisible = visibleItems[i] || false;
                return (
                  <div 
                    key={i}
                    ref={el => observerRefs.current[i] = el} 
                    data-id={i}
                    className={`transition-all duration-500 transform ${isVideoVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    <div 
                      ref={el => videoRefs.current[i] = el}
                      className={`group relative aspect-video bg-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg mb-4 ${activeVideo === i ? 'ring-2 ring-primary' : ''}`}
                    >
                      {/* Fake video thumbnail */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${video.thumbnail} to-purple-500 opacity-70`}></div>
                      
                      {/* Fake video title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <Badge className="mb-2">{video.level}</Badge>
                        <h3 className="text-white font-medium">{video.title}</h3>
                      </div>
                      
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          onClick={() => playVideo(i)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white transform transition-transform group-hover:scale-110"
                        >
                          <Play className="h-8 w-8 fill-white" />
                        </Button>
                      </div>
                      
                      {/* Completed badge */}
                      {video.completed && (
                        <div className="absolute top-2 right-2 bg-success/90 px-2 py-1 rounded text-xs text-white flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      )}

                      {/* Video duration */}
                      {!video.completed && (
                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                          {video.duration}
                        </div>
                      )}
                      
                      {/* Playing indicator */}
                      <div className="playing-indicator hidden absolute bottom-0 left-0 right-0 h-1 bg-red-500 
                        before:absolute before:h-full before:w-1/3 before:bg-white/30 before:animate-progress"></div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {video.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className={idx === 0 ? 'mr-2' : ''}>
                          {tag}
                        </Badge>
                      ))}
                      <Badge variant="outline">{video.type}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                        <span className="ml-1 font-medium">{video.rating}</span>
                        <span className="text-muted-foreground">/5.0</span>
                      </div>
                      <div className="flex gap-2">
                        {activeVideo === i && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsCompleted(video.id)} 
                            className="animate-fade-in"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1 group"
                          onClick={() => playVideo(i)}
                        >
                          <Play className="h-3 w-3 transition-transform group-hover:scale-125" />
                          {i === 2 ? 'Watch Series' : 'Watch Video'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Recently Added</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {recentVideos.map((video, i) => {
                const itemIndex = i + 3; // Continue the index from previous items
                const isVideoVisible = visibleItems[itemIndex] || false;
                return (
                  <div 
                    key={i}
                    ref={el => observerRefs.current[itemIndex] = el} 
                    data-id={itemIndex}
                    className={`transition-all duration-500 transform ${isVideoVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover-scale`}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                    onClick={() => toast({
                      title: `Playing: ${video.title}`,
                      description: `Duration: ${video.duration}`
                    })}
                  >
                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden hover:shadow-md mb-2 cursor-pointer">
                      {/* Simplified thumbnail */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${video.thumbnail} to-indigo-400 opacity-60`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white transform transition-all hover:scale-110" />
                      </div>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="textbooks" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textbooks.map((book, i) => (
              <Card 
                key={i} 
                className="hover:shadow-md transition-all duration-300 hover-scale"
                onClick={() => openTextbook(book)}
              >
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded">
                    <BookMarked className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{book.title}</CardTitle>
                    <CardDescription>
                      {book.author}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      Chapter {book.currentChapter} Available
                    </Badge>
                    <Button size="sm" variant="outline">
                      Read Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, i) => (
              <Card 
                key={i} 
                className="hover:shadow-md transition-all duration-300 hover-scale"
                onClick={() => startTutorial(tutorial)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">{tutorial.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {tutorial.level} • {tutorial.duration} • {tutorial.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="sm" 
                    className="w-full group"
                  >
                    <span>Start Tutorial</span>
                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {practiceProblems.map((problem, i) => (
              <Card 
                key={i} 
                className="hover:shadow-md transition-all duration-300"
                onClick={() => continuePractice(problem)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{problem.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {problem.count} problems • {problem.level}
                      </CardDescription>
                    </div>
                    <Badge variant={problem.progress === 100 ? "success" : "outline"}>
                      {problem.progress === 100 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${problem.progress}%` }}
                    ></div>
                  </div>
                  <Button size="sm" className="w-full">
                    {problem.progress === 100 ? "Review Solutions" : "Continue Practice"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz, i) => (
              <Card 
                key={i} 
                className="hover:shadow-md transition-all duration-300 hover-scale"
                onClick={() => startQuiz(quiz)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{quiz.title} Quiz</CardTitle>
                  <CardDescription>
                    {quiz.questions} questions • {quiz.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 text-sm font-medium">
                        {quiz.difficulty} difficulty
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      className="group"
                    >
                      <span>Take Quiz</span>
                      <div className="ml-1 transform transition-transform group-hover:translate-x-1">→</div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;

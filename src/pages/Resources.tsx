
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, FileText, BookMarked, GraduationCap, Play, Star, Clock } from "lucide-react";

const Resources: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLDivElement | null>>([]);
  
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
    // In a real implementation, this would actually play a video
    setActiveVideo(index);
    
    // Simulate video playback with a fake player UI highlight
    videoRefs.current[index]?.classList.add('playing');
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
            />
          </div>
          <Button variant="outline">
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
              {['Introduction to ChemFlow', 'VLE Calculations Explained', 'Advanced Reactor Modeling'].map((title, i) => {
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
                      className="group relative aspect-video bg-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg mb-4"
                    >
                      {/* Fake video thumbnail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-70"></div>
                      
                      {/* Fake video title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <Badge className="mb-2">{i === 0 ? 'Beginner' : i === 1 ? 'Intermediate' : 'Advanced'}</Badge>
                        <h3 className="text-white font-medium">{title}</h3>
                      </div>
                      
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          onClick={() => playVideo(i)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white"
                        >
                          <Play className="h-8 w-8 fill-white" />
                        </Button>
                      </div>
                      
                      {/* Video duration */}
                      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                        {['8:24', '12:37', '24:18'][i]}
                      </div>
                      
                      {/* Playing indicator */}
                      <div className="playing-indicator hidden absolute bottom-0 left-0 right-0 h-1 bg-red-500 
                        before:absolute before:h-full before:w-1/3 before:bg-white/30 before:animate-progress"></div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Badge variant="outline" className="mr-2">{i === 0 ? 'ChemFlow Basics' : i === 1 ? 'Thermodynamics, VLE' : 'Reactors, Modeling'}</Badge>
                      <Badge variant="outline">Tutorial</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                        <span className="ml-1 font-medium">{['4.9', '4.7', '4.8'][i]}</span>
                        <span className="text-muted-foreground">/5.0</span>
                      </div>
                      <Button size="sm" className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        Watch {i === 2 ? 'Series' : 'Video'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Recently Added</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Distillation Column Design', 'Heat Exchanger Basics', 'Process Control Fundamentals', 'Safety in Chemical Plants'].map((title, i) => {
                const itemIndex = i + 3; // Continue the index from previous items
                const isVideoVisible = visibleItems[itemIndex] || false;
                return (
                  <div 
                    key={i}
                    ref={el => observerRefs.current[itemIndex] = el} 
                    data-id={itemIndex}
                    className={`transition-all duration-500 transform ${isVideoVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden hover:shadow-md mb-2">
                      {/* Simplified thumbnail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-indigo-400 opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {['15:42', '8:12', '18:30', '12:45'][i]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="textbooks" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Chemical Engineering Thermodynamics', 'Unit Operations of Chemical Engineering', 'Chemical Reaction Engineering', 'Transport Phenomena', 'Process Dynamics and Control', 'Separation Processes'].map((title, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded">
                    <BookMarked className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>
                      {['Smith & Van Ness', 'McCabe & Smith', 'Levenspiel', 'Bird, Stewart & Lightfoot', 'Seborg & Edgar', 'Seader & Henley'][i]}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      Chapter {Math.floor(Math.random() * 20) + 1} Available
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
            {['Getting Started with ChemFlow', 'Mass Balance Calculations', 'Fluid Flow in Pipes', 'Heat Exchanger Design', 'Advanced Distillation', 'Chemical Reactor Design'].map((title, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">{title}</CardTitle>
                  </div>
                  <CardDescription>
                    {['Beginner', 'Beginner', 'Intermediate', 'Intermediate', 'Advanced', 'Advanced'][i]} • 
                    {[' 15 min', ' 20 min', ' 25 min', ' 30 min', ' 40 min', ' 45 min'][i]} • 
                    {[' Interactive', ' Hands-on', ' Case Study', ' Simulation', ' Interactive', ' Case Study'][i]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full">
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['Material Balances in Distillation', 'Pressure Drop Calculations', 'Reactor Sizing Problems', 'Heat Transfer Analysis'].map((title, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription className="mt-1">
                        {['10 problems', '8 problems', '12 problems', '6 problems'][i]} • 
                        {[' Intermediate', ' Beginner', ' Advanced', ' Intermediate'][i]}
                      </CardDescription>
                    </div>
                    <Badge variant={i === 1 ? "success" : "outline"}>
                      {i === 1 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: [`25%`, `100%`, `50%`, `75%`][i] }}
                    ></div>
                  </div>
                  <Button size="sm" className="w-full">
                    {i === 1 ? "Review Solutions" : "Continue Practice"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Thermodynamics Fundamentals', 'Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Chemical Reaction Engineering', 'Process Control'].map((title, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle>{title} Quiz</CardTitle>
                  <CardDescription>
                    {['20 questions', '15 questions', '25 questions', '18 questions', '22 questions', '16 questions'][i]} • 
                    {[' 30 min', ' 20 min', ' 40 min', ' 25 min', ' 35 min', ' 30 min'][i]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 text-sm font-medium">
                        {['Medium', 'Easy', 'Hard', 'Medium', 'Hard', 'Medium'][i]} difficulty
                      </span>
                    </div>
                    <Button size="sm">
                      Take Quiz
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

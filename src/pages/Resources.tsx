import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, FileText, BookMarked, GraduationCap, Play, Star, Clock, CheckCircle, Download, BookOpenCheck, Award, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

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
    completed: false,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
    completed: false,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
    completed: false,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

const recentVideos = [
  { id: 'rec1', title: 'Distillation Column Design', duration: '15:42', thumbnail: 'blue-300', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 'rec2', title: 'Heat Exchanger Basics', duration: '8:12', thumbnail: 'indigo-400', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 'rec3', title: 'Process Control Fundamentals', duration: '18:30', thumbnail: 'purple-400', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 'rec4', title: 'Safety in Chemical Plants', duration: '12:45', thumbnail: 'blue-500', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
];

const textbooks = [
  { id: 'tb1', title: 'Chemical Engineering Thermodynamics', author: 'Smith & Van Ness', currentChapter: 3, url: '/files/thermodynamics-sample.pdf' },
  { id: 'tb2', title: 'Unit Operations of Chemical Engineering', author: 'McCabe & Smith', currentChapter: 1, url: '/files/unit-operations-sample.pdf' },
  { id: 'tb3', title: 'Chemical Reaction Engineering', author: 'Levenspiel', currentChapter: 5, url: '/files/reaction-engineering-sample.pdf' },
  { id: 'tb4', title: 'Transport Phenomena', author: 'Bird, Stewart & Lightfoot', currentChapter: 2, url: '/files/transport-phenomena-sample.pdf' },
  { id: 'tb5', title: 'Process Dynamics and Control', author: 'Seborg & Edgar', currentChapter: 4, url: '/files/process-control-sample.pdf' },
  { id: 'tb6', title: 'Separation Processes', author: 'Seader & Henley', currentChapter: 7, url: '/files/separation-processes-sample.pdf' }
];

const tutorials = [
  { id: 'tut1', title: 'Getting Started with ChemFlow', level: 'Beginner', duration: '15 min', type: 'Interactive', url: '/tutorials/getting-started' },
  { id: 'tut2', title: 'Mass Balance Calculations', level: 'Beginner', duration: '20 min', type: 'Hands-on', url: '/tutorials/mass-balance' },
  { id: 'tut3', title: 'Fluid Flow in Pipes', level: 'Intermediate', duration: '25 min', type: 'Case Study', url: '/tutorials/fluid-flow' },
  { id: 'tut4', title: 'Heat Exchanger Design', level: 'Intermediate', duration: '30 min', type: 'Simulation', url: '/tutorials/heat-exchanger' },
  { id: 'tut5', title: 'Advanced Distillation', level: 'Advanced', duration: '40 min', type: 'Interactive', url: '/tutorials/advanced-distillation' },
  { id: 'tut6', title: 'Chemical Reactor Design', level: 'Advanced', duration: '45 min', type: 'Case Study', url: '/tutorials/reactor-design' }
];

const practiceProblems = [
  { id: 'pp1', title: 'Material Balances in Distillation', count: '10', level: 'Intermediate', progress: 25, url: '/practice/material-balances' },
  { id: 'pp2', title: 'Pressure Drop Calculations', count: '8', level: 'Beginner', progress: 100, url: '/practice/pressure-drop' },
  { id: 'pp3', title: 'Reactor Sizing Problems', count: '12', level: 'Advanced', progress: 50, url: '/practice/reactor-sizing' },
  { id: 'pp4', title: 'Heat Transfer Analysis', count: '6', level: 'Intermediate', progress: 75, url: '/practice/heat-transfer' }
];

const quizzes = [
  { id: 'qz1', title: 'Thermodynamics Fundamentals', questions: '20', duration: '30 min', difficulty: 'Medium', url: '/quizzes/thermodynamics' },
  { id: 'qz2', title: 'Fluid Mechanics', questions: '15', duration: '20 min', difficulty: 'Easy', url: '/quizzes/fluid-mechanics' },
  { id: 'qz3', title: 'Heat Transfer', questions: '25', duration: '40 min', difficulty: 'Hard', url: '/quizzes/heat-transfer' },
  { id: 'qz4', title: 'Mass Transfer', questions: '18', duration: '25 min', difficulty: 'Medium', url: '/quizzes/mass-transfer' },
  { id: 'qz5', title: 'Chemical Reaction Engineering', questions: '22', duration: '35 min', difficulty: 'Hard', url: '/quizzes/reaction-engineering' },
  { id: 'qz6', title: 'Process Control', questions: '16', duration: '30 min', difficulty: 'Medium', url: '/quizzes/process-control' }
];

// New learning paths data
const learningPaths = [
  {
    id: 'lp1',
    title: 'Process Design Fundamentals',
    description: 'Master the basics of chemical process design from first principles to flowsheets',
    progress: 35,
    modules: 8,
    icon: <BookOpenCheck className="h-6 w-6 text-blue-600" />,
    color: 'blue'
  },
  {
    id: 'lp2',
    title: 'Thermodynamics Specialist',
    description: 'Deep dive into thermodynamic principles and their applications in process engineering',
    progress: 60,
    modules: 12,
    icon: <Brain className="h-6 w-6 text-purple-600" />,
    color: 'purple'
  },
  {
    id: 'lp3',
    title: 'Reaction Engineering Expert',
    description: 'From basic kinetics to complex reactor design and optimization',
    progress: 20,
    modules: 10,
    icon: <Award className="h-6 w-6 text-indigo-600" />,
    color: 'indigo'
  }
];

// Certification tracks
const certifications = [
  {
    id: 'cert1',
    title: 'ChemFlow Process Simulation Fundamentals',
    requirements: ['Complete 5 core tutorials', 'Pass assessment with 80%+', 'Create a working simulation'],
    level: 'Beginner',
    estimatedHours: 20
  },
  {
    id: 'cert2',
    title: 'Advanced Process Optimization',
    requirements: ['Complete optimization track', 'Solve 3 case studies', 'Present optimization project'],
    level: 'Intermediate',
    estimatedHours: 40
  },
  {
    id: 'cert3',
    title: 'ChemFlow Expert Engineer',
    requirements: ['Complete all specialist tracks', 'Pass expert assessment', 'Develop complex process model'],
    level: 'Advanced',
    estimatedHours: 80
  }
];

const Resources: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [myVideos, setMyVideos] = useState(videoLessons);
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const videoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Track visible items for animation
  const [visibleItems, setVisibleItems] = useState<{[key: number]: boolean}>({});
  const observerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (user === null) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access learning resources",
        variant: "default",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  // Load bookmarks
  useEffect(() => {
    if (user?.id) {
      const loadBookmarks = async () => {
        try {
          // This would normally fetch from a bookmarks table
          // For now, we'll use localStorage as a demo
          const savedBookmarks = localStorage.getItem(`bookmarks-${user.id}`);
          if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
          }
        } catch (error) {
          console.error("Failed to load bookmarks:", error);
        }
      };
      
      loadBookmarks();
    }
  }, [user]);

  // Save bookmarks
  const saveBookmarks = (newBookmarks: string[]) => {
    if (user?.id) {
      localStorage.setItem(`bookmarks-${user.id}`, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    }
  };

  const toggleBookmark = (itemId: string) => {
    if (bookmarks.includes(itemId)) {
      saveBookmarks(bookmarks.filter(id => id !== itemId));
      toast({
        title: "Bookmark removed",
        description: "Item removed from your bookmarks",
      });
    } else {
      saveBookmarks([...bookmarks, itemId]);
      toast({
        title: "Bookmark added",
        description: "Item saved to your bookmarks",
        variant: "success",
      });
    }
  };

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
    
    // In a real app, this would open a video player or redirect to the video URL
    window.open(myVideos[index].url, "_blank");
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
    // In a real app, this would navigate to the tutorial
    navigate(tutorial.url);
  };

  const startQuiz = (quiz: any) => {
    toast({
      title: `Starting Quiz: ${quiz.title}`,
      description: `${quiz.questions} questions • ${quiz.duration}`,
    });
    // In a real app, this would navigate to the quiz
    navigate(quiz.url);
  };

  const openTextbook = (textbook: any) => {
    toast({
      title: `Opening Textbook: ${textbook.title}`,
      description: `Currently at Chapter ${textbook.currentChapter}`,
    });
    // In a real app, this might open a PDF or navigate to a reader view
    window.open(textbook.url, "_blank");
  };

  const continuePractice = (problem: any) => {
    toast({
      title: problem.progress === 100 ? `Reviewing: ${problem.title}` : `Continuing: ${problem.title}`,
      description: problem.progress === 100 ? "Review your completed work" : `Current progress: ${problem.progress}%`,
    });
    // In a real app, this would navigate to the practice problem
    navigate(problem.url);
  };

  const startLearningPath = (path: any) => {
    toast({
      title: `Starting Learning Path: ${path.title}`,
      description: `${path.modules} modules • ${path.progress}% completed`,
      variant: "success",
    });
    // In a real app, this would navigate to the learning path
    navigate(`/learning-path/${path.id}`);
  };

  const viewCertificationDetails = (cert: any) => {
    toast({
      title: `Certification: ${cert.title}`,
      description: `${cert.level} • Estimated ${cert.estimatedHours} hours`,
    });
    // In a real app, this would show more details or start the certification process
    navigate(`/certification/${cert.id}`);
  };

  const downloadResource = (resource: any) => {
    toast({
      title: "Downloading resource",
      description: `${resource.title} is being downloaded`,
    });
    // In a real app, this would trigger a download
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/auth');
  };

  if (!user) {
    return null; // If not logged in, don't render content (we redirect in useEffect)
  }

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
          <Button variant="outline" onClick={() => navigate('/learning-paths')}>
            <GraduationCap className="h-4 w-4 mr-2" />
            My Learning Path
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="videos">Video Lessons</TabsTrigger>
          <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="problems">Practice Problems</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="animate-fade-in space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Video Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {myVideos.map((video, i) => {
                const isVideoVisible = visibleItems[i] || false;
                const isBookmarked = bookmarks.includes(video.id);
                
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
                        <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs text-white flex items-center">
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

                      {/* Bookmark button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(video.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 left-2 h-8 w-8 bg-black/30 hover:bg-black/50 rounded-full p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isBookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-white"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Button>
                      
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
                const isBookmarked = bookmarks.includes(video.id);
                
                return (
                  <div 
                    key={i}
                    ref={el => observerRefs.current[itemIndex] = el} 
                    data-id={itemIndex}
                    className={`transition-all duration-500 transform ${isVideoVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover-scale`}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div 
                      className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden hover:shadow-md mb-2 cursor-pointer"
                      onClick={() => {
                        toast({
                          title: `Playing: ${video.title}`,
                          description: `Duration: ${video.duration}`
                        });
                        window.open(video.url, "_blank");
                      }}
                    >
                      {/* Simplified thumbnail */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${video.thumbnail} to-indigo-400 opacity-60`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white transform transition-all hover:scale-110" />
                      </div>
                      
                      {/* Bookmark button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(video.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 left-2 h-7 w-7 bg-black/30 hover:bg-black/50 rounded-full p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isBookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-white"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Button>
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
            {textbooks.map((book, i) => {
              const isBookmarked = bookmarks.includes(book.id);
              
              return (
                <Card 
                  key={i} 
                  className="hover:shadow-md transition-all duration-300 hover-scale"
                >
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded">
                      <BookMarked className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base group">
                        <span className="story-link">{book.title}</span>
                      </CardTitle>
                      <CardDescription>
                        {book.author}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(book.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isBookmarked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        Chapter {book.currentChapter} Available
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => openTextbook(book)}>
                        Read Now
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                      onClick={() => downloadResource(book)}
                    >
                      <Download className="h-3 w-3" />
                      Download PDF Sample
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, i) => {
              const isBookmarked = bookmarks.includes(tutorial.id);
              
              return (
                <Card 
                  key={i} 
                  className="hover:shadow-md transition-all duration-300 hover-scale"
                  onClick={() => startTutorial(tutorial)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-base">{tutorial.title}</CardTitle>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(tutorial.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-full p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isBookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Button>
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
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {practiceProblems.map((problem, i) => {
              const isBookmarked = bookmarks.includes(problem.id);
              
              return (
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
                      <div className="flex items-center gap-2">
                        <Badge variant={problem.progress === 100 ? "success" : "outline"}>
                          {problem.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(problem.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </Button>
                      </div>
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
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz, i) => {
              const isBookmarked = bookmarks.includes(quiz.id);
              
              return (
                <Card 
                  key={i} 
                  className="hover:shadow-md transition-all duration-300 hover-scale"
                  onClick={() => startQuiz(quiz)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{quiz.title} Quiz</CardTitle>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(quiz.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 rounded-full p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isBookmarked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Button>
                    </div>
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
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, i) => (
              <Card 
                key={i} 
                className="hover:shadow-lg transition-all duration-300 hover-scale overflow-hidden"
                onClick={() => startLearningPath(path)}
              >
                <div className={`h-1.5 w-full bg-${path.color}-500`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {path.icon}
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{path.modules} modules</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${path.color}-500 h-2 rounded-full transition-all duration-1000`} 
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3">
                  <Button variant="outline" className="w-full">Continue Learning</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <Card 
                key={i} 
                className="hover:shadow-lg transition-all duration-300"
                onClick={() => viewCertificationDetails(cert)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      cert.level === 'Beginner' ? 'default' : 
                      cert.level === 'Intermediate' ? 'secondary' : 
                      'destructive'
                    }>
                      {cert.level}
                    </Badge>
                    <Badge variant="outline">{cert.estimatedHours} hours</Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Requirements:</h4>
                  <ul className="space-y-2">
                    {cert.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Certification Path</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <style>
        {`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        
        .playing .playing-indicator {
          display: block;
        }
        
        .playing-indicator:before {
          animation: progress 2s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default Resources;

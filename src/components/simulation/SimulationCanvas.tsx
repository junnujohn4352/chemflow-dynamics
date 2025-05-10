
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import EquipmentCard from "@/components/ui/equipment/EquipmentCard";
import { EquipmentType } from "@/components/ui/equipment/EquipmentIcons";

interface SimulationCanvasProps {
  equipment: {
    id: string;
    type: EquipmentType;
    position: { x: number; y: number };
  }[];
  onEquipmentDrop?: (type: EquipmentType, position: { x: number; y: number }) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ equipment, onEquipmentDrop }) => {
  const [connections, setConnections] = useState<{ from: string; to: string; fromPoint: string; toPoint: string }[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [connectionStart, setConnectionStart] = useState<{ id: string; point: string } | null>(null);
  const [hoveredEquipment, setHoveredEquipment] = useState<string | null>(null);
  const [isFlowActive, setIsFlowActive] = useState<boolean>(false);
  const [flowDirection, setFlowDirection] = useState<"forward" | "reverse">("forward");
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Start flow animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlowActive(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulated pumping effect every 10 seconds
  useEffect(() => {
    if (connections.length > 0) {
      const interval = setInterval(() => {
        setFlowDirection(prev => prev === "forward" ? "reverse" : "forward");
        
        // Find a pump in the equipment and add a short highlight
        const pump = equipment.find(e => e.type === "pump" || e.type === "compressor");
        if (pump && pump.id) {
          setSelectedEquipmentId(pump.id);
          setTimeout(() => {
            setSelectedEquipmentId(null);
          }, 1000);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [connections.length, equipment]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const equipmentType = e.dataTransfer.getData("equipment-type") as EquipmentType;
    
    if (!equipmentType) {
      console.error("No equipment type received in drop");
      return;
    }

    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    if (onEquipmentDrop) {
      onEquipmentDrop(equipmentType, { x, y });
      
      // Show toast with animation
      toast({
        title: "Equipment Added",
        description: `${equipmentType.replace('-', ' ')} has been added to the flowsheet`,
        variant: "default",
      });
    }
  };

  const handleConnectionPointClick = (equipmentId: string, point: string) => {
    if (!connectionStart) {
      setConnectionStart({ id: equipmentId, point });
      toast({
        title: "Creating Connection",
        description: "Select another connection point to complete the link.",
        duration: 3000,
      });
    } else {
      // Don't connect to the same equipment
      if (connectionStart.id === equipmentId) {
        setConnectionStart(null);
        return;
      }

      // Create the new connection
      const newConnection = {
        from: connectionStart.id,
        to: equipmentId,
        fromPoint: connectionStart.point,
        toPoint: point,
      };

      setConnections([...connections, newConnection]);
      
      toast({
        title: "Connection Created",
        description: "Equipment connected successfully.",
      });
      
      // Add temporary highlighting to both connected equipments
      setSelectedEquipmentId(connectionStart.id);
      setTimeout(() => {
        setSelectedEquipmentId(equipmentId);
        setTimeout(() => {
          setSelectedEquipmentId(null);
        }, 800);
      }, 800);
      
      setConnectionStart(null);
    }
  };

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipmentId(id === selectedEquipmentId ? null : id);
  };

  // Generate random dots for flow line animation
  const generateFlowDots = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `dot-${i}`,
      offset: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 10 + 5
    }));
  };

  return (
    <div 
      ref={canvasRef}
      className="min-h-[500px] w-full bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 rounded-lg border border-dashed border-blue-300 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 p-4 grid grid-cols-10 gap-4 bg-[url('/grid-pattern.svg')] bg-repeat">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-200 opacity-10 blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-purple-200 opacity-15 blur-2xl animate-pulse" style={{ animationDuration: '18s' }}></div>
        
        {equipment.map((item) => (
          <motion.div 
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.position.x}px`,
              top: `${item.position.y}px`,
              zIndex: selectedEquipmentId === item.id ? 10 : 1,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: "-50%", 
              y: "-50%",
            }}
            transition={{ 
              type: "spring",
              duration: 0.5,
              bounce: 0.3
            }}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setHoveredEquipment(item.id)}
            onMouseLeave={() => setHoveredEquipment(null)}
            className="equipment-card"
          >
            <EquipmentCard
              type={item.type}
              title={item.type.replace("-", " ")}
              size="md"
              showConnections={true}
              selected={selectedEquipmentId === item.id || hoveredEquipment === item.id}
              onClick={() => handleEquipmentSelect(item.id)}
              onConnectionPointClick={(point) => handleConnectionPointClick(item.id, point)}
              activeConnectionPoints={connectionStart?.id === item.id ? [connectionStart.point] : []}
              metrics={[
                { key: "temp", value: "25 °C", editable: true },
                { key: "press", value: "1 bar", editable: true },
              ]}
              status={connections.some(c => c.from === item.id || c.to === item.id) ? "running" : "ready"}
              showDottedLines={connectionStart?.id === item.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>
        ))}

        {/* Draw connections between equipment with animated flow */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="0" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            
            {/* Define animated flow pattern */}
            <pattern
              id="flowPattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(0)"
            >
              <circle 
                cx="10" 
                cy="10" 
                r="2" 
                fill="#3b82f6" 
                className={isFlowActive ? "animate-pulse" : ""}
              />
            </pattern>
            
            {/* More realistic fluid flow pattern */}
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            
            {/* Glowing effect for active connections */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {connections.map((connection, idx) => {
            const fromEquipment = equipment.find(e => e.id === connection.from);
            const toEquipment = equipment.find(e => e.id === connection.to);
            
            if (!fromEquipment || !toEquipment) return null;
            
            // Calculate path control points for a curved line
            const dx = toEquipment.position.x - fromEquipment.position.x;
            const dy = toEquipment.position.y - fromEquipment.position.y;
            const midX = (fromEquipment.position.x + toEquipment.position.x) / 2;
            const midY = (fromEquipment.position.y + toEquipment.position.y) / 2;
            
            // Add some curvature based on distance
            const curve = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.2, 50);
            
            // Create path
            const path = `M ${fromEquipment.position.x} ${fromEquipment.position.y} 
                         Q ${midX} ${midY - curve} ${toEquipment.position.x} ${toEquipment.position.y}`;
            
            // This creates a visible flow path
            const flowLine = (
              <g key={`connection-${idx}`}>
                {/* Base connection pipe */}
                <path
                  d={path}
                  stroke="#3b82f6"
                  strokeWidth="6"
                  strokeOpacity="0.3"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Dotted outline for active pipes */}
                <path
                  d={path}
                  stroke="#3b82f6"
                  strokeWidth="7"
                  strokeOpacity="0.1"
                  fill="none"
                  strokeDasharray="3,3"
                  className={isFlowActive ? "connection-line" : ""}
                />
                
                {/* Flow animation */}
                {isFlowActive && (
                  <g>
                    {/* Animated fluid */}
                    <motion.path
                      d={path}
                      stroke="url(#flowGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, pathOffset: flowDirection === "forward" ? 1 : 0 }}
                      animate={{ 
                        pathLength: 0.2, 
                        pathOffset: flowDirection === "forward" ? 0 : 1
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "linear",
                      }}
                    />
                    
                    {/* Moving particle effect */}
                    {generateFlowDots(5).map(dot => (
                      <motion.circle
                        key={dot.id}
                        r={dot.size}
                        fill="#60a5fa"
                        initial={{ 
                          offsetDistance: `${flowDirection === "forward" ? 0 : 100}%`,
                        }}
                        animate={{ 
                          offsetDistance: `${flowDirection === "forward" ? 100 : 0}%`,
                        }}
                        style={{
                          offsetPath: `path("${path}")`,
                        }}
                        transition={{
                          duration: dot.speed,
                          repeat: Infinity,
                          ease: "linear",
                          delay: dot.offset / 100
                        }}
                      />
                    ))}
                  </g>
                )}
                
                {/* Arrow */}
                <motion.path
                  d={path}
                  stroke="none"
                  fill="none"
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
            
            return flowLine;
          })}
        </svg>
      </div>
      
      {/* Canvas guidance */}
      {equipment.length === 0 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="text-blue-400 text-center px-8 py-12 max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start Building Your Process
            </h3>
            <p className="text-blue-600">
              Drag equipment from the panel on the left and drop them here to create a process flowsheet.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Connection guidance when connecting */}
      {connectionStart && (
        <motion.div 
          className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>Click on another connection point to complete</p>
          <button 
            className="text-xs underline mt-1"
            onClick={() => setConnectionStart(null)}
          >
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SimulationCanvas;

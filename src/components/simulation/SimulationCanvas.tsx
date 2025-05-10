
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [connectionInProgress, setConnectionInProgress] = useState<{ x: number; y: number } | null>(null);
  const [equipmentMetrics, setEquipmentMetrics] = useState<Record<string, { temp: string; press: string }>>({}); 
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Start flow animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlowActive(true);
      toast({
        title: "Simulation Active",
        description: "You can now connect equipment by clicking on connection points",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize equipment metrics
  useEffect(() => {
    // Generate random temperatures and pressures for each equipment
    const metrics: Record<string, { temp: string; press: string }> = {};
    equipment.forEach(eq => {
      metrics[eq.id] = {
        temp: `${Math.floor(Math.random() * 80) + 20} °C`,
        press: `${(Math.random() * 9.5 + 0.5).toFixed(1)} bar`,
      };
    });
    setEquipmentMetrics(metrics);
  }, [equipment]);

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

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (connectionStart && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setConnectionInProgress({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
      });
    }
  };

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

  const handleCanvasClick = () => {
    // Cancel connection when clicking on empty canvas area
    if (connectionStart) {
      setConnectionStart(null);
      setConnectionInProgress(null);
      toast({
        title: "Connection Cancelled",
        description: "Click on equipment connection points to create connections",
      });
    }
  };

  const handleConnectionPointClick = (equipmentId: string, point: string) => {
    if (!connectionStart) {
      // Starting a new connection
      setConnectionStart({ id: equipmentId, point });
      
      // Show guidance toast
      toast({
        title: "Creating Connection",
        description: "Click another connection point to complete, or click the canvas to cancel.",
        duration: 3000,
      });
    } else {
      // Don't connect to the same equipment
      if (connectionStart.id === equipmentId) {
        setConnectionStart(null);
        setConnectionInProgress(null);
        return;
      }

      // Check if connection already exists
      const connectionExists = connections.some(
        conn => 
          (conn.from === connectionStart.id && conn.to === equipmentId && 
           conn.fromPoint === connectionStart.point && conn.toPoint === point) ||
          (conn.from === equipmentId && conn.to === connectionStart.id && 
           conn.fromPoint === point && conn.toPoint === connectionStart.point)
      );
      
      if (connectionExists) {
        toast({
          title: "Connection already exists",
          description: "These connection points are already connected.",
          variant: "destructive",
        });
        setConnectionStart(null);
        setConnectionInProgress(null);
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
      
      // Simulate process changes when connection is made
      updateEquipmentMetrics(connectionStart.id, equipmentId);
      
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
      setConnectionInProgress(null);
    }
  };

  const updateEquipmentMetrics = (fromId: string, toId: string) => {
    // Create a copy of the current metrics
    const newMetrics = { ...equipmentMetrics };
    
    // Find the equipment types
    const fromEquip = equipment.find(e => e.id === fromId);
    const toEquip = equipment.find(e => e.id === toId);
    
    if (!fromEquip || !toEquip || !newMetrics[fromId] || !newMetrics[toId]) return;
    
    // Update metrics based on equipment types and interactions
    // For example, pumps increase pressure, heat exchangers change temperature
    if (fromEquip.type === "pump" || fromEquip.type === "compressor") {
      // Pump increases pressure in the downstream equipment
      const currentPressure = parseFloat(newMetrics[toId].press);
      newMetrics[toId].press = `${(currentPressure + (1.5 + Math.random() * 2)).toFixed(1)} bar`;
    }
    
    if (fromEquip.type === "heater") {
      // Heater increases temperature
      const currentTemp = parseFloat(newMetrics[toId].temp);
      newMetrics[toId].temp = `${Math.min(currentTemp + (20 + Math.random() * 40), 450).toFixed(0)} °C`;
    }
    
    if (fromEquip.type === "cooler") {
      // Cooler decreases temperature
      const currentTemp = parseFloat(newMetrics[toId].temp);
      newMetrics[toId].temp = `${Math.max(currentTemp - (15 + Math.random() * 30), 5).toFixed(0)} °C`;
    }
    
    if (fromEquip.type === "reactor") {
      // Reactor typically increases temperature due to reaction
      const currentTemp = parseFloat(newMetrics[toId].temp);
      newMetrics[toId].temp = `${(currentTemp + (15 + Math.random() * 30)).toFixed(0)} °C`;
    }
    
    // Update the state with new metrics
    setEquipmentMetrics(newMetrics);
  };

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipmentId(id === selectedEquipmentId ? null : id);
  };

  const handleDeleteConnection = (index: number) => {
    setConnections(connections.filter((_, i) => i !== index));
    toast({
      title: "Connection Removed",
      description: "The connection has been deleted.",
    });
  };

  // Generate random dots for flow line animation
  const generateFlowDots = useCallback((count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `dot-${i}`,
      offset: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 10 + 5
    }));
  }, []);

  // Calculate positions for equipment connection points
  const getConnectionPointPosition = (equipId: string, pointName: string) => {
    const equip = equipment.find(eq => eq.id === equipId);
    if (!equip) return { x: 0, y: 0 };
    
    // Base position is the center of the equipment
    let x = equip.position.x;
    let y = equip.position.y;
    
    // Adjust based on the point name
    if (pointName.includes('left')) {
      x -= 35; // Offset to the left
    } else if (pointName.includes('right')) {
      x += 35; // Offset to the right
    }
    
    if (pointName.includes('top')) {
      y -= 35; // Offset to the top
    } else if (pointName.includes('bottom')) {
      y += 35; // Offset to the bottom
    }
    
    return { x, y };
  };

  return (
    <div 
      ref={canvasRef}
      className="min-h-[500px] w-full bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 rounded-lg border border-dashed border-blue-300 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
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
              activeConnectionPoints={
                connectionStart?.id === item.id ? [connectionStart.point] : 
                // Show active points for connected points too
                connections
                  .filter(c => c.from === item.id || c.to === item.id)
                  .map(c => c.from === item.id ? c.fromPoint : c.toPoint)
              }
              metrics={[
                { key: "temp", value: equipmentMetrics[item.id]?.temp || "25 °C", editable: true },
                { key: "press", value: equipmentMetrics[item.id]?.press || "1 bar", editable: true },
              ]}
              status={connections.some(c => c.from === item.id || c.to === item.id) ? "running" : "ready"}
              showDottedLines={connectionStart?.id === item.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>
        ))}

        {/* Draw connection in progress */}
        {connectionStart && connectionInProgress && (
          <svg className="absolute inset-0 pointer-events-none z-20">
            <defs>
              <marker 
                id="arrowhead-temp" 
                markerWidth="10" 
                markerHeight="7" 
                refX="0" 
                refY="3.5" 
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" opacity="0.7" />
              </marker>
            </defs>
            
            {(() => {
              const startPoint = getConnectionPointPosition(connectionStart.id, connectionStart.point);
              return (
                <path
                  d={`M ${startPoint.x} ${startPoint.y} L ${connectionInProgress.x} ${connectionInProgress.y}`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  strokeOpacity="0.7"
                  fill="none"
                  markerEnd="url(#arrowhead-temp)"
                />
              );
            })()}
          </svg>
        )}

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
            const fromPos = getConnectionPointPosition(connection.from, connection.fromPoint);
            const toPos = getConnectionPointPosition(connection.to, connection.toPoint);
            
            // Calculate path control points for a curved line
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            
            // Add some curvature based on distance
            const curve = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.2, 50);
            
            // Create path
            const path = `M ${fromPos.x} ${fromPos.y} 
                       Q ${midX} ${midY - curve} ${toPos.x} ${toPos.y}`;
            
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
                        key={`${idx}-${dot.id}`}
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
                
                {/* Delete button for connection */}
                <g 
                  transform={`translate(${midX}, ${midY - curve})`} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDeleteConnection(idx); 
                  }}
                  style={{ cursor: 'pointer' }}
                  className="pointer-events-auto"
                >
                  <circle cx="0" cy="0" r="8" fill="white" stroke="#3b82f6" strokeWidth="1" />
                  <line x1="-4" y1="-4" x2="4" y2="4" stroke="#3b82f6" strokeWidth="1.5" />
                  <line x1="4" y1="-4" x2="-4" y2="4" stroke="#3b82f6" strokeWidth="1.5" />
                </g>
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
      <AnimatePresence>
        {connectionStart && (
          <motion.div 
            className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <p>Click on another connection point to complete</p>
            <button 
              className="text-xs underline mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setConnectionStart(null);
                setConnectionInProgress(null);
              }}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add tutorial/tips popup for empty canvas */}
      {equipment.length > 0 && equipment.length < 3 && !connections.length && (
        <motion.div 
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-blue-200 p-4 rounded-lg shadow-lg max-w-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <h4 className="font-medium text-blue-700 mb-2">Connect Your Equipment</h4>
          <p className="text-sm text-blue-600">
            Click on connection points (small circles) on equipment to create flow connections between units.
          </p>
          <div className="flex items-center mt-3 text-xs text-blue-500">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Connection points appear when you hover over equipment</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SimulationCanvas;


import React, { useState, useEffect, useRef } from "react";
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      
      setConnectionStart(null);
    }
  };

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipmentId(id === selectedEquipmentId ? null : id);
  };

  return (
    <div 
      ref={canvasRef}
      className="min-h-[500px] w-full bg-blue-50/50 rounded-lg border border-dashed border-blue-300 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 p-4 grid grid-cols-10 gap-4 bg-[url('/grid-pattern.svg')] bg-repeat">
        {equipment.map((item) => (
          <div 
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.position.x}px`,
              top: `${item.position.y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: selectedEquipmentId === item.id ? 10 : 1,
            }}
            className="transition-all duration-200"
            onMouseEnter={() => setHoveredEquipment(item.id)}
            onMouseLeave={() => setHoveredEquipment(null)}
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
              showDottedLines={connectionStart?.id === item.id}
            />
          </div>
        ))}

        {/* Draw connections between equipment */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map((connection, idx) => {
            const fromEquipment = equipment.find(e => e.id === connection.from);
            const toEquipment = equipment.find(e => e.id === connection.to);
            
            if (!fromEquipment || !toEquipment) return null;
            
            return (
              <line
                key={idx}
                x1={fromEquipment.position.x}
                y1={fromEquipment.position.y}
                x2={toEquipment.position.x}
                y2={toEquipment.position.y}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray={selectedEquipmentId === fromEquipment.id || selectedEquipmentId === toEquipment.id ? "none" : "5,5"}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Canvas guidance */}
      {equipment.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-blue-400 text-center px-8 py-12 max-w-md">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Start Building Your Process</h3>
            <p>Drag equipment from the panel on the left and drop them here to create a process flowsheet.</p>
          </div>
        </div>
      )}
      
      {/* Connection guidance when connecting */}
      {connectionStart && (
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
          <p>Click on another connection point to complete</p>
          <button 
            className="text-xs underline mt-1"
            onClick={() => setConnectionStart(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SimulationCanvas;

import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/components/simulation/ItemTypes";
import GlassPanel from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Add proper type definition to include the description property
interface SimulationComponentType {
  id: string;
  name: string;
  description: string;
  // Add other properties as needed
}

const initialComponents = [
  { id: 'pump', name: 'Pump', description: 'Moves fluid from one point to another' },
  { id: 'reactor', name: 'Reactor', description: 'Chemical reaction vessel' },
  { id: 'valve', name: 'Valve', description: 'Controls fluid flow' },
  { id: 'heater', name: 'Heater', description: 'Increases fluid temperature' },
  { id: 'condenser', name: 'Condenser', description: 'Cools vapor to liquid' },
  { id: 'column', name: 'Distillation Column', description: 'Separates components by boiling point' },
  { id: 'tank', name: 'Tank', description: 'Storage vessel for fluids' },
  { id: 'mixer', name: 'Mixer', description: 'Combines multiple fluid streams' },
];

const SimulationBuilder: React.FC<{ selectedComponents: string[]; thermodynamicModel: string; onRunSimulation: () => void }> = ({ selectedComponents, thermodynamicModel, onRunSimulation }) => {
  const { toast } = useToast();
  const [components, setComponents] = useState(initialComponents);
  const [newComponentName, setNewComponentName] = useState("");
  const [newComponentDescription, setNewComponentDescription] = useState("");
  const [simulationDescription, setSimulationDescription] = useState("");
  const [flowsheetLayout, setFlowsheetLayout] = useState<any[]>([]);
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  
  useEffect(() => {
    const savedLayout = localStorage.getItem('chemflow-flowsheet-layout');
    if (savedLayout) {
      try {
        setFlowsheetLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Error loading saved layout:", e);
      }
    }
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: any, monitor) => {
      if (item && item.id) {
        addComponentToFlowsheet(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleAddComponent = () => {
    if (newComponentName.trim() !== "" && newComponentDescription.trim() !== "") {
      const newComponent = {
        id: newComponentName.toLowerCase().replace(/\s+/g, '-'),
        name: newComponentName,
        description: newComponentDescription,
      };
      setComponents([...components, newComponent]);
      setNewComponentName("");
      setNewComponentDescription("");
      
      toast({
        title: "Component added",
        description: `${newComponentName} has been added to the component list`,
      });
    } else {
      toast({
        title: "Missing information",
        description: "Please provide both a name and a description for the new component",
        variant: "destructive",
      });
    }
  };

  const handleRemoveComponent = (id: string) => {
    setComponents(components.filter(component => component.id !== id));
    setFlowsheetLayout(flowsheetLayout.filter(item => item.componentId !== id));
    localStorage.setItem('chemflow-flowsheet-layout', JSON.stringify(flowsheetLayout.filter(item => item.componentId !== id)));
    
    toast({
      title: "Component removed",
      description: `Component has been removed from the list`,
    });
  };

  const addComponentToFlowsheet = (componentId: string) => {
    const newComponent = {
      id: `flow-${Date.now()}`,
      componentId: componentId,
      position: { x: 50, y: 50 },
    };
    setFlowsheetLayout([...flowsheetLayout, newComponent]);
    localStorage.setItem('chemflow-flowsheet-layout', JSON.stringify([...flowsheetLayout, newComponent]));
    
    toast({
      title: "Component added to flowsheet",
      description: `Added ${components.find(c => c.id === componentId)?.name} to the flowsheet`,
    });
  };

  const handleFlowsheetLayoutChange = (newLayout: any[]) => {
    setFlowsheetLayout(newLayout);
    localStorage.setItem('chemflow-flowsheet-layout', JSON.stringify(newLayout));
  };

  const handleClearFlowsheet = () => {
    setFlowsheetLayout([]);
    localStorage.removeItem('chemflow-flowsheet-layout');
    
    toast({
      title: "Flowsheet cleared",
      description: "All components have been removed from the flowsheet",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <GlassPanel className="p-4">
          <h3 className="text-lg font-medium mb-4">Components</h3>
          <ul className="mb-4">
            {components.map((component) => (
              <li 
                key={component.id} 
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center">
                  <GripVertical className="h-4 w-4 mr-2 text-gray-400 cursor-grab" />
                  {component.name}
                </div>
                <button 
                  onClick={() => handleRemoveComponent(component.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </li>
            ))}
          </ul>
          
          <div>
            <h4 className="text-md font-medium mb-2">Add New Component</h4>
            <div className="mb-2">
              <Label htmlFor="componentName">Name</Label>
              <Input
                type="text"
                id="componentName"
                placeholder="Component Name"
                value={newComponentName}
                onChange={(e) => setNewComponentName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="componentDescription">Description</Label>
              <Textarea
                id="componentDescription"
                placeholder="Component Description"
                value={newComponentDescription}
                onChange={(e) => setNewComponentDescription(e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleAddComponent}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </GlassPanel>
      </div>
      
      <div className="lg:col-span-3">
        <GlassPanel className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <Label htmlFor="simulationDescription">Simulation Description</Label>
            <Textarea
              id="simulationDescription"
              placeholder="Describe your simulation"
              value={simulationDescription}
              onChange={(e) => setSimulationDescription(e.target.value)}
            />
          </div>
          
          <div 
            className="flex-grow relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-md p-4 flex items-center justify-center overflow-auto"
            ref={drop}
          >
            {flowsheetLayout.length === 0 ? (
              <div className="text-gray-500 text-center">
                Drag components from the left sidebar here to build your flowsheet.
              </div>
            ) : (
              <div>
                {flowsheetLayout.map((item) => {
                  const component = components.find(c => c.id === item.componentId);
                  return component ? (
                    <div key={item.id}>
                      {component.name}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={handleClearFlowsheet}>
              Clear Flowsheet
            </Button>
            <Button onClick={onRunSimulation}>
              Run Simulation
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default SimulationBuilder;

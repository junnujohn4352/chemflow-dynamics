
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSimulations } from '@/hooks/use-simulations';
import { SimulationData, SimulationConfig } from '@/lib/supabase';
import { Save, Trash2, FolderOpen, Download } from 'lucide-react';
import { calculateSimulationResults } from './process-flow/SimulationConfig';
import { toast } from '@/hooks/use-toast';

interface SimulationManagerProps {
  currentConfig: SimulationConfig;
  isRunning: boolean;
  onLoadSimulation: (config: SimulationConfig) => void;
}

const simulationFormSchema = z.object({
  name: z.string().min(3, { message: 'Simulation name must be at least 3 characters' }),
  description: z.string().optional(),
});

type SimulationFormValues = z.infer<typeof simulationFormSchema>;

const SimulationManager: React.FC<SimulationManagerProps> = ({ 
  currentConfig, 
  isRunning,
  onLoadSimulation
}) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationData | null>(null);
  
  const { 
    simulations, 
    isLoading, 
    saveSimulation, 
    deleteSimulation,
    updateSimulation
  } = useSimulations();

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSaveSimulation = (values: SimulationFormValues) => {
    // Calculate simulation results locally using our client-side function
    const results = calculateSimulationResults(currentConfig);
    
    const simulationData: Omit<SimulationData, 'id' | 'created_at' | 'updated_at'> = {
      name: values.name,
      description: values.description || '',
      config: currentConfig,
      results
    };

    saveSimulation.mutate(simulationData);
    setIsSaveDialogOpen(false);
    form.reset();
  };

  const handleLoadSimulation = (simulation: SimulationData) => {
    onLoadSimulation(simulation.config);
    setIsLoadDialogOpen(false);
    setSelectedSimulation(null);
  };

  const handleDeleteSimulation = (id: string) => {
    if (confirm('Are you sure you want to delete this simulation?')) {
      deleteSimulation.mutate(id);
    }
  };
  
  const handleExportConfig = () => {
    // Calculate current results
    const results = calculateSimulationResults(currentConfig);
    
    // Create the export data
    const exportData = {
      config: currentConfig,
      results,
      exportedAt: new Date().toISOString()
    };
    
    // Convert to JSON and create download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chemflow-simulation-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Successful",
      description: "Your simulation configuration has been exported",
    });
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsSaveDialogOpen(true)}
        disabled={!isRunning}
        className="gap-2"
      >
        <Save size={16} />
        Save Simulation
      </Button>

      <Button 
        variant="outline" 
        onClick={() => setIsLoadDialogOpen(true)}
        className="gap-2"
      >
        <FolderOpen size={16} />
        Load Simulation
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleExportConfig}
        className="gap-2"
        disabled={!isRunning}
      >
        <Download size={16} />
        Export Config
      </Button>
      
      {/* Save Simulation Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Simulation</DialogTitle>
            <DialogDescription>
              Save your current simulation configuration for future use.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveSimulation)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Simulation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name for this simulation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a description for this simulation" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={saveSimulation.isPending}>
                  {saveSimulation.isPending ? 'Saving...' : 'Save Simulation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Load Simulation Dialog */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Load Simulation</DialogTitle>
            <DialogDescription>
              Select a previously saved simulation to load.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center">Loading simulations...</div>
            ) : simulations && simulations.length > 0 ? (
              <div className="space-y-2">
                {simulations.map((simulation) => (
                  <div 
                    key={simulation.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSimulation?.id === simulation.id 
                        ? 'border-flow-blue bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSimulation(simulation)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{simulation.name}</h3>
                        {simulation.description && (
                          <p className="text-sm text-gray-500 mt-1">{simulation.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(simulation.created_at || '').toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSimulation(simulation.id as string);
                        }}
                      >
                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                No saved simulations found.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => handleLoadSimulation(selectedSimulation as SimulationData)}
              disabled={!selectedSimulation}
            >
              Load Selected Simulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimulationManager;

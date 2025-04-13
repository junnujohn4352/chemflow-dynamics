
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Save, RotateCw, Settings, LineChart } from "lucide-react";

interface ProcessControlInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const ProcessControlInterface: React.FC<ProcessControlInterfaceProps> = ({ software }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [setpoint, setSetpoint] = useState(50);
  const [processValue, setProcessValue] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // Simulate process dynamics
        setProcessValue(prev => {
          const diff = setpoint - prev;
          const noise = Math.random() * 2 - 1; // Random noise between -1 and 1
          const newValue = prev + (diff * 0.1) + noise;
          return Number(newValue.toFixed(1));
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, setpoint]);

  const handleToggleSimulation = () => {
    setIsRunning(prev => !prev);
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setProcessValue(30);
  };

  const handleSetpointChange = (value: number[]) => {
    setSetpoint(value[0]);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="pid">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="pid">PID Control</TabsTrigger>
          <TabsTrigger value="modeling">System Modeling</TabsTrigger>
          <TabsTrigger value="tuning">Controller Tuning</TabsTrigger>
          <TabsTrigger value="visualization">Response Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pid" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Controller Parameters</h3>
              
              <div className="space-y-2">
                <Label htmlFor="controller-type">Controller Type</Label>
                <Select defaultValue="pid">
                  <SelectTrigger id="controller-type">
                    <SelectValue placeholder="Select controller type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p">P (Proportional)</SelectItem>
                    <SelectItem value="pi">PI (Proportional-Integral)</SelectItem>
                    <SelectItem value="pid">PID (Proportional-Integral-Derivative)</SelectItem>
                    <SelectItem value="fuzzy">Fuzzy Logic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kp-value">Kp (Proportional Gain)</Label>
                <div className="flex items-center gap-2">
                  <Slider defaultValue={[2.5]} min={0} max={10} step={0.1} onValueChange={handleSetpointChange} className="flex-1" />
                  <Input type="number" value="2.5" className="w-16" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ki-value">Ki (Integral Gain)</Label>
                <div className="flex items-center gap-2">
                  <Slider defaultValue={[0.5]} min={0} max={5} step={0.1} className="flex-1" />
                  <Input type="number" value="0.5" className="w-16" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kd-value">Kd (Derivative Gain)</Label>
                <div className="flex items-center gap-2">
                  <Slider defaultValue={[0.2]} min={0} max={2} step={0.05} className="flex-1" />
                  <Input type="number" value="0.2" className="w-16" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="setpoint">Setpoint</Label>
                <div className="flex items-center gap-2">
                  <Slider defaultValue={[setpoint]} min={0} max={100} step={1} onValueChange={handleSetpointChange} className="flex-1" />
                  <Input type="number" value={setpoint} onChange={(e) => setSetpoint(Number(e.target.value))} className="w-16" />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-tune" />
                  <Label htmlFor="auto-tune">Auto-Tuning</Label>
                </div>
                
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Advanced Settings
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Simulation Control</h3>
              
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 flex flex-col h-72">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Process Value</p>
                    <p className="text-2xl font-semibold">{processValue} °C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Setpoint</p>
                    <p className="text-2xl font-semibold">{setpoint} °C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-2xl font-semibold">{elapsedTime} s</p>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center border bg-white dark:bg-gray-900 rounded-md mb-4">
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">[Real-time trend would appear here]</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    onClick={handleToggleSimulation}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleResetSimulation}>
                    <RotateCw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Settling Time:</p>
                    <p className="font-medium">{isRunning && elapsedTime > 15 ? "12.5 s" : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Overshoot:</p>
                    <p className="font-medium">{isRunning && elapsedTime > 10 ? "8.3%" : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Rise Time:</p>
                    <p className="font-medium">{isRunning && elapsedTime > 8 ? "4.2 s" : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Steady-State Error:</p>
                    <p className="font-medium">{isRunning && elapsedTime > 20 ? "0.5 °C" : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="modeling" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">System Identification</h3>
                
                <div>
                  <Label htmlFor="model-type">Model Type</Label>
                  <Select defaultValue="first-order">
                    <SelectTrigger id="model-type">
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-order">First Order</SelectItem>
                      <SelectItem value="second-order">Second Order</SelectItem>
                      <SelectItem value="first-order-delay">First Order + Dead Time</SelectItem>
                      <SelectItem value="custom">Custom Transfer Function</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="time-constant">Time Constant (τ)</Label>
                  <Input id="time-constant" type="number" defaultValue="5" />
                  <p className="text-xs text-gray-500 mt-1">seconds</p>
                </div>
                
                <div>
                  <Label htmlFor="process-gain">Process Gain (K)</Label>
                  <Input id="process-gain" type="number" defaultValue="1.2" />
                </div>
                
                <div>
                  <Label htmlFor="dead-time">Dead Time (θ)</Label>
                  <Input id="dead-time" type="number" defaultValue="1" />
                  <p className="text-xs text-gray-500 mt-1">seconds</p>
                </div>
                
                <div>
                  <Label htmlFor="transfer-function">Transfer Function</Label>
                  <Input id="transfer-function" readOnly value="G(s) = 1.2 / (5s + 1) * e^(-1s)" className="font-mono" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Process Disturbances</h3>
                
                <div>
                  <Label htmlFor="disturbance-type">Disturbance Type</Label>
                  <Select defaultValue="step">
                    <SelectTrigger id="disturbance-type">
                      <SelectValue placeholder="Select disturbance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="step">Step</SelectItem>
                      <SelectItem value="ramp">Ramp</SelectItem>
                      <SelectItem value="sine">Sinusoidal</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="disturbance-amplitude">Amplitude</Label>
                  <Input id="disturbance-amplitude" type="number" defaultValue="10" />
                </div>
                
                <div>
                  <Label htmlFor="disturbance-freq">Frequency (if sinusoidal)</Label>
                  <Input id="disturbance-freq" type="number" defaultValue="0.1" />
                  <p className="text-xs text-gray-500 mt-1">Hz</p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="add-noise" />
                  <Label htmlFor="add-noise">Add Measurement Noise</Label>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-1" />
                    Apply to Simulation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tuning" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-medium">Controller Tuning Methods</h3>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Auto-Tune
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tuning-method">Tuning Method</Label>
                  <Select defaultValue="ziegler-nichols">
                    <SelectTrigger id="tuning-method">
                      <SelectValue placeholder="Select tuning method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ziegler-nichols">Ziegler-Nichols</SelectItem>
                      <SelectItem value="cohen-coon">Cohen-Coon</SelectItem>
                      <SelectItem value="chien-hrones-reswick">Chien-Hrones-Reswick</SelectItem>
                      <SelectItem value="imc">Internal Model Control (IMC)</SelectItem>
                      <SelectItem value="lambda">Lambda Tuning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <h4 className="text-sm font-medium mb-3">Tuning Parameters</h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <Label htmlFor="tuned-kp" className="text-sm">Kp</Label>
                      <Input id="tuned-kp" value="2.7" readOnly className="col-span-1" />
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Apply
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <Label htmlFor="tuned-ki" className="text-sm">Ki</Label>
                      <Input id="tuned-ki" value="0.54" readOnly className="col-span-1" />
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Apply
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <Label htmlFor="tuned-kd" className="text-sm">Kd</Label>
                      <Input id="tuned-kd" value="0.18" readOnly className="col-span-1" />
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Apply
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" size="sm">
                    Apply All Parameters
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="tuning-objective">Tuning Objective</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="tuning-objective">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="setpoint">Setpoint Tracking</SelectItem>
                      <SelectItem value="disturbance">Disturbance Rejection</SelectItem>
                      <SelectItem value="balanced">Balanced Response</SelectItem>
                      <SelectItem value="conservative">Conservative/Robust</SelectItem>
                      <SelectItem value="aggressive">Aggressive Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Response Comparison</h4>
                
                <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded-md flex items-center justify-center mb-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">[Response comparison chart would appear here]</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Current Tuning</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Proposed Tuning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visualization" className="p-4 border rounded-md mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Plot Type</Label>
                <Select defaultValue="time-domain">
                  <SelectTrigger>
                    <SelectValue placeholder="Select plot type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time-domain">Time Domain Response</SelectItem>
                    <SelectItem value="frequency">Frequency Response</SelectItem>
                    <SelectItem value="step">Step Response</SelectItem>
                    <SelectItem value="pv-sp">PV vs SP</SelectItem>
                    <SelectItem value="phase">Phase Plane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Time Range</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Last 30 seconds</SelectItem>
                    <SelectItem value="60">Last 60 seconds</SelectItem>
                    <SelectItem value="300">Last 5 minutes</SelectItem>
                    <SelectItem value="3600">Last hour</SelectItem>
                    <SelectItem value="all">All data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Variables</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select variables" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Variables</SelectItem>
                    <SelectItem value="pv">Process Value Only</SelectItem>
                    <SelectItem value="sp">Setpoint Only</SelectItem>
                    <SelectItem value="error">Error Signal</SelectItem>
                    <SelectItem value="control">Control Output</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="aspect-video bg-white dark:bg-gray-800 rounded-md border p-4">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Temperature Control Response</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export Chart
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">[Control response visualization would appear here]</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Control Performance Statistics</h4>
                
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1">Integral Absolute Error (IAE)</td>
                      <td className="text-right">126.8</td>
                    </tr>
                    <tr>
                      <td className="py-1">Integral Square Error (ISE)</td>
                      <td className="text-right">520.4</td>
                    </tr>
                    <tr>
                      <td className="py-1">Standard Deviation</td>
                      <td className="text-right">4.3 °C</td>
                    </tr>
                    <tr>
                      <td className="py-1">Settling Time</td>
                      <td className="text-right">22.5 seconds</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium mb-3">Controller Output Analysis</h4>
                
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1">Average Output</td>
                      <td className="text-right">45.2%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Maximum Output</td>
                      <td className="text-right">78.6%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Minimum Output</td>
                      <td className="text-right">24.1%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Output Variance</td>
                      <td className="text-right">156.3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessControlInterface;

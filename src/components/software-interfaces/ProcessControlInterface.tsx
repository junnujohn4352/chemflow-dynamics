
import React, { useState, useEffect } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface ProcessControlInterfaceProps {
  software: Software;
}

const ProcessControlInterface: React.FC<ProcessControlInterfaceProps> = ({ software }) => {
  const [controllerType, setControllerType] = useState<string>("pid");
  const [setpoint, setSetpoint] = useState<number>(50);
  const [kp, setKp] = useState<number>(1.0);
  const [ki, setKi] = useState<number>(0.1);
  const [kd, setKd] = useState<number>(0.05);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number>(30);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [dataPoints, setDataPoints] = useState<{time: number, value: number, setpoint: number}[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Simple PID control simulation
          const error = setpoint - currentValue;
          const proportional = kp * error;
          const derivative = kd * error; // simplified - should be rate of change
          const integral = ki * error; // simplified - should be sum of error
          
          // Calculate new process value with some noise
          const controlAction = proportional + integral + derivative;
          const noise = (Math.random() - 0.5) * 3;
          
          const newValue = Math.min(100, Math.max(0, currentValue + controlAction * 0.1 + noise));
          setCurrentValue(newValue);
          
          // Add data point
          setDataPoints(prev => [...prev, {time: newTime, value: newValue, setpoint}]);
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, setpoint, currentValue, kp, ki, kd]);
  
  const handleStart = () => {
    setIsRunning(true);
    setDataPoints([{time: 0, value: currentValue, setpoint}]);
    
    toast({
      title: "Control Loop Started",
      description: `${controllerType.toUpperCase()} controller is now running.`,
    });
  };
  
  const handleStop = () => {
    setIsRunning(false);
    
    toast({
      title: "Control Loop Stopped",
      description: "The controller has been stopped.",
    });
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setCurrentValue(30);
    setDataPoints([]);
    
    toast({
      title: "Control Loop Reset",
      description: "All values have been reset to default.",
    });
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Process Control Simulator</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="controllerType">Controller Type</Label>
            <Select value={controllerType} onValueChange={setControllerType}>
              <SelectTrigger id="controllerType">
                <SelectValue placeholder="Select controller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pid">PID Controller</SelectItem>
                <SelectItem value="pi">PI Controller</SelectItem>
                <SelectItem value="p">P Controller</SelectItem>
                <SelectItem value="mpc">Model Predictive Control</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setpoint">Setpoint Value</Label>
            <Input 
              id="setpoint" 
              type="number" 
              value={setpoint} 
              onChange={(e) => setSetpoint(Number(e.target.value))} 
              min="0"
              max="100"
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kp">Proportional Gain (Kp): {kp.toFixed(2)}</Label>
            <Slider 
              id="kp"
              value={[kp]} 
              min={0} 
              max={5} 
              step={0.1} 
              onValueChange={(value) => setKp(value[0])}
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ki">Integral Gain (Ki): {ki.toFixed(2)}</Label>
            <Slider 
              id="ki"
              value={[ki]} 
              min={0} 
              max={1} 
              step={0.01} 
              onValueChange={(value) => setKi(value[0])}
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="kd">Derivative Gain (Kd): {kd.toFixed(2)}</Label>
            <Slider 
              id="kd"
              value={[kd]} 
              min={0} 
              max={1} 
              step={0.01} 
              onValueChange={(value) => setKd(value[0])}
              disabled={isRunning}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={handleStart} disabled={isRunning}>Start Control</Button>
          <Button onClick={handleStop} disabled={!isRunning} variant="outline">Stop Control</Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>
        
        {/* Control display */}
        <div className="border rounded-md p-4 bg-gray-50 mb-4">
          <div className="flex justify-between mb-2">
            <div>
              <span className="text-gray-600 text-sm mr-2">Time:</span>
              <span className="font-medium">{timeElapsed}s</span>
            </div>
            <div>
              <span className="text-gray-600 text-sm mr-2">Status:</span>
              <span className={`font-medium ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Process Value: {currentValue.toFixed(2)}</span>
                <span>Setpoint: {setpoint}</span>
              </div>
              <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-200 rounded-full" style={{width: `${setpoint}%`}}></div>
                <div 
                  className="absolute top-0 h-full w-2 bg-green-600 rounded-full transition-all" 
                  style={{left: `${Math.min(100, Math.max(0, currentValue))}%`}}
                ></div>
              </div>
            </div>
            
            {dataPoints.length > 0 && (
              <div className="relative w-full h-32 border">
                {/* Simple chart visualization */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {/* Draw setpoint line */}
                  <div 
                    className="absolute border-t border-red-400" 
                    style={{
                      top: `${100 - setpoint}%`,
                      left: '0',
                      width: '100%'
                    }}
                  ></div>
                  
                  {/* Draw process value line */}
                  {dataPoints.map((point, index) => {
                    if (index === 0) return null;
                    
                    const prevPoint = dataPoints[index - 1];
                    const x1 = (prevPoint.time / timeElapsed) * 100;
                    const y1 = 100 - (prevPoint.value);
                    const x2 = (point.time / timeElapsed) * 100;
                    const y2 = 100 - (point.value);
                    
                    return (
                      <svg 
                        key={index} 
                        className="absolute top-0 left-0 w-full h-full"
                        style={{overflow: 'visible'}}
                      >
                        <line 
                          x1={`${x1}%`} 
                          y1={`${y1}%`} 
                          x2={`${x2}%`} 
                          y2={`${y2}%`} 
                          stroke="green" 
                          strokeWidth="2"
                        />
                      </svg>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseSoftwareInterface>
  );
};

export default ProcessControlInterface;

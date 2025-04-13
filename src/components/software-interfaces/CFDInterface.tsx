
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Save, Download, Image, Grid3X3, ArrowRight } from "lucide-react";

interface CFDInterfaceProps {
  software: {
    name: string;
    description: string;
    category: string;
  };
}

const CFDInterface: React.FC<CFDInterfaceProps> = ({ software }) => {
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "meshing" | "solving" | "complete">("idle");
  const [progress, setProgress] = useState(0);

  const handleRunSimulation = () => {
    setSimulationStatus("meshing");
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        const newProgress = prev + 5;
        
        if (newProgress === 30) {
          setSimulationStatus("solving");
        }
        
        if (newProgress >= 100) {
          setSimulationStatus("complete");
          clearInterval(interval);
        }
        
        return newProgress;
      });
    }, 500);
  };

  return (
    <div className="space-y-6 mt-4">
      <Tabs defaultValue="geometry">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="geometry">Geometry</TabsTrigger>
          <TabsTrigger value="mesh">Mesh</TabsTrigger>
          <TabsTrigger value="physics">Physics Setup</TabsTrigger>
          <TabsTrigger value="solve">Solve</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geometry" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <h3 className="font-medium">Geometry Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="geometry-type">Geometry Type</Label>
                  <Select defaultValue="reactor">
                    <SelectTrigger id="geometry-type">
                      <SelectValue placeholder="Select geometry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reactor">Chemical Reactor</SelectItem>
                      <SelectItem value="pipe">Pipe Flow</SelectItem>
                      <SelectItem value="mixer">Static Mixer</SelectItem>
                      <SelectItem value="heat-exchanger">Heat Exchanger</SelectItem>
                      <SelectItem value="custom">Custom Geometry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dimension">Dimension</Label>
                  <Select defaultValue="3d">
                    <SelectTrigger id="dimension">
                      <SelectValue placeholder="Select dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2d">2D</SelectItem>
                      <SelectItem value="2d-axisymmetric">2D Axisymmetric</SelectItem>
                      <SelectItem value="3d">3D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="reactor-diameter">Reactor Diameter</Label>
                  <div className="flex items-center gap-2">
                    <Input id="reactor-diameter" defaultValue="0.5" />
                    <span className="text-sm whitespace-nowrap">m</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="reactor-height">Reactor Height</Label>
                  <div className="flex items-center gap-2">
                    <Input id="reactor-height" defaultValue="1.5" />
                    <span className="text-sm whitespace-nowrap">m</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="inlet-type">Inlet Type</Label>
                  <Select defaultValue="top">
                    <SelectTrigger id="inlet-type">
                      <SelectValue placeholder="Select inlet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top Inlet</SelectItem>
                      <SelectItem value="side">Side Inlet</SelectItem>
                      <SelectItem value="multiple">Multiple Inlets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="outlet-type">Outlet Type</Label>
                  <Select defaultValue="bottom">
                    <SelectTrigger id="outlet-type">
                      <SelectValue placeholder="Select outlet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom">Bottom Outlet</SelectItem>
                      <SelectItem value="side">Side Outlet</SelectItem>
                      <SelectItem value="multiple">Multiple Outlets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="inlet-diameter">Inlet Diameter</Label>
                  <div className="flex items-center gap-2">
                    <Input id="inlet-diameter" defaultValue="0.05" />
                    <span className="text-sm whitespace-nowrap">m</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="outlet-diameter">Outlet Diameter</Label>
                  <div className="flex items-center gap-2">
                    <Input id="outlet-diameter" defaultValue="0.05" />
                    <span className="text-sm whitespace-nowrap">m</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full">
                    Generate Geometry
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Geometry Preview</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-16 w-16 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">[3D geometry visualization would appear here]</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Chemical reactor with top inlet and bottom outlet
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Proceed to Mesh
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mesh" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <h3 className="font-medium">Mesh Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="mesh-type">Mesh Type</Label>
                  <Select defaultValue="tetrahedral">
                    <SelectTrigger id="mesh-type">
                      <SelectValue placeholder="Select mesh type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tetrahedral">Tetrahedral</SelectItem>
                      <SelectItem value="hexahedral">Hexahedral</SelectItem>
                      <SelectItem value="polyhedral">Polyhedral</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mesh-size">Base Mesh Size</Label>
                    <span className="text-sm">0.02 m</span>
                  </div>
                  <Slider id="mesh-size" defaultValue={[0.02]} min={0.001} max={0.05} step={0.001} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mesh-quality">Mesh Quality</Label>
                    <span className="text-sm">High</span>
                  </div>
                  <Slider id="mesh-quality" defaultValue={[0.8]} min={0} max={1} step={0.1} />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="boundary-layers">Boundary Layers</Label>
                  <div className="flex items-center gap-2">
                    <Input id="boundary-layers" defaultValue="5" type="number" min="0" max="10" />
                    <span className="text-sm whitespace-nowrap">layers</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="inflation-ratio">Inflation Ratio</Label>
                  <div className="flex items-center gap-2">
                    <Input id="inflation-ratio" defaultValue="1.2" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mesh-refinement">Refinement Regions</Label>
                  <Select defaultValue="inlet-outlet">
                    <SelectTrigger id="mesh-refinement">
                      <SelectValue placeholder="Select refinement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Refinement</SelectItem>
                      <SelectItem value="inlet-outlet">Inlet & Outlet Refinement</SelectItem>
                      <SelectItem value="walls">Wall Refinement</SelectItem>
                      <SelectItem value="all">All Boundaries Refinement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="refinement-level">Refinement Level</Label>
                  <div className="flex items-center gap-2">
                    <Input id="refinement-level" defaultValue="2" type="number" min="1" max="5" />
                    <span className="text-sm whitespace-nowrap">levels</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 space-y-2">
                  <h5 className="text-sm font-medium">Estimated Mesh Size</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500 dark:text-gray-400">Elements:</div>
                    <div className="font-medium">~523,000</div>
                    <div className="text-gray-500 dark:text-gray-400">Nodes:</div>
                    <div className="font-medium">~127,000</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full">
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Generate Mesh
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Mesh Preview</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                <div className="text-center">
                  <Grid3X3 className="h-16 w-16 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">[3D mesh visualization would appear here]</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Tetrahedral mesh with boundary layer refinement
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Proceed to Physics Setup
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="physics" className="p-4 border rounded-md mt-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Flow Physics</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="flow-type">Flow Type</Label>
                  <Select defaultValue="turbulent">
                    <SelectTrigger id="flow-type">
                      <SelectValue placeholder="Select flow type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laminar">Laminar</SelectItem>
                      <SelectItem value="turbulent">Turbulent</SelectItem>
                      <SelectItem value="transitional">Transitional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="turbulence-model">Turbulence Model</Label>
                  <Select defaultValue="k-epsilon">
                    <SelectTrigger id="turbulence-model">
                      <SelectValue placeholder="Select turbulence model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k-epsilon">k-epsilon</SelectItem>
                      <SelectItem value="k-omega">k-omega</SelectItem>
                      <SelectItem value="sst">Shear Stress Transport (SST)</SelectItem>
                      <SelectItem value="les">Large Eddy Simulation (LES)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="multiphase">Multiphase Model</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="multiphase">
                      <SelectValue placeholder="Select multiphase model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Single Phase</SelectItem>
                      <SelectItem value="vof">Volume of Fluid (VOF)</SelectItem>
                      <SelectItem value="mixture">Mixture Model</SelectItem>
                      <SelectItem value="eulerian">Eulerian Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="energy-equation">Energy Equation</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger id="energy-equation">
                      <SelectValue placeholder="Energy equation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="species-transport">Species Transport</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger id="species-transport">
                      <SelectValue placeholder="Species transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <h3 className="font-medium">Materials</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="fluid-material">Fluid Material</Label>
                  <Select defaultValue="water">
                    <SelectTrigger id="fluid-material">
                      <SelectValue placeholder="Select fluid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="glycol">Ethylene Glycol</SelectItem>
                      <SelectItem value="oil">Oil</SelectItem>
                      <SelectItem value="custom">Custom Fluid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="fluid-density">Density</Label>
                  <div className="flex items-center gap-2">
                    <Input id="fluid-density" defaultValue="998.2" />
                    <span className="text-sm whitespace-nowrap">kg/m³</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="fluid-viscosity">Dynamic Viscosity</Label>
                  <div className="flex items-center gap-2">
                    <Input id="fluid-viscosity" defaultValue="0.001003" />
                    <span className="text-sm whitespace-nowrap">Pa·s</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="fluid-cp">Specific Heat</Label>
                  <div className="flex items-center gap-2">
                    <Input id="fluid-cp" defaultValue="4182" />
                    <span className="text-sm whitespace-nowrap">J/(kg·K)</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="fluid-k">Thermal Conductivity</Label>
                  <div className="flex items-center gap-2">
                    <Input id="fluid-k" defaultValue="0.6" />
                    <span className="text-sm whitespace-nowrap">W/(m·K)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Boundary Conditions</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Inlet</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="inlet-type-bc">Type</Label>
                      <Select defaultValue="velocity">
                        <SelectTrigger id="inlet-type-bc">
                          <SelectValue placeholder="Select inlet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="velocity">Velocity Inlet</SelectItem>
                          <SelectItem value="mass-flow">Mass Flow Inlet</SelectItem>
                          <SelectItem value="pressure">Pressure Inlet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="inlet-velocity">Velocity Magnitude</Label>
                      <div className="flex items-center gap-2">
                        <Input id="inlet-velocity" defaultValue="0.5" />
                        <span className="text-sm whitespace-nowrap">m/s</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="inlet-turbulence">Turbulence Intensity</Label>
                      <div className="flex items-center gap-2">
                        <Input id="inlet-turbulence" defaultValue="5" />
                        <span className="text-sm whitespace-nowrap">%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="inlet-temperature">Temperature</Label>
                      <div className="flex items-center gap-2">
                        <Input id="inlet-temperature" defaultValue="298.15" />
                        <span className="text-sm whitespace-nowrap">K</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Outlet</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="outlet-type-bc">Type</Label>
                      <Select defaultValue="pressure">
                        <SelectTrigger id="outlet-type-bc">
                          <SelectValue placeholder="Select outlet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pressure">Pressure Outlet</SelectItem>
                          <SelectItem value="outflow">Outflow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="outlet-pressure">Gauge Pressure</Label>
                      <div className="flex items-center gap-2">
                        <Input id="outlet-pressure" defaultValue="0" />
                        <span className="text-sm whitespace-nowrap">Pa</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Wall</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="wall-condition">Condition</Label>
                      <Select defaultValue="no-slip">
                        <SelectTrigger id="wall-condition">
                          <SelectValue placeholder="Select wall condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-slip">No Slip</SelectItem>
                          <SelectItem value="slip">Slip</SelectItem>
                          <SelectItem value="moving">Moving Wall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="thermal-condition">Thermal Condition</Label>
                      <Select defaultValue="adiabatic">
                        <SelectTrigger id="thermal-condition">
                          <SelectValue placeholder="Select thermal condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adiabatic">Adiabatic</SelectItem>
                          <SelectItem value="constant-temperature">Constant Temperature</SelectItem>
                          <SelectItem value="heat-flux">Heat Flux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium">Solution Control</h3>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                <div>
                  <Label htmlFor="solver-type">Solver Type</Label>
                  <Select defaultValue="pressure-based">
                    <SelectTrigger id="solver-type">
                      <SelectValue placeholder="Select solver type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pressure-based">Pressure-Based</SelectItem>
                      <SelectItem value="density-based">Density-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="time-dependence">Time Dependency</Label>
                  <Select defaultValue="steady">
                    <SelectTrigger id="time-dependence">
                      <SelectValue placeholder="Select time dependency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steady">Steady State</SelectItem>
                      <SelectItem value="transient">Transient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Proceed to Solve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="solve" className="p-4 border rounded-md mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Solver Settings</h3>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                  <div>
                    <Label htmlFor="discretization-scheme">Discretization Scheme</Label>
                    <Select defaultValue="second-order">
                      <SelectTrigger id="discretization-scheme">
                        <SelectValue placeholder="Select scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-order">First Order</SelectItem>
                        <SelectItem value="second-order">Second Order</SelectItem>
                        <SelectItem value="quick">QUICK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pressure-velocity-coupling">Pressure-Velocity Coupling</Label>
                    <Select defaultValue="simple">
                      <SelectTrigger id="pressure-velocity-coupling">
                        <SelectValue placeholder="Select coupling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">SIMPLE</SelectItem>
                        <SelectItem value="piso">PISO</SelectItem>
                        <SelectItem value="coupled">Coupled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="max-iterations">Maximum Iterations</Label>
                    <Input id="max-iterations" defaultValue="1000" type="number" min="100" max="10000" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="convergence-criteria">Convergence Criteria</Label>
                      <span className="text-sm">10<sup>-4</sup></span>
                    </div>
                    <Slider id="convergence-criteria" defaultValue={[0.0001]} min={0.000001} max={0.01} step={0.000001} />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="under-relaxation">Under-Relaxation Factors</Label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Label htmlFor="urf-pressure" className="text-xs">Pressure</Label>
                        <Input id="urf-pressure" defaultValue="0.3" className="h-8" />
                      </div>
                      <div>
                        <Label htmlFor="urf-momentum" className="text-xs">Momentum</Label>
                        <Input id="urf-momentum" defaultValue="0.7" className="h-8" />
                      </div>
                      <div>
                        <Label htmlFor="urf-turbulence" className="text-xs">Turbulence</Label>
                        <Input id="urf-turbulence" defaultValue="0.8" className="h-8" />
                      </div>
                      <div>
                        <Label htmlFor="urf-energy" className="text-xs">Energy</Label>
                        <Input id="urf-energy" defaultValue="0.9" className="h-8" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium">Monitors</h3>
                
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800 space-y-3">
                  <div>
                    <Label htmlFor="residual-plot">Residual Plot</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="residual-plot">
                        <SelectValue placeholder="Select residuals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Equations</SelectItem>
                        <SelectItem value="continuity">Continuity Only</SelectItem>
                        <SelectItem value="selected">Selected Equations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="point-monitor">Point Monitors</Label>
                    <div className="flex items-center gap-2">
                      <Input id="point-monitor" placeholder="e.g. Outlet Velocity" />
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Add Monitor
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="surface-monitor">Surface Monitors</Label>
                    <div className="flex items-center gap-2">
                      <Input id="surface-monitor" placeholder="e.g. Inlet Mass Flow" />
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Add Monitor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Solution Progress</h3>
                
                <div className="border rounded-md p-6 bg-white dark:bg-gray-800 flex flex-col h-[450px]">
                  {simulationStatus === "idle" ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Ready to Initialize Solution</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Set up your solver parameters and click "Run Simulation"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 flex flex-col">
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">Simulation Status</h4>
                            <span className="text-sm font-medium text-blue-500">
                              {simulationStatus === "meshing" ? "Meshing..." : 
                               simulationStatus === "solving" ? "Solving..." : 
                               simulationStatus === "complete" ? "Completed" : ""}
                            </span>
                          </div>
                          
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{progress.toFixed(0)}% Complete</span>
                            <span>Iteration: {Math.round(progress * 10)}/1000</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 aspect-video bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center mb-4">
                          <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">[Residual plot would appear here]</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-700">
                            <div className="text-xs text-gray-500 mb-1">Continuity Residual</div>
                            <div className="text-lg font-medium">
                              {simulationStatus === "complete" ? "9.8e-5" : "4.3e-2"}
                            </div>
                          </div>
                          <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-700">
                            <div className="text-xs text-gray-500 mb-1">Energy Residual</div>
                            <div className="text-lg font-medium">
                              {simulationStatus === "complete" ? "2.5e-6" : "1.7e-3"}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {simulationStatus === "complete" && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3 mb-4">
                          <p className="text-green-600 dark:text-green-400 text-sm">
                            Simulation completed successfully! You can now view the results.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button variant="outline" disabled={simulationStatus === "solving" || simulationStatus === "meshing"}>
                      Initialize
                    </Button>
                    
                    <Button 
                      onClick={handleRunSimulation}
                      disabled={simulationStatus === "solving" || simulationStatus === "meshing"}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {simulationStatus === "complete" ? "Re-run Simulation" : "Run Simulation"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="p-4 border rounded-md mt-4">
          {simulationStatus === "complete" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Post-Processing</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Results
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">[Velocity contour would appear here]</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Velocity contour on mid-plane section
                    </p>
                  </div>
                </div>
                
                <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">[Pressure contour would appear here]</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Pressure distribution on reactor walls
                    </p>
                  </div>
                </div>
                
                <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">[Streamlines visualization would appear here]</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Flow streamlines colored by velocity magnitude
                    </p>
                  </div>
                </div>
                
                <div className="aspect-square bg-white dark:bg-gray-800 border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">[Temperature contour would appear here]</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Temperature distribution
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                <h3 className="font-medium mb-3">Quantitative Results</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Flow Parameters</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-1.5">Average Outlet Velocity</td>
                          <td className="text-right">0.48 m/s</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Maximum Velocity</td>
                          <td className="text-right">1.23 m/s</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Pressure Drop</td>
                          <td className="text-right">243 Pa</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Average Wall Shear Stress</td>
                          <td className="text-right">0.52 Pa</td>
                        </tr>
                        <tr>
                          <td className="py-1.5">Residence Time</td>
                          <td className="text-right">187 s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Thermal Analysis</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-1.5">Average Outlet Temperature</td>
                          <td className="text-right">304.2 K</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Maximum Temperature</td>
                          <td className="text-right">308.7 K</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Heat Transfer Coefficient</td>
                          <td className="text-right">245 W/(m²·K)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1.5">Total Heat Transfer</td>
                          <td className="text-right">2.84 kW</td>
                        </tr>
                        <tr>
                          <td className="py-1.5">Temperature Increase</td>
                          <td className="text-right">6.05 K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-md h-[500px] bg-gray-50 dark:bg-gray-800">
              <Play className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Results Available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                You need to run the simulation before viewing results.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 text-center max-w-md mb-6">
                Go to the "Solve" tab to run your simulation.
              </p>
              <Button onClick={handleRunSimulation}>
                <Play className="h-4 w-4 mr-1" />
                Run Simulation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CFDInterface;


import React, { useState } from 'react';
import GlassPanel from "@/components/ui/GlassPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplets, Waves, Activity, Percent, BarChart3, ConnectIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ComponentDetailsProps {
  component: string;
}

const ComponentDetailsPanel: React.FC<ComponentDetailsProps> = ({ component }) => {
  const [connectMode, setConnectMode] = useState<boolean>(false);

  // HYSYS-like property data for components
  const componentProperties = {
    "Methane": {
      formula: "CH₄",
      molarWeight: 16.04,
      criticalTemp: 190.56, // K
      criticalPressure: 4599, // kPa
      accentricFactor: 0.011,
      boilingPoint: 111.66, // K
      liquidDensity: 422.62, // kg/m³
      vaporPressure: "High",
      thermalConductivity: 0.03,
      heatCapacity: 2.22, // kJ/kg·K
      heatsOfFormation: {
        ideal: -74.85, // kJ/mol
        liquid: -89.43, // kJ/mol
      },
      antoineCoefficients: {
        A: 3.9895,
        B: 443.028,
        C: -0.49
      }
    },
    "Ethane": {
      formula: "C₂H₆",
      molarWeight: 30.07,
      criticalTemp: 305.32, // K
      criticalPressure: 4872, // kPa
      accentricFactor: 0.099,
      boilingPoint: 184.55, // K
      liquidDensity: 544.0, // kg/m³
      vaporPressure: "Medium",
      thermalConductivity: 0.021,
      heatCapacity: 1.75, // kJ/kg·K
      heatsOfFormation: {
        ideal: -84.68, // kJ/mol
        liquid: -89.43 // kJ/mol
      },
      antoineCoefficients: {
        A: 3.95405,
        B: 659.739,
        C: -16.716
      }
    },
    "Propane": {
      formula: "C₃H₈",
      molarWeight: 44.10,
      criticalTemp: 369.83, // K
      criticalPressure: 4248, // kPa
      accentricFactor: 0.152,
      boilingPoint: 231.05, // K
      liquidDensity: 581.0, // kg/m³
      vaporPressure: "Medium",
      thermalConductivity: 0.016,
      heatCapacity: 1.67, // kJ/kg·K
      heatsOfFormation: {
        ideal: -103.8, // kJ/mol
        liquid: -117.2 // kJ/mol
      },
      antoineCoefficients: {
        A: 3.92828,
        B: 803.997,
        C: -26.11
      }
    },
    "n-Butane": {
      formula: "C₄H₁₀",
      molarWeight: 58.12,
      criticalTemp: 425.12, // K
      criticalPressure: 3796, // kPa
      accentricFactor: 0.199,
      boilingPoint: 272.65, // K
      liquidDensity: 601.0, // kg/m³
      vaporPressure: "Medium-Low",
      thermalConductivity: 0.014,
      heatCapacity: 1.71, // kJ/kg·K
      heatsOfFormation: {
        ideal: -125.6, // kJ/mol
        liquid: -147.3 // kJ/mol
      },
      antoineCoefficients: {
        A: 4.00266,
        B: 947.54,
        C: -6.215
      }
    },
    "i-Butane": {
      formula: "C₄H₁₀",
      molarWeight: 58.12,
      criticalTemp: 408.14, // K
      criticalPressure: 3648, // kPa
      accentricFactor: 0.183,
      boilingPoint: 261.45, // K
      liquidDensity: 594.0, // kg/m³
      vaporPressure: "Medium-Low",
      thermalConductivity: 0.013,
      heatCapacity: 1.68, // kJ/kg·K
      heatsOfFormation: {
        ideal: -134.5, // kJ/mol
        liquid: -153.7 // kJ/mol
      },
      antoineCoefficients: {
        A: 4.00432,
        B: 924.01,
        C: -2.311
      }
    },
    "n-Pentane": {
      formula: "C₅H₁₂",
      molarWeight: 72.15,
      criticalTemp: 469.7, // K
      criticalPressure: 3370, // kPa
      accentricFactor: 0.251,
      boilingPoint: 309.22, // K
      liquidDensity: 626.0, // kg/m³
      vaporPressure: "Low",
      thermalConductivity: 0.128,
      heatCapacity: 1.66, // kJ/kg·K
      heatsOfFormation: {
        ideal: -146.8, // kJ/mol
        liquid: -173.5 // kJ/mol
      },
      antoineCoefficients: {
        A: 3.97786,
        B: 1064.84,
        C: -41.136
      }
    },
    "Ethylene": {
      formula: "C₂H₄",
      molarWeight: 28.05,
      criticalTemp: 282.34, // K
      criticalPressure: 5041, // kPa
      accentricFactor: 0.087,
      boilingPoint: 169.15, // K
      liquidDensity: 577.0, // kg/m³
      vaporPressure: "High",
      thermalConductivity: 0.0210,
      heatCapacity: 1.53, // kJ/kg·K
      heatsOfFormation: {
        ideal: 52.47, // kJ/mol
        liquid: 0 // kJ/mol (not commonly found as liquid)
      },
      antoineCoefficients: {
        A: 3.87261,
        B: 584.146,
        C: -18.307
      }
    },
    "Methanol": {
      formula: "CH₃OH",
      molarWeight: 32.04,
      criticalTemp: 512.6, // K
      criticalPressure: 8084, // kPa
      accentricFactor: 0.564,
      boilingPoint: 337.85, // K
      liquidDensity: 792.0, // kg/m³
      vaporPressure: "Medium",
      thermalConductivity: 0.202,
      heatCapacity: 2.53, // kJ/kg·K
      heatsOfFormation: {
        ideal: -201.2, // kJ/mol
        liquid: -238.7 // kJ/mol
      },
      antoineCoefficients: {
        A: 5.20277,
        B: 1580.08,
        C: -33.5
      }
    },
    "Ethanol": {
      formula: "C₂H₅OH",
      molarWeight: 46.07,
      criticalTemp: 513.9, // K
      criticalPressure: 6148, // kPa
      accentricFactor: 0.644,
      boilingPoint: 351.39, // K
      liquidDensity: 789.0, // kg/m³
      vaporPressure: "Medium-Low",
      thermalConductivity: 0.167,
      heatCapacity: 2.44, // kJ/kg·K
      heatsOfFormation: {
        ideal: -235.3, // kJ/mol
        liquid: -277.6 // kJ/mol
      },
      antoineCoefficients: {
        A: 5.24677,
        B: 1598.673,
        C: -46.424
      }
    },
    "Water": {
      formula: "H₂O",
      molarWeight: 18.02,
      criticalTemp: 647.1, // K
      criticalPressure: 22064, // kPa
      accentricFactor: 0.344,
      boilingPoint: 373.15, // K
      liquidDensity: 998.0, // kg/m³
      vaporPressure: "Low",
      thermalConductivity: 0.608,
      heatCapacity: 4.18, // kJ/kg·K
      heatsOfFormation: {
        ideal: -241.82, // kJ/mol
        liquid: -285.83 // kJ/mol
      },
      antoineCoefficients: {
        A: 5.11564,
        B: 1687.537,
        C: -42.98
      }
    },
    "Benzene": {
      formula: "C₆H₆",
      molarWeight: 78.11,
      criticalTemp: 562.05, // K
      criticalPressure: 4894, // kPa
      accentricFactor: 0.210,
      boilingPoint: 353.25, // K
      liquidDensity: 876.0, // kg/m³
      vaporPressure: "Low",
      thermalConductivity: 0.142,
      heatCapacity: 1.74, // kJ/kg·K
      heatsOfFormation: {
        ideal: 82.93, // kJ/mol
        liquid: 49.0 // kJ/mol
      },
      antoineCoefficients: {
        A: 4.01814,
        B: 1203.835,
        C: -53.226
      }
    },
    "Toluene": {
      formula: "C₇H₈",
      molarWeight: 92.14,
      criticalTemp: 591.75, // K
      criticalPressure: 4109, // kPa
      accentricFactor: 0.263,
      boilingPoint: 383.75, // K
      liquidDensity: 867.0, // kg/m³
      vaporPressure: "Low",
      thermalConductivity: 0.134,
      heatCapacity: 1.71, // kJ/kg·K
      heatsOfFormation: {
        ideal: 50.0, // kJ/mol
        liquid: 12.0 // kJ/mol
      },
      antoineCoefficients: {
        A: 4.07827,
        B: 1343.943,
        C: -53.773
      }
    },
    "Acetic Acid": {
      formula: "CH₃COOH",
      molarWeight: 60.05,
      criticalTemp: 591.95, // K
      criticalPressure: 5786, // kPa
      accentricFactor: 0.467,
      boilingPoint: 391.05, // K
      liquidDensity: 1049.0, // kg/m³
      vaporPressure: "Low",
      thermalConductivity: 0.159,
      heatCapacity: 2.05, // kJ/kg·K
      heatsOfFormation: {
        ideal: -432.4, // kJ/mol
        liquid: -484.3 // kJ/mol
      },
      antoineCoefficients: {
        A: 4.68206,
        B: 1642.54,
        C: -39.764
      }
    },
    "Nitrogen": {
      formula: "N₂",
      molarWeight: 28.01,
      criticalTemp: 126.2, // K
      criticalPressure: 3400, // kPa
      accentricFactor: 0.039,
      boilingPoint: 77.35, // K
      liquidDensity: 807.0, // kg/m³
      vaporPressure: "Very High",
      thermalConductivity: 0.0259,
      heatCapacity: 1.04, // kJ/kg·K
      heatsOfFormation: {
        ideal: 0, // kJ/mol
        liquid: 0 // kJ/mol
      },
      antoineCoefficients: {
        A: 3.61947,
        B: 255.68,
        C: -6.6
      }
    },
    "Oxygen": {
      formula: "O₂",
      molarWeight: 32.00,
      criticalTemp: 154.6, // K
      criticalPressure: 5046, // kPa
      accentricFactor: 0.022,
      boilingPoint: 90.17, // K
      liquidDensity: 1141.0, // kg/m³
      vaporPressure: "Very High",
      thermalConductivity: 0.0266,
      heatCapacity: 0.92, // kJ/kg·K
      heatsOfFormation: {
        ideal: 0, // kJ/mol
        liquid: 0 // kJ/mol
      },
      antoineCoefficients: {
        A: 3.95010,
        B: 340.024,
        C: -4.144
      }
    },
    "Carbon Dioxide": {
      formula: "CO₂",
      molarWeight: 44.01,
      criticalTemp: 304.12, // K
      criticalPressure: 7377, // kPa
      accentricFactor: 0.225,
      boilingPoint: 194.65, // K (sublimation point)
      liquidDensity: 1101.0, // kg/m³ (at high pressure)
      vaporPressure: "High",
      thermalConductivity: 0.0166,
      heatCapacity: 0.846, // kJ/kg·K
      heatsOfFormation: {
        ideal: -393.51, // kJ/mol
        liquid: 0 // kJ/mol (not commonly found as liquid at standard conditions)
      },
      antoineCoefficients: {
        A: 6.81228,
        B: 1301.679,
        C: -3.494
      }
    }
  };

  const defaultProps = {
    formula: "Unknown",
    molarWeight: 0,
    criticalTemp: 0,
    criticalPressure: 0,
    accentricFactor: 0,
    boilingPoint: 0,
    liquidDensity: 0,
    vaporPressure: "Unknown",
    thermalConductivity: 0,
    heatCapacity: 0,
    heatsOfFormation: {
      ideal: 0,
      liquid: 0
    },
    antoineCoefficients: {
      A: 0,
      B: 0,
      C: 0
    }
  };

  const props = componentProperties[component as keyof typeof componentProperties] || defaultProps;

  const handleConnect = () => {
    setConnectMode(!connectMode);
    if (!connectMode) {
      toast({
        title: "Connect Mode Enabled",
        description: "Click on another component to create a connection",
      });
    } else {
      toast({
        title: "Connect Mode Disabled",
        description: "Connection canceled",
      });
    }
  };

  return (
    <GlassPanel className="mt-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{component} Properties</h3>
        <div className="text-sm text-blue-600 font-mono">{props.formula}</div>
      </div>

      {/* Basic Component Information Card */}
      <div className="mb-4 bg-white p-4 rounded-md shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Formula</p>
            <p className="font-semibold">{props.formula}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Molar Weight</p>
            <p className="font-semibold">{props.molarWeight} g/mol</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Boiling Point</p>
            <p className="font-semibold">{props.boilingPoint} K</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Critical Temp</p>
            <p className="font-semibold">{props.criticalTemp} K</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-dashed border-blue-300 hover:bg-blue-50"
          onClick={handleConnect}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          {connectMode ? "Cancel Connection" : "Connect Component"}
        </Button>
      </div>

      <Tabs defaultValue="physical">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="physical">
            <Thermometer className="h-4 w-4 mr-2" />
            Physical
          </TabsTrigger>
          <TabsTrigger value="critical">
            <Activity className="h-4 w-4 mr-2" />
            Critical
          </TabsTrigger>
          <TabsTrigger value="thermodynamic">
            <Waves className="h-4 w-4 mr-2" />
            Thermodynamic
          </TabsTrigger>
          <TabsTrigger value="antoine">
            <BarChart3 className="h-4 w-4 mr-2" />
            Antoine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Molar Weight</div>
              <div className="text-lg font-semibold">{props.molarWeight} g/mol</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Boiling Point</div>
              <div className="text-lg font-semibold">{props.boilingPoint} K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Liquid Density</div>
              <div className="text-lg font-semibold">{props.liquidDensity} kg/m³</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Vapor Pressure</div>
              <div className="text-lg font-semibold">{props.vaporPressure}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Critical Temperature</div>
              <div className="text-lg font-semibold">{props.criticalTemp} K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Critical Pressure</div>
              <div className="text-lg font-semibold">{props.criticalPressure} kPa</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Acentric Factor</div>
              <div className="text-lg font-semibold">{props.accentricFactor}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thermodynamic" className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Thermal Conductivity</div>
              <div className="text-lg font-semibold">{props.thermalConductivity} W/m·K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Heat Capacity</div>
              <div className="text-lg font-semibold">{props.heatCapacity} kJ/kg·K</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Heat of Formation (Ideal)</div>
              <div className="text-lg font-semibold">{props.heatsOfFormation.ideal} kJ/mol</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Heat of Formation (Liquid)</div>
              <div className="text-lg font-semibold">{props.heatsOfFormation.liquid} kJ/mol</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="antoine" className="space-y-2">
          <div className="p-4 bg-white rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-2">Antoine Equation Constants</div>
            <div className="text-sm">
              log₁₀(P) = A - B/(T + C)
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-sm text-gray-500">Coefficient A</div>
                <div className="text-lg font-semibold">{props.antoineCoefficients.A.toFixed(5)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Coefficient B</div>
                <div className="text-lg font-semibold">{props.antoineCoefficients.B.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Coefficient C</div>
                <div className="text-lg font-semibold">{props.antoineCoefficients.C.toFixed(3)}</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassPanel>
  );
};

export default ComponentDetailsPanel;

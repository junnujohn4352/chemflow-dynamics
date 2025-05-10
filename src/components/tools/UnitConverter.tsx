
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Repeat, ArrowRight, ArrowDown, ArrowUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GlassPanel from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UnitCategory = {
  name: string;
  display: string;
  icon: React.ReactElement;
  color: string;
  units: {
    name: string;
    symbol: string;
    conversionToBase: number;
    offset?: number;
  }[];
  usageContext?: string; // Chemical engineering context
};

const UnitConverter: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [category, setCategory] = useState<string>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [favoritesMode, setFavoritesMode] = useState<boolean>(false);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(
    localStorage.getItem("favCategories") ? JSON.parse(localStorage.getItem("favCategories") || "[]") : ["pressure", "temperature", "flow"]
  );
  const { toast } = useToast();

  // Chemical engineering specific unit categories with beautiful colors and relevant context
  const unitCategories: UnitCategory[] = [
    {
      name: "length",
      display: "Length",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-blue-500 to-blue-600",
      units: [
        { name: "Meter", symbol: "m", conversionToBase: 1 },
        { name: "Centimeter", symbol: "cm", conversionToBase: 0.01 },
        { name: "Millimeter", symbol: "mm", conversionToBase: 0.001 },
        { name: "Kilometer", symbol: "km", conversionToBase: 1000 },
        { name: "Micrometer", symbol: "μm", conversionToBase: 0.000001 },
        { name: "Nanometer", symbol: "nm", conversionToBase: 0.000000001 },
        { name: "Inch", symbol: "in", conversionToBase: 0.0254 },
        { name: "Foot", symbol: "ft", conversionToBase: 0.3048 },
        { name: "Yard", symbol: "yd", conversionToBase: 0.9144 },
        { name: "Mile", symbol: "mi", conversionToBase: 1609.344 },
        { name: "Angstrom", symbol: "Å", conversionToBase: 1e-10 },
      ],
      usageContext: "Pipe lengths, equipment dimensions, vessel heights"
    },
    {
      name: "mass",
      display: "Mass",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-green-500 to-green-600",
      units: [
        { name: "Kilogram", symbol: "kg", conversionToBase: 1 },
        { name: "Gram", symbol: "g", conversionToBase: 0.001 },
        { name: "Milligram", symbol: "mg", conversionToBase: 0.000001 },
        { name: "Microgram", symbol: "μg", conversionToBase: 1e-9 },
        { name: "Pound", symbol: "lb", conversionToBase: 0.45359237 },
        { name: "Ounce", symbol: "oz", conversionToBase: 0.028349523125 },
        { name: "Ton (metric)", symbol: "t", conversionToBase: 1000 },
        { name: "Ton (short)", symbol: "ton", conversionToBase: 907.18474 },
        { name: "Ton (long)", symbol: "long ton", conversionToBase: 1016.0469088 },
        { name: "Stone", symbol: "st", conversionToBase: 6.35029318 },
        { name: "Slug", symbol: "slug", conversionToBase: 14.5939029 },
        { name: "Mole", symbol: "mol", conversionToBase: 0.001 }, // Assuming 1 g/mol for simplicity
      ],
      usageContext: "Reactant masses, product yields, catalyst quantities"
    },
    {
      name: "temperature",
      display: "Temperature",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-red-500 to-orange-500",
      units: [
        { name: "Celsius", symbol: "°C", conversionToBase: 1, offset: 0 },
        { name: "Fahrenheit", symbol: "°F", conversionToBase: 5/9, offset: -32 },
        { name: "Kelvin", symbol: "K", conversionToBase: 1, offset: -273.15 },
        { name: "Rankine", symbol: "°R", conversionToBase: 5/9, offset: -491.67 },
      ],
      usageContext: "Reaction temperatures, boiling points, heat exchanger design"
    },
    {
      name: "pressure",
      display: "Pressure",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-purple-500 to-purple-600",
      units: [
        { name: "Pascal", symbol: "Pa", conversionToBase: 1 },
        { name: "Kilopascal", symbol: "kPa", conversionToBase: 1000 },
        { name: "Megapascal", symbol: "MPa", conversionToBase: 1000000 },
        { name: "Bar", symbol: "bar", conversionToBase: 100000 },
        { name: "Millibar", symbol: "mbar", conversionToBase: 100 },
        { name: "PSI", symbol: "psi", conversionToBase: 6894.76 },
        { name: "Atmosphere", symbol: "atm", conversionToBase: 101325 },
        { name: "Torr", symbol: "Torr", conversionToBase: 133.322 },
        { name: "mm of Mercury", symbol: "mmHg", conversionToBase: 133.322 },
        { name: "mm of Water", symbol: "mmH₂O", conversionToBase: 9.80665 },
        { name: "Inches of Mercury", symbol: "inHg", conversionToBase: 3386.39 },
        { name: "Inches of Water", symbol: "inH₂O", conversionToBase: 249.089 },
      ],
      usageContext: "Operating pressures, vapor pressures, pressure drops across equipment"
    },
    {
      name: "volume",
      display: "Volume",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-teal-500 to-teal-600",
      units: [
        { name: "Cubic Meter", symbol: "m³", conversionToBase: 1 },
        { name: "Cubic Centimeter", symbol: "cm³", conversionToBase: 0.000001 },
        { name: "Cubic Millimeter", symbol: "mm³", conversionToBase: 1e-9 },
        { name: "Liter", symbol: "L", conversionToBase: 0.001 },
        { name: "Milliliter", symbol: "mL", conversionToBase: 0.000001 },
        { name: "Cubic Foot", symbol: "ft³", conversionToBase: 0.0283168 },
        { name: "Cubic Inch", symbol: "in³", conversionToBase: 0.0000163871 },
        { name: "Gallon (US)", symbol: "gal", conversionToBase: 0.00378541 },
        { name: "Gallon (UK)", symbol: "gal (UK)", conversionToBase: 0.00454609 },
        { name: "Quart (US)", symbol: "qt", conversionToBase: 0.000946353 },
        { name: "Fluid Ounce (US)", symbol: "fl oz", conversionToBase: 0.0000295735 },
        { name: "Fluid Ounce (UK)", symbol: "fl oz (UK)", conversionToBase: 0.0000284131 },
        { name: "Barrel (oil)", symbol: "bbl", conversionToBase: 0.158987 },
        { name: "Barrel (US liquid)", symbol: "bbl (US)", conversionToBase: 0.119240 },
      ],
      usageContext: "Vessel volumes, reactor sizes, product volumes"
    },
    {
      name: "flow",
      display: "Flow Rate",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-blue-500 to-indigo-600",
      units: [
        { name: "Cubic Meter/Second", symbol: "m³/s", conversionToBase: 1 },
        { name: "Cubic Meter/Hour", symbol: "m³/h", conversionToBase: 1/3600 },
        { name: "Liter/Second", symbol: "L/s", conversionToBase: 0.001 },
        { name: "Liter/Minute", symbol: "L/min", conversionToBase: 0.001/60 },
        { name: "Liter/Hour", symbol: "L/h", conversionToBase: 0.001/3600 },
        { name: "Cubic Feet/Second", symbol: "ft³/s", conversionToBase: 0.0283168 },
        { name: "Cubic Feet/Minute", symbol: "cfm", conversionToBase: 0.0283168/60 },
        { name: "Cubic Feet/Hour", symbol: "ft³/h", conversionToBase: 0.0283168/3600 },
        { name: "Gallon/Minute", symbol: "gpm", conversionToBase: 0.0000630902 },
        { name: "Gallon/Hour", symbol: "gph", conversionToBase: 0.0000630902/60 },
        { name: "Barrel/Day", symbol: "bbl/day", conversionToBase: 0.158987/(24*3600) },
        { name: "Million Gallons/Day", symbol: "MGD", conversionToBase: 0.0438126 },
        { name: "Standard Cubic Feet/Minute", symbol: "SCFM", conversionToBase: 0.000471947 },
      ],
      usageContext: "Pump rates, feed flows, production rates"
    },
    {
      name: "energy",
      display: "Energy",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-yellow-500 to-yellow-600",
      units: [
        { name: "Joule", symbol: "J", conversionToBase: 1 },
        { name: "Kilojoule", symbol: "kJ", conversionToBase: 1000 },
        { name: "Megajoule", symbol: "MJ", conversionToBase: 1000000 },
        { name: "Calorie", symbol: "cal", conversionToBase: 4.184 },
        { name: "Kilocalorie", symbol: "kcal", conversionToBase: 4184 },
        { name: "Watt Hour", symbol: "Wh", conversionToBase: 3600 },
        { name: "Kilowatt Hour", symbol: "kWh", conversionToBase: 3600000 },
        { name: "Megawatt Hour", symbol: "MWh", conversionToBase: 3600000000 },
        { name: "BTU", symbol: "BTU", conversionToBase: 1055.06 },
        { name: "Thousand BTU", symbol: "MBTU", conversionToBase: 1055060 },
        { name: "Million BTU", symbol: "MMBTU", conversionToBase: 1055060000 },
        { name: "Therm", symbol: "therm", conversionToBase: 105506000 },
        { name: "Horsepower Hour", symbol: "hp·h", conversionToBase: 2684520 },
      ],
      usageContext: "Reaction energies, heat duties, plant energy requirements"
    },
    {
      name: "power",
      display: "Power",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-orange-500 to-orange-600",
      units: [
        { name: "Watt", symbol: "W", conversionToBase: 1 },
        { name: "Kilowatt", symbol: "kW", conversionToBase: 1000 },
        { name: "Megawatt", symbol: "MW", conversionToBase: 1000000 },
        { name: "Gigawatt", symbol: "GW", conversionToBase: 1000000000 },
        { name: "Horsepower (mechanical)", symbol: "hp", conversionToBase: 745.7 },
        { name: "Horsepower (metric)", symbol: "hp (metric)", conversionToBase: 735.5 },
        { name: "BTU/hour", symbol: "BTU/h", conversionToBase: 0.29307107 },
        { name: "Calorie/second", symbol: "cal/s", conversionToBase: 4.184 },
        { name: "Kilocalorie/hour", symbol: "kcal/h", conversionToBase: 1.163 },
        { name: "Ton of refrigeration", symbol: "TR", conversionToBase: 3516.85 },
      ],
      usageContext: "Pump power, compressor requirements, heating/cooling duties"
    },
    {
      name: "time",
      display: "Time",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-gray-500 to-gray-600",
      units: [
        { name: "Second", symbol: "s", conversionToBase: 1 },
        { name: "Minute", symbol: "min", conversionToBase: 60 },
        { name: "Hour", symbol: "h", conversionToBase: 3600 },
        { name: "Day", symbol: "d", conversionToBase: 86400 },
        { name: "Week", symbol: "wk", conversionToBase: 604800 },
        { name: "Month (avg)", symbol: "mo", conversionToBase: 2629800 },
        { name: "Year (avg)", symbol: "yr", conversionToBase: 31557600 },
        { name: "Millisecond", symbol: "ms", conversionToBase: 0.001 },
        { name: "Microsecond", symbol: "μs", conversionToBase: 0.000001 },
        { name: "Nanosecond", symbol: "ns", conversionToBase: 0.000000001 },
      ],
      usageContext: "Residence times, reaction times, process cycles"
    },
    {
      name: "density",
      display: "Density",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-pink-500 to-pink-600",
      units: [
        { name: "Kilogram/Cubic Meter", symbol: "kg/m³", conversionToBase: 1 },
        { name: "Gram/Cubic Centimeter", symbol: "g/cm³", conversionToBase: 1000 },
        { name: "Kilogram/Liter", symbol: "kg/L", conversionToBase: 1000 },
        { name: "Gram/Milliliter", symbol: "g/mL", conversionToBase: 1000 },
        { name: "Pound/Cubic Foot", symbol: "lb/ft³", conversionToBase: 16.0185 },
        { name: "Pound/Gallon (US)", symbol: "lb/gal", conversionToBase: 119.826 },
        { name: "Pound/Gallon (UK)", symbol: "lb/gal (UK)", conversionToBase: 99.776 },
        { name: "Slug/Cubic Foot", symbol: "slug/ft³", conversionToBase: 515.379 },
        { name: "Ounce/Cubic Inch", symbol: "oz/in³", conversionToBase: 1729.994 },
        { name: "Ton/Cubic Meter", symbol: "t/m³", conversionToBase: 1000 },
      ],
      usageContext: "Fluid properties, material properties, solution densities"
    },
    {
      name: "viscosity",
      display: "Viscosity",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-indigo-500 to-indigo-600",
      units: [
        { name: "Pascal Second", symbol: "Pa·s", conversionToBase: 1 },
        { name: "Centipoise", symbol: "cP", conversionToBase: 0.001 },
        { name: "Poise", symbol: "P", conversionToBase: 0.1 },
        { name: "Pound Force-Second/Square Foot", symbol: "lbf·s/ft²", conversionToBase: 47.8803 },
        { name: "Pound Force-Second/Square Inch", symbol: "lbf·s/in²", conversionToBase: 6894.76 },
        { name: "Pound Mass/Foot-Second", symbol: "lb/(ft·s)", conversionToBase: 1.48816 },
        { name: "Pound Mass/Foot-Hour", symbol: "lb/(ft·h)", conversionToBase: 0.000413378 },
        { name: "Stokes", symbol: "St", conversionToBase: 0.0001 },
        { name: "Centistokes", symbol: "cSt", conversionToBase: 0.000001 },
      ],
      usageContext: "Fluid flow characteristics, pumping requirements, mixing parameters"
    },
    {
      name: "thermal_conductivity",
      display: "Thermal Conductivity",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-red-500 to-red-600",
      units: [
        { name: "Watt/Meter-Kelvin", symbol: "W/(m·K)", conversionToBase: 1 },
        { name: "Kilowatt/Meter-Kelvin", symbol: "kW/(m·K)", conversionToBase: 1000 },
        { name: "BTU/Hour-Foot-Fahrenheit", symbol: "BTU/(h·ft·°F)", conversionToBase: 1.73073 },
        { name: "BTU/Second-Foot-Fahrenheit", symbol: "BTU/(s·ft·°F)", conversionToBase: 6230.64 },
        { name: "Calorie/Second-Centimeter-Celsius", symbol: "cal/(s·cm·°C)", conversionToBase: 418.4 },
        { name: "Kilocalorie/Hour-Meter-Celsius", symbol: "kcal/(h·m·°C)", conversionToBase: 1.163 },
      ],
      usageContext: "Heat exchanger design, insulation specifications, material selection"
    },
    {
      name: "heat_transfer_coefficient",
      display: "Heat Transfer Coefficient",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-yellow-600 to-amber-600",
      units: [
        { name: "Watt/Square Meter-Kelvin", symbol: "W/(m²·K)", conversionToBase: 1 },
        { name: "Kilowatt/Square Meter-Kelvin", symbol: "kW/(m²·K)", conversionToBase: 1000 },
        { name: "BTU/Hour-Square Foot-Fahrenheit", symbol: "BTU/(h·ft²·°F)", conversionToBase: 5.67826 },
        { name: "Calorie/Second-Square Centimeter-Celsius", symbol: "cal/(s·cm²·°C)", conversionToBase: 41840 },
        { name: "Kilocalorie/Hour-Square Meter-Celsius", symbol: "kcal/(h·m²·°C)", conversionToBase: 1.163 },
      ],
      usageContext: "Heat exchanger design, condensation/evaporation processes"
    },
    {
      name: "specific_heat",
      display: "Specific Heat",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-cyan-500 to-cyan-600",
      units: [
        { name: "Joule/Kilogram-Kelvin", symbol: "J/(kg·K)", conversionToBase: 1 },
        { name: "Kilojoule/Kilogram-Kelvin", symbol: "kJ/(kg·K)", conversionToBase: 1000 },
        { name: "BTU/Pound-Fahrenheit", symbol: "BTU/(lb·°F)", conversionToBase: 4186.8 },
        { name: "Calorie/Gram-Celsius", symbol: "cal/(g·°C)", conversionToBase: 4184 },
        { name: "Kilocalorie/Kilogram-Celsius", symbol: "kcal/(kg·°C)", conversionToBase: 4184 },
      ],
      usageContext: "Heat exchanger calculations, energy balances, heating/cooling requirements"
    },
    {
      name: "concentration",
      display: "Concentration",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-emerald-500 to-emerald-600",
      units: [
        { name: "Mole/Liter", symbol: "mol/L", conversionToBase: 1 },
        { name: "Millimole/Liter", symbol: "mmol/L", conversionToBase: 0.001 },
        { name: "Micromole/Liter", symbol: "μmol/L", conversionToBase: 0.000001 },
        { name: "Mole/Cubic Meter", symbol: "mol/m³", conversionToBase: 0.001 },
        { name: "Mole/Cubic Centimeter", symbol: "mol/cm³", conversionToBase: 1000 },
        { name: "Parts Per Million", symbol: "ppm", conversionToBase: 0.001 },
        { name: "Parts Per Billion", symbol: "ppb", conversionToBase: 0.000001 },
        { name: "Parts Per Trillion", symbol: "ppt", conversionToBase: 0.000000001 },
        { name: "Weight Percent", symbol: "wt%", conversionToBase: 0.1 },
        { name: "Volume Percent", symbol: "vol%", conversionToBase: 0.1 },
        { name: "Gram/Liter", symbol: "g/L", conversionToBase: 0.001 },
        { name: "Milligram/Liter", symbol: "mg/L", conversionToBase: 0.000001 },
      ],
      usageContext: "Solution preparation, reaction stoichiometry, environmental compliance"
    },
    {
      name: "reaction_rate",
      display: "Reaction Rate",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-rose-500 to-rose-600",
      units: [
        { name: "Mole/Liter-Second", symbol: "mol/(L·s)", conversionToBase: 1 },
        { name: "Mole/Liter-Minute", symbol: "mol/(L·min)", conversionToBase: 1/60 },
        { name: "Mole/Liter-Hour", symbol: "mol/(L·h)", conversionToBase: 1/3600 },
        { name: "Mole/Cubic Meter-Second", symbol: "mol/(m³·s)", conversionToBase: 0.001 },
        { name: "Millimole/Liter-Second", symbol: "mmol/(L·s)", conversionToBase: 0.001 },
        { name: "Micromole/Liter-Second", symbol: "μmol/(L·s)", conversionToBase: 0.000001 },
      ],
      usageContext: "Reactor design, kinetic studies, catalyst evaluation"
    },
    {
      name: "mass_transfer_coefficient",
      display: "Mass Transfer Coefficient",
      icon: <ArrowDown className="h-4 w-4" />,
      color: "from-violet-500 to-violet-600",
      units: [
        { name: "Meter/Second", symbol: "m/s", conversionToBase: 1 },
        { name: "Centimeter/Second", symbol: "cm/s", conversionToBase: 0.01 },
        { name: "Foot/Second", symbol: "ft/s", conversionToBase: 0.3048 },
        { name: "Pound Mole/Hour-Square Foot-Atmosphere", symbol: "lb·mol/(h·ft²·atm)", conversionToBase: 0.00001356 },
        { name: "Gram Mole/Hour-Square Centimeter-Atmosphere", symbol: "g·mol/(h·cm²·atm)", conversionToBase: 0.0000002722 },
      ],
      usageContext: "Absorption/stripping columns, extraction processes, membrane separations"
    },
    {
      name: "molar_flow",
      display: "Molar Flow",
      icon: <ArrowRight className="h-4 w-4" />,
      color: "from-blue-400 to-indigo-500",
      units: [
        { name: "Mole/Second", symbol: "mol/s", conversionToBase: 1 },
        { name: "Mole/Minute", symbol: "mol/min", conversionToBase: 1/60 },
        { name: "Mole/Hour", symbol: "mol/h", conversionToBase: 1/3600 },
        { name: "Kilogram-mole/Hour", symbol: "kmol/h", conversionToBase: 1000/3600 },
        { name: "Pound-mole/Hour", symbol: "lbmol/h", conversionToBase: 453.59237/3600 },
      ],
      usageContext: "Process flowsheets, material balances, reactor feed rates"
    },
    {
      name: "surface_tension",
      display: "Surface Tension",
      icon: <ArrowUp className="h-4 w-4" />,
      color: "from-green-400 to-emerald-500",
      units: [
        { name: "Newton/Meter", symbol: "N/m", conversionToBase: 1 },
        { name: "Millinewton/Meter", symbol: "mN/m", conversionToBase: 0.001 },
        { name: "Dyne/Centimeter", symbol: "dyn/cm", conversionToBase: 0.001 },
        { name: "Erg/Square Centimeter", symbol: "erg/cm²", conversionToBase: 0.001 },
        { name: "Pound Force/Foot", symbol: "lbf/ft", conversionToBase: 14.5939 },
      ],
      usageContext: "Interfacial phenomena, bubble/droplet formation, wetting processes"
    },
  ];

  useEffect(() => {
    // Set default units when category changes
    const currentCategory = unitCategories.find(cat => cat.name === category);
    if (currentCategory && currentCategory.units.length > 0) {
      setFromUnit(currentCategory.units[0].symbol);
      setToUnit(currentCategory.units.length > 1 ? currentCategory.units[1].symbol : currentCategory.units[0].symbol);
    }
  }, [category]);

  useEffect(() => {
    // Save favorites to local storage
    localStorage.setItem("favCategories", JSON.stringify(favoriteCategories));
  }, [favoriteCategories]);

  const handleConversion = () => {
    if (!value || isNaN(Number(value))) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    const currentCategory = unitCategories.find(cat => cat.name === category);
    if (!currentCategory) return;

    const fromUnitObj = currentCategory.units.find(unit => unit.symbol === fromUnit);
    const toUnitObj = currentCategory.units.find(unit => unit.symbol === toUnit);

    if (!fromUnitObj || !toUnitObj) return;

    let numValue = parseFloat(value);
    let resultValue;

    // Special handling for temperature
    if (category === "temperature") {
      // Convert to Celsius as base unit
      let baseValue;
      if (fromUnit === "°F") {
        baseValue = (numValue + fromUnitObj.offset) * fromUnitObj.conversionToBase;
      } else if (fromUnit === "K") {
        baseValue = numValue + fromUnitObj.offset;
      } else if (fromUnit === "°R") {
        baseValue = (numValue + fromUnitObj.offset) * fromUnitObj.conversionToBase;
      } else {
        baseValue = numValue;
      }

      // Convert from Celsius to target unit
      if (toUnit === "°F") {
        resultValue = baseValue / toUnitObj.conversionToBase - toUnitObj.offset;
      } else if (toUnit === "K") {
        resultValue = baseValue - toUnitObj.offset;
      } else if (toUnit === "°R") {
        resultValue = baseValue / toUnitObj.conversionToBase - toUnitObj.offset;
      } else {
        resultValue = baseValue;
      }
    } else {
      // Standard conversion
      const baseValue = numValue * fromUnitObj.conversionToBase;
      resultValue = baseValue / toUnitObj.conversionToBase;
    }

    // Format result to appropriate precision
    let formattedResult;
    if (Math.abs(resultValue) < 0.001 && resultValue !== 0) {
      formattedResult = resultValue.toExponential(6);
    } else if (Math.abs(resultValue) >= 1000000) {
      formattedResult = resultValue.toExponential(6);
    } else {
      formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
    }
    
    setResult(formattedResult);

    toast({
      title: "Conversion Complete",
      description: `${value} ${fromUnitObj.name} = ${formattedResult} ${toUnitObj.name}`,
    });
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setValue(result);
    setResult(value);
  };

  const toggleFavorite = (catName: string) => {
    if (favoriteCategories.includes(catName)) {
      setFavoriteCategories(favoriteCategories.filter(c => c !== catName));
    } else {
      setFavoriteCategories([...favoriteCategories, catName]);
    }
  };

  // Get the current category object
  const currentCategoryObj = unitCategories.find(cat => cat.name === category) || unitCategories[0];

  // Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <GlassPanel className="p-6 overflow-hidden">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div 
          variants={itemVariants} 
          className="flex items-center mb-6 justify-between"
        >
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-3 text-flow-blue" />
            <h2 className="text-xl font-medium">Chemical Engineering Unit Converter</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant={favoritesMode ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                favoritesMode ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : ""
              }`}
              onClick={() => setFavoritesMode(!favoritesMode)}
            >
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="categories" className="flex-1">Categories</TabsTrigger>
              <TabsTrigger value="context" className="flex-1">Application Context</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
                {unitCategories
                  .filter(cat => !favoritesMode || favoriteCategories.includes(cat.name))
                  .map((cat) => (
                    <motion.div 
                      key={cat.name}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div 
                        className={`
                          flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer relative
                          ${category === cat.name 
                            ? `bg-gradient-to-r ${cat.color} text-white shadow-md` 
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}
                        `}
                        onClick={() => setCategory(cat.name)}
                      >
                        <div className="absolute top-1 right-1">
                          <button 
                            className="text-xs p-1 rounded-full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(cat.name);
                            }}
                          >
                            <Star 
                              className={`h-3 w-3 ${
                                favoriteCategories.includes(cat.name) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                              }`} 
                            />
                          </button>
                        </div>
                        {cat.icon}
                        <span className="mt-1 text-xs text-center">{cat.display}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="context">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mb-4">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">{currentCategoryObj.display} in Chemical Engineering:</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">{currentCategoryObj.usageContext}</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4"
        >
          <h3 className={`font-medium mb-4 text-lg bg-gradient-to-r ${currentCategoryObj.color} bg-clip-text text-transparent`}>
            {currentCategoryObj.display} Converter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="value" className="mb-1 block">Input Value</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 border-blue-200 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="fromUnit" className="mb-1 block">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="w-full mt-1 border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategoryObj.units.map((unit) => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSwapUnits}
                className="self-center hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
              </Button>
            </div>

            <div>
              <Label htmlFor="toUnit" className="mb-1 block">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="w-full mt-1 border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategoryObj.units.map((unit) => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
            <div className="md:col-span-5">
              <Label htmlFor="result" className="mb-1 block">Result</Label>
              <Input
                id="result"
                value={result}
                readOnly
                className="mt-1 bg-white/60 dark:bg-gray-800/60 font-mono"
              />
            </div>
            <div>
              <Button
                onClick={handleConversion}
                className="w-full h-10 mt-7 bg-gradient-to-r from-flow-blue to-flow-teal text-white transition-transform hover:scale-105"
              >
                Convert
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Reference Table */}
        <motion.div variants={itemVariants} className="overflow-x-auto">
          <h3 className="text-lg font-medium mb-2">Common {currentCategoryObj.display} Conversions</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Multiply By</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentCategoryObj.units.slice(0, 5).map((fromUnitItem, idx) => (
                  currentCategoryObj.units.slice(0, 5).filter(u => u.symbol !== fromUnitItem.symbol).map((toUnitItem, innerIdx) => {
                    // Calculate conversion factor
                    let conversionFactor;
                    if (category === "temperature") {
                      conversionFactor = "See formula";
                    } else {
                      conversionFactor = (fromUnitItem.conversionToBase / toUnitItem.conversionToBase).toFixed(6);
                      // Format scientific notation for very small or very large numbers
                      if (parseFloat(conversionFactor) < 0.001 || parseFloat(conversionFactor) > 10000) {
                        conversionFactor = parseFloat(conversionFactor).toExponential(3);
                      }
                    }
                    
                    return (
                      <tr key={`${idx}-${innerIdx}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {fromUnitItem.symbol}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {toUnitItem.symbol}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {conversionFactor}
                        </td>
                      </tr>
                    );
                  })
                )).flat()}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </GlassPanel>
  );
};

export default UnitConverter;

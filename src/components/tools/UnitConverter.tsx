
import React, { useState, useEffect } from "react";
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
import { Calculator } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import GlassPanel from "@/components/ui/GlassPanel";

type UnitCategory = {
  name: string;
  units: {
    name: string;
    symbol: string;
    conversionToBase: number;
    offset?: number;
  }[];
};

const UnitConverter: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [category, setCategory] = useState<string>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");

  const unitCategories: UnitCategory[] = [
    {
      name: "length",
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
    },
    {
      name: "mass",
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
      ],
    },
    {
      name: "temperature",
      units: [
        { name: "Celsius", symbol: "°C", conversionToBase: 1, offset: 0 },
        { name: "Fahrenheit", symbol: "°F", conversionToBase: 5/9, offset: -32 },
        { name: "Kelvin", symbol: "K", conversionToBase: 1, offset: -273.15 },
        { name: "Rankine", symbol: "°R", conversionToBase: 5/9, offset: -491.67 },
      ],
    },
    {
      name: "pressure",
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
    },
    {
      name: "volume",
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
    },
    {
      name: "flow",
      units: [
        { name: "Cubic Meter/Second", symbol: "m³/s", conversionToBase: 1 },
        { name: "Cubic Meter/Hour", symbol: "m³/h", conversionToBase: 1/3600 },
        { name: "Liter/Second", symbol: "L/s", conversionToBase: 0.001 },
        { name: "Liter/Minute", symbol: "L/min", conversionToBase: 0.001/60 },
        { name: "Liter/Hour", symbol: "L/h", conversionToBase: 0.001/3600 },
        { name: "Cubic Feet/Second", symbol: "ft³/s", conversionToBase: 0.0283168 },
        { name: "Cubic Feet/Minute", symbol: "ft³/min", conversionToBase: 0.0283168/60 },
        { name: "Cubic Feet/Hour", symbol: "ft³/h", conversionToBase: 0.0283168/3600 },
        { name: "Gallon/Minute", symbol: "gpm", conversionToBase: 0.0000630902 },
        { name: "Gallon/Hour", symbol: "gph", conversionToBase: 0.0000630902/60 },
        { name: "Barrel/Day", symbol: "bbl/day", conversionToBase: 0.158987/(24*3600) },
        { name: "Million Gallons/Day", symbol: "MGD", conversionToBase: 0.0438126 },
      ],
    },
    {
      name: "energy",
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
        { name: "Ton of TNT", symbol: "ton TNT", conversionToBase: 4.184e9 },
        { name: "Electron Volt", symbol: "eV", conversionToBase: 1.602176634e-19 },
      ],
    },
    {
      name: "power",
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
        { name: "Joule/second", symbol: "J/s", conversionToBase: 1 },
        { name: "Ton of refrigeration", symbol: "TR", conversionToBase: 3516.85 },
      ],
    },
    {
      name: "time",
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
    },
    {
      name: "density",
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
    },
    {
      name: "viscosity",
      units: [
        { name: "Pascal Second", symbol: "Pa·s", conversionToBase: 1 },
        { name: "Centipoise", symbol: "cP", conversionToBase: 0.001 },
        { name: "Poise", symbol: "P", conversionToBase: 0.1 },
        { name: "Pound Force-Second/Square Foot", symbol: "lbf·s/ft²", conversionToBase: 47.8803 },
        { name: "Pound Force-Second/Square Inch", symbol: "lbf·s/in²", conversionToBase: 6894.76 },
        { name: "Pound Mass/Foot-Second", symbol: "lb/(ft·s)", conversionToBase: 1.48816 },
        { name: "Pound Mass/Foot-Hour", symbol: "lb/(ft·h)", conversionToBase: 0.000413378 },
        { name: "Kilogram/Meter-Second", symbol: "kg/(m·s)", conversionToBase: 1 },
        { name: "Stokes", symbol: "St", conversionToBase: 0.0001 },
        { name: "Centistokes", symbol: "cSt", conversionToBase: 0.000001 },
      ],
    },
    {
      name: "thermal_conductivity",
      units: [
        { name: "Watt/Meter-Kelvin", symbol: "W/(m·K)", conversionToBase: 1 },
        { name: "Kilowatt/Meter-Kelvin", symbol: "kW/(m·K)", conversionToBase: 1000 },
        { name: "BTU/Hour-Foot-Fahrenheit", symbol: "BTU/(h·ft·°F)", conversionToBase: 1.73073 },
        { name: "BTU/Second-Foot-Fahrenheit", symbol: "BTU/(s·ft·°F)", conversionToBase: 6230.64 },
        { name: "Calorie/Second-Centimeter-Celsius", symbol: "cal/(s·cm·°C)", conversionToBase: 418.4 },
        { name: "Kilocalorie/Hour-Meter-Celsius", symbol: "kcal/(h·m·°C)", conversionToBase: 1.163 },
      ],
    },
    {
      name: "heat_transfer_coefficient",
      units: [
        { name: "Watt/Square Meter-Kelvin", symbol: "W/(m²·K)", conversionToBase: 1 },
        { name: "Kilowatt/Square Meter-Kelvin", symbol: "kW/(m²·K)", conversionToBase: 1000 },
        { name: "BTU/Hour-Square Foot-Fahrenheit", symbol: "BTU/(h·ft²·°F)", conversionToBase: 5.67826 },
        { name: "Calorie/Second-Square Centimeter-Celsius", symbol: "cal/(s·cm²·°C)", conversionToBase: 41840 },
        { name: "Kilocalorie/Hour-Square Meter-Celsius", symbol: "kcal/(h·m²·°C)", conversionToBase: 1.163 },
      ],
    },
    {
      name: "specific_heat",
      units: [
        { name: "Joule/Kilogram-Kelvin", symbol: "J/(kg·K)", conversionToBase: 1 },
        { name: "Kilojoule/Kilogram-Kelvin", symbol: "kJ/(kg·K)", conversionToBase: 1000 },
        { name: "BTU/Pound-Fahrenheit", symbol: "BTU/(lb·°F)", conversionToBase: 4186.8 },
        { name: "Calorie/Gram-Celsius", symbol: "cal/(g·°C)", conversionToBase: 4184 },
        { name: "Kilocalorie/Kilogram-Celsius", symbol: "kcal/(kg·°C)", conversionToBase: 4184 },
      ],
    },
    {
      name: "concentration",
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
        { name: "Pound/Gallon", symbol: "lb/gal", conversionToBase: 0.119826 },
        { name: "Gram/Liter", symbol: "g/L", conversionToBase: 0.001 },
        { name: "Milligram/Liter", symbol: "mg/L", conversionToBase: 0.000001 },
        { name: "Microgram/Liter", symbol: "μg/L", conversionToBase: 0.000000001 },
      ],
    },
    {
      name: "surface_tension",
      units: [
        { name: "Newton/Meter", symbol: "N/m", conversionToBase: 1 },
        { name: "Millinewton/Meter", symbol: "mN/m", conversionToBase: 0.001 },
        { name: "Dyne/Centimeter", symbol: "dyn/cm", conversionToBase: 0.001 },
        { name: "Erg/Square Centimeter", symbol: "erg/cm²", conversionToBase: 0.001 },
        { name: "Pound Force/Foot", symbol: "lbf/ft", conversionToBase: 14.5939 },
      ],
    },
    {
      name: "reaction_rate",
      units: [
        { name: "Mole/Liter-Second", symbol: "mol/(L·s)", conversionToBase: 1 },
        { name: "Mole/Liter-Minute", symbol: "mol/(L·min)", conversionToBase: 1/60 },
        { name: "Mole/Liter-Hour", symbol: "mol/(L·h)", conversionToBase: 1/3600 },
        { name: "Mole/Cubic Meter-Second", symbol: "mol/(m³·s)", conversionToBase: 0.001 },
        { name: "Millimole/Liter-Second", symbol: "mmol/(L·s)", conversionToBase: 0.001 },
        { name: "Micromole/Liter-Second", symbol: "μmol/(L·s)", conversionToBase: 0.000001 },
      ],
    },
    {
      name: "mass_transfer_coefficient",
      units: [
        { name: "Meter/Second", symbol: "m/s", conversionToBase: 1 },
        { name: "Centimeter/Second", symbol: "cm/s", conversionToBase: 0.01 },
        { name: "Foot/Second", symbol: "ft/s", conversionToBase: 0.3048 },
        { name: "Pound Mole/Hour-Square Foot-Atmosphere", symbol: "lb·mol/(h·ft²·atm)", conversionToBase: 0.00001356 },
        { name: "Gram Mole/Hour-Square Centimeter-Atmosphere", symbol: "g·mol/(h·cm²·atm)", conversionToBase: 0.0000002722 },
      ],
    },
    {
      name: "diffusivity",
      units: [
        { name: "Square Meter/Second", symbol: "m²/s", conversionToBase: 1 },
        { name: "Square Centimeter/Second", symbol: "cm²/s", conversionToBase: 0.0001 },
        { name: "Square Foot/Second", symbol: "ft²/s", conversionToBase: 0.092903 },
        { name: "Square Inch/Second", symbol: "in²/s", conversionToBase: 0.00064516 },
        { name: "Square Meter/Hour", symbol: "m²/h", conversionToBase: 1/3600 },
      ],
    },
    {
      name: "permeability",
      units: [
        { name: "Darcy", symbol: "D", conversionToBase: 9.869233e-13 },
        { name: "Millidarcy", symbol: "mD", conversionToBase: 9.869233e-16 },
        { name: "Square Meter", symbol: "m²", conversionToBase: 1 },
        { name: "Square Centimeter", symbol: "cm²", conversionToBase: 0.0001 },
        { name: "Square Foot", symbol: "ft²", conversionToBase: 0.092903 },
      ],
    },
    {
      name: "sugar_concentration",
      units: [
        { name: "Degrees Brix", symbol: "°Bx", conversionToBase: 1 },
        { name: "Degrees Plato", symbol: "°P", conversionToBase: 1.0004 },
        { name: "Degrees Baumé", symbol: "°Bé", conversionToBase: 0.5555 },
        { name: "Weight Percent Sucrose", symbol: "wt% sucrose", conversionToBase: 1 },
        { name: "Specific Gravity", symbol: "SG", conversionToBase: 0.0025 },
      ],
    },
    {
      name: "food_energy",
      units: [
        { name: "Calorie (Nutritional)", symbol: "Cal", conversionToBase: 4184 },
        { name: "Kilojoule", symbol: "kJ", conversionToBase: 1000 },
        { name: "Joule", symbol: "J", conversionToBase: 1 },
        { name: "Kilocalorie", symbol: "kcal", conversionToBase: 4184 },
      ],
    },
    {
      name: "radiation",
      units: [
        { name: "Becquerel", symbol: "Bq", conversionToBase: 1 },
        { name: "Curie", symbol: "Ci", conversionToBase: 3.7e10 },
        { name: "Rutherford", symbol: "rd", conversionToBase: 1e6 },
        { name: "Gray", symbol: "Gy", conversionToBase: 1 },
        { name: "Rad", symbol: "rad", conversionToBase: 0.01 },
        { name: "Sievert", symbol: "Sv", conversionToBase: 1 },
        { name: "Rem", symbol: "rem", conversionToBase: 0.01 },
      ],
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

    setResult(resultValue.toFixed(6));

    toast({
      title: "Conversion Complete",
      description: `${value} ${fromUnitObj.name} = ${resultValue.toFixed(6)} ${toUnitObj.name}`,
    });
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setValue(result);
    setResult(value);
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 mr-3 text-flow-blue" />
        <h2 className="text-xl font-medium">Universal Unit Converter</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a unit category" />
            </SelectTrigger>
            <SelectContent>
              {unitCategories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1).replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fromUnit">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitCategories
                  .find(cat => cat.name === category)
                  ?.units.map((unit) => (
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
              className="self-center"
            >
              ⇄
            </Button>
          </div>

          <div>
            <Label htmlFor="toUnit">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitCategories
                  .find(cat => cat.name === category)
                  ?.units.map((unit) => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-5">
            <Label htmlFor="result">Result</Label>
            <Input
              id="result"
              value={result}
              readOnly
              className="mt-1"
            />
          </div>
          <div>
            <Button
              onClick={handleConversion}
              className="w-full h-10 mt-7"
            >
              Convert
            </Button>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};

export default UnitConverter;

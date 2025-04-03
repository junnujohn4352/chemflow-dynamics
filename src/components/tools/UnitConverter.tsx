
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
        { name: "Inch", symbol: "in", conversionToBase: 0.0254 },
        { name: "Foot", symbol: "ft", conversionToBase: 0.3048 },
        { name: "Yard", symbol: "yd", conversionToBase: 0.9144 },
        { name: "Mile", symbol: "mi", conversionToBase: 1609.344 },
      ],
    },
    {
      name: "mass",
      units: [
        { name: "Kilogram", symbol: "kg", conversionToBase: 1 },
        { name: "Gram", symbol: "g", conversionToBase: 0.001 },
        { name: "Milligram", symbol: "mg", conversionToBase: 0.000001 },
        { name: "Pound", symbol: "lb", conversionToBase: 0.45359237 },
        { name: "Ounce", symbol: "oz", conversionToBase: 0.028349523125 },
        { name: "Ton (metric)", symbol: "t", conversionToBase: 1000 },
        { name: "Ton (short)", symbol: "ton", conversionToBase: 907.18474 },
      ],
    },
    {
      name: "temperature",
      units: [
        { name: "Celsius", symbol: "°C", conversionToBase: 1, offset: 0 },
        { name: "Fahrenheit", symbol: "°F", conversionToBase: 5/9, offset: -32 },
        { name: "Kelvin", symbol: "K", conversionToBase: 1, offset: -273.15 },
      ],
    },
    {
      name: "pressure",
      units: [
        { name: "Pascal", symbol: "Pa", conversionToBase: 1 },
        { name: "Kilopascal", symbol: "kPa", conversionToBase: 1000 },
        { name: "Bar", symbol: "bar", conversionToBase: 100000 },
        { name: "PSI", symbol: "psi", conversionToBase: 6894.76 },
        { name: "Atmosphere", symbol: "atm", conversionToBase: 101325 },
        { name: "Torr", symbol: "Torr", conversionToBase: 133.322 },
      ],
    },
    {
      name: "volume",
      units: [
        { name: "Cubic Meter", symbol: "m³", conversionToBase: 1 },
        { name: "Liter", symbol: "L", conversionToBase: 0.001 },
        { name: "Milliliter", symbol: "mL", conversionToBase: 0.000001 },
        { name: "Gallon (US)", symbol: "gal", conversionToBase: 0.00378541 },
        { name: "Fluid Ounce (US)", symbol: "fl oz", conversionToBase: 0.0000295735 },
        { name: "Cubic Foot", symbol: "ft³", conversionToBase: 0.0283168 },
      ],
    },
    {
      name: "flow",
      units: [
        { name: "Cubic Meter/Second", symbol: "m³/s", conversionToBase: 1 },
        { name: "Liter/Second", symbol: "L/s", conversionToBase: 0.001 },
        { name: "Cubic Feet/Second", symbol: "ft³/s", conversionToBase: 0.0283168 },
        { name: "Gallon/Minute", symbol: "gpm", conversionToBase: 0.0000630902 },
      ],
    },
    {
      name: "energy",
      units: [
        { name: "Joule", symbol: "J", conversionToBase: 1 },
        { name: "Kilojoule", symbol: "kJ", conversionToBase: 1000 },
        { name: "Calorie", symbol: "cal", conversionToBase: 4.184 },
        { name: "Kilocalorie", symbol: "kcal", conversionToBase: 4184 },
        { name: "Watt Hour", symbol: "Wh", conversionToBase: 3600 },
        { name: "Kilowatt Hour", symbol: "kWh", conversionToBase: 3600000 },
        { name: "BTU", symbol: "BTU", conversionToBase: 1055.06 },
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
      } else {
        baseValue = numValue;
      }

      // Convert from Celsius to target unit
      if (toUnit === "°F") {
        resultValue = baseValue / toUnitObj.conversionToBase - toUnitObj.offset;
      } else if (toUnit === "K") {
        resultValue = baseValue - toUnitObj.offset;
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
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
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

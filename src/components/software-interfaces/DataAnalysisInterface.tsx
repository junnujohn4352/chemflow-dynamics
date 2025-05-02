
import React, { useState } from 'react';
import { Software } from '@/types/software';
import BaseSoftwareInterface from './BaseSoftwareInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DataAnalysisInterfaceProps {
  software: Software;
}

const DataAnalysisInterface: React.FC<DataAnalysisInterfaceProps> = ({ software }) => {
  const [dataFormat, setDataFormat] = useState<string>("csv");
  const [analysisType, setAnalysisType] = useState<string>("regression");
  const [dataInput, setDataInput] = useState<string>("10.2, 15.6, 20.1, 25.3, 30.8\n0.5, 0.8, 1.2, 1.7, 2.1");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    setTimeout(() => {
      // Parse the input data (simple CSV parsing)
      let x: number[] = [];
      let y: number[] = [];
      
      try {
        const lines = dataInput.trim().split('\n');
        if (lines.length >= 2) {
          x = lines[0].split(',').map(val => parseFloat(val.trim()));
          y = lines[1].split(',').map(val => parseFloat(val.trim()));
        }
      } catch (error) {
        toast({
          title: "Data Format Error",
          description: "Could not parse the input data. Please check the format.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Simple statistics
      const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
      const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
      
      // Calculate min, max, standard deviation
      const minX = Math.min(...x);
      const maxX = Math.max(...x);
      const stdDevX = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0) / x.length);
      
      const minY = Math.min(...y);
      const maxY = Math.max(...y);
      const stdDevY = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0) / y.length);
      
      // Calculate simple regression (y = mx + b)
      const n = x.length;
      const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
      const sumX = x.reduce((sum, val) => sum + val, 0);
      const sumY = y.reduce((sum, val) => sum + val, 0);
      const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Calculate R-squared
      const yPred = x.map(val => slope * val + intercept);
      const ssRes = y.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0);
      const ssTot = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
      const rSquared = 1 - (ssRes / ssTot);
      
      const results = {
        dataPoints: n,
        meanX: meanX.toFixed(4),
        meanY: meanY.toFixed(4),
        minX: minX.toFixed(4),
        maxX: maxX.toFixed(4),
        minY: minY.toFixed(4),
        maxY: maxY.toFixed(4),
        stdDevX: stdDevX.toFixed(4),
        stdDevY: stdDevY.toFixed(4),
        slope: slope.toFixed(4),
        intercept: intercept.toFixed(4),
        equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
        rSquared: rSquared.toFixed(4),
        correlation: Math.sqrt(rSquared).toFixed(4)
      };
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis completed successfully.`,
      });
    }, 1500);
  };

  return (
    <BaseSoftwareInterface software={software}>
      <div className="mt-4 border-t pt-4">
        <h5 className="font-medium mb-2">Data Analysis Tool</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="dataFormat">Data Format</Label>
            <Select value={dataFormat} onValueChange={setDataFormat}>
              <SelectTrigger id="dataFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="tsv">TSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="analysisType">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger id="analysisType">
                <SelectValue placeholder="Select analysis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regression">Linear Regression</SelectItem>
                <SelectItem value="anova">ANOVA</SelectItem>
                <SelectItem value="pca">PCA</SelectItem>
                <SelectItem value="clustering">Clustering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dataInput">Input Data (X values in first row, Y values in second row)</Label>
            <Textarea 
              id="dataInput" 
              value={dataInput} 
              onChange={(e) => setDataInput(e.target.value)} 
              rows={5}
              placeholder="Enter data in CSV format (X values on first line, Y values on second line)"
              className="font-mono text-sm"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full mb-4"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Data"}
        </Button>
        
        {analysisResults && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="font-medium mb-2">Analysis Results</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-2 md:col-span-2">
                <span className="text-gray-600 text-sm">Regression Equation:</span>
                <div className="font-medium">{analysisResults.equation}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">R-Squared:</span>
                <div className="font-medium">{analysisResults.rSquared}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Correlation:</span>
                <div className="font-medium">{analysisResults.correlation}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Data Points:</span>
                <div className="font-medium">{analysisResults.dataPoints}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">X Mean:</span>
                <div className="font-medium">{analysisResults.meanX}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Y Mean:</span>
                <div className="font-medium">{analysisResults.meanY}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">X Range:</span>
                <div className="font-medium">{analysisResults.minX} to {analysisResults.maxX}</div>
              </div>
              <div className="border rounded p-2">
                <span className="text-gray-600 text-sm">Y Range:</span>
                <div className="font-medium">{analysisResults.minY} to {analysisResults.maxY}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseSoftwareInterface>
  );
};

export default DataAnalysisInterface;

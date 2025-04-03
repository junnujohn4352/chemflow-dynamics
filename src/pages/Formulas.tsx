
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const Formulas = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Navbar />
      
      <main className="flex-1 py-16 px-6 animate-fade-in">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
            
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
              Engineering Formulas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl relative z-10">
              Comprehensive collection of formulas for chemical engineering, petrochemical engineering, food technology and more.
            </p>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/50 p-6 rounded-lg shadow-lg border border-white/30 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto pb-3">
                <TabsList className="bg-blue-50/50 dark:bg-gray-800/50 p-1 flex space-x-1 flex-nowrap min-w-max">
                  <TabsTrigger value="general">General Chemical Engineering</TabsTrigger>
                  <TabsTrigger value="thermo">Thermodynamics</TabsTrigger>
                  <TabsTrigger value="fluid">Fluid Mechanics</TabsTrigger>
                  <TabsTrigger value="heat">Heat Transfer</TabsTrigger>
                  <TabsTrigger value="mass">Mass Transfer</TabsTrigger>
                  <TabsTrigger value="reaction">Reaction Engineering</TabsTrigger>
                  <TabsTrigger value="petro">Petrochemical Engineering</TabsTrigger>
                  <TabsTrigger value="food">Food Technology</TabsTrigger>
                  <TabsTrigger value="sugar">Sugar Technology</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="general" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">General Chemical Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Material Balance" 
                      formulas={[
                        { name: "Overall Mass Balance", formula: "∑m(in) = ∑m(out) + accumulation" },
                        { name: "Component Mass Balance", formula: "∑(m×y)in = ∑(m×y)out + accumulation" },
                        { name: "Conversion", formula: "X = (N₀ - N)/N₀" },
                        { name: "Yield", formula: "Y = moles of product formed / moles of reactant consumed" },
                        { name: "Selectivity", formula: "S = moles of desired product / moles of undesired product" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Dimensional Analysis" 
                      formulas={[
                        { name: "Reynolds Number", formula: "Re = ρvD/μ" },
                        { name: "Prandtl Number", formula: "Pr = Cpμ/k" },
                        { name: "Schmidt Number", formula: "Sc = μ/ρD" },
                        { name: "Sherwood Number", formula: "Sh = kₘL/D" },
                        { name: "Nusselt Number", formula: "Nu = hL/k" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Process Control" 
                      formulas={[
                        { name: "First Order Response", formula: "y(t) = y∞ + (y₀ - y∞)e^(-t/τ)" },
                        { name: "PID Controller", formula: "u(t) = Kp·e(t) + Ki∫e(t)dt + Kd·de(t)/dt" },
                        { name: "Transfer Function", formula: "G(s) = Y(s)/X(s)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="thermo" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Thermodynamics Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Laws of Thermodynamics" 
                      formulas={[
                        { name: "First Law", formula: "ΔU = Q - W" },
                        { name: "Second Law", formula: "ΔS ≥ 0 (isolated system)" },
                        { name: "Third Law", formula: "S → 0 as T → 0 K" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Equations of State" 
                      formulas={[
                        { name: "Ideal Gas Law", formula: "PV = nRT" },
                        { name: "Van der Waals", formula: "(P + a(n/V)²)(V - nb) = nRT" },
                        { name: "Redlich-Kwong", formula: "P = RT/(V-b) - a/[T^(1/2)V(V+b)]" },
                        { name: "Peng-Robinson", formula: "P = RT/(V-b) - a(T)/[V(V+b) + b(V-b)]" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Phase Equilibria" 
                      formulas={[
                        { name: "Raoult's Law", formula: "P₁ = x₁P₁°" },
                        { name: "Henry's Law", formula: "P₁ = H₁x₁" },
                        { name: "Gibbs Phase Rule", formula: "F = C - P + 2" },
                        { name: "Chemical Potential", formula: "μᵢ = (∂G/∂nᵢ)T,P,nⱼ" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Thermodynamic Properties" 
                      formulas={[
                        { name: "Enthalpy", formula: "H = U + PV" },
                        { name: "Gibbs Free Energy", formula: "G = H - TS" },
                        { name: "Helmholtz Free Energy", formula: "A = U - TS" },
                        { name: "Entropy Change", formula: "ΔS = ∫(dQ/T)" },
                        { name: "Heat Capacity Relationship", formula: "Cp - Cv = R (ideal gas)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="fluid" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Fluid Mechanics Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Fluid Statics" 
                      formulas={[
                        { name: "Hydrostatic Pressure", formula: "P = ρgh" },
                        { name: "Buoyancy Force", formula: "Fb = ρgV" },
                        { name: "Surface Tension", formula: "ΔP = 2σ/r (spherical), ΔP = σ/r (cylindrical)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Fluid Dynamics" 
                      formulas={[
                        { name: "Continuity Equation", formula: "ρ₁A₁v₁ = ρ₂A₂v₂" },
                        { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂" },
                        { name: "Momentum Equation", formula: "F = ṁ(v₂ - v₁)" },
                        { name: "Energy Equation", formula: "Ẇshaft + Q̇ = ṁ(h₂ - h₁ + v₂²/2 - v₁²/2 + g(z₂-z₁))" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pipe Flow" 
                      formulas={[
                        { name: "Darcy-Weisbach Equation", formula: "ΔP = fLρv²/2D" },
                        { name: "Hagen-Poiseuille Equation", formula: "ΔP = 8μLQ/πr⁴" },
                        { name: "Friction Factor (Laminar)", formula: "f = 64/Re" },
                        { name: "Moody Friction Factor", formula: "f = f(Re, ε/D)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pumps and Turbines" 
                      formulas={[
                        { name: "Pump Power", formula: "P = ρgQH/η" },
                        { name: "Specific Speed", formula: "Ns = N√Q/H^(3/4)" },
                        { name: "Pump Affinity Laws", formula: "Q₂/Q₁ = N₂/N₁, H₂/H₁ = (N₂/N₁)², P₂/P₁ = (N₂/N₁)³" },
                        { name: "NPSH Available", formula: "NPSHa = (P₁/ρg) + (v₁²/2g) - (Pv/ρg) - hL" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="heat" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Heat Transfer Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Conduction" 
                      formulas={[
                        { name: "Fourier's Law", formula: "q = -kA(dT/dx)" },
                        { name: "Thermal Resistance (Plane Wall)", formula: "R = L/kA" },
                        { name: "Thermal Resistance (Cylindrical)", formula: "R = ln(r₂/r₁)/2πkL" },
                        { name: "Heat Equation", formula: "∂T/∂t = α∇²T" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Convection" 
                      formulas={[
                        { name: "Newton's Law of Cooling", formula: "q = hA(Ts - T∞)" },
                        { name: "Nusselt Number Correlation", formula: "Nu = C·Reᵐ·Prⁿ" },
                        { name: "Heat Transfer Coefficient", formula: "h = Nu·k/L" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Radiation" 
                      formulas={[
                        { name: "Stefan-Boltzmann Law", formula: "q = εσA(T₁⁴ - T₂⁴)" },
                        { name: "View Factor", formula: "q₁₂ = A₁F₁₂σ(T₁⁴ - T₂⁴)" },
                        { name: "Radiation Exchange", formula: "q = (σ(T₁⁴ - T₂⁴))/(1/ε₁ + 1/ε₂ - 1)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Heat Exchangers" 
                      formulas={[
                        { name: "LMTD Method", formula: "Q = UA·LMTD" },
                        { name: "LMTD (Counter Flow)", formula: "LMTD = [(T₁ᵢ-T₂ₒ) - (T₁ₒ-T₂ᵢ)]/ln[(T₁ᵢ-T₂ₒ)/(T₁ₒ-T₂ᵢ)]" },
                        { name: "Effectiveness-NTU Method", formula: "ε = Q/Qmax" },
                        { name: "Overall Heat Transfer Coefficient", formula: "1/U = 1/h₁ + 1/h₂ + Rw" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="petro" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Petrochemical Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Petroleum Properties" 
                      formulas={[
                        { name: "API Gravity", formula: "°API = (141.5/SG) - 131.5" },
                        { name: "Watson Characterization Factor", formula: "Kw = (TB)^(1/3)/SG" },
                        { name: "Viscosity Blending", formula: "ln(μblend) = x₁ln(μ₁) + x₂ln(μ₂) + ..." },
                        { name: "Flash Point Correlation", formula: "Tf = 0.68·Tb - 456.8 (°F)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Refinery Operations" 
                      formulas={[
                        { name: "Distillation Tower Mass Balance", formula: "F = D + B" },
                        { name: "Reboiler Heat Duty", formula: "Qr = L·HV" },
                        { name: "Reflux Ratio", formula: "R = L/D" },
                        { name: "Minimum Reflux Ratio", formula: "Rmin = q/(q-1) · xF/(xD-xF)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Catalytic Processes" 
                      formulas={[
                        { name: "Catalyst Deactivation", formula: "r = r₀·e^(-kd·t)" },
                        { name: "Catalyst Effectiveness Factor", formula: "η = tanh(φ)/φ" },
                        { name: "Thiele Modulus", formula: "φ = L·√(k/Deff)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pipeline Transport" 
                      formulas={[
                        { name: "Pressure Drop", formula: "ΔP = fLρv²/2D" },
                        { name: "Pipeline Capacity", formula: "Q = (π/4)·D²·v" },
                        { name: "Hydraulic Power", formula: "P = Q·ΔP" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="food" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Food Technology Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Food Preservation" 
                      formulas={[
                        { name: "Decimal Reduction Time (D value)", formula: "D = t/log(N₀/N)" },
                        { name: "Thermal Death Time", formula: "F₀ = 10^((T-121.1)/z)·t" },
                        { name: "Water Activity", formula: "aw = p/p₀" },
                        { name: "Freezing Point Depression", formula: "ΔTf = Kf·m" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Food Process Engineering" 
                      formulas={[
                        { name: "Drying Rate", formula: "N = -(1/A)·(dW/dt)" },
                        { name: "Heat of Respiration", formula: "q = q₀·10^(T/10)" },
                        { name: "Extraction Yield", formula: "Y = (mextract/mfeed)×100%" },
                        { name: "Filtration Rate", formula: "dV/dt = ΔP·A/(μ·(Rc + Rm))" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Rheology" 
                      formulas={[
                        { name: "Newtonian Fluid", formula: "τ = μ·γ̇" },
                        { name: "Power Law Fluid", formula: "τ = K·γ̇ⁿ" },
                        { name: "Bingham Plastic", formula: "τ = τ₀ + μp·γ̇" },
                        { name: "Herschel-Bulkley Model", formula: "τ = τ₀ + K·γ̇ⁿ" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Food Quality" 
                      formulas={[
                        { name: "Arrhenius Equation", formula: "k = A·e^(-Ea/RT)" },
                        { name: "Q10 Temperature Coefficient", formula: "Q10 = (k₂/k₁)^(10/(T₂-T₁))" },
                        { name: "CIE Color Difference", formula: "ΔE = √(ΔL² + Δa² + Δb²)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="sugar" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Sugar Technology Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Sugar Processing" 
                      formulas={[
                        { name: "Brix", formula: "Brix = (msugar/msolution)×100%" },
                        { name: "Pol", formula: "Pol = apparent sucrose content by polarimetry" },
                        { name: "Purity", formula: "Purity = (Pol/Brix)×100%" },
                        { name: "Reducing Sugar Ratio", formula: "RS/AS = reducing sugars/apparent sucrose" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Crystallization" 
                      formulas={[
                        { name: "Supersaturation", formula: "S = c/c*" },
                        { name: "Crystal Growth Rate", formula: "G = kg(c-c*)ᵍ" },
                        { name: "Nucleation Rate", formula: "B = kbSᵇ" },
                        { name: "Recovery", formula: "Recovery = (msugar_out/msugar_in)×100%" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Evaporation" 
                      formulas={[
                        { name: "Evaporation Capacity", formula: "Capacity = mevaporated/t" },
                        { name: "Steam Economy", formula: "Economy = mevaporated/msteam" },
                        { name: "Boiling Point Elevation", formula: "BPE = 0.0018·Brix²" },
                        { name: "Mass Concentration", formula: "Brixout = Brixin·(min/mout)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Sugar Boiling" 
                      formulas={[
                        { name: "Massecuite", formula: "Yield = (100 - Purity_molasses)/(100 - Purity_massecuite)×100%" },
                        { name: "Crystal Content", formula: "CC = (Purity_massecuite - Purity_molasses)/(100 - Purity_molasses)×100%" },
                        { name: "Target Purity", formula: "TPD = 2·Purity_feed - 100" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="mass" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Mass Transfer Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Diffusion" 
                      formulas={[
                        { name: "Fick's First Law", formula: "J = -D(dc/dx)" },
                        { name: "Fick's Second Law", formula: "∂c/∂t = D(∂²c/∂x²)" },
                        { name: "Mass Transfer Coefficient", formula: "N = k(cA,s - cA,∞)" },
                        { name: "Effective Diffusivity", formula: "Deff = Dε/τ" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Distillation" 
                      formulas={[
                        { name: "Relative Volatility", formula: "α = (y₁/x₁)/(y₂/x₂)" },
                        { name: "Minimum Stages (Fenske)", formula: "Nmin = ln[(xD/xB)·(1-xB)/(1-xD)]/ln(α)" },
                        { name: "Minimum Reflux (Underwood)", formula: "Rmin = (xD - θ)/(θ - xF) - 1" },
                        { name: "HETP", formula: "HETP = Z/N" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Absorption & Stripping" 
                      formulas={[
                        { name: "Absorption Factor", formula: "A = L/(m·G)" },
                        { name: "Stripping Factor", formula: "S = m·G/L" },
                        { name: "Minimum Liquid Flow", formula: "Lmin = m·G·(y₁ - y₂)/(x₁* - x₂)" },
                        { name: "HTU & NTU", formula: "Z = HTU·NTU" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Extraction" 
                      formulas={[
                        { name: "Distribution Coefficient", formula: "K = cA,extract/cA,raffinate" },
                        { name: "Selectivity", formula: "β = KA/KB" },
                        { name: "Extraction Factor", formula: "E = KS/F" },
                        { name: "Extraction Efficiency", formula: "η = (cA,in - cA,out)/(cA,in - cA,eq)×100%" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="reaction" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Reaction Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Reaction Kinetics" 
                      formulas={[
                        { name: "Rate Law", formula: "rA = k·f(CA, CB, ...)" },
                        { name: "Arrhenius Equation", formula: "k = A·e^(-Ea/RT)" },
                        { name: "First Order Reaction", formula: "-rA = k·CA" },
                        { name: "Second Order Reaction", formula: "-rA = k·CA·CB" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Reactor Design" 
                      formulas={[
                        { name: "Batch Reactor", formula: "t = ∫(dX/(−rA))" },
                        { name: "CSTR", formula: "V = FA₀·X/(-rA)" },
                        { name: "PFR", formula: "V = FA₀·∫(dX/(-rA))" },
                        { name: "Space Time", formula: "τ = V/v₀" },
                        { name: "Space Velocity", formula: "WHSV = mass feed/(hour·mass catalyst)" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Thermochemistry" 
                      formulas={[
                        { name: "Heat of Reaction", formula: "ΔHr = ∑ΔHf,products - ∑ΔHf,reactants" },
                        { name: "Adiabatic Temperature Rise", formula: "ΔTad = (-ΔHr·X)/(CP,mix)" },
                        { name: "Equilibrium Constant", formula: "K = exp(-ΔG°/RT)" },
                        { name: "van't Hoff Equation", formula: "d(ln K)/dT = ΔH°/RT²" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Catalysis" 
                      formulas={[
                        { name: "Langmuir-Hinshelwood", formula: "rA = k·KAKB·pA·pB/[(1 + KA·pA + KB·pB)²]" },
                        { name: "Effectiveness Factor", formula: "η = tanh(φ)/φ" },
                        { name: "Thiele Modulus", formula: "φ = L·√(k/Deff)" },
                        { name: "Catalyst Deactivation", formula: "r = r₀·e^(-kd·t)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface FormulaProps {
  name: string;
  formula: string;
}

interface FormulaSectionProps {
  title: string;
  formulas: FormulaProps[];
}

const FormulaSection: React.FC<FormulaSectionProps> = ({ title, formulas }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">{title}</h3>
      <div className="space-y-2">
        {formulas.map((formula, index) => (
          <div key={index} className="rounded-md bg-gray-50 dark:bg-gray-700 p-3">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{formula.name}</span>
            </div>
            <div className="mt-2 text-blue-600 dark:text-blue-300 font-mono text-sm overflow-x-auto">
              {formula.formula}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formulas;

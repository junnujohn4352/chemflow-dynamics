
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
              Comprehensive collection of formulas for chemical engineering, petrochemical engineering, food technology, sugar technology, and other chemical engineering specializations.
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
                  <TabsTrigger value="biochem">Biochemical Engineering</TabsTrigger>
                  <TabsTrigger value="environ">Environmental Engineering</TabsTrigger>
                  <TabsTrigger value="polymer">Polymer Engineering</TabsTrigger>
                  <TabsTrigger value="pharma">Pharmaceutical Engineering</TabsTrigger>
                  <TabsTrigger value="metal">Metallurgical Engineering</TabsTrigger>
                  <TabsTrigger value="energy">Energy Engineering</TabsTrigger>
                  <TabsTrigger value="compu">Computational Chemical Engineering</TabsTrigger>
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
                        { name: "Conversion", formula: "X = (N₀ - N)/N₀", definition: "Ratio of moles of reactant consumed to moles of reactant fed" },
                        { name: "Yield", formula: "Y = moles of product formed / moles of reactant consumed", definition: "Measure of how efficiently a reactant forms a desired product" },
                        { name: "Selectivity", formula: "S = moles of desired product / moles of undesired product", definition: "Ratio indicating preference for desired product formation" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Dimensional Analysis" 
                      formulas={[
                        { name: "Reynolds Number", formula: "Re = ρvD/μ", definition: "Ratio of inertial forces to viscous forces - indicates flow regime (laminar/turbulent)" },
                        { name: "Prandtl Number", formula: "Pr = Cpμ/k", definition: "Ratio of momentum diffusivity to thermal diffusivity" },
                        { name: "Schmidt Number", formula: "Sc = μ/ρD", definition: "Ratio of momentum diffusivity to mass diffusivity" },
                        { name: "Sherwood Number", formula: "Sh = kₘL/D", definition: "Dimensionless mass transfer coefficient" },
                        { name: "Nusselt Number", formula: "Nu = hL/k", definition: "Dimensionless heat transfer coefficient" },
                        { name: "Peclet Number", formula: "Pe = Re·Pr", definition: "Ratio of heat transport by convection to conduction" },
                        { name: "Biot Number", formula: "Bi = hL/k", definition: "Ratio of internal thermal resistance to boundary layer resistance" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Process Control" 
                      formulas={[
                        { name: "First Order Response", formula: "y(t) = y∞ + (y₀ - y∞)e^(-t/τ)", definition: "Response of first-order system to step input" },
                        { name: "Second Order Response", formula: "y(t) = 1 - e^(-ζωt)(cos(ωd·t) + (ζ/√(1-ζ²))sin(ωd·t))", definition: "Response of second-order system with damping ratio ζ" },
                        { name: "PID Controller", formula: "u(t) = Kp·e(t) + Ki∫e(t)dt + Kd·de(t)/dt", definition: "Control signal combining proportional, integral, and derivative terms" },
                        { name: "Transfer Function", formula: "G(s) = Y(s)/X(s)", definition: "Ratio of output to input in Laplace domain" },
                        { name: "Process Gain", formula: "Kp = Δy/Δu", definition: "Ratio of change in process output to change in controller output at steady state" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Efficiency Metrics" 
                      formulas={[
                        { name: "Thermal Efficiency", formula: "η = W/Qin", definition: "Ratio of work output to heat input" },
                        { name: "Mechanical Efficiency", formula: "ηm = Wout/Win", definition: "Ratio of output mechanical work to input mechanical work" },
                        { name: "Overall Equipment Effectiveness", formula: "OEE = Availability × Performance × Quality", definition: "Measure of manufacturing productivity" },
                        { name: "Carbon Efficiency", formula: "CE = carbon in product / carbon in feedstock", definition: "Measure of carbon utilization in a process" }
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
                        { name: "First Law", formula: "ΔU = Q - W", definition: "Energy conservation - energy can be converted but not created or destroyed" },
                        { name: "Second Law", formula: "ΔS ≥ 0 (isolated system)", definition: "Entropy of an isolated system always increases" },
                        { name: "Third Law", formula: "S → 0 as T → 0 K", definition: "Entropy of a perfect crystal approaches zero at absolute zero temperature" },
                        { name: "Zeroth Law", formula: "If A = B and B = C, then A = C", definition: "If two systems are in thermal equilibrium with a third, they are in equilibrium with each other" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Equations of State" 
                      formulas={[
                        { name: "Ideal Gas Law", formula: "PV = nRT", definition: "Relationship between pressure, volume, moles, and temperature for an ideal gas" },
                        { name: "Van der Waals", formula: "(P + a(n/V)²)(V - nb) = nRT", definition: "Real gas equation accounting for molecular volume and attraction" },
                        { name: "Redlich-Kwong", formula: "P = RT/(V-b) - a/[T^(1/2)V(V+b)]", definition: "Improved real gas equation with temperature dependence" },
                        { name: "Peng-Robinson", formula: "P = RT/(V-b) - a(T)/[V(V+b) + b(V-b)]", definition: "Accurate real gas equation for vapor-liquid equilibrium" },
                        { name: "Soave-Redlich-Kwong", formula: "P = RT/(V-b) - a(T)/[V(V+b)]", definition: "Modified Redlich-Kwong with temperature-dependent attraction parameter" },
                        { name: "Virial Equation", formula: "PV/RT = 1 + B/V + C/V² + ...", definition: "Power series expansion for non-ideal gases" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Phase Equilibria" 
                      formulas={[
                        { name: "Raoult's Law", formula: "P₁ = x₁P₁°", definition: "Vapor pressure of component in ideal solution proportional to mole fraction" },
                        { name: "Henry's Law", formula: "P₁ = H₁x₁", definition: "Solubility of gas proportional to partial pressure (dilute solutions)" },
                        { name: "Gibbs Phase Rule", formula: "F = C - P + 2", definition: "Degrees of freedom in a thermodynamic system (F=freedom, C=components, P=phases)" },
                        { name: "Chemical Potential", formula: "μᵢ = (∂G/∂nᵢ)T,P,nⱼ", definition: "Partial molar Gibbs free energy - governs mass transfer between phases" },
                        { name: "Activity Coefficient", formula: "γᵢ = aᵢ/xᵢ", definition: "Measure of non-ideality in a solution" },
                        { name: "K-value (VLE)", formula: "Kᵢ = yᵢ/xᵢ", definition: "Vapor-liquid distribution ratio for component i" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Thermodynamic Properties" 
                      formulas={[
                        { name: "Enthalpy", formula: "H = U + PV", definition: "Total heat content of a system" },
                        { name: "Gibbs Free Energy", formula: "G = H - TS", definition: "Maximum reversible work possible at constant T and P" },
                        { name: "Helmholtz Free Energy", formula: "A = U - TS", definition: "Maximum reversible work possible at constant T and V" },
                        { name: "Entropy Change", formula: "ΔS = ∫(dQ/T)", definition: "Measure of disorder or randomness in a system" },
                        { name: "Heat Capacity Relationship", formula: "Cp - Cv = R (ideal gas)", definition: "Difference between constant pressure and constant volume heat capacities" },
                        { name: "Joule-Thomson Coefficient", formula: "μJT = (∂T/∂P)H", definition: "Temperature change with pressure at constant enthalpy" },
                        { name: "Fugacity", formula: "f = φP", definition: "Effective pressure accounting for non-ideal behavior" }
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
                        { name: "Hydrostatic Pressure", formula: "P = ρgh", definition: "Pressure at depth h in a fluid of density ρ" },
                        { name: "Buoyancy Force", formula: "Fb = ρgV", definition: "Upward force on object immersed in fluid equal to weight of displaced fluid" },
                        { name: "Surface Tension", formula: "ΔP = 2σ/r (spherical), ΔP = σ/r (cylindrical)", definition: "Pressure difference across curved interface" },
                        { name: "Capillary Rise", formula: "h = 2σcosθ/ρgr", definition: "Height of liquid rise in capillary tube" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Fluid Dynamics" 
                      formulas={[
                        { name: "Continuity Equation", formula: "ρ₁A₁v₁ = ρ₂A₂v₂", definition: "Mass conservation in fluid flow" },
                        { name: "Bernoulli's Equation", formula: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂", definition: "Energy conservation for inviscid, incompressible flow" },
                        { name: "Momentum Equation", formula: "F = ṁ(v₂ - v₁)", definition: "Force required to change fluid momentum" },
                        { name: "Energy Equation", formula: "Ẇshaft + Q̇ = ṁ(h₂ - h₁ + v₂²/2 - v₁²/2 + g(z₂-z₁))", definition: "Energy balance for fluid flow system" },
                        { name: "Navier-Stokes Equation", formula: "ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v + ρg", definition: "Motion of viscous fluid substances" },
                        { name: "Mach Number", formula: "Ma = v/c", definition: "Ratio of flow velocity to sound velocity" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pipe Flow" 
                      formulas={[
                        { name: "Darcy-Weisbach Equation", formula: "ΔP = fLρv²/2D", definition: "Pressure drop in pipe due to friction" },
                        { name: "Hagen-Poiseuille Equation", formula: "ΔP = 8μLQ/πr⁴", definition: "Pressure drop for laminar flow in circular pipe" },
                        { name: "Friction Factor (Laminar)", formula: "f = 64/Re", definition: "Darcy friction factor for laminar flow" },
                        { name: "Colebrook Equation", formula: "1/√f = -2log(ε/3.7D + 2.51/Re√f)", definition: "Implicit equation for turbulent friction factor" },
                        { name: "Moody Friction Factor", formula: "f = f(Re, ε/D)", definition: "Friction factor based on Reynolds number and relative roughness" },
                        { name: "Minor Loss Coefficient", formula: "hL = K(v²/2g)", definition: "Head loss due to pipe fittings and components" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pumps and Turbines" 
                      formulas={[
                        { name: "Pump Power", formula: "P = ρgQH/η", definition: "Power required by pump to lift liquid" },
                        { name: "Specific Speed", formula: "Ns = N√Q/H^(3/4)", definition: "Dimensionless parameter for pump/turbine selection" },
                        { name: "Pump Affinity Laws", formula: "Q₂/Q₁ = N₂/N₁, H₂/H₁ = (N₂/N₁)², P₂/P₁ = (N₂/N₁)³", definition: "Relationships between flow, head, power and speed" },
                        { name: "NPSH Available", formula: "NPSHa = (P₁/ρg) + (v₁²/2g) - (Pv/ρg) - hL", definition: "Net positive suction head available at pump inlet" },
                        { name: "NPSH Required", formula: "NPSHr = f(Q, N, design)", definition: "Net positive suction head required to prevent cavitation" },
                        { name: "Hydraulic Efficiency", formula: "ηh = ρgQH/Pshaft", definition: "Ratio of hydraulic power to shaft power" }
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
                        { name: "Fourier's Law", formula: "q = -kA(dT/dx)", definition: "Heat flux is proportional to negative temperature gradient" },
                        { name: "Thermal Resistance (Plane Wall)", formula: "R = L/kA", definition: "Resistance to heat flow through plane wall" },
                        { name: "Thermal Resistance (Cylindrical)", formula: "R = ln(r₂/r₁)/2πkL", definition: "Resistance to heat flow through cylindrical wall" },
                        { name: "Heat Equation", formula: "∂T/∂t = α∇²T", definition: "Diffusion of heat in a material as function of time and position" },
                        { name: "Thermal Diffusivity", formula: "α = k/ρCp", definition: "Material's ability to conduct heat relative to storing heat" },
                        { name: "Biot Number", formula: "Bi = hL/k", definition: "Ratio of convective to conductive heat transfer resistance" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Convection" 
                      formulas={[
                        { name: "Newton's Law of Cooling", formula: "q = hA(Ts - T∞)", definition: "Heat transfer between surface and moving fluid" },
                        { name: "Nusselt Number Correlation", formula: "Nu = C·Reᵐ·Prⁿ", definition: "Dimensionless heat transfer coefficient" },
                        { name: "Heat Transfer Coefficient", formula: "h = Nu·k/L", definition: "Proportionality constant between heat flux and temperature difference" },
                        { name: "Natural Convection", formula: "Nu = C·(Gr·Pr)ⁿ", definition: "Convection driven by buoyancy forces" },
                        { name: "Grashof Number", formula: "Gr = gβΔTL³/ν²", definition: "Ratio of buoyancy to viscous forces" },
                        { name: "Forced Convection in Tubes", formula: "Nu = 0.023·Re⁰·⁸·Pr^n", definition: "Dittus-Boelter equation for turbulent flow in tubes" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Radiation" 
                      formulas={[
                        { name: "Stefan-Boltzmann Law", formula: "q = εσA(T₁⁴ - T₂⁴)", definition: "Net radiation heat transfer between two surfaces" },
                        { name: "View Factor", formula: "q₁₂ = A₁F₁₂σ(T₁⁴ - T₂⁴)", definition: "Fraction of radiation leaving one surface that strikes another" },
                        { name: "Radiation Exchange", formula: "q = (σ(T₁⁴ - T₂⁴))/(1/ε₁ + 1/ε₂ - 1)", definition: "Net radiation exchange between two infinite parallel plates" },
                        { name: "Planck's Law", formula: "Eλ,b(λ,T) = C₁/[λ⁵(exp(C₂/λT) - 1)]", definition: "Spectral distribution of thermal radiation from black body" },
                        { name: "Wien's Displacement Law", formula: "λmax·T = 2898 μm·K", definition: "Wavelength of maximum spectral emissive power" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Heat Exchangers" 
                      formulas={[
                        { name: "LMTD Method", formula: "Q = UA·LMTD", definition: "Heat transfer in heat exchanger using log mean temperature difference" },
                        { name: "LMTD (Counter Flow)", formula: "LMTD = [(T₁ᵢ-T₂ₒ) - (T₁ₒ-T₂ᵢ)]/ln[(T₁ᵢ-T₂ₒ)/(T₁ₒ-T₂ᵢ)]", definition: "Log mean temperature difference for counter flow" },
                        { name: "Effectiveness-NTU Method", formula: "ε = Q/Qmax", definition: "Ratio of actual heat transfer to maximum possible heat transfer" },
                        { name: "Number of Transfer Units", formula: "NTU = UA/Cmin", definition: "Dimensionless parameter for heat exchanger analysis" },
                        { name: "Overall Heat Transfer Coefficient", formula: "1/U = 1/h₁ + 1/h₂ + Rw", definition: "Combined effect of all thermal resistances in heat exchanger" },
                        { name: "Heat Exchanger Effectiveness", formula: "ε = f(NTU, Cr, flow arrangement)", definition: "Effectiveness as function of NTU and capacity ratio" }
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
                        { name: "API Gravity", formula: "°API = (141.5/SG) - 131.5", definition: "Measure of how heavy/light petroleum liquid is compared to water" },
                        { name: "Watson Characterization Factor", formula: "Kw = (TB)^(1/3)/SG", definition: "Indicator of crude oil paraffinicity (TB in Rankine)" },
                        { name: "Viscosity Blending", formula: "ln(μblend) = x₁ln(μ₁) + x₂ln(μ₂) + ...", definition: "Logarithmic mixing rule for viscosity of oil blends" },
                        { name: "Flash Point Correlation", formula: "Tf = 0.68·Tb - 456.8 (°F)", definition: "Relationship between flash point and boiling point temperature" },
                        { name: "Reid Vapor Pressure", formula: "RVP = f(composition, T)", definition: "Measure of volatility of petroleum products at 100°F" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Refinery Operations" 
                      formulas={[
                        { name: "Distillation Tower Mass Balance", formula: "F = D + B", definition: "Feed equals distillate plus bottoms" },
                        { name: "Reboiler Heat Duty", formula: "Qr = L·HV", definition: "Heat required for partial vaporization of liquid" },
                        { name: "Reflux Ratio", formula: "R = L/D", definition: "Ratio of reflux liquid to distillate product" },
                        { name: "Minimum Reflux Ratio", formula: "Rmin = q/(q-1) · xF/(xD-xF)", definition: "Theoretical minimum reflux for specified separation" },
                        { name: "Murphree Tray Efficiency", formula: "EMV = (yn - yn-1)/(y* - yn-1)", definition: "Measure of how close tray approaches equilibrium" },
                        { name: "TBP-ASTM Conversion", formula: "TASTM = 0.92·TTBP + 10.8°C", definition: "Convert true boiling point to ASTM distillation temperature" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Catalytic Processes" 
                      formulas={[
                        { name: "Catalyst Deactivation", formula: "r = r₀·e^(-kd·t)", definition: "First-order decay of catalyst activity with time" },
                        { name: "Catalyst Effectiveness Factor", formula: "η = tanh(φ)/φ", definition: "Ratio of actual reaction rate to rate without diffusion limitations" },
                        { name: "Thiele Modulus", formula: "φ = L·√(k/Deff)", definition: "Ratio of reaction rate to diffusion rate within catalyst" },
                        { name: "Catalyst Space Velocity", formula: "WHSV = mass feed/(hour·mass catalyst)", definition: "Feed rate per unit mass of catalyst" },
                        { name: "Weisz-Prater Criterion", formula: "CWP = robs·R²/(Deff·CAs)", definition: "Criterion for determining if internal diffusion limits reaction" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Pipeline Transport" 
                      formulas={[
                        { name: "Pressure Drop", formula: "ΔP = fLρv²/2D", definition: "Pressure loss due to friction in pipeline" },
                        { name: "Pipeline Capacity", formula: "Q = (π/4)·D²·v", definition: "Volumetric flow rate through pipeline" },
                        { name: "Hydraulic Power", formula: "P = Q·ΔP", definition: "Power required to overcome pressure drop" },
                        { name: "Economic Pipe Diameter", formula: "Dopt = K·Q^(0.38)", definition: "Diameter that minimizes total annual cost" },
                        { name: "Erosional Velocity", formula: "ve = C/√ρ", definition: "Maximum velocity to prevent erosion (C = erosional constant)" }
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
                        { name: "Decimal Reduction Time (D value)", formula: "D = t/log(N₀/N)", definition: "Time required to reduce microbial population by 90%" },
                        { name: "Thermal Death Time", formula: "F₀ = 10^((T-121.1)/z)·t", definition: "Equivalent time at 121.1°C for sterilization" },
                        { name: "Water Activity", formula: "aw = p/p₀", definition: "Ratio of vapor pressure of food to pure water - controls microbial growth" },
                        { name: "Freezing Point Depression", formula: "ΔTf = Kf·m", definition: "Depression of freezing point due to solute concentration" },
                        { name: "z-value", formula: "z = (T₂-T₁)/log(D₁/D₂)", definition: "Temperature change needed to change D-value by factor of 10" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Food Process Engineering" 
                      formulas={[
                        { name: "Drying Rate", formula: "N = -(1/A)·(dW/dt)", definition: "Rate of moisture removal per unit area" },
                        { name: "Heat of Respiration", formula: "q = q₀·10^(T/10)", definition: "Heat generated by fresh produce due to respiration" },
                        { name: "Extraction Yield", formula: "Y = (mextract/mfeed)×100%", definition: "Mass percentage of extract obtained from feed material" },
                        { name: "Filtration Rate", formula: "dV/dt = ΔP·A/(μ·(Rc + Rm))", definition: "Volume flow rate through filter media" },
                        { name: "Constant Rate Drying", formula: "mc = (ms/A)·(dX/dt) = h(Ts-Ta)/λw", definition: "Moisture removal during constant rate period" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Rheology" 
                      formulas={[
                        { name: "Newtonian Fluid", formula: "τ = μ·γ̇", definition: "Linear relationship between shear stress and shear rate" },
                        { name: "Power Law Fluid", formula: "τ = K·γ̇ⁿ", definition: "Non-Newtonian model for pseudoplastic/dilatant fluids" },
                        { name: "Bingham Plastic", formula: "τ = τ₀ + μp·γ̇", definition: "Model for fluids with yield stress" },
                        { name: "Herschel-Bulkley Model", formula: "τ = τ₀ + K·γ̇ⁿ", definition: "Combined yield stress and power law behavior" },
                        { name: "Apparent Viscosity", formula: "μapp = τ/γ̇", definition: "Effective viscosity at specific shear rate" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Food Quality" 
                      formulas={[
                        { name: "Arrhenius Equation", formula: "k = A·e^(-Ea/RT)", definition: "Temperature dependence of reaction rate" },
                        { name: "Q10 Temperature Coefficient", formula: "Q10 = (k₂/k₁)^(10/(T₂-T₁))", definition: "Change in reaction rate with 10°C temperature change" },
                        { name: "CIE Color Difference", formula: "ΔE = √(ΔL² + Δa² + Δb²)", definition: "Quantitative measure of color difference" },
                        { name: "Texture Profile Analysis", formula: "Hardness = F(max) during first compression", definition: "Maximum force during first compression cycle" },
                        { name: "Shelf Life Model", formula: "t = t₀·e^[Ea/R·(1/T-1/T₀)]", definition: "Product shelf life as function of temperature" }
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
                        { name: "Brix", formula: "Brix = (msugar/msolution)×100%", definition: "Percentage of sucrose by weight in solution" },
                        { name: "Pol", formula: "Pol = apparent sucrose content by polarimetry", definition: "Optical rotation based measure of sucrose content" },
                        { name: "Purity", formula: "Purity = (Pol/Brix)×100%", definition: "Percentage of sucrose in total dissolved solids" },
                        { name: "Reducing Sugar Ratio", formula: "RS/AS = reducing sugars/apparent sucrose", definition: "Measure of sugar inversion" },
                        { name: "Recovery", formula: "Recovery = (sucrose in product/sucrose in feed)×100%", definition: "Percentage of sucrose recovered from feed" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Crystallization" 
                      formulas={[
                        { name: "Supersaturation", formula: "S = c/c*", definition: "Ratio of concentration to equilibrium solubility" },
                        { name: "Crystal Growth Rate", formula: "G = kg(c-c*)ᵍ", definition: "Rate of crystal growth as function of supersaturation" },
                        { name: "Nucleation Rate", formula: "B = kbSᵇ", definition: "Rate of new crystal formation" },
                        { name: "Recovery", formula: "Recovery = (msugar_out/msugar_in)×100%", definition: "Percentage of sugar recovered in crystallization" },
                        { name: "Crystal Content", formula: "CC = (Purity_massecuite - Purity_molasses)/(100 - Purity_molasses)×100%", definition: "Mass percentage of crystals in massecuite" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Evaporation" 
                      formulas={[
                        { name: "Evaporation Capacity", formula: "Capacity = mevaporated/t", definition: "Rate of water removal in evaporator" },
                        { name: "Steam Economy", formula: "Economy = mevaporated/msteam", definition: "Mass of water evaporated per unit mass of steam" },
                        { name: "Boiling Point Elevation", formula: "BPE = 0.0018·Brix²", definition: "Temperature increase of boiling point due to dissolved solids" },
                        { name: "Mass Concentration", formula: "Brixout = Brixin·(min/mout)", definition: "Final Brix based on mass balance" },
                        { name: "Heat Transfer Coefficient", formula: "U = q/(A·ΔT)", definition: "Overall heat transfer coefficient in evaporator" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Sugar Boiling" 
                      formulas={[
                        { name: "Massecuite", formula: "Yield = (100 - Purity_molasses)/(100 - Purity_massecuite)×100%", definition: "Theoretical yield of sugar from massecuite" },
                        { name: "Crystal Content", formula: "CC = (Purity_massecuite - Purity_molasses)/(100 - Purity_molasses)×100%", definition: "Percentage of crystals in massecuite" },
                        { name: "Target Purity", formula: "TPD = 2·Purity_feed - 100", definition: "Target purity difference for optimum crystallization" },
                        { name: "Molasses Exhaustion", formula: "ME = (Purity_feed - Purity_molasses)/(Purity_feed)×100%", definition: "Measure of how well sucrose is extracted from molasses" },
                        { name: "Sucrose Loss", formula: "Loss = (1 - Recovery/100)·Sucrose_in", definition: "Amount of sucrose not recovered in process" }
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
                        { name: "Fick's First Law", formula: "J = -D(dc/dx)", definition: "Diffusive flux proportional to concentration gradient" },
                        { name: "Fick's Second Law", formula: "∂c/∂t = D(∂²c/∂x²)", definition: "Change in concentration with time due to diffusion" },
                        { name: "Mass Transfer Coefficient", formula: "N = k(cA,s - cA,∞)", definition: "Mass transfer rate proportional to concentration difference" },
                        { name: "Effective Diffusivity", formula: "Deff = Dε/τ", definition: "Diffusion in porous media accounting for porosity and tortuosity" },
                        { name: "Schmidt Number", formula: "Sc = μ/ρD", definition: "Ratio of momentum diffusivity to mass diffusivity" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Distillation" 
                      formulas={[
                        { name: "Relative Volatility", formula: "α = (y₁/x₁)/(y₂/x₂)", definition: "Measure of ease of separation between two components" },
                        { name: "Minimum Stages (Fenske)", formula: "Nmin = ln[(xD/xB)·(1-xB)/(1-xD)]/ln(α)", definition: "Minimum theoretical stages at total reflux" },
                        { name: "Minimum Reflux (Underwood)", formula: "Rmin = (xD - θ)/(θ - xF) - 1", definition: "Minimum reflux ratio for specified separation" },
                        { name: "HETP", formula: "HETP = Z/N", definition: "Height equivalent to theoretical plate" },
                        { name: "McCabe-Thiele Method", formula: "yn+1 = (Rxn + xD)/(R + 1)", definition: "Operating line equation for rectifying section" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Absorption & Stripping" 
                      formulas={[
                        { name: "Absorption Factor", formula: "A = L/(m·G)", definition: "Ratio of liquid flow to minimum liquid flow" },
                        { name: "Stripping Factor", formula: "S = m·G/L", definition: "Ratio of vapor flow to minimum vapor flow" },
                        { name: "Minimum Liquid Flow", formula: "Lmin = m·G·(y₁ - y₂)/(x₁* - x₂)", definition: "Minimum liquid required for specified separation" },
                        { name: "HTU & NTU", formula: "Z = HTU·NTU", definition: "Column height as product of height and number of transfer units" },
                        { name: "Overall Mass Transfer Coefficient", formula: "1/KOG = 1/kg + m/kL", definition: "Combined resistance to mass transfer" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Extraction" 
                      formulas={[
                        { name: "Distribution Coefficient", formula: "K = cA,extract/cA,raffinate", definition: "Equilibrium ratio of solute between two phases" },
                        { name: "Selectivity", formula: "β = KA/KB", definition: "Relative preference for extracting component A vs B" },
                        { name: "Extraction Factor", formula: "E = KS/F", definition: "Product of distribution coefficient and solvent-to-feed ratio" },
                        { name: "Extraction Efficiency", formula: "η = (cA,in - cA,out)/(cA,in - cA,eq)×100%", definition: "Measure of how close extraction approaches equilibrium" },
                        { name: "Number of Theoretical Stages", formula: "N = ln[(E-1)·xF/xN + 1]/ln(E)", definition: "Stages required for countercurrent extraction" }
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
                        { name: "Rate Law", formula: "rA = k·f(CA, CB, ...)", definition: "Rate of reaction as function of concentration and rate constant" },
                        { name: "Arrhenius Equation", formula: "k = A·e^(-Ea/RT)", definition: "Temperature dependence of reaction rate constant" },
                        { name: "First Order Reaction", formula: "-rA = k·CA", definition: "Rate proportional to concentration of A" },
                        { name: "Second Order Reaction", formula: "-rA = k·CA·CB", definition: "Rate proportional to product of concentrations" },
                        { name: "Half-life (First Order)", formula: "t1/2 = ln(2)/k", definition: "Time for concentration to decrease by half" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Reactor Design" 
                      formulas={[
                        { name: "Batch Reactor", formula: "t = ∫(dX/(−rA))", definition: "Time required to reach conversion X" },
                        { name: "CSTR", formula: "V = FA₀·X/(-rA)", definition: "Volume for continuous stirred tank reactor" },
                        { name: "PFR", formula: "V = FA₀·∫(dX/(-rA))", definition: "Volume for plug flow reactor" },
                        { name: "Space Time", formula: "τ = V/v₀", definition: "Average residence time in reactor" },
                        { name: "Space Velocity", formula: "WHSV = mass feed/(hour·mass catalyst)", definition: "Feed rate per unit mass of catalyst" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Thermochemistry" 
                      formulas={[
                        { name: "Heat of Reaction", formula: "ΔHr = ∑ΔHf,products - ∑ΔHf,reactants", definition: "Enthalpy change for reaction" },
                        { name: "Adiabatic Temperature Rise", formula: "ΔTad = (-ΔHr·X)/(CP,mix)", definition: "Temperature increase without heat transfer" },
                        { name: "Equilibrium Constant", formula: "K = exp(-ΔG°/RT)", definition: "Relationship between equilibrium constant and Gibbs free energy" },
                        { name: "van't Hoff Equation", formula: "d(ln K)/dT = ΔH°/RT²", definition: "Temperature dependence of equilibrium constant" },
                        { name: "Chemical Equilibrium", formula: "K = ∏(ai)^νi", definition: "Product of activities raised to stoichiometric coefficients" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Catalysis" 
                      formulas={[
                        { name: "Langmuir-Hinshelwood", formula: "rA = k·KAKB·pA·pB/[(1 + KA·pA + KB·pB)²]", definition: "Rate expression for surface reaction with adsorption" },
                        { name: "Effectiveness Factor", formula: "η = tanh(φ)/φ", definition: "Ratio of actual to intrinsic reaction rate" },
                        { name: "Thiele Modulus", formula: "φ = L·√(k/Deff)", definition: "Ratio of reaction rate to diffusion rate" },
                        { name: "Catalyst Deactivation", formula: "r = r₀·e^(-kd·t)", definition: "First-order decay of catalyst activity" },
                        { name: "Weisz-Prater Criterion", formula: "CWP = -rA,obs·R²/(Deff·CAs)", definition: "Indicator of internal diffusion limitations" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="biochem" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Biochemical Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Cell Growth Kinetics" 
                      formulas={[
                        { name: "Monod Equation", formula: "μ = μmax·S/(Ks + S)", definition: "Specific growth rate as function of substrate concentration" },
                        { name: "Cell Mass Balance", formula: "dX/dt = μX - kdX", definition: "Change in cell concentration with growth and death" },
                        { name: "Substrate Utilization", formula: "dS/dt = -μX/YX/S - mX", definition: "Substrate consumption for growth and maintenance" },
                        { name: "Product Formation", formula: "dP/dt = qpX", definition: "Rate of product formation proportional to cell concentration" },
                        { name: "Yield Coefficient", formula: "YX/S = ΔX/ΔS", definition: "Cell mass produced per substrate consumed" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Bioreactor Design" 
                      formulas={[
                        { name: "Oxygen Transfer Rate", formula: "OTR = kLa(C* - C)", definition: "Rate of oxygen transfer from gas to liquid" },
                        { name: "Oxygen Uptake Rate", formula: "OUR = qO2·X", definition: "Rate of oxygen consumption by cells" },
                        { name: "Volumetric Productivity", formula: "Qp = P/t", definition: "Product concentration per unit time" },
                        { name: "Specific Productivity", formula: "qp = Qp/X", definition: "Product per cell mass per time" },
                        { name: "Damköhler Number", formula: "Da = τ·r/C0", definition: "Ratio of reaction rate to mass transfer rate" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Enzyme Kinetics" 
                      formulas={[
                        { name: "Michaelis-Menten", formula: "v = Vmax·S/(Km + S)", definition: "Enzyme reaction rate as function of substrate concentration" },
                        { name: "Lineweaver-Burk", formula: "1/v = (Km/Vmax)·(1/S) + 1/Vmax", definition: "Linear transformation of Michaelis-Menten equation" },
                        { name: "Competitive Inhibition", formula: "v = Vmax·S/(Km(1 + I/Ki) + S)", definition: "Effect of competitive inhibitor on reaction rate" },
                        { name: "Non-competitive Inhibition", formula: "v = Vmax·S/((Km + S)(1 + I/Ki))", definition: "Effect of non-competitive inhibitor on reaction rate" },
                        { name: "Substrate Inhibition", formula: "v = Vmax·S/(Km + S + S²/Ksi)", definition: "Inhibition of enzyme by excess substrate" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Downstream Processing" 
                      formulas={[
                        { name: "Recovery Yield", formula: "Y = (mproduct,out/mproduct,in)×100%", definition: "Percentage of product recovered in purification step" },
                        { name: "Purification Factor", formula: "PF = (Purity2/Purity1)", definition: "Increase in purity between purification steps" },
                        { name: "Resolution", formula: "Rs = 2(tR2 - tR1)/(w1 + w2)", definition: "Separation efficiency in chromatography" },
                        { name: "Filtration Flux", formula: "J = ΔP/(μ·Rt)", definition: "Filtrate flow rate per unit area" },
                        { name: "Sedimentation Velocity", formula: "vs = d²(ρp-ρ)g/(18μ)", definition: "Terminal velocity of particle in fluid (Stokes' Law)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="environ" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Environmental Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Wastewater Treatment" 
                      formulas={[
                        { name: "BOD Removal Efficiency", formula: "η = (BODin - BODout)/BODin × 100%", definition: "Percentage of BOD removed in treatment" },
                        { name: "First-Order BOD Reaction", formula: "y = L₀(1 - e^(-k·t))", definition: "BOD exerted after time t" },
                        { name: "Sludge Volume Index", formula: "SVI = (settled sludge volume/MLSS) × 1000", definition: "Volume occupied by 1g of sludge after 30min settling" },
                        { name: "Hydraulic Retention Time", formula: "HRT = V/Q", definition: "Average time liquid remains in reactor" },
                        { name: "Solid Retention Time", formula: "SRT = V·X/(Qw·Xw + Qe·Xe)", definition: "Average time solids remain in system" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Air Pollution Control" 
                      formulas={[
                        { name: "Gaussian Plume Model", formula: "C(x,y,z) = (Q/(2πuσyσz))·exp(-y²/(2σy²))·[exp(-(z-H)²/(2σz²)) + exp(-(z+H)²/(2σz²))]", definition: "Pollutant concentration downwind from point source" },
                        { name: "Collection Efficiency", formula: "η = 1 - Cout/Cin", definition: "Fraction of particles removed by control device" },
                        { name: "Stokes Number", formula: "Stk = τV₀/dc", definition: "Ratio of stopping distance to characteristic dimension" },
                        { name: "Terminal Settling Velocity", formula: "vt = (ρp-ρ)gd²/(18μ)", definition: "Maximum velocity of particle falling in fluid" },
                        { name: "Cyclone Pressure Drop", formula: "ΔP = 0.5ρ(vi²)(NH)(W/H)²", definition: "Pressure loss in cyclone separator" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Carbon Capture & Sequestration" 
                      formulas={[
                        { name: "CO2 Capture Efficiency", formula: "η = (CO2,captured/CO2,produced) × 100%", definition: "Percentage of produced CO2 that is captured" },
                        { name: "CO2 Absorption Rate", formula: "rCO2 = kG·a·(pCO2 - pCO2*)", definition: "Rate of CO2 absorption in liquid solvent" },
                        { name: "Carbon Capture Energy Penalty", formula: "EP = (Energy with capture - Energy without capture)/Energy without capture", definition: "Fractional energy consumption for carbon capture" },
                        { name: "Storage Capacity", formula: "mCO2 = ρCO2·Vp·φ·Sw·E", definition: "Mass of CO2 that can be stored in geological formation" },
                        { name: "Leakage Rate", formula: "LR = (mCO2,leaked/mCO2,stored)/t", definition: "Fraction of stored CO2 leaked per unit time" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Solid Waste Management" 
                      formulas={[
                        { name: "Waste Generation Rate", formula: "WGR = mwaste/(Population·time)", definition: "Mass of waste generated per capita per time" },
                        { name: "Landfill Volume", formula: "V = mwaste/(ρwaste·(1-φ))", definition: "Volume required for waste disposal in landfill" },
                        { name: "Methane Generation", formula: "QCH4 = k·L₀·m·e^(-k·t)", definition: "Rate of methane generation from landfill waste" },
                        { name: "Recycling Rate", formula: "RR = (mrecycled/mtotal) × 100%", definition: "Percentage of waste diverted to recycling" },
                        { name: "Compost Maturity Index", formula: "CMI = C/N ratio", definition: "Carbon to nitrogen ratio indicating compost stability" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="polymer" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Polymer Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Polymerization Kinetics" 
                      formulas={[
                        { name: "Degree of Polymerization", formula: "DP = Mn/M0", definition: "Number of monomer units in average polymer chain" },
                        { name: "Carothers Equation", formula: "Xn = 1/(1-p)", definition: "Number-average degree of polymerization for step-growth" },
                        { name: "Chain Growth Polymerization", formula: "Xn = kp[M]/kt[R·]", definition: "Degree of polymerization for chain growth mechanism" },
                        { name: "Molecular Weight Distribution", formula: "PDI = Mw/Mn", definition: "Polydispersity index measuring breadth of molecular weight distribution" },
                        { name: "Mayo Equation", formula: "1/DP = 1/DP₀ + Cs[S]/[M]", definition: "Effect of chain transfer agent on degree of polymerization" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Polymer Properties" 
                      formulas={[
                        { name: "Glass Transition Temperature", formula: "1/Tg = w1/Tg1 + w2/Tg2", definition: "Glass transition temperature of polymer blend (Fox equation)" },
                        { name: "Flory-Huggins Equation", formula: "ΔGmix/RT = (n1ln(φ1) + n2ln(φ2) + n1φ2χ)", definition: "Free energy of mixing for polymer solutions" },
                        { name: "Mark-Houwink Equation", formula: "[η] = K·Ma", definition: "Intrinsic viscosity related to molecular weight" },
                        { name: "Kuhn Length", formula: "lk = C∞·l", definition: "Effective segment length in polymer chain" },
                        { name: "Radius of Gyration", formula: "Rg² = Nb²/6", definition: "Mean square radius of polymer chain" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Polymer Processing" 
                      formulas={[
                        { name: "Power Law Fluid", formula: "η = K·γ̇ⁿ⁻¹", definition: "Apparent viscosity of polymer melt" },
                        { name: "Extruder Output", formula: "Q = α·N - β·ΔP", definition: "Volumetric flow rate in extruder" },
                        { name: "Die Swell", formula: "B = De/Do", definition: "Ratio of extrudate diameter to die diameter" },
                        { name: "Melt Flow Index", formula: "MFI = m/(t·ρ)", definition: "Mass of polymer flowing through capillary under standard conditions" },
                        { name: "Cooling Time (Injection Molding)", formula: "tc = (s²/α)·ln(4(Ti-Tw)/(π(Te-Tw)))", definition: "Time required to cool molded part" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Mechanical Properties" 
                      formulas={[
                        { name: "Young's Modulus", formula: "E = σ/ε", definition: "Ratio of stress to strain in elastic region" },
                        { name: "Time-Temperature Superposition", formula: "aT = exp[(E/R)·(1/T - 1/T0)]", definition: "Shift factor for viscoelastic properties" },
                        { name: "Creep Compliance", formula: "J(t) = ε(t)/σ0", definition: "Time-dependent strain per unit stress" },
                        { name: "Maxwell Model", formula: "σ(t) = σ0·e^(-t/τ)", definition: "Stress relaxation in viscoelastic material" },
                        { name: "Fracture Toughness", formula: "KIC = Y·σ·√(πa)", definition: "Critical stress intensity factor" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="pharma" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Pharmaceutical Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Drug Formulation" 
                      formulas={[
                        { name: "Noyes-Whitney Equation", formula: "dC/dt = DA(Cs - C)/h", definition: "Dissolution rate of solid in liquid" },
                        { name: "Higuchi Equation", formula: "Q = √(2A·Cd·Cs·Dt)", definition: "Drug release from matrix system" },
                        { name: "Hixson-Crowell Equation", formula: "W0^(1/3) - Wt^(1/3) = k·t", definition: "Dissolution rate considering changing surface area" },
                        { name: "Peppas Equation", formula: "Mt/M∞ = k·tⁿ", definition: "Fractional drug release related to diffusion mechanism" },
                        { name: "Zero-Order Release", formula: "Qt = Q0 + k0·t", definition: "Constant drug release rate independent of concentration" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Bioavailability & Pharmacokinetics" 
                      formulas={[
                        { name: "Area Under Curve", formula: "AUC = ∫C(t)dt", definition: "Measure of total drug exposure over time" },
                        { name: "Bioavailability", formula: "F = (AUCoral·Doseiv)/(AUCiv·Doseoral)", definition: "Fraction of drug that reaches systemic circulation" },
                        { name: "First-Order Elimination", formula: "C = C0·e^(-k·t)", definition: "Concentration decline with constant fraction eliminated per time" },
                        { name: "Clearance", formula: "CL = k·Vd", definition: "Volume of blood cleared of drug per unit time" },
                        { name: "Half-life", formula: "t1/2 = ln(2)/k", definition: "Time for drug concentration to decrease by half" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Process Engineering" 
                      formulas={[
                        { name: "Tablet Hardness", formula: "H = F/D", definition: "Breaking force per tablet diameter" },
                        { name: "Friability", formula: "F = ((Wi - Wf)/Wi) × 100%", definition: "Percentage weight loss during abrasion test" },
                        { name: "Carr's Index", formula: "CI = ((ρtapped - ρbulk)/ρtapped) × 100%", definition: "Measure of powder flowability" },
                        { name: "Hausner Ratio", formula: "HR = ρtapped/ρbulk", definition: "Another indicator of powder flow properties" },
                        { name: "Cake Filtration", formula: "t/V = (αμc/2A²ΔP)·V + (μRm/AΔP)", definition: "Filtration time related to filtrate volume" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Sterilization & Cleanroom" 
                      formulas={[
                        { name: "D-value", formula: "D = t/log(N0/N)", definition: "Time to reduce microbial population by 90%" },
                        { name: "F0 value", formula: "F0 = 10^((T-121.1)/z)·t", definition: "Equivalent sterilization time at 121.1°C" },
                        { name: "Air Changes per Hour", formula: "ACH = Q/V", definition: "Number of times air volume is replaced in one hour" },
                        { name: "Recovery Rate", formula: "t = -ln(Ct/C0)/ACH", definition: "Time to reduce contaminant to specified level" },
                        { name: "HEPA Filter Efficiency", formula: "E = 1 - (Cdownstream/Cupstream)", definition: "Fraction of particles removed by filter" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="metal" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Metallurgical & Corrosion Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Extractive Metallurgy" 
                      formulas={[
                        { name: "Nernst Equation", formula: "E = E° - (RT/nF)·ln(Q)", definition: "Electrode potential under non-standard conditions" },
                        { name: "Ellingham Diagram", formula: "ΔG° = ΔH° - TΔS°", definition: "Free energy change for oxide formation" },
                        { name: "Leaching Recovery", formula: "η = (mextracted/mtotal) × 100%", definition: "Percentage of metal extracted from ore" },
                        { name: "Grade-Recovery Curve", formula: "R = f(G)", definition: "Relationship between concentrate grade and recovery" },
                        { name: "Avrami Equation", formula: "f = 1 - exp(-ktⁿ)", definition: "Fraction transformed during phase change" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Corrosion Engineering" 
                      formulas={[
                        { name: "Corrosion Rate", formula: "CR = (K·W)/(A·t·ρ)", definition: "Material loss per unit time" },
                        { name: "Faraday's Law", formula: "m = (M·I·t)/(n·F)", definition: "Mass of metal dissolved electrochemically" },
                        { name: "Tafel Equation", formula: "η = β·log(i/i0)", definition: "Overpotential as function of current density" },
                        { name: "Butler-Volmer Equation", formula: "i = i0[exp(αnFη/RT) - exp(-βnFη/RT)]", definition: "Current-potential relationship for electrode reaction" },
                        { name: "Pitting Resistance Equivalent", formula: "PRE = %Cr + 3.3(%Mo) + 16(%N)", definition: "Resistance to pitting corrosion in stainless steel" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Metal Processing" 
                      formulas={[
                        { name: "True Strain", formula: "ε = ln(lf/l0)", definition: "Natural logarithm of final to initial length ratio" },
                        { name: "Flow Stress", formula: "σ = K·εⁿ", definition: "Stress required for plastic deformation (power law)" },
                        { name: "Melting Rate", formula: "Rm = η·P/Hm", definition: "Mass of metal melted per unit time" },
                        { name: "Solidification Time", formula: "ts = k·V/A·√t", definition: "Chvorinov's rule for casting solidification" },
                        { name: "Hardenability (Jominy)", formula: "HRC = f(distance from quenched end)", definition: "Hardness as function of cooling rate" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Electrochemical Engineering" 
                      formulas={[
                        { name: "Cell Voltage", formula: "E = E° - (RT/nF)·ln(Q) - η - iR", definition: "Total voltage including overpotentials and ohmic loss" },
                        { name: "Current Efficiency", formula: "CE = (mactual/mtheoretical) × 100%", definition: "Percentage of current producing desired reaction" },
                        { name: "Specific Energy Consumption", formula: "w = (E·I·t)/(m·3600)", definition: "Energy required per unit mass of product (kWh/kg)" },
                        { name: "Nernst-Planck Equation", formula: "Ji = -Di∇ci - ziciDiF∇ϕ/RT + civ", definition: "Flux of ions due to diffusion, migration, and convection" },
                        { name: "Battery Capacity", formula: "C = I·t", definition: "Product of current and discharge time (Amp-hours)" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="energy" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Energy & Renewable Resources Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Solar Energy" 
                      formulas={[
                        { name: "Photovoltaic Efficiency", formula: "η = Pout/(A·G)", definition: "Ratio of electrical output to solar radiation input" },
                        { name: "Solar Collector Efficiency", formula: "η = Q/(A·G) = η0 - UL(Tin - Tamb)/G", definition: "Thermal efficiency of solar collector" },
                        { name: "Solar Declination", formula: "δ = 23.45·sin(360·(284+n)/365)", definition: "Angular position of sun at solar noon" },
                        { name: "Peak Sun Hours", formula: "PSH = ∫G(t)dt/1000", definition: "Equivalent hours of solar irradiance at 1 kW/m²" },
                        { name: "PV Array Output", formula: "E = A·η·H·PR", definition: "Energy output from photovoltaic array" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Hydrogen & Fuel Cells" 
                      formulas={[
                        { name: "Hydrogen Production Efficiency", formula: "η = ΔHH2/(Energy Input)", definition: "Ratio of hydrogen energy content to input energy" },
                        { name: "Fuel Cell Efficiency", formula: "η = ΔG/(HHVH2)", definition: "Ratio of electrical work to hydrogen heating value" },
                        { name: "Nernst Potential", formula: "E = E° - (RT/nF)·ln(pproducts/preactants)", definition: "Cell voltage accounting for partial pressures" },
                        { name: "Membrane Water Flux", formula: "Jw = nd·I/F + DW·ΔC", definition: "Water transport across PEM fuel cell membrane" },
                        { name: "Electrolyzer Energy Consumption", formula: "W = V·I·t/mH2", definition: "Energy required per unit mass of hydrogen produced" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Biomass Conversion" 
                      formulas={[
                        { name: "Higher Heating Value", formula: "HHV = 0.3491·C + 1.1783·H + 0.1005·S - 0.1034·O - 0.0151·N - 0.0211·A", definition: "Heating value from elemental composition" },
                        { name: "Biogas Yield", formula: "YCH4 = B0·VS·(1-e^(-k·t))", definition: "Methane production from anaerobic digestion" },
                        { name: "Combustion Air Requirement", formula: "mair = (11.44·C + 34.34·H + 4.32·S - 4.32·O)/100", definition: "Theoretical air needed for complete combustion" },
                        { name: "Pyrolysis Oil Yield", formula: "Yoil = f(T, heating rate, residence time)", definition: "Bio-oil yield from pyrolysis process" },
                        { name: "Gasification Efficiency", formula: "ηcg = (HHVgas·Vgas)/(HHVbiomass·mbiomass)", definition: "Cold gas efficiency of gasifier" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Energy Storage & Efficiency" 
                      formulas={[
                        { name: "Battery Energy Density", formula: "Ed = E/m", definition: "Stored energy per unit mass (Wh/kg)" },
                        { name: "Pumped Hydro Storage", formula: "E = m·g·h·η", definition: "Energy stored in elevated water" },
                        { name: "Thermal Energy Storage", formula: "Q = m·Cp·ΔT", definition: "Sensible heat storage capacity" },
                        { name: "Round-Trip Efficiency", formula: "ηRT = Eout/Ein", definition: "Ratio of energy retrieved to energy stored" },
                        { name: "Levelized Cost of Energy", formula: "LCOE = (∑(It+Mt+Ft)/(1+r)^t)/(∑(Et/(1+r)^t))", definition: "Lifetime cost divided by energy production" }
                      ]} 
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="compu" className="mt-6">
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <h2 className="text-2xl font-bold mb-4">Computational Chemical Engineering Formulas</h2>
                  
                  <div className="space-y-6">
                    <FormulaSection 
                      title="Process Modeling" 
                      formulas={[
                        { name: "Steady-State Material Balance", formula: "∑(ṁin·xi,in) - ∑(ṁout·xi,out) = 0", definition: "Conservation of component i in steady state" },
                        { name: "Unsteady-State Material Balance", formula: "d(V·ρ·xi)/dt = ∑(ṁin·xi,in) - ∑(ṁout·xi,out) + ri·V", definition: "Dynamic mass balance with reaction" },
                        { name: "Energy Balance", formula: "d(U)/dt = ∑(ṁin·hin) - ∑(ṁout·hout) + Q - Ws", definition: "Rate of energy accumulation equals net energy flow" },
                        { name: "Momentum Balance", formula: "-(dP/dx) = fρv²/2D + ρg·sinθ", definition: "Pressure gradient in pipe flow" },
                        { name: "Degrees of Freedom", formula: "DoF = (variables) - (independent equations)", definition: "Number of variables that must be specified" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Numerical Methods" 
                      formulas={[
                        { name: "Euler Method", formula: "yn+1 = yn + h·f(tn, yn)", definition: "First-order numerical integration" },
                        { name: "Runge-Kutta (RK4)", formula: "yn+1 = yn + (k1 + 2k2 + 2k3 + k4)/6", definition: "Fourth-order numerical integration" },
                        { name: "Newton-Raphson Method", formula: "xn+1 = xn - f(xn)/f'(xn)", definition: "Finding roots of nonlinear equations" },
                        { name: "Finite Difference (Centered)", formula: "f'(x) ≈ [f(x+h) - f(x-h)]/(2h)", definition: "Numerical approximation of derivatives" },
                        { name: "Trapezoidal Rule", formula: "∫f(x)dx ≈ (b-a)/2·[f(a) + f(b)]", definition: "Numerical integration using trapezoids" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="CFD & Transport Phenomena" 
                      formulas={[
                        { name: "Continuity Equation", formula: "∂ρ/∂t + ∇·(ρv) = 0", definition: "Conservation of mass in fluid flow" },
                        { name: "Navier-Stokes Equation", formula: "ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v + ρg", definition: "Conservation of momentum in fluid flow" },
                        { name: "Energy Equation", formula: "ρCp(∂T/∂t + v·∇T) = k∇²T + μΦ", definition: "Conservation of energy with viscous dissipation" },
                        { name: "Courant Number", formula: "C = u·Δt/Δx", definition: "Stability criterion for explicit time integration" },
                        { name: "Grid Convergence Index", formula: "GCI = Fs|ε|/(rp-1)", definition: "Measure of numerical uncertainty in CFD" }
                      ]} 
                    />
                    
                    <FormulaSection 
                      title="Optimization & Machine Learning" 
                      formulas={[
                        { name: "Objective Function", formula: "min/max f(x) subject to g(x) ≤ 0, h(x) = 0", definition: "Mathematical statement of optimization problem" },
                        { name: "Mean Squared Error", formula: "MSE = (1/n)·∑(yi - ŷi)²", definition: "Average squared difference between predicted and actual values" },
                        { name: "Gradient Descent Update", formula: "θ = θ - α·∇J(θ)", definition: "Parameter update in gradient-based optimization" },
                        { name: "R-squared", formula: "R² = 1 - SSres/SStot", definition: "Proportion of variance explained by model" },
                        { name: "K-fold Cross-Validation", formula: "Error = (1/K)·∑Error_i", definition: "Average error across K validation sets" }
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
  definition?: string;
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
            {formula.definition && (
              <div className="mt-1 text-gray-600 dark:text-gray-400 text-xs italic">
                {formula.definition}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formulas;



import React, { useState } from "react";
import { Search, X, Info, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}

const availableComponents = [
  {
    id: "Nitrogen",
    name: "Nitrogen",
    formula: "N₂",
    mw: 28.02,
    cas: "7727-37-9",
    phase: "Gas"
  },
  {
    id: "Oxygen",
    name: "Oxygen",
    formula: "O₂",
    mw: 32.00,
    cas: "7782-44-7",
    phase: "Gas"
  },
  {
    id: "Carbon-Dioxide",
    name: "Carbon Dioxide",
    formula: "CO₂",
    mw: 44.01,
    cas: "124-38-9",
    phase: "Gas"
  },
  {
    id: "Hydrogen",
    name: "Hydrogen",
    formula: "H₂",
    mw: 2.02,
    cas: "1333-74-0",
    phase: "Gas"
  },
  {
    id: "Methane",
    name: "Methane",
    formula: "CH₄",
    mw: 16.04,
    cas: "74-82-8",
    phase: "Gas"
  },
  {
    id: "Ethane",
    name: "Ethane",
    formula: "C₂H₆",
    mw: 30.07,
    cas: "74-84-0",
    phase: "Gas"
  },
  {
    id: "Propane",
    name: "Propane",
    formula: "C₃H₈",
    mw: 44.10,
    cas: "74-98-6",
    phase: "Gas"
  },
  {
    id: "Butane",
    name: "Butane",
    formula: "C₄H₁₀",
    mw: 58.12,
    cas: "106-97-8",
    phase: "Gas"
  },
  {
    id: "Pentane",
    name: "Pentane",
    formula: "C₅H₁₂",
    mw: 72.15,
    cas: "109-66-0",
    phase: "Liquid"
  },
  {
    id: "Hexane",
    name: "Hexane",
    formula: "C₆H₁₄",
    mw: 86.18,
    cas: "110-54-3",
    phase: "Liquid"
  },
  {
    id: "Heptane",
    name: "Heptane",
    formula: "C₇H₁₆",
    mw: 100.20,
    cas: "142-82-5",
    phase: "Liquid"
  },
  {
    id: "Octane",
    name: "Octane",
    formula: "C₈H₁₈",
    mw: 114.23,
    cas: "111-65-9",
    phase: "Liquid"
  },
  {
    id: "Nonane",
    name: "Nonane",
    formula: "C₉H₂₀",
    mw: 128.26,
    cas: "111-84-2",
    phase: "Liquid"
  },
  {
    id: "Decane",
    name: "Decane",
    formula: "C₁₀H₂₂",
    mw: 142.28,
    cas: "124-18-5",
    phase: "Liquid"
  },
  {
    id: "Benzene",
    name: "Benzene",
    formula: "C₆H₆",
    mw: 78.11,
    cas: "71-43-2",
    phase: "Liquid"
  },
  {
    id: "Toluene",
    name: "Toluene",
    formula: "C₇H₈",
    mw: 92.14,
    cas: "108-88-3",
    phase: "Liquid"
  },
  {
    id: "Ethylbenzene",
    name: "Ethylbenzene",
    formula: "C₈H₁₀",
    mw: 106.17,
    cas: "100-41-4",
    phase: "Liquid"
  },
  {
    id: "o-Xylene",
    name: "o-Xylene",
    formula: "C₈H₁₀",
    mw: 106.17,
    cas: "95-47-6",
    phase: "Liquid"
  },
  {
    id: "m-Xylene",
    name: "m-Xylene",
    formula: "C₈H₁₀",
    mw: 106.17,
    cas: "108-38-3",
    phase: "Liquid"
  },
  {
    id: "p-Xylene",
    name: "p-Xylene",
    formula: "C₈H₁₀",
    mw: 106.17,
    cas: "106-42-3",
    phase: "Liquid"
  },
  {
    id: "Styrene",
    name: "Styrene",
    formula: "C₈H₈",
    mw: 104.15,
    cas: "100-42-5",
    phase: "Liquid"
  },
  {
    id: "Naphthalene",
    name: "Naphthalene",
    formula: "C₁₀H₈",
    mw: 128.17,
    cas: "91-20-3",
    phase: "Solid"
  },
  {
    id: "Methanol",
    name: "Methanol",
    formula: "CH₃OH",
    mw: 32.04,
    cas: "67-56-1",
    phase: "Liquid"
  },
  {
    id: "Ethanol",
    name: "Ethanol",
    formula: "C₂H₅OH",
    mw: 46.07,
    cas: "64-17-5",
    phase: "Liquid"
  },
  {
    id: "1-Propanol",
    name: "1-Propanol",
    formula: "C₃H₇OH",
    mw: 60.10,
    cas: "71-23-8",
    phase: "Liquid"
  },
  {
    id: "2-Propanol",
    name: "2-Propanol",
    formula: "C₃H₇OH",
    mw: 60.10,
    cas: "67-63-0",
    phase: "Liquid"
  },
  {
    id: "1-Butanol",
    name: "1-Butanol",
    formula: "C₄H₉OH",
    mw: 74.12,
    cas: "71-36-3",
    phase: "Liquid"
  },
  {
    id: "2-Butanol",
    name: "2-Butanol",
    formula: "C₄H₉OH",
    mw: 74.12,
    cas: "78-92-2",
    phase: "Liquid"
  },
  {
    id: "tert-Butanol",
    name: "tert-Butanol",
    formula: "C₄H₉OH",
    mw: 74.12,
    cas: "75-65-0",
    phase: "Liquid"
  },
  {
    id: "Ethylene-Glycol",
    name: "Ethylene Glycol",
    formula: "C₂H₆O₂",
    mw: 62.07,
    cas: "107-21-1",
    phase: "Liquid"
  },
  {
    id: "Propylene-Glycol",
    name: "Propylene Glycol",
    formula: "C₃H₈O₂",
    mw: 76.09,
    cas: "57-55-6",
    phase: "Liquid"
  },
  {
    id: "Glycerol",
    name: "Glycerol",
    formula: "C₃H₈O₃",
    mw: 92.09,
    cas: "56-81-5",
    phase: "Liquid"
  },
  {
    id: "Acetone",
    name: "Acetone",
    formula: "C₃H₆O",
    mw: 58.08,
    cas: "67-64-1",
    phase: "Liquid"
  },
  {
    id: "Butanone",
    name: "Butanone",
    formula: "C₄H₈O",
    mw: 72.11,
    cas: "78-93-3",
    phase: "Liquid"
  },
  {
    id: "Cyclohexanone",
    name: "Cyclohexanone",
    formula: "C₆H₁₀O",
    mw: 98.14,
    cas: "108-94-1",
    phase: "Liquid"
  },
  {
    id: "Acetaldehyde",
    name: "Acetaldehyde",
    formula: "C₂H₄O",
    mw: 44.05,
    cas: "75-07-0",
    phase: "Liquid"
  },
  {
    id: "Formaldehyde",
    name: "Formaldehyde",
    formula: "CH₂O",
    mw: 30.03,
    cas: "50-00-0",
    phase: "Gas"
  },
  {
    id: "Benzaldehyde",
    name: "Benzaldehyde",
    formula: "C₇H₆O",
    mw: 106.12,
    cas: "100-52-7",
    phase: "Liquid"
  },
  {
    id: "Acetic-Acid",
    name: "Acetic Acid",
    formula: "C₂H₄O₂",
    mw: 60.05,
    cas: "64-19-7",
    phase: "Liquid"
  },
  {
    id: "Formic-Acid",
    name: "Formic Acid",
    formula: "CH₂O₂",
    mw: 46.03,
    cas: "64-18-6",
    phase: "Liquid"
  },
  {
    id: "Propionic-Acid",
    name: "Propionic Acid",
    formula: "C₃H₆O₂",
    mw: 74.08,
    cas: "79-09-4",
    phase: "Liquid"
  },
  {
    id: "Butyric-Acid",
    name: "Butyric Acid",
    formula: "C₄H₈O₂",
    mw: 88.11,
    cas: "107-92-6",
    phase: "Liquid"
  },
  {
    id: "Benzoic-Acid",
    name: "Benzoic Acid",
    formula: "C₇H₆O₂",
    mw: 122.12,
    cas: "65-85-0",
    phase: "Solid"
  },
  {
    id: "Methyl-Acetate",
    name: "Methyl Acetate",
    formula: "C₃H₆O₂",
    mw: 74.08,
    cas: "79-20-9",
    phase: "Liquid"
  },
  {
    id: "Ethyl-Acetate",
    name: "Ethyl Acetate",
    formula: "C₄H₈O₂",
    mw: 88.11,
    cas: "141-78-6",
    phase: "Liquid"
  },
  {
    id: "Dimethyl-Ether",
    name: "Dimethyl Ether",
    formula: "C₂H₆O",
    mw: 46.07,
    cas: "115-10-6",
    phase: "Gas"
  },
  {
    id: "Diethyl-Ether",
    name: "Diethyl Ether",
    formula: "C₄H₁₀O",
    mw: 74.12,
    cas: "60-29-7",
    phase: "Liquid"
  },
  {
    id: "Tetrahydrofuran",
    name: "Tetrahydrofuran",
    formula: "C₄H₈O",
    mw: 72.11,
    cas: "109-99-9",
    phase: "Liquid"
  },
  {
    id: "1,4-Dioxane",
    name: "1,4-Dioxane",
    formula: "C₄H₈O₂",
    mw: 88.11,
    cas: "123-91-1",
    phase: "Liquid"
  },
  {
    id: "Acetonitrile",
    name: "Acetonitrile",
    formula: "C₂H₃N",
    mw: 41.05,
    cas: "75-05-8",
    phase: "Liquid"
  },
  {
    id: "Acrylonitrile",
    name: "Acrylonitrile",
    formula: "C₃H₃N",
    mw: 53.06,
    cas: "107-13-1",
    phase: "Liquid"
  },
  {
    id: "Aniline",
    name: "Aniline",
    formula: "C₆H₇N",
    mw: 93.13,
    cas: "62-53-3",
    phase: "Liquid"
  },
  {
    id: "Pyridine",
    name: "Pyridine",
    formula: "C₅H₅N",
    mw: 79.10,
    cas: "110-86-1",
    phase: "Liquid"
  },
  {
    id: "Ammonia",
    name: "Ammonia",
    formula: "NH₃",
    mw: 17.03,
    cas: "7664-41-7",
    phase: "Gas"
  },
  {
    id: "Methylamine",
    name: "Methylamine",
    formula: "CH₅N",
    mw: 31.06,
    cas: "74-89-5",
    phase: "Gas"
  },
  {
    id: "Dimethylamine",
    name: "Dimethylamine",
    formula: "C₂H₇N",
    mw: 45.08,
    cas: "124-40-3",
    phase: "Gas"
  },
  {
    id: "Trimethylamine",
    name: "Trimethylamine",
    formula: "C₃H₉N",
    mw: 59.11,
    cas: "75-50-3",
    phase: "Gas"
  },
  {
    id: "Ethylamine",
    name: "Ethylamine",
    formula: "C₂H₇N",
    mw: 45.08,
    cas: "75-04-7",
    phase: "Gas"
  },
  {
    id: "Diethylamine",
    name: "Diethylamine",
    formula: "C₄H₁₁N",
    mw: 73.14,
    cas: "109-89-7",
    phase: "Liquid"
  },
  {
    id: "Triethylamine",
    name: "Triethylamine",
    formula: "C₆H₁₅N",
    mw: 101.19,
    cas: "121-44-8",
    phase: "Liquid"
  },
  {
    id: "Chloromethane",
    name: "Chloromethane",
    formula: "CH₃Cl",
    mw: 50.49,
    cas: "74-87-3",
    phase: "Gas"
  },
  {
    id: "Dichloromethane",
    name: "Dichloromethane",
    formula: "CH₂Cl₂",
    mw: 84.93,
    cas: "75-09-2",
    phase: "Liquid"
  },
  {
    id: "Chloroform",
    name: "Chloroform",
    formula: "CHCl₃",
    mw: 119.38,
    cas: "67-66-3",
    phase: "Liquid"
  },
  {
    id: "Carbon-Tetrachloride",
    name: "Carbon Tetrachloride",
    formula: "CCl₄",
    mw: 153.82,
    cas: "56-23-5",
    phase: "Liquid"
  },
  {
    id: "Chloroethane",
    name: "Chloroethane",
    formula: "C₂H₅Cl",
    mw: 64.51,
    cas: "75-00-3",
    phase: "Gas"
  },
  {
    id: "1,2-Dichloroethane",
    name: "1,2-Dichloroethane",
    formula: "C₂H₄Cl₂",
    mw: 98.96,
    cas: "107-06-2",
    phase: "Liquid"
  },
  {
    id: "Chlorobenzene",
    name: "Chlorobenzene",
    formula: "C₆H₅Cl",
    mw: 112.56,
    cas: "108-90-7",
    phase: "Liquid"
  },
  {
    id: "Bromomethane",
    name: "Bromomethane",
    formula: "CH₃Br",
    mw: 94.94,
    cas: "74-83-9",
    phase: "Gas"
  },
  {
    id: "Bromoethane",
    name: "Bromoethane",
    formula: "C₂H₅Br",
    mw: 108.97,
    cas: "74-96-4",
    phase: "Liquid"
  },
  {
    id: "Iodomethane",
    name: "Iodomethane",
    formula: "CH₃I",
    mw: 141.94,
    cas: "74-88-4",
    phase: "Liquid"
  },
  {
    id: "Iodoethane",
    name: "Iodoethane",
    formula: "C₂H₅I",
    mw: 155.97,
    cas: "75-03-6",
    phase: "Liquid"
  },
  {
    id: "Fluoromethane",
    name: "Fluoromethane",
    formula: "CH₃F",
    mw: 34.03,
    cas: "593-53-3",
    phase: "Gas"
  },
  {
    id: "Difluoromethane",
    name: "Difluoromethane",
    formula: "CH₂F₂",
    mw: 52.02,
    cas: "75-10-5",
    phase: "Gas"
  },
  {
    id: "Trifluoromethane",
    name: "Trifluoromethane",
    formula: "CHF₃",
    mw: 70.01,
    cas: "75-46-7",
    phase: "Gas"
  },
  {
    id: "Tetrafluoromethane",
    name: "Tetrafluoromethane",
    formula: "CF₄",
    mw: 88.00,
    cas: "75-73-0",
    phase: "Gas"
  },
  {
    id: "Sulfur-Dioxide",
    name: "Sulfur Dioxide",
    formula: "SO₂",
    mw: 64.07,
    cas: "7446-09-5",
    phase: "Gas"
  },
  {
    id: "Sulfur-Trioxide",
    name: "Sulfur Trioxide",
    formula: "SO₃",
    mw: 80.07,
    cas: "7446-11-9",
    phase: "Solid"
  },
  {
    id: "Hydrogen-Sulfide",
    name: "Hydrogen Sulfide",
    formula: "H₂S",
    mw: 34.08,
    cas: "7783-06-4",
    phase: "Gas"
  },
  {
    id: "Carbon-Disulfide",
    name: "Carbon Disulfide",
    formula: "CS₂",
    mw: 76.14,
    cas: "75-15-0",
    phase: "Liquid"
  },
  {
    id: "Sulfuric-Acid",
    name: "Sulfuric Acid",
    formula: "H₂SO₄",
    mw: 98.08,
    cas: "7664-93-9",
    phase: "Liquid"
  },
  {
    id: "Nitric-Oxide",
    name: "Nitric Oxide",
    formula: "NO",
    mw: 30.01,
    cas: "10102-43-9",
    phase: "Gas"
  },
  {
    id: "Nitrogen-Dioxide",
    name: "Nitrogen Dioxide",
    formula: "NO₂",
    mw: 46.01,
    cas: "10102-44-0",
    phase: "Gas"
  },
  {
    id: "Nitrous-Oxide",
    name: "Nitrous Oxide",
    formula: "N₂O",
    mw: 44.01,
    cas: "10024-97-2",
    phase: "Gas"
  },
  {
    id: "Nitric-Acid",
    name: "Nitric Acid",
    formula: "HNO₃",
    mw: 63.01,
    cas: "7697-37-2",
    phase: "Liquid"
  },
  {
    id: "Phosphine",
    name: "Phosphine",
    formula: "PH₃",
    mw: 34.00,
    cas: "7803-51-2",
    phase: "Gas"
  },
  {
    id: "Phosphorus-Trichloride",
    name: "Phosphorus Trichloride",
    formula: "PCl₃",
    mw: 137.33,
    cas: "7719-12-2",
    phase: "Liquid"
  },
  {
    id: "Phosphorus-Pentachloride",
    name: "Phosphorus Pentachloride",
    formula: "PCl₅",
    mw: 208.24,
    cas: "10026-13-8",
    phase: "Solid"
  },
  {
    id: "Phosphoric-Acid",
    name: "Phosphoric Acid",
    formula: "H₃PO₄",
    mw: 98.00,
    cas: "7664-38-2",
    phase: "Liquid"
  },
  {
    id: "Boron-Trifluoride",
    name: "Boron Trifluoride",
    formula: "BF₃",
    mw: 67.82,
    cas: "7637-07-2",
    phase: "Gas"
  },
  {
    id: "Boron-Trichloride",
    name: "Boron Trichloride",
    formula: "BCl₃",
    mw: 117.17,
    cas: "10294-34-5",
    phase: "Gas"
  },
  {
    id: "Boric-Acid",
    name: "Boric Acid",
    formula: "H₃BO₃",
    mw: 61.83,
    cas: "10043-35-3",
    phase: "Solid"
  },
  {
    id: "Silicon-Tetrachloride",
    name: "Silicon Tetrachloride",
    formula: "SiCl₄",
    mw: 169.90,
    cas: "10026-04-7",
    phase: "Liquid"
  },
  {
    id: "Silicon-Tetrafluoride",
    name: "Silicon Tetrafluoride",
    formula: "SiF₄",
    mw: 104.08,
    cas: "7783-61-1",
    phase: "Gas"
  },
  {
    id: "Hydrogen-Cyanide",
    name: "Hydrogen Cyanide",
    formula: "HCN",
    mw: 27.03,
    cas: "74-90-8",
    phase: "Liquid"
  },
  {
    id: "Cyanogen",
    name: "Cyanogen",
    formula: "C₂N₂",
    mw: 52.03,
    cas: "460-19-5",
    phase: "Gas"
  },
  {
    id: "Cyanogen-Chloride",
    name: "Cyanogen Chloride",
    formula: "CNCl",
    mw: 61.47,
    cas: "506-77-4",
    phase: "Gas"
  },
  {
    id: "Argon",
    name: "Argon",
    formula: "Ar",
    mw: 39.95,
    cas: "7440-37-1",
    phase: "Gas"
  },
  {
    id: "Helium",
    name: "Helium",
    formula: "He",
    mw: 4.00,
    cas: "7440-59-7",
    phase: "Gas"
  },
  {
    id: "Neon",
    name: "Neon",
    formula: "Ne",
    mw: 20.18,
    cas: "7440-01-9",
    phase: "Gas"
  },
  {
    id: "Krypton",
    name: "Krypton",
    formula: "Kr",
    mw: 83.80,
    cas: "7439-90-9",
    phase: "Gas"
  },
  {
    id: "Xenon",
    name: "Xenon",
    formula: "Xe",
    mw: 131.29,
    cas: "7440-63-3",
    phase: "Gas"
  },
  {
    id: "Radon",
    name: "Radon",
    formula: "Rn",
    mw: 222.00,
    cas: "10043-92-2",
    phase: "Gas"
  },
  {
    id: "Water",
    name: "Water",
    formula: "H₂O",
    mw: 18.02,
    cas: "7732-18-5",
    phase: "Liquid"
  },
  {
    id: "Hydrogen-Peroxide",
    name: "Hydrogen Peroxide",
    formula: "H₂O₂",
    mw: 34.01,
    cas: "7722-84-1",
    phase: "Liquid"
  },
  {
    id: "Ozone",
    name: "Ozone",
    formula: "O₃",
    mw: 48.00,
    cas: "10028-15-6",
    phase: "Gas"
  },
  {
    id: "Hydrogen-Chloride",
    name: "Hydrogen Chloride",
    formula: "HCl",
    mw: 36.46,
    cas: "7647-01-0",
    phase: "Gas"
  },
  {
    id: "Hydrogen-Bromide",
    name: "Hydrogen Bromide",
    formula: "HBr",
    mw: 80.91,
    cas: "10035-10-6",
    phase: "Gas"
  },
  {
    id: "Hydrogen-Iodide",
    name: "Hydrogen Iodide",
    formula: "HI",
    mw: 127.91,
    cas: "10034-85-2",
    phase: "Gas"
  },
  {
    id: "Hydrogen-Fluoride",
    name: "Hydrogen Fluoride",
    formula: "HF",
    mw: 20.01,
    cas: "7664-39-3",
    phase: "Gas"
  },
  {
    id: "Cyclohexane",
    name: "Cyclohexane",
    formula: "C₆H₁₂",
    mw: 84.16,
    cas: "110-82-7",
    phase: "Liquid"
  },
  {
    id: "Cyclopentane",
    name: "Cyclopentane",
    formula: "C₅H₁₀",
    mw: 70.13,
    cas: "287-92-3",
    phase: "Liquid"
  },
  {
    id: "Methylcyclohexane",
    name: "Methylcyclohexane",
    formula: "C₇H₁₄",
    mw: 98.19,
    cas: "108-87-2",
    phase: "Liquid"
  },
  {
    id: "Ethylene",
    name: "Ethylene",
    formula: "C₂H₄",
    mw: 28.05,
    cas: "74-85-1",
    phase: "Gas"
  },
  {
    id: "Propylene",
    name: "Propylene",
    formula: "C₃H₆",
    mw: 42.08,
    cas: "115-07-1",
    phase: "Gas"
  },
  {
    id: "1-Butene",
    name: "1-Butene",
    formula: "C₄H₈",
    mw: 56.10,
    cas: "106-98-9",
    phase: "Gas"
  },
  {
    id: "2-Butene",
    name: "2-Butene",
    formula: "C₄H₈",
    mw: 56.10,
    cas: "107-01-7",
    phase: "Gas"
  },
  {
    id: "1-Pentene",
    name: "1-Pentene",
    formula: "C₅H₁₀",
    mw: 70.13,
    cas: "109-67-1",
    phase: "Liquid"
  },
  {
    id: "1-Hexene",
    name: "1-Hexene",
    formula: "C₆H₁₂",
    mw: 84.16,
    cas: "592-41-6",
    phase: "Liquid"
  },
  {
    id: "1,3-Butadiene",
    name: "1,3-Butadiene",
    formula: "C₄H₆",
    mw: 54.09,
    cas: "106-99-0",
    phase: "Gas"
  },
  {
    id: "Isoprene",
    name: "Isoprene",
    formula: "C₅H₈",
    mw: 68.12,
    cas: "78-79-5",
    phase: "Liquid"
  },
  {
    id: "Acetylene",
    name: "Acetylene",
    formula: "C₂H₂",
    mw: 26.04,
    cas: "74-86-2",
    phase: "Gas"
  },
  {
    id: "Dimethylformamide",
    name: "Dimethylformamide",
    formula: "C₃H₇NO",
    mw: 73.09,
    cas: "68-12-2",
    phase: "Liquid"
  },
  {
    id: "Dimethyl-Sulfoxide",
    name: "Dimethyl Sulfoxide",
    formula: "C₂H₆OS",
    mw: 78.13,
    cas: "67-68-5",
    phase: "Liquid"
  },
  {
    id: "N-Methyl-2-Pyrrolidone",
    name: "N-Methyl-2-Pyrrolidone",
    formula: "C₅H₉NO",
    mw: 99.13,
    cas: "872-50-4",
    phase: "Liquid"
  },
  {
    id: "Carbon-Monoxide",
    name: "Carbon Monoxide",
    formula: "CO",
    mw: 28.01,
    cas: "630-08-0",
    phase: "Gas"
  },
  {
    id: "Formamide",
    name: "Formamide",
    formula: "CH₃NO",
    mw: 45.04,
    cas: "75-12-7",
    phase: "Liquid"
  },
  {
    id: "Urea",
    name: "Urea",
    formula: "CH₄N₂O",
    mw: 60.06,
    cas: "57-13-6",
    phase: "Solid"
  },
  {
    id: "2-Ethylhexanol",
    name: "2-Ethylhexanol",
    formula: "C₈H₁₈O",
    mw: 130.23,
    cas: "104-76-7",
    phase: "Liquid"
  },
  {
    id: "Phenol",
    name: "Phenol",
    formula: "C₆H₆O",
    mw: 94.11,
    cas: "108-95-2",
    phase: "Solid"
  },
  {
    id: "Cresol",
    name: "Cresol",
    formula: "C₇H₈O",
    mw: 108.14,
    cas: "1319-77-3",
    phase: "Liquid"
  },
  {
    id: "Cyclohexanol",
    name: "Cyclohexanol",
    formula: "C₆H₁₂O",
    mw: 100.16,
    cas: "108-93-0",
    phase: "Liquid"
  },
  {
    id: "Chloral",
    name: "Chloral",
    formula: "C₂HCl₃O",
    mw: 147.39,
    cas: "75-87-6",
    phase: "Liquid"
  },
  {
    id: "Chlorobenzene",
    name: "Chlorobenzene",
    formula: "C₆H₅Cl",
    mw: 112.56,
    cas: "108-90-7",
    phase: "Liquid"
  },
  {
    id: "Bromobenzene",
    name: "Bromobenzene",
    formula: "C₆H₅Br",
    mw: 157.01,
    cas: "108-86-1",
    phase: "Liquid"
  },
  {
    id: "Iodobenzene",
    name: "Iodobenzene",
    formula: "C₆H₅I",
    mw: 204.01,
    cas: "591-50-4",
    phase: "Liquid"
  },
  {
    id: "Fluorobenzene",
    name: "Fluorobenzene",
    formula: "C₆H₅F",
    mw: 96.10,
    cas: "462-06-6",
    phase: "Liquid"
  },
  {
    id: "Nitrobenzene",
    name: "Nitrobenzene",
    formula: "C₆H₅NO₂",
    mw: 123.11,
    cas: "98-95-3",
    phase: "Liquid"
  },
  {
    id: "Benzoic-Acid",
    name: "Benzoic Acid",
    formula: "C₇H₆O₂",
    mw: 122.12,
    cas: "65-85-0",
    phase: "Solid"
  },
  {
    id: "Salicylic-Acid",
    name: "Salicylic Acid",
    formula: "C₇H₆O₃",
    mw: 138.12,
    cas: "69-72-7",
    phase: "Solid"
  },
  {
    id: "Acetylsalicylic-Acid",
    name: "Acetylsalicylic Acid",
    formula: "C₉H₈O₄",
    mw: 180.16,
    cas: "50-78-2",
    phase: "Solid"
  },
  {
    id: "Phthalic-Acid",
    name: "Phthalic Acid",
    formula: "C₈H₆O₄",
    mw: 166.13,
    cas: "88-99-3",
    phase: "Solid"
  },
  {
    id: "Phthalic-Anhydride",
    name: "Phthalic Anhydride",
    formula: "C₈H₄O₃",
    mw: 148.12,
    cas: "85-44-9",
    phase: "Solid"
  },
  {
    id: "Maleic-Anhydride",
    name: "Maleic Anhydride",
    formula: "C₄H₂O₃",
    mw: 98.06,
    cas: "108-31-6",
    phase: "Solid"
  },
  {
    id: "Succinic-Acid",
    name: "Succinic Acid",
    formula: "C₄H₆O₄",
    mw: 118.09,
    cas: "110-15-6",
    phase: "Solid"
  },
  {
    id: "Adipic-Acid",
    name: "Adipic Acid",
    formula: "C₆H₁₀O₄",
    mw: 146.14,
    cas: "124-04-9",
    phase: "Solid"
  },
  {
    id: "Citric-Acid",
    name: "Citric Acid",
    formula: "C₆H₈O₇",
    mw: 192.12,
    cas: "77-92-9",
    phase: "Solid"
  },
  {
    id: "Tartaric-Acid",
    name: "Tartaric Acid",
    formula: "C₄H₆O₆",
    mw: 150.09,
    cas: "87-69-4",
    phase: "Solid"
  },
  {
    id: "Malic-Acid",
    name: "Malic Acid",
    formula: "C₄H₆O₅",
    mw: 134.09,
    cas: "6915-15-7",
    phase: "Solid"
  },
  {
    id: "Fumaric-Acid",
    name: "Fumaric Acid",
    formula: "C₄H₄O₄",
    mw: 116.07,
    cas: "110-17-8",
    phase: "Solid"
  },
  {
    id: "Maleic-Acid",
    name: "Maleic Acid",
    formula: "C₄H₄O₄",
    mw: 116.07,
    cas: "110-16-7",
    phase: "Solid"
  },
  {
    id: "Oxalic-Acid",
    name: "Oxalic Acid",
    formula: "C₂H₂O₄",
    mw: 90.03,
    cas: "144-62-7",
    phase: "Solid"
  },
  {
    id: "Glutamic-Acid",
    name: "Glutamic Acid",
    formula: "C₅H₉NO₄",
    mw: 147.13,
    cas: "56-86-0",
    phase: "Solid"
  },
  {
    id: "Aspartic-Acid",
    name: "Aspartic Acid",
    formula: "C₄H₇NO₄",
    mw: 133.10,
    cas: "56-84-8",
    phase: "Solid"
  },
  {
    id: "Glycine",
    name: "Glycine",
    formula: "C₂H₅NO₂",
    mw: 75.07,
    cas: "56-40-6",
    phase: "Solid"
  },
  {
    id: "Alanine",
    name: "Alanine",
    formula: "C₃H₇NO₂",
    mw: 89.09,
    cas: "56-41-7",
    phase: "Solid"
  },
  {
    id: "Serine",
    name: "Serine",
    formula: "C₃H₇NO₃",
    mw: 105.09,
    cas: "56-45-1",
    phase: "Solid"
  },
  {
    id: "Cysteine",
    name: "Cysteine",
    formula: "C₃H₇NO₂S",
    mw: 121.16,
    cas: "52-90-4",
    phase: "Solid"
  },
  {
    id: "Methionine",
    name: "Methionine",
    formula: "C₅H₁₁NO₂S",
    mw: 149.21,
    cas: "63-68-3",
    phase: "Solid"
  },
  {
    id: "Phenylalanine",
    name: "Phenylalanine",
    formula: "C₉H₁₁NO₂",
    mw: 165.19,
    cas: "63-91-2",
    phase: "Solid"
  },
  {
    id: "Tyrosine",
    name: "Tyrosine",
    formula: "C₉H₁₁NO₃",
    mw: 181.19,
    cas: "60-18-4",
    phase: "Solid"
  },
  {
    id: "Tryptophan",
    name: "Tryptophan",
    formula: "C₁₁H₁₂N₂O₂",
    mw: 204.23,
    cas: "73-22-3",
    phase: "Solid"
  },
  {
    id: "Histidine",
    name: "Histidine",
    formula: "C₆H₉N₃O₂",
    mw: 155.16,
    cas: "71-00-1",
    phase: "Solid"
  },
  {
    id: "Arginine",
    name: "Arginine",
    formula: "C₆H₁₄N₄O₂",
    mw: 174.20,
    cas: "74-79-3",
    phase: "Solid"
  },
  {
    id: "Lysine",
    name: "Lysine",
    formula: "C₆H₁₄N₂O₂",
    mw: 146.19,
    cas: "56-87-1",
    phase: "Solid"
  },
  {
    id: "Threonine",
    name: "Threonine",
    formula: "C₄H₉NO₃",
    mw: 119.12,
    cas: "72-19-5",
    phase: "Solid"
  },
  {
    id: "Valine",
    name: "Valine",
    formula: "C₅H₁₁NO₂",
    mw: 117.15,
    cas: "72-18-4",
    phase: "Solid"
  },
  {
    id: "Leucine",
    name: "Leucine",
    formula: "C₆H₁₃NO₂",
    mw: 131.18,
    cas: "61-90-5",
    phase: "Solid"
  },
  {
    id: "Isoleucine",
    name: "Isoleucine",
    formula: "C₆H₁₃NO₂",
    mw: 131.18,
    cas: "73-32-5",
    phase: "Solid"
  },
  {
    id: "Proline",
    name: "Proline",
    formula: "C₅H₉NO₂",
    mw: 115.13,
    cas: "147-85-3",
    phase: "Solid"
  },
  {
    id: "Glutamine",
    name: "Glutamine",
    formula: "C₅H₁₀N₂O₃",
    mw: 146.15,
    cas: "56-85-9",
    phase: "Solid"
  },
  {
    id: "Asparagine",
    name: "Asparagine",
    formula: "C₄H₈N₂O₃",
    mw: 132.12,
    cas: "70-47-3",
    phase: "Solid"
  },
  {
    id: "Hydrogen",
    name: "Hydrogen",
    formula: "H₂",
    mw: 2.02,
    cas: "1333-74-0",
    phase: "Gas"
  },
  {
    id: "Oxygen",
    name: "Oxygen",
    formula: "O₂",
    mw: 32.00,
    cas: "7782-44-7",
    phase: "Gas"
  },
  {
    id: "Nitrogen",
    name: "Nitrogen",
    formula: "N₂",
    mw: 28.02,
    cas: "7727-37-9",
    phase: "Gas"
  },
  {
    id: "Carbon-Dioxide",
    name: "Carbon Dioxide",
    formula: "CO₂",
    mw: 44.01,
    cas: "124-38-9",
    phase: "Gas"
  },
  {
    id: "Water",
    name: "Water",
    formula: "H₂O",
    mw: 18.02,
    cas: "7732-18-5",
    phase: "Liquid"
  },
  {
    id: "Methane",
    name: "Methane",
    formula: "CH₄",
    mw: 16.04,
    cas: "74-82-8",
    phase: "Gas"
  }
];

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ selectedComponents, setSelectedComponents }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customComponent, setCustomComponent] = useState({ name: "", formula: "" });
  
  const filteredComponents = availableComponents.filter(
    comp => 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.cas.includes(searchQuery)
  );
  
  const handleComponentClick = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };
  
  const handleAddCustomComponent = () => {
    if (customComponent.name.trim() === "") return;
    
    const componentId = customComponent.name.replace(/[^a-zA-Z0-9]/g, "-");
    
    if (!selectedComponents.includes(componentId)) {
      setSelectedComponents([...selectedComponents, componentId]);
    }
    
    setCustomComponent({ name: "", formula: "" });
    setShowCustomInput(false);
  };
  
  const componentGroups = [
    { name: "Common Gases", components: ["Nitrogen", "Oxygen", "Carbon-Dioxide", "Hydrogen", "Argon", "Helium"] },
    { name: "Light Hydrocarbons", components: ["Methane", "Ethane", "Propane", "Butane", "Pentane"] },
    { name: "Olefins", components: ["Ethylene", "Propylene", "1-Butene", "1,3-Butadiene", "Isoprene", "Acetylene"] },
    { name: "Alcohols", components: ["Methanol", "Ethanol", "1-Propanol", "2-Propanol", "Glycerol"] },
    { name: "Aromatics", components: ["Benzene", "Toluene", "Ethylbenzene", "Styrene", "Naphthalene"] },
    { name: "Solvents", components: ["Acetone", "Dichloromethane", "Tetrahydrofuran", "Dimethyl-Sulfoxide", "Acetonitrile"] }
  ];
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Components</h3>
      <p className="text-gray-600 mb-6">
        Choose the chemical components for your simulation
      </p>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by name, formula, or CAS number..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Quick Add by Group</h4>
        <div className="flex flex-wrap gap-2">
          {componentGroups.map(group => (
            <TooltipProvider key={group.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newComponents = group.components.filter(
                        comp => !selectedComponents.includes(comp)
                      );
                      if (newComponents.length > 0) {
                        setSelectedComponents([...selectedComponents, ...newComponents]);
                      }
                    }}
                  >
                    {group.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{group.components.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {showCustomInput ? (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Add Custom Component</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Component Name</label>
              <Input 
                value={customComponent.name}
                onChange={(e) => setCustomComponent({...customComponent, name: e.target.value})}
                placeholder="e.g., Propylene Glycol"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Chemical Formula (optional)</label>
              <Input 
                value={customComponent.formula}
                onChange={(e) => setCustomComponent({...customComponent, formula: e.target.value})}
                placeholder="e.g., C₃H₈O₂"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomComponent({ name: "", formula: "" });
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddCustomComponent}
              disabled={customComponent.name.trim() === ""}
            >
              Add Component
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCustomInput(true)}
          >
            + Add Custom Component
          </Button>
        </div>
      )}
      
      {selectedComponents.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Selected Components ({selectedComponents.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(compId => {
              const component = availableComponents.find(c => c.id === compId) || { id: compId, name: compId, formula: "" };
              return (
                <div 
                  key={compId}
                  className="flex items-center bg-blue-50 text-flow-blue rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm font-medium mr-1">{component.name}</span>
                  {component.formula && (
                    <span className="text-xs text-flow-blue/70">({component.formula})</span>
                  )}
                  <button 
                    className="ml-2 text-flow-blue/70 hover:text-flow-blue"
                    onClick={() => handleComponentClick(compId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium mb-2">Available Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {filteredComponents.map(component => (
            <div
              key={component.id}
              className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                selectedComponents.includes(component.id)
                  ? "border-flow-blue bg-blue-50 text-flow-blue"
                  : "border-gray-200 hover:border-flow-blue/50 hover:bg-blue-50/30"
              }`}
              onClick={() => handleComponentClick(component.id)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-1">
                  <div className="font-medium">{component.name}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1 max-w-[200px]">
                          <div><strong>Formula:</strong> {component.formula}</div>
                          <div><strong>MW:</strong> {component.mw} g/mol</div>
                          <div><strong>CAS:</strong> {component.cas}</div>
                          <div><strong>Phase:</strong> {component.phase}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm text-gray-500">{component.formula}</div>
              </div>
              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                {selectedComponents.includes(component.id) && <Check className="h-3 w-3 text-flow-blue" />}
              </div>
            </div>
          ))}
          
          {filteredComponents.length === 0 && (
            <div className="col-span-2 p-4 text-center text-gray-500">
              No components found matching "{searchQuery}". Try a different search term or add a custom component.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector;

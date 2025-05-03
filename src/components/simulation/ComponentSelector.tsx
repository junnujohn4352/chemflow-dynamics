
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Plus, Search } from 'lucide-react';

interface ComponentSelectorProps {
  selectedComponents: string[];
  setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ selectedComponents, setSelectedComponents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const componentCategories = [
    {
      name: 'Hydrocarbons - Alkanes',
      components: [
        'Methane', 'Ethane', 'Propane', 'Butane', 'Pentane', 'Hexane', 'Heptane', 'Octane', 'Nonane', 'Decane',
        'Undecane', 'Dodecane', 'Tridecane', 'Tetradecane', 'Pentadecane', 'Hexadecane', 'Heptadecane', 'Octadecane', 'Nonadecane', 'Eicosane',
        'Isopentane', 'Neopentane', 'Isohexane', '2-Methylpentane', '3-Methylpentane', '2,2-Dimethylbutane', '2,3-Dimethylbutane',
        'Cyclopropane', 'Cyclobutane', 'Cyclopentane', 'Cyclohexane', 'Cycloheptane', 'Cyclooctane'
      ]
    },
    {
      name: 'Hydrocarbons - Alkenes',
      components: [
        'Ethylene', 'Propylene', 'Butene', '1-Pentene', '1-Hexene', '1-Heptene', '1-Octene', 'Isobutene',
        'cis-2-Butene', 'trans-2-Butene', 'cis-2-Pentene', 'trans-2-Pentene', 'Cyclopentene', 'Cyclohexene',
        'Propadiene', '1,3-Butadiene', 'Isoprene', '1,3-Pentadiene'
      ]
    },
    {
      name: 'Hydrocarbons - Alkynes',
      components: [
        'Acetylene', 'Propyne', '1-Butyne', '2-Butyne', '1-Pentyne', '1-Hexyne', '1-Heptyne', '1-Octyne'
      ]
    },
    {
      name: 'Aromatics',
      components: [
        'Benzene', 'Toluene', 'Ethylbenzene', 'o-Xylene', 'm-Xylene', 'p-Xylene', 'Styrene', 'Cumene',
        'Naphthalene', 'Anthracene', 'Phenanthrene', 'Biphenyl', 'Mesitylene', 'n-Propylbenzene',
        'Isopropylbenzene', 'n-Butylbenzene', 'sec-Butylbenzene', 'tert-Butylbenzene',
        'Indene', 'Indane', 'Tetralin', 'Benzyl alcohol'
      ]
    },
    {
      name: 'Alcohols',
      components: [
        'Methanol', 'Ethanol', '1-Propanol', '2-Propanol', '1-Butanol', '2-Butanol', 'tert-Butanol', 'Isobutanol',
        '1-Pentanol', '2-Pentanol', '3-Pentanol', 'Neopentyl alcohol', 'Isopentanol', '1-Hexanol', 'Cyclohexanol',
        '1-Heptanol', '1-Octanol', '1-Nonanol', '1-Decanol', 'Benzyl alcohol', '2-Phenylethanol',
        'Ethylene glycol', 'Propylene glycol', '1,3-Propanediol', '1,4-Butanediol', '1,5-Pentanediol', 'Glycerol',
        'Erythritol', 'Xylitol', 'Sorbitol', 'Mannitol'
      ]
    },
    {
      name: 'Ethers',
      components: [
        'Dimethyl ether', 'Diethyl ether', 'Methyl tert-butyl ether (MTBE)', 'Ethyl tert-butyl ether (ETBE)',
        'Tetrahydrofuran (THF)', '1,4-Dioxane', 'Diisopropyl ether', 'Anisole', 'Phenetole', 
        'Diphenyl ether', 'Dibenzyl ether', '2-Methoxyethanol', 'Diethylene glycol', 'Triethylene glycol',
        'Polyethylene glycol'
      ]
    },
    {
      name: 'Aldehydes',
      components: [
        'Formaldehyde', 'Acetaldehyde', 'Propionaldehyde', 'Butyraldehyde', 'Isobutyraldehyde', 'Valeraldehyde',
        'Benzaldehyde', 'Cinnamaldehyde', 'Acrolein', 'Crotonaldehyde', 'Glutaraldehyde', 'Glyoxal',
        'Phenylacetaldehyde', '2-Ethylhexanal', 'Furfural'
      ]
    },
    {
      name: 'Ketones',
      components: [
        'Acetone', 'Methyl ethyl ketone (MEK)', 'Methyl isobutyl ketone (MIBK)', '2-Pentanone', '3-Pentanone',
        'Cyclohexanone', 'Acetophenone', 'Benzophenone', 'Isophorone', 'Camphor', 'Menthone',
        'Diacetyl', 'Acetylacetone', '2,3-Butanedione', '2,4-Pentanedione'
      ]
    },
    {
      name: 'Acids',
      components: [
        'Formic acid', 'Acetic acid', 'Propionic acid', 'Butyric acid', 'Valeric acid', 'Caproic acid',
        'Enanthic acid', 'Caprylic acid', 'Pelargonic acid', 'Capric acid', 'Lauric acid', 'Myristic acid',
        'Palmitic acid', 'Stearic acid', 'Oleic acid', 'Linoleic acid', 'Linolenic acid',
        'Benzoic acid', 'Phthalic acid', 'Terephthalic acid', 'Adipic acid', 'Oxalic acid', 'Malonic acid',
        'Succinic acid', 'Glutaric acid', 'Maleic acid', 'Fumaric acid', 'Lactic acid', 'Citric acid',
        'Tartaric acid', 'Malic acid', 'Glycolic acid'
      ]
    },
    {
      name: 'Esters',
      components: [
        'Methyl formate', 'Ethyl formate', 'Methyl acetate', 'Ethyl acetate', 'Propyl acetate', 'Isopropyl acetate',
        'Butyl acetate', 'Isobutyl acetate', 'Amyl acetate', 'Isoamyl acetate', 'Methyl propionate', 'Ethyl propionate',
        'Methyl butyrate', 'Ethyl butyrate', 'Methyl benzoate', 'Ethyl benzoate', 
        'Dimethyl phthalate', 'Diethyl phthalate', 'Dioctyl phthalate', 'Methyl salicylate',
        'Triacetin', 'Tributyrin', 'Ethylene carbonate', 'Propylene carbonate'
      ]
    },
    {
      name: 'Amines',
      components: [
        'Methylamine', 'Ethylamine', 'Propylamine', 'Butylamine', 'Pentylamine', 'Hexylamine', 'Octylamine',
        'Dimethylamine', 'Diethylamine', 'Dipropylamine', 'Dibutylamine', 
        'Trimethylamine', 'Triethylamine', 'Tripropylamine', 'Tributylamine', 'Aniline', 'N-Methylaniline', 
        'N,N-Dimethylaniline', 'Benzylamine', '2-Phenethylamine', 'Cyclohexylamine',
        'Ethylenediamine', 'Propylenediamine', 'Hexamethylenediamine', 'Ethanolamines', 'Diethanolamine', 'Triethanolamine'
      ]
    },
    {
      name: 'Amides',
      components: [
        'Formamide', 'Acetamide', 'Propionamide', 'Butyramide', 'Benzamide', 'N-Methylformamide',
        'N,N-Dimethylformamide (DMF)', 'N,N-Dimethylacetamide (DMAc)', 'N-Methylpyrrolidone (NMP)', 
        'Acrylamide', 'Urea', 'Thiourea', 'Biuret'
      ]
    },
    {
      name: 'Nitrogen Compounds',
      components: [
        'Nitrile', 'Acetonitrile', 'Propionitrile', 'Butyronitrile', 'Acrylonitrile', 'Benzonitrile',
        'Nitromethane', 'Nitroethane', '1-Nitropropane', '2-Nitropropane', 'Nitrobenzene', 'Pyridine',
        'Picoline', 'Lutidine', 'Quinoline', 'Isoquinoline', 'Pyrrole', 'Pyrrolidine',
        'Piperidine', 'Morpholine', 'Piperazine', 'Imidazole', 'Pyrazole', 'Indole', 'Purine'
      ]
    },
    {
      name: 'Sulphur Compounds',
      components: [
        'Hydrogen sulfide', 'Methanethiol', 'Ethanethiol', '1-Propanethiol', '2-Propanethiol', 'Butanethiol',
        'Dimethyl sulfide', 'Diethyl sulfide', 'Dimethyl disulfide', 'Thiophene', 'Tetrahydrothiophene',
        'Dimethyl sulfoxide (DMSO)', 'Sulfolane', 'Carbon disulfide', 'Carbonyl sulfide',
        'Thiourea', 'Cysteine', 'Methionine', 'Glutathione'
      ]
    },
    {
      name: 'Halogenated Compounds',
      components: [
        'Methyl chloride', 'Methylene chloride', 'Chloroform', 'Carbon tetrachloride', 'Methyl bromide',
        'Dibromomethane', 'Bromoform', 'Methyl iodide', 'Ethyl chloride', '1,2-Dichloroethane',
        'Trichloroethylene', 'Perchloroethylene', 'Vinyl chloride', 'Vinylidene chloride',
        '1,1,1-Trichloroethane', '1,1,2-Trichloroethane', 'Chlorobenzene', 'Bromobenzene',
        'o-Dichlorobenzene', 'p-Dichlorobenzene', 'Freon-11', 'Freon-12', 'Freon-22', 'Freon-113',
        'Tetrafluoroethane', 'Difluoromethane'
      ]
    },
    {
      name: 'Silicon Compounds',
      components: [
        'Silane', 'Disilane', 'Silicone oil', 'Tetramethylsilane', 'Tetraethylsilane', 'Phenyltrimethylsilane',
        'Dimethyldichlorosilane', 'Trimethylchlorosilane', 'Tetramethoxysilane', 'Tetraethoxysilane',
        'Hexamethyldisiloxane', 'Octamethylcyclotetrasiloxane', 'Decamethylcyclopentasiloxane'
      ]
    },
    {
      name: 'Phosphorus Compounds',
      components: [
        'Phosphine', 'Triphenylphosphine', 'Tributylphosphine', 'Trimethylphosphate', 'Triethylphosphate',
        'Tributylphosphate', 'Tricresyl phosphate', 'Triphenyl phosphate', 'Phosphoric acid', 'Phosphorous acid'
      ]
    },
    {
      name: 'Inorganic Gases',
      components: [
        'Hydrogen', 'Nitrogen', 'Oxygen', 'Carbon dioxide', 'Carbon monoxide', 'Ammonia', 'Water', 'Steam',
        'Helium', 'Neon', 'Argon', 'Krypton', 'Xenon', 'Radon', 'Sulfur dioxide', 'Sulfur trioxide',
        'Nitrogen oxide', 'Nitrogen dioxide', 'Dinitrogen tetroxide', 'Nitrous oxide', 'Ozone',
        'Chlorine', 'Bromine', 'Fluorine', 'Hydrogen chloride', 'Hydrogen bromide', 'Hydrogen fluoride'
      ]
    },
    {
      name: 'Inorganic Compounds',
      components: [
        'Sodium hydroxide', 'Potassium hydroxide', 'Calcium hydroxide', 'Sodium carbonate', 'Potassium carbonate',
        'Sodium bicarbonate', 'Potassium bicarbonate', 'Sodium chloride', 'Potassium chloride', 'Calcium chloride',
        'Magnesium chloride', 'Ammonium chloride', 'Sodium sulfate', 'Potassium sulfate', 'Aluminum sulfate',
        'Ferric chloride', 'Ferrous sulfate', 'Copper sulfate', 'Zinc sulfate', 'Sodium phosphate',
        'Potassium phosphate', 'Calcium phosphate', 'Boric acid', 'Hydrochloric acid', 'Sulfuric acid',
        'Nitric acid', 'Phosphoric acid', 'Hydrogen peroxide'
      ]
    },
    {
      name: 'Polymers',
      components: [
        'Polyethylene', 'Polypropylene', 'Polystyrene', 'Polyvinyl chloride', 'Polytetrafluoroethylene',
        'Polymethyl methacrylate', 'Polyethylene terephthalate', 'Polybutylene terephthalate',
        'Polycarbonate', 'Polyamide 6', 'Polyamide 66', 'Polyurethane', 'Polyoxymethylene',
        'Polyether ether ketone', 'Polyetherimide', 'Polysulfone', 'Polyphenylene sulfide',
        'Ethylene-vinyl acetate', 'Acrylonitrile butadiene styrene', 'Styrene-butadiene rubber',
        'Natural rubber', 'Butadiene rubber', 'Nitrile rubber', 'Silicone rubber'
      ]
    },
    {
      name: 'Biological Compounds',
      components: [
        'Glucose', 'Fructose', 'Sucrose', 'Lactose', 'Maltose', 'Starch', 'Cellulose', 'Glycogen',
        'Alanine', 'Arginine', 'Asparagine', 'Aspartic acid', 'Cysteine', 'Glutamine', 'Glutamic acid',
        'Glycine', 'Histidine', 'Isoleucine', 'Leucine', 'Lysine', 'Methionine', 'Phenylalanine',
        'Proline', 'Serine', 'Threonine', 'Tryptophan', 'Tyrosine', 'Valine',
        'Adenine', 'Guanine', 'Cytosine', 'Thymine', 'Uracil',
        'Cholesterol', 'Testosterone', 'Estradiol', 'Progesterone', 'Cortisol'
      ]
    },
    {
      name: 'Pharmaceutical Intermediates',
      components: [
        'Acetylsalicylic acid', 'Paracetamol', 'Ibuprofen', 'Naproxen', 'Diclofenac', 'Ketoprofen',
        'Metformin', 'Atorvastatin', 'Simvastatin', 'Omeprazole', 'Lansoprazole', 'Amoxicillin',
        'Cephalexin', 'Ciprofloxacin', 'Azithromycin', 'Fluoxetine', 'Sertraline', 'Alprazolam',
        'Diazepam', 'Lorazepam', 'Morphine', 'Codeine', 'Tramadol', 'Fentanyl', 'Methadone'
      ]
    },
    {
      name: 'Custom',
      components: []
    }
  ];

  // Get all component names for searching
  const allComponents = componentCategories.flatMap(category => category.components);

  // Filter components based on search term
  const filteredComponents = allComponents.filter(component =>
    component.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle component selection/deselection
  const toggleComponent = (component: string) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter(c => c !== component));
    } else {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  // Handle adding custom component
  const handleAddCustom = () => {
    if (customName.trim() && !allComponents.includes(customName.trim())) {
      // Add to selected components
      setSelectedComponents([...selectedComponents, customName.trim()]);
      // Reset input
      setCustomName('');
      setShowAddCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {componentCategories.map(category => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg p-2">
        <div className="mb-2 font-medium">Selected Components ({selectedComponents.length})</div>
        {selectedComponents.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-sm">No components selected</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedComponents.map(component => (
              <Badge
                key={component}
                variant="secondary"
                className="flex gap-1 items-center pl-3 pr-1.5 py-1.5"
              >
                {component}
                <button 
                  onClick={() => toggleComponent(component)}
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">Search Results</h3>
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {filteredComponents.map(component => (
                <Button
                  key={component}
                  variant="outline"
                  size="sm"
                  className={`justify-start ${
                    selectedComponents.includes(component) ? "border-flow-blue text-flow-blue" : ""
                  }`}
                  onClick={() => toggleComponent(component)}
                >
                  {selectedComponents.includes(component) && <Check className="h-3 w-3 mr-2" />}
                  {component}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No components found</div>
          )}
        </div>
      )}

      {activeCategory && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">{activeCategory} Components</h3>
          {activeCategory === 'Custom' ? (
            <div className="space-y-3">
              {!showAddCustom ? (
                <Button 
                  onClick={() => setShowAddCustom(true)} 
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Component
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter component name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleAddCustom} disabled={!customName.trim()}>
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddCustom(false);
                    setCustomName('');
                  }}>
                    Cancel
                  </Button>
                </div>
              )}
              
              {selectedComponents.filter(comp => !allComponents.includes(comp)).length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Your Custom Components:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponents
                      .filter(comp => !allComponents.includes(comp))
                      .map(component => (
                        <Badge
                          key={component}
                          variant="secondary"
                          className="flex gap-1 items-center pl-3 pr-1.5 py-1.5"
                        >
                          {component}
                          <button 
                            onClick={() => toggleComponent(component)}
                            className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {componentCategories
                .find(cat => cat.name === activeCategory)
                ?.components.map(component => (
                  <Button
                    key={component}
                    variant="outline"
                    size="sm"
                    className={`justify-start ${
                      selectedComponents.includes(component) ? "border-flow-blue text-flow-blue" : ""
                    }`}
                    onClick={() => toggleComponent(component)}
                  >
                    {selectedComponents.includes(component) && <Check className="h-3 w-3 mr-2" />}
                    {component}
                  </Button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;

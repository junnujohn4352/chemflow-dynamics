
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';

interface EquipmentPropertiesProps {
  equipment: Equipment;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onDelete: () => void;
  components: string[];
}

export const EquipmentProperties: React.FC<EquipmentPropertiesProps> = ({
  equipment,
  onUpdate,
  onDelete,
  components
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="operating">Operating</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label>Equipment Name</Label>
            <Input
              value={equipment.name}
              onChange={(e) => onUpdate(equipment.id, { name: e.target.value })}
            />
          </div>
          <div>
            <Label>Equipment Type</Label>
            <Input value={equipment.type} disabled />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              className="w-full p-2 border rounded"
              value={equipment.description || ''}
              onChange={(e) => onUpdate(equipment.id, { description: e.target.value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="operating" className="space-y-4">
          {renderOperatingParameters()}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {renderAdvancedParameters()}
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove Equipment
        </Button>
      </div>
    </div>
  );

  function renderOperatingParameters() {
    switch (equipment.type) {
      case 'heat-exchanger':
        return (
          <>
            <div>
              <Label>Heat Duty (kW)</Label>
              <Input
                type="number"
                value={equipment.settings?.heatDuty || 0}
                onChange={(e) => updateSettings('heatDuty', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Hot Side Inlet Temperature (°C)</Label>
              <Input
                type="number"
                value={equipment.settings?.hotInletTemp || 0}
                onChange={(e) => updateSettings('hotInletTemp', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Cold Side Inlet Temperature (°C)</Label>
              <Input
                type="number"
                value={equipment.settings?.coldInletTemp || 0}
                onChange={(e) => updateSettings('coldInletTemp', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      // Add more cases for different equipment types
      default:
        return <p>No specific operating parameters for this equipment type.</p>;
    }
  }

  function renderAdvancedParameters() {
    switch (equipment.type) {
      case 'heat-exchanger':
        return (
          <>
            <div>
              <Label>Overall Heat Transfer Coefficient (W/m²·K)</Label>
              <Input
                type="number"
                value={equipment.settings?.heatTransferCoeff || 0}
                onChange={(e) => updateSettings('heatTransferCoeff', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Fouling Factor</Label>
              <Input
                type="number"
                value={equipment.settings?.foulingFactor || 0}
                onChange={(e) => updateSettings('foulingFactor', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      // Add more cases for different equipment types
      default:
        return <p>No advanced parameters for this equipment type.</p>;
    }
  }

  function updateSettings(key: string, value: any) {
    onUpdate(equipment.id, {
      settings: {
        ...equipment.settings,
        [key]: value
      }
    });
  }
};

export default EquipmentProperties;

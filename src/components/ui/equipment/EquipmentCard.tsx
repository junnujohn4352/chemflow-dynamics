
import React from 'react';
import { Card } from '@/components/ui/card';
import { EquipmentType, getEquipmentIcon } from './EquipmentIcons';
import { Edit, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentMetric {
  key: string;
  value: string | number;
}

interface EquipmentCardProps {
  type: EquipmentType;
  title: string;
  onEdit?: () => void;
  metrics?: EquipmentMetric[];
  status?: 'ready' | 'warning' | 'error' | 'running';
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, type: EquipmentType, title: string) => void;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  type,
  title,
  onEdit,
  metrics,
  status = 'ready',
  className = '',
  draggable = true,
  onDragStart,
  size = 'md',
  selected = false,
  onClick,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return <Check className="h-3.5 w-3.5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />;
      case 'running':
        return (
          <svg className="animate-spin h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable && onDragStart) {
      onDragStart(e, type, title);
    }
  };

  const sizeClasses = {
    sm: 'p-2 min-h-[80px]',
    md: 'p-3 min-h-[120px]',
    lg: 'p-4 min-h-[150px]',
  };

  return (
    <Card
      className={`relative flex flex-col ${sizeClasses[size]} ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      } ${
        draggable ? 'cursor-move' : 'cursor-pointer'
      } transition-all hover:shadow-md ${className}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-600 dark:text-gray-300 flex items-center">
          <div className="mr-1.5">
            {getEquipmentIcon(type)}
          </div>
          <div className="text-xs font-medium">{title}</div>
        </div>
        
        <div className="flex items-center space-x-1">
          {status && (
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          )}
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      
      {metrics && metrics.length > 0 && (
        <div className="mt-auto pt-2 space-y-1 text-xs">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gray-500">{metric.key}:</span>
              <span className="font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default EquipmentCard;

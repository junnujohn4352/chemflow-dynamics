
import React from 'react';
import { Card } from '@/components/ui/card';
import { EquipmentType, getEquipmentIcon } from './EquipmentIcons';
import { Edit, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EquipmentConnections from './EquipmentConnections';

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
  showConnections?: boolean;
  onConnectionPointClick?: (point: string) => void;
  activeConnectionPoints?: string[];
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
  showConnections = true,
  onConnectionPointClick,
  activeConnectionPoints = [],
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
      
      // Set a ghost image for drag
      const ghostEl = document.createElement('div');
      ghostEl.style.width = '100px'; 
      ghostEl.style.height = '60px';
      ghostEl.style.backgroundColor = 'rgba(0,0,0,0.1)';
      ghostEl.style.borderRadius = '8px';
      document.body.appendChild(ghostEl);
      e.dataTransfer.setDragImage(ghostEl, 50, 30);
      
      setTimeout(() => {
        document.body.removeChild(ghostEl);
      }, 0);
    }
  };

  const sizeClasses = {
    sm: 'p-2 min-h-[80px] w-[100px]',
    md: 'p-3 min-h-[120px] w-[140px]',
    lg: 'p-4 min-h-[150px] w-[180px]',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if we're clicking on a connection point or the edit button
    const target = e.target as HTMLElement;
    if (
      target.dataset.connection || 
      target.closest('[data-connection]') ||
      target.closest('button')
    ) {
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  const handleConnectionPointClick = (point: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConnectionPointClick) {
      onConnectionPointClick(point);
    }
  };
  
  // Get equipment-specific gradient color
  const getEquipmentGradient = () => {
    if (type.includes('reactor')) return 'from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40';
    if (type.includes('column')) return 'from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40';
    if (type.includes('heat-exchanger')) return 'from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40';
    if (type.includes('vessel')) return 'from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-800/40';
    if (type.includes('pump')) return 'from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40';
    if (type.includes('compressor')) return 'from-cyan-50 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-800/40';
    if (type.includes('valve')) return 'from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40';
    if (type.includes('utility')) return 'from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40';
    return 'from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/40';
  };

  return (
    <Card
      className={`relative flex flex-col ${sizeClasses[size]} bg-gradient-to-br ${getEquipmentGradient()} ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      } ${
        draggable ? 'cursor-move' : ''
      } transition-all hover:shadow-md ${className} border border-gray-200 dark:border-gray-700`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-600 dark:text-gray-300 flex items-center">
          <div className="mr-1.5 text-blue-600 dark:text-blue-400">
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

      {/* Connection Points */}
      {showConnections && (
        <EquipmentConnections 
          type={type} 
          onClick={handleConnectionPointClick}
          activePoints={activeConnectionPoints}
        />
      )}
    </Card>
  );
};

export default EquipmentCard;


import React, { useState } from 'react';
import { FormField } from '../../types/form-builder';
import { cn } from '../../lib/utils';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { 
  Copy, 
  Trash2, 
  Settings, 
  ChevronUp, 
  ChevronDown,
  MoveVertical
} from 'lucide-react';
import { getFieldIcon } from '../../utils/form-utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface BaseFieldProps {
  field: FormField;
  children: React.ReactNode;
  className?: string;
}

const BaseField: React.FC<BaseFieldProps> = ({ field, children, className }) => {
  const { state, setActiveField, removeField } = useFormBuilder();
  const isActive = state.activeFieldId === field.id;
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (isActive) return;
    setActiveField(field.id);
  };

  const FieldIcon = React.lazy(() => 
    import('lucide-react').then(mod => ({ 
      default: mod[getFieldIcon(field.type).charAt(0).toUpperCase() + getFieldIcon(field.type).slice(1)]
    }))
  );

  return (
    <div
      className={cn(
        'field-card mb-4 animate-fade-in relative',
        isActive && 'ring-2 ring-primary/30',
        field.isSection && 'section-container',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="field-header">
        <div className="flex items-center gap-2">
          <React.Suspense fallback={<div className="w-4 h-4" />}>
            <FieldIcon className="w-4 h-4 text-primary" />
          </React.Suspense>
          <span className="field-type-badge">{field.type}</span>
          {field.conditional && (
            <span className="conditional-marker" title="This field has conditional display logic">C</span>
          )}
        </div>
        
        {/* Field actions */}
        <div className={cn(
          "flex gap-1 transition-opacity duration-150",
          (!isActive && !isHovered) ? "opacity-0" : "opacity-100"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="field-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveField(field.id);
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Field</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="field-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(field.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove Field</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Drag Handle - visible only when hovering */}
      <div className={cn(
        "absolute -left-3 top-1/2 -translate-y-1/2 transition-opacity duration-150 cursor-move",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <MoveVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="mt-2">
        <div className="text-sm font-medium mb-1">{field.label}</div>
        {children}
      </div>
    </div>
  );
};

export default BaseField;

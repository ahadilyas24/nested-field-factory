
import React from 'react';
import { FormField } from '../../types/form-builder';
import BaseField from './BaseField';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { organizeFieldsHierarchy } from '../../utils/form-utils';
import FieldRenderer from './FieldRenderer';
import AddFieldButton from './AddFieldButton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionProps {
  field: FormField;
}

const Section: React.FC<SectionProps> = ({ field }) => {
  const { state } = useFormBuilder();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // Get child fields for this section
  const childFields = state.fields.filter(f => f.parentId === field.id);
  
  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <BaseField field={field} className="bg-card/30">
      <div className="flex items-center mb-4">
        <button 
          className="mr-2 p-1 rounded-md hover:bg-accent"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        <h3 className="text-lg font-medium">{field.label}</h3>
      </div>
      
      <div className={cn(
        "pl-4 border-l-2 border-accent transition-all duration-200",
        isCollapsed ? "h-0 overflow-hidden opacity-0" : "opacity-100"
      )}>
        {childFields.map(childField => (
          <FieldRenderer key={childField.id} field={childField} />
        ))}
        
        <AddFieldButton parentId={field.id} variant="section" />
      </div>
    </BaseField>
  );
};

export default Section;

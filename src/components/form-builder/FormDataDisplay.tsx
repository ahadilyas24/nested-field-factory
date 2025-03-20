
import React from 'react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { FormField } from '../../types/form-builder';
import { getFieldIcon } from '../../utils/form-utils';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FormDataDisplayProps {
  className?: string;
}

const FormDataDisplay: React.FC<FormDataDisplayProps> = ({ className }) => {
  const { state } = useFormBuilder();
  const { fields, formData } = state;
  
  // Organize fields by parent
  const fieldsByParent: Record<string, FormField[]> = {};
  
  fields.forEach(field => {
    const parentId = field.parentId || 'root';
    if (!fieldsByParent[parentId]) {
      fieldsByParent[parentId] = [];
    }
    fieldsByParent[parentId].push(field);
  });
  
  // Recursive function to render fields with correct hierarchy
  const renderFieldsRecursive = (parentId: string = 'root', level: number = 0) => {
    const fieldsToRender = fieldsByParent[parentId] || [];
    
    return fieldsToRender.map(field => {
      // Don't render fields that aren't supposed to be visible
      if (field.conditional) {
        const conditionalField = fields.find(f => f.id === field.conditional?.fieldId);
        if (!conditionalField) return null;
        
        const conditionMet = evaluateCondition(field.conditional, formData);
        if (!conditionMet) return null;
      }
      
      const hasValue = formData[field.id] !== undefined;
      const value = formData[field.id];
      
      return (
        <div 
          key={field.id} 
          className={cn(
            "animate-fade-in",
            level > 0 && "pl-4 ml-2 border-l border-border"
          )}
        >
          {field.isSection ? (
            <div className="mb-2">
              <h4 className="text-base font-medium text-primary">{field.label}</h4>
              <div className="mt-2 space-y-2">
                {renderFieldsRecursive(field.id, level + 1)}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{field.label}</span>
                <span className="text-muted-foreground">{field.type}</span>
              </div>
              <div className="bg-accent/50 p-2 rounded text-sm">
                {hasValue ? (
                  formatValue(field, value)
                ) : (
                  <span className="text-muted-foreground italic">No value</span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    });
  };
  
  // Format different value types for display
  const formatValue = (field: FormField, value: any) => {
    if (value === undefined || value === null) {
      return <span className="text-muted-foreground italic">No value</span>;
    }
    
    switch (field.type) {
      case 'checkbox':
        return value ? 'Yes' : 'No';
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : value;
      case 'file':
        return value.name || 'File uploaded';
      case 'dropdown':
      case 'radio':
        const option = field.options?.find(opt => opt.value === value);
        return option ? option.label : value;
      case 'phone':
        return `${value.code} ${value.number}`;
      default:
        return String(value);
    }
  };
  
  const evaluateCondition = (
    condition: FormField['conditional'],
    formValues: Record<string, any>
  ): boolean => {
    if (!condition) return true;
  
    const { fieldId, operator, value } = condition;
    const fieldValue = formValues[fieldId];
  
    if (fieldValue === undefined) return false;
  
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value);
      case 'notContains':
        return typeof fieldValue === 'string' && !fieldValue.includes(value);
      case 'greater':
        return Number(fieldValue) > Number(value);
      case 'less':
        return Number(fieldValue) < Number(value);
      default:
        return true;
    }
  };

  const hasData = Object.keys(formData).length > 0;

  return (
    <Card className={cn("p-4", className)}>
      <h3 className="text-lg font-medium mb-3">Form Data</h3>
      <Separator className="mb-4" />
      
      {hasData ? (
        <div className="space-y-2">
          {renderFieldsRecursive()}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No form data yet. Start filling out the form to see the data here.</p>
        </div>
      )}
    </Card>
  );
};

export default FormDataDisplay;

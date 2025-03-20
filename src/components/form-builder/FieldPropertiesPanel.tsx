
import React, { useState } from 'react';
import { FormField, ValidationRule, ConditionalRule, FieldOption } from '../../types/form-builder';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { PlusCircle, X, Info, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getFieldIdToLabelMap } from '../../utils/form-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FieldPropertiesPanelProps {
  className?: string;
}

const FieldPropertiesPanel: React.FC<FieldPropertiesPanelProps> = ({ className }) => {
  const { state, updateField } = useFormBuilder();
  const activeFieldId = state.activeFieldId;
  const activeField = state.fields.find(f => f.id === activeFieldId);
  
  if (!activeField) {
    return (
      <div className={cn("p-4 bg-card border rounded-lg", className)}>
        <p className="text-muted-foreground text-center py-12">
          Select a field to edit its properties
        </p>
      </div>
    );
  }
  
  const [field, setField] = useState<FormField>(activeField);

  // Make sure field state is updated when active field changes
  React.useEffect(() => {
    if (activeField) {
      setField(activeField);
    }
  }, [activeField]);

  const handleFieldChange = <K extends keyof FormField>(key: K, value: FormField[K]) => {
    setField(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    updateField(field);
  };

  // Options management (for dropdown, radio, etc.)
  const addOption = () => {
    const newOptions = [...(field.options || []), { label: 'New Option', value: `option-${Date.now()}` }];
    handleFieldChange('options', newOptions);
  };

  const updateOption = (index: number, key: keyof FieldOption, value: string) => {
    if (!field.options) return;
    
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleFieldChange('options', newOptions);
  };

  const removeOption = (index: number) => {
    if (!field.options) return;
    
    const newOptions = [...field.options];
    newOptions.splice(index, 1);
    handleFieldChange('options', newOptions);
  };

  // Validation rules management
  const addValidation = () => {
    const newRule: ValidationRule = { type: 'required', message: 'This field is required' };
    const validations = [...(field.validations || []), newRule];
    handleFieldChange('validations', validations);
  };

  const updateValidation = (index: number, key: keyof ValidationRule, value: any) => {
    if (!field.validations) return;
    
    const newValidations = [...field.validations];
    newValidations[index] = { ...newValidations[index], [key]: value };
    handleFieldChange('validations', newValidations);
  };

  const removeValidation = (index: number) => {
    if (!field.validations) return;
    
    const newValidations = [...field.validations];
    newValidations.splice(index, 1);
    handleFieldChange('validations', newValidations);
  };

  // Conditional logic
  const toggleConditional = (enabled: boolean) => {
    if (enabled && !field.conditional) {
      const otherFields = state.fields.filter(f => f.id !== field.id);
      const firstField = otherFields[0];
      
      if (firstField) {
        const newCondition: ConditionalRule = {
          fieldId: firstField.id,
          operator: 'equals',
          value: '',
        };
        handleFieldChange('conditional', newCondition);
      }
    } else if (!enabled) {
      handleFieldChange('conditional', undefined);
    }
  };

  const updateConditional = <K extends keyof ConditionalRule>(key: K, value: ConditionalRule[K]) => {
    if (!field.conditional) return;
    
    const newCondition = { ...field.conditional, [key]: value };
    handleFieldChange('conditional', newCondition);
  };

  // Get all other fields for conditional logic
  const otherFields = state.fields.filter(f => f.id !== field.id);
  const fieldIdToLabelMap = getFieldIdToLabelMap(state.fields);

  return (
    <div className={cn("bg-card border rounded-lg overflow-hidden", className)}>
      <div className="p-4 bg-primary/5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-medium">Field Properties</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {field.isSection ? 'Section' : field.type}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="basic" className="p-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
          <TabsTrigger value="options" className="flex-1" disabled={!['dropdown', 'radio'].includes(field.type)}>
            Options
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex-1">Validation</TabsTrigger>
          <TabsTrigger value="conditional" className="flex-1">Conditional</TabsTrigger>
        </TabsList>
        
        {/* Basic Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={field.label}
              onChange={(e) => handleFieldChange('label', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field-name">Name (ID)</Label>
            <Input
              id="field-name"
              value={field.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={field.placeholder || ''}
              onChange={(e) => handleFieldChange('placeholder', e.target.value)}
              disabled={['checkbox', 'radio', 'file'].includes(field.type)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-required"
              checked={field.required}
              onCheckedChange={(checked) => handleFieldChange('required', !!checked)}
            />
            <Label htmlFor="field-required" className="cursor-pointer">Required field</Label>
          </div>
        </TabsContent>
        
        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option.label}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                placeholder="Option label"
              />
              <Input
                value={option.value}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                placeholder="Option value"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={addOption}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </TabsContent>
        
        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-4">
          {field.validations?.map((validation, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <Label htmlFor={`validation-type-${index}`}>Validation Type</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-6 w-6"
                  onClick={() => removeValidation(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <Select
                value={validation.type}
                onValueChange={(value) => updateValidation(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="minLength">Min Length</SelectItem>
                  <SelectItem value="maxLength">Max Length</SelectItem>
                  <SelectItem value="pattern">Pattern (Regex)</SelectItem>
                </SelectContent>
              </Select>
              
              {['minLength', 'maxLength', 'pattern'].includes(validation.type) && (
                <div className="space-y-2">
                  <Label htmlFor={`validation-value-${index}`}>
                    {validation.type === 'pattern' ? 'Regex Pattern' : 'Length'}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 inline cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {validation.type === 'pattern' 
                          ? 'Regular expression to validate against'
                          : 'Number of characters required'}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id={`validation-value-${index}`}
                    value={validation.value || ''}
                    onChange={(e) => updateValidation(index, 'value', e.target.value)}
                    placeholder={validation.type === 'pattern' ? '^[A-Za-z]+$' : '0'}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor={`validation-message-${index}`}>Error Message</Label>
                <Input
                  id={`validation-message-${index}`}
                  value={validation.message}
                  onChange={(e) => updateValidation(index, 'message', e.target.value)}
                  placeholder="Error message to display"
                />
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={addValidation}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Validation Rule
          </Button>
        </TabsContent>
        
        {/* Conditional Tab */}
        <TabsContent value="conditional" className="space-y-4">
          <div className="flex items-center space-x-3">
            <Label htmlFor="enable-conditional">Enable conditional logic</Label>
            <Switch
              id="enable-conditional"
              checked={!!field.conditional}
              onCheckedChange={toggleConditional}
            />
          </div>
          
          {field.conditional && (
            <div className="space-y-4 p-3 border rounded-md animate-fade-in">
              <p className="text-sm text-muted-foreground">
                This field will only be shown when the following condition is met:
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="condition-field">When field</Label>
                <Select
                  value={field.conditional.fieldId}
                  onValueChange={(value) => updateConditional('fieldId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherFields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition-operator">Operator</Label>
                <Select
                  value={field.conditional.operator}
                  onValueChange={(value: any) => updateConditional('operator', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="notEquals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="notContains">Doesn't Contain</SelectItem>
                    <SelectItem value="greater">Greater Than</SelectItem>
                    <SelectItem value="less">Less Than</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition-value">Value</Label>
                <Input
                  id="condition-value"
                  value={field.conditional.value}
                  onChange={(e) => updateConditional('value', e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t bg-muted/30">
        <Button className="w-full" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default FieldPropertiesPanel;

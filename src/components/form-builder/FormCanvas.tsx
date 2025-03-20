
import React from 'react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import FieldRenderer from './FieldRenderer';
import AddFieldButton from './AddFieldButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { organizeFieldsHierarchy } from '../../utils/form-utils';
import { toast } from 'sonner';

interface FormCanvasProps {
  className?: string;
}

const FormCanvas: React.FC<FormCanvasProps> = ({ className }) => {
  const { state, validateAllFields, setActiveField } = useFormBuilder();
  const rootFields = state.fields.filter(field => !field.parentId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateAllFields();
    
    if (isValid) {
      toast.success('Form submitted successfully!', {
        description: 'All fields are valid.'
      });
    } else {
      toast.error('Form submission failed', {
        description: 'Please fix the validation errors.'
      });
    }
  };
  
  // Clear active selection when clicking on the canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only clear if clicking directly on the canvas, not on a field
    if (e.currentTarget === e.target) {
      setActiveField(null);
    }
  };
  
  const isEmpty = rootFields.length === 0;
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Dynamic Form Builder</CardTitle>
        <CardDescription>
          Create custom forms with various field types, validations, and conditional logic
        </CardDescription>
      </CardHeader>
      
      <CardContent onClick={handleCanvasClick}>
        {isEmpty ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Your form is empty. Start by adding fields below.
            </p>
            <AddFieldButton />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {rootFields.map(field => (
              <FieldRenderer key={field.id} field={field} />
            ))}
            
            <AddFieldButton />
            
            <div className="mt-8 pt-6 border-t">
              <Button 
                type="submit"
                className="w-full sm:w-auto"
                size="lg"
              >
                Submit Form
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FormCanvas;

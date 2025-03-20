
import React, { useState } from 'react';
import { useFormBuilder } from '../../contexts/FormBuilderContext';
import { FormField } from '../../types/form-builder';
import { cn } from '@/lib/utils';

interface DraggableFieldProps {
  field: FormField;
  index: number;
  children: React.ReactNode;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, index, children }) => {
  const { reorderFields } = useFormBuilder();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: field.id, index }));
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    if (data.index !== index) {
      reorderFields(data.index, index);
    }
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "transition-opacity",
        isDragging && "opacity-50"
      )}
    >
      {children}
    </div>
  );
};

export { DraggableField };

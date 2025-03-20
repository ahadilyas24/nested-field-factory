
import React, { useState } from 'react';
import { FormField } from '../../../types/form-builder';
import BaseField from '../BaseField';
import { useFormBuilder } from '../../../contexts/FormBuilderContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';

interface FileFieldProps {
  field: FormField;
}

const FileField: React.FC<FileFieldProps> = ({ field }) => {
  const { state, updateFormData } = useFormBuilder();
  const [fileName, setFileName] = useState<string | null>(null);
  const error = state.errors[field.id];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      updateFormData(field.id, file);
    } else {
      setFileName(null);
      updateFormData(field.id, null);
    }
  };

  const clearFile = () => {
    setFileName(null);
    updateFormData(field.id, null);
  };

  return (
    <BaseField field={field}>
      <div className="space-y-2">
        {!fileName ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md p-6 transition-colors hover:border-primary/50">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag & drop files here, or click to browse
            </p>
            <Input
              id={field.id}
              type="file"
              className="hidden"
              onChange={handleChange}
            />
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => document.getElementById(field.id)?.click()}
            >
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border rounded-md bg-accent">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm truncate max-w-[200px]">{fileName}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {error && <div className="text-destructive text-sm mt-1 animate-slide-in-up">{error}</div>}
    </BaseField>
  );
};

export default FileField;


import React from 'react';
import FormBuilder from '../components/form-builder/FormBuilder';

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <header className="container mb-8 text-center">
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
          Dynamic Form Builder
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create interactive forms with drag-and-drop simplicity. Add text fields, dropdowns, 
          file uploads, and more with real-time validation and conditional logic.
        </p>
      </header>
      
      <main className="container">
        <FormBuilder />
      </main>
      
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Dynamic Form Builder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;


import React from 'react';

interface QuestionnaireFieldProps {
  label: string;
  description?: string;
  children: React.ReactElement;
}

export const QuestionnaireField: React.FC<QuestionnaireFieldProps> = ({ label, description, children }) => {
  // Fix: Cast `children.props` to `any` to access the `id` property.
  // The type of `children.props` is inferred as `unknown`, which prevents property access.
  const childId = (children.props as any).id || label.replace(/\s+/g, '-').toLowerCase();

  // Fix: Cast `children` to `React.ReactElement<any>` to satisfy `React.cloneElement`.
  // This allows adding the `id` prop without TypeScript complaining about unknown properties.
  const childWithId = React.cloneElement(children as React.ReactElement<any>, { id: childId });

  return (
    <div className="mb-4">
      <label htmlFor={childId} className="block text-sm font-medium text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="mt-1">
        {childWithId}
      </div>
      {description && <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{description}</p>}
    </div>
  );
};
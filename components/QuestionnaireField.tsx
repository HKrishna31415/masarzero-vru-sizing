import React from 'react';

interface QuestionnaireFieldProps {
  label: string;
  description?: string;
  children: React.ReactElement;
}

export const QuestionnaireField: React.FC<QuestionnaireFieldProps> = ({ label, description, children }) => {
  const childId = (children.props as any).id || label.replace(/\s+/g, '-').toLowerCase();
  const childWithId = React.cloneElement(children as React.ReactElement<any>, { id: childId });

  return (
    <div className="field-wrap">
      <label htmlFor={childId}>{label}</label>
      {childWithId}
      {description && <p className="field-desc">{description}</p>}
    </div>
  );
};

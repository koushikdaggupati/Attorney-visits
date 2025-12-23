import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-nyc-blue focus:border-nyc-blue transition-all duration-200 outline-none
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 hover:border-slate-400'}
          ${className}
        `}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
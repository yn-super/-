
import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, children, variant = 'primary' }) => {
    const baseClasses = "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = variant === 'primary' 
        ? "text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
        : "text-slate-200 bg-slate-700 hover:bg-slate-600 focus:ring-slate-500";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
        >
            {children}
        </button>
    );
};

export default ActionButton;

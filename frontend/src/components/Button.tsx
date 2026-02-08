import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: ReactNode;
    isLoading?: boolean;
}

export const Button = ({ 
    variant = 'primary', 
    children, 
    isLoading, 
    className = '',
    disabled,
    ...props 
}: ButtonProps) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    
    return (
        <button
            className={`${baseClass} ${variantClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};
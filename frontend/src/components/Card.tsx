import { type HTMLAttributes,type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
};
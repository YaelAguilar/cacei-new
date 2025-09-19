// src/features/propuestas-comentarios/presentation/components/VoteStatusBadge.tsx
import React from "react";
import { FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";

interface VoteStatusBadgeProps {
    status: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA' | 'SIN_COMENTARIOS';
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const VoteStatusBadge: React.FC<VoteStatusBadgeProps> = ({ 
    status, 
    showIcon = true,
    size = 'md' 
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'ACEPTADO':
                return {
                    label: 'Aceptado',
                    color: 'text-green-700 bg-green-100 border-green-300',
                    icon: <FiCheckCircle className="w-4 h-4" />
                };
            case 'RECHAZADO':
                return {
                    label: 'Rechazado',
                    color: 'text-red-700 bg-red-100 border-red-300',
                    icon: <FiXCircle className="w-4 h-4" />
                };
            case 'ACTUALIZA':
                return {
                    label: 'Requiere Actualización',
                    color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                    icon: <FiRefreshCw className="w-4 h-4" />
                };
            case 'SIN_COMENTARIOS':
                return {
                    label: 'Sin comentarios',
                    color: 'text-gray-700 bg-gray-100 border-gray-300',
                    icon: null
                };
        }
    };

    const config = getStatusConfig();
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <span className={`
            inline-flex items-center gap-1.5 rounded-full border font-medium
            ${config.color} ${sizeClasses[size]}
        `}>
            {showIcon && config.icon}
            {config.label}
        </span>
    );
};

export default VoteStatusBadge;
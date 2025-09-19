// src/features/propuestas-comentarios/presentation/components/InlineAlert.tsx
import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";

interface InlineAlertProps {
    message: string;
    type?: 'error' | 'warning' | 'info';
    onDismiss?: () => void;
}

const InlineAlert: React.FC<InlineAlertProps> = ({ 
    message, 
    type = 'error',
    onDismiss 
}) => {
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-700',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        info: 'bg-blue-50 border-blue-200 text-blue-700'
    };

    return (
        <div className={`flex items-start gap-2 p-3 rounded-lg border ${styles[type]} text-sm`}>
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="flex-1">{message}</p>
            {onDismiss && (
                <button 
                    onClick={onDismiss}
                    className="flex-shrink-0 hover:opacity-70"
                >
                    <FiX className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default InlineAlert;
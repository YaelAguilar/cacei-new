// src/features/alumnos-propuestas/presentation/components/VoteCounter.tsx
import React from 'react';

export interface VoteStats {
    totalVotes: number;
    acceptedVotes: number;
    rejectedVotes: number;
    updateVotes: number;
    generalApprovalVotes: number;
    generalRejectionVotes: number;
    generalUpdateVotes: number;
    specificApprovalVotes: number;
    specificRejectionVotes: number;
    specificUpdateVotes: number;
    evaluationClosed: boolean;
    calculatedStatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTUALIZAR';
}

interface VoteCounterProps {
    voteStats: VoteStats | null;
    isLoading?: boolean;
}

export const VoteCounter: React.FC<VoteCounterProps> = ({ voteStats, isLoading = false }) => {
    if (isLoading || !voteStats) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APROBADO':
                return 'text-green-600 bg-green-100 border-green-300';
            case 'RECHAZADO':
                return 'text-red-600 bg-red-100 border-red-300';
            case 'ACTUALIZAR':
                return 'text-yellow-600 bg-yellow-100 border-yellow-300';
            case 'PENDIENTE':
                return 'text-gray-600 bg-gray-100 border-gray-300';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'APROBADO':
                return 'Aprobado';
            case 'RECHAZADO':
                return 'Rechazado';
            case 'ACTUALIZAR':
                return 'Requiere Actualización';
            case 'PENDIENTE':
                return 'Pendiente de Evaluación';
            default:
                return 'Desconocido';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    📊 Estadísticas de Evaluación
                </h3>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(voteStats.calculatedStatus)}`}>
                    {getStatusText(voteStats.calculatedStatus)}
                </div>
            </div>

            {/* Resumen General */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{voteStats.totalVotes}</div>
                    <div className="text-sm text-blue-800">Total de Votos</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{voteStats.acceptedVotes}</div>
                    <div className="text-sm text-green-800">Aprobaciones</div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{voteStats.rejectedVotes}</div>
                    <div className="text-sm text-red-800">Rechazos</div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{voteStats.updateVotes}</div>
                    <div className="text-sm text-yellow-800">Actualizaciones</div>
                </div>
            </div>

            {/* Desglose Detallado */}
            <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">Desglose por Tipo de Voto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Votos Generales */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">🎯 Votos Generales</h5>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Aprobaciones:</span>
                                <span className="font-medium text-green-600">{voteStats.generalApprovalVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Rechazos:</span>
                                <span className="font-medium text-red-600">{voteStats.generalRejectionVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Actualizaciones:</span>
                                <span className="font-medium text-yellow-600">{voteStats.generalUpdateVotes}</span>
                            </div>
                        </div>
                    </div>

                    {/* Votos Específicos */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-700 mb-2">📝 Votos Específicos</h5>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Aprobaciones:</span>
                                <span className="font-medium text-green-600">{voteStats.specificApprovalVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Rechazos:</span>
                                <span className="font-medium text-red-600">{voteStats.specificRejectionVotes}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Actualizaciones:</span>
                                <span className="font-medium text-yellow-600">{voteStats.specificUpdateVotes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado de Evaluación */}
            {voteStats.evaluationClosed && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="text-green-600 mr-2">✅</div>
                        <div className="text-sm text-green-800">
                            <strong>Evaluación Cerrada:</strong> La propuesta ha sido evaluada completamente. 
                            Los tutores ya no pueden agregar comentarios.
                        </div>
                    </div>
                </div>
            )}

            {/* Información Adicional */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                    <strong>💡 Información:</strong> Los votos generales tienen prioridad sobre los específicos. 
                    Se requieren 3 votos de aprobación o rechazo general para cerrar la evaluación.
                </div>
            </div>
        </div>
    );
};

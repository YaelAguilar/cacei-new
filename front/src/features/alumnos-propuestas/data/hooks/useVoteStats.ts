// src/features/alumnos-propuestas/data/hooks/useVoteStats.ts
import { useState, useEffect } from 'react';
import { VoteStats } from '../../presentation/components/VoteCounter';

interface UseVoteStatsResult {
    voteStats: VoteStats | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useVoteStats = (proposalId: string): UseVoteStatsResult => {
    const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVoteStats = async () => {
        if (!proposalId) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log(`📊 Obteniendo estadísticas de votos para propuesta: ${proposalId}`);
            console.log(`📊 URL: http://localhost:4000/api/v1/propuestas/${proposalId}/estadisticas-votos`);
            
            const token = localStorage.getItem('auth-token');
            console.log(`📊 Token obtenido: ${token ? 'Sí' : 'No'}`);
            console.log(`📊 Token (primeros 20 chars): ${token ? token.substring(0, 20) + '...' : 'null'}`);
            
            const response = await fetch(`http://localhost:4000/api/v1/propuestas/${proposalId}/estadisticas-votos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`📊 Response status: ${response.status}`);
            console.log(`📊 Response ok: ${response.ok}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`📊 Error response: ${errorText}`);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success) {
                console.log('📊 Estadísticas de votos obtenidas:', data.data);
                setVoteStats(data.data);
                
                // ✅ NUEVO: Intentar sincronizar el estado si hay votos
                if (data.data.totalVotes > 0) {
                    console.log('🔄 Intentando sincronizar estado de propuesta...');
                    await syncProposalStatus(proposalId, token);
                }
            } else {
                throw new Error(data.message || 'Error al obtener estadísticas de votos');
            }
        } catch (err) {
            console.error('❌ Error obteniendo estadísticas de votos:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ NUEVO: Función para sincronizar el estado de la propuesta
    const syncProposalStatus = async (proposalId: string, token: string) => {
        try {
            console.log(`🔄 Sincronizando estado de propuesta: ${proposalId}`);
            
            const response = await fetch(`http://localhost:4000/api/v1/propuestas/${proposalId}/sincronizar-estado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('✅ Estado de propuesta sincronizado exitosamente');
                } else {
                    console.log('⚠️ Sincronización no necesaria o falló:', result.message);
                }
            } else {
                console.log('⚠️ Error en sincronización:', response.status);
            }
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
        }
    };

    useEffect(() => {
        fetchVoteStats();
    }, [proposalId]);

    const refetch = () => {
        fetchVoteStats();
    };

    return {
        voteStats,
        isLoading,
        error,
        refetch
    };
};

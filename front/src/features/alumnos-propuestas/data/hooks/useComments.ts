import { useState, useEffect } from 'react';
import { Comment } from '../presentation/components/CommentsSection';

interface UseCommentsResult {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useComments = (proposalId: string): UseCommentsResult => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        if (!proposalId) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log(`💬 Obteniendo comentarios para propuesta: ${proposalId}`);
            
            const token = localStorage.getItem('auth-token');
            console.log(`💬 Token obtenido: ${token ? 'Sí' : 'No'}`);

            const response = await fetch(`http://localhost:4000/api/v1/propuestas/${proposalId}/comentarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`💬 Response status: ${response.status}`);
            console.log(`💬 Response ok: ${response.ok}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`💬 Error response: ${errorText}`);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            console.log('💬 Datos recibidos del backend:', data);
            
            if (data.success) {
                console.log('💬 Comentarios obtenidos:', data.data);
                
                // Verificar si data.data es un array
                if (!Array.isArray(data.data)) {
                    console.error('💬 Error: data.data no es un array:', data.data);
                    throw new Error('Formato de datos inválido: se esperaba un array de comentarios');
                }
                
                // Transformar los datos del backend al formato esperado por el componente
                const transformedComments: Comment[] = data.data.map((comment: any) => ({
                    id: comment.id,
                    tutorName: comment.tutorName || comment.name || 'Tutor',
                    tutorLastName: comment.tutorLastName || comment.lastName || '',
                    tutorSecondLastName: comment.tutorSecondLastName || comment.secondLastName || '',
                    tutorEmail: comment.tutorEmail || comment.email || '',
                    voteStatus: comment.voteStatus,
                    sectionName: comment.sectionName,
                    subsectionName: comment.subsectionName,
                    commentText: comment.commentText,
                    createdAt: comment.createdAt
                }));
                
                console.log('💬 Comentarios transformados:', transformedComments);
                setComments(transformedComments);
            } else {
                console.error('💬 Error en respuesta del backend:', data);
                throw new Error(data.message || 'Error al obtener comentarios');
            }
        } catch (err) {
            console.error('❌ Error obteniendo comentarios:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [proposalId]);

    const refetch = () => {
        fetchComments();
    };

    return {
        comments,
        isLoading,
        error,
        refetch
    };
};

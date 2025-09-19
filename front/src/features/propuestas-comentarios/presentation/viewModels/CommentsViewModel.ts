// src/features/propuestas-comentarios/presentation/viewModels/CommentsViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { ProposalComment } from "../../data/models/ProposalComment";
import { CommentRepository } from "../../data/repository/CommentRepository";
import { CreateCommentUseCase } from "../../domain/CreateCommentUseCase";
import { UpdateCommentUseCase } from "../../domain/UpdateCommentUseCase";
import { GetCommentsByProposalUseCase } from "../../domain/GetCommentsByProposalUseCase";
import { DeleteCommentUseCase } from "../../domain/DeleteCommentUseCase";
import { CreateCommentRequest, UpdateCommentRequest } from "../../data/models/ProposalCommentDTO";

export class CommentsViewModel {
    // Estados de UI
    loading: boolean = false;
    error: string | null = null;
    isInitialized: boolean = false;

    // Estados de datos
    comments: ProposalComment[] = [];
    selectedComment: ProposalComment | null = null;
    currentProposalId: number | null = null;

    // Estados de modales
    showCommentModal: boolean = false;
    showEditModal: boolean = false;
    isEditMode: boolean = false;

    // Estados de filtros
    selectedSection: string | null = null;
    selectedSubsection: string | null = null;

    // Casos de uso
    private repository: CommentRepository;
    private createCommentUseCase: CreateCommentUseCase;
    private updateCommentUseCase: UpdateCommentUseCase;
    private getCommentsByProposalUseCase: GetCommentsByProposalUseCase;
    private deleteCommentUseCase: DeleteCommentUseCase;

    constructor() {
        makeAutoObservable(this);

        this.repository = new CommentRepository();
        this.createCommentUseCase = new CreateCommentUseCase(this.repository);
        this.updateCommentUseCase = new UpdateCommentUseCase(this.repository);
        this.getCommentsByProposalUseCase = new GetCommentsByProposalUseCase(this.repository);
        this.deleteCommentUseCase = new DeleteCommentUseCase(this.repository);
    }

    // Setters básicos
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    setComments(comments: ProposalComment[]) {
        this.comments = comments;
    }

    setSelectedComment(comment: ProposalComment | null) {
        this.selectedComment = comment;
    }

    setCurrentProposalId(id: number | null) {
        this.currentProposalId = id;
    }

    setShowCommentModal(show: boolean) {
        this.showCommentModal = show;
    }

    setShowEditModal(show: boolean) {
        this.showEditModal = show;
    }

    setIsEditMode(isEdit: boolean) {
        this.isEditMode = isEdit;
    }

    setSelectedSection(section: string | null) {
        this.selectedSection = section;
    }

    setSelectedSubsection(subsection: string | null) {
        this.selectedSubsection = subsection;
    }

    // Método de inicialización
    async initialize(proposalIdOrUuid: string | number): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            // Si es un string (UUID), convertirlo a ID numérico
            let proposalId: number;
            
            if (typeof proposalIdOrUuid === 'string') {
                proposalId = parseInt(proposalIdOrUuid);
            } else {
                proposalId = proposalIdOrUuid;
            }

            this.setCurrentProposalId(proposalId);
            await this.loadComments(proposalId);
        } catch (error: any) {
            this.setError(error.message || "Error al cargar los comentarios");
        } finally {
            runInAction(() => {
                this.isInitialized = true;
                this.setLoading(false);
            });
        }
    }

    // Cargar comentarios
    async loadComments(proposalId: number): Promise<void> {
        this.setLoading(true);
        this.setError(null);

        try {
            const comments = await this.getCommentsByProposalUseCase.execute(proposalId);
            runInAction(() => {
                this.setComments(comments);
            });
        } catch (error: any) {
            runInAction(() => {
                this.setError(error.message || "Error al cargar los comentarios");
                this.setComments([]);
            });
        } finally {
            this.setLoading(false);
        }
    }

    // Crear comentario
    async createComment(data: CreateCommentRequest): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const newComment = await this.createCommentUseCase.execute(data);
            runInAction(() => {
                this.comments = [newComment, ...this.comments]; // Agregar al inicio
            });
            return true;
        } catch (error: any) {
            runInAction(() => {
                this.setError(error.message || "Error al crear el comentario");
            });
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    // Actualizar comentario
    async updateComment(uuid: string, data: UpdateCommentRequest): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const updatedComment = await this.updateCommentUseCase.execute(uuid, data);
            runInAction(() => {
                this.comments = this.comments.map(comment => 
                    comment.getId() === uuid ? updatedComment : comment
                );
            });
            return true;
        } catch (error: any) {
            runInAction(() => {
                this.setError(error.message || "Error al actualizar el comentario");
            });
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    // Eliminar comentario
    async deleteComment(uuid: string): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const deleted = await this.deleteCommentUseCase.execute(uuid);
            if (deleted) {
                runInAction(() => {
                    this.comments = this.comments.filter(comment => comment.getId() !== uuid);
                });
            }
            return deleted;
        } catch (error: any) {
            runInAction(() => {
                this.setError(error.message || "Error al eliminar el comentario");
            });
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    // Abrir modal de nuevo comentario
    openCommentModal(sectionName: string, subsectionName: string) {
        this.setSelectedSection(sectionName);
        this.setSelectedSubsection(subsectionName);
        this.setIsEditMode(false);
        this.setShowCommentModal(true);
    }

    // Abrir modal de edición
    openEditModal(comment: ProposalComment) {
        this.setSelectedComment(comment);
        this.setIsEditMode(true);
        this.setShowEditModal(true);
    }

    // Cerrar modales
    closeCommentModal() {
        this.setShowCommentModal(false);
        this.setSelectedSection(null);
        this.setSelectedSubsection(null);
    }

    closeEditModal() {
        this.setShowEditModal(false);
        this.setSelectedComment(null);
        this.setIsEditMode(false);
    }

    // Getters computados
    get hasComments(): boolean {
        return this.comments.length > 0;
    }

    // Obtener comentarios de una subsección específica
    getCommentsForSubsection(sectionName: string, subsectionName: string): ProposalComment[] {
        return this.comments.filter(comment => 
            comment.getSectionName() === sectionName && 
            comment.getSubsectionName() === subsectionName
        ).sort((a, b) => 
            // Ordenar por fecha descendente (más recientes primero)
            new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime()
        );
    }

    // Obtener el estado general de una subsección
    getSubsectionStatus(sectionName: string, subsectionName: string): {
        hasComments: boolean;
        status: 'ACEPTADO' | 'RECHAZADO' | 'ACTUALIZA' | 'SIN_COMENTARIOS';
        count: number;
    } {
        const comments = this.getCommentsForSubsection(sectionName, subsectionName);
        
        if (comments.length === 0) {
            return {
                hasComments: false,
                status: 'SIN_COMENTARIOS',
                count: 0
            };
        }

        // Determinar el estado basado en la votación más reciente (primera en el array ordenado)
        const latestComment = comments[0];
        
        return {
            hasComments: true,
            status: latestComment.getVoteStatus(),
            count: comments.length
        };
    }

    // Estadísticas
    get statistics() {
        const total = this.comments.length;
        const approved = this.comments.filter(c => c.isApproved()).length;
        const rejected = this.comments.filter(c => c.isRejected()).length;
        const needsUpdate = this.comments.filter(c => c.needsUpdate()).length;

        return {
            total,
            approved,
            rejected,
            needsUpdate
        };
    }

    // Verificar si existe un comentario en una subsección
    hasCommentInSubsection(sectionName: string, subsectionName: string): boolean {
        return this.comments.some(comment => 
            comment.getSectionName() === sectionName && 
            comment.getSubsectionName() === subsectionName
        );
    }

    // Formatear fecha
    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Limpiar errores
    clearError() {
        this.setError(null);
    }

    // Resetear el ViewModel
    reset() {
        this.loading = false;
        this.error = null;
        this.isInitialized = false;
        this.comments = [];
        this.selectedComment = null;
        this.currentProposalId = null;
        this.showCommentModal = false;
        this.showEditModal = false;
        this.isEditMode = false;
        this.selectedSection = null;
        this.selectedSubsection = null;
    }
}
// src/features/propuestas-comentarios/presentation/viewModels/CommentsViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { ProposalComment } from "../../data/models/ProposalComment";
import { CommentRepository } from "../../data/repository/CommentRepository";
import { CreateCommentUseCase } from "../../domain/CreateCommentUseCase";
import { UpdateCommentUseCase } from "../../domain/UpdateCommentUseCase";
import { GetCommentsByProposalUseCase } from "../../domain/GetCommentsByProposalUseCase";
import { DeleteCommentUseCase } from "../../domain/DeleteCommentUseCase";
import { ApproveProposalUseCase } from "../../domain/ApproveProposalUseCase";
import { CreateCommentRequest, UpdateCommentRequest } from "../../data/models/ProposalCommentDTO";

export class CommentsViewModel {
    // Estados de UI
    loading: boolean = false;
    error: string | null = null;
    isInitialized: boolean = false;

    // Estados de datos
    comments: ProposalComment[] = [];
    selectedComment: ProposalComment | null = null;
    currentProposalId: string | null = null;

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
    private approveProposalUseCase: ApproveProposalUseCase;

    constructor() {
        makeAutoObservable(this);

        this.repository = new CommentRepository();
        this.createCommentUseCase = new CreateCommentUseCase(this.repository);
        this.updateCommentUseCase = new UpdateCommentUseCase(this.repository);
        this.getCommentsByProposalUseCase = new GetCommentsByProposalUseCase(this.repository);
        this.deleteCommentUseCase = new DeleteCommentUseCase(this.repository);
        this.approveProposalUseCase = new ApproveProposalUseCase(this.repository);
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

    setCurrentProposalId(id: string | null) {
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
    async initialize(proposalIdOrUuid: string): Promise<void> {
        console.log('🚀 CommentsViewModel.initialize() called');
        console.log('📦 proposalIdOrUuid recibido:', proposalIdOrUuid);
        console.log('📦 Tipo de dato:', typeof proposalIdOrUuid);
        
        this.setLoading(true);
        this.setError(null);

        try {
            this.setCurrentProposalId(proposalIdOrUuid);
            console.log('📤 Llamando a loadComments con:', proposalIdOrUuid);
            await this.loadComments(proposalIdOrUuid);
        } catch (error: any) {
            console.error('❌ Error en initialize:', error);
            this.setError(error.message || "Error al cargar los comentarios");
        } finally {
            runInAction(() => {
                this.isInitialized = true;
                this.setLoading(false);
            });
        }
    }

    // Cargar comentarios
    async loadComments(proposalId: string): Promise<void> {
        console.log('🔍 loadComments() called');
        console.log('📦 proposalId:', proposalId);
        
        this.setLoading(true);
        this.setError(null);

        try {
            console.log('📤 Ejecutando getCommentsByProposalUseCase...');
            const comments = await this.getCommentsByProposalUseCase.execute(proposalId);
            console.log('📥 Comentarios recibidos:', comments);
            console.log('📊 Cantidad de comentarios:', comments?.length || 0);
            
            runInAction(() => {
                this.setComments(comments);
            });
        } catch (error: any) {
            console.error('❌ Error en loadComments:', error);
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

    // Actualizar comentario (solo ACTUALIZA)
    async updateComment(commentId: string, data: UpdateCommentRequest): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            // ✅ Verificar que el comentario sea ACTUALIZA antes de intentar actualizar
            const existingComment = this.comments.find(c => c.getId() === commentId);
            if (!existingComment) {
                throw new Error("Comentario no encontrado");
            }

            if (existingComment.getVoteStatus() !== 'ACTUALIZA') {
                throw new Error("Solo se pueden editar comentarios con estado 'ACTUALIZA'");
            }

            const updatedComment = await this.updateCommentUseCase.execute(commentId, data);
            runInAction(() => {
                this.comments = this.comments.map(comment => 
                    comment.getId() === commentId ? updatedComment : comment
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

    // ❌ Eliminar comentario DESHABILITADO
    async deleteComment(commentId: string): Promise<boolean> {
        runInAction(() => {
            this.setError("Los comentarios no se pueden eliminar una vez creados");
        });
        return false;
    }

    // ✅ NUEVO: Aprobar toda la propuesta
    async approveProposal(proposalId: string): Promise<boolean> {
        this.setLoading(true);
        this.setError(null);

        try {
            const approved = await this.approveProposalUseCase.execute(proposalId);
            if (approved) {
                // Recargar comentarios para mostrar la aprobación
                await this.loadComments(proposalId);
            }
            return approved;
        } catch (error: any) {
            runInAction(() => {
                this.setError(error.message || "Error al aprobar la propuesta");
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

    // Abrir modal de edición (solo para ACTUALIZA)
    openEditModal(comment: ProposalComment) {
        if (comment.getVoteStatus() !== 'ACTUALIZA') {
            this.setError("Solo se pueden editar comentarios con estado 'ACTUALIZA'");
            return;
        }
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

    // ✅ MEJORADO: Obtener comentarios de una sección completa
    getCommentsForSection(sectionName: string): ProposalComment[] {
        return this.comments.filter(comment => 
            comment.getSectionName() === sectionName
        ).sort((a, b) => 
            new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime()
        );
    }

    // ✅ NUEVO: Verificar si un tutor ya comentó en una sección
    hasTutorCommentInSection(sectionName: string, tutorEmail: string): boolean {
        return this.comments.some(comment => 
            comment.getSectionName() === sectionName && 
            comment.getTutorEmail() === tutorEmail
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

    // ✅ NUEVO: Verificar si la propuesta está completamente aprobada
    get isProposalFullyApproved(): boolean {
        return this.comments.some(comment => 
            comment.getSectionName() === 'APROBACIÓN_GENERAL' && 
            comment.getSubsectionName() === 'PROPUESTA_COMPLETA' &&
            comment.getVoteStatus() === 'ACEPTADO'
        );
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

    // ✅ NUEVO: Verificar si se puede editar un comentario
    canEditComment(comment: ProposalComment): boolean {
        return comment.getVoteStatus() === 'ACTUALIZA';
    }

    // ✅ NUEVO: Verificar si se puede eliminar un comentario (siempre false)
    canDeleteComment(_comment: ProposalComment): boolean {
        return false; // Los comentarios no se pueden eliminar
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
    // ✅ NUEVO: Aprobar toda la propuesta
    async approveProposal(proposalId: string): Promise<boolean> {
        try {
            this.loading = true;
            this.error = null;
            
            const success = await this.repository.approveProposal(proposalId);
            
            if (success) {
                // Recargar comentarios para mostrar el nuevo estado
                await this.loadComments(proposalId);
            }
            
            return success;
        } catch (error) {
            console.error("Error approving proposal:", error);
            this.error = error instanceof Error ? error.message : "Error al aprobar la propuesta";
            return false;
        } finally {
            this.loading = false;
        }
    }

    // ✅ NUEVO: Rechazar toda la propuesta
    async rejectProposal(proposalId: string): Promise<boolean> {
        try {
            this.loading = true;
            this.error = null;
            
            const success = await this.repository.rejectProposal(proposalId);
            
            if (success) {
                // Recargar comentarios para mostrar el nuevo estado
                await this.loadComments(proposalId);
            }
            
            return success;
        } catch (error) {
            console.error("Error rejecting proposal:", error);
            this.error = error instanceof Error ? error.message : "Error al rechazar la propuesta";
            return false;
        } finally {
            this.loading = false;
        }
    }

    // ✅ NUEVO: Actualizar toda la propuesta
    async updateProposal(proposalId: string): Promise<boolean> {
        try {
            this.loading = true;
            this.error = null;
            
            const success = await this.repository.updateProposal(proposalId);
            
            if (success) {
                // Recargar comentarios para mostrar el nuevo estado
                await this.loadComments(proposalId);
            }
            
            return success;
        } catch (error) {
            console.error("Error updating proposal:", error);
            this.error = error instanceof Error ? error.message : "Error al solicitar actualización de la propuesta";
            return false;
        } finally {
            this.loading = false;
        }
    }

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
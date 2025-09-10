// src/propuestas/domain/models/propuesta.ts
export class Propuesta {
    constructor(
        private readonly id: number,
        private readonly idConvocatoria: number,
        private readonly idAlumno: number,
        private readonly tutorAcademicoId: number,
        private readonly tutorAcademicoNombre: string,
        private readonly tutorAcademicoEmail: string,
        private readonly tipoPasantia: string,
        private readonly nombreProyecto: string,
        private readonly descripcionProyecto: string,
        private readonly entregables: string,
        private readonly tecnologias: string,
        private readonly supervisorProyecto: string,
        private readonly actividades: string,
        private readonly fechaInicio: Date,
        private readonly fechaFin: Date,
        private readonly nombreEmpresa: string,
        private readonly sectorEmpresa: string,
        private readonly personaContacto: string,
        private readonly paginaWebEmpresa?: string | null,
        private readonly uuid?: string,
        private readonly active?: boolean,
        private readonly created_at?: Date,
        private readonly updated_at?: Date,
        private readonly user_creation?: number | null,
        private readonly user_update?: number | null
    ) {}

    getId(): number {
        return this.id;
    }

    getIdConvocatoria(): number {
        return this.idConvocatoria;
    }

    getIdAlumno(): number {
        return this.idAlumno;
    }

    getTutorAcademicoId(): number {
        return this.tutorAcademicoId;
    }

    getTutorAcademicoNombre(): string {
        return this.tutorAcademicoNombre;
    }

    getTutorAcademicoEmail(): string {
        return this.tutorAcademicoEmail;
    }

    getTipoPasantia(): string {
        return this.tipoPasantia;
    }

    getNombreProyecto(): string {
        return this.nombreProyecto;
    }

    getDescripcionProyecto(): string {
        return this.descripcionProyecto;
    }

    getEntregables(): string {
        return this.entregables;
    }

    getTecnologias(): string {
        return this.tecnologias;
    }

    getSupervisorProyecto(): string {
        return this.supervisorProyecto;
    }

    getActividades(): string {
        return this.actividades;
    }

    getFechaInicio(): Date {
        return this.fechaInicio;
    }

    getFechaFin(): Date {
        return this.fechaFin;
    }

    getNombreEmpresa(): string {
        return this.nombreEmpresa;
    }

    getSectorEmpresa(): string {
        return this.sectorEmpresa;
    }

    getPersonaContacto(): string {
        return this.personaContacto;
    }

    getPaginaWebEmpresa(): string | null | undefined {
        return this.paginaWebEmpresa;
    }

    getUuid(): string | undefined {
        return this.uuid;
    }

    isActive(): boolean | undefined {
        return this.active;
    }

    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }

    getUserCreation(): number | null | undefined {
        return this.user_creation;
    }

    getUserUpdate(): number | null | undefined {
        return this.user_update;
    }
}
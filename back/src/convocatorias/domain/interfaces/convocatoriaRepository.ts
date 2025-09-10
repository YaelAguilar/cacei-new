import { Convocatoria } from "../models/convocatoria";
import { Profesor } from "../models/profesor";

export interface ConvocatoriaRepository {
    createConvocatoria(
        nombre: string,
        descripcion: string | null,
        fechaLimite: Date,
        pasantiasDisponibles: string[],
        profesoresDisponibles: { id: number; nombre: string; email: string }[]
    ): Promise<Convocatoria | null>;

    getConvocatorias(): Promise<Convocatoria[] | null>;

    getConvocatoria(uuid: string): Promise<Convocatoria | null>;

    updateConvocatoria(
        uuid: string,
        updatedData: Partial<{
            nombre: string;
            descripcion: string | null;
            fechaLimite: Date;
            pasantiasDisponibles: string[];
            profesoresDisponibles: { id: number; nombre: string; email: string }[];
        }>
    ): Promise<Convocatoria | null>;

    getProfesoresDisponibles(): Promise<Profesor[] | null>;
}
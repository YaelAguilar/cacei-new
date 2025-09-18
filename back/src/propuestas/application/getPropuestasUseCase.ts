// src/propuestas/application/getPropuestasUseCase.ts
import { PropuestaRepository } from "../domain/interfaces/propuestaRepository";
import { Propuesta } from "../domain/models/propuesta";

export class GetPropuestasUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestas();
        } catch (error) {
            console.error("Error in GetPropuestasUseCase:", error);
            throw error;
        }
    }
}

// src/propuestas/application/getPropuestaUseCase.ts
export class GetPropuestaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(uuid: string): Promise<Propuesta | null> {
        try {
            return await this.propuestaRepository.getPropuesta(uuid);
        } catch (error) {
            console.error("Error in GetPropuestaUseCase:", error);
            throw error;
        }
    }
}

// src/propuestas/application/getPropuestasByStudentUseCase.ts
export class GetPropuestasByStudentUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(studentId: number): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestasByStudent(studentId);
        } catch (error) {
            console.error("Error in GetPropuestasByStudentUseCase:", error);
            throw error;
        }
    }
}

// src/propuestas/application/getPropuestasByConvocatoriaUseCase.ts
export class GetPropuestasByConvocatoriaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(convocatoriaId: number): Promise<Propuesta[] | null> {
        try {
            return await this.propuestaRepository.getPropuestasByConvocatoria(convocatoriaId);
        } catch (error) {
            console.error("Error in GetPropuestasByConvocatoriaUseCase:", error);
            throw error;
        }
    }
}

// src/propuestas/application/getActiveConvocatoriaUseCase.ts
export class GetActiveConvocatoriaUseCase {
    constructor(private readonly propuestaRepository: PropuestaRepository) {}

    async run(): Promise<{ id: number; uuid: string; nombre: string; pasantiasDisponibles: string[]; profesoresDisponibles: any[] } | null> {
        try {
            return await this.propuestaRepository.getActiveConvocatoria();
        } catch (error) {
            console.error("Error in GetActiveConvocatoriaUseCase:", error);
            throw error;
        }
    }
}
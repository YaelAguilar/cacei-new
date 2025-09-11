import { Request, Response } from 'express';
import { GetActiveConvocatoriaUseCase } from '../../application/getPropuestasUseCase';

export class GetActiveConvocatoriaController {
    constructor(private readonly getActiveConvocatoriaUseCase: GetActiveConvocatoriaUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        console.log('🏁 GetActiveConvocatoriaController iniciado');
        
        try {
            console.log('🔍 Ejecutando getActiveConvocatoriaUseCase...');
            const convocatoriaActiva = await this.getActiveConvocatoriaUseCase.run();
            console.log('📋 Convocatoria activa:', convocatoriaActiva ? 'encontrada' : 'no encontrada');
            
            // 🔧 DEBUG: Información detallada de la convocatoria
            if (convocatoriaActiva) {
                console.log('📊 Detalles convocatoria activa:', {
                    id: convocatoriaActiva.id,
                    uuid: convocatoriaActiva.uuid,
                    nombre: convocatoriaActiva.nombre,
                    pasantiasCount: convocatoriaActiva.pasantiasDisponibles.length,
                    profesoresCount: convocatoriaActiva.profesoresDisponibles.length
                });
                
                console.log('🎯 ID que se enviará al frontend:', convocatoriaActiva.uuid);
                console.log('🎯 ID interno de BD:', convocatoriaActiva.id);
            }

            if (convocatoriaActiva) {
                const formattedConvocatoria = {
                    type: "convocatoria-activa",
                    id: convocatoriaActiva.id.toString(), // Este es el UUID, no el ID numérico
                    attributes: {
                        nombre: convocatoriaActiva.nombre,
                        pasantiasDisponibles: convocatoriaActiva.pasantiasDisponibles,
                        profesoresDisponibles: convocatoriaActiva.profesoresDisponibles
                    }
                };

                console.log('✅ Enviando convocatoria activa al frontend');
                console.log('📤 Formato de respuesta:', {
                    type: formattedConvocatoria.type,
                    id: formattedConvocatoria.id,
                    nombre: formattedConvocatoria.attributes.nombre
                });
                
                res.status(200).json({ data: formattedConvocatoria });
            } else {
                console.log('❌ No hay convocatoria activa');
                res.status(404).json({
                    errors: [{
                        status: "404",
                        title: "No active convocatoria",
                        detail: "No hay una convocatoria activa disponible en este momento"
                    }]
                });
            }
        } catch (error) {
            console.error("❌ Error in GetActiveConvocatoriaController:", error);
            console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack');
            
            if (!res.headersSent) {
                res.status(500).json({
                    errors: [{
                        status: "500",
                        title: "Server error",
                        detail: error instanceof Error ? error.message : String(error)
                    }]
                });
            }
        }
    }
}
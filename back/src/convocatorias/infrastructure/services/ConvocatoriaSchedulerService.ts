import { DeactivateExpiredConvocatoriasUseCase } from "../../application/deactivateExpiredConvocatoriasUseCase";

export class ConvocatoriaSchedulerService {
    constructor(private readonly deactivateExpiredConvocatoriasUseCase: DeactivateExpiredConvocatoriasUseCase) {}

    /**
     * Desactiva todas las convocatorias cuya fecha límite ya ha pasado
     */
    async deactivateExpiredConvocatorias(): Promise<void> {
        try {
            await this.deactivateExpiredConvocatoriasUseCase.run();
            console.log(`[${new Date().toISOString()}] Proceso de desactivación de convocatorias completado`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error en proceso de desactivación de convocatorias:`, error);
        }
    }

    /**
     * Inicia el scheduler que se ejecuta cada hora
     */
    startScheduler(): void {
        this.deactivateExpiredConvocatorias();

        setInterval(() => {
            this.deactivateExpiredConvocatorias();
        }, 3600000); // 1 hora

        console.log('[ConvocatoriaScheduler] Scheduler iniciado - se ejecutará cada hora');
    }
}
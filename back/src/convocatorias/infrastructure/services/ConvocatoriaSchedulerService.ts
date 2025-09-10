import { DeactivateExpiredConvocatoriasUseCase } from "../../application/deactivateExpiredConvocatoriasUseCase";

export class ConvocatoriaSchedulerService {
    private intervalId: NodeJS.Timeout | null = null;
    private intervalMs: number;

    constructor(
        private readonly deactivateExpiredConvocatoriasUseCase: DeactivateExpiredConvocatoriasUseCase,
        intervalMinutes: number = 60 // Por defecto cada hora
    ) {
        this.intervalMs = intervalMinutes * 60 * 1000;
    }

    /**
     * Desactiva todas las convocatorias cuya fecha límite ya ha pasado
     */
    async deactivateExpiredConvocatorias(): Promise<void> {
        try {
            console.log(`[${new Date().toISOString()}] Iniciando proceso de desactivación de convocatorias expiradas`);
            await this.deactivateExpiredConvocatoriasUseCase.run();
            console.log(`[${new Date().toISOString()}] Proceso de desactivación de convocatorias completado exitosamente`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error en proceso de desactivación de convocatorias:`, error);
        }
    }

    /**
     * Inicia el scheduler que se ejecuta en el intervalo especificado
     */
    startScheduler(): void {
        if (this.intervalId) {
            console.warn('[ConvocatoriaScheduler] El scheduler ya está ejecutándose');
            return;
        }

        // Ejecutar inmediatamente al iniciar
        this.deactivateExpiredConvocatorias();

        // Programar ejecuciones periódicas
        this.intervalId = setInterval(() => {
            this.deactivateExpiredConvocatorias();
        }, this.intervalMs);

        console.log(`[ConvocatoriaScheduler] Scheduler iniciado - se ejecutará cada ${this.intervalMs / 60000} minutos`);
    }

    /**
     * Detiene el scheduler
     */
    stopScheduler(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('[ConvocatoriaScheduler] Scheduler detenido');
        } else {
            console.warn('[ConvocatoriaScheduler] No hay scheduler ejecutándose');
        }
    }

    /**
     * Verifica si el scheduler está ejecutándose
     */
    isRunning(): boolean {
        return this.intervalId !== null;
    }

    /**
     * Reinicia el scheduler con un nuevo intervalo
     */
    restartScheduler(intervalMinutes?: number): void {
        this.stopScheduler();
        if (intervalMinutes) {
            this.intervalMs = intervalMinutes * 60 * 1000;
        }
        this.startScheduler();
    }
}
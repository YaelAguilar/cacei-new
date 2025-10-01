// src/features/alumnos-propuestas/presentation/interfaces/PropuestaDetailViewModelInterface.ts
import { PropuestaCompleta } from "../../data/models/Propuesta";

export interface PropuestaDetailViewModelInterface {
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  };
  getPropuestaDetailedStatus(propuesta: PropuestaCompleta): {
    estatus: {
      status: 'pendiente' | 'aprobado' | 'rechazado' | 'actualizar';
      label: string;
      color: string;
      bgColor: string;
    };
    activa: boolean;
    mostrarEstatus: boolean;
    colorPrincipal: string;
    fondoPrincipal: string;
  };
  formatDate(date: Date): string;
  formatDateTime(date: Date): string;
}

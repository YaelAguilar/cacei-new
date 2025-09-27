// src/features/alumnos-propuestas/presentation/interfaces/PropuestaDetailViewModelInterface.ts
import { PropuestaCompleta } from "../../data/models/Propuesta";

export interface PropuestaDetailViewModelInterface {
  getPropuestaStatus(propuesta: PropuestaCompleta): {
    status: 'active' | 'inactive';
    label: string;
    color: string;
  };
  formatDate(date: Date): string;
  formatDateTime(date: Date): string;
}

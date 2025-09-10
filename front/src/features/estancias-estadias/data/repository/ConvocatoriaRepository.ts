import ApiClient from "../../../../core/API/ApiClient";
import { 
  CreateConvocatoriaRequest,
  JsonApiConvocatoriaResponse,
  ProfesoresApiResponse,
  JsonApiActiveConvocatoriaResponse
} from "../models/ConvocatoriaDTO";
import { Convocatoria, Profesor } from "../models/Convocatoria";

export class ConvocatoriaRepository {
  
  async createConvocatoria(request: CreateConvocatoriaRequest): Promise<Convocatoria | null> {
    try {
      const response = await ApiClient.post<JsonApiConvocatoriaResponse>('/convocatorias', request);
      
      if (response.status === 200 || response.status === 201) {
        const data = response.data.data.attributes;
        
        // Convertir profesores DTO a modelo de dominio
        const profesores = data.profesoresDisponibles.map(p => 
          new Profesor(p.id, p.nombre, p.email)
        );
        
        return new Convocatoria(
          response.data.data.id,
          data.nombre,
          data.descripcion,
          new Date(data.fechaLimite),
          data.pasantiasDisponibles,
          profesores,
          data.active,
          new Date(data.createdAt),
          new Date(data.updatedAt)
        );
      }
      
      return null;
    } catch (error) {
      console.error("Error en createConvocatoria:", error);
      throw error;
    }
  }

  async getProfesoresDisponibles(): Promise<Profesor[]> {
    try {
      const response = await ApiClient.get<ProfesoresApiResponse>('/convocatorias/profesores/disponibles');
      
      if (response.status === 200) {
        return response.data.data.map(item => 
          new Profesor(
            item.id,
            item.attributes.nombre,
            item.attributes.email
          )
        );
      }
      
      return [];
    } catch (error) {
      console.error("Error en getProfesoresDisponibles:", error);
      throw error;
    }
  }

  async checkActiveConvocatoria(): Promise<boolean> {
    try {
      const response = await ApiClient.get<JsonApiActiveConvocatoriaResponse>('/convocatorias/active/check');
      
      if (response.status === 200) {
        return response.data.data.attributes.hasActiveConvocatoria;
      }
      
      return false;
    } catch (error) {
      console.error("Error en checkActiveConvocatoria:", error);
      // Si hay error, asumimos que no hay convocatoria activa
      return false;
    }
  }
}
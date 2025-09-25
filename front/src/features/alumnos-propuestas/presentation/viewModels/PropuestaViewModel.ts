// src/features/alumnos-propuestas/presentation/viewModels/PropuestaViewModel.ts
import { makeAutoObservable, runInAction } from "mobx";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import { GetConvocatoriaActivaUseCase } from "../../domain/GetConvocatoriaActivaUseCase";
import { CreatePropuestaUseCase, CreatePropuestaParams } from "../../domain/CreatePropuestaUseCase";
import { GetPropuestasByAlumnoUseCase } from "../../domain/GetPropuestasByAlumnoUseCase";
import { ConvocatoriaActiva, Propuesta, TutorAcademico } from "../../data/models/Propuesta";

export interface PropuestaFormData {
  // Step 1: Información del alumno
  academicTutorId: number | null;
  internshipType: string;
  
  // Step 2: Información de la empresa
  companyShortName: string; // Puede ser null en el backend, pero manejamos como string en el form
  companyLegalName: string;
  companyTaxId: string;
  
  // Dirección de la empresa
  companyState: string;
  companyMunicipality: string;
  companySettlementType: string;
  companySettlementName: string;
  companyStreetType: string;
  companyStreetName: string;
  companyExteriorNumber: string;
  companyInteriorNumber: string; // Puede ser null en el backend, pero manejamos como string en el form
  companyPostalCode: string;
  companyWebsite: string; // Puede ser null en el backend, pero manejamos como string en el form
  companyLinkedin: string; // Puede ser null en el backend, pero manejamos como string en el form
  
  // Información de contacto
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactArea: string;
  
  // Step 3: Supervisor del proyecto
  supervisorName: string;
  supervisorArea: string;
  supervisorEmail: string;
  supervisorPhone: string;
  
  // Step 4: Información del proyecto
  projectName: string;
  projectStartDate: Date | null;
  projectEndDate: Date | null;
  projectProblemContext: string;
  projectProblemDescription: string;
  projectGeneralObjective: string;
  projectSpecificObjectives: string;
  projectMainActivities: string;
  projectPlannedDeliverables: string;
  projectTechnologies: string;
}

export class PropuestaViewModel {
  // Estados de UI
  loading: boolean = false;
  submitting: boolean = false;
  error: string | null = null;
  isInitialized: boolean = false;
  currentStep: number = 1;

  // Estados de datos
  convocatoriaActiva: ConvocatoriaActiva | null = null;
  misPropuestas: Propuesta[] = [];
  lastCreatedPropuesta: Propuesta | null = null;

  // Estados específicos de carga
  loadingConvocatoria: boolean = false;
  loadingPropuestas: boolean = false;

  // Datos del formulario
  formData: PropuestaFormData = {
    academicTutorId: null,
    internshipType: '',
    
    companyShortName: '',
    companyLegalName: '',
    companyTaxId: '',
    
    companyState: '',
    companyMunicipality: '',
    companySettlementType: '',
    companySettlementName: '',
    companyStreetType: '',
    companyStreetName: '',
    company
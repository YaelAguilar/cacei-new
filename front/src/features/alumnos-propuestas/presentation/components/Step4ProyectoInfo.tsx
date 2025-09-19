// src/features/alumnos-propuestas/presentation/components/Step4ProyectoInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step4ValidationSchema } from '../validations/PropuestaSchema';

interface Step4ProyectoInfoProps {
  viewModel: PropuestaViewModel;
  onSubmit: () => void;
  onPrevious: () => void;
}

const Step4ProyectoInfo: React.FC<Step4ProyectoInfoProps> = observer(({ 
  viewModel, 
  onSubmit, 
  onPrevious 
}) => {
  const initialValues = {
    projectName: viewModel.formData.projectName || '',
    projectStartDate: viewModel.formatDateForInput(viewModel.formData.projectStartDate),
    projectEndDate: viewModel.formatDateForInput(viewModel.formData.projectEndDate),
    projectProblemContext: viewModel.formData.projectProblemContext || '',
    projectProblemDescription: viewModel.formData.projectProblemDescription || '',
    projectGeneralObjective: viewModel.formData.projectGeneralObjective || '',
    projectSpecificObjectives: viewModel.formData.projectSpecificObjectives || '',
    projectMainActivities: viewModel.formData.projectMainActivities || '',
    projectPlannedDeliverables: viewModel.formData.projectPlannedDeliverables || '',
    projectTechnologies: viewModel.formData.projectTechnologies || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      projectName: values.projectName,
      projectStartDate: viewModel.parseDateFromInput(values.projectStartDate),
      projectEndDate: viewModel.parseDateFromInput(values.projectEndDate),
      projectProblemContext: values.projectProblemContext,
      projectProblemDescription: values.projectProblemDescription,
      projectGeneralObjective: values.projectGeneralObjective,
      projectSpecificObjectives: values.projectSpecificObjectives,
      projectMainActivities: values.projectMainActivities,
      projectPlannedDeliverables: values.projectPlannedDeliverables,
      projectTechnologies: values.projectTechnologies
    });
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Proyecto</h2>
        <p className="text-gray-600">Describe detalladamente el proyecto que desarrollarás durante tu pasantía.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step4ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="space-y-6">
            {/* Información Básica del Proyecto */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Básica</h3>
              
              <div className="space-y-4">
                {/* Nombre del Proyecto */}
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="projectName"
                    name="projectName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Sistema de gestión de inventarios con React y Node.js"
                  />
                  <ErrorMessage name="projectName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Fechas del Proyecto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="projectStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="date"
                      id="projectStartDate"
                      name="projectStartDate"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="projectStartDate" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="projectEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="date"
                      id="projectEndDate"
                      name="projectEndDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="projectEndDate" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contexto y Problemática */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Contexto y Problemática</h3>
              
              <div className="space-y-4">
                {/* Contexto de la Problemática */}
                <div>
                  <label htmlFor="projectProblemContext" className="block text-sm font-medium text-gray-700 mb-2">
                    Contexto de la Problemática <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectProblemContext"
                    name="projectProblemContext"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe el contexto general de la empresa y el área donde se desarrollará el proyecto..."
                  />
                  <ErrorMessage name="projectProblemContext" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Explica la situación actual de la empresa relacionada con el proyecto
                  </p>
                </div>

                {/* Descripción de la Problemática */}
                <div>
                  <label htmlFor="projectProblemDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Problemática <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectProblemDescription"
                    name="projectProblemDescription"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe específicamente el problema que se busca resolver con este proyecto..."
                  />
                  <ErrorMessage name="projectProblemDescription" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Define claramente el problema específico a resolver
                  </p>
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Objetivos</h3>
              
              <div className="space-y-4">
                {/* Objetivo General */}
                <div>
                  <label htmlFor="projectGeneralObjective" className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo General <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectGeneralObjective"
                    name="projectGeneralObjective"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Desarrollar un sistema de gestión que permita..."
                  />
                  <ErrorMessage name="projectGeneralObjective" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Objetivo principal que se busca alcanzar con el proyecto
                  </p>
                </div>

                {/* Objetivos Específicos */}
                <div>
                  <label htmlFor="projectSpecificObjectives" className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos Específicos <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectSpecificObjectives"
                    name="projectSpecificObjectives"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1. Implementar módulo de autenticación&#10;2. Desarrollar interfaz de usuario intuitiva&#10;3. Crear API REST para gestión de datos&#10;..."
                  />
                  <ErrorMessage name="projectSpecificObjectives" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Lista detallada de objetivos específicos medibles
                  </p>
                </div>
              </div>
            </div>

            {/* Actividades y Entregables */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Actividades y Entregables</h3>
              
              <div className="space-y-4">
                {/* Actividades Principales */}
                <div>
                  <label htmlFor="projectMainActivities" className="block text-sm font-medium text-gray-700 mb-2">
                    Actividades Principales <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectMainActivities"
                    name="projectMainActivities"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe las actividades principales que realizarás durante la pasantía..."
                  />
                  <ErrorMessage name="projectMainActivities" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Actividades específicas que realizarás día a día
                  </p>
                </div>

                {/* Entregables Planeados */}
                <div>
                  <label htmlFor="projectPlannedDeliverables" className="block text-sm font-medium text-gray-700 mb-2">
                    Entregables Planeados <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="projectPlannedDeliverables"
                    name="projectPlannedDeliverables"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Aplicación web funcional, documentación técnica, manual de usuario, base de datos..."
                  />
                  <ErrorMessage name="projectPlannedDeliverables" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Productos concretos que entregarás al final del proyecto
                  </p>
                </div>
              </div>
            </div>

            {/* Tecnologías */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Tecnologías</h3>
              
              <div>
                <label htmlFor="projectTechnologies" className="block text-sm font-medium text-gray-700 mb-2">
                  Tecnologías a Utilizar <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  id="projectTechnologies"
                  name="projectTechnologies"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: React.js, Node.js, MySQL, Docker, Git, AWS, Bootstrap..."
                />
                <ErrorMessage name="projectTechnologies" component="div" className="text-red-500 text-xs mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Herramientas, lenguajes, frameworks y tecnologías que utilizarás
                </p>
              </div>
            </div>

            {/* Resumen completo de la propuesta */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Resumen Final de tu Propuesta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Tutor:</strong> {viewModel.selectedTutor?.getNombre() || 'No seleccionado'}</p>
                  <p><strong>Pasantía:</strong> {viewModel.formData.internshipType || 'No seleccionada'}</p>
                  <p><strong>Empresa:</strong> {viewModel.formData.companyShortName || 'Sin nombre'}</p>
                  <p><strong>Supervisor:</strong> {viewModel.formData.supervisorName || 'No especificado'}</p>
                </div>
                <div>
                  <p><strong>Contacto:</strong> {viewModel.formData.contactName || 'No especificado'}</p>
                  <p><strong>Área:</strong> {viewModel.formData.contactArea || 'No especificado'}</p>
                  <p><strong>Convocatoria:</strong> {viewModel.convocatoriaActiva?.getNombre() || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onPrevious}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                type="submit"
                disabled={!isValid || viewModel.submitting}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                  isValid && !viewModel.submitting
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {viewModel.submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {viewModel.submitting ? 'Registrando...' : 'Registrar Propuesta'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default Step4ProyectoInfo;
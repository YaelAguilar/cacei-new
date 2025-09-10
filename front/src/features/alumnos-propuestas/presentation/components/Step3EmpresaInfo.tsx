// src/features/alumnos-propuestas/presentation/components/Step3EmpresaInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step3ValidationSchema } from '../validations/PropuestaSchema';

interface Step3EmpresaInfoProps {
  viewModel: PropuestaViewModel;
  onSubmit: () => void;
  onPrevious: () => void;
}

const Step3EmpresaInfo: React.FC<Step3EmpresaInfoProps> = observer(({ 
  viewModel, 
  onSubmit, 
  onPrevious 
}) => {
  const initialValues = {
    nombreEmpresa: viewModel.formData.nombreEmpresa || '',
    sectorEmpresa: viewModel.formData.sectorEmpresa || '',
    personaContacto: viewModel.formData.personaContacto || '',
    paginaWebEmpresa: viewModel.formData.paginaWebEmpresa || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      nombreEmpresa: values.nombreEmpresa,
      sectorEmpresa: values.sectorEmpresa,
      personaContacto: values.personaContacto,
      paginaWebEmpresa: values.paginaWebEmpresa
    });
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de la Empresa</h2>
        <p className="text-gray-600">Proporciona los datos de la empresa donde realizarás tu pasantía.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step3ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="space-y-6">
            {/* Nombre de la Empresa */}
            <div>
              <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nombreEmpresa"
                name="nombreEmpresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: TechSolutions S.A. de C.V."
              />
              <ErrorMessage name="nombreEmpresa" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Sector de la Empresa */}
            <div>
              <label htmlFor="sectorEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                Sector de la Empresa <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="sectorEmpresa"
                name="sectorEmpresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Tecnología, Manufactura, Servicios, Educación..."
              />
              <ErrorMessage name="sectorEmpresa" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Persona de Contacto */}
            <div>
              <label htmlFor="personaContacto" className="block text-sm font-medium text-gray-700 mb-2">
                Persona de Contacto <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="personaContacto"
                name="personaContacto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del contacto principal en la empresa"
              />
              <ErrorMessage name="personaContacto" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Página Web de la Empresa (opcional) */}
            <div>
              <label htmlFor="paginaWebEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                Página Web de la Empresa (Opcional)
              </label>
              <Field
                type="url"
                id="paginaWebEmpresa"
                name="paginaWebEmpresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.ejemplo.com"
              />
              <ErrorMessage name="paginaWebEmpresa" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Resumen de la propuesta */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Resumen de tu Propuesta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Tutor:</strong> {viewModel.selectedTutor?.getNombre() || 'No seleccionado'}</p>
                  <p><strong>Pasantía:</strong> {viewModel.formData.tipoPasantia || 'No seleccionada'}</p>
                  <p><strong>Proyecto:</strong> {viewModel.formData.nombreProyecto || 'Sin nombre'}</p>
                </div>
                <div>
                  <p><strong>Fecha inicio:</strong> {viewModel.formData.fechaInicio ? viewModel.formatDateForInput(viewModel.formData.fechaInicio) : 'No definida'}</p>
                  <p><strong>Fecha fin:</strong> {viewModel.formData.fechaFin ? viewModel.formatDateForInput(viewModel.formData.fechaFin) : 'No definida'}</p>
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

export default Step3EmpresaInfo;
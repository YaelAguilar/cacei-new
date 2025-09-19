// src/features/alumnos-propuestas/presentation/components/Step3SupervisorInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step3ValidationSchema } from '../validations/PropuestaSchema';

interface Step3SupervisorInfoProps {
  viewModel: PropuestaViewModel;
  onNext: () => void;
  onPrevious: () => void;
}

const Step3SupervisorInfo: React.FC<Step3SupervisorInfoProps> = observer(({ 
  viewModel, 
  onNext, 
  onPrevious 
}) => {
  const initialValues = {
    supervisorName: viewModel.formData.supervisorName || '',
    supervisorArea: viewModel.formData.supervisorArea || '',
    supervisorEmail: viewModel.formData.supervisorEmail || '',
    supervisorPhone: viewModel.formData.supervisorPhone || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      supervisorName: values.supervisorName,
      supervisorArea: values.supervisorArea,
      supervisorEmail: values.supervisorEmail,
      supervisorPhone: values.supervisorPhone
    });
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supervisor del Proyecto</h2>
        <p className="text-gray-600">Información del supervisor que te guiará durante la realización del proyecto en la empresa.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step3ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Datos del Supervisor</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del Supervisor */}
                <div>
                  <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="supervisorName"
                    name="supervisorName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Ing. Carlos Ramírez Mendoza"
                  />
                  <ErrorMessage name="supervisorName" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre completo de la persona que supervisará tu proyecto
                  </p>
                </div>

                {/* Área del Supervisor */}
                <div>
                  <label htmlFor="supervisorArea" className="block text-sm font-medium text-gray-700 mb-2">
                    Área/Departamento <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="supervisorArea"
                    name="supervisorArea"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Desarrollo de Software, IT, Ingeniería"
                  />
                  <ErrorMessage name="supervisorArea" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Departamento o área donde trabaja el supervisor
                  </p>
                </div>

                {/* Email del Supervisor */}
                <div>
                  <label htmlFor="supervisorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    id="supervisorEmail"
                    name="supervisorEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="carlos.ramirez@empresa.com"
                  />
                  <ErrorMessage name="supervisorEmail" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Email para comunicación directa con el supervisor
                  </p>
                </div>

                {/* Teléfono del Supervisor */}
                <div>
                  <label htmlFor="supervisorPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="tel"
                    id="supervisorPhone"
                    name="supervisorPhone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="961-123-4567"
                  />
                  <ErrorMessage name="supervisorPhone" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Número de contacto directo del supervisor
                  </p>
                </div>
              </div>
            </div>

            {/* Información importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Importante</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• El supervisor será tu guía técnico durante el proyecto</li>
                <li>• Debe tener conocimientos en el área del proyecto</li>
                <li>• Se comunicará con tu tutor académico cuando sea necesario</li>
                <li>• Proporcionará retroalimentación sobre tu desempeño</li>
              </ul>
            </div>

            {/* Resumen de información previa */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Resumen de tu Propuesta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Tutor Académico:</strong> {viewModel.selectedTutor?.getNombre() || 'No seleccionado'}</p>
                  <p><strong>Tipo de Pasantía:</strong> {viewModel.formData.internshipType || 'No seleccionado'}</p>
                  <p><strong>Empresa:</strong> {viewModel.formData.companyShortName || 'Sin nombre'}</p>
                </div>
                <div>
                  <p><strong>Persona de Contacto:</strong> {viewModel.formData.contactName || 'No especificado'}</p>
                  <p><strong>Área de Contacto:</strong> {viewModel.formData.contactArea || 'No especificado'}</p>
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
                disabled={!isValid}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Siguiente
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default Step3SupervisorInfo;
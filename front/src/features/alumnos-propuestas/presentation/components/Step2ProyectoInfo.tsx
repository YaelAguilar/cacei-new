// src/features/alumnos-propuestas/presentation/components/Step2ProyectoInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step2ValidationSchema } from '../validations/PropuestaSchema';

interface Step2ProyectoInfoProps {
  viewModel: PropuestaViewModel;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2ProyectoInfo: React.FC<Step2ProyectoInfoProps> = observer(({ 
  viewModel, 
  onNext, 
  onPrevious 
}) => {
  const initialValues = {
    nombreProyecto: viewModel.formData.nombreProyecto || '',
    descripcionProyecto: viewModel.formData.descripcionProyecto || '',
    entregables: viewModel.formData.entregables || '',
    tecnologias: viewModel.formData.tecnologias || '',
    supervisorProyecto: viewModel.formData.supervisorProyecto || '',
    actividades: viewModel.formData.actividades || '',
    fechaInicio: viewModel.formatDateForInput(viewModel.formData.fechaInicio),
    fechaFin: viewModel.formatDateForInput(viewModel.formData.fechaFin)
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      nombreProyecto: values.nombreProyecto,
      descripcionProyecto: values.descripcionProyecto,
      entregables: values.entregables,
      tecnologias: values.tecnologias,
      supervisorProyecto: values.supervisorProyecto,
      actividades: values.actividades,
      fechaInicio: viewModel.parseDateFromInput(values.fechaInicio),
      fechaFin: viewModel.parseDateFromInput(values.fechaFin)
    });
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Proyecto</h2>
        <p className="text-gray-600">Describe los detalles de tu proyecto de pasantía.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step2ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="space-y-6">
            {/* Nombre del Proyecto */}
            <div>
              <label htmlFor="nombreProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nombreProyecto"
                name="nombreProyecto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Sistema de gestión de inventarios"
              />
              <ErrorMessage name="nombreProyecto" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Descripción del Proyecto */}
            <div>
              <label htmlFor="descripcionProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Proyecto <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="descripcionProyecto"
                name="descripcionProyecto"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe detalladamente en qué consiste el proyecto..."
              />
              <ErrorMessage name="descripcionProyecto" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Entregables */}
            <div>
              <label htmlFor="entregables" className="block text-sm font-medium text-gray-700 mb-2">
                Entregables <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="entregables"
                name="entregables"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Aplicación web funcional, documentación técnica, manual de usuario..."
              />
              <ErrorMessage name="entregables" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Tecnologías */}
            <div>
              <label htmlFor="tecnologias" className="block text-sm font-medium text-gray-700 mb-2">
                Tecnologías <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="tecnologias"
                name="tecnologias"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: React, Node.js, MySQL, Docker..."
              />
              <ErrorMessage name="tecnologias" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Supervisor del Proyecto */}
            <div>
              <label htmlFor="supervisorProyecto" className="block text-sm font-medium text-gray-700 mb-2">
                Supervisor del Proyecto <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="supervisorProyecto"
                name="supervisorProyecto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del supervisor en la empresa"
              />
              <ErrorMessage name="supervisorProyecto" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Actividades */}
            <div>
              <label htmlFor="actividades" className="block text-sm font-medium text-gray-700 mb-2">
                Actividades a Realizar <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                id="actividades"
                name="actividades"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe las actividades específicas que realizarás durante la pasantía..."
              />
              <ErrorMessage name="actividades" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <Field
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="fechaInicio" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <Field
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="fechaFin" component="div" className="text-red-500 text-xs mt-1" />
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

export default Step2ProyectoInfo;
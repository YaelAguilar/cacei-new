// src/features/alumnos-propuestas/presentation/components/Step1AlumnoInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step1ValidationSchema } from '../validations/PropuestaSchema';

interface Step1AlumnoInfoProps {
  viewModel: PropuestaViewModel;
  onNext: () => void;
}

const Step1AlumnoInfo: React.FC<Step1AlumnoInfoProps> = observer(({ viewModel, onNext }) => {
  const initialValues = {
    tutorAcademicoId: viewModel.formData.tutorAcademicoId || '',
    tipoPasantia: viewModel.formData.tipoPasantia || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      tutorAcademicoId: values.tutorAcademicoId ? Number(values.tutorAcademicoId) : null,
      tipoPasantia: values.tipoPasantia
    });
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Alumno</h2>
        <p className="text-gray-600">Selecciona tu tutor académico y el tipo de pasantía que deseas realizar.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step1ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid}) => (
          <Form className="space-y-6">
            {/* Tutor Académico */}
            <div>
              <label htmlFor="tutorAcademicoId" className="block text-sm font-medium text-gray-700 mb-2">
                Tutor Académico <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="tutorAcademicoId"
                name="tutorAcademicoId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona un tutor académico</option>
                {viewModel.tutoresDisponibles.map(tutor => (
                  <option key={tutor.getId()} value={tutor.getId()}>
                    {tutor.getNombre()} - {tutor.getEmail()}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tutorAcademicoId" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Tipo de Pasantía */}
            <div>
              <label htmlFor="tipoPasantia" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pasantía <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="tipoPasantia"
                name="tipoPasantia"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona el tipo de pasantía</option>
                {viewModel.pasantiasDisponibles.map(pasantia => (
                  <option key={pasantia} value={pasantia}>
                    {pasantia}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tipoPasantia" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Información de la convocatoria */}
            {viewModel.convocatoriaActiva && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Convocatoria: {viewModel.convocatoriaActiva.getNombre()}
                </h3>
                <div className="text-sm text-blue-700">
                  <p><strong>Tutores disponibles:</strong> {viewModel.tutoresDisponibles.length}</p>
                  <p><strong>Tipos de pasantía:</strong> {viewModel.pasantiasDisponibles.join(', ')}</p>
                </div>
              </div>
            )}

            {/* Botón Siguiente */}
            <div className="flex justify-end">
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

export default Step1AlumnoInfo;
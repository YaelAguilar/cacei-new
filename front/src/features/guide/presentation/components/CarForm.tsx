import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import { CarViewModel } from '../viewModels/CarViewModel';
import { CarValidationSchema } from '../validations/CarSchema';


interface CarFormProps {
  viewModel: CarViewModel;
}

/**
 * Formulario para crear o editar carros utilizando Formik y Yup para validaciones
 */
const CarForm: React.FC<CarFormProps> = observer(({ viewModel }) => {
  const isEditing = !!viewModel.selectedCar;
  const initialValues = isEditing && viewModel.selectedCar
    ? {
        make: viewModel.selectedCar.make,
        model: viewModel.selectedCar.model,
        year: viewModel.selectedCar.year,
        color: viewModel.selectedCar.color || '',
        licensePlate: viewModel.selectedCar.licensePlate || ''
      }
    : {
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: ''
      };

  const handleSubmit = async (values: any) => {
    if (isEditing && viewModel.selectedCar) {
      await viewModel.updateCar(viewModel.selectedCar.id, values);
    } else {
      await viewModel.createCar(values);
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={CarValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, isValid, touched, errors }) => (
          <Form className="space-y-4">
            {/* Campo Marca */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Marca *
              </label>
              <Field
                type="text"
                name="make"
                id="make"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  touched.make && errors.make ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage name="make" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Campo Modelo */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Modelo *
              </label>
              <Field
                type="text"
                name="model"
                id="model"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  touched.model && errors.model ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage name="model" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Campo Año */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Año *
              </label>
              <Field
                type="number"
                name="year"
                id="year"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  touched.year && errors.year ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage name="year" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Campo Color */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <Field
                type="text"
                name="color"
                id="color"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  touched.color && errors.color ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage name="color" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            {/* Campo Placa */}
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                Placa
              </label>
              <Field
                type="text"
                name="licensePlate"
                id="licensePlate"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  touched.licensePlate && errors.licensePlate ? 'border-red-500' : ''
                }`}
              />
              <ErrorMessage
                name="licensePlate"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Botones de acción */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => viewModel.closeModal()}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isValid
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting
                  ? 'Guardando...'
                  : isEditing
                  ? 'Actualizar'
                  : 'Crear'}
              </button>
            </div>

            {/* Mensaje de error general */}
            {viewModel.error && (
              <div className="p-2 mt-2 text-sm text-red-700 bg-red-100 rounded-md">
                {viewModel.error}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default CarForm;
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { ConvocatoriaViewModel } from "../viewModels/ConvocatoriaViewModel";
import { ConvocatoriaValidationSchema } from "../validations/ConvocatoriaSchema";
import { CreateConvocatoriaParams } from "../../domain/CreateConvocatoriaUseCase";

interface ConvocatoriaFormProps {
  viewModel: ConvocatoriaViewModel;
  onSuccess?: () => void;
}

interface FormValues {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  pasantiasSeleccionadas: string[];
}

const ConvocatoriaForm: React.FC<ConvocatoriaFormProps> = observer(({ viewModel, onSuccess }) => {
  const initialValues: FormValues = {
    nombre: "",
    descripcion: "",
    fechaLimite: "",
    pasantiasSeleccionadas: [],
  };

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    const params: CreateConvocatoriaParams = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      fechaLimite: values.fechaLimite,
      pasantiasSeleccionadas: values.pasantiasSeleccionadas,
    };

    const success = await viewModel.createConvocatoria(params);
    
    if (success) {
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handlePasantiaChange = (
    pasantia: string, 
    checked: boolean, 
    currentPasantias: string[], 
    setFieldValue: any
  ) => {
    if (checked) {
      if (!viewModel.canSelectMorePasantias(currentPasantias.length)) {
        return; // No permitir más de 5
      }
      setFieldValue("pasantiasSeleccionadas", [...currentPasantias, pasantia]);
    } else {
      setFieldValue("pasantiasSeleccionadas", currentPasantias.filter(p => p !== pasantia));
    }
  };

  const isFormDisabled = !viewModel.canSubmitForm();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-[20px] md:text-[28px] font-semibold text-black mb-4">
        Nueva Convocatoria
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={ConvocatoriaValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, isValid }) => (
          <Form className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-black text-sm font-bold mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nombre"
                name="nombre"
                disabled={isFormDisabled || isSubmitting}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Nombre de la convocatoria"
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-black text-sm font-bold mb-2">
                Descripción (Opcional)
              </label>
              <Field
                as="textarea"
                id="descripcion"
                name="descripcion"
                disabled={isFormDisabled || isSubmitting}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Descripción detallada de la convocatoria"
                rows={4}
              />
              <ErrorMessage
                name="descripcion"
                component="div"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>

            {/* Fecha límite */}
            <div>
              <label htmlFor="fechaLimite" className="block text-black text-sm font-bold mb-2">
                Fecha Límite <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs font-normal ml-2">
                  (Debe ser al menos 24 horas en el futuro)
                </span>
              </label>
              <Field
                type="datetime-local"
                id="fechaLimite"
                name="fechaLimite"
                disabled={isFormDisabled || isSubmitting}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                min={viewModel.getMinDatetime()}
              />
              <ErrorMessage
                name="fechaLimite"
                component="div"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>

            {/* Pasantías disponibles */}
            <div>
              <label className="block text-black text-sm font-bold mb-2">
                Pasantías disponibles para realizar <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs font-normal ml-2">
                  (Entre 1 y 5 pasantías, seleccionadas: {values.pasantiasSeleccionadas.length})
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {viewModel.opcionesPasantias.map((pasantia) => (
                  <div key={pasantia} className="flex items-center">
                    <input
                      type="checkbox"
                      id={pasantia}
                      checked={values.pasantiasSeleccionadas.includes(pasantia)}
                      onChange={(e) => handlePasantiaChange(
                        pasantia,
                        e.target.checked,
                        values.pasantiasSeleccionadas,
                        setFieldValue
                      )}
                      disabled={
                        isFormDisabled || 
                        isSubmitting || 
                        (!values.pasantiasSeleccionadas.includes(pasantia) && 
                         !viewModel.canSelectMorePasantias(values.pasantiasSeleccionadas.length))
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label htmlFor={pasantia} className="text-gray-700">
                      {pasantia}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage
                name="pasantiasSeleccionadas"
                component="div"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>

            {/* Botón de enviar */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!isValid || isFormDisabled || isSubmitting || viewModel.submitting}
                className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center
                            ${(!isValid || isFormDisabled || isSubmitting || viewModel.submitting) ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 focus:outline-none focus:shadow-outline"}`}
              >
                {(isSubmitting || viewModel.submitting) && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {(isSubmitting || viewModel.submitting) ? "Creando..." : "Crear Convocatoria"}
              </button>
            </div>

            {/* Error del ViewModel */}
            {viewModel.error && (
              <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                {viewModel.error}
              </div>
            )}

            {/* Información adicional */}
            {(viewModel.hasActiveConvocatoria || viewModel.profesores.length === 0) && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> El formulario está deshabilitado porque:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  {viewModel.hasActiveConvocatoria && (
                    <li>Ya existe una convocatoria activa</li>
                  )}
                  {viewModel.profesores.length === 0 && (
                    <li>No hay profesores disponibles</li>
                  )}
                </ul>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default ConvocatoriaForm;
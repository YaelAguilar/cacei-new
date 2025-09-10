import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { Convocatoria } from "../../data/models/Convocatoria";
import { VisualizarConvocatoriasViewModel } from "../viewModels/VisualizarConvocatoriasViewModel";
import { ConvocatoriaValidationSchema } from "../validations/ConvocatoriaSchema";
import { UpdateConvocatoriaParams } from "../../domain/UpdateConvocatoriaUseCase";

interface EditConvocatoriaFormProps {
  viewModel: VisualizarConvocatoriasViewModel;
  convocatoria: Convocatoria;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  pasantiasSeleccionadas: string[];
  actualizarProfesores: boolean;
}

// Helper para formatear la fecha para el input datetime-local
const formatDateTimeForInput = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const EditConvocatoriaForm: React.FC<EditConvocatoriaFormProps> = observer(({ 
  viewModel, 
  convocatoria, 
  onSuccess,
  onCancel
}) => {
  const initialValues: FormValues = {
    nombre: convocatoria.getNombre(),
    descripcion: convocatoria.getDescripcion() || "",
    fechaLimite: formatDateTimeForInput(convocatoria.getFechaLimite()),
    pasantiasSeleccionadas: convocatoria.getPasantiasDisponibles(),
    actualizarProfesores: false,
  };

  const handleSubmit = async (values: FormValues) => {
    const params: UpdateConvocatoriaParams = {
      uuid: convocatoria.getId(),
      ...values,
    };

    const success = await viewModel.updateConvocatoria(params);
    if (success) {
      onSuccess();
    }
  };

  const opcionesPasantias = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];

  return (
    <div className="mt-4">
      <Formik
        initialValues={initialValues}
        validationSchema={ConvocatoriaValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, isValid }) => (
          <Form className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-black text-sm font-bold mb-2">Nombre</label>
              <Field type="text" name="nombre" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"/>
              <ErrorMessage name="nombre" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-black text-sm font-bold mb-2">Descripción</label>
              <Field as="textarea" name="descripcion" rows={3} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"/>
            </div>

            {/* Fecha Límite */}
            <div>
              <label htmlFor="fechaLimite" className="block text-black text-sm font-bold mb-2">Fecha Límite</label>
              <Field type="datetime-local" name="fechaLimite" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"/>
              <ErrorMessage name="fechaLimite" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>

            {/* Pasantías */}
            <div>
              <label className="block text-black text-sm font-bold mb-2">Pasantías ({values.pasantiasSeleccionadas.length}/5)</label>
              <div className="grid grid-cols-2 gap-2">
                {opcionesPasantias.map(p => (
                  <label key={p} className="flex items-center">
                    <Field type="checkbox" name="pasantiasSeleccionadas" value={p} className="form-checkbox h-4 w-4 mr-2" />
                    {p}
                  </label>
                ))}
              </div>
              <ErrorMessage name="pasantiasSeleccionadas" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>

            {/* Actualizar Profesores */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <label className="flex items-center">
                    <Field type="checkbox" name="actualizarProfesores" className="form-checkbox h-4 w-4 mr-2" />
                    <span className="text-sm text-yellow-800">Actualizar la lista de tutores a la más reciente</span>
                </label>
                <p className="text-xs text-yellow-600 mt-1">Marque esta opción si desea reemplazar la lista de tutores guardada con la lista actual de profesores activos (PTC/Director).</p>
            </div>

            {/* Error del ViewModel */}
            {viewModel.error && (
              <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                {viewModel.error}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end pt-4 border-t gap-3">
              <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting || viewModel.isUpdating}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {viewModel.isUpdating ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default EditConvocatoriaForm;
// src/features/alumnos-propuestas/presentation/components/Step1AlumnoInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step1ValidationSchema } from '../validations/PropuestaSchema';
import { FiUser, FiMail, FiBookOpen } from 'react-icons/fi';

interface Step1AlumnoInfoProps {
  viewModel: PropuestaViewModel;
  onNext: () => void;
}

const Step1AlumnoInfo: React.FC<Step1AlumnoInfoProps> = observer(({ viewModel, onNext }) => {
  const initialValues = {
    academicTutorId: viewModel.formData.academicTutorId || '',
    internshipType: viewModel.formData.internshipType || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      academicTutorId: values.academicTutorId ? Number(values.academicTutorId) : null,
      internshipType: values.internshipType
    });
    onNext();
  };

         // NUEVA VALIDACIÓN: Verificar si hay propuesta bloqueante
         if (viewModel.hasPropuestaBloqueante) {
           const propuestaBloqueante = viewModel.propuestaBloqueante;
           const estado = propuestaBloqueante?.getEstatus();
           const esAprobada = estado === 'APROBADO';
           const necesitaActualizar = estado === 'ACTUALIZAR';
           const estaPendiente = estado === 'PENDIENTE';
           
           return (
             <div className="bg-white p-6 rounded-lg shadow-md">
               <div className="text-center py-8">
                 <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                   esAprobada ? 'bg-green-100' : 
                   necesitaActualizar ? 'bg-yellow-100' :
                   'bg-blue-100'
                 }`}>
                   <FiUser className={`w-8 h-8 ${
                     esAprobada ? 'text-green-600' : 
                     necesitaActualizar ? 'text-yellow-600' :
                     'text-blue-600'
                   }`} />
                 </div>
                 <h2 className={`text-xl font-bold mb-2 ${
                   esAprobada ? 'text-green-900' : 
                   necesitaActualizar ? 'text-yellow-900' :
                   'text-blue-900'
                 }`}>
                   {esAprobada ? 'Propuesta Ya Aprobada' : 
                    necesitaActualizar ? 'Propuesta Requiere Actualización' :
                    'Propuesta en Evaluación'}
                 </h2>
                 <p className={`text-sm mb-4 ${
                   esAprobada ? 'text-green-700' : 
                   necesitaActualizar ? 'text-yellow-700' :
                   'text-blue-700'
                 }`}>
                   {esAprobada 
                     ? 'Tu propuesta ya ha sido aprobada. No puedes crear una nueva propuesta en esta convocatoria.'
                     : necesitaActualizar
                     ? 'Tu propuesta actual requiere actualizaciones. Debes resolver las observaciones antes de crear una nueva propuesta.'
                     : 'Ya tienes una propuesta en evaluación. No puedes crear una nueva propuesta hasta que termine el proceso de evaluación.'
                   }
                 </p>
                 <div className={`border rounded-lg p-4 ${
                   esAprobada 
                     ? 'bg-green-50 border-green-200' 
                     : necesitaActualizar
                     ? 'bg-yellow-50 border-yellow-200'
                     : 'bg-blue-50 border-blue-200'
                 }`}>
                   <p className={`text-sm font-medium ${
                     esAprobada ? 'text-green-800' : 
                     necesitaActualizar ? 'text-yellow-800' :
                     'text-blue-800'
                   }`}>
                     Proyecto: {propuestaBloqueante?.getProyecto()?.getNombre() || 'Sin nombre'}
                   </p>
                   <p className={`text-xs mt-1 ${
                     esAprobada ? 'text-green-600' : 
                     necesitaActualizar ? 'text-yellow-600' :
                     'text-blue-600'
                   }`}>
                     Estado: {estado}
                   </p>
                 </div>
               </div>
             </div>
           );
         }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Alumno</h2>
        <p className="text-gray-600">Verifica tu información personal y selecciona tu tutor académico y el tipo de pasantía.</p>
      </div>

      {/* NUEVA SECCIÓN: Información Personal del Estudiante */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <FiUser className="w-5 h-5" />
          Tu Información Personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FiUser className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Nombre Completo</p>
            </div>
            <p className="text-blue-900 font-semibold text-lg">
              {viewModel.currentUserName}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FiMail className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Correo Electrónico</p>
            </div>
            <p className="text-blue-900 font-semibold break-all">
              {viewModel.currentUserEmail}
            </p>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-3">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <span>ℹ️</span>
            Esta información se incluirá automáticamente en tu propuesta y será visible para tu tutor académico y la empresa.
          </p>
        </div>
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <label htmlFor="academicTutorId" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                Tutor Académico <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="academicTutorId"
                name="academicTutorId"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Selecciona un tutor académico</option>
                {viewModel.tutoresDisponibles.map(tutor => (
                  <option key={tutor.getId()} value={tutor.getId()}>
                    {tutor.getNombre()} - {tutor.getEmail()}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="academicTutorId" component="div" className="text-red-500 text-xs mt-1" />
              <p className="text-xs text-gray-500 mt-2">
                Selecciona el profesor que te guiará académicamente durante tu pasantía.
              </p>
            </div>

            {/* Tipo de Pasantía */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label htmlFor="internshipType" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                Tipo de Pasantía <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="internshipType"
                name="internshipType"
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Selecciona el tipo de pasantía</option>
                {viewModel.pasantiasDisponibles.map(pasantia => (
                  <option key={pasantia} value={pasantia}>
                    {pasantia}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="internshipType" component="div" className="text-red-500 text-xs mt-1" />
              <p className="text-xs text-gray-500 mt-2">
                Selecciona el nivel de pasantía que corresponde a tu programa académico.
              </p>
            </div>

            {/* Información de la convocatoria */}
            {viewModel.convocatoriaActiva && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  Convocatoria Actual
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-green-800">Nombre: </span>
                    <span className="text-green-900 font-semibold">{viewModel.convocatoriaActiva.getNombre()}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-sm font-medium text-green-800">Tutores disponibles: </span>
                      <span className="text-green-900 font-semibold">{viewModel.tutoresDisponibles.length}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-800">Tipos de pasantía: </span>
                      <span className="text-green-900 font-semibold">{viewModel.pasantiasDisponibles.length}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                    <strong>Tipos disponibles:</strong> {viewModel.pasantiasDisponibles.join(', ')}
                  </div>
                </div>
              </div>
            )}

            {/* Botón Siguiente */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={!isValid}
                className={`px-8 py-3 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuar al Paso 2
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default Step1AlumnoInfo;
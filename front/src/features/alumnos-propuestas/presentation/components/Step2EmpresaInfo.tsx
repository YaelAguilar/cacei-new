// src/features/alumnos-propuestas/presentation/components/Step2EmpresaInfo.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropuestaViewModel } from '../viewModels/PropuestaViewModel';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Step2ValidationSchema } from '../validations/PropuestaSchema';

interface Step2EmpresaInfoProps {
  viewModel: PropuestaViewModel;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2EmpresaInfo: React.FC<Step2EmpresaInfoProps> = observer(({ 
  viewModel, 
  onNext, 
  onPrevious 
}) => {
  const initialValues = {
    companyShortName: viewModel.formData.companyShortName || '',
    companyLegalName: viewModel.formData.companyLegalName || '',
    companyTaxId: viewModel.formData.companyTaxId || '',
    companyState: viewModel.formData.companyState || '',
    companyMunicipality: viewModel.formData.companyMunicipality || '',
    companySettlementType: viewModel.formData.companySettlementType || '',
    companySettlementName: viewModel.formData.companySettlementName || '',
    companyStreetType: viewModel.formData.companyStreetType || '',
    companyStreetName: viewModel.formData.companyStreetName || '',
    companyExteriorNumber: viewModel.formData.companyExteriorNumber || '',
    companyInteriorNumber: viewModel.formData.companyInteriorNumber || '',
    companyPostalCode: viewModel.formData.companyPostalCode || '',
    companyWebsite: viewModel.formData.companyWebsite || '',
    companyLinkedin: viewModel.formData.companyLinkedin || '',
    contactName: viewModel.formData.contactName || '',
    contactPosition: viewModel.formData.contactPosition || '',
    contactEmail: viewModel.formData.contactEmail || '',
    contactPhone: viewModel.formData.contactPhone || '',
    contactArea: viewModel.formData.contactArea || ''
  };

  const handleSubmit = (values: any) => {
    viewModel.updateFormData({
      companyShortName: values.companyShortName,
      companyLegalName: values.companyLegalName,
      companyTaxId: values.companyTaxId,
      companyState: values.companyState,
      companyMunicipality: values.companyMunicipality,
      companySettlementType: values.companySettlementType,
      companySettlementName: values.companySettlementName,
      companyStreetType: values.companyStreetType,
      companyStreetName: values.companyStreetName,
      companyExteriorNumber: values.companyExteriorNumber,
      companyInteriorNumber: values.companyInteriorNumber,
      companyPostalCode: values.companyPostalCode,
      companyWebsite: values.companyWebsite,
      companyLinkedin: values.companyLinkedin,
      contactName: values.contactName,
      contactPosition: values.contactPosition,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      contactArea: values.contactArea
    });
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de la Empresa</h2>
        <p className="text-gray-600">Proporciona los datos completos de la empresa donde realizarás tu pasantía.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={Step2ValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="space-y-6">
            {/* Información Básica de la Empresa */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyShortName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Comercial <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyShortName"
                    name="companyShortName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: TechSolutions"
                  />
                  <ErrorMessage name="companyShortName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyLegalName" className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyLegalName"
                    name="companyLegalName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: TechSolutions S.A. de C.V."
                  />
                  <ErrorMessage name="companyLegalName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyTaxId" className="block text-sm font-medium text-gray-700 mb-2">
                    RFC <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyTaxId"
                    name="companyTaxId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: TSO123456ABC"
                  />
                  <ErrorMessage name="companyTaxId" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            </div>

            {/* Dirección de la Empresa */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Dirección</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyState" className="block text-sm font-medium text-gray-700 mb-2">
                    Entidad Federativa <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyState"
                    name="companyState"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Chiapas"
                  />
                  <ErrorMessage name="companyState" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyMunicipality" className="block text-sm font-medium text-gray-700 mb-2">
                    Demarcación Territorial <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyMunicipality"
                    name="companyMunicipality"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Tuxtla Gutiérrez"
                  />
                  <ErrorMessage name="companyMunicipality" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companySettlementType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Asentamiento <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="companySettlementType"
                    name="companySettlementType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Colonia">Colonia</option>
                    <option value="Fraccionamiento">Fraccionamiento</option>
                    <option value="Barrio">Barrio</option>
                    <option value="Centro">Centro</option>
                    <option value="Zona Industrial">Zona Industrial</option>
                  </Field>
                  <ErrorMessage name="companySettlementType" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companySettlementName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Asentamiento <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companySettlementName"
                    name="companySettlementName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Centro"
                  />
                  <ErrorMessage name="companySettlementName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyStreetType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vialidad <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="companyStreetType"
                    name="companyStreetType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Calle">Calle</option>
                    <option value="Avenida">Avenida</option>
                    <option value="Boulevard">Boulevard</option>
                    <option value="Carretera">Carretera</option>
                    <option value="Privada">Privada</option>
                  </Field>
                  <ErrorMessage name="companyStreetType" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyStreetName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Vía <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyStreetName"
                    name="companyStreetName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Central"
                  />
                  <ErrorMessage name="companyStreetName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyExteriorNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Número Exterior <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyExteriorNumber"
                    name="companyExteriorNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 123"
                  />
                  <ErrorMessage name="companyExteriorNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyInteriorNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Número Interior (Opcional)
                  </label>
                  <Field
                    type="text"
                    id="companyInteriorNumber"
                    name="companyInteriorNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: A, 2, 101"
                  />
                  <ErrorMessage name="companyInteriorNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyPostalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="companyPostalCode"
                    name="companyPostalCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 29000"
                  />
                  <ErrorMessage name="companyPostalCode" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            </div>

            {/* Enlaces Web */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Enlaces Web (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Página Web
                  </label>
                  <Field
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.empresa.com"
                  />
                  <ErrorMessage name="companyWebsite" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="companyLinkedin" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <Field
                    type="url"
                    id="companyLinkedin"
                    name="companyLinkedin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/company/empresa"
                  />
                  <ErrorMessage name="companyLinkedin" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Persona de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="contactName"
                    name="contactName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: María González López"
                  />
                  <ErrorMessage name="contactName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-2">
                    Puesto <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="contactPosition"
                    name="contactPosition"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Gerente de Recursos Humanos"
                  />
                  <ErrorMessage name="contactPosition" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="maria.gonzalez@empresa.com"
                  />
                  <ErrorMessage name="contactEmail" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="961-123-4567"
                  />
                  <ErrorMessage name="contactPhone" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label htmlFor="contactArea" className="block text-sm font-medium text-gray-700 mb-2">
                    Área/Departamento <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="contactArea"
                    name="contactArea"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Recursos Humanos, IT, Desarrollo"
                  />
                  <ErrorMessage name="contactArea" component="div" className="text-red-500 text-xs mt-1" />
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

export default Step2EmpresaInfo;
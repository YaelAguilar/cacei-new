import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { RoleViewModel } from "../viewModels/RoleViewModel";
import { RoleValidationSchema } from "../validations/RoleSchema";
import Button from "../../../shared/components/Button";
import WrapperInput from "../../../shared/components/WrapperInput";

interface RoleFormProps {
  viewModel: RoleViewModel;
}

const RoleForm: React.FC<RoleFormProps> = observer(({ viewModel }) => {
  const isEditing = !!viewModel.selectedRole;
  const initialValues =
    isEditing && viewModel.selectedRole
      ? {
          name: viewModel.selectedRole.attributes.name,
          description: viewModel.selectedRole.attributes.description,
        }
      : {
          name: "",
          description: "",
        };

  const handleSubmit = async (values: any) => {
    if (isEditing && viewModel.selectedRole) {
      console.log("Aqui deberia de editar");
      console.log("ID: ", viewModel.selectedRole.id);
      console.log("Values: ", values);
    } else {
      await viewModel.createRole(values);
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={RoleValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4">
            {/* Campo Marca */}
            <div>
              <WrapperInput
                type="text"
                name="name"
                id="name"
                label="Nombre del Rol"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Campo Modelo */}
            <div>
              <WrapperInput
                type="text"
                name="description"
                id="description"
                label="Descripción"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          
            {/* Botones de acción */}
            <div className="pt-4 flex justify-end space-x-3">
              <Button
                isAdd={false}
                onClick={() => viewModel.closeModal()}
                label="Cancelar"
                type="button"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                isAdd={true}
                label={
                  isSubmitting
                    ? "Guardando..."
                    : isEditing
                    ? "Actualizar"
                    : "Guardar"
                }
              />
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

export default RoleForm;

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import { MenuViewModel } from "../viewModels/MenuViewModel";
import Button from "../../../shared/components/Button";
import WrapperInput from "../../../shared/components/WrapperInput";
import WrapperSelect from "../../../shared/components/WrapperSelect";
import { MenuValidationSchema } from "../validations/MenuSchema";

interface MenuFormProps {
  viewModel: MenuViewModel;
}

// Componente interno para manejar la lógica condicional
const ConditionalComponentName: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    // Si is_navegable cambia a false, resetear component_name a null
    if (values.is_navegable === false) {
      setFieldValue('component_name', null);
    }
  }, [values.is_navegable, setFieldValue]);

  // Solo mostrar el campo si is_navegable es true
  if (values.is_navegable !== true) {
    return null;
  }

  return (
    <div>
      <WrapperInput
        type="text"
        name="component_name"
        id="component_name"
        label="Nombre vista"
        tooltip="El nombre del componente que se renderizará, debe ser en PascalCase."
      />
      <ErrorMessage
        name="component_name"
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
};

const MenuForm: React.FC<MenuFormProps> = observer(({ viewModel }) => {
  const isEditing = !!viewModel.selectedMenu;
  const initialValues =
    isEditing && viewModel.selectedMenu
      ? {
        name: viewModel.selectedMenu.name,
        description: viewModel.selectedMenu.description,
        icon: viewModel.selectedMenu.icon,
        path: viewModel.selectedMenu.path,
        order: viewModel.selectedMenu.order,
        is_navegable: viewModel.selectedMenu.is_navegable,
        component_name: viewModel.selectedMenu.component_name,
        feature_name: viewModel.selectedMenu.feature_name,
      }
      : {
        name: "",
        description: "",
        icon: "",
        path: "",
        order: "",
        is_navegable: false,
        component_name: null,
        feature_name: "",
      };

  const menuOptions = [
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ];

  const handleSubmit = async (values: any) => {
    // Asegurar que component_name sea null si is_navegable es false
    const formattedValues = {
      ...values,
      component_name: values.is_navegable === true ? values.component_name : null
    };

    if (isEditing && viewModel.selectedMenu) {
      await viewModel.updateMenu(formattedValues);
    } else {
      await viewModel.createMenu(formattedValues);
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={MenuValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, isValid}) => (
          <Form className="space-y-4">
            <div>
              <WrapperInput
                type="text"
                name="name"
                id="name"
                label="Nombre del Menú"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

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

            <div>
              <WrapperInput
                type="text"
                name="icon"
                id="icon"
                label="Icono"
                tooltip="El icono se obtiene de react-icons, de la colección Lucide"
              />
              <ErrorMessage
                name="icon"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <WrapperInput
                type="text"
                name="path"
                id="path"
                label="Path"
                tooltip="Dirección que aparece en la URL al navegar a este menú."
              />
              <ErrorMessage
                name="path"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <WrapperInput
                type="text"
                name="feature_name"
                id="feature_name"
                label="Agrupador"
                tooltip="Este es el nombre de la carpeta del componente que agrupara el menú. Debe de estar en kebab-case."
              />
              <ErrorMessage
                name="feature_name"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <WrapperSelect
                name="is_navegable"
                id="is_navegable"
                label="Es Navegable"
                options={menuOptions}
                disabled={viewModel.isLoading}
                placeholder="Selecciona una opción"
                isClearable={false}
              />
              <ErrorMessage
                name="is_navegable"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Componente condicional para component_name */}
            <ConditionalComponentName />

            <div>
              <WrapperInput
                type="text"
                name="order"
                id="order"
                label="Orden"
              />
              <ErrorMessage
                name="order"
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

export default MenuForm;
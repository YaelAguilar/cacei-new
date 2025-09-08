import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Form, ErrorMessage } from "formik";
import { SubmenuViewModel } from "../viewModels/SubmenuViewModel";
import { MenuViewModel } from "../viewModels/MenuViewModel";
import { SubmenuValidationSchema } from "../validations/SubmenuSchema";
import Button from "../../../shared/components/Button";
import WrapperInput from "../../../shared/components/WrapperInput";
import WrapperSelect from "../../../shared/components/WrapperSelect";

interface SubmenuFormProps {
  viewModel: SubmenuViewModel;
  menuViewModel: MenuViewModel;
}

const SubmenuForm: React.FC<SubmenuFormProps> = observer(
  ({ viewModel, menuViewModel }) => {
    const isEditing = !!viewModel.selectedSubmenu;

    useEffect(() => {
      if (menuViewModel.menus.length === 0) {
        menuViewModel.loadMenus();
      }
    }, [menuViewModel]);

    const initialValues =
      isEditing && viewModel.selectedSubmenu
        ? {
          name: viewModel.selectedSubmenu.name,
          description: viewModel.selectedSubmenu.description,
          component_name: viewModel.selectedSubmenu.component_name,
          path: viewModel.selectedSubmenu.path,
          order: viewModel.selectedSubmenu.order,
          menuId: viewModel.selectedSubmenu.menuId,
        }
        : {
          name: "",
          description: "",
          component_name: null,
          path: "",
          order: "",
          menuId: viewModel.selectedMenu ? viewModel.selectedMenu.uuid : "",
        };

    const menuOptions = menuViewModel.menus
      .filter(menu => menu.active && !menu.is_navegable)
      .map((menu) => ({
        value: menu.uuid,
        label: menu.name,
      }));

    const menuName =
      isEditing && viewModel.selectedSubmenu
        ? menuViewModel.menus.find(
          (m) => m.uuid === viewModel.selectedSubmenu?.menuId
        )?.name || "Menú no encontrado"
        : "";

    const handleSubmit = async (values: any) => {
      if (isEditing && viewModel.selectedSubmenu) {
        console.log("Actualizando")
        console.log(values);
        await viewModel.updateSubmenu(values);
      } else {
        console.log("Nuevo Submenú")
        console.log(values);
        await viewModel.createSubmenu(values);
      }
    };
    return (
      <div className="p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={SubmenuValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, isValid}) => (
            <Form className="space-y-4">
              {!isEditing && (
                <WrapperSelect
                  name="menuId"
                  id="menuId"
                  label="Menú"
                  options={menuOptions}
                  disabled={menuViewModel.isLoading}
                  placeholder="Selecciona un menú"
                  isClearable={false}
                />
              )}
              {isEditing && viewModel.selectedSubmenu && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-4">
                  <label className="text-sm text-gray-700 w-full md:w-1/4">
                    Menú
                  </label>
                  <div className="w-full md:w-3/4 rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-700">
                    {menuName}
                  </div>
                </div>
              )}
              <div>
                <WrapperInput
                  type="text"
                  name="name"
                  id="name"
                  label="Nombre del Submenú"
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

              <div>
                <WrapperInput type="text" name="path" id="path" label="Path" tooltip="Dirección que aparece junto con la URL principal del Menú." />
                <ErrorMessage
                  name="path"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

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
  }
);

export default SubmenuForm;

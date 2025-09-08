import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { SubmenuViewModel } from "../viewModels/SubmenuViewModel";
import CardMenu from "../../../shared/components/CardMenu";

interface SubmenuViewProps {
  viewModel: SubmenuViewModel;
}

const SubmenuView: React.FC<SubmenuViewProps> = observer(({ viewModel }) => {
  useEffect(() => {
    viewModel.loadSubmenus();
  }, [viewModel]);

  return (
    <div className="pb-10">
      {viewModel.isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!viewModel.isLoading && viewModel.menusWithSubmenus.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay menús o submenús disponibles.</p>
        </div>
      ) : (
        viewModel.menusWithSubmenus.map(({ menu, submenus }) => (
          <div key={menu.uuid} className="mt-6 space-y-3">
            <h1 className="text-xl font-light text-gray-500 mb-2">
              {menu.name} - {menu.description}
            </h1>
            <hr className="text-[#D7D7D7]" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {submenus.map((submenu) => (
                <CardMenu
                      key={submenu.uuid}
                      id={submenu.description}
                      name={submenu.name}
                      isActive={submenu.active}
                      component_name={submenu.component_name}
                      ruta={submenu.path}
                      orden={submenu.order}
                      onEdit={() => viewModel.prepareForEditSubmenu(submenu)}
                      onDelete={() => console.log("Eliminar submenu")}
                      onToggle={() => viewModel.toggleSubmenuStatus(submenu.uuid, submenu.menuId)}            
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
});

export default SubmenuView;

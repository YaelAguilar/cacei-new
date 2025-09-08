import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { MenuViewModel } from "../viewModels/MenuViewModel";
import CardMenu from "../../../shared/components/CardMenu";

interface MenuViewProps {
  viewModel: MenuViewModel;
}

const MenuView: React.FC<MenuViewProps> = observer(({ viewModel }) => {

  useEffect(() => {
    viewModel.loadMenus();
  }, [viewModel]);

  return (
    <>
      {viewModel.isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 my-14">
          {viewModel.menus.map((menu) => (
            <CardMenu
              key={menu.uuid}
              id={menu.description}
              name={menu.name}
              icon={menu.icon}
              isActive={menu.active}
              isNavegable={menu.is_navegable}
              component_name={menu.component_name}
              feature_name={menu.feature_name}
              submenus={(menu as any).submenuCount || 0}
              ruta={menu.path}
              backgroundColor="bg-[#4974d0]"
              orden={menu.order}
              onEdit={() => viewModel.prepareForEdit(menu)}
              onDelete={() => console.log("Eliminar")}
              onToggle={() => viewModel.toggleMenuStatus(menu.uuid)}
            />
          ))}
        </section>
      )}
    </>
  );
});

export default MenuView;

import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import MainContainer from "../../../shared/layout/MainContainer";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa";
import Modal from "../../../shared/layout/Modal";
import { NavigationSettingsViewModel } from "../viewModels/NavigationSettingsViewModel";
import MenuView from "./MenuView";
import SubmenuView from "./SubmenuView";
import MenuForm from "../components/MenuForm";
import SubmenuForm from "../components/SubmenuForm";

const NavigationSettings: React.FC = observer(() => {
  const viewModel = useMemo(() => new NavigationSettingsViewModel(), []);

  return (
    <MainContainer>
      <div className=" mt-5 mb-10">
        <section className="flex justify-between items-center">
          <div className="poppins">
            <h1 className=" text-[23px] md:text-[36px] font-semibold text-blackk">
              Configuración de navegación
            </h1>
            <p className=" text-[14px] md:text-[24px] font-light text-black">
              Administra las opciones principales del menú y submenú de
              navegación.
            </p>
          </div>
          <Button
            isAdd={true}
            onClick={() => viewModel.prepareForCreate()}
            label={viewModel.mainActionLabel}
            type="button"
            icon={<FaPlus className="text-white" />}
          />
        </section>
        <section className="flex border-b border-[#D7D7D7] mt-6">
          <button
            onClick={() => viewModel.setActiveTab("menu")}
            className={`mr-4 pb-2 px-2 border-b-2 transition-all cursor-pointer ${
              viewModel.isActiveTab("menu")
                ? "border-[#5800FF] text-[#5800FF]"
                : "border-transparent text-gray-500"
            }`}
          >
            Menú
          </button>
          <button
            onClick={() => viewModel.setActiveTab("submenu")}
            className={`pb-2 px-2 border-b-2 transition-all cursor-pointer ${
              viewModel.isActiveTab("submenu")
                ? "border-[#5800FF] text-[#5800FF]"
                : "border-transparent text-gray-500"
            }`}
          >
            Submenús
          </button>
        </section>
        <div className="mt-6">
          {viewModel.isActiveTab("menu") ? <MenuView viewModel={viewModel.menuViewModel}/> : <SubmenuView viewModel={viewModel.submenuViewModel}/>}
        </div>

        {viewModel.isModalOpen && (
          <Modal
            title={viewModel.modalTitle}
            subtitle={viewModel.modalSubtitle}
            onClose={() => viewModel.closeModal()}
          >
            {viewModel.isActiveTab("menu") ? (
              <MenuForm viewModel={viewModel.menuViewModel} />
            ) : (
              <SubmenuForm viewModel={viewModel.submenuViewModel} menuViewModel={viewModel.menuViewModel}/>
            )}
          </Modal>
        )}
      </div>
    </MainContainer>
  );
});

export default NavigationSettings;

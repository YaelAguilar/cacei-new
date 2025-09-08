import MainContainer from "../../../shared/layout/MainContainer";
import CardUser from "../../../shared/components/CardUser";
import RoleCard from "../../../shared/components/RoleCard";
import Modal from "../../../shared/layout/Modal";
import { AnimatePresence } from "framer-motion";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import CardMenu from "../../../shared/components/CardMenu";

const Guide = () => {
  const [OpenModal, setOpenModal] = useState(Boolean); //Esto es un ejemplo, no quedara asi guiarse de cars.tsx con su viewModel

  return (
    <MainContainer>
      <div className=" mt-5 mb-10">
        <div className="poppins">
          {" "}
          {/* <------ Poppins es la fuente que se usa para los titulos y descripción por el momento  */}
          <h1 className=" text-[23px] md:text-[36px] font-semibold text-black">
            Administración
          </h1>
          <p className=" text-[14px] md:text-[24px] font-light text-black">
            Únicamente los que existen en el sistema.
          </p>
        </div>

        <div className=" my-9 space-y-3">
          <h1 className="text-[20px] text-[#676767] poppins">
            Card de usuarios
          </h1>
          <hr className="text-[#D7D7D7]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 my-14">
          <CardUser
            title="Ingeniería en TI Digital"
            name="Luisa Pérez"
            email="luisa.perez@example.com"
            employeeNumber="976-222-32-22"
            date="03/04/2025"
            imageUrl="https://img.freepik.com/foto-gratis/primer-plano-joven-profesional-haciendo-contacto-visual-contra-fondo-color_662251-651.jpg?t=st=1744863511~exp=1744867111~hmac=f58a5973015d6a92177db8ed3dc35fed29b88a42441bfe45431e3c6f25625f24&w=740"
            badgeText="APE"
            action={() => console.log("Card User 1 clicked")} //Aqui ira la función que viene de su viewModel
          />
        </div>

        <div className=" my-9 space-y-3">
          <h1 className="text-[20px] text-[#676767] poppins">Cards de roles</h1>
          <hr className="text-[#D7D7D7]" />
        </div>

        <div className="grid gap-5">
          <RoleCard
            roleName="Admin SYS"
            backgroundColor="bg-indigo-600"
            description="Acceso completo al sistema"
            permissions={{ menus: 3, submenus: 3 }}
            usersCount={1}
            onClick={() => setOpenModal(true)} //Aqui ira la función que viene de su viewModel, en este caso es la parte para abrir el modal.
          />
          <RoleCard
            roleName="Admin PE"
            backgroundColor="bg-emerald-600"
            description="Puede editar contenido pero no configuraciones"
            permissions={{ menus: 2, submenus: 3 }}
            usersCount={2}
            onClick={() => setOpenModal(true)} //Aqui ira la función que viene de su viewModel este es unicamente un ejemplo, si fuera pare edición tendriamos que pasarle el ID
          />
        </div>

        <div className=" my-9 space-y-3">
          <h1 className="text-[20px] text-[#676767] poppins">
            Tipos de Botones
          </h1>
          <hr className="text-[#D7D7D7]" />
        </div>

        <div className="flex items-center space-x-5 ">
          {/* EJEMPLO CON ICONOS */}
          <Button
            isAdd={true}
            onClick={() => console.log("Hola  click de agrear")}
            label="Agregar"
            type="button"
            icon={<FaPlus className="text-white" />}
          />

          {/* EJEMPLO SIN ICONOS */}
          <Button
            isAdd={false}
            onClick={() => console.log("Hola  click de cancelar")}
            label="Cancelar"
            type="button"
          />

          <Button
            isAdd={true}
            onClick={() => console.log("Hola  click de cancelar")}
            label="Guardar"
            type="button"
          />
        </div>

        <div className=" my-9 space-y-3">
          <h1 className="text-[20px] text-[#676767] poppins">Cards Menú</h1>
          <hr className="text-[#D7D7D7]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 my-14">
          <CardMenu
            id="001"
            name="Hola"
            icon={"<MdOutlineDashboard/>"}
            submenus={3}
            ruta="/dashboard"
            backgroundColor="bg-green-500"
            orden={1}
            onEdit={() => console.log("Editar")}
            onDelete={() => console.log("Eliminar")}
          />

          <CardMenu
            id="001"
            name="Hola"
            icon={"<MdOutlineDashboard/>"}
            submenus={3}
            ruta="/dashboard"
            backgroundColor="bg-blue-500"
            orden={1}
            onEdit={() => console.log("Editar")}
            onDelete={() => console.log("Eliminar")}
          />

          <CardMenu
            id="001"
            name="Hola"
            icon={"<MdOutlineDashboard/>"}
            submenus={3}
            ruta="/dashboard"
            backgroundColor="bg-fuchsia-500"
            orden={1}
            onEdit={() => console.log("Editar")}
            onDelete={() => console.log("Eliminar")}
          />
        </div>
      </div>

      {OpenModal && (
        <AnimatePresence>
          <Modal
            title="Información del Rol"
            subtitle="Ingresa los detalles para crear un nuevo rol de usuario."
            onClose={() => setOpenModal(false)}
          />
        </AnimatePresence>
      )}
    </MainContainer>
  );
};

export default Guide;

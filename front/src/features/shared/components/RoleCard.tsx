import React from "react";
import { FiChevronRight } from "react-icons/fi";

type Props = {
  roleName: string;
  backgroundColor: string;
  description: string;
  permissions: {
    menus: number;
    submenus: number;
  };
  usersCount: number;
  onClick: () => void;
};

const RoleCard: React.FC<Props> = ({
  roleName,
  backgroundColor,
  description,
  permissions,
  usersCount,
  onClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Left section with role name and user count */}
      <div
        className={`w-full md:w-auto md:min-w-[320px] p-6 flex flex-col justify-between ${backgroundColor}`}
      >
        <div>
          <p className="text-white opacity-65 text-sm font-medium mb-2">Rol</p>
          <h3 className="text-white text-2xl font-bold">{roleName}</h3>
        </div>

        <div
          className="rounded-full py-1 px-3 self-start mt-4 md:mt-0"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
        >
          <span className="text-white">
            {usersCount} usuario{usersCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Right section with description, permissions and arrow */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 md:p-5 w-full">
        <section className="w-full md:flex-grow p-2 md:p-6 mb-4 md:mb-0">
          <p className="text-gray-600 text-sm mb-2">Descripción:</p>
          <p className="text-black">{description}</p>
        </section>

        <section className="w-full md:flex-grow p-2 md:p-6 mb-4 md:mb-0">
          <p className="text-gray-600 text-sm mb-2">Permisos:</p>
          <p className="text-black">
            {permissions.menus} menús, {permissions.submenus} submenús
          </p>
        </section>

        <div className="flex justify-end p-2 w-full">
          <div className="md:w-auto w-full">
            <button onClick={onClick} className="w-full text-gray-600 font-medium bg-white hover:bg-gray-50 py-2 px-6 rounded-md transition-all shadow-sm hover:shadow md:hidden">
              Ver más
            </button>
            <button onClick={onClick} className="hidden md:flex justify-center items-center text-gray-400 cursor-pointer w-full h-full">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;

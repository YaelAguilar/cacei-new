import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { RolePermissionsViewModel } from "../viewModels/RolePermissionsViewModel";
import ToggleProps from "../../../shared/components/ToggleProps";
import MainContainer from "../../../shared/layout/MainContainer";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../shared/components/Button";
import { IoMdArrowRoundBack } from "react-icons/io";


const RolePermissionsView: React.FC = observer(() => {
  const { roleId } = useParams<{ roleId: string }>();
  const [viewModel] = useState(() => new RolePermissionsViewModel());
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (roleId) {
      viewModel.setRoleId(roleId);
    }
  }, [roleId, viewModel]);

  const toggleMenuExpansion = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <MainContainer>
      <div className="mt-5 mb-10">
        <section className="flex justify-between items-center">
          <div className="poppins">
            <h1 className=" text-[23px] md:text-[36px] font-semibold text-blackk">
              Asignación de Permisos
            </h1>
            <p className=" text-[14px] md:text-[24px] font-light text-black">
              Administra los permisos del rol en el sistema.
            </p>
          </div>
          <Button
            isAdd={true}
            onClick={() => navigate(`/roles`)}
            label="Regresar"
            type="button"
            icon={<IoMdArrowRoundBack className="text-white" />}
          />
        </section>

        <AnimatePresence>
          {viewModel.loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="my-8 space-y-4"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow animate-pulse flex items-center gap-4"
                >
                  <div className="h-6 w-6 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {viewModel.error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{viewModel.error}</p>
          </div>
        )}

        {!viewModel.loading && viewModel.rolePermissions && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden divide-y divide-gray-200 mt-5">
            {viewModel.rolePermissions.availablePermissions.menus.map(
              (menu) => {
                const isExpanded = expandedMenus[menu.uuid];

                return (
                  <div key={menu.uuid}>
                    {/* Cabecera del menú */}
                    <div
                      className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                        menu.submenus.length > 0 ? "cursor-pointer" : ""
                      }`}
                      onClick={() =>
                        menu.submenus.length > 0 &&
                        toggleMenuExpansion(menu.uuid)
                      }
                      role="button"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <ToggleProps
                          checked={menu.assigned}
                          onChange={() => viewModel.toggleMenuAssignment(menu)}
                        />
                        <div>
                          <h2 className="text-lg font-semibold">{menu.name}</h2>
                          <p className="text-sm text-gray-500">
                            {menu.description || "Panel principal"}
                          </p>
                        </div>
                      </div>
                      {menu.submenus.length > 0 && (
                        <span
                          className={`transition-transform duration-200 mr-5 ${
                            isExpanded ? "rotate-180" : "rotate-90"
                          }`}
                        >
                          {isExpanded ? (
                            <FiChevronDown className="text-blue-600" />
                          ) : (
                            <FiChevronRight className="text-gray-600" />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Submenús */}
                    {isExpanded && (
                      <div className="pl-18 pr-6 pb-4 ">
                        {menu.submenus.length === 0 ? (
                          <p className="text-gray-500 text-sm py-3">
                            No hay submenús disponibles para este menú.
                          </p>
                        ) : (
                          menu.submenus.map((submenu) => (
                            <div
                              key={submenu.uuid}
                              className="flex items-center gap-2 pl-2 pb-2 border-l border-gray-300"
                            >
                              <ToggleProps
                                checked={submenu.assigned}
                                onChange={() =>
                                  viewModel.toggleSubmenuAssignment(
                                    submenu
                                  )
                                }
                                disabled={!menu.assigned}
                              />
                              <div>
                                <h3 className="font-medium">{submenu.name}</h3>
                                <p className="text-xs text-gray-500">
                                  {submenu.description}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}

        {!viewModel.loading &&
          (!viewModel.rolePermissions ||
            viewModel.rolePermissions.availablePermissions.menus.length ===
              0) && (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">
                No hay menús disponibles para este rol.
              </p>
            </div>
          )}
      </div>
    </MainContainer>
  );
});

export default RolePermissionsView;

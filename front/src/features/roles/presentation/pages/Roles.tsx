import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { RoleViewModel } from "../viewModels/RoleViewModel";
import Modal from "../../../shared/layout/Modal";
import MainContainer from "../../../shared/layout/MainContainer";
import RoleForm from "../components/RoleForm";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa";
import RoleCard from "../../../shared/components/RoleCard";
import { motion, AnimatePresence } from "framer-motion";

const Role: React.FC = observer(() => {
  const viewModel = React.useMemo(() => new RoleViewModel(), []);
  const navigate = useNavigate();

  useEffect(() => {
    viewModel.loadRoles();
  }, [viewModel]);

  return (
    <MainContainer>
      <div className="mt-5 mb-10">
        <section className="flex justify-between items-center">
          <div className="poppins">
            <h1 className=" text-[23px] md:text-[36px] font-semibold text-blackk">
              Gestión de Roles
            </h1>
            <p className=" text-[14px] md:text-[24px] font-light text-black">
              Administra los roles de usuario y sus permisos en el sistema.
            </p>
          </div>
          <Button
            isAdd={true}
            onClick={() => viewModel.prepareForCreate()}
            label="Nuevo rol"
            type="button"
            icon={<FaPlus className="text-white" />}
          />
        </section>

        <AnimatePresence>
          {viewModel.loading && viewModel.roles.length === 0 ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 mt-5"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white p-6 rounded-lg shadow border border-gray-200"
                >
                  <div className="h-5 bg-gray-300 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </motion.div>
          ) : (
            <section className="grid gap-5 mt-5">
              <AnimatePresence>
                {viewModel.roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05, // animación escalonada
                    }}
                  >
                    <RoleCard
                      roleName={role.attributes.name}
                      backgroundColor="bg-green-600"
                      description={role.attributes.description}
                      permissions={{
                        menus: role.meta.menuCount,
                        submenus: role.meta.submenuCount,
                      }}
                      usersCount={role.meta.userCount}
                      onClick={() => navigate(`/roles/${role.id}/permisos`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          )}
        </AnimatePresence>

        {viewModel.isModalOpen && (
          <Modal
            title={viewModel.modalTitle}
            subtitle={viewModel.modalSubtitle}
            onClose={() => viewModel.closeModal()}
          >
            <RoleForm viewModel={viewModel} />
          </Modal>
        )}
      </div>
    </MainContainer>
  );
});

export default Role;

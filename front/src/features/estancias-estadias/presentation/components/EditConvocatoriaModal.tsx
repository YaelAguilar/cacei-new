import React from "react";
import { observer } from "mobx-react-lite";
import { Convocatoria } from "../../data/models/Convocatoria";
import { VisualizarConvocatoriasViewModel } from "../viewModels/VisualizarConvocatoriasViewModel";
import Modal from "../../../shared/layout/Modal";
import EditConvocatoriaForm from "./EditConvocatoriaForm";

interface EditConvocatoriaModalProps {
  convocatoria: Convocatoria;
  viewModel: VisualizarConvocatoriasViewModel;
  onClose: () => void;
  onSuccess: () => void;
}

const EditConvocatoriaModal: React.FC<EditConvocatoriaModalProps> = observer(({ 
  convocatoria, 
  viewModel, 
  onClose,
  onSuccess
}) => {
  return (
    <Modal
      title="Editar Convocatoria"
      subtitle={`Modificando los detalles de: ${convocatoria.getNombre()}`}
      onClose={onClose}
    >
      <EditConvocatoriaForm 
        convocatoria={convocatoria}
        viewModel={viewModel}
        onSuccess={onSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
});

export default EditConvocatoriaModal;
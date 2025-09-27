// src/features/propuestas-comentarios/presentation/components/VotingCommentModal.tsx
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Modal from "../../../shared/layout/Modal";
import Button from "../../../shared/components/Button";
import { FiCheck, FiX, FiMessageSquare } from "react-icons/fi";

interface VotingCommentModalProps {
  isOpen: boolean;
  voteType: 'APROBADO' | 'RECHAZADO';
  onClose: () => void;
  onVote: (comment: string) => void;
  loading?: boolean;
}

const VotingCommentModal: React.FC<VotingCommentModalProps> = observer(({ 
  isOpen, 
  voteType, 
  onClose, 
  onVote,
  loading = false 
}) => {
  const [comment, setComment] = useState('');
  
  const isReject = voteType === 'RECHAZADO';
  const isCommentRequired = isReject;
  const isVoteDisabled = loading || (isCommentRequired && comment.trim().length < 10);

  const handleVote = () => {
    if (!isVoteDisabled) {
      onVote(comment.trim());
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={`Votar ${voteType === 'APROBADO' ? 'Aprobar' : 'Rechazar'} Propuesta`}
      subtitle={`${voteType === 'APROBADO' ? 'Aprobación' : 'Rechazo'} de la propuesta completa`}
      onClose={handleClose}
    >
      <div className="mt-6 space-y-4">
        {/* Información sobre el voto */}
        <div className={`p-4 rounded-lg border-2 ${
          voteType === 'APROBADO' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {voteType === 'APROBADO' ? (
              <FiCheck className="w-6 h-6 text-green-600" />
            ) : (
              <FiX className="w-6 h-6 text-red-600" />
            )}
            <div>
              <h3 className={`font-semibold ${
                voteType === 'APROBADO' ? 'text-green-900' : 'text-red-900'
              }`}>
                {voteType === 'APROBADO' ? 'Aprobar Propuesta' : 'Rechazar Propuesta'}
              </h3>
              <p className={`text-sm ${
                voteType === 'APROBADO' ? 'text-green-700' : 'text-red-700'
              }`}>
                {voteType === 'APROBADO' 
                  ? 'Esta acción aprueba toda la propuesta de proyecto.'
                  : 'Esta acción rechaza toda la propuesta de proyecto.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Campo de comentario */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FiMessageSquare className="w-4 h-4" />
            Comentario {isCommentRequired ? '(Obligatorio)' : '(Opcional)'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              isCommentRequired 
                ? "Explique por qué rechaza esta propuesta (mínimo 10 caracteres)..."
                : "Agregue un comentario opcional sobre la aprobación..."
            }
          />
          {isCommentRequired && (
            <p className="mt-1 text-xs text-gray-600">
              Mínimo 10 caracteres requeridos para rechazar la propuesta.
            </p>
          )}
          {!isCommentRequired && (
            <p className="mt-1 text-xs text-gray-600">
              El comentario es opcional para aprobar la propuesta.
            </p>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> Una vez emitido el voto, no podrá ser modificado. 
            Este voto afecta toda la propuesta de proyecto.
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outline"
            size="sm"
            label="Cancelar"
          />
          <Button
            onClick={handleVote}
            disabled={isVoteDisabled}
            loading={loading}
            variant={voteType === 'APROBADO' ? 'success' : 'danger'}
            size="sm"
            icon={voteType === 'APROBADO' ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
            label={loading ? 'Procesando...' : (voteType === 'APROBADO' ? 'Aprobar' : 'Rechazar')}
          />
        </div>
      </div>
    </Modal>
  );
});

export default VotingCommentModal;

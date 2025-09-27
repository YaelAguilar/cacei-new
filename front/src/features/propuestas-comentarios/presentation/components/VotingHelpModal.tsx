// src/features/propuestas-comentarios/presentation/components/VotingHelpModal.tsx
import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiInfo, FiX } from "react-icons/fi";

interface VotingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VotingHelpModal: React.FC<VotingHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto w-[90%] max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiInfo className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Guía de Votación
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introducción */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Sistema de Votación Actualizado
            </h3>
            <p className="text-blue-800 text-sm">
              El sistema de votación ha sido actualizado para ser más claro y eficiente. 
              Ahora hay dos tipos de votación diferentes según el alcance.
            </p>
          </div>

          {/* Votación por sección */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FiRefreshCw className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">
                Votación por Sección Específica
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiRefreshCw className="w-3 h-3 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">ACTUALIZA</p>
                  <p className="text-sm text-gray-600">
                    Solicita modificaciones en una sección específica. 
                    <strong> Es el único voto permitido por sección.</strong>
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Características:</strong>
                </p>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Requiere comentario obligatorio (mínimo 10 caracteres)</li>
                  <li>• Se puede editar después de creado</li>
                  <li>• Solo un comentario por sección por tutor</li>
                  <li>• Cambia el estatus de la propuesta a "ACTUALIZAR"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Votación completa */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">
                Votación de Propuesta Completa
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheckCircle className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">APROBAR</p>
                  <p className="text-sm text-gray-600">
                    Aprueba toda la propuesta de una vez. Comentario opcional.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiXCircle className="w-3 h-3 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">RECHAZAR</p>
                  <p className="text-sm text-gray-600">
                    Rechaza toda la propuesta de una vez. Comentario obligatorio.
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Características:</strong>
                </p>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• Solo se puede votar una vez por tutor</li>
                  <li>• No se puede cambiar después de votar</li>
                  <li>• Puede coexistir con comentarios ACTUALIZA</li>
                  <li>• Requiere 3 votos iguales para cambiar estatus final</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reglas importantes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              ⚠️ Reglas Importantes
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>ACEPTADO/RECHAZADO por sección:</strong> Ya no está permitido</li>
              <li>• <strong>ACTUALIZA por sección:</strong> Único voto permitido para secciones específicas</li>
              <li>• <strong>Votación completa:</strong> Solo ACEPTADO/RECHAZADO para toda la propuesta</li>
              <li>• <strong>Un voto final por tutor:</strong> No se puede cambiar una vez emitido</li>
              <li>• <strong>Comentarios ACTUALIZA:</strong> Pueden coexistir con votos finales</li>
            </ul>
          </div>

          {/* Ejemplo de flujo */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">
              💡 Ejemplo de Flujo de Trabajo
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>1.</strong> Tutor revisa la propuesta sección por sección</p>
              <p><strong>2.</strong> Si encuentra problemas específicos, vota "ACTUALIZA" en esas secciones</p>
              <p><strong>3.</strong> Si la propuesta está lista, vota "APROBAR" o "RECHAZAR" completamente</p>
              <p><strong>4.</strong> Los comentarios ACTUALIZA pueden coexistir con el voto final</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VotingHelpModal;

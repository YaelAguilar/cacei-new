// src/features/alumnos-propuestas/presentation/pages/PropuestaDetalleWrapper.tsx
import React, { useMemo, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { PropuestaCompleta } from "../../data/models/Propuesta";
import { PropuestaRepository } from "../../data/repository/PropuestaRepository";
import PropuestaDetalle from "./PropuestaDetalle";
import { VisualizarPropuestasViewModel } from "../viewModels/VisualizarPropuestasViewModel";

const PropuestaDetalleWrapper: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propuesta, setPropuesta] = useState<PropuestaCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const viewModel = useMemo(() => new VisualizarPropuestasViewModel(), []);
  const repository = useMemo(() => new PropuestaRepository(), []);

  useEffect(() => {
    const loadPropuesta = async () => {
      if (!id) {
        setError("ID de propuesta no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Buscar la propuesta por ID
        const propuestaData = await repository.getPropuesta(id);
        
        if (propuestaData) {
          setPropuesta(propuestaData);
        } else {
          setError("Propuesta no encontrada");
        }
      } catch (err) {
        console.error("Error cargando propuesta:", err);
        setError("Error al cargar la propuesta");
      } finally {
        setLoading(false);
      }
    };

    loadPropuesta();
  }, [id, repository]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la propuesta...</p>
        </div>
      </div>
    );
  }

  if (error || !propuesta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error || "Propuesta no encontrada"}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropuestaDetalle 
      propuesta={propuesta} 
      viewModel={viewModel} 
    />
  );
});

export default PropuestaDetalleWrapper;

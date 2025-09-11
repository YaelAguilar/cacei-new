import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import MainContainer from '../../../shared/layout/MainContainer';
import Modal from '../../../shared/layout/Modal';
import Status from '../../../shared/components/Status';
import { PropuestaRepository } from '../../data/repository/PropuestaRepository';
import { GetPropuestasByAlumnoUseCase } from '../../domain/GetPropuestasByAlumnoUseCase';
import { Propuesta } from '../../data/models/Propuesta';
import { FiRefreshCw, FiFileText, FiPlus, FiEye, FiCalendar, FiUser, FiHome, FiTarget, FiTool, FiActivity, FiMail, FiGlobe } from 'react-icons/fi';

const VisualizarPropuestas: React.FC = observer(() => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropuesta, setSelectedPropuesta] = useState<Propuesta | null>(null);
  const [showModal, setShowModal] = useState(false);

  const repository = new PropuestaRepository();
  const useCase = new GetPropuestasByAlumnoUseCase(repository);

  const loadPropuestas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await useCase.execute();
      setPropuestas(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar propuestas');
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  useEffect(() => { loadPropuestas(); }, [loadPropuestas]);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  const formatDateTime = (date: Date) => new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  // Funciones helper para acceder a propiedades que pueden no existir
  const getNombreProyecto = (propuesta: Propuesta) => propuesta.getNombreProyecto?.() || propuesta.nombre || 'Sin nombre';
  const getDescripcionProyecto = (propuesta: Propuesta) => propuesta.getDescripcionProyecto?.() || propuesta.descripcion || 'Sin descripción';
  const getNombreEmpresa = (propuesta: Propuesta) => propuesta.getNombreEmpresa?.() || propuesta.empresa || 'Sin empresa';
  const getSectorEmpresa = (propuesta: Propuesta) => propuesta.getSectorEmpresa?.() || propuesta.sector || 'Sin sector';
  const getTutorAcademicoNombre = (propuesta: Propuesta) => propuesta.getTutorAcademico?.()?.nombre || propuesta.tutorNombre || 'Sin tutor';
  const getTutorAcademicoEmail = (propuesta: Propuesta) => propuesta.getTutorAcademico?.()?.email || propuesta.tutorEmail || 'Sin email';
  const getFechaInicio = (propuesta: Propuesta) => propuesta.getFechaInicio?.() || propuesta.fechaInicio || new Date();
  const getFechaFin = (propuesta: Propuesta) => propuesta.getFechaFin?.() || propuesta.fechaFin || new Date();
  const getEntregables = (propuesta: Propuesta) => propuesta.getEntregables?.() || propuesta.entregables || 'Sin entregables';
  const getTecnologias = (propuesta: Propuesta) => propuesta.getTecnologias?.() || propuesta.tecnologias || 'Sin tecnologías';
  const getActividades = (propuesta: Propuesta) => propuesta.getActividades?.() || propuesta.actividades || 'Sin actividades';
  const getPersonaContacto = (propuesta: Propuesta) => propuesta.getPersonaContacto?.() || propuesta.contacto || 'Sin contacto';
  const getPaginaWebEmpresa = (propuesta: Propuesta) => propuesta.getPaginaWebEmpresa?.() || propuesta.paginaWeb || null;
  const getSupervisorProyecto = (propuesta: Propuesta) => propuesta.getSupervisorProyecto?.() || propuesta.supervisor || 'Sin supervisor';

  const PropuestaCard = ({ propuesta }: { propuesta: Propuesta }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{getNombreProyecto(propuesta)}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{getDescripcionProyecto(propuesta)}</p>
          </div>
          <Status active={propuesta.isActive()} label={propuesta.isActive() ? 'Activa' : 'Inactiva'} />
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {propuesta.getTipoPasantia()}
        </span>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FiHome className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Empresa</p>
            <p className="text-sm font-medium text-gray-900">{getNombreEmpresa(propuesta)}</p>
            <p className="text-xs text-gray-600">{getSectorEmpresa(propuesta)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <FiUser className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Tutor Académico</p>
            <p className="text-sm font-medium text-gray-900">{getTutorAcademicoNombre(propuesta)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Período del proyecto</p>
            <div className="text-sm font-medium text-gray-900">
              <span>{formatDate(getFechaInicio(propuesta))}</span>
              <span className="text-gray-500 mx-2">→</span>
              <span>{formatDate(getFechaFin(propuesta))}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <p><span className="font-medium">Registrado:</span> {formatDateTime(propuesta.getCreatedAt())}</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => { setSelectedPropuesta(propuesta); setShowModal(true); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          Ver detalles completos
        </button>
      </div>
    </div>
  );

  const PropuestaDetailModal = () => selectedPropuesta && (
    <Modal title={getNombreProyecto(selectedPropuesta)} subtitle="Detalles completos de la propuesta" onClose={() => setShowModal(false)}>
      <div className="mt-6 max-h-[80vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Status active={selectedPropuesta.isActive()} label={selectedPropuesta.isActive() ? 'Activa' : 'Inactiva'} />
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {selectedPropuesta.getTipoPasantia()}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiFileText className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información del Proyecto</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Descripción</h5>
              <p className="text-blue-800 text-sm">{getDescripcionProyecto(selectedPropuesta)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="w-4 h-4 text-gray-600" />
                  <h5 className="font-medium text-gray-900">Entregables</h5>
                </div>
                <p className="text-gray-700 text-sm">{getEntregables(selectedPropuesta)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTool className="w-4 h-4 text-gray-600" />
                  <h5 className="font-medium text-gray-900">Tecnologías</h5>
                </div>
                <p className="text-gray-700 text-sm">{getTecnologias(selectedPropuesta)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="w-4 h-4 text-gray-600" />
                <h5 className="font-medium text-gray-900">Actividades a Realizar</h5>
              </div>
              <p className="text-gray-700 text-sm">{getActividades(selectedPropuesta)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiCalendar className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Período del Proyecto</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-700 mb-1">Fecha de Inicio</p>
              <p className="text-green-900 font-medium">{formatDate(getFechaInicio(selectedPropuesta))}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-1">Fecha de Fin</p>
              <p className="text-red-900 font-medium">{formatDate(getFechaFin(selectedPropuesta))}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiHome className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Información de la Empresa</h4>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Nombre de la Empresa</p>
              <p className="text-purple-900 font-medium">{getNombreEmpresa(selectedPropuesta)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Sector</p>
                <p className="text-purple-900">{getSectorEmpresa(selectedPropuesta)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Persona de Contacto</p>
                <p className="text-purple-900">{getPersonaContacto(selectedPropuesta)}</p>
              </div>
            </div>

            {getPaginaWebEmpresa(selectedPropuesta) && (
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Página Web</p>
                <a href={getPaginaWebEmpresa(selectedPropuesta)!} target="_blank" rel="noopener noreferrer" className="text-purple-900 underline hover:text-purple-700 flex items-center gap-1">
                  <FiGlobe className="w-4 h-4" />
                  {getPaginaWebEmpresa(selectedPropuesta)}
                </a>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Supervisor del Proyecto</p>
              <p className="text-purple-900">{getSupervisorProyecto(selectedPropuesta)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">Tutor Académico</h4>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="font-medium text-indigo-900">{getTutorAcademicoNombre(selectedPropuesta)}</p>
            <div className="flex items-center gap-1 mt-1">
              <FiMail className="w-4 h-4 text-indigo-600" />
              <a href={`mailto:${getTutorAcademicoEmail(selectedPropuesta)}`} className="text-indigo-700 hover:text-indigo-800 text-sm">
                {getTutorAcademicoEmail(selectedPropuesta)}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500">
            <span className="font-medium">ID de Propuesta:</span> {selectedPropuesta.getId()}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
          Cerrar
        </button>
      </div>
    </Modal>
  );

  const activas = propuestas.filter(p => p.isActive());
  const inactivas = propuestas.filter(p => !p.isActive());

  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-[23px] md:text-[36px] font-semibold text-black">Mis Propuestas</h1>
              <p className="text-[14px] md:text-[24px] font-light text-black">Visualiza todas tus propuestas de proyectos registradas.</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              <button onClick={loadPropuestas} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
              
              <button onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiPlus className="w-4 h-4" />
                Nueva Propuesta
              </button>
            </div>
          </div>

          {propuestas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-900">{propuestas.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Activas</p>
                    <p className="text-xl font-semibold text-gray-900">{activas.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inactivas</p>
                    <p className="text-xl font-semibold text-gray-900">{inactivas.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p className="text-sm"><strong>Error:</strong> {error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm underline">Descartar</button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {!loading && (
            <>
              {propuestas.length > 0 ? (
                <div className="space-y-8">
                  {activas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Propuestas Activas ({activas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activas.map(propuesta => <PropuestaCard key={propuesta.getId()} propuesta={propuesta} />)}
                      </div>
                    </div>
                  )}

                  {inactivas.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        Propuestas Inactivas ({inactivas.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inactivas.map(propuesta => <PropuestaCard key={propuesta.getId()} propuesta={propuesta} />)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiFileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes propuestas registradas</h3>
                  <p className="text-gray-600 mb-6">Aún no has registrado ninguna propuesta de proyecto.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={loadPropuestas} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Actualizar lista
                    </button>
                    <button onClick={() => window.location.href = '/mis-propuestas/nueva-propuesta'} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Verificar convocatorias
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showModal && <PropuestaDetailModal />}
      </div>
    </MainContainer>
  );
});

export default VisualizarPropuestas;
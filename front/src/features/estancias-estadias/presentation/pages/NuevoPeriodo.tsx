import React, { useState, useEffect } from "react";
import MainContainer from "../../../shared/layout/MainContainer";
import { Toasters } from "../../../shared/components/Toasters";
import ApiClient from "../../../../core/API/ApiClient";

// Interfaces para tipado
interface Profesor {
    id: number;
    nombre: string;
    email: string;
}

interface ProfesorApiItem {
    type: string;
    id: number;
    attributes: {
        nombre: string;
        email: string;
    };
}

interface ProfesoresApiResponse {
    data: ProfesorApiItem[];
}

interface ConvocatoriaResponse {
    data: {
        type: string;
        id: string;
        attributes: {
            nombre: string;
            descripcion: string | null;
            fechaLimite: string;
            pasantiasDisponibles: string[];
            profesoresDisponibles: Profesor[];
            active: boolean;
            createdAt: string;
            updatedAt: string;
        };
    };
}

interface ActiveConvocatoriaResponse {
    data: {
        type: string;
        attributes: {
            hasActiveConvocatoria: boolean;
        };
    };
}

interface ErrorResponse {
    errors: Array<{
        status: string;
        title: string;
        detail: string;
    }>;
}

const NuevoPeriodo: React.FC = () => {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [fechaLimite, setFechaLimite] = useState<string>(""); // ISO 8601 format: YYYY-MM-DDThh:mm
    const [pasantiasSeleccionadas, setPasantiasSeleccionadas] = useState<string[]>([]);

    // Estados para profesores y carga
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [loadingProfesores, setLoadingProfesores] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [hasActiveConvocatoria, setHasActiveConvocatoria] = useState<boolean>(false);
    const [checkingActiveConvocatoria, setCheckingActiveConvocatoria] = useState<boolean>(true);

    // Opciones exactas de pasantías según el backend
    const opcionesPasantias: string[] = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];

    // State for form validation and submission tracking
    const [formValid, setFormValid] = useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    // Verificar si hay una convocatoria activa
    const checkActiveConvocatoria = async () => {
        try {
            setCheckingActiveConvocatoria(true);
            
            const response = await ApiClient.get<ActiveConvocatoriaResponse>('/convocatorias/active/check');
            const data = response.data;

            setHasActiveConvocatoria(data.data.attributes.hasActiveConvocatoria);

            // No mostrar toast aquí, la franja amarilla es suficiente información
        } catch (error) {
            console.error('Error al verificar convocatoria activa:', error);
            // No mostrar error aquí, podría ser que simplemente no haya convocatorias
            setHasActiveConvocatoria(false);
        } finally {
            setCheckingActiveConvocatoria(false);
        }
    };

    const fetchProfesores = async () => {
        try {
            setLoadingProfesores(true);
            
            const response = await ApiClient.get<ProfesoresApiResponse>('/convocatorias/profesores/disponibles');
            const data = response.data;

            if (!data.data || data.data.length === 0) {
                Toasters("error", "No hay profesores disponibles para crear una convocatoria");
                setProfesores([]);
                return;
            }

            const profesoresTransformados: Profesor[] = data.data.map((item: ProfesorApiItem) => ({
                id: item.id,
                nombre: item.attributes.nombre,
                email: item.attributes.email
            }));

            setProfesores(profesoresTransformados);
        } catch (error) {
            console.error('Error al obtener profesores:', error);
            Toasters("error", "Error al cargar la lista de profesores disponibles");
            setProfesores([]);
        } finally {
            setLoadingProfesores(false);
        }
    };

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([
                checkActiveConvocatoria(),
                fetchProfesores()
            ]);
        };

        loadInitialData();
    }, []);

    // Effect to handle form validation
    useEffect(() => {
        const isNombreValid = nombre.trim() !== "";
        
        // Validación de fecha: debe ser al menos 24 horas en el futuro
        const now = new Date();
        const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
        const selectedDate = fechaLimite ? new Date(fechaLimite) : null;
        const isFechaLimiteValid = selectedDate !== null && selectedDate > minDate;
        
        // Validación de pasantías: 1-5 seleccionadas
        const isPasantiasValid = pasantiasSeleccionadas.length >= 1 && pasantiasSeleccionadas.length <= 5;
        
        // No puede crear si hay convocatoria activa o no hay profesores
        const canCreate = !hasActiveConvocatoria && profesores.length > 0 && !loadingProfesores && !checkingActiveConvocatoria;

        setFormValid(isNombreValid && isFechaLimiteValid && isPasantiasValid && canCreate);
    }, [nombre, fechaLimite, pasantiasSeleccionadas, hasActiveConvocatoria, profesores.length, loadingProfesores, checkingActiveConvocatoria]);

    // Handle input changes for text fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "nombre") {
            setNombre(value);
        } else if (name === "descripcion") {
            setDescripcion(value);
        } else if (name === "fechaLimite") {
            setFechaLimite(value);
        }
    };

    // Handle checkbox changes for pasantias
    const handlePasantiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            // Validar que no exceda el máximo de 5
            if (pasantiasSeleccionadas.length >= 5) {
                Toasters("error", "No se pueden seleccionar más de 5 pasantías");
                return;
            }
            setPasantiasSeleccionadas((prev) => [...prev, value]);
        } else {
            setPasantiasSeleccionadas((prev) => prev.filter((pasantia) => pasantia !== value));
        }
    };

    // Helper to get minimum datetime
    const getMinDatetime = () => {
        const now = new Date();
        const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
        const year = minDate.getFullYear();
        const month = (minDate.getMonth() + 1).toString().padStart(2, '0');
        const day = minDate.getDate().toString().padStart(2, '0');
        const hours = minDate.getHours().toString().padStart(2, '0');
        const minutes = minDate.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Función para crear convocatoria usando ApiClient
    const createConvocatoria = async () => {
        try {
            setSubmitting(true);
            
            const payload = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim() || null,
                fechaLimite: fechaLimite,
                pasantiasSeleccionadas: pasantiasSeleccionadas
            };

            const response = await ApiClient.post<ConvocatoriaResponse>('/convocatorias', payload);
            const data = response.data;
            
            console.log("Convocatoria creada exitosamente:", data);
            Toasters("success", "¡Convocatoria creada exitosamente!");

            // Reset form to initial state
            setNombre("");
            setDescripcion("");
            setFechaLimite("");
            setPasantiasSeleccionadas([]);
            setFormSubmitted(false);

            // Verificar de nuevo si hay convocatoria activa y recargar profesores
            await Promise.all([
                checkActiveConvocatoria(),
                fetchProfesores()
            ]);

        } catch (error: unknown) {
            console.error('Error al crear convocatoria:', error);
            
            let errorMessage = "Error desconocido al crear la convocatoria";
            
            // Manejo específico de errores del backend
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ErrorResponse; status?: number } };
                if (axiosError.response?.data?.errors) {
                    errorMessage = axiosError.response.data.errors[0].detail;
                } else if (axiosError.response?.status === 400) {
                    errorMessage = "Datos inválidos. Revise los campos del formulario.";
                } else if (axiosError.response?.status === 500) {
                    errorMessage = "Error interno del servidor. Intente nuevamente.";
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Toasters("error", errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Verificaciones específicas con mensajes alineados al backend
        if (hasActiveConvocatoria) {
            Toasters("error", "No se puede crear una nueva convocatoria mientras haya una convocatoria vigente");
            return;
        }

        if (profesores.length === 0) {
            Toasters("error", "No hay profesores disponibles para la convocatoria");
            return;
        }

        if (formValid) {
            await createConvocatoria();
        } else {
            // Determinar un mensaje de error más específico
            let errorMessage = "Por favor, complete todos los campos obligatorios correctamente.";
            if (nombre.trim() === "") {
                errorMessage = "El nombre es obligatorio";
            } else if (fechaLimite === "" || (fechaLimite && new Date(fechaLimite) <= new Date())) {
                errorMessage = "La fecha límite debe ser al menos 24 horas en el futuro";
            } else if (pasantiasSeleccionadas.length === 0) {
                errorMessage = "Debe seleccionar al menos una pasantía";
            } else if (pasantiasSeleccionadas.length > 5) {
                errorMessage = "No se pueden seleccionar más de 5 pasantías";
            }
            Toasters("error", errorMessage);
        }
    };

    // Si está verificando si hay convocatoria activa, mostrar loading
    if (checkingActiveConvocatoria) {
        return (
            <MainContainer>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Verificando convocatorias activas...</span>
                </div>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <div className="mt-5">
                <div className="poppins">
                    <h1 className="text-[23px] md:text-[36px] font-semibold text-black">
                        Convocatorias
                    </h1>
                    <p className="text-[14px] md:text-[24px] font-light text-black mb-6">
                        Crear una nueva convocatoria.
                    </p>
                </div>

                {/* Alerta si hay convocatoria activa */}
                {hasActiveConvocatoria && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">
                                    <strong>Convocatoria activa encontrada:</strong> Ya existe una convocatoria vigente. 
                                    No se puede crear una nueva hasta que la actual expire o sea desactivada.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerta si no hay profesores */}
                {!loadingProfesores && profesores.length === 0 && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">
                                    <strong>Sin profesores disponibles:</strong> No hay profesores con roles PTC o Director activos. 
                                    No se puede crear una convocatoria sin profesores disponibles.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-[20px] md:text-[28px] font-semibold text-black mb-4">
                        Nueva Convocatoria
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-black text-sm font-bold mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={nombre}
                                onChange={handleInputChange}
                                disabled={submitting || hasActiveConvocatoria}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Nombre de la convocatoria"
                                required
                            />
                            {formSubmitted && nombre.trim() === "" && (
                                <p className="text-red-500 text-xs italic mt-1">El nombre es obligatorio.</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block text-black text-sm font-bold mb-2">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleInputChange}
                                disabled={submitting || hasActiveConvocatoria}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Descripción detallada de la convocatoria"
                                rows={4}
                            ></textarea>
                        </div>

                        {/* Fecha límite */}
                        <div>
                            <label htmlFor="fechaLimite" className="block text-black text-sm font-bold mb-2">
                                Fecha Límite <span className="text-red-500">*</span>
                                <span className="text-gray-500 text-xs font-normal ml-2">
                                    (Debe ser al menos 24 horas en el futuro)
                                </span>
                            </label>
                            <input
                                type="datetime-local"
                                id="fechaLimite"
                                name="fechaLimite"
                                value={fechaLimite}
                                onChange={handleInputChange}
                                disabled={submitting || hasActiveConvocatoria}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                min={getMinDatetime()}
                            />
                            {formSubmitted && fechaLimite && (
                                (() => {
                                    const selectedDate = new Date(fechaLimite);
                                    const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
                                    if (selectedDate <= minDate) {
                                        return <p className="text-red-500 text-xs italic mt-1">La fecha límite debe ser al menos 24 horas en el futuro.</p>;
                                    }
                                    return null;
                                })()
                            )}
                        </div>

                        {/* Pasantías disponibles */}
                        <div>
                            <label className="block text-black text-sm font-bold mb-2">
                                Pasantías disponibles para realizar <span className="text-red-500">*</span>
                                <span className="text-gray-500 text-xs font-normal ml-2">
                                    (Entre 1 y 5 pasantías, seleccionadas: {pasantiasSeleccionadas.length})
                                </span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {opcionesPasantias.map((pasantia) => (
                                    <div key={pasantia} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={pasantia}
                                            name="pasantias"
                                            value={pasantia}
                                            checked={pasantiasSeleccionadas.includes(pasantia)}
                                            onChange={handlePasantiaChange}
                                            disabled={submitting || hasActiveConvocatoria || (!pasantiasSeleccionadas.includes(pasantia) && pasantiasSeleccionadas.length >= 5)}
                                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <label htmlFor={pasantia} className="text-gray-700">
                                            {pasantia}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {formSubmitted && pasantiasSeleccionadas.length === 0 && (
                                <p className="text-red-500 text-xs italic mt-1">Debe seleccionar al menos una pasantía.</p>
                            )}
                            {formSubmitted && pasantiasSeleccionadas.length > 5 && (
                                <p className="text-red-500 text-xs italic mt-1">No se pueden seleccionar más de 5 pasantías.</p>
                            )}
                        </div>

                        {/* Listado de profesores */}
                        <div className="mt-6">
                            <h3 className="text-[18px] md:text-[22px] font-semibold text-black mb-3">
                                Profesores disponibles (Roles: PTC, Director)
                                {loadingProfesores && (
                                    <span className="text-sm font-normal text-gray-500 ml-2">Cargando...</span>
                                )}
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-md max-h-40 overflow-y-auto">
                                {loadingProfesores ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                        <span className="ml-2 text-gray-600">Cargando profesores...</span>
                                    </div>
                                ) : profesores.length > 0 ? (
                                    profesores.map((profesor) => (
                                        <p key={profesor.id} className="text-gray-800 text-sm mb-1">
                                            {profesor.nombre} - {profesor.email}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No hay profesores disponibles en este momento.</p>
                                )}
                            </div>
                            {!loadingProfesores && profesores.length > 0 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Esta lista se guardará automáticamente con la convocatoria como registro histórico.
                                </p>
                            )}
                        </div>

                        {/* Botón de enviar */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!formValid || submitting}
                                className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center
                                            ${!formValid || submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 focus:outline-none focus:shadow-outline"}`}
                            >
                                {submitting && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
                                {submitting ? "Creando..." : "Crear Convocatoria"}
                            </button>
                        </div>

                        {/* Información adicional */}
                        {(hasActiveConvocatoria || profesores.length === 0) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Nota:</strong> El formulario está deshabilitado porque:
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                                    {hasActiveConvocatoria && (
                                        <li>Ya existe una convocatoria activa</li>
                                    )}
                                    {profesores.length === 0 && (
                                        <li>No hay profesores disponibles</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </MainContainer>
    );
};

export default NuevoPeriodo;
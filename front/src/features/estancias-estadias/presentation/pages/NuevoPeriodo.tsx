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

const NuevoPeriodo: React.FC = () => {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [fechaLimite, setFechaLimite] = useState<string>(""); // ISO 8601 format: YYYY-MM-DDThh:mm
    const [pasantiasSeleccionadas, setPasantiasSeleccionadas] = useState<string[]>([]);

    // Estados para profesores y carga
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [loadingProfesores, setLoadingProfesores] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Opciones corregidas de pasantías (cambié "Estancia 2" por "Estancia II")
    const opcionesPasantias: string[] = ["Estancia I", "Estancia II", "Estadía", "Estadía 1", "Estadía 2"];

    // State for form validation and submission tracking
    const [formValid, setFormValid] = useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const fetchProfesores = async () => {
        try {
            setLoadingProfesores(true);
            
            const response = await ApiClient.get<ProfesoresApiResponse>('/convocatorias/profesores/disponibles');
            const data = response.data;

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

    // Cargar profesores al montar el componente
    useEffect(() => {
        fetchProfesores();
    }, []);

    // Effect to handle form validation
    useEffect(() => {
        const isNombreValid = nombre.trim() !== "";
        const isFechaLimiteValid = fechaLimite !== "" && new Date(fechaLimite) > new Date(); // Must be a future date
        const isPasantiasValid = pasantiasSeleccionadas.length > 0 && pasantiasSeleccionadas.length <= 5;

        setFormValid(isNombreValid && isFechaLimiteValid && isPasantiasValid);
    }, [nombre, fechaLimite, pasantiasSeleccionadas]);

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

    // Helper to get current datetime in YYYY-MM-DDThh:mm format for the min attribute
    const getMinDatetime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1); // Set minimum to 1 minute from now to ensure future
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
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

            // Recargar la lista de profesores por si hubo cambios
            fetchProfesores();

        } catch (error: any) {
            console.error('Error al crear convocatoria:', error);
            
            let errorMessage = "Error desconocido al crear la convocatoria";
            if (error.response?.data?.errors?.[0]?.detail) {
                errorMessage = error.response.data.errors[0].detail;
            } else if (error.response?.statusText) {
                errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
            } else if (error.message) {
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

        if (formValid) {
            await createConvocatoria();
        } else {
            // Determinar un mensaje de error más específico
            let errorMessage = "Por favor, complete todos los campos obligatorios correctamente.";
            if (nombre.trim() === "") {
                errorMessage = "El campo 'Nombre' es obligatorio.";
            } else if (fechaLimite === "" || (fechaLimite && new Date(fechaLimite) <= new Date())) {
                errorMessage = "Debe seleccionar una fecha y hora límite en el futuro.";
            } else if (pasantiasSeleccionadas.length === 0) {
                errorMessage = "Debe seleccionar al menos una pasantía.";
            } else if (pasantiasSeleccionadas.length > 5) {
                errorMessage = "No se pueden seleccionar más de 5 pasantías.";
            }
            Toasters("error", errorMessage);
        }
    };

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
                                disabled={submitting}
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
                                disabled={submitting}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Descripción detallada de la convocatoria"
                                rows={4}
                            ></textarea>
                        </div>

                        {/* Fecha límite */}
                        <div>
                            <label htmlFor="fechaLimite" className="block text-black text-sm font-bold mb-2">
                                Fecha Límite <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="fechaLimite"
                                name="fechaLimite"
                                value={fechaLimite}
                                onChange={handleInputChange}
                                disabled={submitting}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                min={getMinDatetime()}
                            />
                            {formSubmitted && (fechaLimite === "" || (fechaLimite && new Date(fechaLimite) <= new Date())) && (
                                <p className="text-red-500 text-xs italic mt-1">La fecha límite debe ser en el futuro.</p>
                            )}
                        </div>

                        {/* Pasantías disponibles */}
                        <div>
                            <label className="block text-black text-sm font-bold mb-2">
                                Pasantías disponibles para realizar <span className="text-red-500">*</span>
                                <span className="text-gray-500 text-xs font-normal ml-2">
                                    (Máximo 5, seleccionadas: {pasantiasSeleccionadas.length})
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
                                            disabled={submitting || (!pasantiasSeleccionadas.includes(pasantia) && pasantiasSeleccionadas.length >= 5)}
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
                                Profesores disponibles
                                {loadingProfesores && (
                                    <span className="text-sm font-normal text-gray-500 ml-2">Cargando...</span>
                                )}
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-md">
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
                    </form>
                </div>
            </div>
        </MainContainer>
    );
};

export default NuevoPeriodo;
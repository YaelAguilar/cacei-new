import React, { useState, useEffect } from "react";
import MainContainer from "../../../shared/layout/MainContainer";
import { Toasters } from "../../../shared/components/Toasters";

const NuevoPeriodo: React.FC = () => {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [fechaLimite, setFechaLimite] = useState<string>(""); // ISO 8601 format: YYYY-MM-DDThh:mm
    const [pasantiasSeleccionadas, setPasantiasSeleccionadas] = useState<string[]>([]);

    // Static data for options and professors
    const opcionesPasantias: string[] = ["Estancia I", "Estancia 2", "Estadía", "Estadía 1", "Estadía 2"];
    const profesores: { id: number; nombre: string; email: string }[] = [
        { id: 1, nombre: "Dr. Ana García", email: "ana.garcia@example.com" },
        { id: 2, nombre: "Mtra. Luis Hernández", email: "luis.hernandez@example.com" },
        { id: 3, nombre: "Ing. María López", email: "maria.lopez@example.com" },
        { id: 4, nombre: "Dr. Carlos Ruiz", email: "carlos.ruiz@example.com" },
        { id: 5, nombre: "Mtra. Sofía Martínez", email: "sofia.martinez@example.com" },
    ];

    // State for form validation and submission tracking
    const [formValid, setFormValid] = useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    // Effect to handle form validation
    useEffect(() => {
        const isNombreValid = nombre.trim() !== "";
        const isFechaLimiteValid = fechaLimite !== "" && new Date(fechaLimite) > new Date(); // Must be a future date
        const isPasantiasValid = pasantiasSeleccionadas.length > 0;

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

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true); // Se marca que el formulario ha sido intentado enviar

        if (formValid) {
            // Simulate sending data
            console.log("Convocatoria creada:", {
                nombre,
                descripcion,
                fechaLimite,
                pasantiasSeleccionadas,
            });
            // Usar tu Toasters para éxito
            Toasters("success", "¡Convocatoria creada exitosamente!");

            // Reset form to initial state
            setNombre("");
            setDescripcion("");
            setFechaLimite("");
            setPasantiasSeleccionadas([]);
            setFormSubmitted(false); // Resetear el estado de envío para limpiar los mensajes de error
        } else {
            // Determinar un mensaje de error más específico
            let errorMessage = "Por favor, complete todos los campos obligatorios correctamente.";
            if (nombre.trim() === "") {
                errorMessage = "El campo 'Nombre' es obligatorio.";
            } else if (fechaLimite === "" || (fechaLimite && new Date(fechaLimite) <= new Date())) {
                errorMessage = "Debe seleccionar una fecha y hora límite en el futuro.";
            } else if (pasantiasSeleccionadas.length === 0) {
                errorMessage = "Debe seleccionar al menos una pasantía.";
            }
            // Usar tu Toasters para error
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nombre de la convocatoria"
                                required
                            />
                            {formSubmitted && nombre.trim() === "" && ( // Mostrar error solo si se intentó enviar y está vacío
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                min={getMinDatetime()} // Set min date to current date/time + 1 minute
                            />
                            {formSubmitted && (fechaLimite === "" || (fechaLimite && new Date(fechaLimite) <= new Date())) && ( // Mostrar error solo si se intentó enviar y es inválido
                                <p className="text-red-500 text-xs italic mt-1">La fecha límite debe ser en el futuro.</p>
                            )}
                        </div>

                        {/* Pasantías disponibles */}
                        <div>
                            <label className="block text-black text-sm font-bold mb-2">
                                Pasantías disponibles para realizar <span className="text-red-500">*</span>
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
                                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out mr-2"
                                        />
                                        <label htmlFor={pasantia} className="text-gray-700">
                                            {pasantia}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {formSubmitted && pasantiasSeleccionadas.length === 0 && ( // Mostrar error solo si se intentó enviar y no hay selecciones
                                <p className="text-red-500 text-xs italic mt-1">Debe seleccionar al menos una pasantía.</p>
                            )}
                        </div>

                        {/* Listado de profesores */}
                        <div className="mt-6">
                            <h3 className="text-[18px] md:text-[22px] font-semibold text-black mb-3">
                                Profesores disponibles
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-md">
                                {profesores.map((profesor) => (
                                    <p key={profesor.id} className="text-gray-800 text-sm mb-1">
                                        {profesor.nombre} - {profesor.email}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Botón de enviar */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!formValid}
                                className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out
                                            ${!formValid ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 focus:outline-none focus:shadow-outline"}`}
                            >
                                Crear Convocatoria
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainContainer>
    );
};

export default NuevoPeriodo;
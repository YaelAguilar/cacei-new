import os
import sys

# Lista de extensiones de archivo que se considerarán de texto y se incluirán.
# Puedes agregar o quitar extensiones según tus necesidades.
TEXT_EXTENSIONS = {
    '.py', '.js', '.ts', '.tsx', '.jsx', '.html', '.css', '.scss', '.json', '.xml', '.yaml', '.yml',
    '.md', '.txt', '.sql', '.java', '.c', '.cpp', '.h', '.cs', '.php', '.rb', '.go', '.rs', '.swift',
    '.kt', '.kts', '.dockerfile', '.env', '.sh', '.bat', '.ps1'
}

# Carpetas comunes que se suelen ignorar.
IGNORED_DIRS = {'__pycache__', '.git', '.vscode', 'node_modules', 'dist', 'build'}

def generate_tree(start_path, output_file):
    """
    Genera y escribe en el archivo de salida una representación del árbol de directorios.
    """
    output_file.write(f"Árbol del directorio: {start_path}\n")
    output_file.write("======================================\n\n")

    for root, dirs, files in os.walk(start_path):
        # Ignorar carpetas no deseadas
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        level = root.replace(start_path, '').count(os.sep)
        indent = ' ' * 4 * level
        output_file.write(f"{indent}📂 {os.path.basename(root)}/\n")
        
        sub_indent = ' ' * 4 * (level + 1)
        for f in sorted(files):
            output_file.write(f"{sub_indent}📄 {f}\n")
    
    output_file.write("\n\n")


def append_file_contents(start_path, output_file):
    """
    Recorre el árbol de directorios y añade el contenido de los archivos de texto al archivo de salida.
    """
    output_file.write("Contenido de los archivos\n")
    output_file.write("======================================\n\n")

    for root, dirs, files in os.walk(start_path):
        # Ignorar carpetas no deseadas
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        for file_name in sorted(files):
            file_path = os.path.join(root, file_name)
            _, extension = os.path.splitext(file_name)

            # Solo procesar archivos con extensiones de texto
            if extension.lower() in TEXT_EXTENSIONS:
                try:
                    with open(file_path, 'r', encoding='utf-8') as file_content:
                        output_file.write("-" * 80 + "\n")
                        output_file.write(f"📄 Archivo: {file_path}\n")
                        output_file.write("-" * 80 + "\n\n")
                        output_file.write(file_content.read())
                        output_file.write("\n\n")
                except Exception as e:
                    output_file.write("-" * 80 + "\n")
                    output_file.write(f"📄 Archivo: {file_path}\n")
                    output_file.write("-" * 80 + "\n\n")
                    output_file.write(f"*** No se pudo leer el archivo: {e} ***\n\n")


def main():
    """
    Función principal del script.
    """
    if len(sys.argv) != 2:
        print("Uso: python generar_arbol.py <ruta_de_la_carpeta>")
        print("Puedes arrastrar una carpeta a la terminal después de escribir el nombre del script.")
        sys.exit(1)

    folder_path = sys.argv[1]

    if not os.path.isdir(folder_path):
        print(f"Error: La ruta '{folder_path}' no es un directorio válido.")
        sys.exit(1)
        
    # Nombre del archivo de salida basado en la carpeta de entrada
    folder_name = os.path.basename(os.path.normpath(folder_path))
    output_filename = f"arbol_y_codigo_{folder_name}.txt"

    try:
        with open(output_filename, 'w', encoding='utf-8') as output_file:
            print(f"Generando árbol para: {folder_path}...")
            generate_tree(folder_path, output_file)
            
            print("Añadiendo contenido de los archivos...")
            append_file_contents(folder_path, output_file)

        print("-" * 50)
        print(f"✅ ¡Éxito! El archivo '{output_filename}' ha sido creado.")
        print(f"   Se encuentra en: {os.getcwd()}")
        print("-" * 50)

    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    main()
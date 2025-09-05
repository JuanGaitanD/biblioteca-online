// db_biblioteca.js
if (typeof window.db === "undefined") {
    console.error("Error: No se pudo conectar a la base de datos.");
} else {
    console.log("Conexión exitosa a la base de datos.");
}
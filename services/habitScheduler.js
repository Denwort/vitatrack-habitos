const cron = require("node-cron");
const supabaseService = require("../services/supabaseService");

// Función para verificar y crear progresos diarios
async function generarProgresosDiarios() {
  try {
    const hoy = new Date();
    const diaSemana = hoy.toLocaleString("es-ES", { weekday: "long" }).toLowerCase();

    // Obtén los hábitos que coinciden con el día de la semana actual
    const habitos = await supabaseService.obtenerHabitosPorDia(diaSemana);

    // Crea registros de progreso para cada hábito
    for (const habito of habitos) {
      await supabaseService.crearActualizarProgreso(habito.id, hoy.toISOString().split("T")[0], false);
    }

    console.log(`Progresos generados para el día: ${diaSemana}`);
  } catch (error) {
    console.error("Error generando progresos diarios:", error.message);
  }
}

// Tarea programada: Ejecutar todos los días a las 00:00
cron.schedule("0 0 * * *", generarProgresosDiarios);

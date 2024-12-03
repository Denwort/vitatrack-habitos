const supabaseService = require("../services/supabaseService");

exports.obtenerPorId = async (req, res) => {
  try {
    const { habitoId } = req.body;

    // Llamamos al servicio para obtener el hábito
    const habito = await supabaseService.obtenerHabitoPorId(habitoId);

    if (!habito) {
      return res.status(404).json({ message: "Hábito no encontrado" });
    }

    res.status(200).json( habito );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerTodos = async (req, res) => {
  try {
    const { userId } = req.body; // El ID del usuario se obtiene de los parámetros de la URL

    // Llamamos al servicio para obtener los hábitos del usuario
    const habitos = await supabaseService.obtenerHabitosPorUsuario(userId);

    res.status(200).json(habitos );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.obtenerHoy = async (req, res) => {
  try {
    const { userId } = req.body;


    const hoy = new Date();
    const diaSemana = hoy.toLocaleString("es-ES", { weekday: "long" }).toLowerCase();
    const fechaHoy = hoy.toISOString().split("T")[0];

    // Obtenemos los hábitos del usuario para el día actual
    const habitosHoy = await supabaseService.obtenerProgresosDelDia(userId, diaSemana, fechaHoy);

    console.log(habitosHoy)

    res.status(200).json( habitosHoy );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
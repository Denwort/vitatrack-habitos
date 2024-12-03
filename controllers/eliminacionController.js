const supabaseService = require("../services/supabaseService");

exports.eliminar = async (req, res) => {
  try {
    const { habitoId } = req.body;

    // Llamamos al servicio para eliminar el hábito
    const resultado = await supabaseService.eliminarHabito(habitoId);

    if (!resultado) {
      return res.status(404).json({ message: "Hábito no encontrado o no autorizado para eliminar" });
    }

    res.status(200).json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
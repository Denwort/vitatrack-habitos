const supabaseService = require("../services/supabaseService");

exports.marcarProgreso = async (req, res) => {
  try {
    const { progresoId, completado } = req.body; // ID del progreso

    // Llamar al servicio para actualizar el progreso
    const progresoActualizado = await supabaseService.marcarProgreso(progresoId, completado);

    res.status(200).json({ message: "Progreso actualizado correctamente", progreso: progresoActualizado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

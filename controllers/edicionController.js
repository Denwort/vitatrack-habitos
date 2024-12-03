const supabaseService = require("../services/supabaseService");

exports.editar = async (req, res) => {
  try {
    const { userId, habitoId, nombre, frecuencia, meta, tipo_habito } = req.body;

    // Llamamos al servicio para editar el hábito
    const habito = await supabaseService.editarHabito(userId, habitoId, nombre, frecuencia, meta, tipo_habito);

    res.status(200).json({ message: "Hábito editado correctamente", habito });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
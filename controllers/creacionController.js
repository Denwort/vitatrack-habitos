const supabaseService = require("../services/supabaseService");

exports.crear = async (req, res) => {
    try {
      const { userId, nombre, frecuencia, meta, tipo_habito } = req.body;
  
      // Verificamos si ya son amigos
      const habito = await supabaseService.crearHabito(userId, nombre, frecuencia, meta, tipo_habito);
    
      res.status(200).json({ message: "Habito creado correctamente", habito });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.crearHabito = async (id_usuario_propietario, nombre, meta, frecuencia, tipo_habito) => {
  const { data, error } = await supabase
    .from("Habitos") // Asegúrate de que esta tabla exista en tu base de datos
    .insert([
      { id_usuario_propietario, nombre, meta, frecuencia, tipo_habito } 
    ])
    .select("*");

  if (error) throw new Error(error.message);

  const incluirProgreso = frecuencia.includes(diaHoy);

  if (incluirProgreso) {
    // Crear un progreso si la frecuencia incluye el día de hoy
    const { data: progresoData, error: progresoError } = await supabase
      .from("Progreso_habitos") // Asegúrate de que esta tabla exista
      .insert([
        {
          id_habito: data.id,
          fecha: DateTime.local().toISODate(), // Fecha de hoy
          completado: false // Asumimos que inicialmente no está completado
        }
      ])
      .select("*");

    if (progresoError) throw new Error(progresoError.message);
  }

  return data[0]; // Devuelve la solicitud creada
};

exports.editarHabito = async (id_usuario_propietario, habitoId, nombre, meta, frecuencia, tipo_habito) => {
  const { data, error } = await supabase
    .from("Habitos") // Asegúrate de que esta tabla exista en tu base de datos
    .update({
      nombre,
      meta,
      frecuencia,
      tipo_habito,
    })
    .eq("id", habitoId) // Filtra por el ID del hábito
    .eq("id_usuario_propietario", id_usuario_propietario) // Verifica que el usuario sea el propietario del hábito
    .select("*");

  if (error) throw new Error(error.message);
  return data[0]; // Devuelve el hábito editado
};


exports.eliminarHabito = async (habitoId) => {
  const { data, error } = await supabase
    .from("Habitos") // Asegúrate de que esta tabla exista en tu base de datos
    .delete() // Acción de eliminar
    .eq("id", habitoId) // Filtra por el ID del hábito

  if (error) throw new Error(error.message);

  // Si `data` está vacío, significa que no se eliminó nada (hábito no encontrado o no pertenece al usuario)
  return data.length > 0;
};




exports.obtenerHabitoPorId = async (habitoId) => {
  const { data, error } = await supabase
    .from("Habitos") // Asegúrate de que esta tabla exista en tu base de datos
    .select("*")
    .eq("id", habitoId) // Filtra por el ID del hábito
    .single(); // Obtén un solo registro

  if (error) throw new Error(error.message);
  return data; // Devuelve el hábito encontrado
};

exports.obtenerHabitosPorUsuario = async (id_usuario_propietario) => {
  const { data, error } = await supabase
    .from("Habitos") // Asegúrate de que esta tabla exista en tu base de datos
    .select("*") // Selecciona todos los campos
    .eq("id_usuario_propietario", id_usuario_propietario); // Filtra por el usuario propietario

  if (error) throw new Error(error.message);

  return data; // Devuelve la lista de hábitos
};

exports.obtenerHabitosPorDia = async (diaSemana) => {
  const { data, error } = await supabase
    .from("Habitos")
    .select("*")

  if (error) throw new Error(error.message);

  const habitosHoy = data.filter(habito => {
    const diasFrecuencia = habito.frecuencia || [];
    const tieneDiaSemana = diasFrecuencia.includes(diaSemana);
    return tieneDiaSemana;
  });

  return habitosHoy;
};









exports.obtenerProgresosDelDia = async (userId, diaSemana, fechaHoy) => {
  // Obtener hábitos con su progreso para hoy
  const { data, error } = await supabase
    .from("Habitos")
    .select(`
      id,
      nombre,
      frecuencia,
      Progreso_habitos(id, fecha, completado)
    `)
    .eq("id_usuario_propietario", userId)

  if (error) throw new Error(error.message);

  const habitosHoy = data.filter(habito => {
    const diasFrecuencia = habito.frecuencia || [];
    const tieneDiaSemana = diasFrecuencia.includes(diaSemana);
    return tieneDiaSemana;
  });


  // Formatear la respuesta
  const progresosFormateados = habitosHoy.map((habito) => {

    const fechaHoyFormateada = new Date(fechaHoy).toISOString().split('T')[0]; // Convierte a 'YYYY-MM-DD'

    // Buscar el progreso del hábito para el día de hoy
    const progresoHoy = habito.Progreso_habitos.find(progreso => {
      const fechaProgreso = new Date(progreso.fecha).toISOString().split('T')[0]; // Convierte la fecha del progreso a 'YYYY-MM-DD'
      return fechaProgreso === fechaHoyFormateada; // Compara solo las fechas (sin hora)
    });

    return {
    id_habito: habito.id,
    nombre: habito.nombre,
    frecuencia: habito.frecuencia,
    fecha: progresoHoy.fecha,
    completado: progresoHoy.completado,
    progreso_id: progresoHoy.id
    }

  });

  return progresosFormateados;
};


exports.crearActualizarProgreso = async (id_habito, fecha, completado) => {
  const { data, error } = await supabase
    .from("Progreso_habitos")
    .upsert(
      { id_habito, fecha, completado },
      { onConflict: ["id_habito", "fecha"] }
    )
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
};


exports.marcarProgreso = async (progresoId, completado) => {
  const { data, error } = await supabase
    .from("Progreso_habitos")
    .update({ completado })
    .eq("id", progresoId)
    .select("*");

    if (error) throw new Error(error.message);

  return data[0];
};


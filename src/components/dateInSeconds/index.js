export default function dateInSeconds(dateString) {
  // Paso 1: Parsear la fecha y hora
  const date = new Date(dateString);

  // Paso 2: Obtener la marca de tiempo en milisegundos
  const timeInMilliseconds = date.getTime();

  // Paso 3: Convertir a segundos
  const timeInSeconds = Math.floor(timeInMilliseconds / 1000);

  return timeInSeconds;
}

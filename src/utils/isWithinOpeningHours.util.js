module.exports = (dateUTC, open, close) => {
  const date = new Date(dateUTC);

  const localDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: 'America/Sao_Paulo'
    })
  );

  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);

  const currentMinutes =
    localDate.getHours() * 60 + localDate.getMinutes();

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes &&
         currentMinutes <= closeMinutes;
};
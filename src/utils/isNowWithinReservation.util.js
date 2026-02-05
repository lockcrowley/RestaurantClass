function isNowWithinReservation(reservation) {
  const now = new Date();

  return now >= reservation.startAt && now <= reservation.endAt;
}

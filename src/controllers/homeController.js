const Reserva = require('../models/ReservaModel');

exports.index = async (req, res) => {
  console.log(req.params.data);
  const reservas = await Reserva.buscaReservaPorData(req.params.data);
  res.render('index', { query: req.params, reservas: reservas });
  return;
};
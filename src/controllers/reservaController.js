const Reserva = require('../models/ReservaModel');

exports.index = async (req, res) => {
  // res.send(`Oi`);
  const reservas = await Reserva.buscaReservasPorProf(req.session.user);
  res.render('reservas', { reservas: reservas });
  return;
};


exports.cadastro = (req, res) => {
  console.log("DEBUUG"); console.log(req.session.user);
  res.render('reserva', { reserva: {}, user: req.session.user });
  return;
};

exports.register = async (req, res) => {
  try {
    const reserva = new Reserva(req.body);
    await reserva.register();

    if (reserva.errors.length > 0) {
      req.flash('errors', reserva.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Reserva cadastrado com sucesso.');
    req.session.save(() => res.redirect(`/reservas/index/${reserva.reserva._id}`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
};

exports.editIndex = async function (req, res) {
  if (!req.params.id) return res.render('404');
  const reserva = await Reserva.buscaPorId(req.params.id);
  if (!reserva) return res.render('404');
  console.log(reserva);

  res.render('reserva', { reserva });
};

exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404');
    const reserva = new Reserva(req.body);
    await reserva.edit(req.params.id);

    if (reserva.errors.length > 0) {
      req.flash('errors', reserva.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Reserva editada com sucesso.');
    req.session.save(() => res.redirect(`/reservas/index/${reserva.reserva._id}`));
    return;
  } catch (e) {
    console.log(e);
  }

}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');

  const reserva = await Reserva.delete(req.params.id);
  if (!reserva) return res.render('404');
  
  req.flash('success', 'Reserva apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};
const Contato = require('../models/ContatoModel');

exports.cadastro = (req, res) => {
  res.render('cadastro', { contato: {} });
  return;
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Contato cadastrado com sucesso.');
    req.session.save(() => res.redirect(`/contatos/index/${contato.contato._id}`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
};

exports.editIndex = async function (req, res) {
  if (!req.params.id) return res.render('404');
  const contato = await Contato.buscaPorId(req.params.id);
  if (!contato) return res.render('404');
  console.log(contato);

  res.render('cadastro', { contato });
};

exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('success', 'Contato editado com sucesso.');
    req.session.save(() => res.redirect(`/contatos/index/${contato.contato._id}`));
    return;
  } catch (e) {
    console.log(e);
  }

}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if (!contato) return res.render('404');
  
  req.flash('success', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('/'));
  return;
};
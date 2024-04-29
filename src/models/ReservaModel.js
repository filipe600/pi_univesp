const mongoose = require('mongoose');
const validator = require('validator');

const ReservaSchema = new mongoose.Schema({
  nome : { type: String, required: true },
  lab : { type: String, required: true },
  turma : { type: String, required: true, default: '' },
  data : { type: Date, required: true, default: '' },
  turno : { type: String, required: true, default: '' },
  bloco : { type: String, required: true, default: '' },
  obs : { type: String, required: false, default: '' },
  createdAt : { type: Date, required: true, default: Date.now }
});

const ReservaModel = mongoose.model('Reserva', ReservaSchema);

function Reserva(body) {
  this.body = body;
  this.errors = [];
  this.reserva = null;

};

Reserva.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.reserva = await ReservaModel.create(this.body);
};

Reserva.prototype.valida = function() {
  this.cleanUp();
  if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
  if (!this.body.lab) this.errors.push('Você deve selecionar um laboratório');
  if (!this.body.turma) this.errors.push('Você deve selecionar uma turma');
  if (!this.body.data) this.errors.push('Você deve selecionar uma data');
  if (!this.body.turno || !this.body.bloco) {
    this.errors.push('Você deve selecionar turno e bloco');
  }
};

Reserva.prototype.cleanUp = function() {
  for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
          this.body[key] = '';
      }
  }
};

Reserva.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.reserva = await ReservaModel.findOneAndUpdate({_id : id}, this.body, {new: true});
};

Reserva.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const reserva =  await ReservaModel.findById(id);
  return reserva;
};

Reserva.buscaReservas = async function() {
    const reservas =  await ReservaModel.find().sort({ lab: 1, data: -1, turno: -1, bloco: 1});
    return reservas;
};

Reserva.buscaReservasPorProf = async function(user) {
  let nome;
  if(user != undefined) {
    nome = user.nome;
    const reservas =  await ReservaModel.find({nome}).sort({ data: -1, turno: -1, bloco: 1}).exec();;
    return reservas;
  }
  return;
};

Reserva.delete = async function(id) {
  if(typeof id !== 'string') return;
  const reserva =  await ReservaModel.findOneAndDelete({_id : id});
  return reserva;
};

Reserva.buscaReservaPorData = async function(data) {
  if(typeof data !== 'string') {
  let hoje = new Date() ;
  //hoje.setHours(-3);
  data = hoje.toISOString().substring(0,10);
  console.log("now"+data);
  }
  const reservas =  await ReservaModel.find({data : data}).sort({ data: -1, turno: -1, bloco: 1}).exec();;
  console.log(reservas);
  return reservas;
};

module.exports = Reserva;

const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        
        this.user = await LoginModel.create(this.body);
    }
    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já cadastrado.');
    }

    async login(){
        this.validaLogin();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        console.log(this.user);
        if(this.user){
            if(!bcryptjs.compareSync(this.body.password, this.user.password)){
                this.errors.push('Usuário e Senha inválidos.');
                this.user = null;
                return;
            }
        } else {
            this.errors.push('Usuário e Senha inválidos.')
            return;
        }

    }

    valida() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha deve ter entre 6 e 50 caracteres.');
        }
        if (this.body.nome.length < 3 || this.body.nome.length > 20) {
            this.errors.push('O nome do usuário deve ter entre 6 e 20 caracteres.');
        }



    }
    validaLogin() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha deve ter entre 6 e 50 caracteres.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
    }

}

module.exports = Login;

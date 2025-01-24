const mongoose = require('mongoose');
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { match } = require('assert');
const { type } = require('os');
const { SlowBuffer } = require('buffer');
const secret = require('../config').secret;

const UsuariosSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: [true, "não pode ser vazio"]
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "não pode ser vazio"],
        index: true,
        match: [/\S+@\S+\.\S+/, 'é inválido']//regex para validar email texto@texto.texto
    },
    loja:{
        type: Schema.Types.ObjectId,
        ref: 'Loja',
        required: [true, "não pode ser vazio"]
    },
    permissao:{
        type: Array,
        default: ['cliente']
    },
    //hash e salt são usados para criptografar a senha para nao salvar a senha em texto puro
    hash: String,
    salt: String,
    recovery: {
        type: {
            token: String,
            date: Date
        },
        default: {}
    }
    },{timestamps: true});

    UsuariosSchema.plugin(uniqueValidator, {message: 'já está sendo utilizado'});

    UsuariosSchema.methods.setSenha = function(password){
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    }

    UsuariosSchema.methods.validarSenha = function(password){
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return hash === this.hash;
    }
    UsuariosSchema.methods.gerarToken = function(){
        const hoje = new Date();
        const exp = new Date(hoje);
        exp.setDate(hoje.getDate() + 15);

        return jwt.sign({
            id: this._id,
            email: this.email,
            nome: this.nome,
            exp: parseInt(exp.getTime() / 1000, 10)
        }, secret);
    }
    UsuariosSchema.methods.enviarAuthJSON = function(){
        return {
            _id: this._id,
            nome: this.nome,
            email: this.email,
            loja: this.loja,
            role: this.permissao,
            token: this.gerarToken()
        }
    }
    UsuariosSchema.methods.criarTokenRecuperacaoSenha = function(){
        this.recovery = {};
        this.recovery.token = crypto.randomBytes(16).toString('hex');
        this.recovery.date = new Date(new Date().getTime() + 24*60*60*1000);
        return this.recovery;
    }
    UsuariosSchema.methods.finalizarTokenRecuperacaoSenha = function(){
        this.recovery = {token: null, date: null};
        return this.recovery;
    }
    module.exports = mongoose.model('Usuario', UsuariosSchema);
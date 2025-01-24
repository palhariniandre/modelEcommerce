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
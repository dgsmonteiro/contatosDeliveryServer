const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: Number,
        validate: {
            validator: function(cpf) {
                var i = 0; // index de iteracao
                var somatoria = 0;
                var cpf = cpf.toString().split("");
                var dv11 = cpf[cpf.length - 2]; // mais significativo
                var dv12 = cpf[cpf.length - 1]; // menos significativo
                cpf.splice(cpf.length - 2, 2); // remove os digitos verificadores originais
                for(i = 0; i < cpf.length; i++) {
                  somatoria += cpf[i] * (10 - i);
                }
                var dv21 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
                cpf.push(dv21);
                somatoria = 0;
                for(i = 0; i < cpf.length; i++) {
                  somatoria += cpf[i] * (11 - i);
                }
                var dv22 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
            
                if (dv11 == dv21 && dv12 == dv22) {
                  return true
                } else {
                  return false
                }
            },
            message: props => `${props.value} nãp é um cpf válido!`
        },
        required: [true, 'cpf obrigatório']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    accountType: {
        type: Number,
        required: true,
        select: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

let User = mongoose.model('User', UserSchema);

module.exports = User;
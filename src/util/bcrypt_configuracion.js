const bcryptjs = require('bcryptjs');

const util= {};

util.encriptar_password = async(password)=>{
    const salt = await bcryptjs.genSalt(10);
    const password_cifrado = await bcryptjs.hash(password, salt);
    return password_cifrado;
}

util.desencriptar_password = async (password, password_guardado)=>{
    try {
        return await bcryptjs.compare(password, password_guardado);
    } catch (error) {
        console.log(error);
    }
}

module.exports= util;
module.exports = {

    usuarioIngreso(req, res, next){      
     if(req.isAuthenticated()){
         return next();
     }
     return res.redirect('/usuarios/salir');
    },

    usuarioNoIngreso(req, res, next){
     if(!req.isAuthenticated()){
         return next();
     }
     return res.redirect('/usuarios/perfil');
    }

}
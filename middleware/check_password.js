const passwordValidator = require('password-validator');

const passwordValidation = new passwordValidator();

passwordValidation
    .is().min(4)                                    // Longueur minimale  
    .is().max(100)                                  // Longueur maximale
    .has().uppercase()                              // Doit contenir des lettres majuscules
    .has().lowercase()                              // Doit contenir des lettres minuscules
    .has().digits(2)                                // Doit avoir au moins N chiffres
    .has().not().spaces()                           // Ne doit pas avoir d'espaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Liste noire ces valeurs


module.exports = (req, res, next) => {
    if (!passwordValidation.validate(req.body.password)) {
        res.status(400).json({
            message: 'Le MDP doit faire 4 caractères au moins, avec une maj, une min et un chiffre au moins et sans espace.'
        });
    } else {
        next();
    }
};
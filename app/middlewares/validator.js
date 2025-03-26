const { body, validationResult } = require('express-validator');

const validateDetento = [

    body('nome')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome deve conter entre 3 e 100 caracteres alfabéticos.')
        .matches(/^[A-Za-zÀ-ú\s]+$/)
        .withMessage('O nome deve conter apenas letras.'),

    body('idade')
        .isInt({ min: 18, max: 125 })
        .withMessage('A idade deve estar entre 18 e 125 anos.'),

    body('filiacao')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('A filiação deve conter entre 3 e 50 caracteres alfabéticos.')
        .matches(/^[A-Za-zÀ-ú\s]+$/)
        .withMessage('A filiação deve conter apenas letras.'),

    body('crimes')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('A descrição dos crimes deve conter entre 5 e 500 caracteres.'),

    body('nomeAdvogado')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome deve conter entre 3 e 50 caracteres alfabéticos.')
        .matches(/^[A-Za-zÀ-ú\s]+$/)
        .withMessage('O nome deve conter apenas letras.'),

    body('numeroOAB')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('O campo deve conter apenas numeros até 6 digitos.')
        .matches(/^[0-9]+$/)
        .withMessage('O número da OAB deve conter exatamente 6 dígitos.'),

    body('dataVisita')
        .isISO8601()
        .toDate()
        .withMessage('A data de visita tem que ser uma data valida!.')
        .custom((value) => {
            const dataAtual = new Date();
            dataAtual.setHours(0, 0, 0, 0);
            if (value < dataAtual) {
                throw new Error('A data de visita não pode ser no passado.');
            }
            return true;
        }),

    body('observacoes')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('A descrição dos crimes deve conter entre 5 e 500 caracteres.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];

module.exports = validateDetento;
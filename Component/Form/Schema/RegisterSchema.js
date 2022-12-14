import * as Yup from 'yup';

export const RegisterSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email invalide")
        .required('Email requis'),
    pseudo: Yup.string()
        .required(" ")
        .min(5, "5 caractères minimum")
        .max(15, "15 caractères maximum"),
    password: Yup.string()
        .required("")
        .min(5, "Mot de passe doit être plus grand que 5 caractères")
        .max(50, "Mot de passe doit être plus petit que 50 caractères"),
    confirmPassword: Yup.string()
        .required("")
        .oneOf(
            [Yup.ref("password"), null],
            "Les mots de passe ne correspondent pas"
        ),
});
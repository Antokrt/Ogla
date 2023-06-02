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
        .min(5, "5 caractères minimum")
        .max(50, "50 caractères maximum"),
    confirmPassword: Yup.string()
        .required("")
        .oneOf(
            [Yup.ref("password"), null],
            "Mots de passe non correspondants"
        ),
});
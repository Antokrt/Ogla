import * as Yup from 'yup';

export const AuthorSchema = Yup.object().shape({
    firstName: Yup.string()
        .required(" ")
        .min(5, "2 caractères minimum")
        .max(15, "15 caractères maximum"),

    lastName: Yup.string()
        .required(" ")
        .min(2, "2 caractères minimum")
        .max(15, "15 caractères maximum"),

    age: Yup.string()
        .required(" "),


    email: Yup.string()
        .email("Email invalide")
        .required('Email requis'),

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

    pseudo: Yup.string()
        .required(" ")
        .min(5, "5 caractères minimum")
        .max(15, "15 caractères maximum"),

    description: Yup.string()
        .required(" ")
        .min(10, "10 caractères minimum")
        .max(500, "500 caractères maximum"),
})

export const AuthorSchemaLog = Yup.object().shape({
    firstName: Yup.string()
        .required(" ")
        .min(5, "2 caractères minimum")
        .max(15, "15 caractères maximum"),

    lastName: Yup.string()
        .required(" ")
        .min(2, "2 caractères minimum")
        .max(15, "15 caractères maximum"),

    age: Yup.string()
        .required(" "),

    pseudo: Yup.string()
        .required(" ")
        .min(5, "5 caractères minimum")
        .max(15, "15 caractères maximum"),

    description: Yup.string()
        .required(" ")
        .min(10, "10 caractères minimum")
        .max(500, "500 caractères maximum"),
})


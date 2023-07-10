import * as Yup from 'yup';

export const AuthorSchema = Yup.object().shape({
    firstName: Yup.string()
        .required(" ")
        .min(2, "2 caractères min")
        .max(15, "15 caractères max"),

    lastName: Yup.string()
        .required(" ")
        .min(2, "2 caractères minimum")
        .max(15, "15 caractères max"),

    age: Yup.string()
        .required(" "),

    email: Yup.string()
        .email("Email invalide")
        .required('Requis'),

    password: Yup.string()
        .required("")
        .min(5, "5 caractères min")
        .max(50, "50 caractères max"),

    confirmPassword: Yup.string()
        .required("")
        .oneOf(
            [Yup.ref("password"), null],
            "Non correspondant"
        ),

    pseudo: Yup.string()
        .required(" ")
        .min(5, "5 caractères min")
        .max(15, "15 caractères max"),

    description: Yup.string()
        .required(" ")
        .min(10, "10 caractères min")
        .max(500, "500 caractères max"),
})

export const AuthorSchemaLog = Yup.object().shape({
    firstName: Yup.string()
        .required(" ")
        .min(2, "2 caractères min")
        .max(15, "30 caractères max"),

    lastName: Yup.string()
        .required(" ")
        .min(2, "2 caractères min")
        .max(15, "15 caractères max"),

    age: Yup.string()
        .required(" "),

    pseudo: Yup.string()
        .notRequired()
        .min(0, "5 caractères min")
        .max(15, "15 caractères max"),

    description: Yup.string()
        .required(" ")
        .min(10, "10 caractères min")
        .max(500, "500 caractères max"),
})


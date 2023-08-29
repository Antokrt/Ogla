import * as Yup from 'yup';
import Category from '../../../../json/category.json';

const validCategory = Category;

export const NewBookSchema = Yup.object().shape({
    title: Yup.string()
        .required(" ")
        .min(5, "5 caractères minimum")
        .max(50, "50 caractères maximum"),

    summary: Yup.string()
        .required(" ")
        .max(1000, "1000 caractères maximum"),

    category: Yup.string()
        .required(" ")
        .oneOf(validCategory, 'Catégorie Invalide')
        .max(50, "50 caractères maximum"),

})

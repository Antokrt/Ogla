import {instance} from "../config/Interceptor";
import axios from "axios";

export const getAllBooks = (token) => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:3008/book/')
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}
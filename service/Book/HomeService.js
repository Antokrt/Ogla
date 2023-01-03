import axios from "axios";
export const getAllBooks = (token) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'Authorization': 'Bearer ' + token}
            }
         axios.get('http://localhost:3008/book/', config)
             .then((res) => resolve(res))
             .catch((err) => reject(err));
    })
}
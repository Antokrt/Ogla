import styles from "../../styles/Pages/Dashboard.module.scss";
import Header from "../../Component/Header";
import VerticalAuthorMenu from "../../Component/Menu/VerticalAuthorMenu";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Books from "../../Component/Dashboard/Books";
import {useSession} from "next-auth/react";
import { getToken } from 'next-auth/jwt';

import {getBooksByAuthor} from "../../service/Dashboard/BooksAuthorService";
import {getConfigOfProtectedRoute} from "../api/utils/Config";


export async function getServerSideProps({context, req}){
    const config = await getConfigOfProtectedRoute(req);
    const books = await fetch('http://localhost:3008/author/my-books',config);
    const booksErrData = books.ok ? false : books.status;
    const booksJson = await books.json()

    return {
        props:{
            err:{
                books:booksErrData
            },
            books: booksJson,
        }
    }
}

export default function DashboardAuthor({books}) {

    const router = useRouter();
    const [select, setSelect] = useState('');
    const {data: session} = useSession();

    useEffect(() => {
        const local = localStorage.getItem('dashboard');
        if (local !== '') {
            setSelect(local);
        }
    }, [])


    useEffect(() => {
        if (select !== 'Accueil') {
            router.replace({
                pathname: router.pathname,
                query: select
            })
            localStorage.setItem('dashboard', select);
        }
    }, [select])

    const displayBooks = () => {
        return (
            <Books books={books} />
        )
    }

    const checkLink = (link) => {
        switch (link) {
            case 'Accueil':
                router.push('/');
                break;
            case 'books':
                return displayBooks();
                break;

            case 'new':
                console.log('link');
                break;
            case 'notifications':
                console.log('link');
                break;

            default:
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu setLink={setSelect}/>
                </div>
                <div className={styles.containerData}>
                    {
                        checkLink(select)
                    }
                </div>

            </div>

        </div>
    )
}
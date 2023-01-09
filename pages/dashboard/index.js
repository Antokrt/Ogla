import styles from "../../styles/Pages/Dashboard.module.scss";
import Header from "../../Component/Header";
import VerticalAuthorMenu from "../../Component/Menu/VerticalAuthorMenu";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Books from "../../Component/Dashboard/Books";
import {useSession} from "next-auth/react";
import { getToken } from 'next-auth/jwt';

import {getBooksByAuthor} from "../../service/Dashboard/BooksAuthorService";


export async function getServerSideProps(context){
    const res = await getBooksByAuthor();
    const data = await res;

    return {
        props:{
            books: JSON.stringify(data)
        }
    }
}

export default function DashboardAuthor({message,books}) {

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
        console.log(JSON.parse(books))
    },[message])

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
            <Books/>
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
                    {message}
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
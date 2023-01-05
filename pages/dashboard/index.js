import styles from "../../styles/Pages/Dashboard.module.scss";
import Header from "../../Component/Header";
import VerticalAuthorMenu from "../../Component/Menu/VerticalAuthorMenu";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Books from "../../Component/Dashboard/Books";

export default function DashboardAuthor() {

    const router = useRouter();

    const [select, setSelect] = useState('');

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
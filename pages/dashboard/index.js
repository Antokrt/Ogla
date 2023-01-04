import styles from "../../styles/Pages/Dashboard.module.scss";
import Header from "../../Component/Header";
import VerticalAuthorMenu from "../../Component/Menu/VerticalAuthorMenu";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function DashboardAuthor() {

    const router = useRouter();

    const [select, setSelect] = useState('');

    useEffect(() => {
        console.log(select)
        const params = router.query;
        setSelect(Object.getOwnPropertyNames(params)[0])
    },[])

    useEffect(() => {
        checkLink(select);
    },[select])

    const checkLink = (link) => {
        switch (link){
            case 'Accueil':
                router.push('/');
                break;
            case'books':
                console.log('link');
                break;
            case 'new':
                console.log('link');
                break;
            case 'notifications':
                console.log('link');
            break;

            default:
                setSelect(Object.keys(router.query)[0]);
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu setLink={setSelect}/>
                </div>
                <div className={styles.titleContainer}>
                        {
                            select !== 'Accueil' &&
                            <h1> {select} </h1>
                        }
                </div>
            </div>

        </div>
    )
}
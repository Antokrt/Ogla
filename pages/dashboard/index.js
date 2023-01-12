import styles from "../../styles/Pages/Dashboard/Books.module.scss";
import VerticalAuthorMenu from "../../Component/Menu/VerticalAuthorMenu";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {getConfigOfProtectedRoute} from "../api/utils/Config";
import HeaderDashboard from "../../Component/Dashboard/HeaderDashboard";


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
    const {data: session} = useSession();

    return (
            <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
                    <HeaderDashboard/>
                    <h1>Accueil</h1>
                </div>

            </div>

        </div>
    )
}
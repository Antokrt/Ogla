import styles from '../../../styles/Pages/Dashboard/Books.module.scss';
import {useSession} from "next-auth/react";
import {BellAlertIcon, ClockIcon, MagnifyingGlassIcon, PencilIcon} from "@heroicons/react/24/outline";
import CardBook from "../../../Component/Dashboard/Card/CardBook";
import {useEffect, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {useRouter} from "next/router";
import {GetMoreBookService} from "../../../service/Dashboard/BooksAuthorService";

export async function getServerSideProps({context, req}){
    const config = await getConfigOfProtectedRoute(req);
    const books = await fetch('http://localhost:3008/author/my-books/1',config);
    const booksErrData = books.ok ? false : books.status;
    const booksJson = await books.json();
    return {
        props:{
            err:booksErrData,
            booksData: booksJson,
        }
    }
}

const Books = ({booksData,err}) => {

    const {data: session} = useSession();
    const [page,setPage] = useState(2);
    const [books,setBooks] = useState(booksData);
    const [seeMore,setSeeMore] = useState(true);

    const getMoreBooks = () => {
GetMoreBookService(page)
    .then((res) => {
        if(res.length <= 0){
            setSeeMore(false);
        }
        else {
            setBooks(prevState => [...prevState, ...res]);
            setPage(page + 1);
        }
    })

    }


    const hasNoBooks = () => {
        return (
            <div className={styles.mainHasNoBooks}>
                <div className={styles.hasNotWriteContainer}>
                    <div>
                        <h3>OUPS <span>...</span></h3>
                        <p>Il n'y a pas encore de livres ici, mais ça ne veut pas dire que vous ne pouvez pas être le prochain Hemingway ou J.K. Rowling ! <br/> Commencez à écrire votre chef-d'œuvre dès maintenant !</p>
                        <h5>Quelques astuces pour bien débuter :</h5>
                        <ul>
                            <li>1. Écrire sur <span>OGLA</span></li>
                            <li>2. Choisir son image</li>
                            <li>3. Fidéliser ses lecteurs</li>

                        </ul>
                        <button>Nouveau livre <PencilIcon/></button>
                    </div>
                    <img src={'assets/chara/chara4.png'}/>

                </div>
            </div>


        )
    }



    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                <div className={styles.verticalMenuContainer}>
                    <VerticalAuthorMenu/>
                </div>
                <div className={styles.containerData}>
<HeaderDashboard/>
                                    <div className={styles.headerList}>
                                        <h4>Mes livres <span>({books?.length})</span> </h4>
                                    </div>
                                    <div className={styles.list + ' ' + styles.scrollbar}>

                                       {
                                           books && !err &&
                                            books.map((item, index) => {
                                                return (
                                                    <CardBook id={item._id}
                                                              image={item.img}
                                                              title={item.title}
                                                              nbChapter={item.nbChapter}
                                                              likes={item.likes}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                    {
                        seeMore &&
                        <p className={styles.seeMore} onClick={() => getMoreBooks()}>Voir plus</p>
                    }

                    {
                            books.length === 0 &&
                            hasNoBooks()
                        }
            </div>

        </div>


        </div>
    )
}

export default Books;
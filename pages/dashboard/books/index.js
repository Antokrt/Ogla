import styles from '../../../styles/Pages/Dashboard/Books.module.scss';
import {useSession} from "next-auth/react";
import {
    ArrowDownCircleIcon,
    BellAlertIcon, BookmarkSquareIcon,
    ClockIcon, CursorArrowRaysIcon,
    MagnifyingGlassIcon,
    PencilIcon, QueueListIcon, Square3Stack3DIcon
} from "@heroicons/react/24/outline";
import CardBook, {CardBookDashboard} from "../../../Component/Dashboard/Card/CardBook";
import {useEffect, useRef, useState} from "react";
import VerticalAuthorMenu from "../../../Component/Menu/VerticalAuthorMenu";
import HeaderDashboard from "../../../Component/Dashboard/HeaderDashboard";
import {getConfigOfProtectedRoute} from "../../api/utils/Config";
import {useRouter} from "next/router";
import {GetMoreBookService} from "../../../service/Dashboard/BooksAuthorService";
import {CardBookPublic} from "../../../Component/Card/CardBook";
import {FilterBtn, FilterBtn3, SeeMoreBtn, TextSeeMore} from "../../../Component/layouts/Btn/ActionBtn";
import {ConfirmModal} from "../../../Component/Modal/ConfirmModal";
import {DateNow} from "../../../utils/Date";
import {LoaderCommentary} from "../../../Component/layouts/Loader";
import {GetBooksWithCategoryService} from "../../../service/Book/BookService";
import ErrMsg from "../../../Component/ErrMsg";
import SmHeaderDashboard from "../../../Component/Dashboard/SmHeaderDashboard";
import VerticalPhoneMenu from "../../../Component/Menu/VerticalPhoneMenu";
import VerticalTabMenu from "../../../Component/Menu/VerticalTabMenu";
import ScreenSize from "../../../utils/Size";
import useOrientation from "../../../utils/Orientation";
import {ArrowSmallDownIcon, Bars4Icon} from "@heroicons/react/24/solid";
import {CardBookDashboardTab} from "../../../Component/Dashboard/Card/CardBookTab";
import {CardBookPhone} from "../../../Component/Dashboard/Card/CardBookPhone";

export async function getServerSideProps({context, req}) {
    const config = await getConfigOfProtectedRoute(req);
    const books = await fetch('http://localhost:3008/author/my-books/popular/1', config);
    const nbBooks = await fetch('http://localhost:3008/author/books-number', config)
    const booksErrData = books.ok ? false : books.status;
    const booksJson = await books.json();
    console.log(booksJson)

    const nbBooksJson = await nbBooks.json();
    return {
        props: {
            err: booksErrData,
            booksData: booksJson,
            nbBooks: nbBooksJson
        }
    }
}

const Books = ({booksData, err, nbBooks}) => {

    const {data: session} = useSession();
    const [page, setPage] = useState(2);
    const [books, setBooks] = useState(booksData);
    const [seeMore, setSeeMore] = useState(true);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const [activeFilter, setActiveFilter] = useState('popular');
    const [width, height] = ScreenSize();
    const orientation = useOrientation();
    const divRef = useRef(null);
    const router = useRouter();

    const scrollBottom = () => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    }

    useEffect(() => {
       console.log(session)
    },[])

    const getMoreBooks = () => {
        setSeeMore(false);
        setLoadingScroll(true);
        GetMoreBookService(activeFilter, page)
            .then((res) => {
                if (res.length <= 0) {
                    setSeeMore(false);
                } else {
                    setBooks(prevState => [...prevState, ...res]);
                    setPage(page + 1);
                    setSeeMore(true);
                }
            })
            .then(() => setLoadingScroll(false))
            .then(() => setTimeout(() => scrollBottom()), 20)
            .catch((err) => {
                setLoadingScroll(false);
                console.log(err)
            })
    }

    const getBooksWithNewFilter = (filter) => {
        setLoadingScroll(true);
        setSeeMore(true);
        GetMoreBookService(filter, 1)
            .then((res) => {
                setBooks(res);
            })
            .then(() => {
                setPage(2);
                setLoadingScroll(false);
            })
            .catch((err) => setLoadingScroll(false));
    }


    const hasNoBooks = () => {
        return (
            <div className={styles.mainHasNoBooks}>
                <div className={styles.hasNotWriteContainer}>
                    <div className={styles.contentNoBooks}>
                        <h3>OUPS...</h3>
                        <p>Il n'y a pas encore de livres ici, mais ça ne veut pas dire que vous ne pouvez pas être le
                            prochain Hemingway ou Zadie Smith !
                   </p>
                        <p>       Commencez à écrire votre chef-d'œuvre dès
                            maintenant !</p>

                        <button onClick={() => router.push('/dashboard/nouveau-livre')}>C'est parti ! <CursorArrowRaysIcon/></button>
                    </div>
                    <div className={styles.imgNoBooks}>
                        <img src={'/assets/diapo/book.png'}/>
                    </div>

                </div>
            </div>


        )
    }


    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>
                {
                    width < 700 && orientation === 'portrait' ?
                        <VerticalPhoneMenu/>
                        :
                        <>
                            {
                                width >= 700 && width <= 1050 ?
                                    <div className={styles.verticalTabContainer}>
                                        <VerticalTabMenu/>
                                    </div>
                                    :
                                    <div className={styles.verticalMenuContainer}>
                                        <VerticalAuthorMenu/>
                                    </div>
                            }
                        </>

                }

                <div className={styles.containerData}>
                    <SmHeaderDashboard title={'Tableau de bord'}/>
                    {
                        err &&
                        <div className={styles.errContainer}>
                            <ErrMsg textBtn={"Retour à l'accueil"} click={() => router.push('/')}
                                    text={'Impossible de récupérer les données de vos livres, veuillez réessayer.'}/>
                        </div>

                    }

                    {
                        books && booksData && !err && books.length !== 0 &&
                        <div className={styles.listContainer} ref={divRef}>
                            <div className={styles.headerList}>
                                <h4>Mes livres <BookmarkSquareIcon/></h4>
                            </div>
                            <div className={styles.sortContainer}>
                                <FilterBtn3 onclick={() => {
                                    activeFilter === 'recent' ? setActiveFilter('popular') : setActiveFilter('recent');
                                    activeFilter === 'recent' ? getBooksWithNewFilter('popular') : getBooksWithNewFilter('recent');
                                }} filter={activeFilter}/>
                                <p>{nbBooks} livre(s)</p>
                            </div>
                            <div className={styles.list}>

                                {
                                    books.map((item, index) => {
                                        let isTop = false;
                                        if (item.top && nbBooks > 1) {
                                            isTop = true;
                                        }
                                        return (
                                            <>
                                                {
                                                    width > 1300 &&
                                                    <CardBookDashboard
                                                        top={isTop}
                                                        nbChapter={item.nbChapter}
                                                        id={item._id}
                                                        img={item.img}
                                                        category={item.category}
                                                        title={item.title + ' ainsi que des autres livres'}
                                                        likes={item.likes}
                                                        date={item.date_creation}
                                                        nbView={item.stats.view}
                                                    />
                                                }

                                                {
                                                    width <= 1300 && width > 560 &&
                                                    <CardBookDashboardTab
                                                        top={isTop}
                                                        nbChapter={item.nbChapter}
                                                        id={item._id}
                                                        img={item.img}
                                                        category={item.category}
                                                        title={item.title + ' ainsi que des autres livres'}
                                                        likes={item.likes}
                                                        date={item.date_creation}
                                                        nbView={item.stats.view}
                                                    />
                                                }

                                                {
                                                    width <= 560 &&
                                                    <CardBookPhone
                                                        top={isTop}
                                                        nbChapter={item.nbChapter}
                                                        id={item._id}
                                                        img={item.img}
                                                        category={item.category}
                                                        title={item.title + ' ainsi que des autres livres'}
                                                        likes={item.likes}
                                                        date={item.date_creation}
                                                        nbView={item.stats.view}
                                                    />
                                                }
                                            </>

                                        )
                                    })
                                }

                            </div>


                            {
                                nbBooks > books.length &&
                                <div className={styles.seeMoreContainer}>
                                    {
                                        seeMore && !loadingScroll &&
                                        <TextSeeMore onclick={() => getMoreBooks()}/>
                                    }
                                    {
                                        loadingScroll &&
                                        <LoaderCommentary/>
                                    }
                                </div>
                            }

                        </div>
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
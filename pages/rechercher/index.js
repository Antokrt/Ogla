import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import styles from '../../styles/Pages/Search.module.scss';
import Header from "../../Component/Header";
import MainSearchBar from "../../Component/MainSearchBar";
import PreviewPost from "../../Component/Post/PreviewPost";
import Footer from "../../Component/Footer";
import PreviewHorizontalPost from "../../Component/Post/PreviewHorizontalPost";
import PreviewHorizontalPostList from "../../Component/Post/PreviewHorizontalPostList";
const SearchPage = () => {
    const router = useRouter();
    const [searchValue,setSearchValue] = useState('');
    useEffect(() => {
        const params = router.query;
        setSearchValue(params.search);
    }, [router.query])
    const [filter, setFilter] = useState({
        list:["Populaire", "Récent", "Plus de chapitres"],
        active:"Populaire"
    });


    return (
        <div className={styles.container}>
            <Header/>

            <div className={styles.searchContainer}>
                <form>
                    <input onChange={(e) => {
                        setSearchValue(e.target.value);

                    }} type={"text"} value={searchValue} placeholder={"Rechercher"} />
                </form>
            </div>

            <div className={styles.containerM}>
                <div className={styles.containerCardPreview}>
                    <div className={styles.sortContainer}>
                        <h3>Résultats pour "{searchValue}"</h3>
                        <div>
                            {
                                filter.list.map((item) => {
                                    return (
                                        <button
                                            onClick={()=> setFilter({...filter,active: item})}
                                            className={filter.active === item && styles.activeBtn} key={item}>{item}</button>

                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.card}>

                        <PreviewPost title={"Meurtre À KoalaLand"}
                                     snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                         "\n"}
                                     like={332}
                                     category={"SF"}
                                     author={"Jimmy MC"}
                                     nbChapter={26}
                                     img={"/assets/234083.jpg"}
                        />

                        <PreviewPost title={"Meurtre à KoalaLand"}
                                     snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                         "\n"}
                                     like={332}
                                     category={"SF"}
                                     author={"Jimmy MC"}
                                     nbChapter={26}
                                     img={"/assets/234083.jpg"}
                        /> <PreviewPost title={"Meurtre à KoalaLand"}
                                        snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                            "\n"}
                                        like={332}
                                        category={"SF"}
                                        author={"Jimmy MC"}
                                        nbChapter={26}
                                        img={"/assets/234083.jpg"}
                    /> <PreviewPost title={"Meurtre à KoalaLand"}
                                    snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                        "\n"}
                                    like={332}
                                    category={"SF"}
                                    author={"Jimmy MC"}
                                    nbChapter={26}
                                    img={"/assets/234083.jpg"}
                    />
                    </div>
                </div>
                <div className={styles.previewContainer}>
                    <PreviewHorizontalPostList type={"category"} title={"Populaires cette semaine"}/>
                    <PreviewHorizontalPostList type={"category"} title={"Tendance"}/>

                </div>
            </div>

<Footer/>
        </div>
    )
}

export default SearchPage;
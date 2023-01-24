import Header from "../../Component/Header";
import BannerOnPost from "../../Component/BannerOnPost";
import {useRouter} from "next/router";
import PreviewPost from "../../Component/Post/PreviewPost";
import styles from "../../styles/Pages/Category.module.scss";
import React, {useEffect, useState} from "react";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {getData} from "../../services/Post";
import NewFeatured from "../../Component/Category/New";
import LogCard from "../../Component/layouts/LogCard";
import DateNow from "../../utils/Date";
import Footer from "../../Component/Footer";
import {getSession} from "next-auth/react";

export async function getServerSideProps({req}){
    const params = {
        max:5,
        category:'all'
    }
    const popularBooks = await fetch('http://localhost:3008/book-render/popular/'+ params.max +'/'+ params.category);
    const popularErrData = !popularBooks.ok;

    let popularJson = await popularBooks.json();

    if(popularJson.statusCode === 404){
        popularJson = null;
    }
    return {
        props:{
            err:{
                popularBooks:popularErrData
            },
            popularBooks: popularJson,
        }
    }
}

export default function CategoryPage({popularBooks}) {

    const router = useRouter();
    const [filter, setFilter] = useState({
        list: ["Populaire", "Récent", "Plus de chapitres"],
        active: "Populaire"
    });
    const [post, setPost] = useState([]);
    const {query: {cat}} = router;


    useEffect(() => {
        getData()
            .then((res) => {setPost(res)})
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className={styles.container}>
            <Header/>
            <CategoryHeader cat={cat}/>
            <div className={styles.containerM}>
                <div className={styles.containerCategory}>
                    <div className={styles.rankingContainer}>
                        <div className={styles.headerRanking}>
                            {
                                cat === undefined &&
                                <h3>Populaires {cat} - <span className={styles.f}>Tout voir</span></h3>
                            }
                            {
                                cat !== undefined &&
                                <h3>Populaires - <span className={styles.f}> {cat}</span></h3>
                            }

                            <p>{DateNow()}</p>
                        </div>
                        <div className={styles.rankContainer}>

                            <div className={styles.rankingGridContainer}>
                                {
                                    popularBooks
                                        .sort((a, b) => b.like - a.like)
                                        .map((item, index) => {
                                            return (
                                                <FeaturedCategoryPostList
                                                    id={item._id}
                                                    key={item}
                                                    rank={index + 1}
                                                    title={item.title}
                                                    summary={item.summary}
                                                    like={item.like}
                                                    category={item.category}
                                                    author={item.author_pseudo}
                                                    chapterNb={item.nbChapter}
                                                    img={item.img}
                                                    slug={item.slug}

                                                />
                                            )
                                        })
                                }
                            </div>
                            <div className={styles.rankOther}>
                                <NewFeatured title={"Sors la truelle Turcot !"}
                                             description={"Orpheline vivant dans un monastère, Elisha De Lauer était satisfaite et heureuse. C’était le cas jusqu’à ce que les Cartier, connus pour leurs pouvoirs magiques, vinrent la chercher. Cette famille sournoise imposa alors à Elisha un contrat d’esclavage dans l’espoir d’hériter de ses nombreux biens. Après des années de servitude, Elisha connut une fin macabre aux mains de ses bourreaux. Cela aurait pu être la fin de son histoire, mais lorsqu’elle ferma les yeux une dernière fois, la jeune femme se réveilla, projetée dans son propre passé, comme si rien de tout cela ne s’était jamais produit. Depuis cette seconde chance accordée, Elisha jure de se venger des Cartier et trouve le complice idéal en la personne du manipulateur réputé, Lucerne Des Kayas. Ce dernier, un paria de la maison Cartier, s’est également promis de se venger de cette famille. Mais sa méfiance constante envers tout le monde l’incite à conclure un contrat avec Elisha à une seule condition. Elle doit accepter de l’épouser. Engagés dans un faux mariage, ces deux-là s’allient pour découvrir les secrets de la famille Cartier et faire tomber chacun de ses membres. Il y a juste un secret qu’ils n’arrivent pas à comprendre. Pourquoi ont-ils l’impression de s’être déjà rencontrés ?"}/>
                                <span className={styles.sep}></span>
                                <LogCard/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.containerCardPreview}>
                        <div className={styles.sortContainer}>
                            <h3>Trier par </h3>
                            <div>
                                {
                                    filter.list.map((item) => {
                                        return (
                                            <button
                                                onClick={() => setFilter({...filter, active: item})}
                                                className={filter.active === item && styles.activeBtn}
                                                key={item}>{item}</button>

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
                                        category={"Comédie"}
                                        author={"Jimmy MC"}
                                        nbChapter={26}
                                        img={"/assets/234083.jpg"}
                        />
                        </div>


                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
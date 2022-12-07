import styles from '../../styles/Pages/User/ByUser.module.scss';

import urlSlug, {revert} from "url-slug";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {getData, getPost, getPostByUser} from "../../services/Post";
import Header from "../../Component/Header";
import CategoryHeader from "../../Component/Category/CategoryHeader";
import {
    ArrowDownIcon,
    ArrowsUpDownIcon,
    ChatBubbleBottomCenterTextIcon, FireIcon,
    StarIcon
} from "@heroicons/react/24/outline";
import CommentaryByUser from "../../Component/Post/Commentary/CommentaryByUser";
import {BookOpenIcon} from "@heroicons/react/24/solid";
import MainSearchBar from "../../Component/MainSearchBar";
import FeaturedCategoryPostList from "../../Component/Post/FeaturedCategoryPostList";
import PreviewPost from "../../Component/Post/PreviewPost";
import Instagram from "../../Component/layouts/Icons/Social/instagram";
import Facebook from "../../Component/layouts/Icons/Social/facebook";
import Twitter from "../../Component/layouts/Icons/Social/twitter";

const ByUser = (props) => {

    const [dataAuthor, setDataAuthor] = useState();
    const router = useRouter();
    const [slug,setSlug] = useState(router.query.id);
    const [author,setAuthor] = useState(slug);
    const [post, setPost] = useState([]);
    const [filter, setFilter] = useState(["Populaire", "Récent", "Par catégorie"]);

    const [sortDown, setSortDown] = useState(false);

    useEffect(() => {
        if(router.isReady){
            getPostByUser(router.query.id)
                .then((res) => setDataAuthor(res))
                .then(() => getData())
                .then((res) => setPost(res.slice(0, 4)))
                .then(() => console.log(dataAuthor))
                .catch((err) => console.log(err))
        }
    }, [router.isReady]);

    return (
        <div className={styles.container}>
            <Header/>

            <div className={styles.containerF}>

                <div className={styles.imgContainer}>
                    <div className={styles.img}>
                        <img src={dataAuthor?.img}/>
                    </div>

                    <div className={styles.profil}>
                        <Instagram/>
                        <Facebook/>
                        <Twitter/>
                    </div>

                    <div className={styles.listCommentary}>
                        <form className={styles.form}>
                            <input type={"text"} placeholder={"Laissez votre avis sur "+ dataAuthor?.name + "..."}/>
                        </form>

                        <div className={styles.contentListCommentary}>
<CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon mais pas comme j'imaginais blablabla"}/>
                            <CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon"}/>
                            <CommentaryByUser commentary={"J'aime beaucoup cet auteur qui est très bon"}/>
                        </div>
                    </div>
                </div>


               <div className={styles.chapterContainer}>
                    <div className={styles.infoContainer}>
                        <div>
                            <h3>{dataAuthor?.name}</h3>
                            <p>Inscrit le : 17/08/2022 </p>
                        </div>

                        <h6> Tendance : <span> {dataAuthor?.tendance}</span></h6>

                        <p className={styles.snippet}> {dataAuthor?.description}</p>
                    </div>

                    <h6 className={styles.topBook}>Tops livres <FireIcon/></h6>

                        <div className={styles.rankingGridContainer}>
                            {
                                post
                                    .sort((a,b)=> b.like - a.like)
                                    .map((item,index)=>{
                                        return  (
                                            <FeaturedCategoryPostList
                                                key={item}
                                                rank={index+1}
                                                title={item.title}
                                                snippet={item.snippet}
                                                like={item.like}
                                                category={item.category}
                                                author={item.author}
                                                chapterNb={item.nbChapter}
                                                img={item.img}
                                            />
                                        )
                                    })
                            }
                    </div>



                </div>

            </div>

            <div className={styles.containerS}>
                <div className={styles.sortContainer}>
                    <h3>Trier par </h3>
                    <MainSearchBar width={50} height={50}/>
                    <div>
                        {
                            filter.map((item) => {
                                return (
                                    <button key={item}>{item}</button>
                                )
                            })
                        }
                    </div>
                </div>

                <div className={styles.card}>

                    <PreviewPost title={"Meurtre à KoalaLand"}
                                 snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                     "\n"}
                                 like={332}
                                 category={"Action"}
                                 author={"Jimmy MC"}
                                 nbChapter={26}
                                 img={"/assets/livre1.jpg"}
                    /> <PreviewPost title={"Meurtre à KoalaLand"}
                                    snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                        "\n"}
                                    like={332}
                                    category={"Horreur"}
                                    author={"Jimmy MC"}
                                    nbChapter={26}
                                    img={"/assets/livre2.jpg"}
                /> <PreviewPost title={"Meurtre à KoalaLand"}
                                snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                    "\n"}
                                like={332}
                                category={"Drama"}
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
                                 img={"/assets/livre3.jpg"}
                    /> <PreviewPost title={"Meurtre à KoalaLand"}
                                    snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                        "\n"}
                                    like={332}
                                    category={"SF"}
                                    author={"Jimmy MC"}
                                    nbChapter={26}
                                    img={"/assets/livre4.jpg"}
                /> <PreviewPost title={"Meurtre à KoalaLand"}
                                snippet={"La princesse Lewellyn avait tout pour elle. Jusqu'au jour où sa mère s'est fait exécuter pour avoir tenté de maudire le prince héritier. Depuis, elle vit ses jours délaissée par les siens et harcelée par la reine douairière. Elle ne rêve plus que de pouvoir entrer à l'abbaye pour s'échapper du palais et vivre une vie chaste. Mais le dieu démon Asmodeus lui a infligé la malédiction de la luxure, la faisant plonger dans le désir. Parviendra-t-elle à cacher ses ébats de princesse lubrique et à se rappeler de l'homme qui a pris sa virginité ?\n" +
                                    "\n"}
                                like={332}
                                category={"SF"}
                                author={"Jimmy MC"}
                                nbChapter={26}
                                img={"/assets/livre6.jpg"}
                />
                </div>
            </div>



        </div>
    )
}

export default ByUser;


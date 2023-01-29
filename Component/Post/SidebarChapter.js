import styles from "../../styles/Component/Post/SidebarChapter.module.scss";
import {useEffect, useState} from "react";
import { QueueListIcon} from "@heroicons/react/24/outline";
import { BookOpenIcon, HeartIcon} from "@heroicons/react/24/solid";


const SidebarChapter = ({chapters, title}) => {

    const [menuCollapse, setMenuCollapse] = useState(false);
    const [typeFilter, setTypeFilter] = useState([
        "Populaire(s)",
        "Récent(s)",
        "Ancien(s)",
    ]);
    const [selectFilter, setSelectFilter] = useState("Récent(s)");
    const [descriptionPost, setDescriptionPost] = useState("Orpheline vivant dans un monastère, Elisha De Lauer était satisfaite et heureuse. C’était le cas jusqu’à ce que les Cartier, connus pour leurs pouvoirs magiques, vinrent la chercher. Cette famille sournoise imposa alors à Elisha un contrat d’esclavage dans l’espoir d’hériter de ses nombreux biens. Après des années de servitude, Elisha connut une fin macabre aux mains de ses bourreaux. Cela aurait pu être la fin de son histoire, mais lorsqu’elle ferma les yeux une dernière fois, la jeune femme se réveilla, projetée dans son propre passé, comme si rien de tout cela ne s’était jamais produit. Depuis cette seconde chance accordée, Elisha jure de se venger des Cartier et trouve le complice idéal en la personne du manipulateur réputé, Lucerne Des Kayas. Ce dernier, un paria de la maison Cartier, s’est également promis de se venger de cette famille. Mais sa méfiance constante envers tout le monde l’incite à conclure un contrat avec Elisha à une seule condition. Elle doit accepter de l’épouser. Engagés dans un faux mariage, ces deux-là s’allient pour découvrir les secrets de la famille Cartier et faire tomber chacun de ses membres. Il y a juste un secret qu’ils n’arrivent pas à comprendre. Pourquoi ont-ils l’impression de s’être déjà rencontrés ?")
    const [sizeCommentary, setSizeCommentary] = useState(descriptionPost?.length);
    const [tooLong, setTooLong] = useState(false);


    useEffect(() => {
        if (sizeCommentary > 200) {
            setTooLong(true);
        }
        console.log(chapters[0])
    }, [])

    return (
        <div className={styles.container}>

            <div className={styles.headerComment}>
                <p><QueueListIcon/>{title}</p>
                <p onClick={() => router.push('/auteur/'+ 'Judy McLaren')}><span>Judy McLaren</span></p>
            </div>

            <div className={styles.titleSection}>
                <h5>{title}</h5>
                <div>
                    {typeFilter.map((item) => <p onClick={() => setSelectFilter(item)}
                                                 className={selectFilter === item ? styles.filterActive : ""}>{item}</p>)}
                </div>
            </div>
{/*
            <div className={styles.banner}>
                <img src={"/assets/livre2.jpg"} alt={"Image de l'oeuvre"}/>
                <div className={styles.containerDescription}>
                    <p className={tooLong ? styles.cut : " "}>{descriptionPost}</p>
                    {
                        tooLong &&
                        <p
                            onClick={() => {
                                setTooLong(!tooLong)
                            }
                            }
                            className={styles.seeMore}>Voir plus</p>
                    }

                    {
                        sizeCommentary > 200 && tooLong === false &&
                        <p
                            onClick={() => setTooLong(true)}
                            className={styles.seeMore}>Voir moins</p>
                    }
                </div>



            </div>
*/}
            <div className={styles.chapterList}>
                <div className={!tooLong ? styles.dNone :styles.statsChapter}>
                    <p className={styles.nbChapter}>
                        {chapters.length} <BookOpenIcon/>
                    </p>
                    <p className={styles.nbLikes}>
                        238<HeartIcon/>
                    </p>
                </div>
                {
                    chapters.map((item,index) => {
                        return (
                            <div className={styles.item}>
                                <div className={styles.titleChapter}>
                                    <p className={styles.title}>Chapitre {index + 1} - {item.title}</p>
                                    <p className={styles.date}>{item.date_creation}</p>
                                </div>

                                <p className={styles.likes}> {item.likes} <HeartIcon/></p>
                            </div>
                        )
                    })
                }


            </div>

        </div>
    )
}

export default SidebarChapter;
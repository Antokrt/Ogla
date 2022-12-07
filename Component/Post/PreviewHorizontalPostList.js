import styles from "../../styles/Component/Post/PreviewHorizontalPostList.module.scss"
import {useState} from "react";
import PreviewHorizontalPost from "./PreviewHorizontalPost";
import {CheckIcon, ChevronDoubleRightIcon, ChevronRightIcon} from "@heroicons/react/24/outline";

const PreviewHorizontalPostList = ({title,type}) => {
    const [list, setList] = useState([
        {
            title: "Pouliche liche moi la babine",
            author: "Ursula Poulak",
            like: 237,
            category: "Drama",
            nbChapter: 679,
            src: "/assets/livre2.jpg"
        },
        {
            title: "C'est normal en Russie",
            author: "Cindy la beauf",
            like: 2137,
            category: "Comédie",
            nbChapter: 69,
            src: "/assets/livre1.jpg"
        },
        {
            title: "Manges le mulet",
            author: "Le violoneux Daniel",
            like: 332,
            category: "Action",
            nbChapter: 12,
            src: "/assets/livre3.jpg"
        }
    ])
    return (
        <div className={styles.container}>
            <h5 className={styles.title}>{title} <ChevronDoubleRightIcon/></h5>
            {
                list.map((item, index) => {
                    return(
                        <PreviewHorizontalPost src={item.src} rank={index + 1} nbChapter={item.nbChapter} title={item.title}
                                               category={item.category} author={item.author} nbLikes={item.like}/>
                        )

                })
            }
        </div>
    )

}

export default PreviewHorizontalPostList
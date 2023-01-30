import styles from "../../styles/Component/Post/SidebarCommentary.module.scss";
import scroll from "../../styles/utils/scrollbar.module.scss";
import {useEffect, useState} from "react";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";
import {BookOpenIcon, QueueListIcon} from "@heroicons/react/24/outline";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid"
import Commentary from "./Commentary/Commentary";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {DeleteCommentaryService, GetCommentService, NewCommentaryService} from "../../service/Comment/CommentService";


const SidebarCommentary = ({title,author,comments, bookId,type, refresh, limit, page, createNewComment, deleteAComment}) => {
    const router = useRouter();
    const [typeFilter,setTypeFilter] = useState([
        "Populaire(s)",
        "Récent(s)",
        "Ancien(s)",
    ]);
    const [commentList, setCommentList] = useState(comments);
    const [selectFilter, setSelectFilter] = useState("Récent(s)");
    const [newComment,setNewComment] = useState('');
    const {data:session} = useSession();

    const sendNewComment = () => {
        NewCommentaryService(bookId,newComment,type)
            .then((res) => {
                createNewComment(res)
                setNewComment('');
            })
            .catch((err) => console.log(err));
    }

    const deleteComment = (id) => {
        DeleteCommentaryService(id)
            .then(() => deleteAComment(id))
            .catch((err) => console.log(err));
    }


    useEffect(() => {
       setCommentList(comments)
    },[comments])

    return(
<div className={styles.container}>
    <div className={styles.headerComment}>
        <p><QueueListIcon/>{title}</p>
        <p onClick={() => router.push("/auteur/" + "Judy McLaren")}><span>{author}</span></p>
    </div>
    <div className={styles.titleSection}>
        <h5>Commentaire(s) <span>({comments?.length})</span></h5>
        <h5>Page: <span>{page}</span> Limit: <span>{limit} </span></h5>

        <div>
    {typeFilter.map((item)=> <p onClick={() => setSelectFilter(item)} className={selectFilter === item ? styles.filterActive : ""}>{item}</p>)}
        </div>
    </div>

    <div className={styles.contentCommentaryContainer + " " + scroll.scrollbar}>
        {
            commentList.map((item,index) => {
                return (
                    <Commentary
                        id={item._id}
                        deleteComment={() => deleteComment(item._id)}
                        authorId={item.userId}
                    content={item.content}
                    likes={item.likes}
                    img={item.img}
                    date={item.date_creation}
                    pseudo={item.pseudo}
                    answers={21}
                    />
                )
            })
        }
    </div>



    <div className={styles.commentaryContainer}>
        <button
        onClick={() => {
            refresh();
        }}
        >Voir plus ({limit})</button>
        <div className={styles.formContainer}>
            {
                session ?
                    <textarea
                        value={newComment}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey && newComment !== ""){
                                e.preventDefault();
                                sendNewComment();
                            }
                        }}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={scroll.scrollbar} type="textarea" placeholder="Ecrire un commentaire..."/>
                    :
                    <textarea
                    className={scroll.scrollbar}
                    type={"textarea"}
                    placeholder={"Connexion requise..."}
                    disabled={true}
                    />
            }
        </div>

        <div
            onClick={() => {
                if(newComment !== ""){
                    sendNewComment();
                }
            }}
            className={newComment !== "" ? styles.active +" "+ styles.sendContainer : styles.sendContainer}><PaperAirplaneIcon/>
        </div>
    </div>
</div>
    )
}

export default SidebarCommentary;
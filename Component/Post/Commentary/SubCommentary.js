import styles from "../../../styles/Component/Post/Commentary/SubCommentary.module.scss";
import anim from "../../../styles/utils/anim.module.scss";
import {HeartIcon} from "@heroicons/react/24/solid";
import {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import {EllipsisHorizontalIcon, FlagIcon, TrashIcon} from "@heroicons/react/24/outline";
import {LikeBtn, TextLikeBtn} from "../../layouts/Btn/Like";
import {FormatDateFrom} from "../../../utils/Date";
import {GetDefaultUserImgWhenError} from "../../../utils/ImageUtils";
import {setActiveModalState} from "../../../store/slices/modalSlice";
import {useDispatch} from "react-redux";
const SubCommentary = ({img, pseudo, date, content, likes,deleteAnswer, reportAnswer, hasLike, likeAnswer, id, authorId, seeMoreAnswers}) => {

    const [sizeCommentary,setSizeCommentary] = useState(content?.length);
    const [openModalChoice, setOpenModalChoice] = useState(false);
    const [tooLong,setTooLong] = useState(false);
    const dispatch = useDispatch();
    const {data:session } = useSession();
    const dotRef = useRef(null);
    const contentDotRef = useRef(null);


    function clickOutside(ref,btnRef, onClickOutside) {
        useEffect(() => {
            /**
             * Invoke Function onClick outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && btnRef.current && !ref.current.contains(event.target) && !btnRef.current.contains(event.target)) {
                    onClickOutside();
                }
            }

            // Bind
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // dispose
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, btnRef,onClickOutside]);
    }

    clickOutside(dotRef, contentDotRef, () => setOpenModalChoice(false));


return (
    <div className={styles.container + ' ' + anim.fadeIn}>
        <div className={styles.containerComment}>
            <div className={styles.imgContainer}>
                <img src={img} referrerPolicy={'no-referrer'} onError={(e) => e.target.src = GetDefaultUserImgWhenError() } alt={"Image Profil Ogla"}/>
            </div>

            <div className={styles.contentCommentContainer}>

{/*                {
                    session && session.user.id === authorId &&
                    <TrashIcon
                        onClick={() => deleteAnswer(id)}
                        className={styles.trash}/>
                }*/}

                <div className={styles.dotContainer}>

                        <EllipsisHorizontalIcon
                            onClick={() => {
                                setOpenModalChoice(!openModalChoice)
                            }}
                            ref={dotRef}
                            className={styles.dot}
                        />

                    {
                        openModalChoice &&
                        <div className={styles.dotContent + ' ' + anim.fadeIn} ref={contentDotRef}>
                            {
                                session && authorId === session?.user?.id &&
                                <button onClick={() => deleteAnswer(id)}> Supprimer <TrashIcon/> </button>
                            }

                            {
                                !session ?
                                    <button onClick={() => dispatch(setActiveModalState(true))}> Signaler <FlagIcon/></button> :
                                        authorId !== session?.user?.id &&
                                    <button onClick={() => reportAnswer()}> Signaler <FlagIcon/></button>
                            }
                        </div>
                    }
                </div>


                <div className={styles.authorDate}>
                    <h8 is={'h8'}>{pseudo}<span>{FormatDateFrom(date)}</span></h8>
                </div>
                <p className={tooLong ? styles.cutCommentary + " " + styles.commentary : styles.commentary}>{content}
                </p>

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

                <div className={styles.likeCommentaryContainer}>
            <TextLikeBtn onLike={() => {
                if(session){
                    likeAnswer();
                }
            }} nb={likes} isLike={hasLike}/>
                </div>

            </div>
        </div>
    </div>
)
}


export default SubCommentary;
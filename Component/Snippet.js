import styles from '../styles/Component/Snippet.module.scss';
import {useState} from "react";

export const Snippet = ({maxSize, line, content}) => {

    const [seeAll, setSeeAll] = useState(content.length < maxSize);

    return (
        <div className={styles.container}>

            {
                seeAll ?
                    <p
                       className={styles.snippet}>
                        {content}
                    </p>
                    :
                    <p style={{
                        WebkitLineClamp:line
                    }} className={styles.hide + ' ' + styles.snippet}>
                        {content}
                    </p>

            }


            {

                content.length > maxSize &&
                <>
                    {
                        !seeAll && content.length ?
                            <span className={styles.btn} onClick={() => setSeeAll(true)}>Voir le résumé complet</span> :
                            <span className={styles.btn} onClick={() => setSeeAll(false)}>Masquer</span>

                    }
                </>
            }

        </div>

    )
}
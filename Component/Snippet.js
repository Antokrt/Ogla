import { useSelector } from 'react-redux';
import styles from '../styles/Component/Snippet.module.scss';
import {useState} from "react";
import { selectTheme } from '../store/slices/themeSlice';

export const Snippet = ({maxSize, line, content}) => {

    const [seeAll, setSeeAll] = useState(content.length < maxSize);
    const theme = useSelector(selectTheme);

    return (
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>

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
                            <span className={styles.btn} tabIndex={0} onClick={() => setSeeAll(true)}>Voir le résumé complet</span> :
                            <span className={styles.btn} tabIndex={0} onClick={() => setSeeAll(false)}>Masquer</span>

                    }
                </>
            }

        </div>
    )
}
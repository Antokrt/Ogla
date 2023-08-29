import styles from '../styles/Pages/404.module.scss'
import {HomeIcon} from "@heroicons/react/24/solid";

 export default function Error({statusCode}) {
    return(
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={'/assets/diapo/book.png'}/>
            </div>
            <img className={styles.img} src={'/assets/diapo/old.png'}/>
            {
                statusCode ?
                    <p>Oups ! Une erreur s&apos;est produite (Err-{statusCode})</p> :
                    <p>Oups ! Une erreur s&apos;est produite (Err-client)</p>
            }
        </div>
    )
}

Error.getInitialProps = ({res,err}) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return  {statusCode}
}
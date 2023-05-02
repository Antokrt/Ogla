import styles from '../../../styles/Component/Card/CardStatsDashboard.module.scss';
import {Bars3CenterLeftIcon, ClockIcon, EyeIcon, HeartIcon} from "@heroicons/react/24/solid";

export const CardStatsDashboard = ({title,svg,value,type}) => {

    const checkImg = () => {
        switch (type) {
            case 'view':
                return (
                    <img src={'/assets/stats/bar.png'}/>
                );

            case 'comments':
                return (
                    <img src={'/assets/stats/comments.png'}/>
                );

            case 'likes':
                return (
                    <img src={'/assets/diapo/book.png'}/>
                );

            default:
                return (
                    <img src={'/assets/diapo/book.png'}/>
                )
        }
    }

    return (
        <div className={styles.container}>

            {checkImg()}
            <p className={styles.title}>{title} </p>
            <p className={svg === 'clock' ? styles.date : styles.value}> {value}</p>

        </div>
    )
}
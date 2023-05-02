import styles from '../../styles/Component/Dashboard/ErrorDashboard.module.scss';
import {CursorArrowRaysIcon} from "@heroicons/react/24/outline";

const ErrorDashboard = ({img, title, subTitle, btn, link}) => {
return (
    <div className={styles.container}>
        <img src={img}/>
        <h5>{title}</h5>
        <p>{subTitle}</p>
        <button onClick={link}>{btn} <CursorArrowRaysIcon/></button>
    </div>
)
}
export default ErrorDashboard;
import { useSelector } from 'react-redux';
import styles from '../../styles/Component/Dashboard/SmHeader.module.scss';
import { selectTheme } from '../../store/slices/themeSlice';

const HeaderDashboard = ({title,nb}) => {

    const theme = useSelector(selectTheme);

    return(
        <div className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <div className={styles.sBlock}>
                <h6>Tous mes <span className={styles.book}>livres</span> {nb && <span className={styles.nb}>{nb}</span>}</h6>
            </div>
        </div>
    )
}
export default HeaderDashboard;
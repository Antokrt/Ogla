import { useSelector } from 'react-redux';
import styles from '../../../styles/Component/Backup.module.scss';
import { ArrowUturnUpIcon } from "@heroicons/react/24/outline";
import { selectTheme } from '../../../store/slices/themeSlice';

export const BackUp = ({ click }) => {

    const theme = useSelector(selectTheme)

    return (
        <div onClick={click} className={theme ? styles.container : styles.container + ' ' + styles.dark}>
            <ArrowUturnUpIcon />
        </div>
    )
}
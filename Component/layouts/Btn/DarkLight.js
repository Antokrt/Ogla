import { useSelector } from "react-redux";
import styles from "../../../styles/Layouts/Btn/DarkLight.module.scss"
import {selectTheme} from "../../../store/slices/themeSlice";

export const DarkLight = () => {

    const theme = useSelector(selectTheme);

    return (
        <div className={styles.container}>
            <input type="checkbox" checked={!theme}/>
            <label>
                <svg className={styles.moon} viewBox="0 0 32 32" version="1.1">
                    <path d="M9.882 5.052c-0.847 1.717-1.295 3.614-1.295 5.564 0 6.977 5.676 12.653 12.653 12.653 2.052 0 4.035-0.489 5.812-1.412-2.15 3.869-6.248 6.37-10.862 6.37-6.866 0-12.451-5.585-12.451-12.451 0-4.491 2.409-8.533 6.143-10.724zM12.79 2.707c-5.817 1.509-10.118 6.78-10.118 13.069 0 7.465 6.053 13.517 13.518 13.517 6.387 0 11.726-4.435 13.139-10.389-2.087 2.039-4.939 3.298-8.088 3.298-6.399 0-11.587-5.188-11.587-11.587 0-3.061 1.196-5.838 3.137-7.909v0z">
                    </path>
                </svg>
            </label>
        </div>
    )
}
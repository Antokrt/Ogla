import styles from '../styles/Component/Loader.module.scss';
import {Loader2, LoaderCommentary} from "./layouts/Loader";

export const Loader = () => {
  return (
      <div className={styles.container}>
          <div className={styles.main}>
              <div className={styles.s}>
                  <LoaderCommentary/>
              </div>
          </div>
      </div>
  )
};
import styles from '../../styles/Pages/Cgu.module.scss';
import anim from '../../styles/utils/anim.module.scss';
import Header from "../../Component/Header";
import {BackUp} from "../../Component/layouts/Btn/BackUp";
import React, {useRef} from "react";
import Footer from "../../Component/Footer";
import {HeaderMain} from "../../Component/HeaderMain";
import {HeaderMainResponsive} from "../../Component/HeaderMainResponsive";
import ScreenSize from "../../utils/Size";

const Cgu = () => {
    const divRef = useRef(null);
    const [width, height] = ScreenSize();


    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }


    return (
        <div className={styles.container} ref={divRef}>
            {
                width > 950 ?
                    <HeaderMain/> :
                    <div style={{width: '100%'}}>
                        <HeaderMainResponsive/>
                    </div>
            }
            <div className={styles.titleContainer + ' ' + anim.fadeIn}>
                <h1>Conditions générales d&apos;utilisation</h1>
                <p>Mis à jour le 09/06/23</p>
            </div>
            <div className={styles.containerMain + ' ' + anim.fadeIn}>
                <div className={styles.goToTop}>
                    <BackUp click={() => scrollToTop()}/>
                </div>

                <div className={styles.listContainer}>
                    <h3>This privacy Policy will help you better understand how we collect, use and share your personal
                        information.</h3>
                    <div className={styles.item} href={'cookies'}>
                        <h4>1. <span>Cookies</span></h4>
                        <p>This privacy Policy will help you better understand how we collect, use and share your
                            personal information.This privacy Policy will help you better understand how we collect, use
                            and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will
                            help you better understand how we collect, use and share your personal information.This
                            privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and
                            share your personal information.This privacy Policy will help you better understand how we
                            collect, use and share your personal information.</p>
                    </div>
                    <div className={styles.item} id={'mentions-legales'}>
                        <h4>2. <span>Mentions légales</span></h4>
                        <p>This privacy Policy will help you better understand how we collect, use and share your
                            personal information.This privacy Policy will help you better understand how we collect, use
                            and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will
                            help you better understand how we collect, use and share your personal information.This
                            privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and
                            share your personal information.This privacy Policy will help you better understand how we
                            collect, use and share your personal information.</p>
                    </div>

                    <div className={styles.item} id={'conf'}>
                        <h4>3. <span>Politique de confidentialité</span></h4>
                        <p>This privacy Policy will help you better understand how we collect, use and share your
                            personal information.This privacy Policy will help you better understand how we collect, use
                            and share your personal information.This privacy Policy will help you better understand how
                            we collect, use and share your personal information.This privacy Policy will help you better
                            understand how we collect, use and share your personal information.This privacy Policy will
                            help you better understand how we collect, use and share your personal information.This
                            privacy Policy will help you better understand how we collect, use and share your personal
                            information.This privacy Policy will help you better understand how we collect, use and
                            share your personal information.This privacy Policy will help you better understand how we
                            collect, use and share your personal information.</p>
                    </div>
                </div>
                <div className={styles.menuContainer}>
                    <h2>Plan</h2>
                    <div className={styles.listMenu}>
                        <a href={'#cookies'}>1. <span>Cookies</span></a>
                        <a href={'#mentions-legales'}>2. <span>Mentions légales</span></a>
                        <a href={'#conf'}>3. <span>Politique de confidentialité</span></a>
                        <a>4. <span>Politique de confidentialité</span></a>
                        <a>5. <span>Mentions légales</span></a>
                        <a>6. <span>Mentions légales</span></a>
                        <a>7. <span>Mentions légales</span></a>
                        <a>8. <span>Mentions légales</span></a>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default Cgu;
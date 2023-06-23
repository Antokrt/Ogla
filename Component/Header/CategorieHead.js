import { useEffect } from "react";
import styles from "../../styles/Component/Header.module.scss";
import { useRouter } from "next/router";


const CategorieHead = ({ cat }) => {

    const router = useRouter()

    const checksvg = () => {
        if (cat === "Action") {
            return (
                <div className={styles.one}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17.4563 3L20.9991 3.00335L21.001 6.52648L15.5341 11.992L18.3624 14.8207L19.7772 13.4071L21.1915 14.8213L18.7166 17.2962L21.545 20.1246L20.1308 21.5388L17.3024 18.7104L14.8275 21.1853L13.4133 19.7711L14.8269 18.3562L11.9981 15.528L9.1703 18.3558L10.5849 19.7711L9.17064 21.1853L6.69614 18.71L3.86734 21.5388L2.45312 20.1246L5.28192 17.2958L2.80668 14.8213L4.22089 13.4071L5.63477 14.8202L8.46212 11.992L3.00181 6.53118L2.99907 3L6.54506 3.00335L11.9981 8.457L17.4563 3ZM9.87612 13.406L7.04807 16.234L7.75607 16.941L10.5831 14.113L9.87612 13.406ZM19.0001 5.001H18.2831L13.4121 9.87L14.1191 10.577L19.0001 5.698V5.001ZM5.00007 5.001V5.701L16.2411 16.942L16.9482 16.2349L5.71507 5.002L5.00007 5.001Z"></path>
                    </svg>
                </div>
            )
        }
        if (cat === "Fantaisie") {
            return (
                <div className={styles.two}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.1986 9.94435C14.7649 9.53358 14.4859 8.98601 14.4085 8.39371L14.0056 5.31126L11.275 6.79711C10.7503 7.08262 10.1433 7.17876 9.55608 7.06936L6.49998 6.50003L7.06931 9.55612C7.17871 10.1434 7.08257 10.7503 6.79707 11.275L5.31121 14.0056L8.39367 14.4085C8.98596 14.4859 9.53353 14.7649 9.94431 15.1986L12.0821 17.4555L13.4178 14.6485C13.6745 14.1091 14.109 13.6745 14.6484 13.4179L17.4555 12.0821L15.1986 9.94435ZM15.2238 15.5078L13.0111 20.1579C12.8687 20.4572 12.5107 20.5843 12.2115 20.4419C12.1448 20.4102 12.0845 20.3664 12.0337 20.3127L8.49229 16.574C8.39749 16.4739 8.27113 16.4095 8.13445 16.3917L3.02816 15.7242C2.69958 15.6812 2.46804 15.3801 2.51099 15.0515C2.52056 14.9782 2.54359 14.9074 2.5789 14.8425L5.04031 10.3191C5.1062 10.198 5.12839 10.0579 5.10314 9.92241L4.16 4.85979C4.09931 4.53402 4.3142 4.22074 4.63997 4.16005C4.7126 4.14652 4.78711 4.14652 4.85974 4.16005L9.92237 5.10319C10.0579 5.12843 10.198 5.10625 10.319 5.04036L14.8424 2.57895C15.1335 2.42056 15.4979 2.52812 15.6562 2.81919C15.6916 2.88409 15.7146 2.95495 15.7241 3.02821L16.3916 8.13449C16.4095 8.27118 16.4739 8.39754 16.5739 8.49233L20.3127 12.0337C20.5533 12.2616 20.5636 12.6414 20.3357 12.8819C20.2849 12.9356 20.2246 12.9794 20.1579 13.0111L15.5078 15.2238C15.3833 15.2831 15.283 15.3833 15.2238 15.5078ZM16.0206 17.4349L17.4348 16.0207L21.6775 20.2633L20.2633 21.6775L16.0206 17.4349Z"></path></svg>
                </div>
            )
        }
        if (cat === "Horreur") {
            return (
                <div className={styles.one}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2C15.5 2 18 5 19 8C22 9 23 11.73 23 14L20.2253 14.7928C19.796 14.9154 19.5 15.3078 19.5 15.7543V17.25C19.5 18.2165 18.7165 19 17.75 19H17.1536C16.4825 19 15.8562 19.3366 15.4858 19.8962C14.5576 21.2987 13.3957 22 12 22C10.6043 22 9.44238 21.2987 8.5142 19.8962C8.14383 19.3366 7.51746 19 6.84636 19H6.25C5.2835 19 4.5 18.2165 4.5 17.25V15.7543C4.5 15.3078 4.20402 14.9154 3.77472 14.7928L1 14C1 11.7337 2 9 5 8C6 5 8.5 2 12 2ZM12 4C9.8906 4 7.93534 5.78788 6.98864 8.37148L6.89737 8.63246L6.58114 9.58114L5.63246 9.89737C4.37721 10.3158 3.56485 11.238 3.20834 12.4564L3.185 12.543L4.32416 12.8697C5.55353 13.221 6.41845 14.3095 6.49454 15.5727L6.5 15.7543V17H6.84636C8.1096 17 9.29359 17.5963 10.0461 18.5996L10.182 18.7925C10.7584 19.6634 11.3162 20 12 20C12.6382 20 13.1667 19.7068 13.7029 18.9596L13.818 18.7925C14.5151 17.739 15.6658 17.0807 16.9178 17.0069L17.1536 17H17.5V15.7543C17.5 14.4757 18.309 13.3451 19.5027 12.9249L19.6758 12.8697L20.815 12.543L20.7918 12.4555C20.4554 11.3047 19.7124 10.4193 18.5728 9.97176L18.3675 9.89737L17.4189 9.58114L17.1026 8.63246C16.1948 5.90906 14.1797 4 12 4ZM12 12C12.8284 12 13.5 13.1193 13.5 14.5C13.5 15.8807 12.8284 17 12 17C11.1716 17 10.5 15.8807 10.5 14.5C10.5 13.1193 11.1716 12 12 12ZM9.5 8C10.3284 8 11 8.67157 11 9.5C11 10.3284 10.3284 11 9.5 11C8.67157 11 8 10.3284 8 9.5C8 8.67157 8.67157 8 9.5 8ZM14.5 8C15.3284 8 16 8.67157 16 9.5C16 10.3284 15.3284 11 14.5 11C13.6716 11 13 10.3284 13 9.5C13 8.67157 13.6716 8 14.5 8Z"></path>
                    </svg>
                </div>
            )
        }
        if (cat === "Humour") {
            return (
                <div className={styles.two}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 11C14 11 15.6667 11.3333 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C8.33333 11.3333 10 11 12 11ZM8.5 7C9.70968 7 10.7187 7.85917 10.9501 9.00057H6.04989C6.28131 7.85917 7.29032 7 8.5 7ZM15.5 7C16.7097 7 17.7187 7.85917 17.9501 9.00057H13.0499C13.2813 7.85917 14.2903 7 15.5 7Z"></path>
                    </svg>
                </div>
            )
        }
        if (cat === "Romance") {
            return (
                <div className={styles.one}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19.2426 4.75736C20.705 6.2228 21.2547 8.25005 20.8924 10.1368C21.4614 10.2972 21.9987 10.6002 22.4471 11.0453C23.851 12.439 23.851 14.6987 22.4471 16.0924L17 21.5L13.978 18.5L10.9999 21.485L2.52138 12.993C0.417048 10.637 0.495706 7.01901 2.75736 4.75736C5.02157 2.49315 8.64519 2.41687 11.001 4.52853C13.35 2.42 16.98 2.49 19.2426 4.75736ZM12.962 12.4646C12.346 13.0761 12.346 14.0615 12.962 14.673L17 18.6818L21.038 14.673C21.654 14.0615 21.654 13.0761 21.038 12.4646C20.414 11.8451 19.3962 11.8451 18.77 12.4668L16.9979 14.2206L15.591 12.825L15.2278 12.4646C14.6038 11.8451 13.586 11.8451 12.962 12.4646ZM4.17157 6.17157C2.68183 7.66131 2.60704 10.0473 3.97993 11.6232L10.9999 18.6543L12.559 17.092L11.5529 16.0924C10.149 14.6987 10.149 12.439 11.5529 11.0453C12.9568 9.65157 15.233 9.65157 16.6369 11.0453L16.9996 11.4051L17.3631 11.0453C17.7877 10.6238 18.2921 10.3297 18.828 10.1632C19.2436 8.79577 18.9058 7.25122 17.827 6.1701C16.3279 4.66794 13.9076 4.60701 12.337 6.01687L11.0019 7.21524L9.66605 6.01781C8.09098 4.60597 5.67506 4.66808 4.17157 6.17157Z"></path>
                    </svg>
                </div>
            )
        }
        if (cat === "Science-Fiction") {
            return (
                <div className={styles.two}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2C16.6944 2 20.5 5.80558 20.5 10.5C20.5 17 15 22.5 12 22.5C9 22.5 3.5 17 3.5 10.5C3.5 5.80558 7.30558 2 12 2ZM12 4C8.41015 4 5.5 6.91015 5.5 10.5C5.5 15.2938 9.665 20.5 12 20.5C14.335 20.5 18.5 15.2938 18.5 10.5C18.5 6.91015 15.5899 4 12 4ZM17.5 11C17.6603 11 17.8186 11.0084 17.9746 11.0247C17.9916 11.1812 18 11.3396 18 11.5C18 13.9853 15.9853 16 13.5 16C13.3396 16 13.1812 15.9916 13.0252 15.9752C13.0084 15.8186 13 15.6603 13 15.5C13 13.0147 15.0147 11 17.5 11ZM6.5 11C8.98528 11 11 13.0147 11 15.5C11 15.6603 10.9916 15.8186 10.9753 15.9746C10.8186 15.9916 10.6603 16 10.5 16C8.01472 16 6 13.9853 6 11.5C6 11.3396 6.00839 11.1812 6.02475 11.0252C6.18121 11.0084 6.33963 11 6.5 11Z"></path>
                    </svg>
                </div>
            )
        }
        if (cat === "Autre") {
            return (
                <div className={styles.one}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M3 18.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H6.5C4.567 22 3 20.433 3 18.5ZM19 20V17H6.5C5.67157 17 5 17.6716 5 18.5C5 19.3284 5.67157 20 6.5 20H19ZM5 15.3368C5.45463 15.1208 5.9632 15 6.5 15H19V4H6C5.44772 4 5 4.44772 5 5V15.3368Z"></path>
                    </svg>
                </div>
            )
        }
    }

    return (
        <div className={styles.CategorieHead} onClick={() => router.push('/bibliotheque/' + cat.toLowerCase())}>
            {
                checksvg()
            }
            <p> {cat} </p>
        </div>
    )

}

export default CategorieHead;

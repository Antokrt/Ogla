import styles from "../styles/Component/Searchbar.module.scss";
import {useState} from "react";
import {router} from "next/router";

export default function MainSearchBar({change,submit,width,height}) {

    const [value,setValue] = useState("");

    const handleChange = (e) => {
        setValue(e)
    }

    return (
        <div style={{
            width: width + "%",
            height: height + "px"
        }}>
            <form className={styles.container} onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
                setValue("");
                if(value.length !== 0 && value !== "undefined") {
                    router.push({
                        pathname: "/rechercher",
                        query: {search: value}
                    })
                    submit();
                    e.target.reset();
                    setValue("");
                    console.log("ok");
                    console.log(value.length)
                }
                else{
                }
            }}>
                <input  onChange={(e) => {
                    setValue(e.target.value)
                    change(e);

                }} type="text" name={"searchbar"} placeholder="Cherchez un livre"/>
            </form>
        </div>


    )
}


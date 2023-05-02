// import HeaderResponsive from "../../Component/HeaderResponsive";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../Component/Header";
import DarkLight from "../../Component/layouts/Btn/DarkLight";
import { selectTheme } from "../../store/slices/themeSlice";

// const Test = () => {
//     const recaptchaRef = useRef(null);
//     const [key, setKey] = useState("6LekmrQlAAAAAInkIl_bAudW6DcRhazdxF8WCHKx")

//     useEffect(() => {
//         const script = document.createElement('script')
//         script.src = 'https://www.google.com/recaptcha/api.js'
//         script.async = true
//         document.body.appendChild(script)
//     }, [])

//     const Change = async (token) => {
//         // const captchaToken = await recaptchaRef.current.executeAsync();
//         console.log(token);
//         // captchaToken.current.reset();
//     }

//     return (
//         <div>

//             <ReCAPTCHA
//                 ref={recaptchaRef}
//                 sitekey={key}
//                 onChange={Change} />
//         </div>
//     )
// }

const testToast = () => {

    const light = useSelector(selectTheme);

    return (
        <div>
            <Header />
            {
                light &&
                <div style={{width: "100%", backgroundColor:"grey"}}>
                    coucou
                </div>
            }
            {
                !light &&
                <div style={{width: "100%", backgroundColor:"black", color:"white"}}>
                    coucou black
                </div>
            }
            {/* <DarkLight /> */}
            {/* <Test /> */}
        </div>
    )
}
export default testToast


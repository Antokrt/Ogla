// import HeaderResponsive from "../../Component/HeaderResponsive";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../Component/Header";
import DarkLight from "../../Component/layouts/Btn/DarkLight";
import { selectTheme } from "../../store/slices/themeSlice";
import HeaderResponsive from "../../Component/HeaderResponsive";

const testToast = () => {

    const light = useSelector(selectTheme);

    return (
        <div>
            <HeaderResponsive />
        </div>
    )
}
export default testToast


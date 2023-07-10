import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";

const TestToast = () => {

    const test = useSelector(selectTheme);
    return (
        <h1>
            Welcome to <a href="https://nextjs.org%22%3Enext.js%21/"></a>
        </h1>
    )
}
export default TestToast

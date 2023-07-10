import { useSelector } from "react-redux";
import { selectTheme } from "../../store/slices/themeSlice";
import {useSession} from "next-auth/react";

const TestToast = () => {

    const light = useSelector(selectTheme);
    const {data: session} = useSession();
    function test() {
      console.log(Math.abs(1.547, 5000));
    }


    return (
        <h1 onClick={test}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
    )
}
export default TestToast


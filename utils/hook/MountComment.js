import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {mountComment} from "../../store/slices/commentSlice";


function useMountComment(activeId,title,author,type,nbComments) {
    const dispatch = useDispatch();

    useEffect(() => {
        const payload = {activeId, title, author, type, nbComments};
        dispatch(mountComment(payload));
    }, [dispatch]);
}

export default useMountComment;
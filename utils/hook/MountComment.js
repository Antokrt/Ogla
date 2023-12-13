import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {mountComment} from "../../store/slices/commentSlice";


function useMountComment(activeId,title,author,type,nbComments,bookId) {
    const dispatch = useDispatch();

    useEffect(() => {
        const payload = {activeId, title, author, type, nbComments,bookId};
        dispatch(mountComment(payload));
    }, [dispatch]);
}

export default useMountComment;
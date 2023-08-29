import {useDispatch, useSelector} from "react-redux";
import {addCategory, selectCategories} from "../store/slices/categorySlice";
import React, {useEffect} from "react";
import {instance} from "../service/config/Interceptor";

export const GetCategories = () => {
    const categories = useSelector(selectCategories);
    const dispatch = useDispatch();

    useEffect(() => {
        if (categories.length <= 0) {
            instance.get('category')
                .then((res) => {
                    dispatch(addCategory(res.data));
                })
        }
    },[categories])

    return <></>
}

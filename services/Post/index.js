import axios from "axios";
import Post from "../../json/post.json";
import PostByUser from "../../json/author.json";


export const getData = () => {
  return new Promise((resolve,err) => {
    resolve(Post.post)
    err("Erreur GetData");
  })
}

export const getPost = (slug) => {
  return new Promise((resolve, reject)=> {
    const data = Post.post.find(post => post.slug === slug);
    resolve(data);
    reject("Err");
  })
}




export const getPostByUser = (author) => {
  return new Promise((resolve, reject)=>{
    const data = PostByUser.author.find(item => item.name === author);
    resolve(data);
    reject("Err Post By User");
  })
}


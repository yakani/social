import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const Poststore = create((set, get) => ({
  isloadingpost: false,
  isdeletingpost: false,
  isloadingpostuser: false,
  isadding: false,
  postsvisitor: [],
  posts: [],
  postuser: [],
  playingpost: null,
  isloadinalgo: false,
  renderchange:false,
  numb: parseInt(localStorage.getItem("numb")) ? parseInt(localStorage.getItem("numb")) : 0,

  setnumb: (num) => {
    localStorage.setItem("numb", String(num));
    set({ numb: num });
  },
  previousplay: () => {
    const { playingpost, numb, posts } = get();
    for (var i = numb; i >= 0; i++) {
      if (posts[i]._id == playingpost._id) {
        if (i == numb) {
          localStorage.setItem("numb", String(numb - 3));
          set({ numb: numb - 3 });
        }
        set({ playingpost: posts[i - 1] });
        break;
      }
    }
  },

  nexplay: () => {
    const { playingpost, numb, posts } = get();
    for (var i = numb; i < posts.length; i++) {
      if (posts[i]._id == playingpost._id) {
        if (i == numb + 2) {
          localStorage.setItem("numb", String(numb + 3));
          set({ numb: numb + 3 });
        }
        set({ playingpost: posts[i + 1] });
        break;
      }
    }
  },
  createPost: async (data) => {
    set({ isadding: true });
    try {
      const res = await axiosInstance.post("post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ postuser: [...get().postuser, res.data] });
      toast.success("upload");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isadding: false });
    }
  },
  getposts: async () => {
    set({ isloadingpost: true });
    try {
      const res = await axiosInstance.get("post");
      set({ posts: res.data });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isloadingpost: false });
    }
  },
  getpostsuser: async () => {
    set({ isloadingpostuser: true });
    try {
      const res = await axiosInstance.get("post/user");
      set({ postuser: res.data });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isloadingpostuser: false });
    }
  },
  getpostsvisitor: async (data) => {
    set({ isloadingpostuser: true });
    try {
      const res = await axiosInstance.get("post/visitor/" + data);
      set({ postsvisitor: res.data });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isloadingpostuser: false });
    }
  },
  deletepost: async (id) => {
    set({ isdeletingpost: true });

    try {
      const res = await axiosInstance.delete("post/" + id);
      const remove = get().posts.filter((t) => t._id != id);
      const remove1 = get().postuser.filter((t) => t._id != id);
      set({ posts: remove });
      set({ postuser: remove1 });
      toast.success("remove");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isdeletingpost: false });
    }
  },
  setplayingpost: (data) => set({ playingpost: data }),
  getarralgo: async () => {
      const { posts, numb  ,playingpost} = get();
    //if (posts.length < 10 ) return;
     const n  = playingpost ?  posts.findIndex((t)=>t._id == playingpost._id): -1;
    const maxnum = n==-1? 
      numb == 0
        ? 0
        : numb * 3 > posts.length - 10
        ? posts.length < 101
          ? posts.length / 2
          : numb * 2
        : numb * 3 : n+1;
         set({ isloadinalgo: true });

    try {
      const res = await axiosInstance.get(`user/observe?max=${maxnum}`);
      set({ posts: res.data });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isloadinalgo: false });
    }
  },
  addobserve: async (data) => {
    set({renderchange:true});
    try {
      const res = await axiosInstance.post("user/observe", data);
    } catch (error) {
      console.error(error.message);
    }finally{
      set({renderchange:false});
    }
  },
}));

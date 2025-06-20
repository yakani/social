import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Poststore } from "../store/post.store";
import Reactplayer from "react-player";
import Showmessage from "../component/Showmessage";
import { Commentstore } from "../store/comment.store";
import Messageinput from "../component/Messageinput";
import { Bookmark, HeartIcon, MessageCircle, X } from "lucide-react";
import { Userstore } from "../store/user.store";
const Playpage = () => {
  const { playingpost, nexplay, posts, previousplay ,Algo } = Poststore();
  const { observation, addObservation } = Userstore();
  const { comments, listencomment, stoplisten, getcomments, isloadingcomment } =
    Commentstore();
  const { user } = Userstore();
  const [goal, setgoal] = useState(comments);
  const [play, setplay] = useState(playingpost);
  const [heart, setheart] = useState(false);
  const [book, setbook] = useState(false);
  const [list ,setlist] = useState([]);
  const navigate = useNavigate();
  const Go = () => {
    nexplay();
  };
  const Pre = () => {
    previousplay();
  };
  useEffect(() => {
    setplay(playingpost);
    getcomments(playingpost._id);
    setheart(false);
    setbook(false);
    window.scrollTo(0, 100);
  }, [playingpost]);

  useEffect(() => {
    listencomment(playingpost._id);
    return () => stoplisten();
  }, [listencomment, stoplisten]);
  useEffect(() => {
    setgoal(comments);
    setlist(observation.likes);
    Algo();
  }, [comments , observation]);
  return (
    <div
      className="flex justify-center min-h-screen  min-w-screen md:max-h-screen sm:max-w-screen "
      style={{
        backgroundImage: `url(${play.thumbnail})`,
        backgroundSize: "cover",
        backgroundBlendMode: "darken",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        transitionBehavior: "opacity",
        opacity: 0.9,
        transitionDuration: "0.3s",
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <div className="flex flex-col bg-neutral mt-2 rounded-lg p-1 ">
        <div className="rounded-lg m-1 flex justify-center items-center ">
          {play.path ? (
            <Reactplayer
              url={play.path}
              light={play.thumbnail}
              controls={true}
              width={  350 }
            />
          ) : (
            <img
              src={play.thumbnail}
              className="size-90 rounded-lg object-cover"
              style={{
                transitionTimingFunction: "ease-in-out",
                transitionDuration: "0.3s",
                transitionProperty: "opacity",
                opacity: 0.9,
              }}
            />
          )}
        </div>
        <div className="flex justify-center item-center m-2">
          <div className="flex flex-col ">
            <p className="text-2xl font-bold "> {play.title} </p>
            <p className="text-xl  "> {play.prompt} </p>
          </div>
        </div>
        {console.log(list)}

        <div className="flex justify-between mt-4">
          {heart || list.includes(play._id) ? (
            <img className="size-7 object-cover m-2 " src="/heart.png" />
          ) : (
            <HeartIcon
              className="size-7 m-2 text-warning cursor-pointer"
              onClick={() => {
                addObservation({ likes: play._id });
                setheart(true);
              }}
            />
          )}
          <label htmlFor="my_modal_7">
            <MessageCircle className="size-7 m-2 text-warning cursor-pointer" />
          </label>
          {book || observation.saves.includes(play._id) ? (
            <img className="size-7 object-cover m-2" src="/bookmark.png" />
          ) : (
            <Bookmark
              className="size-7 m-2 text-warning cursor-pointer"
              onClick={() => {
                addObservation({ save: play._id });
                setbook(true);
              }}
            />
          )}
          <input type="checkbox" id="my_modal_7" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              {isloadingcomment ? (
                <div className="skeleton h-20 w-20"></div>
              ) : (
                <>
                  <Showmessage comment={goal.length >= 0 ? goal : [goal]} />
                  {goal.length == 0 ? (
                    <p className="text-center">No comments yet</p>
                  ) : (
                    <></>
                  )}
                  <div className=" flex justify-between items-center">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="size-13 rounded-full object-cover border-1 "
                    />
                    <Messageinput id={play._id} />
                  </div>
                </>
              )}
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_7">
              Close
            </label>
          </div>
        </div>
        <div className="flex justify-between rounded-full  max-h-[50px] items-center mt-3 ">
          {posts.length > 1 ? (
            <>
              {" "}
              <button
                className="join-item btn btn-outline btn-warning"
                onClick={Pre}
                disabled={posts[0]._id == playingpost._id}
              >
                Previous
              </button>
              <button
                className="join-item btn btn-outline btn-warning"
                disabled={posts[posts.length - 1]._id == playingpost._id}
                onClick={Go}
              >
                Next
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        className="flex flex-col items-center p-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X className="size-7 hover:text-warning  m-2 " />
      </div>
    </div>
  );
};

export default Playpage;

import React, { useRef, useState } from "react";

import { Post, CommentForm, CommentLoading, PostForm } from ".././components";
import { CommentContainer } from "../containers";
import {
  TPostApiResponse,
  TCommentApiResponse,
  emptyComment,
} from "../types/type";
import { getCommentsByPostID } from "../utility/commentApi";
import { deletePost } from "../utility/postApi";

interface Props {
  post: TPostApiResponse;
  posts: TPostApiResponse[];
  setPosts: React.Dispatch<React.SetStateAction<TPostApiResponse[]>>;
}

const PostContainer: React.FC<Props> = ({ post, posts, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TCommentApiResponse[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const page = useRef(1);

  const fetchComments = (page: number) => {
    setIsFetching(true);

    getCommentsByPostID(post.id, page)
      .then((result: TCommentApiResponse[]) => {
        setComments(result);
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetching(false);
      });
  };

  // GET comments
  const handleGetComments = () => {
    setShowComments(!showComments);

    if (isFetching) return; // guard clause

    fetchComments(page.current);
  };

  // DELETE post
  const handleDeletePost = (postID: number) => {
    return () => {
      deletePost(postID)
        .then(() => {
          setPosts(posts.filter((eachpost) => eachpost.id !== post.id));
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  return (
    <div className="flex flex-col mx-3 w-full items-center">
      {/* Renders post based on editing mode */}
      {isEditing ? (
        <PostForm
          key={post.id}
          thisPost={post}
          posts={posts}
          setPosts={setPosts}
          isEditingPost={true}
          setForumStatus={setIsEditing}
        />
      ) : (
        <Post
          key={post.id}
          post={post}
          showComments={showComments}
          setIsEditing={setIsEditing}
          handleGetComments={handleGetComments}
          handleDeletePost={handleDeletePost}
        />
      )}

      {/* showComment: display loading comment or actual comments */}
      {showComments &&
        (isFetching ? (
          Array(Math.floor(Math.random() * 4 + 1))
            .fill(1)
            .map((_, i) => <CommentLoading key={i} />)
        ) : (
          <div className="flex flex-row w-full flex-wrap content-start items-center justify-center gap-4 my-3 ">
            <CommentForm
              postID={post.id}
              thisComment={emptyComment}
              comments={comments}
              setComments={setComments}
            />
            {comments.map((comment) => (
              <CommentContainer
                key={comment.id}
                comment={comment}
                comments={comments}
                setComments={setComments}
              />
            ))}

            {/* only show the show more comments button  */}
            {comments.length > 0 && (
              <button
                className="rounded-md bg-blue-400 px-5 py-1 text-sm font-bold text-slate-600 shadow-md hover:bg-blue-300"
                onClick={() => {
                  page.current += 1;
                  fetchComments(page.current);
                }}
              >
                Show more comments
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default PostContainer;
import React, { useRef, useState } from "react";

import {
  Post,
  CommentForm,
  CommentLoading,
  PostForm,
  Alert,
} from ".././components";
import { CommentContainer } from "../containers";
import {
  TPostApiResponse,
  TCommentApiResponse,
  emptyComment,
  severityLevel,
} from "../types/type";
import { getCommentsByPostID } from "../utility/commentApi";
import { deletePost } from "../utility/postApi";

interface Props {
  post: TPostApiResponse;
  posts: TPostApiResponse[];
  setPosts: React.Dispatch<React.SetStateAction<TPostApiResponse[]>>;
}

/**
 * Container for a single post, which holds the state of the post.
 * A post is either in edit or view mode. It defaults to view mode.
 * Edit mode is only accessible by creator of the post.
 *
 *  A post container also contains:
 * - a comment form
 * - an array of potentially to-be-fetched comment (containers)
 *
 * Upon fetch, the comments will be rendered beneath the post without the need to go to a separate page, disrupting the viewing experience.
 * Comments are lazy loaded and toggleable.
 */

const PostContainer: React.FC<Props> = ({ post, posts, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TCommentApiResponse[]>([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: -1 });

  const fetchComments = () => {
    setIsFetchingComments(true);

    getCommentsByPostID(post.id)
      .then((result: TCommentApiResponse[]) => {
        setComments([...comments, ...result]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsFetchingComments(false);
      });
  };

  // GET comments
  const handleGetComments = () => {
    setShowComments(!showComments);

    if (isFetchingComments) return; // guard clause
    if (comments.length > 0) return; // no need to refetch

    fetchComments();
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
      {showComments && (
        <>
          <div className="flex flex-row w-full flex-wrap content-start items-center justify-center gap-4 my-3">
            {isFetchingComments ? (
              // comment place holders
              Array(Math.floor(Math.random() * 4 + 1))
                .fill(1)
                .map((_, i) => <CommentLoading key={i} />)
            ) : (
              <>
                {/* displays error */}
                {alert.message && (
                  <Alert message={alert.message} severity={alert.severity} />
                )}

                {/* displays prompt to post */}
                {comments.length === 0 && (
                  <Alert
                    message={"No comments here.\nBe the first to comment!"}
                    severity={severityLevel.low}
                  />
                )}

                {/* Comment submission form */}
                <CommentForm
                  postID={post.id}
                  thisComment={emptyComment}
                  comments={comments}
                  setComments={setComments}
                />

                {/* Comments */}
                {comments.map((comment) => (
                  <CommentContainer
                    key={comment.id}
                    comment={comment}
                    comments={comments}
                    setComments={setComments}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostContainer;

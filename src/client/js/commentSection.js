import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelector(".comment__delete");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const userIcon = document.createElement("div");
  const icon = document.createElement("i");
  const commentElse = document.createElement("div");
  const elseDiv = document.createElement("div");
  const nameSpan = document.createElement("span");
  const createdAtSpan = document.createElement("span");
  const comment = document.createElement("div");
  const commentIcons = document.createElement("div");
  const likes = document.createElement("span");
  const dislike = document.createElement("span");
  const deleted = document.createElement("span");
  const { name } = document.querySelector(".user__name").dataset;
  console.log(id);
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  userIcon.className = "comment__userIcon";
  icon.className = "fas fa-comment";
  commentElse.className = "comment__else";
  createdAtSpan.className = "comment__createdAt";
  comment.className = "comment__text";
  commentIcons.className = "comment__icons";
  likes.className = "far fa-thumbs-up likes";
  dislike.className = "far fa-thumbs-down dislikes";
  deleted.className = "far fa-trash-alt comment__delete";
  comment.innerText = `${text}`;
  nameSpan.innerText = `${name}`;
  createdAtSpan.innerText =
    "   ·  " +
    new Date().toLocaleDateString("ko-kr", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  likes.innerText = `  0`;
  dislike.innerText = `  0`;
  elseDiv.appendChild(nameSpan);
  elseDiv.appendChild(createdAtSpan);
  commentIcons.appendChild(likes);
  commentIcons.appendChild(dislike);
  commentIcons.appendChild(deleted);
  commentElse.appendChild(elseDiv);
  commentElse.appendChild(comment);
  commentElse.appendChild(commentIcons);
  userIcon.appendChild(icon);
  newComment.appendChild(userIcon);
  newComment.appendChild(commentElse);
  videoComments.prepend(newComment);
};

const deleteComment = (target) => {
  //
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    console.log(newCommentId);
    addComment(text, newCommentId);
  }
};

const handleDeleteComment = async (event) => {
  const { target } = event;
  const { commentId } = target.parentNode.parentNode.parentNode.dataset.id;
  // const response = await fetch(`/api/videos/comment/${commentId}`, {
  //     method: "DELETE",
  //     headers: {
  //         "Content-Type": "application/json",
  //     },
  // });
  // if (response.status === 201) {
  //     console.log(target);
  //     deleteComment(target);
  // }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
  deleteBtn.addEventListener("click", handleDeleteComment);
}

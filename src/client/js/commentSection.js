import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment__delete");
const videoComments = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
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
    const likesIcon = document.createElement("span");
    const likesCount = document.createElement("span");
    const dislike = document.createElement("span");
    const dislikesIcon = document.createElement("span");
    const dislikesCount = document.createElement("span");
    const deleted = document.createElement("span");
    const { name } = document.querySelector(".user__name").dataset;
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    userIcon.className = "comment__userIcon";
    icon.className = "fas fa-comment";
    commentElse.className = "comment__else";
    createdAtSpan.className = "comment__createdAt";
    comment.className = "comment__text";
    commentIcons.className = "comment__icons";
    likes.className = "likes";
    likesIcon.className = "far fa-thumbs-up";
    dislike.className = "dislikes";
    dislikesIcon.className = "far fa-thumbs-down";
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
    likesCount.innerText = `  0`;
    dislikesCount.innerText = `  0`;
    elseDiv.appendChild(nameSpan);
    elseDiv.appendChild(createdAtSpan);
    likes.appendChild(likesIcon);
    likes.appendChild(likesCount);
    dislike.appendChild(dislikesIcon);
    dislike.appendChild(dislikesCount);
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

    deleted.addEventListener("click", handleDeleteComment);
};

const deleteComment = (target) => {
    const videoComment = target.parentNode.parentNode.parentNode;
    videoComments.removeChild(videoComment);
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
        addComment(text, newCommentId);
    }
};

const handleDeleteComment = async (event) => {
    const { target } = event;
    const commentId = target.parentNode.parentNode.parentNode.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
    });
    if (response.status === 201) {
        deleteComment(target);
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
    deleteBtn.forEach((btn) => btn.addEventListener("click", handleDeleteComment));
}

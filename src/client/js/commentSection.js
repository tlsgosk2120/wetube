const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".comment__delete");
const videoComments = document.querySelector(".video__comments ul");
const likesBtns = document.querySelectorAll(".fa-thumbs-up");
const dislikesBtns = document.querySelectorAll(".fa-thumbs-down");
const commentMenuBtns = document.querySelectorAll(".comment__menu");
const commentMenus = document.querySelectorAll(".comment__menu_box");
const lovesBtns = document.querySelectorAll(".comment__heart");
const DELETE_BOX = "comment__delete";

const addComment = (text, id) => {
    const newComment = document.createElement("li");
    const userIcon = document.createElement("div");
    const icon = document.createElement("i");
    const commentElse = document.createElement("div");
    const elseDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    const createdAtSpan = document.createElement("span");
    const comment = document.createElement("div");
    const textBox = document.createElement("pre");
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
    textBox.className = "comment__text";
    commentIcons.className = "comment__icons";
    likes.className = "likes";
    likesIcon.className = "far fa-thumbs-up";
    dislike.className = "dislikes";
    dislikesIcon.className = "far fa-thumbs-down";
    deleted.className = "fas fa-trash comment__delete_btn";
    textBox.innerText = `${text}`;
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
    comment.appendChild(textBox);
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
    let videoComment;
    if (target.className === DELETE_BOX) {
        videoComment = target.parentNode.parentNode.parentNode.parentNode;
    } else {
        videoComment = target.parentNode.parentNode.parentNode.parentNode.parentNode;
    }
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
    let commentId;
    if (target.className === DELETE_BOX) {
        commentId = target.parentNode.parentNode.parentNode.parentNode.dataset.id;
    } else {
        commentId = target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id;
    }
    console.log(commentId);
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
    });
    if (response.status === 201) {
        deleteComment(target);
    }
};

const handleCommentMenuBtn = (event) => {
    window.removeEventListener("click", handleRemoveCommentMenu);
    const { target } = event;
    const menu = target.parentNode.nextSibling;
    menu.style.display = "inline-block";
    menu.style.position = "absolute";
    menu.style.top = target.getBoundingClientRect().y + target.getBoundingClientRect().height + pageYOffset + "px";
    menu.style.left = target.getBoundingClientRect().x + "px";
    setTimeout(() => {
        window.addEventListener("click", handleRemoveCommentMenu);
    }, 300);
};

const handleRemoveCommentMenu = () => {
    commentMenus.forEach((btn) => {
        btn.style.display = "none";
    });
    if (commentMenuBtns) {
        commentMenuBtns.forEach((btn) => btn.addEventListener("click", handleCommentMenuBtn));
    }
};

const clickIcon = (event) => {
    const { target } = event;
    const COMMENT_MENU = "comment__menu";
    target.classList.add("click-after");
    if (!target.classList.contains(COMMENT_MENU)) {
        if (target.style.color == "" || target.style.color === "rgb(144, 144, 144)") {
            target.style.color = "cornflowerblue";
        } else {
            target.style.color = "#909090";
        }
    }
    if (target.classList.contains("comment__heart")) {
        if (target.style.color === "cornflowerblue") {
            target.className = "fas fa-heart comment__heart";
            target.style.color = "#cc4646";
        } else {
            target.className = "far fa-heart comment__heart";
            target.style.color = "#909090";
        }
    }
    setTimeout(() => {
        target.classList.remove("click-after");
    }, 300);
};

const handleDislikes = (event) => {
    clickIcon(event);
};

const handleLikes = (event) => {
    clickIcon(event);
};

const handleLoves = (event) => {
    clickIcon(event);
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
    deleteBtns.forEach((btn) => btn.addEventListener("click", handleDeleteComment));
}

if (commentMenuBtns) {
    commentMenuBtns.forEach((btn) => btn.addEventListener("click", handleCommentMenuBtn));
}

likesBtns.forEach((btn) => btn.addEventListener("click", handleLikes));
dislikesBtns.forEach((btn) => btn.addEventListener("click", handleDislikes));
lovesBtns.forEach((btn) => btn.addEventListener("click", handleLoves));
commentMenuBtns.forEach((btn) => btn.addEventListener("click", clickIcon));

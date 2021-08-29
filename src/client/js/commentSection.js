import { async } from "regenerator-runtime";
import { modifyTime } from "./main";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const commentLikeBtns = document.querySelectorAll(".comment__star");
const videoLikeBtn = document.querySelector(".video__star");
const videoMenuBtn = document.querySelector(".video__menu");
const commentMenuBtns = document.querySelectorAll(".comment__menu");
const lovesBtns = document.querySelectorAll(".comment__heart");
const userName = document.querySelector(".user__name");
const calcelBtn = document.querySelector(".comment_calcel");
const saveBtn = document.querySelector(".comment_save");
const commentCreatedAts = document.querySelectorAll(".comment__createdAt");
const commentWriteBtn = document.querySelector(".video__add-comments textarea");

const EDIT_BOX = "comment__edit";
const DELETE_BOX = "comment__delete";
let lastMeneBtn;

const addComment = (text, id) => {
    const newComment = document.createElement("li");
    const userIcon = document.createElement("div");
    const a = document.createElement("a");
    const icon = document.createElement("span");
    const img = document.createElement("img");
    const commentElse = document.createElement("div");
    const elseDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    const createdAtSpan = document.createElement("span");
    const commentMenuIcon = document.createElement("span");
    const commentMenuBox = document.createElement("div");
    const ul = document.createElement("ul");
    const commentEdit = document.createElement("li");
    const editIcon = document.createElement("span");
    const editText = document.createElement("span");
    const commentDelete = document.createElement("li");
    const deleteIcon = document.createElement("span");
    const deleteText = document.createElement("span");

    const videoCommentForm = document.createElement("form");
    const commentWrite = document.createElement("div");
    const commentTextarea = document.createElement("textarea");
    const commentSaveBtn = document.createElement("button");
    const commentCancelBtn = document.createElement("button");

    const comment = document.createElement("div");
    const textBox = document.createElement("pre");
    const commentIcons = document.createElement("div");
    const likes = document.createElement("span");
    const likesIcon = document.createElement("span");
    const likesCount = document.createElement("span");
    const loveIcon = document.createElement("span");

    const { name } = userName.dataset;
    const videoOwner = document.querySelector(".video__owner a");
    const userAvatar = document.querySelector(".header__avatar");

    newComment.dataset.id = id;
    newComment.className = "video__comment";
    userIcon.className = "comment__userIcon";
    icon.className = "fas fa-user-circle comment_avatar";
    img.className = "comment_avatar";
    commentElse.className = "comment__else";
    createdAtSpan.className = "comment__createdAt";
    commentMenuIcon.className = "fas fa-ellipsis-v comment__menu";
    commentMenuBox.className = "menu_box";
    commentEdit.className = "comment__edit";
    editIcon.className = "fas fa-pen";
    editText.className = "menu_box_text";
    commentDelete.className = "comment__delete";
    deleteIcon.className = "fas fa-trash";
    deleteText.className = "menu_box_text";

    videoCommentForm.className = "video__comment-form display_none";
    commentWrite.className = "comment_write";
    commentTextarea.cols = 30;
    commentTextarea.rows = 10;
    commentTextarea.placeholder = "공개 댓글 추가...";
    commentSaveBtn.className = "comment_save";
    commentSaveBtn.disabled = true;
    commentSaveBtn.innerText = "저장";
    commentCancelBtn.className = "comment_calcel";
    commentCancelBtn.innerText = "취소";

    textBox.className = "comment__text";
    commentIcons.className = "comment__icons";
    likes.className = "likes";
    likesIcon.className = "far fa-star comment__star";
    loveIcon.className = "far fa-heart comment__heart";
    textBox.innerText = `${text}`;
    nameSpan.innerText = `${name}`;
    createdAtSpan.innerText = "0초 전";

    likesCount.innerText = `0`;
    editText.innerText = `수정`;
    deleteText.innerText = `삭제`;
    elseDiv.appendChild(nameSpan);
    elseDiv.appendChild(createdAtSpan);
    elseDiv.appendChild(commentMenuIcon);
    commentEdit.appendChild(editIcon);
    commentEdit.appendChild(editText);
    commentDelete.appendChild(deleteIcon);
    commentDelete.appendChild(deleteText);
    ul.appendChild(commentEdit);
    ul.appendChild(commentDelete);
    commentMenuBox.appendChild(ul);

    commentWrite.appendChild(commentTextarea);
    commentWrite.appendChild(commentSaveBtn);
    commentWrite.appendChild(commentCancelBtn);
    videoCommentForm.appendChild(commentWrite);

    comment.appendChild(textBox);
    likes.appendChild(likesIcon);
    likes.appendChild(likesCount);
    commentIcons.appendChild(likes);
    if (String(name) === String(videoOwner.innerText)) commentIcons.appendChild(loveIcon);
    commentElse.appendChild(elseDiv);
    commentElse.appendChild(commentMenuBox);
    commentElse.appendChild(videoCommentForm);
    commentElse.appendChild(comment);
    commentElse.appendChild(commentIcons);
    userIcon.appendChild(a);
    if (userAvatar.classList.contains("fas")) {
        a.appendChild(icon);
    } else {
        img.src = userAvatar.src;
        a.appendChild(img);
    }
    newComment.appendChild(userIcon);
    newComment.appendChild(commentElse);
    videoComments.prepend(newComment);

    commentMenuIcon.addEventListener("click", handleCommentMenus);
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

const changeEditComment = (event) => {
    const { target } = event;
    let commentMenuBox;
    if (target.className === EDIT_BOX) {
        commentMenuBox = target.parentNode.parentNode;
    } else {
        commentMenuBox = target.parentNode.parentNode.parentNode;
    }
    const commentText = commentMenuBox.nextSibling.nextSibling.firstChild;
    const commentWrite = commentMenuBox.nextSibling.firstChild;
    const editArea = commentWrite.firstChild;
    const commentTextDiv = commentWrite.parentNode.nextSibling;
    const commentIcons = commentTextDiv.nextSibling;

    editArea.value = commentText.innerText;
    commentWrite.parentNode.classList.remove("display_none");
    commentTextDiv.classList.add("display_none");
    commentIcons.classList.add("display_none");
    commentWrite.lastChild.previousSibling.addEventListener("click", handleEditComment);
    commentWrite.lastChild.addEventListener("click", (event) => {
        event.preventDefault();
        commentWrite.parentNode.classList.add("display_none");
        commentTextDiv.classList.remove("display_none");
        commentIcons.classList.remove("display_none");
    });
    commentWrite.firstChild.addEventListener("keyup", handleButtonDisable);
};

const editComment = (target) => {
    const commentMenuBox = target.parentNode.parentNode.previousSibling;
    const commentWrite = commentMenuBox.nextSibling.firstChild;
    const editArea = commentWrite.firstChild;
    const commentTextDiv = commentWrite.parentNode.nextSibling;
    const commentIcons = commentTextDiv.nextSibling;
    const commentText = commentMenuBox.nextSibling.nextSibling.firstChild;

    const editTextAdd = document.createElement("span");
    editTextAdd.innerText = "(수정됨)";
    commentMenuBox.previousSibling.firstChild.nextSibling.appendChild(editTextAdd);

    commentText.innerText = editArea.value;
    commentWrite.parentNode.classList.add("display_none");
    commentTextDiv.classList.remove("display_none");
    commentIcons.classList.remove("display_none");
};

const handleEditComment = async (event) => {
    event.preventDefault();
    const { target } = event;
    const text = target.previousSibling.value;
    if (text === "") {
        return;
    }
    const commentId = target.parentNode.parentNode.parentNode.parentNode.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        editComment(target);
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
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
    });
    if (response.status === 201) {
        deleteComment(target);
    }
};

const paintColor = (target) => {
    target.classList.remove("far");
    target.classList.add("fas");
};
const emptyColor = (target) => {
    target.classList.remove("fas");
    target.classList.add("far");
    target.style.color = "#909090";
};

const changeIconColor = (target) => {
    if (target.classList.contains("fa-star")) {
        if (target.classList.contains("far")) {
            paintColor(target);
            target.style.color = "#fce100";
            target.nextSibling.innerText = Number(target.nextSibling.innerText) + 1;
        } else {
            emptyColor(target);
            target.nextSibling.innerText = Number(target.nextSibling.innerText) - 1;
        }
    }
    if (target.classList.contains("comment__heart")) {
        if (target.classList.contains("far")) {
            paintColor(target);
            target.style.color = "#cc4646";
        } else {
            emptyColor(target);
        }
    }
};

const clickIcon = (target) => {
    target.classList.add("click-after");
    setTimeout(() => {
        target.classList.remove("click-after");
        if (!userName) {
            alert("Login First!");
        }
    }, 300);
};

const countVideoLike = async (target) => {
    if (userName) {
        let videoId = target.parentNode.parentNode.parentNode.parentNode.previousSibling.dataset.id;
        const response = await fetch(`/api/videos/${videoId}/like`, {
            method: "PUT",
        });
        if (response.status === 201) {
            changeIconColor(target);
            clickIcon(target);
        }
    }
};

const countCommentLike = async (target) => {
    if (userName) {
        let commentId = target.parentNode.parentNode.parentNode.parentNode.dataset.id;
        const response = await fetch(`/api/commnets/${commentId}/like`, {
            method: "PUT",
        });
        if (response.status === 201) {
            changeIconColor(target);
            clickIcon(target);
        }
    }
};

const clickHeart = async (target) => {
    let commentId = target.parentNode.parentNode.parentNode.dataset.id;
    const response = await fetch(`/api/commnets/${commentId}/heart`, {
        method: "PUT",
    });
    if (response.status === 201) {
        changeIconColor(target);
        clickIcon(target);
    }
};

const handleCommentMenuBtn = (event) => {
    handleRemoveCommentMenu();
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
    lastMeneBtn = menu;
    const editBtn = menu.querySelector(".comment__edit");
    const deleteBtn = menu.querySelector(".comment__delete");
    if (editBtn) {
        editBtn.addEventListener("click", changeEditComment);
        deleteBtn.addEventListener("click", handleDeleteComment);
    }
};

const handleRemoveCommentMenu = () => {
    if (lastMeneBtn) {
        lastMeneBtn.style.display = "none";
    }
};

const handleVideoLikes = (event) => {
    const { target } = event;
    countVideoLike(target);
};

const handleCommentLikes = (event) => {
    const { target } = event;
    countCommentLike(target);
};

const handleLoves = (event) => {
    const { target } = event;
    clickHeart(target);
};

const handleCommentMenus = (event) => {
    const { target } = event;
    target.classList.add("click-after");
    setTimeout(() => {
        target.classList.remove("click-after");
    }, 500);
    handleCommentMenuBtn(event);
};

const handleCancelBtn = (event) => {
    const { target } = event;
    event.preventDefault();
    const comment = target.previousSibling.previousSibling;
    comment.value = "";
};

const handleButtonDisable = (event) => {
    const { target } = event;
    let CLASS_NAME = `.${target.parentNode.parentNode.parentNode.classList.toString()} textarea`;
    let empty;
    empty = document.querySelector(CLASS_NAME).value.length == 0 ? true : false;
    if (empty) {
        target.nextSibling.disabled = true;
    } else {
        target.nextSibling.disabled = false;
    }
};

if (form) {
    saveBtn.addEventListener("click", handleSubmit);
}

videoLikeBtn.addEventListener("click", handleVideoLikes);
commentLikeBtns.forEach((btn) => btn.addEventListener("click", handleCommentLikes));
lovesBtns.forEach((btn) => btn.addEventListener("click", handleLoves));
if (videoMenuBtn) {
    videoMenuBtn.addEventListener("click", handleCommentMenus);
}
commentMenuBtns.forEach((btn) => btn.addEventListener("click", handleCommentMenus));
calcelBtn.addEventListener("click", handleCancelBtn);
if (commentCreatedAts) {
    commentCreatedAts.forEach((at) => modifyTime(at));
}
commentWriteBtn.addEventListener("keyup", handleButtonDisable);

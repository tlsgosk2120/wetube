const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".comment__delete");
const videoComments = document.querySelector(".video__comments ul");
const likesBtns = document.querySelectorAll(".fa-star");
const commentMenuBtns = document.querySelectorAll(".comment__menu");
const lovesBtns = document.querySelectorAll(".comment__heart");

const DELETE_BOX = "comment__delete";
let lastMeneBtn;

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  const userIcon = document.createElement("div");
  const icon = document.createElement("i");
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
  const comment = document.createElement("div");
  const textBox = document.createElement("pre");
  const commentIcons = document.createElement("div");
  const likes = document.createElement("span");
  const likesIcon = document.createElement("span");
  const likesCount = document.createElement("span");
  const loveIcon = document.createElement("span");

  const { name } = document.querySelector(".user__name").dataset;
  const videoOwner = document.querySelector(".video__owner a");

  newComment.dataset.id = id;
  newComment.className = "video__comment";
  userIcon.className = "comment__userIcon";
  icon.className = "fas fa-comment";
  commentElse.className = "comment__else";
  createdAtSpan.className = "comment__createdAt";
  commentMenuIcon.className = "fas fa-ellipsis-v comment__menu";
  commentMenuBox.className = "comment__menu_box";
  commentEdit.className = "comment_edit";
  editIcon.className = "fas fa-pen comment__edit_btn";
  editText.className = "comment__btn_text";
  commentDelete.className = "comment__delete";
  deleteIcon.className = "fas fa-trash comment__delete_btn";
  deleteText.className = "comment__btn_text";
  textBox.className = "comment__text";
  commentIcons.className = "comment__icons";
  likes.className = "likes";
  likesIcon.className = "far fa-star";
  loveIcon.className = "far fa-heart comment__heart";
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
  likes.appendChild(likesIcon);
  likes.appendChild(likesCount);
  commentIcons.appendChild(likes);
  if (String(name) === String(videoOwner.innerText))
    commentIcons.appendChild(loveIcon);
  comment.appendChild(textBox);
  commentElse.appendChild(elseDiv);
  commentElse.appendChild(commentMenuBox);
  commentElse.appendChild(comment);
  commentElse.appendChild(commentIcons);
  userIcon.appendChild(icon);
  newComment.appendChild(userIcon);
  newComment.appendChild(commentElse);
  videoComments.prepend(newComment);

  commentDelete.addEventListener("click", handleDeleteComment);
  commentMenuIcon.addEventListener("click", handleCommentMenus);
};

const deleteComment = (target) => {
  let videoComment;
  if (target.className === DELETE_BOX) {
    videoComment = target.parentNode.parentNode.parentNode.parentNode;
  } else {
    videoComment =
      target.parentNode.parentNode.parentNode.parentNode.parentNode;
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
    commentId =
      target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id;
  }
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    deleteComment(target);
  }
};

const clickIcon = (target) => {
  console.log(target);
  if (target.classList.contains("fa-star")) {
    if (
      target.style.color === "rgb(144, 144, 144)" ||
      (target.style.color == "" && target.dataset.star == 0)
    ) {
      console.log(target.style.color);
      target.style.color = "#fce100";
      target.className = "fas fa-star";
      target.nextSibling.innerText = Number(target.nextSibling.innerText) + 1;
    } else {
      target.style.color = "#909090";
      target.className = "far fa-star";
      target.nextSibling.innerText = Number(target.nextSibling.innerText) - 1;
    }
  }
  if (target.classList.contains("comment__heart")) {
    if (
      target.style.color == "" ||
      target.style.color === "rgb(144, 144, 144)"
    ) {
      target.className = "fas fa-heart comment__heart";
      target.style.color = "#cc4646";
    } else {
      target.className = "far fa-heart comment__heart";
      target.style.color = "#909090";
    }
  }
  target.classList.add("click-after");
  setTimeout(() => {
    target.classList.remove("click-after");
  }, 300);
};

const countLike = async (target) => {
  let commentId = target.parentNode.parentNode.parentNode.parentNode.dataset.id;
  const response = await fetch(`/api/commnets/${commentId}/like`, {
    method: "PUT",
  });
  if (response.status === 201) {
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
  menu.style.top =
    target.getBoundingClientRect().y +
    target.getBoundingClientRect().height +
    pageYOffset +
    "px";
  menu.style.left = target.getBoundingClientRect().x + "px";
  setTimeout(() => {
    window.addEventListener("click", handleRemoveCommentMenu);
  }, 300);
  lastMeneBtn = menu;
};

const handleRemoveCommentMenu = () => {
  if (lastMeneBtn) {
    lastMeneBtn.style.display = "none";
  }
};

const handleLikes = (event) => {
  const { target } = event;
  countLike(target);
};

const handleLoves = (event) => {
  const { target } = event;
  clickIcon(target);
};

const handleCommentMenus = (event) => {
  const { target } = event;
  target.classList.add("click-after");
  setTimeout(() => {
    target.classList.remove("click-after");
  }, 300);
  handleCommentMenuBtn(event);
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
  deleteBtns.forEach((btn) =>
    btn.addEventListener("click", handleDeleteComment)
  );
}

likesBtns.forEach((btn) => btn.addEventListener("click", handleLikes));
lovesBtns.forEach((btn) => btn.addEventListener("click", handleLoves));
commentMenuBtns.forEach((btn) =>
  btn.addEventListener("click", handleCommentMenus)
);

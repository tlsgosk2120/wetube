const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const userIcon = document.createElement("div");
    const icon = document.createElement("i");
    const commentElse = document.createElement("div");
    const elseDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    const createdAtSpan = document.createElement("span");
    const comment = document.createElement("div");
    const { name } = document.querySelector("header nav ul li a img").dataset;
    newComment.className = "video__comment";
    userIcon.className = "comment__userIcon";
    icon.className = "fas fa-comment";
    commentElse.className = "comment__else";
    createdAtSpan.className = "comment__createdAt";
    comment.innerText = `${text}`;
    nameSpan.innerText = `${name}`;
    createdAtSpan.innerText = "   ·  " + new Date().toLocaleDateString("ko-kr", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    elseDiv.appendChild(nameSpan);
    elseDiv.appendChild(createdAtSpan);
    commentElse.appendChild(elseDiv);
    commentElse.appendChild(comment);
    userIcon.appendChild(icon);
    newComment.appendChild(userIcon);
    newComment.appendChild(commentElse);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    textarea.value = "";
    if (status === 201) {
        addComment(text);
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

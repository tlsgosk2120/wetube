const image = document.querySelector("#avatar");
const previewSpan = document.querySelector(".profile_preview");
const previewImage = document.querySelector(".preview_image");

const handleShowImage = (event) => {
  const { target } = event;
  if (target.files && target.files[0]) {
    previewImage.src = URL.createObjectURL(target.files[0]);
    previewSpan.classList.remove("hide_preview");

    previewImage.onload = () => {
      URL.revokeObjectURL(previewImage.src);
    };
  }
};

image.addEventListener("change", handleShowImage);

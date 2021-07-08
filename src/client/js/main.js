import fetch from "node-fetch";

const hello = async () => {
  alert("hi! its working");
  const x = await fetch("");
};

hello();

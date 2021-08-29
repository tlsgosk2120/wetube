import regeneratorRuntime from "regenerator-runtime";
import "../scss/styles.scss";

const createAt = document.querySelector(".video-mixin__createAt");

export const modifyTime = (at) => {
    const commentTime = at.firstChild;
    let edit = "";
    if (commentTime) {
        edit = commentTime.innerText;
    }
    let time;
    const createDate = new Date(at.dataset.date);
    const now = new Date();
    const SEC = 1000;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MON = DAY * 30;
    const YEAR = DAY * 365;

    const cur = now - createDate;
    const seconds = `${parseInt(cur / SEC)}초 전`;
    const minutes = Number(cur / MIN) >= 1 ? `${parseInt(cur / MIN)}분 전` : 0;
    const hours = Number(cur / HOUR) >= 1 ? `${parseInt(cur / HOUR)}시간 전` : 0;
    const days = Number(cur / DAY) >= 1 ? `${parseInt(cur / DAY)}일 전` : 0;
    const weeks = Number(cur / WEEK) >= 1 ? `${parseInt(cur / WEEK)}주 전` : 0;
    const months = Number(cur / MON) >= 1 ? `${parseInt(cur / MON)}개월 전` : 0;
    const years = Number(cur / YEAR) >= 1 ? `${parseInt(cur / YEAR)}년 전` : 0;
    if (seconds != 0) time = seconds;
    if (minutes != 0) time = minutes;
    if (hours != 0) time = hours;
    if (days != 0) time = days;
    if (weeks != 0) time = weeks;
    if (months != 0) time = months;
    if (years != 0) time = years;
    at.innerText = `${time}${edit}`;
};

if (createAt) {
    console.log(createAt);
    modifyTime(createAt);
}

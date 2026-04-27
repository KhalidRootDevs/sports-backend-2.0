import axios from "axios";

const rapidApiFootballUrl = axios.create({
    baseURL: process.env.RAPID_API_FOOTBALL_URL,
    timeout: 30000,
    headers: {
        "content-type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST_FOOTBALL
    },
});

export default rapidApiFootballUrl;
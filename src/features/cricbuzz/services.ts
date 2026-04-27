import axios from "axios";

const cricBuzzCricketUrl = axios.create({
    baseURL: process.env.RAPID_API_CRICKET_URL,
    timeout: 30000,
    headers: {
        "content-type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST
    }
});

export default cricBuzzCricketUrl;

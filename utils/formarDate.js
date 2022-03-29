import moment from "moment";
export default function formatDate(games) {
    for (let i = 0; i < games.length; i++) {
        const dateFormat = moment(games[i].gamedate).format('L');
        const timeFormat = moment(games[i].gamedate).format('LTS');
        games[i].gamedate = `${dateFormat} ${timeFormat}`
    }

}
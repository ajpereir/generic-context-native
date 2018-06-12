export default function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}
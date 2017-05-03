export default function getBar () {
    return System.import('./foo').then(m => m.default())
}
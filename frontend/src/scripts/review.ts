export function sanitize(text: string) {
  if (!text)
    return ''

  const regex = /\bon\w+\=\"?[\w\:\(\)\']+\"?/g
  return text.replaceAll(regex, '')
}

export const allowedImageFormats = ['.jpeg', '.gif', '.png', '.apng', '.svg', '.bmp', '.bmp', '.ico', '.jpg', '.webp']

/**
 * Checks wether an image within a comment is valid. Otherwise it handles it as a link
 */

export function isValidImage(text: string) {
  return allowedImageFormats.some(format => text.endsWith(format))
}
/**
 * Function which takes in the content of a comment and replaces image or links with their respective tags
 */
export function formatCommentContent(text: string) {
  const _regex = /\bhttps?:\/\/\S+/gi
  const urls = [...new Set(text.match(_regex))]
  const _img = (_url: string) => /* html */ `<img src="${_url}" />`
  const _a = (_url: string) => /* html */ `<a href="${_url}" target="_blank">${_url}</a>`

  if (urls && urls.length > 0) {
    // Loop over each url
    urls.forEach((url) => {
      let chunk

      if (isValidImage(url)) {
        // Is an image
        chunk = _img(url)
      }
      else {
        // is a link
        chunk = _a(url)
      }

      text = text.replaceAll(url, chunk)
    })
  }

  return text
}

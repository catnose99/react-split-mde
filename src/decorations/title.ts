export const title = (text: string, className: string) => {
  if (className === "hljs-code") {
    return text;
  }
  return text.replace(/(^|\n)(\#+) (.*)?/g, (match, p1, p2, p3) => {
    return `${p1}<span class="sharp">${p2} </span><span class="title-${p2.length}">${p3 ? p3 : ''}</span> `
  })
}
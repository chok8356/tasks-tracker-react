export const cookie = {
  get(name: string): null | string {
    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`,
      ),
    )
    return matches ? decodeURIComponent(matches[1]) : null
  },

  set(name: string, value: string, days?: number): void {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      cookieStr += `; expires=${date.toUTCString()}`
    }
    cookieStr += '; path=/'
    document.cookie = cookieStr
  },
}

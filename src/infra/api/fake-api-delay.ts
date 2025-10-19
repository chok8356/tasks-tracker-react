export function fakeApiDelay(minMs: number = 100, maxMs: number = 200) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms)
  })
}

export function fakeApiDelay(minMs = 100, maxMs = 200) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms)
  })
}

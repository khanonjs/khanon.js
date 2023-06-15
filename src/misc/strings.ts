export class Strings {
  static hash(text: string): number {
    let hash = 0
    let chr: number
    if (text.length === 0) {
      return hash
    }
    for (let i: number = 0; i < text.length; i++) {
      chr = text.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0
    }
    return hash
  }
}

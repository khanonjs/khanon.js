export class Arrays {
  static shuffle(arr: any[], startsOn: number = 0): void {
    let currentIndex = arr.length
    let randomIndex: number
    while (currentIndex !== 0 + startsOn) {
      randomIndex = Math.floor(Math.random() * (currentIndex - startsOn)) + startsOn
      currentIndex--
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
    }
  }

  static empty(arr: any[]): void {
    arr.splice(0, arr.length)
  }

  static removeValue(arr: any[], value: any) {
    const index = arr.indexOf(value)
    if (index >= 0) {
      arr.splice(index, 1)
    }
  }
}

export class Arrays {
  static shuffle(arr: any[], startsOn: number = 0): void {
    let currentIndex = arr.length
    let randomIndex: number
    while (currentIndex !== 0 + startsOn) {
      randomIndex = Math.floor(Math.random() * (currentIndex - startsOn)) + startsOn
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
    }
  }

  static clear(arr: any[]): void {
    arr.splice(0, arr.length)
  }

  static removeValue(arr: any[] | undefined, value: any): void {
    if (arr) {
      let i = 0
      while (i < arr.length) {
        if (arr[i] === value) {
          arr.splice(i, 1)
        } else {
          ++i
        }
      }
    }
  }
}

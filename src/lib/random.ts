 
export function gacha(probability: number) {
    if (probability >= 100) {
        return true
    }
    return (Math.random()*100 < probability)
}

export function gachaMultiple(probability: number[]) {
    const random = Math.random() * probability.reduce((acc, cur) => acc + cur)
    let cur = 0.0
    for (let i in probability) {
        cur += probability[i]
        if (cur > random) {
            return Number(i)
        }
    }
    return probability.indexOf(Math.max(...probability));
}

export function gachaMultipleDict(probability: {[index: string]: number;}) {
    let sum = 0
    for (let key in probability) {
        sum += probability[key];
    }
    const random = Math.random() * sum
    let cur = 0.0
    for (let i in probability) {
        cur += probability[i]
        if (cur > random) {
            return i
        }
    }
    return Object.entries(probability).reduce((a, b) => a[1] > b[1] ? a : b)[0]
}

export function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

export function currentTimestamp(stripSeconds: boolean = false) {
    let today = new Date(Date.now() + KR_TIME_DIFF).getTime()
    if (stripSeconds) {
        return toTimestampFloorSeconds(today)
    } else {
        return toTimestamp(today)
    }
}

export function currentTime() {
    return new Date(Date.now() + KR_TIME_DIFF).getTime()
}

export function toTimestamp(date: number) {
    return new Date(date).toISOString().replace('T', ' ').substring(0, 19)
}

export function toTimestampDate(date: Date) {
    return date.toISOString().replace('T', ' ').substring(0, 19)
}

export function toTimestampFloorSeconds(date: number) {
    return new Date(date).toISOString().replace('T', ' ').substring(0, 16) + ':00'
}
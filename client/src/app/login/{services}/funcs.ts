const transMinSec = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
}

export const loginFunc = {
    transMinSec
}
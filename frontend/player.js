const music = document.getElementById("audio")

const player1 = document.getElementById("player1")
const player2 = document.getElementById("player2")
const player3 = document.getElementById("player3")

// const range1 = document.getElementsByClassName("seek-bar1")
const range1 = document.getElementById("slide1")
const range2 = document.getElementById("slide2")
const range3 = document.getElementById("slide3")

const currentTime1 = document.getElementById("current-time1")
const currentTime2 = document.getElementById("current-time2")
const currentTime3 = document.getElementById("current-time3")

const sources = ["./assets/epic.mp3", "./assets/lofi.mp3", "./assets/a.mp3"]
const lengths = [45, 45, 45]

var currentSource = ""
var interval = undefined;

const allRangeToNul = () => {
    range1.value = 0
    range2.value = 0
    range3.value = 0
    currentTime1.innerText = "00:00"
    currentTime2.innerText = "00:00"
    currentTime3.innerText = "00:00"
    player1.classList.remove("paused")
    player2.classList.remove("paused")
    player3.classList.remove("paused")
}

const isPlaying = (elem) => {
    return !elem.paused;
}

const stopPlaying = () => {
    music.src = ""
    player1.classList.remove("paused")
    player2.classList.remove("paused")
    player3.classList.remove("paused")
}

const getTime = (length, range, cTime) => {    
    const current = music.currentTime
    if (current >= length) {
        // music finished
        range.value = 0
        allRangeToNul()
    } else {
        // music playing
        const time = (current / length) * 100 
        cTime.innerText = "00:" + Number(Number(current).toFixed(0)).toLocaleString("en-US", {minimumIntegerDigits: 2})
        range.value = time 
    }
}

player1.addEventListener("click", () => {    
    if (isPlaying(music) && currentSource == sources[0]) {
        // pause
        music.pause()
        player1.classList.remove("paused")
    } else if (!isPlaying(music) && currentSource == sources[0]) {
        // unpause
        music.play()
        player1.classList.add("paused")
    } else {
        stopPlaying()
        allRangeToNul()
        player1.classList.add("paused")
        music.src = sources[0]
        music.play()
        currentSource = sources[0]
        window.clearInterval(interval)
        interval = window.setInterval(() => {
            getTime(lengths[0], range1, currentTime1)
        }, 500)
    }
})
player2.addEventListener("click", () => {
    if (isPlaying(music) && currentSource == sources[1]) {
        //pause
        music.pause()
        player2.classList.remove("paused")
    } else if (!isPlaying(music) && currentSource == sources[1]) {
        // unpause
        music.play()
        player2.classList.add("paused")
    } else {
        stopPlaying()
        allRangeToNul()
        player2.classList.add("paused")
        music.src = sources[1]
        music.play()
        currentSource = sources[1]
        window.clearInterval(interval)
        interval = window.setInterval(() => {
            getTime(lengths[1], range2, currentTime2)
        }, 500)
    }
})
player3.addEventListener("click", () => {
    if (isPlaying(music) && currentSource == sources[2]) {
        //pause
        music.pause()
        player3.classList.remove("paused")
    } else if (!isPlaying(music) && currentSource == sources[2]) {
        // unpause
        music.play()
        player3.classList.add("paused")
    } else {
        stopPlaying()
        allRangeToNul()
        player3.classList.add("paused")
        music.src = sources[2]
        music.play()
        currentSource = sources[2]
        window.clearInterval(interval)
        interval = window.setInterval(() => {
            getTime(lengths[2], range3, currentTime3)
        }, 500)
    }
})
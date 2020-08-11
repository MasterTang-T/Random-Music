<template>
<div class="container">
    <div class="imgContainer">
        <img :src="backgroundImgUrl" alt="" class="backgroundImg" />
        <div class="play" v-show="!isPlaying" @click="play"></div>
        <div class="pause" v-show="isPlaying" @click="pause"></div>
        <div class="next_button" @click="changeSong"></div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            backgroundImgUrl: "",
            isPlaying: false,
        };
    },
    mounted() {
        let _this = this;
        chrome.storage.local.get(['isPlaying'], function (result) {
            console.log(result,"result")
            if (result && result instanceof Object && Object.keys(result).length > 0) {
                _this.isPlaying = result.isPlaying || false;
            } else {
                chrome.storage.local.clear()
                _this.getOneSongInfo();
            }
        })
    },
    methods: {
        // 获取一首歌
        getOneSongInfo() {
            let _this = this;
            let bg = chrome.extension.getBackgroundPage();
            bg.getHighqualitySongList()
                .then((res) => {
                    console.log(res, "resres");
                    let {
                        coverImgUrl
                    } = res;
                    _this.backgroundImgUrl = coverImgUrl;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        play() {
            let _this = this;
            _this.isPlaying = true;
            chrome.runtime.sendMessage({
                beginPlay: true
            }, (res) => {
                _this.isPlaying = res.isPlaying;
                chrome.storage.local.set({
                    isPlaying: _this.isPlaying
                })
            });

        },
        pause() {
            let _this = this;
            _this.isPlaying = true;
            chrome.runtime.sendMessage({
                beginPlay: false
            }, (res) => {
                console.log(res, "play");
                _this.isPlaying = res.isPlaying;
                // 将播放状态存入缓存中
                chrome.storage.local.set({
                    isPlaying: _this.isPlaying
                })
            });

        },
        changeSong() {
            this.isPlaying = false;
            let _this = this;
            let bg = chrome.extension.getBackgroundPage();
            bg.getHighqualitySongList()
                .then((res) => {
                    let {
                        coverImgUrl
                    } = res;
                    _this.backgroundImgUrl = coverImgUrl;
                    _this.play()
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
body {
    padding: 0;
    margin: 0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 290px;
    width: 280px;
    background: gray;
    overflow: hidden;
}

.imgContainer {
    width: 100%;
    height: 100%;
    position: relative;
    justify-content: center;
    align-items: center;
}

.play,
.pause {
    height: 48px;
    width: 48px;
    background: url("../icons/play.png") no-repeat;
    background-size: 100% 100%;

    position: absolute;
    top: 41%;
    left: 30%;
}

.pause {
    background: url("../icons/pause.png") no-repeat;
    background-size: 100% 100%;
}

.next_button {
    height: 48px;
    width: 48px;
    background: url("../icons/next.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 41%;
    left: 60%;
}

.backgroundImg {
    width: 100%;
    height: 100%;
}
</style>

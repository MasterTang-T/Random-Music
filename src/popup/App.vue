<template>
  <div class="container">
    <loading v-if="loading"></loading>
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
      loading: true,
    };
  },
  mounted() {
    let _this = this;
    let isPlayingObj = JSON.parse(localStorage.getItem("isPlayingObj")) || {};
    if (isPlayingObj && Object.keys(isPlayingObj).length > 0) {
      _this.loading = false;
      _this.isPlaying = Boolean(isPlayingObj.isPlaying);
      _this.backgroundImgUrl = localStorage.getItem("coverImgUrl");
    } else {
      localStorage.clear();
      _this.loading = true;
      _this.getOneSongInfo();
    }
  },
  methods: {
    // 获取一首歌
    getOneSongInfo() {
      let _this = this;
      let bg = chrome.extension.getBackgroundPage();
      bg.getHighqualitySongList()
        .then((res) => {
          _this.loading = false;
          let { coverImgUrl } = res;
          _this.backgroundImgUrl = coverImgUrl;
          localStorage.setItem("coverImgUrl", _this.backgroundImgUrl);
        })
        .catch((err) => {
          _this.loading = false;
          console.log(err);
        });
    },
    play() {
      let _this = this;
      _this.isPlaying = true;
      chrome.runtime.sendMessage(
        {
          beginPlay: true,
        },
        (res) => {
          _this.isPlaying = res.isPlaying;
          _this.setLocalStorage(_this.isPlaying);
        }
      );
    },
    setLocalStorage(isPlaying) {
      let isPlayingObj = {
        isPlaying,
      };
      localStorage.setItem("isPlayingObj", JSON.stringify(isPlayingObj));
    },
    pause() {
      let _this = this;
      _this.isPlaying = true;
      chrome.runtime.sendMessage(
        {
          beginPlay: false,
        },
        (res) => {
          console.log(res, "play");
          _this.isPlaying = res.isPlaying;

          _this.setLocalStorage(_this.isPlaying);
        }
      );
    },
    changeSong() {
      this.isPlaying = false;
      let _this = this;
      let bg = chrome.extension.getBackgroundPage();
      _this.loading = true;

      bg.getHighqualitySongList()
        .then((res) => {
          _this.loading = false;

          let { coverImgUrl } = res;
          _this.backgroundImgUrl = coverImgUrl;
          localStorage.setItem("coverImgUrl", _this.backgroundImgUrl);
          _this.play();
        })
        .catch((err) => {
          _this.loading = false;

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
  cursor: pointer;
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
  cursor: pointer;
  position: absolute;
  top: 41%;
  left: 60%;
}

.backgroundImg {
  width: 100%;
  height: 100%;
}
</style>

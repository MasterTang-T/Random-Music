const BASE_HTTP_URL = 'https://api.mtnhao.com';
let backgroundImgUrl = ``;
const request = (url) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: "GET",
            success: (data) => {
                resolve(data)
            },
            failure: (error) => {
                reject(error)
            }
        })
    })
}
// 获取精品歌单
function getHighqualitySongList(obj) {
    return new Promise((resolve, reject) => {
        let url = `${BASE_HTTP_URL}/top/playlist/highquality`;
        request(url).then((response) => {
            let playlists = response.playlists || [];
            let num = playlists.length || 0;
            let index = randomCount(num) || 0;
            let id_songList = playlists[index].id || 0;
            let url_songList = `${BASE_HTTP_URL}/playlist/detail?id=${id_songList}`;
            request(url_songList).then((response) => {
                const playlist = response.playlist || [];
                const trackIds = playlist.trackIds || [];
                const coverImgUrl = playlist.coverImgUrl || "";
                let num = trackIds.length || 0;
                let index = randomCount(num);
                let id_song = trackIds[index].id || 0;
                let url_song = `${BASE_HTTP_URL}/song/url?id=${id_song}`;
                request(url_song).then((response) => {
                    let {
                        data,
                    } = response;
                    console.log(response, 'response')
                    let songUrl = data[0].url || "";
                    if (!songUrl) {
                        getHighqualitySongList();
                        return
                    }
                    createAudioElement(songUrl,obj);
                    resolve({
                        coverImgUrl,
                        songUrl
                    })
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                })
            }).catch((error) => {
                console.log(error);
                reject(error);

            })
        }).catch((error) => {
            console.log(error, 'error')
            reject(error);
        })
    })
}
// 随机num整数
function randomCount(num) {
    let int_num = parseInt(Number(num) * Math.random());
    return int_num;
}
// 创建声音元素
function createAudioElement(songUrl,obj) {
    let str = ``;
    if(obj && obj instanceof Object && Object.keys(obj).length > 0 && obj.autoPlay){
        str = `
        <audio src="${songUrl}" controls hidden="true" autoPlay id='audio'></audio>
    `
    }else{
        str = `
        <audio src="${songUrl}" controls hidden="true" id='audio'></audio>
    `
    }
    
    $('body').html(str);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.beginPlay) {
        $('body #audio')[0].play();
        let audio = document.getElementById('audio')
        audio.addEventListener('ended', function(){
            console.log('ended');
            getHighqualitySongList({
                autoPlay: true
            })
        },false)
        sendResponse({
            isPlaying: true,
        })
    } else {
        $('body #audio')[0].pause();
        sendResponse({
            isPlaying: false
        })
    }
})
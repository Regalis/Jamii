/*SimpleWebRTC*/
var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remoteVideos',
        autoRequestMedia: true
});

/*
webrtc.on('readyToCall', function () {
        webrtc.joinRoom('My room name');
});

*/

//하나의 chat session을 나타내는 클래스

import Peer from 'peerjs';
import Network from 'objects/Network';
import store from 'stores';
// import { setAudioConnected } from '../stores/UserStore';

export default class ChatSession {
  private myPeer: Peer;
  private peers = new Map<
    string,
    { call: Peer.MediaConnection; audio: HTMLAudioElement }
  >();
  private onCalledPeers = new Map<
    string,
    { call: Peer.MediaConnection; audio: HTMLAudioElement }
  >();
  private audioGrid = document.querySelector('.audio-grid');
  private buttonGrid = document.querySelector('.button-grid');
  private myAudio = document.createElement('audio');
  private myStream?: MediaStream;
  private network: Network;

  constructor(userId: string, network: Network) {
    this.myPeer = new Peer(userId);
    this.network = network;
    console.log('userId:', userId);
    console.log('userId:', userId);
    this.myPeer.on('error', (err) => {
      console.log(err.type);
      console.error(err);
    });

    // mute your own audio stream (you don't want to hear yourself)
    this.myAudio.muted = true;

    // config peerJS
    this.initialize();
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id

  initialize() {
    //외부 peer에서 내 peer로 call 시도를 할 때
    this.myPeer.on('call', (call) => {
      if (!this.onCalledPeers.has(call.peer)) {
        call.answer(this.myStream);
        const audio = document.createElement('audio');
        this.onCalledPeers.set(call.peer, { call, audio });

        //외부 peer가 stream을 add했을 때
        call.on('stream', (userStream) => {
          this.addAudioStream(audio, userStream);
        });
      }
      // on close is triggered manually with deleteOnCalledAudioStream()
    });
  }

  // check if permission has been granted before
  checkPreviousPermission() {
    const permissionName = 'microphone' as PermissionName;
    navigator.permissions?.query({ name: permissionName }).then((result) => {
      if (result.state === 'granted') this.getUserMedia(false);
    });
  }

  getUserMedia(alertOnError = true) {
    // ask the browser to get user media
    navigator.mediaDevices
      ?.getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        this.myStream = stream;
        this.addAudioStream(this.myAudio, this.myStream);
        // this.setUpButtons();
        store.dispatch(setAudioConnected(true));
        this.network.audioConnected();
      })
      .catch((error) => {
        if (alertOnError)
          window.alert(
            'No webcam or microphone found, or permission is blocked'
          );
      });
  }

  // method to call a peer
  connectToNewUser(userId: string) {
    if (this.myStream) {
      if (!this.peers.has(userId)) {
        console.log('calling', userId);
        const call = this.myPeer.call(userId, this.myStream);
        const audio = document.createElement('audio');
        this.peers.set(userId, { call, audio });

        call.on('stream', (userStream) => {
          this.addAudioStream(audio, userStream);
        });

        // on close is triggered manually with deleteAudioStream()
      }
    }
  }

  // method to add new audio stream to audioGrid div
  addAudioStream(audio: HTMLAudioElement, stream: MediaStream) {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
    if (this.audioGrid) this.audioGrid.append(audio);
  }

  // method to remove audio stream (when we are the host of the call)
  deleteAudioStream(userId: string) {
    if (this.peers.has(userId)) {
      const peer = this.peers.get(userId);
      peer?.call.close();
      peer?.audio.remove();
      this.peers.delete(userId);
    }
  }

  // method to remove audio stream (when we are the guest of the call)
  deleteOnCalledAudioStream(userId: string) {
    if (this.onCalledPeers.has(userId)) {
      const onCalledPeer = this.onCalledPeers.get(userId);
      onCalledPeer?.call.close();
      onCalledPeer?.audio.remove();
      this.onCalledPeers.delete(userId);
    }
  }

  // method to set up mute/unmute and audio on/off buttons
  // setUpButtons() {
  //   const audioButton = document.createElement('button');
  //   audioButton.innerText = 'Mute';
  //   audioButton.addEventListener('click', () => {
  //     if (this.myStream) {
  //       const audioTrack = this.myStream.getAudioTracks()[0];
  //       if (audioTrack.enabled) {
  //         audioTrack.enabled = false;
  //         audioButton.innerText = 'Unmute';
  //       } else {
  //         audioTrack.enabled = true;
  //         audioButton.innerText = 'Mute';
  //       }
  //     }
  //   });
  //   const audioButton = document.createElement('button');
  //   audioButton.innerText = 'Audio off';
  //   audioButton.addEventListener('click', () => {
  //     if (this.myStream) {
  //       const audioTrack = this.myStream.getAudioTracks()[0];
  //       if (audioTrack.enabled) {
  //         audioTrack.enabled = false;
  //         audioButton.innerText = 'Audio on';
  //       } else {
  //         audioTrack.enabled = true;
  //         audioButton.innerText = 'Audio off';
  //       }
  //     }
  //   });
  //   this.buttonGrid?.append(audioButton);
  //   this.buttonGrid?.append(audioButton);
  // }
}

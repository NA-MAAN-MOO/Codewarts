//하나의 chat session

import { useEffect, useState } from 'react';
import Peer from 'peerjs';
import store from 'stores';
// import { setAudioConnected } from '../stores/UserStore';

const ChatSession = ({ userId }: { userId: string }) => {
  const [myPeer, setMyPeer] = useState<Peer>();
  const [peers, setPeers] = useState<
    Map<string, { call: Peer.MediaConnection; audio: HTMLAudioElement }>
  >(new Map());
  const [onCalledPeers, setOnCalledPeers] = useState<
    Map<string, { call: Peer.MediaConnection; audio: HTMLAudioElement }>
  >(new Map());
  const [myStream, setMyStream] = useState<MediaStream>();
  const [myAudio, setMyAudio] = useState<HTMLAudioElement>(
    document.createElement('audio')
  );
  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);

  useEffect(() => {
    setMyPeer(new Peer(userId));
    console.log('userId:', userId);

    // mute your own audio stream (you don't want to hear yourself)
    myAudio.muted = true;
  }, []);

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id

  useEffect(() => {
    if (!myPeer) return;
    myPeer.on('error', (err) => {
      console.log(err);
    });

    //외부 peer에서 내 peer로 call 시도를 할 때
    myPeer.on('call', (call) => {
      if (!onCalledPeers.has(call.peer)) {
        call.answer(myStream);
        const audio = document.createElement('audio');
        onCalledPeers.set(call.peer, { call, audio });

        //외부 peer가 stream을 add했을 때
        call.on('stream', (userStream) => {
          addAudioStream(audio, userStream);
        });
      }
    });
  }, [myPeer]);

  // check if permission has been granted before
  const checkPreviousPermission = () => {
    const permissionName = 'microphone' as PermissionName;
    navigator.permissions?.query({ name: permissionName }).then((result) => {
      if (result.state === 'granted') getUserMedia(false);
    });
  };

  const getUserMedia = (alertOnError = true) => {
    // ask the browser to get user media
    navigator.mediaDevices
      ?.getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        setMyStream(stream);
        addAudioStream(myAudio, stream);
        // this.setUpButtons();
      })
      .catch((error) => {
        if (alertOnError)
          window.alert(
            'No webcam or microphone found, or permission is blocked'
          );
      });
  };

  // method to call a peer
  const connectToNewUser = (userId: string) => {
    if (myStream) {
      if (!peers.has(userId)) {
        console.log('calling', userId);
        const call = myPeer.call(userId, myStream);
        const audio = document.createElement('audio');
        peers.set(userId, { call, audio });

        call.on('stream', (userStream) => {
          addAudioStream(audio, userStream);
        });

        // on close is triggered manually with deleteAudioStream()
      }
    }
  };

  // method to add new audio stream to audioGrid div
  const addAudioStream = (audio: HTMLAudioElement, stream: MediaStream) => {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
      audio.play();
    });
    setAudios([...audios, audio]);
  };

  // method to remove audio stream (when we are the host of the call)
  const deleteAudioStream = (userId: string) => {
    if (peers.has(userId)) {
      const peer = peers.get(userId);
      peer?.call.close();
      peer?.audio.remove();
      peers.delete(userId);
    }
  };

  // method to remove audio stream (when we are the guest of the call)
  const deleteOnCalledAudioStream = (userId: string) => {
    if (onCalledPeers.has(userId)) {
      const onCalledPeer = onCalledPeers.get(userId);
      onCalledPeer?.call.close();
      onCalledPeer?.audio.remove();
      onCalledPeers.delete(userId);
    }
  };

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
  return <div>dddd</div>;
};

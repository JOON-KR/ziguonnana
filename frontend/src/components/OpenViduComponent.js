import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

const OpenViduComponent = ({ roomId }) => {
  const [session, setSession] = useState(null);
  const [myUserName] = useState('Participant' + Math.floor(Math.random() * 100));

  useEffect(() => {
    if (!roomId) {
      console.error("Room ID가 제공되지 않았습니다.");
      return;
    }

    const OV = new OpenVidu();
    const session = OV.initSession();
    setSession(session);

    console.log('Room ID:', roomId);
    console.log('UserName:', myUserName);

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      document.getElementById('video-container').appendChild(subscriber.video);
    });

    // Room ID를 사용하여 OpenVidu 서버에 연결
    session.connect(roomId, { clientData: myUserName })
      .then(() => {
        const publisher = OV.initPublisher(undefined);
        session.publish(publisher);
        document.getElementById('video-container').appendChild(publisher.video);
      })
      .catch(error => {
        console.error('Connection error:', error);
        console.error('Room ID:', roomId);
        console.error('UserName:', myUserName);
      });
  }, [roomId, myUserName]);

  return <div id="video-container"></div>;
};

export default OpenViduComponent;

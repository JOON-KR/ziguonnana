import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

const OpenViduComponent = ({ token, sessionId }) => {
  const [session, setSession] = useState(null);
  const [myUserName] = useState('Participant' + Math.floor(Math.random() * 100));

  useEffect(() => {
    if (!token) {
      console.error("토큰이 제공되지 않았습니다.");
      return;
    }

    const OV = new OpenVidu();
    const session = OV.initSession();
    setSession(session);

    console.log('Token:', token);
    console.log('UserName:', myUserName);

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      document.getElementById('video-container').appendChild(subscriber.video);
    });

    session.connect(token, { clientData: myUserName })
      .then(() => {
        const publisher = OV.initPublisher(undefined);
        session.publish(publisher);
        document.getElementById('video-container').appendChild(publisher.video);
      })
      .catch(error => {
        console.error('Connection error:', error);
        console.error('Token:', token);
        console.error('UserName:', myUserName);
      });
  }, [token, myUserName]);

  return <div id="video-container"></div>;
};

export default OpenViduComponent;

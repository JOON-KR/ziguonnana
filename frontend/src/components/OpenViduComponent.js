import React, { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

const OpenViduComponent = ({ token, sessionId }) => {
  const [session, setSession] = useState(null);
  const [myUserName] = useState('Participant' + Math.floor(Math.random() * 100));

  useEffect(() => {
    const OV = new OpenVidu(); //오픈비두 객체 생성
    const session = OV.initSession(); //세션 초기화
    setSession(session);

    // 다른 사용자가 새로운 스트림을 발행할 때마다 호출되는 이벤트 리스너
    session.on('streamCreated', (event) => { //세션 이벤트 등록
      const subscriber = session.subscribe(event.stream, undefined);
      document.getElementById('video-container').appendChild(subscriber.video);
    });

    // 토큰을 사용하여 세션에 연결
    session.connect(token, { clientData: myUserName })
      .then(() => {
        const publisher = OV.initPublisher(undefined);
        session.publish(publisher);
        document.getElementById('video-container').appendChild(publisher.video);
      })
      .catch(error => console.error('Connection error:', error));
  }, [token, myUserName]);

  return <div id="video-container"></div>;
};

export default OpenViduComponent;

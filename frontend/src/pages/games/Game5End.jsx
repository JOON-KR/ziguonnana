import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/APIconfig";
import styled from "styled-components";

const Game5End = () => {
    
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);

    //숏폼 합치기 요청 send
    useEffect(() => {
        if (client && client.connected) {
            console.log("send 보냄");
            client.send(`/app/game/${roomId}/shorts/merge`, {}, {});
        } else {
            console.log("send 부분에서 문제가 발생함");
        }
    }, [client, roomId])

    //숏폼 합치기 응답 받기
    useEffect(() => {
        if (client && client.connected) {
            const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
                const response = JSON.parse(message.body);
                console.log("서버로부터 받은 메시지:", response);
                if (response.commandType === "SHORTS_MERGE" && response.message === "SUCCESS") {
                    console.log("숏폼 합치기 완료");
                }
            } );
        }
    }, [client, roomId])

    return (
        <h1>숏폼 합쳐지는거 기다리는 컨텐츠 필요</h1>
    );
}

export default Game5End;
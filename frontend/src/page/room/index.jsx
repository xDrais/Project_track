import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';



function RoomPage() {
    const userLogin =useSelector(state =>state.userLogin)
const {userInfo} =userLogin

    const {roomId} = useParams()
    const myMeeting = useRef(null);




    const joinRoom = async (element) =>{
         // generate Kit Token
  const appID = 2142803818;
  const serverSecret = "322714394c01725fc119dbb7e61b14f8";
  const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID, serverSecret, roomId, Date.now().toString(), userInfo.firstName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
        container: element,
        sharedLinks: [
            {
              name: 'Personal link',
              url:
               window.location.protocol + '//' + 
               window.location.host + window.location.pathname +
                '?roomId=' +
                roomId,
            },
          ],
        scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          useFrontFacingCamera:true,
          turnOnCameraWhenJoining:true

    });
      console.log(zp.getVideo()); 
    }
   
    useEffect(() => {
        joinRoom();
      }, []);

    return (    <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: '100vw', height: '100vh' }}
      ></div>);
}

export default RoomPage;

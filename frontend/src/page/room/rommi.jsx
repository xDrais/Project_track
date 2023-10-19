import { JitsiMeeting } from '@jitsi/react-sdk';
import React from 'react';
import { useParams } from 'react-router-dom';

const Roomi = () => {
  const { roomName } = useParams();

  return (
    <div>
      <JitsiMeeting
        roomName={roomName}
        getIFrameRef={(node) => (node.style.height = '800px')}
      />
    </div>
  );
};

export default Roomi;

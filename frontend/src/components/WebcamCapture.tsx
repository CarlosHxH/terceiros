import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user"
};

const WebcamCapture = () => {
  const [pick, setPick] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPick(imageSrc);
    }
  };

  const retake = () => {
    setPick(null);
  };

  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div style={{ position: 'relative' }}>
        {!pick ? (
          <Webcam
            audio={false}
            height={300}
            width={300}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            ref={webcamRef}
            style={{ 
              borderRadius: '50%', 
              cursor: 'pointer', 
              transform: 'scaleX(-1)' 
            }}
          />
        ) : (
          <img 
            src={pick} 
            style={{ 
              borderRadius: '50%', 
              cursor: 'pointer', 
              transform: 'scaleX(-1)',
              width: 300,
              height: 300,
              objectFit: 'cover'
            }} 
            alt="Captured" 
          />
        )}
        {!pick ? (
          <button 
            style={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)' }} 
            onClick={capture}
            className="p-4 border-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Capture photo
          </button>
        ) : (
          <button 
            style={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)' }} 
            onClick={retake}
            className="p-4 border-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Tirar novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
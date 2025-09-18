import { CameraAlt, RefreshOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user"
};

const WebcamCapture = ({onCapture}:{onCapture?:(img:string|null)=>void}) => {
  const [pick, setPick] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPick(imageSrc);
      if(onCapture) onCapture(imageSrc)
    }
  };

  const retake = () => {
    setPick(null);
    if(onCapture) onCapture(null)
  };

  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div style={{ position: 'relative', paddingBottom: 20 }}>
        {!pick ? (
          <>
            <Webcam
              audio={false}
              height={400}
              width={400}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              ref={webcamRef}
              style={{
                borderRadius: '50%',
                cursor: 'pointer',
                transform: 'scaleX(-1)',
              }}
            />
            <Box
              sx={{
                width: 400,
                height: 400,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(/personFrame.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                pointerEvents: 'none',
                zIndex: 10,
                borderRadius: '50%',
              }}
            />
          </>
        ) : (
          <img
            src={pick}
            style={{
              borderRadius: '50%',
              cursor: 'pointer',
              transform: 'scaleX(-1)',
              width: 400,
              height: 400,
              objectFit: 'cover'
            }}
            alt="Captured"
          />
        )}
        {!pick ? (
          <IconButton onClick={capture} sx={{ color: 'white', bgcolor: "#1976d2" }} style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', }}>
            <CameraAlt />
          </IconButton>
        ) : (
          <IconButton onClick={retake} sx={{ color: 'white', bgcolor: "#1976d2" }} style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', }}>
            <RefreshOutlined />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
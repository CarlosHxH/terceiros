import { CameraAlt, RefreshOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
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
      <div style={{ position: 'relative', paddingBottom: 20 }}>
        {!pick ? (
          <>
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
                transform: 'scaleX(-1)',
              }}
            />
            <Box
              sx={{
                width: 300,
                height: 300,
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
              width: 300,
              height: 300,
              objectFit: 'cover'
            }}
            alt="Captured"
          />
        )}
        {!pick ? (

          <IconButton onClick={capture} sx={{ color: 'white', bgcolor: "#1976d2" }} style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', }}>
            <CameraAlt />
          </IconButton>
        ) : (
          <IconButton onClick={retake} sx={{ color: 'white', bgcolor: "#1976d2" }} style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', }}>
            <RefreshOutlined />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
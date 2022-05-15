import "../App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "./Webcam";

type CameraProps = {
  onUploadPhoto: (imageSrc: Blob) => void;
  onUploadVideo: (videoSrc: Blob) => void;
  organizer: string;
};

enum Orientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

const getOrientation = () => {
  return window.screen.orientation.type.includes('landscape') ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
}

const calculateCameraSize = () => {
  return getOrientation() === Orientation.LANDSCAPE ? {
    width: { min: 1280 }, 
    height: { min: 720 },
  } : {
    width: { min: 720 }, 
    height: { min: 1280 },
  }
}

function Camera({ onUploadPhoto, onUploadVideo, organizer }: CameraProps) {
  const videoRef = useRef<Webcam & HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder>();
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [photo, setPhoto] = useState<string | null>(null);
  // const [video, setVideo] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<string>("user");
  const [error, setError] = useState<boolean>(false);
  const [capturing, setCapturing] = useState(true);
  const [orientation, setOrientation] = useState<Orientation>(getOrientation());
  const [videoConstraints, setVideoConstraints] = useState({...calculateCameraSize(), facingMode});

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartRecording = useCallback(() => {
    if (!videoRef.current?.stream) { return }
    setRecording(true);
    mediaRecorder.current = new MediaRecorder(videoRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorder.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorder.current.start();
  }, [handleDataAvailable]);

  const handleStopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    setRecording(false);
    setCapturing(false);
    // const blob = new Blob(recordedChunks, {
    //   type: "video/webm"
    // });
    // const url = URL.createObjectURL(blob);
    // setVideo(url)
  }, [recordedChunks]);

  // const handleDownload = useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     //@ts-ignore
  //     a.style = "display: none";
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  useEffect(() => {
    const handleChange = () =>
      {
        discardPhoto();
        const newOrientation = getOrientation();
        setOrientation(newOrientation);
        setVideoConstraints({...calculateCameraSize(), facingMode})
      }
    window.screen.orientation?.addEventListener("change", handleChange, false);

    return function cleanup() {
      window.screen.orientation?.removeEventListener("change", handleChange);
    };
  });

  const capture = useCallback(() => {
    if (!videoRef.current?.stream) return;
    const imageSrc = videoRef.current.getScreenshot();
    setPhoto(imageSrc);
    setCapturing(false);
  }, []);

  const rotateCamera = useCallback(() => {
    facingMode === "user"
      ? setFacingMode("environment")
      : setFacingMode("user");
  },[facingMode]);

  useEffect(() => {
    setVideoConstraints({...calculateCameraSize(), facingMode})
  }, [facingMode])

  const uploadFile = useCallback(() => {
    if (photo) {
      const canvas = videoRef.current?.getCanvas();
      new Promise((resolve) => canvas?.toBlob(resolve)).then(
        (image) => {
          onUploadPhoto(image as Blob);
          setPhoto(null);
          setCapturing(true);
        }
      ).catch((e) => {
        alert("No se ha podido subir la foto, por favor, inténtalo de nuevo")
        console.error(e)
      });
    }
    if(recordedChunks?.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      onUploadVideo(blob);
      // setVideo(null);
      setRecordedChunks([])
    }
  },[onUploadPhoto, onUploadVideo, photo, recordedChunks]);

  const discardPhoto = () => {
    setPhoto(null);
    setCapturing(true);
  };

  const buttons = useMemo(() => {
    if (recording){
      return <button aria-label="recording" className="button" onClick={handleStopRecording}>
        <i className="fa-solid fa-stop"></i>
      </button>
    }

    if (capturing){
      return <>
        <button aria-label="capture" className="button" onClick={capture}>
          <i className="fa-solid fa-camera"></i>
        </button>
        <button aria-label="capture" className="button" onClick={handleStartRecording}>
          <i className="fa-solid fa-video"></i>
        </button>
        <button aria-label="rotate" className="button" onClick={rotateCamera}
        >
          <i className="fa-solid fa-camera-rotate"></i>
        </button>
      </>
    }

    return <>
      <button aria-label="discard" className="button" onClick={discardPhoto}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <button aria-label="submit" className="button" onClick={uploadFile}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </>

  }, [capture, capturing, handleStartRecording, handleStopRecording, recording, rotateCamera, uploadFile])

  const videoSize = getOrientation() === Orientation.LANDSCAPE ? 
  {width: '100%', height: 'auto'} : {height: '100%', width: 'auto'};

  return (
    <section className={`camera ${orientation}`}>
      {<Webcam
        ref={videoRef}
        onUserMediaError={() => setError(true)}
        forceScreenshotSourceSize={true}
        onError={() => setError(true)}
        className="video"
        audio={true}
        mirrored={facingMode === 'user'}
        style={{...videoSize, maxHeight: '100vh', maxWidth: '100vw', display: capturing ? 'inherit' : 'none'}}
        videoConstraints={videoConstraints}
      />}
      {photo && (
        <img
          src={photo}
          alt="user"
          style={{
            width: orientation === Orientation.PORTRAIT ? '100%' : "auto",
            height: orientation === Orientation.PORTRAIT ? "auto": '100%',
            position: 'absolute'
          }}
        ></img>
      )}
      {/* {video && (
        <video src={video}></video>
      )} */}
      <footer className="camera-buttons">
        {buttons}
        {error && (
          <p>
            Para poder continuar tienes que darnos permiso para acceder a tu
            camara, si no sabes hacerlo contacta con {organizer}{" "}
          </p>
        )}
      </footer>
    </section>
  );
}

export default Camera;

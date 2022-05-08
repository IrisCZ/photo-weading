import "../App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "./Webcam";

type CameraProps = {
  onUploadPhoto: (imageSrc: Blob) => void;
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

function Camera({ onUploadPhoto, organizer }: CameraProps) {
  const videoRef = useRef<Webcam & HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<string>("user");
  const [error, setError] = useState<boolean>(false);
  const [capturing, setCapturing] = useState(true);
  const [cameraCapabilities, setCameraCapabilities] = useState<MediaTrackCapabilities>();
  const [orientation, setOrientation] = useState<Orientation>(getOrientation());
  const [videoConstraints, setVideoConstraints] = useState({...calculateCameraSize(), facingMode});

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
    if (!videoRef.current || !cameraCapabilities) return;
    const imageSrc = videoRef.current.getScreenshot();
    setPhoto(imageSrc);
    setCapturing(false);
  }, [cameraCapabilities]);

  const rotateCamara = () => {
    facingMode === "user"
      ? setFacingMode("environment")
      : setFacingMode("user");
  };

  useEffect(() => {
    setVideoConstraints({...calculateCameraSize(), facingMode})
  }, [facingMode])

  const uploadPhoto = () => {
    if (photo) {
      const canvas = videoRef.current?.getCanvas();
      new Promise((resolve) => canvas?.toBlob(resolve)).then(
        (image) => {
          onUploadPhoto(image as Blob);
          setPhoto(null);
          setCapturing(true);
        }
      ).catch((e) => {
        console.log("ERROR", e)
      });
    }
  };

  const discardPhoto = () => {
    setPhoto(null);
    setCapturing(true);
  };

  const videoSize = getOrientation() === Orientation.LANDSCAPE ? 
  {width: '100%', height: 'auto'} : {height: '100%', width: 'auto'};

  return (
    <section className={`camera ${orientation}`}>
      {<Webcam
        ref={videoRef}
        onUserMedia={(stream) => {
          setCameraCapabilities(stream.getVideoTracks()[0].getCapabilities())
        }}
        onUserMediaError={() => setError(true)}
        forceScreenshotSourceSize={true}
        onError={() => setError(true)}
        className="video"
        audio={false}
        mirrored={facingMode === 'user'}
        style={{...videoSize, maxHeight: '100vh', maxWidth: '100vw', display: capturing ? 'inherit' : 'none'}}
        videoConstraints={videoConstraints}
      />}
      {photo && (
        <img
          src={photo || ""}
          alt="user"
          style={{
            width: orientation === Orientation.PORTRAIT ? '100%' : "auto",
            height: orientation === Orientation.PORTRAIT ? "auto": '100%',
            position: 'absolute'
          }}
        ></img>
      )}
      <footer className="camera-buttons">
        {capturing ? <>
            <button hidden={!cameraCapabilities} aria-label="capture" className="button" onClick={capture}>
              <i className="fa-solid fa-camera"></i>
            </button>
            <button hidden={!cameraCapabilities}
              aria-label="rotate"
              className="button"
              onClick={rotateCamara}
            >
              <i className="fa-solid fa-camera-rotate"></i>
            </button>
          </>
         : (
          <>
            <button
              aria-label="discard"
              className="button"
              onClick={discardPhoto}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button
              aria-label="submit"
              className="button"
              onClick={uploadPhoto}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </>
        )}
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

import "./App.css";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useOrientationEvent } from "./useOrientationEvent";

type Props = {
  onUploadPhoto: (imageSrc: Blob) => void;
  organizer: string;
};

function Camera({ onUploadPhoto, organizer }: Props) {
  const videoRef = useRef<Webcam & HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [capturing, setCapturing] = useState(true);
  const [size, setSize] = useState({
    width: window.screen.availWidth,
    height: window.screen.availHeight,
  });

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const imageSrc = videoRef.current.getScreenshot();
    setPhoto(imageSrc);
    setCapturing(false);
  }, [videoRef, setPhoto]);

  const uploadPhoto = () => {
    if (photo){
      const canvas = videoRef.current?.getCanvas();
      new Promise(resolve => canvas?.toBlob(resolve, 'image/jpeg')).then((image) => {
        onUploadPhoto(image as Blob);
        setPhoto(null);
        setCapturing(true);
      })
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setCapturing(true);
  };

  useOrientationEvent("change", () => {
    setSize({
      width: window.screen.availWidth,
      height: window.screen.availHeight,
    });
  });

  const videoConstraints = {
    ...size,
    facingMode: "user",
  };

  return (
    <section className="camera">
       <Webcam
        ref={videoRef}
        screenshotFormat="image/jpeg"
        onUserMediaError={() => setError(true)}
        onError={() => setError(true)}
        className="video"
        audio={false}
        videoConstraints={videoConstraints}
        />
      {photo && <img src={photo || ""} alt="hola" style={{position: 'absolute'}}></img> } 
      <div className="camera-buttons">
        {capturing ? (
          <button id="snap" className="button" onClick={capture}>
            <i className="fa-solid fa-camera"></i>
          </button>
        ) : (
          <>
            <button id="delete" className="button" onClick={removePhoto}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button id="send" className="button" onClick={uploadPhoto}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </>
        )}
        {error && <p>Para poder continuar tienes que darnoss permiso para acceder a tu camara, si no sabes hacerlo contacta con {organizer} </p>}
      </div>
    </section>
  );
}

export default Camera;

import "../App.css";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useOrientationEvent } from "../useOrientationEvent";

type CameraProps = {
  onUploadPhoto: (imageSrc: Blob) => void;
  organizer: string;
};

function Camera({ onUploadPhoto, organizer }: CameraProps) {
  const videoRef = useRef<Webcam & HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<string>("user");
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

  const rotateCamara = () => {
    facingMode === "user"
      ? setFacingMode("environment")
      : setFacingMode("user");
    console.log({ facingMode });
  };

  const uploadPhoto = () => {
    if (photo) {
      const canvas = videoRef.current?.getCanvas();
      new Promise((resolve) => canvas?.toBlob(resolve, "image/jpeg")).then(
        (image) => {
          onUploadPhoto(image as Blob);
          setPhoto(null);
          setCapturing(true);
        }
      );
    }
  };

  const discardPhoto = () => {
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
    facingMode,
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
      {photo && (
        <img
          src={photo || ""}
          alt="hola"
          style={{ position: "absolute" }}
        ></img>
      )}
      <div className="camera-buttons">
        {capturing ? (
          <>
            <button aria-label="capture" className="button" onClick={capture}>
              <i className="fa-solid fa-camera"></i>
            </button>
            <button
              aria-label="rotate"
              className="button"
              onClick={rotateCamara}
            >
              <i className="fa-solid fa-camera-rotate"></i>
            </button>
          </>
        ) : (
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
      </div>
    </section>
  );
}

export default Camera;

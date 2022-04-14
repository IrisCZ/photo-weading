import "../App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

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
  const [cameraSize, setCameraSize] = useState<{
    width: number;
    height: number;
  }>();
  const [size, setSize] = useState({
    width: window.screen.availWidth,
    height: window.screen.availHeight,
  });

  useEffect(() => {
    const handleChange = () =>
      setSize({ width: size.height, height: size.width });

    window.screen.orientation?.addEventListener("change", handleChange, false);

    return function cleanup() {
      window.screen.orientation?.removeEventListener("change", handleChange);
    };
  });

  const capture = useCallback(() => {
    if (!videoRef.current || !cameraSize) return;
    const imageSrc = videoRef.current.getScreenshot({
      height: cameraSize.height,
      width: cameraSize.width,
    });
    setPhoto(imageSrc);
    setCapturing(false);
  }, [cameraSize]);

  const rotateCamara = () => {
    facingMode === "user"
      ? setFacingMode("environment")
      : setFacingMode("user");
  };

  const uploadPhoto = () => {
    if (photo) {
      const canvas = videoRef.current?.getCanvas();
      new Promise((resolve) => canvas?.toBlob(resolve, "image/jpeg")).then(
        (image) => {
          // console.log({ image });
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
  return (
    <section className="camera">
      <Webcam
        ref={videoRef}
        screenshotFormat="image/jpeg"
        onUserMedia={(stream) => {
          if (!cameraSize) {
            setCameraSize({
              height: stream.getVideoTracks()[0].getCapabilities().height!
                .max as number,
              width: stream.getVideoTracks()[0].getCapabilities().width!
                .max as number,
            });
          }
        }}
        onUserMediaError={() => setError(true)}
        forceScreenshotSourceSize={false}
        onError={() => setError(true)}
        className="video"
        audio={false}
        videoConstraints={{
          ...cameraSize,
          facingMode,
        }}
      />
      {photo && (
        <img
          src={photo || ""}
          alt="user"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        ></img>
      )}
      <footer className="camera-buttons">
        {capturing ? <>
            <button hidden={!cameraSize} aria-label="capture" className="button" onClick={capture}>
              <i className="fa-solid fa-camera"></i>
            </button>
            <button hidden={!cameraSize}
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

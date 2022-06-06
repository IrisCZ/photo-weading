import "../App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type CameraProps = {
  onUploadPhoto: (imageSrc: Blob) => Promise<string>;
  onUploadVideo: (videoSrc: Blob) => Promise<string>;
  organizer: string;
};

function Camera({ onUploadPhoto, onUploadVideo, organizer }: CameraProps) {
  const videoUploadRef = useRef<HTMLInputElement>(null);
  const pictureUploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [picture, setPicture] = useState<string>();
  const [pictureContent, setPictureContent] = useState<Blob | null>();
  const [videoContent, setVideoContent] = useState<Blob | null>();
  const [video, setVideo] = useState<string>();
  const {t} = useTranslation();

  const upload = useCallback(async () => {
    if (pictureContent) {
      setUploading(true);
      const error = await onUploadPhoto(pictureContent);
      setUploading(false);
      URL.revokeObjectURL(picture!);
      setPicture("");
      setPictureContent(null);
      if (!error){
        setUploaded(true);
        setTimeout(() => {
          setUploaded(false);
        }, 5000)
      } else {
        alert(t('errorSendingPhoto'))
      }
    }
    if (videoContent) {
      setUploading(true);
      const error = await onUploadVideo(videoContent);
      setUploading(false);
      URL.revokeObjectURL(video!);
      setVideo("");
      setVideoContent(null);
      if (!error){
        setUploaded(true);
        setTimeout(() => {
          setUploaded(false);
        }, 5000)
      } else {
        alert(t('errorSendingVideo'));
      }
    }
  }, [onUploadPhoto, onUploadVideo, picture, pictureContent, t, video, videoContent]);

  useEffect(() => {
    videoUploadRef.current?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0] as Blob;
      setVideoContent(file);
      setVideo(URL.createObjectURL(file));
    });
    pictureUploadRef.current?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0] as Blob;
      setPictureContent(file);
      setPicture(URL.createObjectURL(file));
    });
  }, [onUploadPhoto, onUploadVideo]);

  const discard = () => {
    setPicture("");
    setPictureContent(null);
    setVideo("");
    setVideoContent(null);
  };

  const buttons = useMemo(() => {
    if (picture || video) {
      return (
        <>
          <button aria-label="discard" className="button" onClick={discard}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button aria-label="submit" className="button" onClick={upload}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </>
      );
    }
    return (
      <>
        <button
          aria-label="capture"
          className="button"
          onClick={() => videoUploadRef.current?.click()}
        >
          <i className="fa-solid fa-video"></i>
        </button>
        <button
          aria-label="capture"
          className="button"
          onClick={() => pictureUploadRef.current?.click()}
        >
          <i className="fa-solid fa-camera"></i>
        </button>
      </>
    );
  }, [picture, t, upload, uploading, video]);

  return (
    <section className={`camera`}>
      <input
        type="file"
        accept="video/*"
        capture={"environment"}
        style={{ display: "none" }}
        ref={videoUploadRef}
      />
      <input
        type="file"
        accept="image/*"
        capture={"environment"}
        style={{ display: "none" }}
        ref={pictureUploadRef}
      />
      {(!picture && !video) && (
        <section className="text-container">
          <p>{t('info1')}</p>
          <p>{t('info2')}</p>
        </section>
      )}
      {picture && (
        <img
          src={picture}
          alt="user"
          style={{
            width: "100%",
            height: "auto",
            position: "absolute",
          }}
        ></img>
      )}
      {video && <video src={video} autoPlay width={"100%"} controls></video>}
      <footer className="camera-buttons">
        {buttons}
        <div className="text-container">
          { uploaded ? <>{t('uploaded')}</> : null }
          { uploading ? <>{t('uploading')}</> : null }
          {!video && !picture && !uploading && !uploaded ? <p>{t('thanksForComing')} 💗</p> : null }
        </div> 
      </footer>
    </section>
  );
}

export default Camera;

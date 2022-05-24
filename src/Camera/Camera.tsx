import "../App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CameraProps = {
  onUploadPhoto: (imageSrc: Blob) => Promise<void>;
  onUploadVideo: (videoSrc: Blob) => Promise<void>;
  organizer: string;
};

function Camera({ onUploadPhoto, onUploadVideo, organizer }: CameraProps) {
  const videoUploadRef = useRef<HTMLInputElement>(null);
  const pictureUploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picture, setPicture] = useState<string>(); 
  const [pictureContent, setPictureContent] = useState<Blob | null>();
  const [videoContent, setVideoContent] = useState<Blob | null>();
  const [video, setVideo] = useState<string>(); 

  const upload = useCallback(async () => {
    if (pictureContent){
      setUploading(true);
      await onUploadPhoto(pictureContent);
      URL.revokeObjectURL(picture!);
      setUploading(false);
      setPicture('');
      setPictureContent(null);
    }
    if (videoContent){
      setUploading(true);
      await onUploadVideo(videoContent);
      setUploading(false);
      URL.revokeObjectURL(video!);
      setVideo('');
      setVideoContent(null);
    }
  },[onUploadPhoto, onUploadVideo, pictureContent, videoContent]);

  useEffect(() => {
    videoUploadRef.current?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;      
      const file = target?.files?.[0] as Blob;
      setVideoContent(file)
      setVideo(URL.createObjectURL(file));
    });
    pictureUploadRef.current?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;      
      const file = target?.files?.[0] as Blob;
      setPictureContent(file)
      setPicture(URL.createObjectURL(file))
    });
  }, [onUploadPhoto, onUploadVideo])

  const discard = () => {
    setPicture('');
    setPictureContent(null)
    setVideo('');
    setVideoContent(null);
  };

  const buttons = useMemo(() => {
    if (uploading){
      return <>Subiendo.....</>
    }
    if (picture || video){
      return <>
           <button aria-label="discard" className="button" onClick={discard}>
             <i className="fa-solid fa-xmark"></i>
           </button>
           <button aria-label="submit" className="button" onClick={upload}>
             <i className="fa-solid fa-paper-plane"></i>
           </button>
         </>
    }
      return <>
        <button aria-label="capture" className="button" onClick={() => pictureUploadRef.current?.click()}>
          <i className="fa-solid fa-camera"></i>
        </button>
        <button aria-label="capture" className="button" onClick={() => videoUploadRef.current?.click()}>
          <i className="fa-solid fa-video"></i>
        </button>
      </>

  }, [picture, upload, uploading, video])

  return (
    <section className={`camera`}>
      <input type="file" accept="video/*" capture={'environment'} style={{display: 'none'}} ref={videoUploadRef}/>
      <input type="file" accept="image/*" capture={'environment'} style={{display: 'none'}} ref={pictureUploadRef}/>
      {picture && (
        <img
          src={picture}
          alt="user"
          style={{
            width: '100%',
            height: "auto",
            position: 'absolute'
          }}
        ></img>
      )}
      {video && (
        <video src={video} autoPlay width={"100%"} controls></video>
      )}
      <footer className="camera-buttons">
        {buttons}
      </footer>
    </section>
  );
}

export default Camera;

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../useLocalStorage";
import Camera from "./Camera";
import Welcome from "./Welcome";

function CameraWrapper() {
  const [name, setName] = useLocalStorage("name", "");
  const {t} = useTranslation();
  const organizer = t('saraandceles');

  const handleSubmit = ({
    name: newName,
  }: {
    name: string;
  }) => {
    setName(newName);
  };

  const newLinkUrl = useCallback((isVideo = false) => encodeURI(`/new-photo-link?name=${name}&isVideo=${isVideo}`), [name])

  const handleUploadPhoto = (photoSrc: Blob) => {
    return fetch(newLinkUrl()).then(async (result) => {
      if (result.ok) {
        const { link: url } = await result.json();
        await fetch(url, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "image/jpeg",
          }),
          body: photoSrc,
        })
          
          .catch((e) => {
            alert(t('errorSendingPhoto'));
            console.error("Error:", e);
          });
      }
    });
  };

  const handleUploadVideo = (videoSrc: Blob) => {
    return fetch(newLinkUrl(true)).then(async (result) => {
      if (result.ok) {
        const { link: url } = await result.json();
        await fetch(url, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "video/webm",
          }),
          body: videoSrc,
        }).catch((e) => {
          alert(t('errorSendingVideo'));
          console.error("Error:", e);
        });
      }
    });
  };

  return name ? (
    <Camera
      onUploadPhoto={handleUploadPhoto}
      onUploadVideo={handleUploadVideo}
      organizer={organizer ? organizer : t('theWeddingOrganizer')}
    />
  ) : (
    <Welcome onSubmitInfo={handleSubmit} organizer={organizer} />
  );
}

export default CameraWrapper;

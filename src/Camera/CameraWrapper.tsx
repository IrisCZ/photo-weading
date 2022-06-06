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

  const handleUploadPhoto = async (photoSrc: Blob): Promise<string> => {
    return fetch(newLinkUrl()).then(async (result) => {
      if (!result.ok){
        return `error: ${result.status}: ${result.statusText}`
      }
      const { link: url } = await result.json();
      return await fetch(url, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "image/jpeg",
        }),
        body: photoSrc,
      }).then(result => {
        if (!result.ok){
          return `error: ${result.status}: ${result.statusText}`
        }
        return "";
      }).catch((e: Error) => {
        alert(`${t('errorSendingPhoto')}: ${e.message}`);
        console.error("Error:", e);
        return e.message;
      });
    }).catch((e: Error) => {
      alert(`${t('errorSendingPhoto')}: ${e.message}`);
      console.error("Error:", e);
      return e.message
    });
  };

  const handleUploadVideo = async (videoSrc: Blob): Promise<string> => {
    return fetch(newLinkUrl(true)).then(async (result) => {
      if (!result.ok){
        return `error: ${result.status}: ${result.statusText}`
      }
      const { link: url } = await result.json();
      return await fetch(url, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "video/webm",
        }),
        body: videoSrc,
      }).then(result => {
        if (!result.ok){
          return `error: ${result.status}: ${result.statusText}`
        }
        return "";
      }).catch((e: Error) => {
        alert(`${t('errorSendingVideo')}: ${e.message}`);
        console.error("Error:", e);
        return e.message;
      });
    }).catch((e:Error) => {
      alert(`${t('errorSendingVideo')}: ${e.message}`);
      return e.message
    });;
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

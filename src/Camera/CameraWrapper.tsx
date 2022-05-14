import { useMemo } from "react";
import { useLocalStorage } from "../useLocalStorage";
import Camera from "./Camera";
import Welcome from "./Welcome";

function CameraWrapper() {
  const organizer = "Sara y Celes";
  const [name, setName] = useLocalStorage("name", "");
  const [email, setEmail] = useLocalStorage("email", "");

  const handleSubmit = ({
    name: newName,
    email: newEmail,
  }: {
    name: string;
    email: string;
  }) => {
    setName(newName);
    setEmail(newEmail);
  };

  const newPhotoLinkUrl = useMemo(() => encodeURI(`/new-photo-link?name=${name}&email=${email}`), [email, name])

  const handleUploadPhoto = (photoSrc: Blob) => {
    fetch(newPhotoLinkUrl).then(async (result) => {
      if (result.ok) {
        const { link: url } = await result.json();
        fetch(url, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "image/jpeg",
          }),
          body: photoSrc,
        })
          
          .catch((e) => {
            alert("No se ha podido enviar la foto");
            console.error("Error:", e);
          });
      }
    });
  };

  return name ? (
    <Camera
      onUploadPhoto={handleUploadPhoto}
      organizer={organizer ? organizer : "el organizador de la boda"}
    />
  ) : (
    <Welcome onSubmitInfo={handleSubmit} organizer={organizer} />
  );
}

export default CameraWrapper;

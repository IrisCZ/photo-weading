import { useLocalStorage } from "../useLocalStorage";
import Camera from "./Camera";
import Welcome from "./Welcome";

function CameraWrapper() {
  const organizer = "Sara y Celes";
  const [name, setName] = useLocalStorage("name", "");
  const [, setEmail] = useLocalStorage("email", "");

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

  const handleUploadPhoto = (photoSrc: Blob) => {
    fetch(`/new-photo-link?name=${name}`).then(async (result) => {
      if (result.ok) {
        const { link: url } = await result.json();
        fetch(url, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "image/jpeg",
          }),
          body: photoSrc,
        })
          .then((response) => {
            if (response.status === 200) {
              console.log("ENVIADO!!!");
            }
          })
          .catch(() => {
            alert("ERROR");
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

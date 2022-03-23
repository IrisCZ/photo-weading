import "./App.css";
import "./images/saveTheDate.jpeg";
import { ReactComponent as Loading } from "./images/spinner-1s-200px.svg";
import Camera from "./Camera";
import Welcome from "./Welcome";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { useEffect, useState } from "react";

function App() {
  const [photoGallery, setPhotoGallery] = useState({
    data: "",
    error: false,
    key: "",
  });
  const [key, setKey] = useLocalStorage("photo-key", "");

  useEffect(() => {
    const interval = setInterval(() => {
      const url = `/next-photo?lastPhoto=${key || ""}`;
      fetch(url)
        .then((result) => result.json())
        .then((newData: { link: string; key: string }) => {
          setPhotoGallery({
            data: newData.link,
            error: false,
            key: newData.key,
          });
          setKey(newData.key);
        })
        .catch(function (error) {
          console.log(error);
          setPhotoGallery({ data: "", error: true, key: "" });
        });
    }, 8000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <main className="App">
      <Router>
        <Routes>
          <Route path="/" element={UserCamera()} />
          <Route path="/gallery" element={Gallery(photoGallery.data)} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;

export const Gallery = (data: string) => (
  <section className="gallery">
    {data ? (
      <img
        className="gallery-image"
        alt="gallery"
        src={data}
        aria-label="gallery-image"
      />
    ) : (
      <Loading title="loader" />
    )}
  </section>
);

export const UserCamera = () => {
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
};

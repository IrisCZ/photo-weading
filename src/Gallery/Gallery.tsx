import { useEffect, useState } from "react";
import { useLocalStorage } from "../useLocalStorage";
import { ReactComponent as Loading } from "../images/spinner-1s-200px.svg";

type GalleryProps = {
  timelapse: number;
};

function Gallery({ timelapse }: GalleryProps) {
  const [key, setKey] = useLocalStorage("photo-key", "");
  const [photoGallery, setPhotoGallery] = useState({
    data: "",
    error: false,
    key,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const url = `/next-photo?lastPhoto=${photoGallery.key || ""}`;
      fetch(url)
        .then((result) => result.json())
        .then(({link, key}: { link: string; key: string }) => {
          console.log({link, key})
          setPhotoGallery({
            data: link,
            error: false,
            key: key,
          });
          setKey(key);
        })
        .catch(function (error) {
          console.log(error);
          setPhotoGallery({ data: "", error: true, key: "" });
        });
    }, timelapse);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <section className="gallery">
      {photoGallery.data ? (
        <img
          className="gallery-image"
          alt="gallery"
          src={photoGallery.data}
          aria-label="gallery-image"
        />
      ) : (
        <Loading title="loader" />
      )}
    </section>
  );
}

export default Gallery;

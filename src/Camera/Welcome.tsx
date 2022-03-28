import "../App.css";
import { useState } from "react";

type WelcomeProps = {
  onSubmitInfo: ({ name, email }: { name: string; email: string }) => void;
  organizer: string;
};

function Welcome({ onSubmitInfo, organizer }: WelcomeProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="welcome">
      <header>
        <p>Bienvenidos a la boda de </p>
        <h1>{organizer}</h1>
      </header>
      <section className="form-container">
        <div className="form-field">
          <label htmlFor="name">
            Dinos tu nombre para que sepamos de quién son las fotos.
          </label>
          <input
            type="text"
            className="form-input"
            value={name}
            id="name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">
            Dinos tu email para que podamos mandarte las fotos dentro de unos
            días. <br /> ¡No seais impacientes!
          </label>
          <input
            type="text"
            className="form-input"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            onSubmitInfo({ name, email });
          }}
          aria-label="submit"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </section>
    </div>
  );
}

export default Welcome;

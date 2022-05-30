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
        <p>¡Hola! Somos </p>
        <h1>{organizer}</h1>
      </header>
      <section className="form-container">
        <h2>¡Bienvenidos a nuestra boda!</h2>
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
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            onSubmitInfo({ name, email });
          }}
          aria-label="submit"
        >
          Enviar
        </button>
      </section>
    </div>
  );
}

export default Welcome;

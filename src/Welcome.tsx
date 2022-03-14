import "./App.css";
import { useState } from "react";

type Props = {
  onSendInfo: ({ name, email }: { name: string; email: string }) => void;
  organizer: string
};

function Welcome({ onSendInfo, organizer }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="welcome">
      <header>
        <p>Bienvenidos a la boda de </p>
        <h1>{organizer}</h1>
      </header>
      <section className="form-container">
        <form action="" method="get">
          <div className="form-field">
            <label htmlFor="name">
              Dinos tu nombre para que sepamos de quién son las fotos.
            </label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={name}
              id="name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">
              Dinos tu email para que podamos mandarte las fotos dentro de unos días. <br /> ¡No seais impacientes!
            </label>
            <input
              type="text"
              className="form-input"
              name="email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            id="snap"
            className="button"
            onClick={() => onSendInfo({ name, email })}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </section>
    </div>
  );
}

export default Welcome;

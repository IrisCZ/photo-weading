import "../App.css";
import { useState } from "react";
import {useTranslation} from 'react-i18next';

type WelcomeProps = {
  onSubmitInfo: ({ name }: { name: string }) => void;
  organizer: string;
};

function Welcome({ onSubmitInfo, organizer }: WelcomeProps) {
  const [name, setName] = useState("");
  const {t} = useTranslation();

  return (
    <div className="welcome">
      <header>
        <p>{t('hi')}</p>
        <h1>{organizer}</h1>
      </header>
      <section className="form-container">
        <h2>{t('welcome')}</h2>
        <div className="form-field">
          <label htmlFor="name">
            {t('tellUsYourName')}
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
            onSubmitInfo({ name });
          }}
          aria-label="submit"
        >
          {t('send')}
        </button>
      </section>
    </div>
  );
}

export default Welcome;

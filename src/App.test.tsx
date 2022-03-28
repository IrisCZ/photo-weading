import { render, screen } from "@testing-library/react";
import { LocalStorageMock } from "./test-helper/localStorageMock";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "./App";

global.localStorage = new LocalStorageMock();

describe("App", () => {
  it.only("shows loader when user is in gallery route", () => {
    const history = createMemoryHistory();
    const route = "/gallery";
    history.push(route);
    render(
      <Router location={route} navigator={history}>
        <App />
      </Router>
    );

    expect(screen.getByTitle("loader")).toBeInTheDocument();
  });
});

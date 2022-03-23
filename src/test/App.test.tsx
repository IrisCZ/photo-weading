import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalStorageMock } from "./localStorageMock";
import { createMemoryHistory } from "history";
import App, { Gallery } from "../App";
import { Route, Router, Routes } from "react-router-dom";

global.localStorage = new LocalStorageMock();

describe("UserCamera", () => {
  Object.defineProperty(HTMLMediaElement.prototype, "muted", {
    set: () => {},
  }); // mutes Webcam Warning: unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.

  beforeEach(() => {
    localStorage.clear();
  });

  it("renders welcome text", () => {
    render(<App />);
    const welcomeElement = screen.getByText(/bienvenidos a/i);

    expect(welcomeElement).toBeInTheDocument();
  });

  it("sets name in local storage", () => {
    render(<App />);
    const name = "Iris";
    const input = screen.getByRole("textbox", { name: /nombre/i });

    userEvent.type(input, name);
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    return waitFor(() => {
      expect(localStorage.getItem("name")).toBe(name);
    });
  });

  it("shows camera when user's name is in local storage", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    render(<App />);

    const cameraButton = screen.getByRole("button", { name: /capture/i });

    return waitFor(() => {
      expect(cameraButton).toBeInTheDocument();
    });
  });

  it("shows discard button when user clicks on camera button", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    render(<App />);

    const cameraButton = screen.getByRole("button", { name: /capture/i });
    userEvent.click(cameraButton);

    const discardButton = screen.getByRole("button", { name: /discard/i });
    return waitFor(() => {
      expect(discardButton).toBeInTheDocument();
    });
  });

  it("shows submit button when user clicks on camera button", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    render(<App />);

    const cameraButton = screen.getByRole("button", { name: /capture/i });
    userEvent.click(cameraButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    return waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("shows camera button when user clicks on submit button", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    render(<App />);

    const cameraButton = screen.getByRole("button", { name: /capture/i });
    userEvent.click(cameraButton);

    const discardButton = screen.getByRole("button", { name: /discard/i });
    userEvent.click(discardButton);

    return waitFor(() => {
      expect(
        screen.getByRole("button", { name: /capture/i })
      ).toBeInTheDocument();
    });
  });

  describe("Gallery", () => {
    it("shows loader when there is not data", () => {
      const history = createMemoryHistory();
      const route = "/gallery";
      history.push(route);
      render(
        <Router location={route} navigator={history}>
          <Routes>
            <Route path={route} element={Gallery("")} />
          </Routes>
        </Router>
      );

      expect(screen.getByTitle("loader")).toBeInTheDocument();
    });

    it("shows the image", () => {
      const history = createMemoryHistory();
      const route = "/gallery";
      history.push(route);
      render(
        <Router location={route} navigator={history}>
          <Routes>
            <Route path={route} element={Gallery("/some-image.jpg")} />
          </Routes>
        </Router>
      );

      expect(
        screen.getByRole("img", { name: "gallery-image" })
      ).toBeInTheDocument();
    });
  });
});

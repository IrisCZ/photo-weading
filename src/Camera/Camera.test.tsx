import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalStorageMock } from "../test-helper/localStorageMock";
import CameraWrapper from "./CameraWrapper";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

global.localStorage = new LocalStorageMock();
// global.window.HTMLMediaElement.prototype._mock = {
//   width: 100,
//   height: 100,
// };

describe("CameraWrapper", () => {
  Object.defineProperty(HTMLMediaElement.prototype, "muted", {
    set: () => {},
  }); // mutes Webcam Warning: unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.

  beforeEach(() => {
    localStorage.clear();
  });

  it("renders welcome text", () => {
    renderCamera();
    const welcomeElement = screen.getByText(/bienvenidos a/i);

    expect(welcomeElement).toBeInTheDocument();
  });

  it("sets name in local storage", () => {
    renderCamera();

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
    renderCamera();

    const cameraButton = screen.getByRole("button", { name: /capture/i });

    return waitFor(() => {
      expect(cameraButton).toBeInTheDocument();
    });
  });

  it("shows discard button when user clicks on camera button", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    renderCamera();

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
    renderCamera();

    const cameraButton = screen.getByRole("button", { name: /capture/i });
    userEvent.click(cameraButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    return waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });

  it.only("shows camera button when user clicks on submit button", () => {
    const name = "Iris";
    localStorage.setItem("name", name);
    renderCamera();

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
});

const renderCamera = () => {
  const history = createMemoryHistory();
  render(
    <Router location={"/"} navigator={history}>
      <CameraWrapper />
    </Router>
  );
};

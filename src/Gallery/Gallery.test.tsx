import { render, screen, waitFor } from "@testing-library/react";
import { LocalStorageMock } from "../test-helper/localStorageMock";
import { createMemoryHistory } from "history";
import Gallery from "./Gallery";
import { Router } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";

global.localStorage = new LocalStorageMock();

describe("Gallery", () => {
  const server = setupServer();

  beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
  afterEach(() => {
    server.resetHandlers();
    window.localStorage.removeItem("token");
  });
  afterAll(() => server.close());

  it("shows loader when there is not data", () => {
    renderGallery();

    expect(screen.getByTitle("loader")).toBeInTheDocument();
  });

  it("shows the image", () => {
    const key = "123";
    server.use(
      rest.get(`/next-photo`, (req, res, ctx) => {
        return res(
          ctx.json({
            link: "image-link",
            key,
          })
        );
      })
    );
    renderGallery();

    return waitFor(() => {
      const image: HTMLImageElement = screen.getByRole("img", {
        name: "gallery-image",
      });
      expect(image.src).toContain("image-link");
    });
  });
});

const renderGallery = () => {
  const history = createMemoryHistory();
  const route = "/gallery";
  history.push(route);

  render(
    <Router location={route} navigator={history}>
      <Gallery timelapse={25} />
    </Router>
  );
};

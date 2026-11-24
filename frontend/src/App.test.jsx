import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import App from "./App";
import { store } from "./store";

afterEach(cleanup);

const renderAt = (path) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

test("home page renders the hero and guest navigation", () => {
  renderAt("/");
  expect(screen.getByText(/share your travel diaries with us/i)).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /login/i })).toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: /profile/i })).not.toBeInTheDocument();
});

test("guests are redirected from protected pages to login", () => {
  renderAt("/add");
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});

test("unknown routes show a not found page", () => {
  renderAt("/does-not-exist");
  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
});

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import AppRouter from "./components/AppRouter";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App";
import * as api from "./api-helpers/helpers";
import { authActions, store } from "./store";

vi.mock("./api-helpers/helpers");

const user = { id: "u1", name: "Anna" };
const post = {
  _id: "p1",
  title: "Lisbon",
  description: "Tram 28",
  image: "https://example.com/lisbon.jpg",
  location: "Portugal",
  date: "2024-05-01T00:00:00.000Z",
  user: { _id: "u1", name: "Anna" },
};

const renderAt = (path) => {
  window.history.pushState({}, "", path);
  return render(
    <AppRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </AppRouter>
  );
};
const login = () => store.dispatch(authActions.login({ token: "t", user }));

beforeEach(() => {
  api.getAllPosts.mockResolvedValue({ posts: [post] });
  api.getPostDetails.mockResolvedValue({ post });
  api.getUserDetails.mockResolvedValue({
    user: { _id: "u1", name: "Anna", email: "anna@test.com", posts: [post] },
  });
});

afterEach(() => {
  cleanup();
  act(() => {
    store.dispatch(authActions.logout());
  });
  vi.resetAllMocks();
});

test("logout from the profile leads to the home page", async () => {
  login();
  renderAt("/profile");
  fireEvent.click(await screen.findByRole("button", { name: /logout/i }));
  expect(await screen.findByText(/share your travel diaries with us/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe("/");
});

test("login returns the user to the page they were sent from", async () => {
  api.sendAuthRequest.mockResolvedValue({ token: "t", user });
  renderAt("/add");
  expect(window.location.pathname).toBe("/auth");
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "anna@test.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret1" } });
  fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
  expect(await screen.findByText(/add your travel diary/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe("/add");
});

test("adding a diary leads to the list", async () => {
  api.addPost.mockResolvedValue({ post });
  login();
  renderAt("/add");
  const fill = (label, value) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fill(/title/i, "Lisbon");
  fill(/description/i, "Tram 28");
  fill(/image url/i, post.image);
  fill(/location/i, "Portugal");
  fill(/date/i, "2024-05-01");
  fireEvent.click(screen.getByRole("button", { name: /post/i }));
  expect(await screen.findByLabelText(/edit diary/i)).toBeInTheDocument();
  expect(api.addPost).toHaveBeenCalledTimes(1);
  expect(window.location.pathname).toBe("/diaries");
});

test("editing a diary from the list saves it and leads to the profile", async () => {
  api.postUpdate.mockResolvedValue({ post });
  login();
  renderAt("/diaries");
  fireEvent.click(await screen.findByLabelText(/edit diary/i));
  expect(await screen.findByDisplayValue("Lisbon")).toBeInTheDocument();
  expect(window.location.pathname).toBe("/post/p1");
  fireEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(await screen.findByText(/user profile/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe("/profile");
});

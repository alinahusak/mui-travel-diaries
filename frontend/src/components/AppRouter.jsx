import { BrowserRouter } from "react-router";

// useTransitions={false}: navigation must not render later than Redux updates.
// Otherwise logout re-renders ProtectedRoute first, and it redirects to /auth
// instead of the page that logout navigates to.
const AppRouter = ({ children }) => (
  <BrowserRouter useTransitions={false}>{children}</BrowserRouter>
);

export default AppRouter;

import { Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/topbar";
import { authenticate } from "~/helpers/authenticate.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticate(request);
  return user;
};

const TopBarLayout = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData;
  return (
    <>
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <Nav>
          <NavLink
            to="/"
            className="fw-bold text-muted nav-link"
            data-rr-ui-event-key="link"
          >
            Posts
          </NavLink>
        </Nav>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <Nav>
              <NavLink
                className="nav-link"
                data-rr-ui-event-key="link"
                to="/posts/create"
              >
                Create
              </NavLink>
            </Nav>
          ) : (
            <Nav>
              <NavLink
                className="nav-link"
                data-rr-ui-event-key="link"
                to="/login"
              >
                Login
              </NavLink>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};

export default TopBarLayout;

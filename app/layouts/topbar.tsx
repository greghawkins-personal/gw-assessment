import { Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router";

const TopBarLayout = () => {
  return (
    <>
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <Nav>
          <NavLink to="/" className="fw-bold text-muted">
            Scratch
          </NavLink>
        </Nav>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavLink to="/signup">Signup</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/posts/create">Create</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};

export default TopBarLayout;

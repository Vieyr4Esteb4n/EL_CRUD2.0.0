import React from "react";
import { Menu, Container, Button, Image } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../asset/blockbuster.gif";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Menu
      inverted
      borderless
      style={{ padding: "0.3rem", marginBottom: "20px" }}
      attached
    >
      <Container>
        <Menu.Item name="home">
          <Link to="/">
            <Image size="small" src={logo} alt="logo" />
          </Link>
        </Menu.Item>
        <Menu.Item>
          <h2>BLOCKBUSTER</h2>
        </Menu.Item>
        <Menu.Item position="right">
          <Button size="mini" primary onClick={() => navigate("/add")}>
            Add Movie
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
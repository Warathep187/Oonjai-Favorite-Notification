import React, { Component } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import Link from "next/link";

export default class UnauthorizedNav extends Component {
    render() {
        return (
            <Navbar>
                <Container>
                    <Navbar.Brand style={{fontFamily: "Dancing Script", fontSize: "35px"}}>Oonjai</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Item>
                            <Link style={{textDecoration: "none", color: "lightgray"}} href="/signin">ลงชื่อเข้าใช้</Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

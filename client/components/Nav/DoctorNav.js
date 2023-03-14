import React, { Component } from "react";
import { Nav, Navbar, Container, Badge } from "react-bootstrap";
import Link from "next/link";
import { logout } from "../../services/logout";
import { withRouter } from "next/router";

export default withRouter(
    class DoctorNav extends Component {
        render() {
            return (
                <Navbar>
                    <Container>
                        <Navbar.Brand style={{fontFamily: "Dancing Script", fontSize: "35px"}}>Oonjai</Navbar.Brand>
                        <Nav className="ms-auto">
                            <Nav.Item className="me-3">
                                <Link style={{ textDecoration: "none" }} href="/attention">
                                    <div style={{ display: "inline" }}>
                                        <img
                                            style={{ width: "28px", marginRight: "5px" }}
                                            src="/profile_images/doctor.png"
                                        />
                                        <span style={{ color: "lightgray" }}>{this.props.user.name}</span>
                                    </div>
                                </Link>
                            </Nav.Item>
                            <Nav.Item className="me-3">
                                <Link style={{ textDecoration: "none", color: "lightgray" }} href="/blogs/create">
                                    สร้างบล็อค
                                </Link>
                            </Nav.Item>
                            <Nav.Item className="me-3">
                                <Link style={{ textDecoration: "none", color: "lightgray" }} href="/notifications">
                                    การแจ้งเตือน
                                    {this.props.user.unreadNotification > 0 && <Badge pill bg="danger" className="ms-1">{this.props.user.unreadNotification}</Badge>}
                                </Link>
                            </Nav.Item>
                            <Nav.Item style={{ color: "lightgray", cursor: "pointer" }} onClick={() => logout(this.props.router, this.props.onRemoveProfile)}>
                                ออกจากระบบ
                            </Nav.Item>
                        </Nav>
                    </Container>
                </Navbar>
            );
        }
    }
);

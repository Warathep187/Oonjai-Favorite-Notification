import React, { Component } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { profileActions } from "../store/store";
import Cookies from "js-cookie";
import { withRouter } from "next/router";
import {toast} from "react-toastify"

export default connect(null, { setInitialProfile: profileActions.setInitialProfile })(
    withRouter(
        class SignInPage extends Component {
            state = {
                email: "",
                password: "",
            };

            dataChangeHandler = (e) => {
                const { name, value } = e.target;
                this.setState((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            };

            signInHandler = async (e) => {
                e.preventDefault();
                try {
                    const { data } = await axios.post("http://localhost:8000/api/auth/signin", this.state);
                    Cookies.set("token", data.token);
                    this.props.setInitialProfile(data);
                    this.setState((prev) => ({ email: "", password: "" }));
                    this.props.router.push("/attention")
                } catch (e) {
                    toast.error(e.response.data.message);
                }
            };

            render() {
                return (
                    <Container>
                        <div style={{width: "40%"}} className="mt-4 border py-4 px-5 mx-auto rounded-2">
                            <h2>ลงชื่อเข้าใช้</h2>
                            <hr />
                            <Form onSubmit={this.signInHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label>อีเมล</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.dataChangeHandler}
                                        name="email"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>รหัสผ่าน</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.dataChangeHandler}
                                        name="password"
                                    />
                                </Form.Group>
                                <div className="text-end">
                                    <Button type="submit" className="px-3 py-2 mt-1" variant="primary">
                                        ลงชื่อเข้าใช้
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Container>
                );
            }
        }
    )
);

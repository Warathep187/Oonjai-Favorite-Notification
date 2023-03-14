import axios from "axios";
import { withRouter } from "next/router";
import React, { Component } from "react";
import { Badge, Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

export default withRouter(
    class QuestionPage extends Component {
        state = {
            id: "",
            title: "",
            content: "",
            topic: "",
            created_at: new Date(),
            name: "",
            url: "",
        };

        fetchBlogHandler = async (titleSlug) => {
            if (titleSlug) {
                try {
                    const { data } = await axios.get(`http://localhost:8000/api/questions/${titleSlug}`);
                    this.setState((prev) => data.question);
                } catch (e) {
                    toast.error(e.response.data.message);
                }
            }
        };

        componentDidMount() {
            console.log(this.props.router.query.titleSlug);
            this.fetchBlogHandler(this.props.router.query.titleSlug);
        }

        render() {
            return (
                <Container>
                    <div className="w-75 mt-2 p-4 border rounded-3 mx-auto">
                        <h3>{this.state.title}</h3>
                        <p>{this.state.content}</p>
                        <Badge bg="success">{this.state.topic.topic}</Badge>
                        <hr />
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div>
                                    <img
                                        src={this.state.url}
                                        style={{
                                            borderRadius: "50%",
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                        }}
                                        alt="Image Not found"
                                    />
                                </div>
                                <p className="mt-3 ms-2 fw-bold text-muted">{this.state.name}</p>
                            </div>
                            <div className="mt-3">
                                <p className="text-muted">{moment(this.state.created_at).format("DD/MM/yyyy hh:mm")}</p>
                            </div>
                        </div>
                        <div className="mt-3 mx-auto w-50 text-end">
                            <Form.Control as="textarea" style={{height: "100px"}} placeholder="กรอกคำตอบ..." />
                            <Button variant="primary" className="mt-2" onClick={() => toast("ตอบคำถามแล้ว")}>ตอบคำถาม</Button>
                        </div>
                    </div>
                </Container>
            );
        }
    }
);

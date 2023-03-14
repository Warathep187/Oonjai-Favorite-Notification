import axios from "axios";
import Cookies from "js-cookie";
import { withRouter } from "next/router";
import React, { Component } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default withRouter(
    class CreateQuestionPage extends Component {
        state = {
            title: "",
            content: "",
            selectedTopic: null,
            topics: [],
        };

        titleChangeHandler = (e) => {
            this.setState((prev) => ({ ...prev, title: e.target.value }));
        };

        contentChangeHandler = (e) => {
            this.setState((prev) => ({ ...prev, content: e.target.value }));
        };

        topicChangeHandler = (e) => {
            this.setState((prev) => ({ ...prev, selectedTopic: e.target.value }));
        };

        submitHandler = async (e) => {
            e.preventDefault();
            try {
                await axios.post(
                    "http://localhost:8000/api/questions/create",
                    { title: this.state.title, content: this.state.content, topicId: this.state.selectedTopic },
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`,
                        },
                    }
                );
                toast("คำถามถูกถามแล้ว");
                this.setState((prev) => ({ ...prev, title: "", content: "", selectedTopic: null }));
            } catch (e) {
                toast.error(e.response.data.message);
            }
        };

        fetchTopicsHandler = async () => {
            try {
                const { data } = await axios.get("http://localhost:8000/api/topics");
                this.setState((prev) => ({ ...prev, topics: data.topics }));
            } catch (e) {
                console.log(e);
            }
        };

        componentDidMount() {
            this.fetchTopicsHandler();
        }

        render() {
            return (
                <Container>
                    <div className="w-50 mt-4 border p-4 mx-auto">
                        <h2>ถามคำถาม</h2>
                        <Form onSubmit={this.submitHandler}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={this.titleChangeHandler}
                                    value={this.state.title}
                                    placeholder="Enter title"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>รายละเอียดเพิ่มเติม</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    style={{ height: "100px" }}
                                    onChange={this.contentChangeHandler}
                                    value={this.state.content}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Topic</Form.Label>
                                <Form.Select onChange={this.topicChangeHandler}>
                                    <option value={null} selected={this.state.selectedTopic === null}>
                                        เลือก Topic ที่เกี่ยวข้อง
                                    </option>
                                    {this.state.topics.map((topic) => (
                                        <option key={topic.id} value={topic.id}>
                                            {topic.topic}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <div className="-w100 text-end">
                                <Button type="submit" variant="primary" className="px-4">
                                    สร้าง
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Container>
            );
        }
    }
);

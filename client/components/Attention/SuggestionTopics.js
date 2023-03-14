import axios from "axios";
import Cookies from "js-cookie";
import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";

export default class SuggestionTopics extends Component {
    state = {
        topics: [],
    };

    removeTopicHandler = (id) => {
        this.setState((prev) => ({ topics: prev.topics.filter((topic) => topic.id !== id) }));
    };

    fetchUnsubscribedTopicHandler = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/attentions/suggestions", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
            this.setState((prev) => ({ topics: data.topics }));
        } catch (e) {
            console.log(e);
        }
    };

    componentDidMount() {
        this.fetchUnsubscribedTopicHandler();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isRemoved !== prevProps.isRemoved) {
            this.fetchUnsubscribedTopicHandler()
        }
    }

    render() {
        return (
            <div>
                <ListGroup variant="flush">
                    {this.state.topics.map((topic) => (
                        <ListGroup.Item key={topic.id} className="d-flex align-items-center justify-content-between">
                            <span>{topic.topic}</span>
                            <PlusCircle
                                style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
                                onClick={() => {
                                    this.removeTopicHandler(topic.id);
                                    this.props.onAddNewTopicHandler(topic.id);
                                }}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        );
    }
}

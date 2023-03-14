import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import { XCircle } from "react-bootstrap-icons";

export default class AttentionList extends Component {
    render() {
        return (
            <div>
                <ListGroup variant="flush">
                    {this.props.topics.map((topic) => (
                        <ListGroup.Item key={topic.attention_id} className="d-flex align-items-center justify-content-between">
                            <span>{topic.topic}</span>
                            <XCircle
                                style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
                                onClick={() => this.props.onRemoveTopicHandler(topic.attention_id)}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        );
    }
}

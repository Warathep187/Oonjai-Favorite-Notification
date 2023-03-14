import React, { Component } from "react";
import { Container, Form } from "react-bootstrap";
import AttentionList from "../components/Attention/AttentionList";
import SuggestionTopics from "../components/Attention/SuggestionTopics";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { connect } from "react-redux";

class AttentionListPage extends Component {
    state = {
        topics: [],
        isRemoved: false,
        turnOnNotification: false,
    };

    addNewTopicHandler = async (topicId) => {
        try {
            const { data } = await axios.put(
                "http://localhost:8000/api/attentions/add",
                {
                    topicId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
            this.setState((prev) => ({ ...prev, topics: [...prev.topics, data.attentionItem] }));
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    removeTopicHandler = async (attentionId) => {
        try {
            await axios.put(
                "http://localhost:8000/api/attentions/remove",
                {
                    attentionId: attentionId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
            this.setState((prev) => ({
                isRemoved: !prev.isRemoved,
                topics: prev.topics.filter((topic) => topic.attention_id !== attentionId),
            }));
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    switchNotifySettingHandler = async () => {
        if (this.state.turnOnNotification) {
            try {
                await axios.put("http://localhost:8000/api/notifications/turnOff", null, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                toast("การแจ้งเตือนถูกปิดแล้ว");
            } catch (e) {
                toast.error(e.response.data.message);
            }
        } else {
            try {
                await axios.put("http://localhost:8000/api/notifications/turnOn", null, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                toast("การแจ้งเตือนถูกเปิดแล้ว");
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
        this.setState((prev) => ({ ...prev, turnOnNotification: !prev.turnOnNotification }));
    };

    fetchInterestedTopicsHandler = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/attentions", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
            this.setState((prev) => ({
                ...prev,
                topics: data.attentionList,
                turnOnNotification: data.turnOnNotification,
            }));
        } catch (e) {
            console.log(e);
        }
    };

    componentDidMount() {
        this.fetchInterestedTopicsHandler();
    }

    render() {
        return (
            <Container>
                <div className="w-100 mt-2">
                    <div className="w-100 mt-3">
                        <div className="w-50 mx-auto text-start">
                            <h1>Attention List Management</h1>
                            <hr />
                        </div>
                        <div className="d-flex justify-content-around mx-auto w-50">
                            <div className="border rounded-2 p-4">
                                <h4>Your attention list</h4>
                                <div>
                                    <AttentionList
                                        topics={this.state.topics}
                                        onRemoveTopicHandler={this.removeTopicHandler}
                                    />
                                </div>
                            </div>
                            <div className="border rounded-2 p-4">
                                <h4>Unsubscribed topics</h4>
                                <div>
                                    <SuggestionTopics
                                        onAddNewTopicHandler={this.addNewTopicHandler}
                                        isRemoved={this.state.isRemoved}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.props.role === "PATIENT" && (
                        <div className="w-50 mx-auto mt-5">
                            <p className="fs-5">เปิด-ปิด การแจ้งเตือนการสร้างบล็อค</p>
                            <Form.Check
                            className="mt-0"
                                type="switch"
                                id="custom-switch"
                                onChange={this.switchNotifySettingHandler}
                                checked={this.state.turnOnNotification}
                                label={
                                    <span className="text-muted">
                                        {this.state.turnOnNotification
                                            ? "การแจ้งเตือนบล็อคถูกเปิด"
                                            : "การแจ้งเตือนบล็อคถูกปิด"}
                                    </span>
                                }
                            />
                        </div>
                    )}
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.profileSlice.role,
    };
};

export default connect(mapStateToProps, null)(AttentionListPage);

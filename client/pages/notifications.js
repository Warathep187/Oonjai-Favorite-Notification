import React, { Component } from "react";
import { Container } from "react-bootstrap";
import NewBlogNotification from "../components/Notifications/NewBlogNotification";
import NewQuestionNotification from "../components/Notifications/NewQuestionNotification";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { profileActions } from "../store/store";

export default connect(null, { readNotification: profileActions.readNotification })(
    class NotificationPage extends Component {
        state = {
            notifications: [],
        };

        fetchNotifications = async () => {
            try {
                const { data } = await axios.get("http://localhost:8000/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                this.setState((prev) => ({ notifications: data.notifications }));
                this.props.readNotification();
            } catch (e) {
                console.log(e);
            }
        };

        componentDidMount() {
            this.fetchNotifications();
        }

        render() {
            return (
                <Container>
                    <div className="w-50 mt-4 border p-4 mx-auto">
                        <h2>การแจ้งเตือน</h2>
                        <div>
                            {this.state.notifications.map((notification) => {
                                if (notification.type === "BLOG") {
                                    return <NewBlogNotification key={notification.id} notification={notification} />;
                                } else if (notification.type === "QUESTION") {
                                    return (
                                        <NewQuestionNotification key={notification.id} notification={notification} />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </Container>
            );
        }
    }
);

import React, { Component } from "react";
import Link from "next/link";
import moment from "moment"

export default class NewQuestionNotification extends Component {
    render() {
        const notification = this.props.notification;

        return (
            <div className="border rounded-2 p-2 w-100 mt-2">
                <div className="d-flex align-items-center">
                    <img src="/icons/bell-question.png" style={{ width: "32px" }} />
                    <Link href={`/questions/${notification.question_title_slug}`} style={{color: "black"}}>
                        <span className="ms-1">มีการถามคำถามใหม่ในหัวข้อที่คุณสนใจ เข้าไปตอบสิ</span>
                    </Link>
                </div>
                <div className="text-end">
                    <span className="text-muted ms-auto">{moment(notification.created_at).fromNow()}</span>
                </div>
            </div>
        );
    }
}

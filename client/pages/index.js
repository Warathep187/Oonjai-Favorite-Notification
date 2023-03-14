import React, { Component } from "react";
import { HeartFill } from "react-bootstrap-icons";

export default class index extends Component {
    render() {
        return (
            <div className="text-center">
                <p className="mt-4 fs-4">
                    ยินดีต้อนรับสู่เว็บไซต์ของเรา, อุ่นใจ
                    <HeartFill style={{ fontSize: "18px", color: "red" }} />
                </p>
            </div>
        );
    }
}

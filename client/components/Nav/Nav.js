import React, { Component } from "react";
import UnauthorizedNav from "./UnauthorizedNav";
import GeneralUserNav from "./GeneralUserNav";
import DoctorNav from "./DoctorNav";
import { connect } from "react-redux";
import { profileActions } from "../../store/store";
import Cookies from "js-cookie";
import axios from "axios";

class Nav extends Component {
    state = {
        user: {
            id: "",
            name: "",
            role: "",
            unreadNotification: 0,
        },
    };

    fetchUserProfileHandler = async () => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const { data } = await axios.get("http://localhost:8000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.setState((prev) => ({ user: data.user }));
                this.props.setInitialProfile(data.user)
            } catch (e) {
                console.log(e);
            }
        }
    };

    componentDidMount() {
        this.fetchUserProfileHandler();
    }

    render() {
        if (this.props.role === "DOCTOR") {
            return <DoctorNav onRemoveProfile={this.props.removeProfile} user={{name: this.props.name, unreadNotification: this.props.unreadNotification}} />;
        } else if (this.props.role === "PATIENT") {
            return <GeneralUserNav onRemoveProfile={this.props.removeProfile} user={{name: this.props.name, unreadNotification: this.props.unreadNotification}} />;
        } else {
            return <UnauthorizedNav />;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.profileSlice.name,
        role: state.profileSlice.role,
        unreadNotification: state.profileSlice.unreadNotification
    };
};

export default connect(mapStateToProps, { removeProfile: profileActions.removeProfile, setInitialProfile: profileActions.setInitialProfile })(Nav);

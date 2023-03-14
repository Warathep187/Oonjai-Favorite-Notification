const profileReducers = {
    setInitialProfile: (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.role = action.payload.role;
        state.unreadNotification = action.payload.unreadNotification;
    },
    readNotification: (state, action) => {
        state.unreadNotification = 0;
    },
    removeProfile: (state, action) => {
        state.id = null;
        state.name = null;
        state.role = null;
        state.unreadNotification = 0;
    }
};

export default profileReducers;

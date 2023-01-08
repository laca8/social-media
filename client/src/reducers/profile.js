import { CLEAR_PROFILE, GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, GET_REPOSE } from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repose: [],
    loading: true,
    error: {}
}
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repose: [],
                loading: false
            }
        case GET_REPOSE:
            return {
                ...state,
                repose: payload,
                loading: false
            }
        default:
            return state;
    }
}
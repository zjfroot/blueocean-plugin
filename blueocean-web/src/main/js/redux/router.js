import keymirror from 'keymirror';
import Immutable from 'immutable';

const { Record } = Immutable;

// TODO: maybe put progress somewhere else
export const routerState = Record({
    current: null,
    previous: null,
    progress: 0,
});

export const ACTION_TYPES = keymirror({
    CLEAR_LOCATION_DATA: null,
    SET_LOCATION_CURRENT: null,
    SET_LOCATION_PREVIOUS: null,
    TICK_PROGRESS: null,
    UNTICK_PROGRESS: null,
});

export const actionHandlers = {
    [ACTION_TYPES.CLEAR_LOCATION_DATA](state) {
        return state.set('location', null);
    },
    [ACTION_TYPES.SET_LOCATION_CURRENT](state, { payload }): routerState {
        return state.set('current', payload);
    },
    [ACTION_TYPES.SET_LOCATION_PREVIOUS](state, { payload }): routerState {
        return state.set('previous', payload);
    },
    [ACTION_TYPES.TICK_PROGRESS](state): routerState {
        return state.set('progress', state.progress + 1);
    },
    [ACTION_TYPES.UNTICK_PROGRESS](state): routerState {
        return state.set('progress', state.progress - 1);
    },
};

export const actions = {
    clearLocationData() {
        return (dispatch) => dispatch({type: ACTION_TYPES.CLEAR_PIPELINE_DATA});
    },
    setCurrentLocation(newLocation){
        return (dispatch, getState) => {
            const lastLocation = getState().location.current;
            if (lastLocation) {
                dispatch({
                    type: ACTION_TYPES.SET_LOCATION_PREVIOUS,
                    payload: lastLocation,
                });

            }
            return dispatch({
                type: ACTION_TYPES.SET_LOCATION_CURRENT,
                payload: newLocation,
            });

        };
    }
};

// reducer
export const location = (state) => state.location;

export function reducer(state = new routerState(), action:Object):routerState {
    const { type } = action;
    if (type in actionHandlers) {
        return actionHandlers[type](state, action);
    }
    return state;
}

export default {location: reducer};

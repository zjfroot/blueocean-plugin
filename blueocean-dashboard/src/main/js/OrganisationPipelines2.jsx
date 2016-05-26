import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import fetch from 'isomorphic-fetch';
import { ACTION_TYPES } from './PipelineStore2';
import { ErrorResult } from './Result';

const fetchOptions = { credentials: 'same-origin' };
function checkStatus(response) {
    if (response.status >= 300 || response.status < 200) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
    return response;
}

function parseJSON(response) {
    return response.json();
}

const actions = {
    clearPipelinesData: () => ({ type: ACTION_TYPES.CLEAR_PIPELINES_DATA2 }),

    fetchPipelinesIfNeeded(config, flag) {
        return (dispatch, getState) => {
            const pipelines = getState().testStore.pipelines;
            let url = `${config.getAppURLBase()}` +
                '/rest/organizations/jenkins/pipelines/';

            if (flag === 'error') {
                url += 'force-error';
            }

            if (!pipelines || !pipelines.length) {
                return dispatch(actions.generateData(
                    url,
                    ACTION_TYPES.SET_PIPELINES_DATA2
                ));
            }
            return pipelines;
        };
    },

    generateData(url, actionType, optional) {

        return (dispatch) => {
            dispatch({
                type: ACTION_TYPES.TICK_PROGRESS,
            });

            fetch(url, fetchOptions)
                .then((response) => {
                    dispatch({
                        type: ACTION_TYPES.UNTICK_PROGRESS,
                    });
                    return response;
                })
                .then(checkStatus)
                .then(parseJSON)
                .then(json => dispatch({
                    ...optional,
                    type: actionType,
                    payload: json,
                }))
                .catch((error) => {
                    const result = new ErrorResult(error);
                    dispatch({
                        ...optional,
                        payload: result,
                        type: actionType,
                    });
                });
        };
    },
};

const testStore = state => state.testStore;
const locationState = (state) => state.location;
export const previous = createSelector([locationState], store => store.previous);
export const current = createSelector([locationState], store => store.current);
export const pipelinesSelector = createSelector([testStore], store => store.pipelines);
export const requestsSelector = createSelector([testStore], store => store.requestsPending);


class OrganisationPipelines2 extends Component {

    getChildContext() {
        const {
            params,
            location,
            pipelines,
        } = this.props;

        // The specific pipeline we may be focused on
        let pipeline;

        if (pipelines && params && params.pipeline) {
            const name = params.pipeline;
            pipeline = pipelines.find(aPipeLine => aPipeLine.name === name);
        }

        return {
            pipelines,
            pipeline,
            params,
            location,
        };
    }

    componentWillMount() {
        if (this.context.config) {
            setTimeout(() => {
                return this.props.fetchPipelinesIfNeeded(this.context.config, this.props.params.flag)
            }, 5000);
        }
    }

    render() {
        return this.props.children; // Set by router
    }
}

OrganisationPipelines2.contextTypes = {
    router: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    store: PropTypes.object,
};

OrganisationPipelines2.propTypes = {
    fetchPipelinesIfNeeded: PropTypes.func.isRequired,
    params: PropTypes.object, // From react-router
    children: PropTypes.node, // From react-router
    location: PropTypes.object, // From react-router
    pipelines: PropTypes.array,
    requestsPending: PropTypes.number,
};

OrganisationPipelines2.childContextTypes = {
    pipelines: PropTypes.array,
    pipeline: PropTypes.object,
    params: PropTypes.object, // From react-router
    location: PropTypes.object, // From react-router
};

const selectors = createSelector([pipelinesSelector, requestsSelector], (pipelines, requestsPending) => ({ pipelines, requestsPending }));

export default connect(selectors, actions)(OrganisationPipelines2);

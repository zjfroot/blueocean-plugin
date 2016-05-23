import React, { Component, PropTypes } from 'react';
import { Table } from '@jenkins-cd/design-language';

const { bool, node, string } = PropTypes;

/**
 * Used to wrap a number of descendent elements to make them
 * "interstitial-aware"
 */
export class InterstitialContainer extends Component {

    getChildContext() {
        return {
            pending: this.props.pending,
        };
    }

    render() {
        return this.props.children;
    }
}

InterstitialContainer.propTypes = {
    children: node,
    pending: bool,
};

InterstitialContainer.childContextTypes = {
    pending: bool,
};

/**
 * Simple text label that supports a "pending state" when placed inside
 * InterstitialContainer.
 */
export class Label extends Component {
    render() {
        const styles = {};
        let text = this.props.children;

        if (this.context.pending) {
            // create a temporary string composed of unicode boxes that approximates
            // the size of 'tempText'  (or 8 chars if ommitted)
            const tempText = this.props.tempText || 'abcdefgh';
            text = new Array(tempText.length * 0.5).join(String.fromCharCode(9608));
            styles.opacity = 0.75;
        } else {
            delete styles.opacity;
        }

        return (
            <span style={styles}>{text}</span>
        );
    }
}

Label.propTypes = {
    children: string,
    tempText: string,
};

Label.contextTypes = {
    pending: bool,
};

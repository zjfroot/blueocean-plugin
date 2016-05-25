import React, { Component, PropTypes } from 'react';

const { array, bool, node, number, oneOfType, string } = PropTypes;

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
// eslint-disable-next-line
export class Label extends Component {
    render() {
        const styles = {};
        let text = this.props.children;

        if (this.context.pending) {
            // create a temporary string composed of unicode boxes that approximates
            // the size of 'tempText'  (or 8 chars if ommitted)
            const tempText = this.props.tempText || 'abcdefgh';
            text = new Array(tempText.length * 0.5).join(String.fromCharCode(9608));
            styles.opacity = 0.5;
        } else {
            delete styles.opacity;
        }

        return (
            <span style={styles}>{text}</span>
        );
    }
}

Label.propTypes = {
    children: oneOfType([number, string]),
    tempText: string,
};

Label.contextTypes = {
    pending: bool,
};

// eslint-disable-next-line
export class Table extends Component {

    getKey(column) {
        if (typeof column === 'string') {
            return column;
        }
        return column.label;
    }

    getLabel(column) {
        if (typeof column === 'string') {
            return column;
        }
        return column.label;
    }

    getClass(column) {
        if (typeof column === 'string') {
            return null;
        }
        return column.className;
    }

    render() {
        const { headers, children } = this.props;

        return (
            <table className={this.props.className}>
            { headers &&
                <thead>
                    <tr>
                    { headers.map((column) =>
                        <th key={this.getKey(column)} className={this.getClass(column)}>
                            {this.getLabel(column)}
                        </th>)
                    }
                    </tr>
                </thead>
            }

            { headers ? (
                <tbody>{children}</tbody>
            ) :
                { children }
            }
            </table>
        );
    }
}

Table.propTypes = {
    headers: array,
    children: array,
    className: string,
};

export const makeData = (prop, count = 5, length = 10) => {
    const data = [];
    for (let index = 0; index < count; index++) {
        data.push({
            [prop]: (Math.pow(10, length) + index),
        });
    }
    return data;
};

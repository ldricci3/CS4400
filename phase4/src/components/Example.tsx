import React from 'react';
import {user, userType} from '../utils';

class Example extends React.Component<exampleProps, exampleState> {
    constructor(props: exampleProps) {
        super(props);

        this.state = {
            loading: false,
            error: ''
        }
    }

    render() {
        const {
            loading,
            error } = this.state;

        return (
            <p>Logged in user: {this.props.user.username}</p>
        );
    }

}

type exampleState = {
    loading: boolean,
    error: string
}

type exampleProps = {
    user: user
}

export default Example;
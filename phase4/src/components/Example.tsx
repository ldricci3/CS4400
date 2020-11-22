import React from 'react';

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
            <p>Example</p>
        );
    }

}

type exampleState = {
    loading: boolean,
    error: string
}

type exampleProps = {

}

export default Example;
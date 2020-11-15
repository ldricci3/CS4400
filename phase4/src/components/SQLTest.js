import React from 'react';

class SQLTest extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        users: []
      };
    }

    componentDidMount() {
      fetch("http://localhost:8080/test")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              users: result.users
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    render() {
      const { error, isLoaded, users } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.username}
              </li>
            ))}
          </ul>
        );
      }
    }
  }

export default SQLTest

import React, { Component } from 'react';
import { auth, currentUser } from '../../auth/firebase';


class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }

    render() {
        return (
            <div>
                Portal
            </div>
        );
    }
}

export default Portal;
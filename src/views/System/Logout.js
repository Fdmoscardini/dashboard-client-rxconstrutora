import React, { Component } from 'react';
import 'chartjs-plugin-datalabels';

import 'moment/locale/pt-br';
const moment = require('moment');
moment.locale('pt-br');

class Logout extends Component {
    constructor(props) {
        super(props);
    }

    logout = async () => {
        localStorage.clear();
        setTimeout(() => {
            window.location.href = '/'
        }, 300);
    }

    componentDidMount() {
        this.logout();
    }

    render() {
        return (
            <div className="animated fadeIn"></div>
        );
    }
}

export default Logout;

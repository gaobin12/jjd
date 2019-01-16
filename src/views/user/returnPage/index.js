
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'

@withRouter
export default class Page extends Component {
    constructor(props, context) {
        document.title = "今借到";
        super(props, context)
        history.go(-10);
        return;
        // const { query } = this.props.location;
        // if (query['c_source']== 'acpCharge') {
        //     return;
        // } else if (query['c_source']== 'acpCreditFee') {
        //     history.go(-5);
        //     return;
        // }
        this.state = {
        };
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
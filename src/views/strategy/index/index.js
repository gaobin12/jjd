
//攻略
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'

@withRouter
export default class App extends Component {
	constructor(props, context) {
		document.title = "攻略";
		super(props, context)
		
		this.state = {

		};
		//this.renderTree = renderTree.bind(this)
	}

	render() {
		return (
			<div className='view-strategy'>
				<div className="img-one">
					<Link to="/strategy/lend_ious">
						<img src='/imgs/com/rev-strategy.png' alt="" />
					</Link>
				</div>
				<div className="img-one">
					<Link to="/strategy/borrow_ious">
						<img src='/imgs/com/rev-strategy-3.png' alt="" />
					</Link>
				</div>				

			</div>
		)
	}
}

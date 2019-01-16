//上一个页面title => 此页面的title
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

@withRouter
@inject('homeStore')
@observer
 class About extends Component {
	constructor(props, context) {
		document.title = "关于我们";
		super(props, context)
		this.state = {
		};
	}

	componentDidMount() {
		//this.getPageInfo();
	}

	//注释
	onTapp=()=>{
		//this.props.history.push('/home')
		//this.props.history.replace('/')
		//const { aboutStore } = this.props.store;
		this.props.aboutStore.changeName('wpf1989');
	}

	render () {
			const { aboutStore,homeStore } = this.props;
			return (
				<div className='view-about'>
					<span onTouchEnd={this.onTapp}>{aboutStore.name}</span>
				</div>
			)
	}
}

export default About

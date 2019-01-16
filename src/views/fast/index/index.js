//上一个页面title => 急速借条
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { Modal } from 'SERVICE'


@withRouter
export default class App extends Component {
	constructor(props, context) {
		document.title = "极速借条";
		super(props, context)
		let {query} = this.props.location;
		this.state = {
			/*页面状态*/
			//注释
			// 创建的类型，0为作为债务人，1为债权人
			creditor:query.creditor == undefined?0:parseInt(query.creditor),
		};
	}
	componentDidMount() {
	}

	//补借条
	onSupply=()=>{
        let creaditInfo = $.getCreditInfo();
        if(!creaditInfo){
            this.props.history.push({
				pathname: '/user/wy_valid/0'
            });
        }else if(creaditInfo.idCardStatus ){
            this.props.history.push({
				pathname: '/fast/form',
				query:{
					creditor:this.state.creditor
				}
            });
        }
        else{
			Modal.infoX('您还没有身份认证，去认证',()=>{
                this.props.history.push({
                    pathname: '/user/id_auth',
                    query:{
						pathType:1,
					} 
                });
            });
		}		
	}

	render() {
		return (
			<div className='view-fastindex'>
				<img src='/imgs/com/quick-banner.jpg' alt="" />

				<div className="quick-div">
					<div className="quick-top">
						<img src='/imgs/com/quick-icon.jpg' /><span>仅需3步，轻松搞定</span><img src='/imgs/com/quick-icon.jpg' />
					</div>
					<div className="quick-content">
						<div className="quick-tern">
							<div className="btn">实名认证</div>
							<div className="tern">
								<img src='/imgs/com/quick-itern.png' alt=""/>
							</div>
							<div className="btn">补借条</div>
							<div className="tern">
								<img src='/imgs/com/quick-itern.png' alt="" />
							</div>
							<div className="btn">对方确认</div>
						</div>
						<div className="quick-ul">
							<ul>
								<li>
									<p>此功能针对有一定风控能力的出借人，简化了使用流程；
									借贷双方无需进行信用认证，实名以后就可以打借条</p>
								</li>
							</ul>
						</div>
						<Tap onTap={this.onSupply}><div className="iou-btn">立即补借条</div></Tap>
					</div>
				</div>
		
			</div>
		)
	}


}

//我的出借/二维码 => 借条草稿详情
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Loading, Modal, util } from 'SERVICE'

import SELF from './self'
import OTHER from './other'

@withRouter
@inject('userStore')
@observer
export default class Page extends Component {
	constructor (props, context) {
		document.title = "草稿详情";
		super(props, context);
		let query = util.getUrlParams(this.props.location.search);
		this.state = {
            id:query.id,
            isSelf:null
		};
	}

	componentDidMount(){
		this.getCreator();
	}

	//获取获取创建人
    getCreator = () =>{
		const _this = this;
		Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanpre/product/getProductCreator',
            data:{
                id: this.state.id
            }
        }).then((data)=>{
            if(data == _this.props.userStore.userInfo.userId){
				_this.setState({
					isSelf:1
				});
			}else{
				_this.setState({
					isSelf:0
				});
			}
        }).catch((msg)=>{
			Loading.hide();
			Modal.infoX(msg);
        }).finally(()=>{
			//Loading.hide();
		})
	}
	
	render () {
		if(this.state.isSelf==null){
			return null
		}
		return this.state.isSelf?<OTHER />:<OTHER />;
	}
}

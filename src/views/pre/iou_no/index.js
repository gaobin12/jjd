//首页 => 申请出借 =>申请成功
import '../form.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List,Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading, Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'
const Item = List.Item;
const Brief = Item.Brief;

@withRouter
@inject('userStore','preBorrowStore')
@observer
class Page extends Component {
	constructor (props, context) {
		document.title = "今借到";
		super(props, context)
		this.state = {
			pop1:false,
		};
	}

	componentDidMount(){
    }
  
	render() {
		return (
            <div className="view-iou-form" style={{paddingBottom:'50px'}}>
                <div style={{height: '100%',overflow:'auto'}}>		
                    <img src={'/imgs/iou/borrow-success.svg'} className="succ-img mart100" />
                    <p className="succ-font mar10">由于对方驳回或超时 </p>
                    <p className="succ-font mar10">借条已经不存在了</p>
                </div>
                <div className="common-btn_box">         
                    <Tap className='c-black span font16 active'>
                        完成
                    </Tap>
                </div>
            </div>
		);
	}
}

export default createForm()(Page)

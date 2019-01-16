//申请催收 => 支付成功
import React, {Component,PropTypes} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { List } from 'antd-mobile';
const Item = List.Item;

import './off_success.less';
import './index.less';

export default class App extends Component {
  // static contextTypes = {
  //   router: PropTypes.object.isRequired
  // }
  constructor(props, context) {
    document.title = "支付成功";
    super(props, context)
    //设置组件状态
    this.state = {
        money:100
    };
  }
  componentDidMount() {
    this.getPageInfo();
  }

  //注释
  getPageInfo = () => {
    $.ajax();
  }

  //注释
  onButton = () => {
    // let {doName} = this.props;
    // doName('wpf15010369189')
    // $.ajaxE({
    //   type: 'post',
    //   url: "/eNotar/user/listForPage.jspa",
    //   data: {}        
    // }).then((json)=>{
    //   ////////debugger;
    // }).catch((msg)=>{
    //   ////////debugger;
    // }).then((data)=>{
    //   ////////debugger;
    // })
  }


  render () {
    const {tap,status} = this.state;
    const {about} = this.props;
    return (
		<div className='off_success urge_pay g_payment'>
			<div>
				<div>
					{/*<div><img src={'/imgs/iou/loan-success.svg'} className="detail_img" /></div>*/}
					{/*<div className="bor_font clo999">交易详情</div>*/}
					{/*<div className="bor_font">元</div>*/}
          <img src="/imgs/iou/loan-success.svg" alt=""/>
          <h2>{this.state.money.toFixed(2)}<i className="yuan">元</i></h2>
					<h3>付款成功</h3>
				</div>
			</div>
			<List className="my-list">
				<Item extra={'账户余额'}>支付方式</Item>
			</List>
      <Link to="/"  className="single1">
			   <button className="next_btn btn_bott cl">完成</button>
			</Link>
		</div>
    )
  }
}
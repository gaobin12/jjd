//上一个页面title => 此页面的title
import './index.less'
import React, {Component} from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE/popup'

@withRouter
export default class App extends Component {
  constructor(props, context) {
    document.title = "关于我们";
    super(props, context)
    this.state = {
    };
  }
  componentDidMount() {
  }

  render () {
    return (
      <div className='view-about'>
		<img className="first-child"  src={'/imgs/com/logo_main.svg'} />
		<img className="last-child" src={'/imgs/com/slogan_black.svg'} />
		<div className="title">今借到<span className="span1">V3.4</span></div>
		<div className="content">
			<div className="div">
				今借到是一个依托微信社交平台，通过信用大数据风控和立体催收系统，帮助民间放贷人士获客、风控、交易与管理，提高借贷效率的金融服务平台。
			</div>
			<div  className="div">
				今借到致力于成为金融的入口，帮助有信用的个人和企业今天就借到钱，我们坚信每一个有信用的借款人都是创造价值的主体，我们永不放贷，因为总有出借人比我们更能识别借款人的信用。
			</div>
		</div>
		<div className="footdiv">
			<div className="div2">
				<span className="span2">客服电话</span>
				<span className="span2">010-53565973</span>
			</div>
			<div className="div2">
				<span className="span2">服务时间</span>
				<span className="span2">10:00-19:00（工作日）</span>
			</div>
		</div>
		<div className="copy-right">copyright©北京人人信科技有限公司</div>    
      </div>
    )
  }


}

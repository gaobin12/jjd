
//信用报告
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Tap, CountDown } from 'COMPONENT'

@withRouter
export default class App extends Component {
  constructor (props, context) {
    document.title = "完善信用认证";   
    super(props, context)
    this.state = {      
    };
  }
  gotopage=()=>{
    this.props.history.push({
        pathname: '/credit',
    });
    }
  render () {
    return (
      <div className='view-nocredit-report'>
        <div className="mui-content" style={{height: '100%',overflow:'auto'}}>
            <div className="desc">
            <div className="desc_tit strongTextColor">为什么需要信用报告？</div>
            <p> 1、所有用户必须实名认证，保证电子合同的有效性；</p>
            <p> 2、对于出借人而言，报告提供了详尽的个人信用信息，可以帮助风控，降低风险；</p>
            <p> 3、对于借款人而言，信用报告可以帮助有效筛选优质出借人，完善自己的信用报告也可以大大提高借款效率。 </p>
            <div className="desc_tit strongTextColor">信用报告包括什么内容？</div>
            <p> 1、实名认证：绑卡；</p>
            <p> 2、必填信息：基础信息(微信号、居住地址、紧急联系人)、授权芝麻信用、授权运营商、授权京东；</p>
            <p> 3、选填信息：学信网、央行征信报告、工作信息、收入证明、车产、房产。 </p>
            <div className="desc_tit strongTextColor" marbt60>授信成功后的信用报告是什么样子呢？？</div>
            <img src={'/imgs/com/creditSample_1.jpg'} />
            <img src={'/imgs/com/creditSample_2.jpg'} />
            <img src={'/imgs/com/creditSample_3.jpg'} />
            <img src={'/imgs/com/creditSample_4.jpg'} />
            <img src={'/imgs/com/creditSample_5.jpg'} />
            </div>
        </div>

        <div className="bottom bottom_fixed">
            <Tap onTap={this.gotopage}>
                <div className="bottom_button">
                完善信用报告
                </div> 
                </Tap>
        </div>
          
      </div>
    )
  }
}
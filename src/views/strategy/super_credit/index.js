
//攻略
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, List } from "antd-mobile";
import { Link } from 'react-router-dom';


const Item = List.Item;
const Brief = Item.Brief;

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "攻略";
        super(props, context)
        this.state = {
        };
    }
    
    render() {
        
        return (

            <div className='view-superCredit'>

                <div className="page-title">
                    <img src='/imgs/com/rev-banner.png' alt="" />
                </div>
                <div className="center-t">
                    <div>
                        为了认证更加便捷，平台推出超级认证功能：
                    </div>
                    <div>
                        出借人一次认证，一年有效，并有20次主动认证机会
                    </div>
                </div>


                <div className="cont1" style={{ marginTop: "0.1rem", paddingTop: "0.13rem", paddingLeft: "0.1rem", paddingBottom: "0.1rem", }}>
                    <div className="cont-title">
                        【使用规则】
                        </div>
                    <div className="title">
                        1. 当您是出借人身份时
                        </div>
                    <div className="desc">
                        可以360天免认证，同时获得20次免费主动更新认证机会，当您的重要信息发生变化时，即可更新认证，让您更值得借款人信任；
                        </div>
                    <div className="title">
                        2. 当您是借款人身份时
                    </div>
                    <div className="desc">
                        可获得20次免费主动认证机会，当您需要认证时，可直接抵用认证次数，无需再次付费，让您更快借到钱；
                    </div>
                    <div className="title">
                        3. 所有购买用户
                    </div>
                    <div className="desc">
                        若360天内20次认证用完，需再次付费认证；超过360天后，若还剩余免费认证次数，则免费认证次数失效。
                    </div>
                </div>

                <List className="rz-number">
                    <Item extra="118.8元" align="top" thumb='/imgs/com/rev-super-icon.png' multipleLine>
                        超级认证20次<Brief>有效期360天
                            <span className="right">
                                198.80元
                            </span>
                        </Brief>
                    </Item>
                </List>

                <Link to="/iou/borrow">
                    <div className="bottom-btn">
                        <Button>马上借钱</Button>
                    </div>
                </Link>

            </div>
        )
    }
}

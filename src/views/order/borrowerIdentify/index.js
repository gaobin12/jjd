
//借出
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, InputItem, Picker, WhiteSpace } from 'antd-mobile'
import { createForm } from 'rc-form'

const page = class Page extends Component {
    constructor(props, context) {
        document.title = "艾米";
        super(props, context)
        this.state = {
        };
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className="borrowerIdentify">

                    {/* 头部tab */}
                    <div className="three-info-box">
                        <ul className="three-info-ul">
                            <li className="three-info-li">
                                <div className="title">
                                    出借次数
                            </div>
                                <div className="number">
                                    3
                            </div>
                            </li>
                            <li className="three-info-li">
                                <div className="title">
                                    待收借条
                            </div>
                                <div className="number">
                                    3
                            </div>
                            </li>
                            <li className="three-info-li">
                                <div className="title">
                                    待收金额
                            </div>
                                <div className="number">
                                    2565.52
                            </div>
                            </li>
                        </ul>
                    </div>
                    {/* 筛选tab */}
                    <div className="three-info-box sort-btns">
                        <ul className="three-info-ul">
                            <li className="three-info-li">
                                <div className="title">
                                    借条类型
                            </div>
                                {/* i加 active 箭头朝下 */}
                                <i className="tit-icon"></i>
                                <div className="cont">
                                    全部
                            </div>

                                {/* 点击调出弹窗 */}
                                <List>
                                    <Picker {...getFieldProps('district1')} >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </Picker>
                                </List>
                            </li>
                            <li className="three-info-li">
                                <div className="title active">
                                    借条状态
                            </div>
                                <i className="tit-icon active"></i>
                                <div className="cont">
                                    全部
                            </div>
                                {/* 点击空白调出弹窗 */}
                                <List>
                                    <Picker {...getFieldProps('district2')} >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </Picker>
                                </List>
                            </li>
                            <li className="three-info-li">
                                <div className="title">
                                    出借日期
                            </div>
                                <i className="tit-icon"></i>
                                <div className="cont">
                                    从近到远
                            </div>
                                {/* 点击空白调出弹窗 */}
                                <List>
                                    <Picker {...getFieldProps('district3')} >
                                        <List.Item arrow="horizontal"></List.Item>
                                    </Picker>
                                </List>
                            </li>
                        </ul>
                    </div>
                {/* 整体卡片 hide 隐藏*/}
                <div className="b-box">
                    {/* 卡片 */}
                    <ul className="sort-contents">
                        <li className="sort-con-li">
                            <div className="top">
                                <div className="avatar">
                                    <div>
                                        <img src={'/imgs/com/2018-03-15_144040.jpg'} />
                                    </div>
                                </div>
                                <div className="text">
                                    <div className="top2">
                                        <span className="name">史玲玲</span>
                                        <i>还款中</i>
                                    </div>
                                    <div className="bottoms">
                                        <span>线上</span>
                                    </div>
                                    <div className="right">
                                        <span>1000</span>元
                                </div>
                                </div>
                            </div>
                            <div className="bottoms">
                                <div className="lend-date">
                                    出借日期：2018-06-21
                            </div>
                                <div className="pay-date">
                                    还款日期：2018-09-21
                            </div>
                            </div>
                        </li>
                        <li className="sort-con-li">
                            <div className="top">
                                <div className="avatar">
                                    <div>
                                        <img src={'/imgs/com/2018-03-15_144040.jpg'} />
                                    </div>
                                </div>
                                <div className="text">
                                    <div className="top2">
                                        <span className="name">史玲玲</span>
                                        <i>还款中</i>
                                    </div>
                                    <div className="bottoms">
                                        <span>线上</span>
                                    </div>
                                    <div className="right">
                                        <span>1000</span>元
                                </div>
                                </div>
                            </div>
                            <div className="bottoms">
                                <div className="lend-date">
                                    出借日期：2018-06-21
                            </div>
                                <div className="pay-date">
                                    还款日期：2018-09-21
                            </div>
                            </div>
                        </li>



                    </ul>

                </div>
               

                {/* 没有内容时显示 hide 隐藏*/}
                <div className="group list_div_group hide">
                    <div className="row">
                        <div className="bg">
                            <div className="icon">
                                <img src={'/imgs/com/noData.svg'} />
                            </div>
                            <div className="row_font">暂无任何内容</div>
                        </div>
                    </div>
                </div>



            </div>
        )
    }
}
export default createForm()(page);

//主页 => 好友
import '../common.less'
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Tap,Tips,Pay,InputCode,InputValid } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'
import { List, Carousel } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;

@withRouter
export default class Page extends Component {
    constructor(props, context) {
        document.title = "认证等级";
        super(props, context)
        
        this.state = {
            slideIndex: 0,
        };
    }

    componentDidMount() {

    }
    render() {
        
        return (
            <div className="view-friend view-friend-auth" style={{paddingBottom:'50px'}}>
                <div className='common-view-in'>
                    <Carousel className='space-carousel'
                        frameOverflow="visible"
                        cellSpacing={10}
                        slideWidth={0.8}
                        infinite
                        beforeChange={(from, to) => this.setState({ slideIndex: to })}
                        afterChange={index => this.setState({ slideIndex: index })}
                        dotStyle = {{background: '#E4E4E4',width:'12px',height:'2px',borderRadius:0}}
                        dotActiveStyle = {{background:'#4B505F',width:'12px',height:'2px',borderRadius:0}}
                        >
                        <div className='carousel-item' style={this.state.slideIndex === 0?{transform:'scale(1.1)'}:null}>
                            <img className='bg' src={'/imgs/friend/le1b.svg'} />
                            <div className='item-in'>
                                <img className='img' src={'/imgs/friend/auth1.png'} />
                                <p className='level'>普通用户</p>
                                <p className='des'>未认证</p>
                            </div>
                        </div>
                        <div className='carousel-item' style={this.state.slideIndex === 1?{transform:'scale(1.1)'}:null}>
                            <img className='bg' src={'/imgs/friend/le2b.svg'} />
                            <div className='item-in'>
                                <img className='img' src={'/imgs/friend/auth2.png'} />
                                <p className='level'>白银用户</p>
                                <p className='des'>实名认证</p>
                            </div>
                        </div>
                        <div className='carousel-item' style={this.state.slideIndex === 2?{transform:'scale(1.1)'}:null}>
                            <img className='bg' src={'/imgs/friend/le3b.svg'} />
                            <div className='item-in'>
                                <img className='img' src={'/imgs/friend/auth3.png'} />
                                <p className='level'>黄金用户</p>
                                <p className='des'>人脸认证+信用认证</p>
                            </div>
                        </div>
                    </Carousel>
                    <List className="friend-list credit-list">
                        <Item className='header'>权限说明</Item>
                        <div className='grid-box' style={{gridTemplateRows: 'repeat(3, calc((86vw - 40px) / 3))'}}>
                            <figure>
                                <img src='/imgs/friend/valid1.svg' />
                                <figcaption>
                                    添加好友
                                    {true?<p className='green'>维护中</p>:
                                    true?<p className='blue'>认证中</p>:
                                    true?<p className='mainC1'>待完善</p>:
                                    true?<p className='fontC1'>已过期</p>:
                                    true?<p className='red'>认证失败</p>:null}
                                </figcaption>
                            </figure>
                            <figure>
                                <img src='/imgs/friend/valid2.svg' />
                                <figcaption>
                                    VIP客服
                                </figcaption>
                            </figure>
                            <figure>
                                <img src='/imgs/friend/valid3.svg' />
                                <figcaption>
                                    极速借条
                                </figcaption>
                            </figure>
                            <figure>
                                <img src='/imgs/friend/valid4.svg' />
                                <figcaption>
                                    求借款
                                </figcaption>
                            </figure>
                            <figure>
                                <img src='/imgs/friend/valid5.svg' />
                                <figcaption>
                                    去出借
                                </figcaption>
                            </figure>
                            <figure>
                                <img src='/imgs/credit/sel-jingdong.svg' />
                                <figcaption>
                                    补借条
                                </figcaption>
                            </figure>
                        </div>
                    </List>
                </div>
                <div className='common-btn_box'>
                    <Tap className='c-black span active'>
                        立即认证
                    </Tap>
                </div>
            </div>
        )
    }
}
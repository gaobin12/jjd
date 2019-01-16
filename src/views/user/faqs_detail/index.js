
//个人信息=>客服=>常见问题=>热门问题（点击进来的页面）
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List } from 'antd-mobile'
import { Modal } from 'SERVICE'
import { Tap } from 'COMPONENT'
const Item = List.Item

@withRouter
export default class App extends Component {
    
    constructor(props, context) {
        document.title = "问题详情";
        super(props, context)
        this.state = {
            modal1: false,//感谢反馈弹窗
            name: 'amy',
            isShow: 1,//显示灰色笑脸
            isShow2: 1,//显示灰色哭脸
            clickNum: 0,
            faqs_list_detail_id: '',
            straight_list_data: '',
            faqs_list_detail: '',
            faqId: ''
        };
    }



    componentDidMount() {
        if (this.props.location.query.faqs_list_detail_id) {
            var faqs_list_detail_id = this.props.location.query.faqs_list_detail_id;

            this.setState({
                faqId: faqs_list_detail_id
            });
        }
        this.getFaqById(faqs_list_detail_id);
        //直接跳转到详情
    }

    // 笑脸显示函数
    changeImg = (e) => {
        let { clickNum, modal1 } = this.state
        if (this.state.clickNum > 0) {
            return;
        }
        this.setState({
            isShow: 0
        })
        this.state.clickNum += 1

        this.Fun();

        Modal.alertX('提醒', '感谢您的反馈！！！', [{
            text: '知道了', onPress: () => { }
        }]);
    }
    // 哭脸显示函数
    changeImg2 = (e) => {
        let { clickNum } = this.state
        if (this.state.clickNum > 0) {
            return;
        }
        this.setState({
            isShow2: 0
        })

        this.state.clickNum += 1

        this.Fun2();
        Modal.alertX('提醒', '感谢您的反馈！！！', [{
            text: '知道了', onPress: () => { }
        }]);
    }

    Fun = () => {
        // 根据ID查询常见问题 并增加浏览量
        let { faqId } = this.state;
        $.ajaxE({
            type: 'POST',
            url: "/user/my/updateFaqVote",
            data: {
                faqId: faqId,
                whether: 1
            }

        }).then((data) => {
           

        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }
    Fun2 = () => {
        // 更新投票量
        let { faqId } = this.state;
        $.ajaxE({
            type: 'POST',
            url: "/user/my/updateFaqVote",
            data: {
                faqId: faqId,
                whether: 0
            }

        }).then((data) => {

        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }
    //加载数据
    getFaqById = (faqs_list_detail_id) => {
        // 更新投票量
        $.ajaxE({
            type: 'GET',
            url: "/user/my/getFaqById",
            data: {
                faqId: faqs_list_detail_id,
            }

        }).then((data) => {
            this.setState({
                faqs_list_detail: data
            });

        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }

    render() {
        let { isShow, isShow2, faqs_list_detail } = this.state
        return (
            <div className='view-faqs-detail'>
                {/* 问题标题和内容 */}
                <ul className="faq_c_ul_detal">
                    <li className="faq-li">
                        <i>Q:</i>
                        <span>{faqs_list_detail.title}</span>
                    </li>
                    <li className="faq-li faq_eee">
                        <i>A:</i>
                        <div dangerouslySetInnerHTML={{ __html: faqs_list_detail.content }}></div>
                    </li>
                </ul>

                {/* 问题是否解决 */}
                <div className="faq_qi">
                    <p className="faq_tt">您的问题是否得到了解决？</p>
                    <div className="faq_img_div">
                        <div className="faq-div faq_img1">
                            <Tap onTap={this.changeImg}>
                                <div className={isShow == 1 ? 'face-icon' : 'face-icon active'}>
                                    <img className="img1" src={'/imgs/com/faq_face1.svg'} />
                                    <img className="img2" src={'/imgs/com/faq_face1_act.svg'} />
                                </div>
                                是的
                            </Tap>
                        </div>
                        <div className="faq-div faq_img2">
                            <Tap onTap={this.changeImg2}>
                                <div className={isShow2 == 1 ? 'face-icon' : 'face-icon active'}>
                                    <img className="img1" src={'/imgs/com/faq_face2.svg'} />
                                    <img className="img2" src={'/imgs/com/faq_face2_act.svg'} />
                                </div>
                                没有
                             </Tap>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

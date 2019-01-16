//信用报告
import '../credit.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loading, Modal, util } from 'SERVICE'
import { Link,withRouter } from 'react-router-dom'


@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "数字证书";
        super(props, context)
        this.state = {
            userId: '',//用户id

            userName: '',//用户名称
            serialNumber: '',//序列号
            certNotBefore: '',//使用开始日期
            certNotAfter: '',//使用结束日期


        };
        //this.renderTree = renderTree.bind(this)
    }

    componentDidMount(){
        this.getCertInfo()
    }

    // 获取证书信息
    getCertInfo = () => {
        let query = util.getUrlParams(this.props.location.search);
        Loading.show();
        $.ajaxE( {
            type: 'POST',
            contentType: 'application/json',
            url: '/loanlater/protocol/getECloudSignCertInfo',
            data: {
                userId:query.userId,
            }
        }).then((data) => {
            data.certNotBefore = new Date(data.certNotBefore).Format('yyyy-MM-dd');
            data.certNotAfter = new Date(data.certNotAfter).Format('yyyy-MM-dd');
            this.setState({
                userName: data.userName,
                serialNumber: data.serialNumber,
                certNotBefore: data.certNotBefore,
                certNotAfter: data.certNotAfter,
            })
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }

    render() {
        let { userName, serialNumber, certNotBefore, certNotAfter } = this.state
        return (
            <div className='view-certificate view-credit-all'>
                <div className="place_mpd">
                    <div className="card_img">
                        <img src={'/imgs/com/yiyunzhang_bg.jpg'} />
                    </div>
                    <div className="posi_font">
                        <p>
                            <i>颁发给</i>
                            <span>{userName}</span>
                        </p>
                        <p>
                            <i>颁发者</i>
                            <span>天威诚信数字认证中心</span>
                        </p>
                        <p>
                            <i>序列号</i>
                            <span>{serialNumber}</span>
                        </p>
                        <p>
                            <i>有效期</i>
                            <span>{certNotBefore} ~ {certNotAfter} </span>
                        </p>
                        <p>
                            <i>使用者</i>
                            <span>{userName}</span>
                        </p>
                        <p>
                            <i>付款方</i>
                            <span>北京人人信科技有限公司</span>
                        </p>
                        <p>
                            <i className="ml_12">证书说明</i>
                            <span>数字证书由证书授权中心发行，具有安全唯一性。</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}


//信用报告
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Loading, Modal } from 'SERVICE'
import {Tap} from 'COMPONENT'
import { List } from 'antd-mobile';
import { inject, observer } from 'mobx-react'
const Item = List.Item;
const Brief = Item.Brief;

@withRouter
@inject('creditStore','userStore')
@observer
export default class App extends Component {
    constructor (props, context) {
        document.title = "信用认证";
        super(props, context);
        this.state ={
            location_status:0, // 定位状态0.未认证 1.认证中 2.认证成功 3.认证失败
            paidStatus:false,  //检查是否支付认证费用
            notice:false,
            creditData:{
                baseInfo_credit_status: 3,		// 基础信息认证状态0.未认证 1.待完善 2.认证中 3.认证成功 4.认证失败 5.已过期
                mobile_credit_status:3,       //运营商认证状态
                face_verify_status:3,       //人脸识别认证状态,
                jingdong_credit_status:3,      //京东认证状态
                shebao_credit_status:3,        //社保认证状态
                gjj_credit_status:3,         //公积金认证状态
                xuexin_credit_status:3,        //学信认证状态
                zhengxin_credit_status:3,       //征信认证状态,
                house_credit_status:3,             //房产认证状态,
                car_credit_status:3,               // 车产认证状态,
                income_credit_status:3,        // 收入认证状态,
                job_credit_status:3,          // 工作认证状态,
                zhima_credit_status:3,         //芝麻信用认证状态,
                mobileAnalysis_credit_status:3,  //运营商分析认证状态,
                location_credit_status:3,   //定位认证状态,   
                dishonest_credit_status:3,  //高法失信状态
                alipay_credit_status:3,    //         
            }  
        };
    }

    componentDidMount(){
        this.props.userStore.getUserInfo();
        let { creditStore } = this.props;  
        //检查是否支付认证费用
        creditStore.payCreditFeeInit(()=>{
            this.setState({
                paidStatus:creditStore.paidStatus,
            })
        });
        //获取认证状态
        creditStore.getCreditSwitch(()=>{
            this.setState({
                creditData:creditStore.creditData
            })
            
        });
    }

    //检查是否支付了充值费用
    gotoPayCredit=()=>{
        Modal.alertX('提醒', '信用认证需要付费,确认去支付吗?', [
            { text: '取消', onPress: () => console.log('Cancel') },
            {
                text: '去支付', onPress: () => {
                    this.props.history.push({
                        pathname: '/credit/pay_credit'
                    })
                }
            }
        ])
    }

    //判断是否是 第一次认证
    isFirstTime=()=>{
        return !this.state.creditData.face_verify_status;
    }

    // 判断基础信息是否过期
    isExpired=()=>{
        let { creditData } = this.state;
        if (creditData.baseInfo_credit_status===5 && creditData.mobile_credit_status===5 && creditData.face_verify_status===5) {
            return true;
        }
        return false;
    }
     //人脸识别
    gotoFaceVerify=()=>{
        let { creditData } = this.state;
        if (creditData.face_verify_status==0 || creditData.face_verify_status==4) {
            // 未进行过人脸认证或者认证失败
            $.ajaxE({
                    type: 'GET',
                    url: '/credit/faceVerify/getToken',
                    data:{}
                }).then((data)=>{
                    if(data!=null){
                        this.props.userStore.getUserCreditInfo();
                        if(data.token!=null){
                            window.location.href='https://api.megvii.com/faceid/lite/do?token='+data.token
                        }
                        if(data.ocrParam!=null){
                            window.location.href=data.ocrParam;
                        }
                        
                    }
                }).catch((msg)=>{
                    Modal.infoX(msg);
                })
        } else if (creditData.face_verify_status==3) {
            // 已完成人脸认证
            Modal.alertX('提醒', '你已经完成人脸识别了', [{
                text: '知道了', onPress: () => {}
            }]);
        }
    }


    //定位
    getLocationData=()=>{
        let that=this;
        that.setState({
            location_status:1
        })
        let geocoder;
        // 初始化根据gps地址获取地址描述信息的插件
        AMap.service('AMap.Geocoder', function () {//回调函数
            //实例化Geocoder
            geocoder = new AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
        })
        wx.getLocation({
            type : 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success : function(res) {
                let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                let speed = res.speed; // 速度，以米/每秒计
                let accuracy = res.accuracy; // 位置精度
                let lngLat = new AMap.LngLat(longitude, latitude);
                geocoder.getAddress(lngLat, function (status, result) {
                    if (status == "complete") {
                        let province = result.regeocode.addressComponent.province;
                        let city = result.regeocode.addressComponent.city.length == 0 ? province : result.regeocode.addressComponent.city
                        let district = result.regeocode.addressComponent.district;
                        let delStr3 = province+result.regeocode.addressComponent.city+district;
                        let address = result.regeocode.formattedAddress.replace(delStr3,'');
                        
                        let postData = {
                            'content_type':'location',
                            "locationInfo":{
                                "province_name":province,
                                "city_name":city,
                                "district_name":district,
                                "address":address
                            },
                        }
                        $.ajaxE({
                            type: 'POST',
                            url: '/credit/accredit/saveInfo',
                            data:postData
                        }).then((data)=>{
                            that.setState({
                                location_status:2
                            })
                        }).catch((msg)=>{
                            that.setState({
                                location_status:3
                            })
                            Modal.infoX(msg);
                        })
                    }
                });
            }
        })
    }

    //点击各项事件
    gotoPage=(v)=>{   
        //如果没有支付且是第一次认证,点击任何图标,全部指向支付且从头开始认证
        if (!this.state.paidStatus && this.isFirstTime()) {
            this.gotoPayCredit();
        }
        // 如果已支付且未进行过认证,点击任何图标,全部指向基本信息且从头开始认证
        else if(this.state.paidStatus && this.isFirstTime()){
            if(v!='face'){
                this.gotoFaceVerify();
            }else{
                this.gotoFaceVerify();
            }
        }
        // 如果已支付且认证已过期,点击必填图标,全部指向基本信息且从头开始认证
        else if((this.state.paidStatus && v=='base'&& this.isExpired())||(this.state.paidStatus && v=='operator_first'&& this.isExpired())||(this.state.paidStatus && v=='face'&& this.isExpired())){
            this.gotoFaceVerify();
        }
        // 如果认证已过期,点击必填图标,指向支付且从头开始认证
		else if ((v == 'base' && this.isExpired()) || (v == 'operator_first' && this.isExpired()) ||(v == 'face' && this.isExpired())){
            this.gotoPayCredit();
        }
        // 如果没有支付且必填全部认证成功,点击必填图标,指向支付且从头开始认证
		else if ((!this.state.paidStatus && v == 'base')||(!this.state.paidStatus && v == 'face')||(!this.state.paidStatus && v == 'operator')) {
            this.gotoPayCredit();
        }
        // 如果已支付,点击人脸识别,根据认证状态判断下一步操作
        else if (this.state.paidStatus&&v == 'face') {
            this.gotoFaceVerify();
        } else {
            // 如果已支付,点击必填图标,可进行单项认证
            if ((this.state.paidStatus&& v == 'base') || (this.state.paidStatus && v == 'operator_first')) {
                if(this.state.creditData.face_verify_status==4){
                    this.gotoFaceVerify();
                }else if(this.state.paidStatus && v == 'operator_first' && this.state.creditData.mobile_credit_status==2){
                    Modal.alertX('提醒', ' 运营商正在认证中，请稍等', [{
                        text: '知道了', onPress: () => {
                            this.getCreditInfo();
                        }
                    }]);
                }else{
                    this.props.history.push({
                        pathname: '/credit/'+v,
                        search: '?typeOp=' + 1
                    })
                }
                
            }
            else if (v == 'checkReport') {
                // this.props.history.push({
                //     pathname: '/credit/report_info'
                // })
                this.props.history.push({
                    pathname: '/credit/report_simple',
                    search: '?userId='+ this.props.userStore.userInfo.userId
                })
            } else if (!this.state.paidStatus) {
                this.gotoPayCredit();
            }
        }
    }

    // 点击更新报告,进行更新报告操作
    gotoUpdate=()=>{
        if (this.state.paidStatus) {
            if(this.state.creditData.face_verify_status==4){
                this.gotoFaceVerify();
            }else{
                this.props.history.push({
                    pathname: '/credit/base'
                })
            }
        }else{
            this.gotoPayCredit();
        }
    }

    // 电商网站
    gotoDianshang = () => {
        let { creditData } = this.state;
        if (creditData.alipay_credit_status == 3) {
            // 已完成支付宝认证
            Modal.alertX('提醒', '本次授权已成功，报告有效期内暂不支持更新', [{
                text: '知道了', onPress: () => { }
            }]);
        } else if (creditData.alipay_credit_status == 2) {
            Modal.alertX('提醒', ' 电商正在认证中，请稍等', [{
                text: '知道了', onPress: () => {
                    this.getCreditInfo();
                }
            }]);
        } else {
            // 未进行过支付宝或者认证失败
            $.ajaxE({
                type: 'POST',
                url: '/credit/accredit/alipay/addJob',
                data: {
                    process_code: 2700,
                }
            }).then((data) => {
                if (data && data.url) {
                    window.location.href = data.url;
                } else {
                    this.props.history.push({
                        pathname: '/credit/zhifubao_login'
                    })
                }
            }).catch((msg) => {
                Modal.infoX(msg);
            }).finally(() => {
                Loading.hide();
            })
        }
    }
    //点击推荐认证
    gotoSelect=(v)=>{
        let { creditData } = this.state;
        if (this.state.paidStatus && creditData.baseInfo_credit_status===3 && creditData.mobile_credit_status===3 && creditData.face_verify_status===3) {
            // 点击非必填图标,可进行单项认证
            if(v=='zhifubao_login'){
                this.gotoDianshang()
            }
            if (v == 'gfsx' || v == 'jingdong_first' || v == 'xuexin' || v == 'job' ||
            v == 'income' || v == 'car' || v == 'house' || v == 'social_security_first' || v == 'accumulation_first') {
                this.props.history.push({
                    pathname: '/credit/'+v
                })
            }
            else if(v == 'zhima'){
                Modal.alertX('芝麻信用通道正在维护', '芝麻信用暂时不可用。但是不认证芝麻信用不影响您使用今借到的任何功能。建议您暂时私下通过截图/视频等方式获取该项信息。', [{
                        text: '知道了', onPress: () => {}
                    }]);
            }
            // 点击定位，获取定位信息
            // else if (v == 'dingwei') {
            //     this.getLocationData();
            // }
        }else{
            Modal.alertX('提醒', '请先完成基础认证后，进行推荐认证，完善信用报告', [
                {
                    text: '知道啦', onPress: () => {
                    }
                }
            ])
        }
    }

    render() {
        let { userStore:{userInfo,creditInfo} } = this.props;
        let { creditData,paidStatus,notice,location_status } = this.state;
        return (
        <div className='jin-credit-report'>
            {notice?<div className="notice-bar">
                <div className="notice-img pad10"><img className="message" src={'/imgs/credit/message.svg'} /></div>
                <div className="notice-content">信用认证项目完成度越高，借款和出借成功率就会越高</div>
                <Tap className="notice-img" onTap={this.setState({notice:false})}><img className="close" src={'/imgs/credit/close.svg'} /></Tap>
            </div>:null}

            <List className="credit-head">
                <Item align="top" thumb={ userInfo.avatarUrl.length?userInfo.avatarUrl:'/imgs/credit/default_icon.svg'}  multipleLine>
                    <div className="name">{(userInfo.userId && creditInfo.idCardStatus==1)?userInfo.userName:userInfo.telephone}</div>
                    <Brief>
                        {paidStatus?<Tap onTap={() => { this.gotoPage('checkReport' ) }}>信用报告
                            <img src={'/imgs/credit/arrows-back.svg'} />
                        </Tap>:<Tap onTap={this.gotoPayCredit}>未认证</Tap>}
                    </Brief>
                        {paidStatus? <Tap onTap={this.gotoUpdate}>
                            <div className="com-btn-grandual posi">更新报告</div>
                        </Tap>:<Tap onTap={this.gotoPayCredit}>
                            <div className="com-btn-grandual posi">立即认证</div>
                        </Tap>}
                </Item>
                
                {/* <Item>
                    <div className="cred-item">已认证<span>4/13</span>项</div>
                    <div className="cred-right">还有15天到期</div>
                </Item> */}
            </List>
            <div className="cred-line-br"></div>
            <List className="credit-base">
                <Item className="cred-base-tit">基础认证</Item>

                <Tap onTap={() => { this.gotoPage('face' ) }}>
                {creditData.face_verify_status==0?<Item  extra="未认证" 
                thumb={'/imgs/credit/base-face-gray.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >人脸识别</Item>:null}
                {creditData.face_verify_status==1?<Item className="cred-base-pre" extra="待完善" 
                thumb={'/imgs/credit/base-face.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >人脸识别</Item>:null}
                {creditData.face_verify_status==2?<Item className="cred-base-active" extra="认证中" 
                thumb={'/imgs/credit/base-face.svg'}
                onClick={() => {}}
                >人脸识别</Item>:null}
                {creditData.face_verify_status==3?<Item  className="cred-base-font" extra="已认证" 
                thumb={'/imgs/credit/base-face.svg'}
                >人脸识别</Item>:null}
                {creditData.face_verify_status==4?<Item className="cred-base-fail" extra="失败" 
                thumb={'/imgs/credit/base-face.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >人脸识别</Item>:null}
                {creditData.face_verify_status==5?<Item extra="已过期" 
                thumb={'/imgs/credit/base-face.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >人脸识别</Item>:null}
                </Tap>

                <Tap onTap={() => { this.gotoPage('base' ) }}>
                {creditData.baseInfo_credit_status==0?<Item  extra="未认证" 
                thumb={'/imgs/credit/base-base-gray.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >基础信息</Item>:null}
                {creditData.baseInfo_credit_status==1?<Item className="cred-base-pre" extra="待完善" 
                thumb={'/imgs/credit/base-base.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >基础信息</Item>:null}
                {creditData.baseInfo_credit_status==2?<Item  className="cred-base-active" extra="认证中" 
                thumb={'/imgs/credit/base-base.svg'}
                onClick={() => {}}
                >基础信息</Item>:null}
                {creditData.baseInfo_credit_status==3?<Item  className="cred-base-font" extra="已认证" 
                thumb={'/imgs/credit/base-base.svg'}
                >基础信息</Item>:null}
                {creditData.baseInfo_credit_status==4?<Item className="cred-base-fail" extra="失败" 
                thumb={'/imgs/credit/base-base.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >基础信息</Item>:null}
                {creditData.baseInfo_credit_status==5?<Item  extra="已过期" 
                thumb={'/imgs/credit/base-base.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >基础信息</Item>:null}
                </Tap>

                <Tap className="icon-info" onTap={() => { this.gotoPage('operator_first' ) }}>
                {creditData.mobile_credit_status==0?<Item  extra="未认证" 
                thumb={'/imgs/credit/base-operator-gray.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >运营商</Item>:null}
                {creditData.mobile_credit_status==1?<Item className="cred-base-pre" extra="待完善" 
                thumb={'/imgs/credit/base-operator.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >运营商</Item>:null}
                {creditData.mobile_credit_status==2?<Item className="cred-base-active" extra="认证中" 
                thumb={'/imgs/credit/base-operator.svg'}
                onClick={() => {}}
                >运营商</Item>:null}
                {creditData.mobile_credit_status==3?<Item className="cred-base-font" extra="已认证" 
                thumb={'/imgs/credit/base-operator.svg'}
                >运营商</Item>:null}
                {creditData.mobile_credit_status==4?<Item className="cred-base-fail" extra="失败" 
                thumb={'/imgs/credit/base-operator.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >运营商</Item>:null}
                {creditData.mobile_credit_status==5?<Item  extra="已过期" 
                thumb={'/imgs/credit/base-operator.svg'}
                arrow="horizontal"
                onClick={() => {}}
                >运营商</Item>:null}
                </Tap>
            </List>


            <div className="credit-select">
                <div className="cresel-tit">推荐认证(可选)</div>
                <div className="cresel-font">选择认证以下信息可提高借款、出借成功率哦～</div>
                
                <div className="grid">
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('zhifubao_login')}}>
                            {creditData.alipay_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-zhifubao-gray.svg'} />
                                <p className="gray">支付宝</p>
                            </div>:null}
                            {creditData.alipay_credit_status==1?<div className="grid-con">
                            <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                <p>支付宝</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.alipay_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                <p>支付宝</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.alipay_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                <p>支付宝</p>
                            </div>:null}
                            {creditData.alipay_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                <p>支付宝</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.alipay_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-zhifubao.svg'} />
                                <p>支付宝</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('gfsx')}}>
                            {creditData.dishonest_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gfsx-gray.svg'} />
                                <p className="gray">高法失信</p>
                            </div>:null}
                            {creditData.dishonest_credit_status==1?<div className="grid-con">
                            <img src={'/imgs/credit/sel-gfsx.svg'} />
                                <p>高法失信</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.dishonest_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gfsx.svg'} />
                                <p>高法失信</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.dishonest_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gfsx.svg'} />
                                <p>高法失信</p>
                            </div>:null}
                            {creditData.dishonest_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gfsx.svg'} />
                                <p>高法失信</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.dishonest_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gfsx.svg'} />
                                <p>高法失信</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('jingdong_first')}}>
                            {creditData.jingdong_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong-gray.svg'} />
                                <p className="gray">京东认证</p>
                            </div>:null}
                            {creditData.jingdong_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong.svg'} />
                                <p>京东认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.jingdong_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong.svg'} />
                                <p>京东认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.jingdong_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong.svg'} />
                                <p>京东认证</p>
                            </div>:null}
                            {creditData.jingdong_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong.svg'} />
                                <p>京东认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.jingdong_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-jingdong.svg'} />
                                <p>京东认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    {/* {$.isWeiXin?<div className="grid-item">
                        <Tap className="icon-infos" onTap={() => {this.gotoPage('dingwei')}} >
                            {creditData.location_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location-gray.svg'} />
                                <p className="gray">定位</p>
                            </div>:null}
                            {creditData.location_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location.svg'} />
                                <p>定位</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.location_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location.svg'} />
                                <p>定位</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.location_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location.svg'} />
                                <p>定位</p>
                            </div>:null}
                            {creditData.location_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location.svg'} />
                                <p>定位</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.location_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-location.svg'} />
                                <p>定位</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>:null} */}
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('social_security_first')}} >
                            {creditData.shebao_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao-gray.svg'} />
                                <p className="gray">社保认证</p>
                            </div>:null}
                            {creditData.shebao_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao.svg'} />
                                <p>社保认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.shebao_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao.svg'} />
                                <p>社保认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.shebao_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao.svg'} />
                                <p>社保认证</p>
                            </div>:null}
                            {creditData.shebao_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao.svg'} />
                                <p>社保认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.shebao_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-shebao.svg'} />
                                <p>社保认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-infos" onTap={() => {this.gotoSelect('accumulation_first')}} >
                            {creditData.gjj_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj-gray.svg'} />
                                <p className="gray">公积金</p>
                            </div>:null}
                            {creditData.gjj_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.gjj_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.gjj_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                            </div>:null}
                            {creditData.gjj_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.gjj_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-gjj.svg'} />
                                <p>公积金</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('xuexin')}}>
                            {creditData.xuexin_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin-gray.svg'} />
                                <p className="gray">学信认证</p>
                            </div>:null}
                            {creditData.xuexin_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin.svg'} />
                                <p>学信认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.xuexin_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin.svg'} />
                                <p>学信认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.xuexin_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin.svg'} />
                                <p>学信认证</p>
                            </div>:null}
                            {creditData.xuexin_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin.svg'} />
                                <p>学信认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.xuexin_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-xuexin.svg'} />
                                <p>学信认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('job')}} >
                            {creditData.job_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job-gray.svg'} />
                                <p className="gray">职业认证</p>
                            </div>:null}
                            {creditData.job_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job.svg'} />
                                <p>职业认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.job_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job.svg'} />
                                <p>职业认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.job_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job.svg'} />
                                <p>职业认证</p>
                            </div>:null}
                            {creditData.job_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job.svg'} />
                                <p>职业认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.job_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-job.svg'} />
                                <p>职业认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('income')}} >
                            {creditData.income_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income-gray.svg'} />
                                <p className="gray">收入认证</p>
                            </div>:null}
                            {creditData.income_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income.svg'} />
                                <p>收入认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.income_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income.svg'} />
                                <p>收入认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.income_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income.svg'} />
                                <p>收入认证</p>
                            </div>:null}
                            {creditData.income_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income.svg'} />
                                <p>收入认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.income_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-income.svg'} />
                                <p>收入认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('car')}}  >
                            {creditData.car_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car-gray.svg'} />
                                <p className="gray">车产认证</p>
                            </div>:null}
                            {creditData.car_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car.svg'} />
                                <p>车产认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.car_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car.svg'} />
                                <p>车产认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.car_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car.svg'} />
                                <p>车产认证</p>
                            </div>:null}
                            {creditData.car_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car.svg'} />
                                <p>车产认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.car_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-car.svg'} />
                                <p>车产认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                    <div className="grid-item">
                        <Tap className="icon-info" onTap={() => {this.gotoSelect('house')}} >
                            {creditData.house_credit_status==0?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house-gray.svg'} />
                                <p className="gray">房产认证</p>
                            </div>:null}
                            {creditData.house_credit_status==1?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house.svg'} />
                                <p>房产认证</p>
                                <p className="pre">待完善</p>
                            </div>:null}
                            {creditData.house_credit_status==2?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house.svg'} />
                                <p>房产认证</p>
                                <p className="active">认证中</p>
                            </div>:null}
                            {creditData.house_credit_status==3?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house.svg'} />
                                <p>房产认证</p>
                            </div>:null}
                            {creditData.house_credit_status==4?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house.svg'} />
                                <p>房产认证</p>
                                <p className="fail">认证失败</p>
                            </div>:null}
                            {creditData.house_credit_status==5?<div className="grid-con">
                                <img src={'/imgs/credit/sel-house.svg'} />
                                <p>房产认证</p>
                                <p className="over">已过期</p>
                            </div>:null}
                        </Tap>
                    </div>
                </div> 
            </div>
        </div>
    )
  }
}
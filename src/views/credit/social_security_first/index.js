
// 信用报告 => 社保认证
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, Picker, InputItem,Flex } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { Loading, Modal } from 'SERVICE'
import { createForm } from 'rc-form'
import { Tap,Side } from 'COMPONENT'

const cityData = require("SERVICE/city_data2.js");

@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "社保信息";
        super(props, context)
        this.state = {
            ajaxValue:false,
            noData:false,   //没有值显示
            curVertifyParams: [], // 当前要验证的表单项数据（当前选择的数据和获取到的数据数组中每个对象匹配后，保存的对象的loginParams）
            /*             
                curVertifyParams: [
                    { 
                        name:"login_type", 
                        label:"身份证号", 
                        value: "1", 
                        fields: [
                            { label: "身份证号", type: "text", name: "user_name" }, 
                            { label: "密码", type:"password", name: "user_pass" }
                        ] 
                    },
                    ...
                ],
             */
            cityListData: [], 
            curVertifyWayLabel: '', // 请选择验证方式，右边的结果 文字（picker中的项目文字）（匹配到城市后，curVertifyParams中第一项的label）
            curVertifyWayName: 0, // 选中的验证方式("login_type")                                                                           
            curVertifyWayValue: 0, // 选中的验证方式的值（picker中的项目值）（匹配到城市后，curVertifyParams中第一项的value或选中的value）    
            curFieldsData: [], // 由对象组成，用户填写的数据，每个对象对应填写的一个表单                                                      
            curCityCode: '', // 直辖市的省code或 普通市的市code，picker回调中获取
            beSelectedCity: [], // 被选中的城市
            params: {},
            vertifyWayPickerData: [], // 验证方式数据（由curVertifyParams计算转换格式得到），格式应为：
            // vertifyWayPickerData: [
            //     { value: "0", label: "身份证号" },
            //     { value: "1", label: "用户名" },
            // ],
            
            isPopupShow: false,
            
        };
    };

    componentDidMount() {
        this.getCityData();
    }
    getCityData=()=>{
        var that = this;
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/credit/accredit/getCityInfo',
            data:{
                channel_type:"SHE_BAO",
            }
        }).then((data)=>{
            that.setState({
                cityListData: data.cityList
            });
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        }) 
    }

    // 弹出选择器改变验证方式
    changeYanzhengType =(value) =>{
        var thisValue = value[0];
        // thisObj为选中的验证方式项 的对象形式{ value: "aaa", label: "bbb" }
        var thisObj = this.state.vertifyWayPickerData.filter(function (item) {
            return item.value === thisValue;
        })[0]

        this.setState({
            curVertifyWayName: "login_type",
            curVertifyWayValue: thisObj.value,
            curVertifyWayLabel: thisObj.label,
        })
    }

    changeLoginItem=(event, name)=> { // 用户输入的时候，保存当前验证项的 name和value
        var obj = {
            name: name,
            value: event.target.value,
        }
        if(obj.value===""){
            delete obj.value;
        }
        var o = {}
        o[name] = obj;
        var outPutList = [];
        var oldParams = this.state.params;
        var newParams = Object.assign({}, oldParams, o);

        Object.keys(newParams).forEach(function (key) {
            outPutList.push(newParams[key])
        })
        this.setState({
            params: newParams,
            curFieldsData: outPutList,
        });
    }


    setPickerData=(arr)=>{ // 设置验证方式选择picker数据
        var arr1=arr.map(function(item){
            return {value: item.value, label: item.label}
        });
        this.setState({
            vertifyWayPickerData: arr1,
        })
    }

    // 用picker选择城市后的回调
    setCity=(value)=> {
        var that = this;
        var provinceCode = value[0];
        var cityCode = value[1];

        var provinceName = ""; // 省 或 直辖市
        var cityName = ""; // 市
        var curCityCode = ""; // 当前
        var beSelectedCity = [];

        cityData.forEach(function (obj) {
            if (obj.value === provinceCode) {
                provinceName = obj.label;
                obj.children.forEach(function (obj1) {
                    if (obj1.value === cityCode) {
                        cityName = obj1.label;
                    }
                });
            }
        });

        if (provinceName === "北京市" ||
            provinceName === "重庆" ||
            provinceName === "上海市" ||
            provinceName === "天津市"
        ) {
            curCityCode = provinceCode;
            beSelectedCity = [provinceCode];
        }
        else {
            curCityCode = cityCode;
            beSelectedCity = [provinceCode, cityCode];
        }
        that.setState({
            curCityCode: curCityCode,
            beSelectedCity: beSelectedCity,
        });
        let flag=true;
        if (that.state.cityListData.length) {
            that.state.cityListData.forEach(function (item, index) { // 遍历获取到并保存的城市列表
                if (item.channel_code === curCityCode){ // 匹配上了 城市数据中有选择的该城市
                    that.setState({
                        curVertifyParams: item.loginParams,
                        curVertifyWayName: item.loginParams[0].name,
                        curVertifyWayValue: item.loginParams[0].value,            
                        curVertifyWayLabel: item.loginParams[0].label,
                    });
                    flag=false;
                    that.setPickerData(item.loginParams);
                }
            });
        }else {
            flag=true;
        }
        if(flag){
            that.setState({
                noData: true
            }) 
        }else{
            that.setState({
                noData: false
            })
        }
    }

    //提交事件
    submit=()=>{
        var that=this;
        let {curFieldsData}=that.state;
        that.props.form.validateFields((error, values) => {
            if(!error){
                let ajaxValue=false;
                for(let v in curFieldsData){
                    if(curFieldsData[v].value){
                        ajaxValue=true;
                    }
                }
                if(ajaxValue){
                    Loading.show();
                    $.ajaxE({
                        type: 'POST',
                        url: '/credit/accredit/submitLoginParams',
                        data: {
                            content_type:"sb",
                            loginSbgjjParams:{
                                loginParams:{
                                    name: that.state.curVertifyWayName,
                                    value: that.state.curVertifyWayValue,
                                    fields: curFieldsData, 
                                },
                                channel_code:that.state.curCityCode,
                            },
                            
                        },
                    }).then((json) => {
                        that.setState({
                            isPopupShow: true,
                        });
                        setTimeout(that.queryMobileInterval, 3000);
                    }).catch((msg) => {
                        Modal.infoX(msg);
                    }).finally(()=>{
                        Loading.hide();
                    }) 
                }else{
                    Modal.alertX('提醒', '信息不能为空', [{
                        text: '知道了', onPress: () => {}
                    }]);
                }
            }
        });   
    }

    //获取状态
    queryMobileInterval=()=>{
        let _this = this;
        // 200;//验证成功，正在抓取
        // 201;//操作失败  
        // 2501;// 继续查询
        // 2502;// 通道不支持
        // 2503;//等待输入短信验证码
        // 2504;//等待输入图片验证码
        // 2505;//等待输入短信验证码和图片验证码
        let queryGrabStatus = ()=>{
            $.ajaxEX({
                type: 'POST',
                url: '/credit/accredit/queryGrabStatus',
                data: {
                    content_type: "sb",
                }
            }).then((json) => {    
                switch (json.status) {
                    case 200:{
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: "/credit",
                        })
                        break;
                    }
                    case 201:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '再试试', onPress: () => {
                                }
                            }]
                        )
                        break;
                    }
                    //继续轮询
                    case 2501:{
                        setTimeout(_this.queryMobileInterval, 3000);
                        break;
                    }
                    //通道不支持
                    case 2502:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', "社保网站正在维护，暂时不支持社保认证", [
                            {
                                text: '知道了', onPress: () => {
                                }
                            }              
                        ]);                        
                        break;
                    }
                    //等待输入短信验证码                
                    case 2503:{
                        debugger
                        _this.setState({
                            isPopupShow: false
                        });
                        _this.props.history.push({
                            pathname: '/credit/social_security_second',
                            query: {
                                creditPhoneNo: _this.props.userStore.userInfo.telephone
                            }
                        });
                        break;
                    }
                    //等待输入图片验证码
                    case 2504:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '知道了', onPress: () => {
                                    
                                }
                            }
                        ]); 
                        break;
                    }
                    //等待输入短信验证码和图片验证码
                    case 2505:{
                        _this.setState({
                            isPopupShow: false
                        });
                        Modal.alertX('提醒', json.msg, [
                            {
                                text: '知道了', onPress: () => {
                                    
                                }
                            }    
                        ]);
                        break;
                    } 
                }
            }).catch((msg) => {
                Modal.infoX(msg);
            });
        }
        queryGrabStatus();
    }


    render() {
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-shebao.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">社保所在地</span>
                    </Flex>
                    <List className="form-list">
                        <Picker
                            title=""
                            extra={"请选择地址"}
                            data={cityData}
                            value={this.state.beSelectedCity}
                            onOk={this.setCity}
                            cols={2}
                        >
                        <List.Item arrow="horizontal"></List.Item>
                        </Picker>
                    </List>
                    {!this.state.noData && this.state.curVertifyParams.length>1?<div>
                        <Flex className="single">
                            <span className="form-line"></span>
                            <span className="form-font">验证方式</span>
                        </Flex>
                        <List className="form-list">
                            <Picker 
                                data={this.state.vertifyWayPickerData} 
                                cols={1} {...getFieldProps('district3')} className="forss"
                                onOk={this.changeYanzhengType}
                                extra={this.state.curVertifyWayLabel}
                            ><List.Item></List.Item>
                            </Picker>
                        </List>
                    </div>:null}

                    {!this.state.noData && this.state.curVertifyParams.map((item, index)=> {
                            return (
                                <div key={index}>
                                    <div hidden={item.value !== this.state.curVertifyWayValue}>
                                        {
                                            item.fields.map( (item1, index1)=> {
                                                return (
                                                    <UlComp key={index1} label={item1.label} type={item1.type} name={item1.name} inputClick={this.changeLoginItem}></UlComp>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })    
                    }
                    {this.state.noData?<div className="nodata">该城市暂不支持社保查询</div>:null}
                    <Side>
                        <p>社保账号获取指引:</p>
                        <p>打开浏览器，输入社保所在地信息进行查询，例如：搜索“北京社保查询”、“上海社保查询”</p>
                        <p>点击进入社保所在地的社会保障官方网站</p>
                        <p>在官方网站上找到登录区或登录窗口</p>
                        <p>在登录区可以进行登录、注册、找回密码等操作</p>
                        <p>根据自己所需服务选择对应功能，按提示进行操作</p>
                    </Side>
                </div>
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>同意授权</Tap>
                </div>

                <div className="backdrop" hidden={!this.state.isPopupShow}>
                    <div className="waiting slide-bottom-transition">
                        <img src={'/imgs/pay/wait.svg'} />
                        <div className="title_op">正在验证，请不要离开</div>
                        <div className="box_op">今借到平台自身不放款，只提供信息服务<br />您需要把自己的借款信息分享给他人知道</div>
                    </div>
                </div>          
            </div>
        )
    }
}


class UlComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    chagneC(event) {
        this.props.inputClick(event, this.props.name);

    }
    render() {
        return (
            <div>
                <Flex className="single">
                    <span className="form-line"></span>
                    <span className="form-font">{this.props.label}</span>
                </Flex>
                <List className="form-list">
                    <InputItem
                        type={this.props.type}
                        placeholder={"请输入" + this.props.label}
                        clear
                        onKeyUp={this.chagneC.bind(this)}
                    >
                    </InputItem>
                </List>
            </div>
        )
    }
}


export default createForm()(Page);



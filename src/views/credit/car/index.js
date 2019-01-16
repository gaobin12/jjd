//信用报告
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Picker,Flex  } from 'antd-mobile'
import { createForm } from 'rc-form'
import {Tap, ImgUpload,Tips} from 'COMPONENT'
import { Loading,Modal } from 'SERVICE'

const cityData = require('SERVICE/city_data2.js');

// 行驶里程数据
const mileageList = [{
    label: "1万内",
    value: "1万内"
}, {
    label: "1-3万",
    value: "1-3万"
}, {
    label: "3-5万",
    value: "3-5万"
}, {
    label: "5-8万",
    value: "5-8万"
}, {
    label: "8-10万",
    value: "8-10万"
}, {
    label: "10万外",
    value: "10万外"
}];

// 付款状态数据
const payState = [{
    label: "全款已付清",
    value: "全款已付清"
}, {
    label: "分期已付清",
    value: "分期已付清"
}, {
    label: "分期付款中",
    value: "分期付款中"
}];

// 车龄数据
let carAge = [{
    label: "1年以内",
    value: "1年以内"
}, {
    label: "1 - 3年",
    value: "1 - 3年"
}, {
    label: "3 - 5年",
    value: "3 - 5年"
}, {
    label: "5 - 6年",
    value: "5 - 6年"
}, {
    label: "6年以上",
    value: "6年以上"
}];

// 是否为二手车
let isUsed = [{
    label: "是",
    value: "是"
}, {
    label: "否",
    value: "否"
}]


// 是否抵押过
let isMortgage = [{
    label: "是",
    value: "是"
}, {
    label: "否",
    value: "否"
}]

@withRouter
class Page extends Component {
    constructor(props, context) {
        document.title = "车产信息";
        super(props, context)

        this.state = {
            mileageList: mileageList,//行驶里程数据
            payState: payState,//付款状态数据
            carAge: carAge,//车龄数据
            isMortgage: isMortgage,//是否抵押过
            isUsed: isUsed,//是否为二手车

            display_name: 'none',//显示隐藏
            isShowing:false,//已付金额是否显示

            car_mileage: '', //行驶里程初始值
            car_pay_status: '',//付款状态初始值
            c_car_age: '',  //车龄初始值
            car_brand: '',  //品牌类型（填写）
            car_price: '',  //购买价格（填写）
            car_is_mortgage: '',  //是否抵押过
            car_is_used: '',  //是否使用过
            car_paid: '',//车款还贷金额
            // 城市
            level_1_code: '',//省编码
            level_1_name: '',//省名字
            level_2_code: '',//市编码
            level_2_name: '',//市名字

            modal1: false,//车型弹窗提示
            modal2: false,//价格弹窗提示
            modal3: false,//已还金额弹窗提示
            //上传图片
            imgsUrl:[]
        };
    }
    // 选择城市方法
    pickercity = (v) => {
        // 获取全部数据
        let ww = cityData;
        let hs = [];
        // 遍历循环获取label值
        for (let i = 0; i < ww.length; i++) {
            if (ww[i].value == v[0]) {
                hs[0] = ww[i].label;
                let child1 = ww[i].children;
                for (let j = 0; j < child1.length; j++) {
                    if (child1[j].value == v[1]) {
                        hs[1] = child1[j].label;
                        let child2 = child1[j].children;
                    }
                }
            }
        }
        // 将修改的值放到state
        this.setState({
            level_1_code: v[0],
            level_1_name: hs[0],
            level_2_code: v[1],
            level_2_name: hs[1],
        })

    }

    // 调接口
    componentDidMount() {
        this.getCarProve();
    }

    //上传图片
    onUploadImg=(imgs)=>{
        this.state.imgsUrl = imgs;
    }

    //切换标签
	onTab=(ob,type)=>{
		if(type=='car_mileage'){
            this.setState({
                car_mileage:ob.value
            })
		}else if(type=='car_pay_status'){
            if (ob.value=='分期付款中'){
                this.setState({
                    car_pay_status:ob.value,
                    isShowing:true,
                })
            }else{
                this.setState({
                    car_pay_status:ob.value,
                    isShowing:false,
                })
            }
		}else if(type=='car_age'){
            this.setState({
                car_age:ob.value
            })
		}else if(type=='car_is_used'){
            this.setState({
                car_is_used:ob.value
            })
		}else if(type=='car_is_mortgage'){
            this.setState({
                car_is_mortgage:ob.value
            })
		}
	}


    // 获取页面初始化数据
    getCarProve = () => {
        let that = this;
        let { isShowing, display_name, car_paid, car_mileage, car_pay_status, car_age, car_brand, car_price, car_is_mortgage, car_is_used } = this.state
        
        $.ajaxE({
            type: 'GET',
            url: "/credit/accredit/getInfo",
            data: {
                system_type: "jjd",
                content_type: "car",
            }
        }).then((data) => {
            if (!data.carInfo) {
                return;
            }
            // 判断抵押
            if (data.carInfo.car_is_mortgage) {
                that.setState({
                    car_is_mortgage:'是'
                }) 
            } else {
                that.setState({
                    car_is_mortgage: '否'
                })
            }
            
            // 判断二手车
            if (data.carInfo.car_is_used) {
                that.setState({
                    car_is_used: '是'
                })
            } else {
                that.setState({
                    car_is_used: '否'
                })
            }
            // 判断车款是否是分期付款中
            if (data.carInfo.car_pay_status=='分期付款中'){
                that.setState({
                    // display_name:'block',
                    isShowing:true
                })
            }
            this.setState({
                car_mileage: data.carInfo.car_mileage,
                car_pay_status:data.carInfo.car_pay_status,
                car_age:data.carInfo.car_age,
                car_brand:data.carInfo.car_brand,
                car_price:data.carInfo.car_price,
                // car_is_mortgage: car_is_mortgage,
                // car_is_used: car_is_used,
                car_paid:data.carInfo.car_paid,
                // 城市
                level_1_code:data.carInfo.level_1_code,
                level_1_name:data.carInfo.level_1_name,
                level_2_code:data.carInfo.level_2_code,
                level_2_name:data.carInfo.level_2_name,
                // 图片
                imgsUrl:data.carInfo.car_image_list?data.carInfo.car_image_list:[],

            })

        }).catch((msg) => {
            console.log(msg);
        })
    }


    // 提交表单
    submit = () => {
        let { car_paid, files,car_image_list, car_mileage, car_pay_status, car_age, car_brand, car_price, car_is_mortgage, car_is_used, level_1_code, level_2_code, level_1_name, level_2_name } = this.state
        // 判断抵押 是否
        if (car_is_mortgage == "是") {
            car_is_mortgage = true
        } else {
            car_is_mortgage = false
        }
        // 判断车使用 是否
        if (car_is_used == "是") {
            car_is_used = true
        } else {
            car_is_used = false
        }

        this.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url: "/credit/accredit/saveInfo",
                    contentType: 'application/json',
                    data: {
                        //类型
                        content_type: 'car',
                        carInfo:{
                            car_mileage: car_mileage,
                            car_pay_status: car_pay_status,
                            car_age: car_age,
                            car_brand: values.car_brand,
                            car_price: values.car_price,
                            car_is_mortgage: car_is_mortgage,
                            car_is_used: car_is_used,
                            car_image_list: this.state.imgsUrl,
                            car_paid: values.car_paid,
                            // 城市
                            level_1_code: values.cityData2[0],
                            level_1_name: level_1_name,
                            level_2_code: values.cityData2[1],
                            level_2_name: level_2_name,
                        }                      
                    }                    
                }).then((data) => {
                    this.props.history.push({
                        pathname: '/credit'
                    });
                }).catch((msg) => {
                    Modal.infoX(msg);
                }).finally(()=>{
                    Loading.hide();
                })

            }
        });

    }
    
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { files, display_name, isShowing } = this.state;
        return (
            <div className='view-credit-all view-credit-carorhouse'>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-car.svg'} />
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">品牌类型</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            {...getFieldProps('car_brand', {
                                initialValue: this.state.car_brand,
                                rules: [{ required: true, message: '请输入车辆品牌类型' }],
                                validateTrigger:'onBlur'
                            })}
                            type="text"
                            clear
                            placeholder="请输入车辆品牌类型"
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('car_brand') && getFieldError('car_brand').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">行驶里程/公里 </span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{this.state.mileageList.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'car_mileage')}} key={Math.random()}>
										<span className={this.state.car_mileage!=null && this.state.car_mileage==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">购买价格</span>
                    </Flex>
                    <List className="border_bott">
                        <InputItem
                            {...getFieldProps('car_price', {
                                initialValue: this.state.car_price,
                                rules: [{ required: true, message: '请输入整数' }],
                            })}
                            type="number"
                            placeholder="请输入整数"
                            className="login_input"
                            extra='万元' 
                        ></InputItem>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">付款状态</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{payState.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'car_pay_status')}} key={Math.random()}>
										<span className={this.state.car_pay_status!=null && this.state.car_pay_status==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>
                    {/* 选择付款中出现这个input */}
                    {isShowing ? <div >
                        <Flex className="single">
                            <span className="form-line"></span>
                            <span className="form-font">已支付</span>
                        </Flex>
                        <List className="border_bott">
                            <InputItem
                                {...getFieldProps('car_paid', {
                                    initialValue: this.state.car_paid,
                                    rules: [{ required: true, message: '请输入整数' }],
                                })}
                                type="number"
                                placeholder="请输入整数"
                                className="login_input"
                                extra='万元' 
                            ></InputItem>
                        </List>
                    </div>:null}
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">登记城市</span>
                    </Flex>
                    <List className="form-list">
                        <Picker
                            {...getFieldProps('cityData2', {
                                initialValue: [this.state.level_1_code, this.state.level_2_code],
                                rules: [{ required: true, message: '请选择登记城市' }],
                            })}
                            value={[this.state.level_1_code, this.state.level_2_code]}
                            onOk={(v) => { this.pickercity(v, "cityData") }}
                            data={cityData}
                            cols={2}
                        ><List.Item arrow="horizontal"></List.Item>
                        </Picker>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">车龄</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{carAge.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'car_age')}} key={Math.random()}>
										<span className={this.state.car_age!=null && this.state.car_age==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">是否为二手车</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{isUsed.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'car_is_used')}} key={Math.random()}>
										<span className={this.state.car_is_used!=null && this.state.car_is_used==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">是否抵押过</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{isMortgage.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'car_is_mortgage')}} key={Math.random()}>
										<span className={this.state.car_is_mortgage!=null && this.state.car_is_mortgage==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">证明图片</span>
                    </Flex>
                    {/* 上传图片 */}
                    <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                        请上传您本人的车辆登记证、购买发票、车身照片、保险单等车产证明图片，要求清晰真实，不可后期处理（不超过9张）
                        </div>
                        {this.state.imgsUrl.length?<ImgUpload imgUrls={this.state.imgsUrl} onChange={this.onUploadImg} iou={false} />
                        :null}
                        {!this.state.imgsUrl.length?<ImgUpload imgUrls={this.state.imgsUrl} onChange={this.onUploadImg} iou={false} />
                        :null}
                    </div>
                </div>
                
                <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>完成</Tap>
                </div>
            </div>
        )
    }
}
export default createForm()(Page);
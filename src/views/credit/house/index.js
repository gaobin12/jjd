
//信用报告
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem, Picker,Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Loading,Modal } from 'SERVICE'
import {Tap, ImgUpload,Tips} from 'COMPONENT'


const cityData3 = require('SERVICE/city_data.js');
let houseList = [{
    label: "商品住房",
    value: "商品住房"
}, {
    label: "商住两用房",
    value: "商住两用房"
}, {
    label: "写字楼",
    value: "写字楼"
}, {
    label: "经济适用房",
    value: "经济适用房"
}, {
    label: "整体式商铺",
    value: "整体式商铺"
}, {
    label: "隔断式商铺",
    value: "隔断式商铺"
}, {
    label: "小产权房",
    value: "小产权房"
}, {
    label: "房改房",
    value: "房改房"
}];

// 付款状态数据
let payState = [{
    label: "全款已付清",
    value: "全款已付清"
}, {
    label: "分期已付清",
    value: "分期已付清"
}, {
    label: "分期付款中",
    value: "分期付款中"
}];

// 房龄数据
let houseAge = [{
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

// 是否为二手房
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
        document.title = "房产信息";
        super(props, context)
        this.state = {
            houseList: houseList,//房子类型数据
            payState: payState,//付款状态数据
            houseAge: houseAge,//房龄数据
            isUsed: isUsed,//是否二手房
            isMortgage, isMortgage,//是否抵押过

            display_name: 'none',//显示隐藏
            isShowing: false,//已付金额是否显示
            // 所在城市
            level_1_code: '',
            level_1_name: '',
            level_2_code: '',
            level_2_name: '',
            level_3_code: '',
            level_3_name: '',

            house_address: '',//房子地址
            house_type: '',//房型
            house_pay_status: '',//付款状态
            house_age: '',//房龄
            house_paid: '',//已支付金额
            house_area: '',//房屋面积
            house_price: '',//房价

            house_is_mortgage: false,//是否抵押
            house_is_used: false,//是否二手
            // 图片上传
            imgsUrl:[],
        };
    }

    //上传图片
    onUploadImg=(imgs)=>{
        this.state.imgsUrl = imgs;
    }

    // 选择城市方法
    pickercity = (v) => {
        let ww = cityData3;
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
                        for (let k = 0; k < child2.length; k++) {
                            if (child2[k].value == v[2]) {
                                hs[2] = child2[k].label;
                            }
                        }
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
            level_3_code: v[2],
            level_3_name: hs[2]
        })
    }


    // 调接口
    componentDidMount() {
        this.getHouseProve();

    }

    // 获取后台数据
    getHouseProve = () => {
        let that = this;
        let {isShowing, display_name, house_is_mortgage, house_is_used, house_address, house_type, house_pay_status, house_age, house_paid, house_area, house_price } = this.state
        $.ajaxE({
            type: 'GET',
            url: "/credit/accredit/getInfo",
            data: {
                system_type: "jjd",
                content_type: "house",
            },
        }).then((data) => {
            if (!data.houseInfo) {
                return;
            }
            // 判断抵押
            if (data.houseInfo.house_is_mortgage) {
                that.setState({
                    house_is_mortgage:'是'
                })
            } else {
                that.setState({
                    house_is_mortgage: '否'
                })
            }
            // 判断二手
            if (data.houseInfo.house_is_used) {
                that.setState({
                    house_is_used: '是'
                })
            } else {
                that.setState({
                    house_is_used: '否'
                })
            }
           
            // 判断车款是否是分期付款中
            if (data.houseInfo.house_pay_status == '分期付款中') {
                that.setState({
                    // display_name: 'block',
                    isShowing: true,
                })
            }

            this.setState({
                house_address: data.houseInfo.house_address,
                house_type: data.houseInfo.house_type,
                house_pay_status: data.houseInfo.house_pay_status,
                house_age: data.houseInfo.house_age,
                house_paid: data.houseInfo.house_paid,
                house_area: data.houseInfo.house_area,
                house_price: data.houseInfo.house_price,
                // 城市
                level_1_code: data.houseInfo.level_1_code,
                level_1_name: data.houseInfo.level_1_name,
                level_2_code: data.houseInfo.level_2_code,
                level_2_name: data.houseInfo.level_2_name,
                level_3_code: data.houseInfo.level_3_code,
                level_3_name: data.houseInfo.level_3_name,
                imgsUrl:data.houseInfo.house_image_list?data.houseInfo.house_image_list:[],

            })

        }).catch((msg) => {
            console.log(msg);
        })
    }


    // 提交表单
    submit = () => {
        
        let { house_is_mortgage,house_is_used, house_address, house_type, house_pay_status, house_age, house_paid, house_area, house_price } = this.state
        let { level_1_code, level_2_code, level_3_code, level_1_name, level_2_name, level_3_name } = this.state
        
        // 判断抵押 是否
        if (house_is_mortgage == "是") {
            house_is_mortgage = true
        } else {
            house_is_mortgage = false
        }
        // 判断车使用 是否
        if (house_is_used == "是") {
            house_is_used = true
        } else {
            house_is_used = false
        }

        this.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                // 提交数据库数据
                $.ajaxE({
                    type: 'POST',
                    url: "/credit/accredit/saveInfo",
                    contentType: 'application/json',
                    data: {
                        //类型
                        content_type: 'house',
                        houseInfo:{
                            house_address: values.house_address,
                            house_type: house_type,
                            house_pay_status: house_pay_status,
                            house_age: house_age,
                            house_paid: values.house_paid,
                            house_area: values.house_area,
                            house_price: values.house_price,

                            house_is_mortgage: house_is_mortgage,
                            house_is_used: house_is_used,

                            // 城市
                            level_1_code: values.cityData[0],
                            level_1_name: level_1_name,
                            level_2_code: values.cityData[1],
                            level_2_name: level_2_name,
                            level_3_code: values.cityData[2],
                            level_3_name: level_3_name,
                            // 图片
                            house_image_list: this.state.imgsUrl,
                        }
                      
                    }

                }).then((data) => {
                    // 跳转页面
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

        // }
    }

    //切换标签
	onTab=(ob,type)=>{
		if(type=='house_type'){
            this.setState({
                house_type:ob.value
            })
		}else if(type=='house_pay_status'){
            if (ob.value=='分期付款中'){
                this.setState({
                    house_pay_status:ob.value,
                    isShowing:true,
                })
            }else{
                this.setState({
                    house_pay_status:ob.value,
                    isShowing:false,
                })
            }
		}else if(type=='house_age'){
            this.setState({
                house_age:ob.value
            })
		}else if(type=='house_is_used'){
            this.setState({
                house_is_used:ob.value
            })
		}else if(type=='house_is_mortgage'){
            this.setState({
                house_is_mortgage:ob.value
            })
		}
    }
    
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { display_name, isShowing } = this.state;
        return (
            <div className='view-credit-all view-credit-carorhouse'>
                <div style={{height: '100%',overflow:'auto',paddingBottom:'0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-house.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">所在城市</span>
                    </Flex>
                    <List className="form-list">
                        <Picker
                            {...getFieldProps('cityData', {
                                initialValue: [this.state.level_1_code,this.state.level_2_code, this.state.level_3_code],
                                rules: [{ required: true, message: '请选择地区' }],
                            })}
                            value={[this.state.level_1_code, this.state.level_2_code, this.state.level_3_code]}
                            extra="请选择"
                            data={cityData3}
                            cols={3}
                            onOk={(v) => { this.pickercity(v,'cityData') }}
                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </Picker>
                        <div className='common-jc-error'>{getFieldError('cityData') && getFieldError('cityData').join(',')}</div>
                    </List>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">详细地址</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            {...getFieldProps('house_address', {
                                initialValue: this.state.house_address,
                                rules: [{ required: true, message: '请填写详细地址' }],
                                validateTrigger:'onBlur'
                            })}
                            type="text"
                            clear
                            placeholder="**路**小区**单元"
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('car_brand') && getFieldError('car_brand').join(',')}</div>
                    </List>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">房屋类型</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{houseList.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'house_type')}} key={Math.random()}>
										<span className={this.state.house_type!=null && this.state.house_type==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">房屋面积</span>
                    </Flex>
                    <List className="border_bott">
                        <InputItem
                            {...getFieldProps('house_area', {
                                initialValue: this.state.house_area,
                                rules: [{ required: true, message: '请输入房屋面积' }],
                            })}
                            type="number"
                            placeholder="请输入整数"
                            className="login_input"
                            extra='m²' 
                        ></InputItem>
                    </List>
                    <div className='common-jc-error'>{getFieldError('house_area') && getFieldError('house_area').join(',')}</div>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">购买价格</span>
                    </Flex>
                    <List className="border_bott">
                        <InputItem
                            {...getFieldProps('house_price', {
                                initialValue: this.state.house_price,
                                rules: [{ required: true, message: '请输入购买价格' }],
                            })}
                            type="number"
                            placeholder="请输入整数"
                            className="login_input"
                            extra='万元' 
                        ></InputItem>
                    </List>
                    <div className='common-jc-error'>{getFieldError('house_price') && getFieldError('house_price').join(',')}</div>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">付款状态</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{payState.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'house_pay_status')}} key={Math.random()}>
										<span className={this.state.house_pay_status!=null && this.state.house_pay_status==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

                    {isShowing ? <div >
                        <Flex className="single">
                            <span className="form-line"></span>
                            <span className="form-font">已支付</span>
                        </Flex>
                        <List className="border_bott">
                            <InputItem
                                {...getFieldProps('house_paid', {
                                    initialValue: this.state.house_paid,
                                    rules: [{ required: true, message: '请输入已付金额' }],
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
                        <span className="form-font">房龄</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{houseAge.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'house_age')}} key={Math.random()}>
										<span className={this.state.house_age!=null && this.state.house_age==item.value?'use-item selected':'use-item'}>
											<span>{item.label}</span>
										</span>
									</Tap>
							})}
                        </div>
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">是否是二手房</span>
                    </Flex>
                    <Flex justify='start'>
                        <div className='use-content'>
							{isUsed.map((item)=>{
								return <Tap onTap={()=>{this.onTab(item,'house_is_used')}} key={Math.random()}>
										<span className={this.state.house_is_used!=null && this.state.house_is_used==item.value?'use-item selected':'use-item'}>
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
								return <Tap onTap={()=>{this.onTab(item,'house_is_mortgage')}} key={Math.random()}>
										<span className={this.state.house_is_mortgage!=null && this.state.house_is_mortgage==item.value?'use-item selected':'use-item'}>
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
                    <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                        请上传您本人的房产证、购房合同等房产证明图片，要求清晰真实，不可后期处理 (不超过9张)
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
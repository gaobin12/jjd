// 信用报告 => 工作信息 
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Picker, List, InputItem, DatePicker,Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import {Tap, ImgUpload,Tips} from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

const cityData = require('SERVICE/city_data.js');

@withRouter
class Page extends Component {
    constructor(props, context) {
        document.title = "工作信息";
        super(props, context)

        this.state = {
            company_name: "",//公司名称
            position:"",//职位
            employment_date: "",//入职时间在这设置  设置固定某一天还是设置今天今天概念
            company_tel: "",//公司电话
            company_address: "",//公司地址
            // 城市
            level_1_code: '',//省编码
            level_1_name: '',//省名字
            level_2_code: '',//市编码
            level_2_name: '',//市名字
            level_3_code: "",//区编码
            level_3_name: "",//区名字

             // 图片上传
             imgsUrl: [],
        };
    };

    //上传图片
    onUploadImg=(imgs)=>{
        this.state.imgsUrl = imgs;
    }


    // 调接口
    componentDidMount() {
        this.getJobProve();
    }

    getJobProve=()=>{
        let that = this;
        let { company_image_list, level_1_name, level_2_name, level_3_name, level_1_code, level_2_code, level_3_code, company_name, position, employment_date, company_tel, company_address}=this.state
        $.ajaxE( {
            type: 'GET',
            url: "/credit/accredit/getInfo",
            data: {
                system_type: "jjd",
                content_type: "job",
            }
        }).then((data) => {
            if (!data.jobInfo) {
                return;
            }
            // 从后台获取的时间戳转为日期
            let date = new Date(data.jobInfo.employment_date * 1000)
            this.setState({
                company_name: data.jobInfo.company_name,
                position: data.jobInfo.position,
                employment_date: date,
                company_tel: data.jobInfo.company_tel,
                company_address: data.jobInfo.company_address,
                // 城市
                level_1_code: data.jobInfo.level_1_code,
                level_1_name: data.jobInfo.level_1_name,
                level_2_code: data.jobInfo.level_2_code,
                level_2_name: data.jobInfo.level_2_name,
                level_3_code: data.jobInfo.level_3_code,
                level_3_name: data.jobInfo.level_3_name,
                // 图片
                imgsUrl: data.jobInfo.company_image_list?data.jobInfo.company_image_list:[],
            })
        }).catch((msg) => {
            console.log(msg);
        })
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
    // 选择入职时间(转为时间戳)
    setTime=(v)=>{
        let date = new Date(v);
        let time = Math.round(date.getTime() / 1000);
        this.setState({
            employment_date: time,
        });
    }
    

    submit=()=>{
        let {level_1_name, level_2_name, level_3_name, level_1_code, level_2_code, level_3_code, company_name, position, employment_date, company_tel, company_address } = this.state
        // 判断如果是时间戳不处理 否则转为时间戳
        if(employment_date instanceof Date){
            let date = new Date(employment_date);
            employment_date = Math.round(date.getTime() / 1000);
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                $.ajaxE( {
                    type: 'POST',
                    url: "/credit/accredit/saveInfo",
                    contentType: 'application/json',
                    data: {
                        //类型
                        content_type: 'job',
                        jobInfo: {
                            company_name: values.company_name,
                            position: values.position,
                            employment_date: employment_date,
                            company_tel: values.company_tel,
                            company_address: values.company_address,

                            // 城市
                            level_1_code: values.cityData3[0],
                            level_1_name: level_1_name,
                            level_2_code: values.cityData3[1],
                            level_2_name: level_2_name,
                            level_3_code: values.cityData3[2],
                            level_3_name: level_3_name,
                            // 图片
                            company_image_list: this.state.imgsUrl,
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



    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-job.svg'} />
                    </Flex>

                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">公司名称</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="text"
                            clear
                            placeholder="请输入公司名称"
                            {...getFieldProps('company_name', {
                                initialValue: this.state.company_name,
                                rules: [{ required: true, message: '请输入公司名称' }],
                                validateTrigger:'onBlur'
                            })}
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('company_name') && getFieldError('company_name').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">工作职位</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="text"
                            clear
                            placeholder="请输入工作职位"
                            {...getFieldProps('position', {
                                initialValue: this.state.position,
                                rules: [{ required: true, message: '请输入工作职位' }],
                                validateTrigger:'onBlur'
                            })}
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('position') && getFieldError('position').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">入职时间</span>
                    </Flex>
                    <List className="form-list">
                        <DatePicker
                            mode="date"
                            extra={"请选择入职时间"}
                            value={this.state.employment_date}
                            onOk={(v) => { this.setTime(v,"employment_date")}}
                            {...getFieldProps('employment_date', {
                                initialValue: this.state.employment_date,
                                rules: [{ required: true, message: '请选择入职时间' }],
                            })}
                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </DatePicker>
                        <div className='common-jc-error'>{getFieldError('employment_date') && getFieldError('employment_date').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">联系电话</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="text"
                            clear
                            placeholder="请输入公司固定电话"
                            {...getFieldProps("company_tel", {
                                initialValue: this.state.company_tel,
                                rules:[{ 
                                        pattern: /^0\d{2,3}-?\d{7,8}$/, message: '固定电话格式不正确!'
                                    },{ 
                                        required: true, message: "请输入公司固定电话" 
                                    },
                                ],
                                validateTrigger:'onBlur'
                            })}
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('company_tel') && getFieldError('company_tel').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">所在城市</span>
                    </Flex>
                    <List className="form-list">
                        <div style={{ marginTop: "10px", backgroundColor: "transparent" }}></div>

                        <Picker
                            {...getFieldProps("cityData3",{
                                initialValue: [this.state.level_1_code ,this.state.level_2_code ,this.state.level_3_code],
                                rules: [{ required: true, message: '请选择所在城市' }],
                            })}
                            extra={"请选择所在城市"}
                            data={cityData}
                            cols={3}
                            onOk={(v) => { this.pickercity(v, "cityData") }}

                        >
                            <List.Item arrow="horizontal"></List.Item>
                        </Picker>
                        <div className='common-jc-error'>{getFieldError('cityData3') && getFieldError('cityData3').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">详细地址</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            type="text"
                            clear
                            placeholder="**路**小区**单元"
                            {...getFieldProps("company_address", {
                                initialValue: this.state.company_address,
                                rules: [{ required: true, message: "请输入详细地址" }],
                                validateTrigger:'onBlur'
                            })}  
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('company_address') && getFieldError('company_address').join(',')}</div>
                    </List>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">证明图片</span>
                    </Flex>
                    {/* 上传图片 */}
                    <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请上传您本人的劳动合同、工牌等工作证明图片，要求清晰真实，不可后期处理 （不超过9张）
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

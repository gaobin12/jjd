
//信用报告-收入信息
import '../credit.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem,ImagePicker,Flex  } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { createForm } from 'rc-form'
import {Tap, ImgUpload,Tips} from 'COMPONENT'
import { Loading,Modal } from 'SERVICE'


@withRouter
@inject('userStore')
@observer
class Page extends Component {
    constructor(props, context) {
        document.title = "收入信息";
        super(props, context)
        this.state = {
            user_id: this.props.userStore.userInfo.userId,//必传
            earn_month:'',//收入
            // 图片上传
            imgsUrl: [],
        };
    }

    //上传图片
    onUploadImg=(imgs)=>{
        this.state.imgsUrl = imgs;
    }



    // 调接口
    componentDidMount() {
        this.getEarnProve();

    }

    // 获取数据
    getEarnProve = ()=>{
        let that = this;
        // 从state获取数据
        let { earn_month, earn_image_list } = this.state
        $.ajaxE({
            type: 'GET',
            url: "/credit/accredit/getInfo",
            data: {
                system_type: "jjd",
                content_type: "income",
            },
        }).then((data) => {
            this.setState({
                earn_month: data.earnInfo.earn_month,
                // 图片
                imgsUrl:data.earnInfo.earn_image_list
                

            })

        }).catch((msg) => {
            console.log(msg);
        })
    }

    // 提交表单
    submit = () => {
        let { earn_month } = this.state
        this.props.form.validateFields((error, values) => {
            if (!error) {
                Loading.show();
                $.ajaxE({
                    type: 'POST',
                    url: "/credit/accredit/saveInfo",
                    contentType: 'application/json',
                    data: {
                        //类型
                        content_type: 'income',
                        earnInfo:{
                            earn_month: values.earn_month,
                            // 图片
                            earn_image_list: this.state.imgsUrl,
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
        return (
            <div className='view-credit-all'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify="center" className="step_bar">
                        <img src={'/imgs/credit/sel-income.svg'} />
                    </Flex>
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">收入信息</span>
                    </Flex>
                    <List className="form-list">
                        <InputItem
                            {...getFieldProps('earn_month', {
                                initialValue: this.state.earn_month,
                                rules: [{ required: true, message: '请输入整数' }],
                                validateTrigger:'onBlur'
                            })}
                            type="number"
                            clear
                            placeholder="请输入整数"
                            extra="元"
                            // onChange={v => this.setState({ earn_month: v })}
                        ></InputItem>
                        <div className='common-jc-error'>{getFieldError('earn_month') && getFieldError('earn_month').join(',')}</div>
                    </List>
                        
                    <Flex className="single">
                        <span className="form-line"></span>
                        <span className="form-font">证明图片</span>
                    </Flex>
                    <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                        请上传您本人近六个月的银行卡流水账单、社保公积金明细等收入证明图片，要求清晰真实，不可后期处理（不超过9张）
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
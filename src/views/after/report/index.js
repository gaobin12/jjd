
//信用报告-收入信息
import '../form.less'
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List, InputItem,ImagePicker,Flex,Button,Radio,TextareaItem  } from 'antd-mobile'
import { createForm } from 'rc-form'
import {Tap, ImgUpload,Tips} from 'COMPONENT'
import { Loading, Modal, util } from 'SERVICE'
import { inject, observer } from 'mobx-react'
const RadioItem = Radio.RadioItem;
const data2 = [
    { value: 0, label: '裸条', extra: '对于裸条举报，如果借款人提供了真实的裸条凭证，平台确认后将拉黑出借人，该出借人将不能继续借款/出借。' },
    { value: 1, label: '对方不确认收款', extra: '对于出借人不确认收款的举报，如果借款人提供了有力的还款凭证，平台确认后该借条将置为“有争议“状态”并消除借款人相关的逾期记录，出借人被标记1次，标记3次后平台将限制出借人的补借条功能，也有可能会被拉黑。' },
    { value: 2, label: '完全未出借', extra: '对于出借人完全未出借的举报，如果出借人不能提供有力的出借凭证，平台确认后该借条将置为“有争议“状态”并消除借款人相关的逾期记录，出借人被标记1次，标记3次后平台将限制出借人的补借条功能，也有可能会被拉黑。' },
    { value: 3, label: '部分出借', extra: '对于出借人部分出借的举报，如果借款人确实已还清应还金额，平台确认后该借条将置为“有争议“状态”并消除借款人相关的逾期记录，出借人被标记1次，标记3次后平台将限制出借人的补借条功能，也有可能会被拉黑。' },
];
@withRouter
@inject('afterIouStore')
@observer


class Page extends Component {
    constructor(props, context) {
        document.title = "发起举报";
        super(props, context)
        let query = util.getUrlParams(this.props.location.search);  
        this.state = {
            id: query.id,
            // 图片上传
            imgsUrl: [],
            modal: false,
            value:'',
            label:'',
            info:'',
            amount: JSON.parse(sessionStorage.getItem('afterIouDetailStore')).amount,
            borrowerImg: [], // 借款人举报图片列表
            borrowerOtherImg: [], // 借款人其他图片列表
        };
    }
    componentDidMount(){
        this.getPageInfo()
    }
     //获取举报进度的 信息
    getPageInfo = () => {
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: "/loanlater/loanreport/getReportLoanDetailsStatus",
            data: {
                loanId: this.state.id
            }
        }).then((res) => {
            this.setState({
                info: res,
                value: res.reportType == 100 ? 0 : res.reportType,
                label: data2[res.reportType == 100 ? 0 : res.reportType].label
            });
        }).catch((msg) => {
            // Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    onClose =() => {
        this.setState({
            modal: false,
        });
    }

    showModal =() => {
        this.setState({
            modal: true,
        });
    }
    onChange2 = (value,label) => {
        this.setState({
            label:label,
            value: value,
        });
    };

    submit = () =>{
        
        let {info} = this.state
        this.props.form.validateFields((error, value) => {
            if (this.state.reportReasonStatus != 100 && !value.realLendAmount && this.state.reportReasonStatus != 2) {
                Modal.infoX('请填写金额')
                return
            }
            if (!value.borrowerMemo) {
                Modal.infoX('请填写补充说明')
                return
            }
            if (!error) {
                if (this.state.borrowerImg.length) {
                    //图片必传
                    if (info) {
                        if (info.identity === 2 && info.status === 1) {
                            console.log('反馈证据')
                            this.addBackReportLoan(value)

                        } else if ((info.identity === 1 && info.status === 4) || (info.identity === 2 && info.status === 3)) {
                            console.log('补充证据')
                            this.updateReportLoan(value)
                        }
                    } else {
                        console.log('首次举报')
                        this.addReportLoan(value)
                    }
                } else {
                    Modal.infoX('请上传图片')
                }
            }
           
        })
    }
    //提交举报表单
    addReportLoan = (value) => {
        let _this = this;
        let postData  = {}
        if (_this.state.value == 0){
            //裸条
            postData = {
                nakedStatus:1, // 是否是裸条举报
                loanIdE: _this.state.id, // 借条id（加密后）
                reportReasonStatus:100,// 举报原因
                borrowerImg: JSON.stringify(_this.state.borrowerImg),// 借款人举报图片列表
                borrowerMemo: value.borrowerMemo,// 借款人补充说明
                realLendAmount: this.state.amount, // 真实出借金额
                borrowerOtherImg: JSON.stringify(_this.state.borrowerOtherImg)// 借款人其他图片列表
            };
        }else{
            //1不确认收款2完全没出借3部分出借
            postData = {
                nakedStatus:0, // 是否是裸条举报
                loanIdE: _this.state.id, // 借条id（加密后）
                reportReasonStatus: _this.state.value,// 举报原因
                borrowerImg: JSON.stringify(_this.state.borrowerImg),// 借款人举报图片列表
                borrowerMemo: value.borrowerMemo,// 借款人补充说明
                realLendAmount: $.toFen(value.realLendAmount), // 真实出借金额
                borrowerOtherImg: JSON.stringify(_this.state.borrowerOtherImg)// 借款人其他图片列表
            };
            //已还待确认金额
            if (this.state.value == 1) {
                postData.realLendAmount = this.state.amount;
                postData.repaidUnconfirmAmount = $.toFen(value.realLendAmount);
            }
        }
        console.log(postData)
        Loading.show();
        // $.ajaxE({
        //     type: 'POST',
        //     url: '/loanlater/loanreport/addReportLoan',
        //     data: postData
        // }).then((data) => {
        //     // $.setItem('report_process_back_num', {
        //     //     needGoBackNum: -2 //history   go  需要返回的次数
        //     // });
        //     _this.props.history.push({
        //         pathname: '/after/report_process',
        //         search: "?id=" + this.state.id,
        //     });
        // }).catch((msg) => {
        //     Modal.infoX(msg);
        // }).finally(() => {
        //     //Loading.show();
        //     Loading.hide();
        // })
    }
    //补充证据
    updateReportLoan = (value) => {
        let { identity, reportType } = this.state.info;
        let postData = {
            nakedStatus: reportType == 100 ? 1 : 0, // 是否是裸条举报
            loanIdE: this.state.id, // 当前举报表id
            reportReasonStatus: reportType, // 举报原因
            realLendAmount: this.state.info.realLendAmount // 真实出借金额
        }
        if (identity == 2) {
            postData.lenderImg = JSON.stringify(this.state.borrowerImg);
            postData.lenderMemo = value.borrowerMemo;
            postData.lenderOtherImg = JSON.stringify(this.state.borrowerOtherImg);
        } else {
            postData.borrowerImg = JSON.stringify(this.state.borrowerImg);
            postData.borrowerMemo = value.borrowerMemo;
            postData.borrowerOtherImg = JSON.stringify(this.state.borrowerOtherImg);
        }
        console.log(postData)
        Loading.show();
        // $.ajaxE({
        //     type: 'POST',
        //     url: "/loanlater/loanreport/updateReportLoan",
        //     data: postData
        // }).then((json) => {
        //     Modal.infoX('反馈成功!', () => {
        //         if (this.state.isShare) {
        //             this.context.router.push({
        //                 pathname: '/'
        //             });
        //         } else {
        //             if (history.length > 3) {
        //                 history.go(-2)
        //             } else {
        //                 //length小于3，可能从微信推送进入，无法回退
        //                 let pathname = '';
        //                 if (this.state.identity == 2) {
        //                     //出借人
        //                     pathname = '/after/loan_detail'
        //                 } else {
        //                     //借款人
        //                     pathname = '/after/borrow_detail'
        //                 }
        //                 this.props.history.push({
        //                     pathname: pathname,
        //                     search: "?id=" + this.state.id,
        //                 });
        //             }
        //         }
        //     })
        // }).catch((msg) => {
        //     Modal.infoX(msg);
        // }).finally(() => {
        //     //Loading.show();
        //     Loading.hide();
        // })
    }
    //反馈证据 
    addBackReportLoan = (value) => {
        let postData = {};
        if (this.state.nakedStatus == 100) {
            postData = {
                nakedStatus: 1, // 是否是裸条举报
                loanIdE: this.state.id, // 当前举报表id
                reportReasonStatus: 100, // 举报原因
                lenderImg: JSON.stringify(this.state.borrowerImg), // 出借人转账图片列表
                lenderMemo: value.borrowerMemo
            }
        } else {
            postData = {
                nakedStatus: 0, // 是否是裸条举报
                loanIdE: this.state.id, // 当前举报表id
                reportReasonStatus: this.state.info.reportType, // 举报原因
                lenderImg: JSON.stringify(this.state.borrowerImg), // 出借人转账图片列表
                lenderMemo: value.borrowerMemo, // 出借人补充说明
                lenderOtherImg: JSON.stringify(this.state.borrowerOtherImg) // 出借人其他图片列表
            }
        }
        console.log(postData)
        Loading.show();
        // $.ajaxE({
        //     type: 'POST',
        //     url: "/loanlater/loanreport/addBackReportLoan",
        //     data: postData
        // }).then((json) => {
        //     Modal.infoX('反馈成功!', () => {
        //         if (this.state.isShare) {
        //             this.props.history.push({
        //                 pathname: '/'
        //             });
        //         } else {
        //             history.go(-2)
        //         }
        //     })
        // }).catch((msg) => {
        //     Modal.infoX(msg);
        // }).finally(() => {
        //     //Loading.show();
        //     Loading.hide();
        // })
    }
    //计算应还金额
    getRealAmt = (ob) => {
        let trueM = this.props.form.getFieldProps('realLendAmount').value ? this.props.form.getFieldProps('realLendAmount').value*100:0
        let res = 0, res1 = 0;
        //利息
        let datas = Math.ceil(
            (ob.repayTime * 1000 - ob.borrowTime * 1000) / (1000 * 60 * 60 * 24)
        )
        res = datas / 365 * ob.interestRate / 100 * trueM;

        if (ob.overdueDay > 0) {
            //罚息
            res1 = ob.overdueDay / 365 * 24 / 100 * (trueM + res);
        } else {
            res1 = 0;
        }
        let amt = Math.round(parseInt(trueM + res + res1) * 100) / 100 / 100;
        return amt;
    }
    onBorrowerImg = (imgs) => {
        this.state.borrowerImg = imgs;
    }

    onBorrowerImgOther = (imgs) => {
        this.state.borrowerOtherImg = imgs;
    }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let {info} = this.state
        //1不确认收款2完全没出借3部分出借
       
        return (
            <div className='view-form view-report'>
                <div style={{height: '100%',overflow:'auto',paddingBottom: '0.2rem'}}>
                    <Flex justify='between' className='list-title mar166 border'  onClick={info?'':this.showModal}>
                        <span className='title'>举报原因</span>
                        <span className="report-cause">
                            {this.state.label ? this.state.label:'请选择举报原因'}
                        <img src={'imgs/credit/arrows-rig.svg'} /></span>
                    </Flex>
                    <Modal
                    popup
                    visible={this.state.modal}
                    onClose={this.onClose}
                    animationType="slide-up"
                    >
                        <List className="report_model">
                            <div className="report_motit">
                            <p>选择举报原因</p>
                            <img src={'/imgs/iou/close_rep.svg'} onClick={this.onClose} />
                            </div>
                            {data2.map(i => (
                                <RadioItem key={i.value} checked={this.state.value === i.value} onChange={() => this.onChange2(i.value,i.label)}>
                                {i.label}<List.Item.Brief><div  className={this.state.value == i.value?"det_block":"det_none"}>{i.extra}</div></List.Item.Brief>
                                </RadioItem>
                            ))}
                            <Tap className="report_btn" onTap={this.onClose}>确定</Tap>
                        </List>
                    </Modal>
                    {this.state.value === 1 ? <Flex justify='between' className='list-title mar166 border'>
                        <span className='title flex'>已还待确金额</span>
                        <span className="report-money">
                            <InputItem
                                {...getFieldProps("realLendAmount", {
                                    rules: [
                                        { required: true, message: '请输入已还待确金额' }
                                    ],
                                })}
                                type="number"
                                placeholder="请输入金额"
                                // editable={false}
                                clear
                                extra="元"
                            ></InputItem>
                        </span>
                    </Flex> : ""}
                    {this.state.value===3?<Flex justify='between' className='list-title mar166 border'>
                        <span className='title flex'>真实出借金额</span>
                        <span className="report-money">
                            <InputItem
                                {...getFieldProps("realLendAmount",{
                                    initialValue: (info?(info.realLendAmount / 100).toFixed(2):''),
                                    rules: [
                                        
                                        { required: true, message: '请输入真实出借金额' }
                                    ],
                                })}
                                type="number"
                                placeholder="请输入金额"
                                editable={info?false:true}
                                clear
                                extra="元" 
                            ></InputItem>
                        </span>
                    </Flex>:""}
                    {/* <div className='common-jc-error'>{getFieldError('realLendAmount')}</div> */}
                    {this.state.value === 3 ?<Flex justify='between' className='list-title mar166 border'>
                        <span className='title flex'>应还金额</span>
                        <span className="report-money">
                            <InputItem
                                {...getFieldProps("repaidAmount", {
                                    initialValue: ( info?(info.repayAmount / 100).toFixed(2) : this.getRealAmt(JSON.parse(sessionStorage.getItem('afterIouDetailStore'))).toFixed(2) )
                        })}
                        type="number"
                        placeholder="请输入金额"
                                editable={false}
                                clear
                                extra="元" 
                            ></InputItem>
                        </span>
                    </Flex>:""}
                    <Flex justify='between' className='list-title mar160'  >
                        <span className='title'>上传证据</span>
                       
                        {this.state.value===''?<span className="tag">请先选择举报原因后上传所需要证据</span>:''}
                        {this.state.value !== '' ? < span className='common-jc-error'>请至少上传一个图片证据</span>:''}
                    </Flex>
                    {this.state.value===0?<div className="upload-crd-div">
                        <div className="upload-crd-tip">
                        请上传真实有效的证据，证明该借条不是裸条
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                        :null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                        :null}
                    </div>:''}
                    {this.state.value ==1 ? <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请将转账凭证请单独上传到此处（推荐线上还款只需上传还款记录截图片，线下还款仅支持银行卡/支付宝/微信）
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                    </div> : ''}
                    {this.state.value == 1 ? <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请上传其它真实有效证据（如聊天记录等）
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerOtherImg} onChange={this.onBorrowerImgOther} iou={false} />
                            : null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerOtherImg} onChange={this.onBorrowerImgOther} iou={false} />
                            : null}
                    </div> : ''}
                    {this.state.value == 2 ? <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请上传真实有效证据，证明出借人确实没有出借（如聊天记录等）
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                    </div> : ''}
                    {this.state.value == 3 ? <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请按照上面的应还金额还款并将转账凭证请单独上传到此处（推荐线上还款只需上传还款记录的截图，线下还款仅支持银行卡/支付宝/微信）
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerImg} onChange={this.onBorrowerImg} iou={false} />
                            : null}
                    </div> : ''}
                    {this.state.value == 3 ? <div className="upload-crd-div">
                        <div className="upload-crd-tip">
                            请上传真实有效的证据，证明出借人确实没有全额出借/出借人已收到还款（如聊天记录等）
                        </div>
                        {this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerOtherImg} onChange={this.onBorrowerImgOther} iou={false} />
                            : null}
                        {!this.state.imgsUrl.length ? <ImgUpload imgUrls={this.state.borrowerOtherImg} onChange={this.onBorrowerImgOther} iou={false} />
                            : null}
                    </div> : ''}
                    
                    {this.state.value!==''?<Flex justify='between' className='list-title mar166' >
                        <span className='title'>补充说明</span>
                        <span className='common-jc-error'>{getFieldError('borrowerMemo')}</span>
                    </Flex> : ''}
                    {this.state.value !== '' ?<TextareaItem
                    
                        {...getFieldProps('borrowerMemo', {
                            rules: [
                                { required: true, message: '请补充说明举报原因' }
                            ],
                        })}
                        rows={4}
                        count={100}
                        placeholder="补充说明，不超过100字"
                    /> : ''}
                </div>
                {!this.state.info?<div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>立即申请</Tap>
                </div>:null}
                {this.state.info ? <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.submit}>确认提交</Tap>
                </div> : null}

            </div>
        )
    }
}
export default createForm()(Page);
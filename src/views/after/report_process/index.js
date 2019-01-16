
//借条详情 => 展期进度
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Button, WingBlank, List, Flex, Radio} from 'antd-mobile'
import { Loading, Modal, util} from 'SERVICE'
import { Tap, ImgUpload, Tips } from 'COMPONENT'
const Item = List.Item;
const RadioItem = Radio.RadioItem;
@withRouter
export default class Page extends Component {
	constructor(props, context) {
		document.title = "举报进度";
		super(props, context)
        let query = util.getUrlParams(this.props.location.search);
		this.state = {
            id: query.id,
            modal:false,
            info: {
                lastOperateStatus: null,
                realLendAmount: 0,
                reportStatus: null,
                reportType: 0,
                status: 0,
                statusContent: "",
                statusList: [],
                typeContent: "",
                identity: 0  //当前用户的身份（0.其他用户 1.借款人 2.出借人 3.担保人）
            }
		};
	}

	componentDidMount() {
        this.getPageInfo();
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
                info: res
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(() => {
            Loading.hide();
        })
    }
    //反馈证据
    onTapp = () => {
        // $.setItem('pre_state', {
        //     trueM: this.state.info.realLendAmount,
        //     repaidUnconfirmAmount: this.state.info.repaidUnconfirmAmount,
        //     reportType: this.state.info.reportType,
        //     repayAmount: this.state.info.repayAmount
        // });
        this.props.history.push({
            pathname: '/after/report',
            search: "?id=" + this.state.id,
        });
    }

    //补充证据
    onTappX = () => {
        // $.setItem('pre_state', {
        //     trueM: this.state.info.realLendAmount,
        //     reportType: this.state.info.reportType,
        //     repayAmount: this.state.info.repayAmount
        // });
        this.props.history.push({
            pathname: '/after/report',
            search: "?id=" + this.state.id,
        });
    }

    onGoDetail = () => {
        if (this.state.info.identity == 2) {
            this.props.history.push({
                pathname: '/after/loan_detail',
                search: "?id=" + this.state.id,
            });
        } else {
            this.props.history.push({
                pathname: '/after/borrow_detail',
                search: "?id=" + this.state.id,
            });
        }
    }

    onClose = () => {
        this.setState({
            modal: false,
        });
    }

    showModal = () => {
        this.setState({
            modal: true,
        });
    }
    onChange2 = (value, label) => {
        this.setState({
            label: label,
            value: value,
        });
    };
	render() {
        const { info } = this.state;
        const data2 = [
            { value: 0, label: '不想举报了' },
            { value: 1, label: '已和出借人线下达成一致' },
            { value: 2, label: '证据上传错误，重新发起' },
            { value: 3, label: '操作失误' },
            { value: 4, label: '其他原因' },
           ];
		return (
			<div className="report-process">
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
                            <RadioItem key={i.value} checked={this.state.value === i.value} onChange={() => this.onChange2(i.value, i.label)}>
                                {i.label}<List.Item.Brief></List.Item.Brief>
                            </RadioItem>
                        ))}
                        <Tap className="report_btn" onTap={this.onClose}>提交</Tap>
                    </List>
                </Modal>
                <div>
                    <List className="detail_list">
                        <Item extra={info.typeContent}>举报类型</Item>
                        <Item extra={info.statusContent}>举报状态</Item>

                        {/* <Item extra={'等待出借人反馈证据 (72小时)'}>举报状态</Item>
                        <Item extra={'路人甲'}>举报人</Item>
                        <Item extra={'路人乙'}>被举报人</Item>
                        <Item extra={'裸条'}>举报类型</Item>
                        <Item extra={'4000元'}>借条金额</Item> */}
                    </List>
                </div>
                <List className="no_data"  hidden="true">
                    <img src={'/imgs/iou/loan-null.svg'} />
                    <div className="row_font">当前没有待处理展期</div>
                </List>

                <Flex justify='start' className='iou-text' onClick={this.onGoDetail}>
                    <span>查看借条详情<img src='/imgs/home/arrow-r.svg'/></span>
                </Flex>
                <div className="box-br"></div>

                <div className="box_ce">
                    {info.statusList.map((item, index, arr) => {
                        return <div>
                            {index == arr.length - 1 ?<div className="days state2">
                                <img src={'/imgs/iou/time2.svg'} />
                                <span>{item.time?item.time.substr(0,10):''} </span>
                                <span>{item.detailStatusContent}</span>
                            </div>:null}
                            {index == 0 ? <div className="days">
                                <img src={'/imgs/iou/time3.svg'} />
                                <span>{item.time?item.time.substr(0, 10):''} </span>
                                <span>{item.detailStatusContent}</span>
                            </div> : null}
                            {index != 0 && index != arr.length - 1 ? <div className="days state1">
                                <img src={'/imgs/iou/time1.svg'} />
                                <span>{item.time?item.time.substr(0, 10):''} </span>
                                <span>{item.detailStatusContent}</span>
                            </div> : null}
                            <div className={index == arr.length - 1 ? "timeline none" :"timeline"}>
                                <span>{item.time?item.time.substr(10):''}</span>
                                <span>{item.resultContent}</span>
                            </div>
                            {item.reasonContent ? <div className={index == arr.length - 1 ? "timeline none" : "timeline"}>
                                <span></span>
                                <span>{item.reasonContent}</span>
                            </div>:null}
                            {item.adviceContent ? <div className={index == arr.length - 1 ? "timeline none" : "timeline"}>
                                <span></span>
                                <span>{item.adviceContent}</span>
                            </div>:null}
                        </div>
                    })}
                </div>
                
                {/* <div className='common-btn_box'>
                    <Tap className='c-black span font16' onTap={this.showModal}>撤销举报</Tap>
                </div> */}
                {(info.identity === 2 && info.status === 1) ? <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onTapp}>反馈证据</Tap>
                </div> : null}
                {(info.identity === 1 && info.status === 4) || (info.identity === 2 && info.status === 3) ? <div className='common-btn_box'>
                    <Tap className='c-black span font16 active' onTap={this.onTappX}>补充证据</Tap>
                </div> : null}

			</div>
		)
	}
}

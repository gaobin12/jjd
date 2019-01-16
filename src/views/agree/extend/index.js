
//借款展期协议
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { Loading,Modal } from 'SERVICE'
import {Tap} from 'COMPONENT'
import { Toast } from 'antd-mobile'

@withRouter
export default class App extends Component {
	constructor(props, context) {
		document.title = "借款展期协议";
		super(props, context)
		let extendInfo = {
			id: '',   //展期记录的id
			loanIdE: '',   //借条id（加密后）
			amtExtend: '',   //展期后借款本金
			endTm: '',   //展期到期日
			interestRate: '',   //年化借款利率
			interestRateExtend: '',   //年化借款利率
			startTm: '',   //展期开始日（时间戳格式）(利息开始日期)
			confirmTm: '',//借款人确认时间
			originalId: '',//展期协议编号
			onlineStatus: '',  //是否是线上
		};
		let exceeding_info = $.getItem('exceeding_info');
		if(exceeding_info){
			extendInfo = exceeding_info;
		}
		this.state = {
			id: '',//借条ID
			extendInfo,
			loanInfo:{
				borrowerName:'', // 借款人姓名
				borrowerIdCardNo:'', // 借款人身份证号
				lenderName :'', // 出借人姓名
				lenderIdCardNo : '', // 出借人身份证号
			},
			modal1: false,//弹窗模板
			urlContent: '',//弹窗显示的内容
			isShow: 'none',//是否显示下载按钮
		};
		//this.renderTree = renderTree.bind(this)
	}

	componentDidMount() {
        let query = this.props.location.query;
        if(query && query.id){
            this.getLoanAgreements();
            this.setState({
                id:query.id,
                isShow: 'block',
            })
        }else{
            this.setState({
                isShow:'none', 
            })
        }
	}
	// 获取借条展期信息
	// getExtendLoanInfo = () => {
	// 	Loading.show();
	// 	$.ajaxE({
	// 		type: 'GET',
	// 		url: '/loanlater/loanExceeding/getLastLoanExceeding',
	// 		data: {
	// 			loanId: this.state.id//借条编号（加密后）
	// 		}
	// 	}).then((data) => {
	// 		data.startTm = (new Date(data.startTm * 1000)).Format('yyyy-MM-dd');
	// 		data.endTm = (new Date(data.endTm * 1000)).Format('yyyy-MM-dd');

	// 		if (data.confirmTm != '' && data.confirmTm!=null){
	// 			data.confirmTm = (new Date(data.confirmTm * 1000)).Format('yyyy-MM-dd');
	// 		}
			
	// 		data.amtExtend = $.toYuan(data.amtExtend);
	// 		this.setState({
	// 			extendInfo: data,
	// 			isShow: 'block',
	// 		});
	// 	}).catch((msg) => {
	// 		Modal.infoX(msg);
	// 	}).finally(()=>{
	// 		Loading.hide();
	// 	})
	// }
	// 获取借条详情
	getLoanAgreements = () => {
		const _this = this;
		$.ajaxE({
			type: 'GET',
			url: '/loanlater/loaninfo/getLoan',
			data: {
				loanId: _this.state.id//借条编号（加密后）
			}
		}).then((data) => {
			data.nowRepayTime = (new Date(data.nowRepayTime * 1000)).Format('yyyy-MM-dd');
			_this.setState({
				loanInfo: data,
			});
		}).catch((msg,res) => {
			if(res.status == 202){
                Modal.infoX(msg,()=>{
                    _this.props.history.push({
                        pathname: '/'
                    });
                });
            }else{
                Modal.infoX(msg);
            }
		})
    }
    
    // 日期格式转换
    formatDate=(time)=> {
        return new Date(time* 1000).Format("yyyy-MM-dd");
    }

	//下载弹窗
	showDlg = () => {
		let { extendInfo } = this.state
		// 弹窗出现getExtendLoanAgreements
		this.setState({
			modal1: true,
			urlContent: '请复制下方链接，在浏览器中打开：' +'<textarea id="execText" readonly="readonly" style="min-height:110px; margin:0px;">'+ location.origin + 
			"jjdApi/loanlater/protocol/getExtendLoanAgreements?loanExtendId=" + extendInfo.id +'</textarea>'
		})
	}

	// 对身份证号脱敏处理
	getHideIdCard = (idCard) => {
		if (idCard.length == null) {
			return null
		}
		if (idCard.length == 18) {
			return idCard.substring(0, 6) + "**********" + idCard.substring(16)
		}
		if (idCard.length == 15) {
			return idCard.substring(0, 6) + "******" + idCard.substring(12)
		}
		return null;
	}  

	onClose = (key,copy) => () => {
        if(copy){
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //ios
                
                //获取版本号，如果IOS版本小于9，提示复制失败
                let ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                ver = parseInt(ver[1], 10);
                if(ver<=9)
                {
                    Toast.info('复制失败，请手动复制')
                    return;
                }

                var input = document.createElement("input");
                input.value = document.getElementById('execText').value;
                document.body.appendChild(input);
                input.readOnly = true;
                input.focus();
                input.setSelectionRange(0, input.value.length);
                document.execCommand('copy');
                document.body.removeChild(input);
                // alert(document.execCommand('copy',true))
                // if(document.execCommand('copy')){
                //     //可以复制
                // }else{
                //     Toast.info('复制失败，请手动复制')
                //     return
                // }
                this.setState({
                    [key]: false,
                },()=>{
                    Modal.infoX('复制成功！')
                })
            }else{                
                document.getElementById('execText').select();
                document.execCommand("Copy")
                this.setState({
                    [key]: false,
                },()=>{
                    Modal.infoX('复制成功！')
                })
            }
        }else{
            this.setState({
                [key]: false,
            })
        }
	}


	render() {
		let { extendInfo,loanInfo } = this.state
		return (
			<div className='view-extend_agreement'>
				<div className="body">
					<Tap onTap={() => { this.showDlg() }}>
						<div className="showDig" style={{ display: this.state.isShow }}>下载协议</div>
					</Tap>
					<h2 className="title">借款展期协议</h2>
                    <div>协议编号： {extendInfo.originalId} </div>
                        {extendInfo.originalId?<img className="ecloudsign" src={'/imgs/com/ecloudsign.png'} />:null}
					<div className="user">甲方（出借人）：{loanInfo.lenderName}</div>
					<div className="user">甲方身份证号：{this.getHideIdCard(loanInfo.lenderIdCardNo)}</div>
					<div className="user">乙方（借款人）：{loanInfo.borrowerName}</div>
					<div className="user">乙方身份证号：{this.getHideIdCard(loanInfo.borrowerIdCardNo)}</div>
					<div className="user">丙方（人人信）：北京人人信科技有限公司</div>
					<div className="user">统一社会信用代码：911101083552293499</div>
					<div>经出借人与借款人双方协商一致,就编号【 {loanInfo.originalId} 】的《借款协议》（如对该借款协议已进行过展期的，则还包括已签署的借款展期协议，以下统称“原协议”）项下的借款展期事宜，订立协议条款如下：</div>
					<section>
						<h3>第一条 借款展期</h3>
						<div>1.借款展期的本金金额为人民币 ({$.toYuan(extendInfo.amtExtend)}) 元。出借人签署本协议后，借款人于签署本协议前偿还原协议项下债务导致应还本金减少的，本协议项下展期本金金额相应减少。</div>
						<div>2.借款展期后的到期日为 {extendInfo.endTm} 。</div>
						<div>3.借款展期后的借款利率为年化【 {extendInfo.interestRateExtend} 】%，自 {extendInfo.startTm} 开始按此利率计息，且展期期间内所生利息均不加入本金重复计算利息。</div>
						<div>4.还款方式为展期后到期日一次性偿还本金和利息（含原协议项下的应付利息余额）。</div>
					</section>

					{
						extendInfo.onlineStatus ? <section>
							<h3>第二条 费用</h3>
							<div>1.若未发生逾期时，申请展期，借款人需要支付该借条待还本金的10%以及待还利息给出借人。展期后的本金为90%的原待还本金，并按新的利息、新的还款日期进行计息处理。</div>
							<div>2.若借条已逾期，申请展期，借款人需要支付对应借条待还本金的10%以及待还利息与待还罚息给出借人，展期后的本金为展期时90%
            		的待还本金，并按新的利息、新的还款日期进行计息处理。</div>
						</section> : <section >
								<h3>第二条 费用</h3>
								<div>1.若未发生逾期时，申请展期，展期后的本金为原待还本金，并按新的利息、新的还款日期进行计息处理。展期后还款为原待还利息+展期本金+展期利息。</div>
								<div>2.若借条已逾期，申请展期，展期后的本金为展期时待还本金，并按新的利息、新的还款日期进行计息处理。展期后还款为原待还利息（罚息）+展期本金+展期利息。</div>
							</section>
					}
					
					<section>
						<h3>第三条 其他</h3>
						<div>1.人人信有权就本次借款展期向借款人收取展期服务费金额，交易服务费金额可见下表，该笔费用于借款人签署本协议时收取。
            			<table>
								<tr><td>本金区间</td><td>展期服务费</td></tr>
								<tr><td>(0,1000]元</td><td>1.99元</td></tr>
								<tr><td>(1000,5000]元</td><td>9.99元</td></tr>
								<tr><td>(5000,10000]元</td><td>19.99元</td></tr>
								<tr><td>(10000,50000]元</td><td>99.99元</td></tr>
								<tr><td>(50000,200000]元</td><td>199.99元</td></tr>
							</table>
						</div>
						<div>2.本协议是对原协议部分条款的调整和补充，除涉及上述内容的条款外，原协议约定的其他各项条款仍然有效。本协议和原协议不可分割，具有同等法律效力。</div>
						<div>3.本协议在履行过程中，如发生任何争执或纠纷，任何一方均应按照原协议的争议解决条款的约定向有管辖权的人民法院提起诉讼。</div>
						<div>4.本协议自出借人与借款人通过今借到平台在线同意后生效，各方均认可电子文本形式的协议效力。</div>
						<div>5.出借人与借款人均委托人人信通过其设立的专用服务器保管所有与本协议有关的书面文件和电子信息。本协议任何一方下载打印本协议文本，均不得添加、修改或者涂改任何条款。</div>
					</section>
					<img className="seal-size" src={'/imgs/com/seal2.png'} />
					<div>甲方：<span>{loanInfo.lenderName}</span>
					</div>
					<div>乙方：<span>{loanInfo.borrowerName}</span>
					</div>
					<div>丙方：<span>北京人人信科技有限公司</span>
					</div>
					<div>日期：{extendInfo.confirmTm}</div>
					<div className="blank"></div>
				</div>
				{/* 弹窗模板 */}
				<Modal
					visible={this.state.modal1}
					transparent
					maskClosable={false}
					onClose={this.onClose('modal1')}
					title="提示"
					footer={[
                        { text: '取消', onPress: () => { this.onClose('modal1')(); } },
                        { text: '复制', onPress: () => { this.onClose('modal1',true)(); } }]}
					wrapProps={{ onTouchStart: this.onWrapTouchStart }}
				>
					<div style={{ height: 100, overflow: 'scroll' }}>
						<div dangerouslySetInnerHTML={{ __html: this.state.urlContent }}></div>	
					</div>
				</Modal>


			</div>
		)
	}
}

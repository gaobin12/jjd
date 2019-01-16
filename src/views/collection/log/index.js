
//催收进度 => 查看催记
import './index.less'
import React, {Component,PropTypes} from 'react'
import { Accordion, List, Switch } from "antd-mobile"
import { Loading, Modal } from 'SERVICE/popup'

export default class App extends Component {
	// static contextTypes = {
	// 	router: PropTypes.object.isRequired
	// }
	constructor(props, context) {
		document.title = "查看催记";
		super(props, context)
		let {query} = this.props.location;
		//设置组件状态
		this.state = {
			// id:query.id,
			checked:false,
			collectionStatus:false,
			borrowerName:'',
			collectionAmount:0,
			overDueDays:0,
			collectionRestDays:0,
			collectionRecords:[],
		};
	}

	componentDidMount() {
		this.getPageInfo();
	}

	//获取催收记录
	getPageInfo=()=>{
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/getLoanCollectionInfo",
			data: {
				loanId:this.state.id
			}
		}).then((data)=>{
			if(data.collectionRecords){
				data.collectionRecords.forEach((item)=>{
					item.datef = item.date.substr(0,4)+'-'+item.date.substr(4,2)+'-'+item.date.substr(6,2)
				})
			}
			this.setState({
				checked:data.collectionStatus?true:false,
				collectionStatus:data.collectionStatus,
				borrowerName:data.borrowerName,
				collectionAmount:data.collectionAmount,
				overDueDays:data.overDueDays,
				collectionRestDays:data.collectionRestDays,
				collectionRecords:data.collectionRecords || [],
			});
			// data.commissionPartyAmt = parseInt(Math.round(data.dueTotalAmt * data.commissionTotalRate/100))/100
			// data.feedBackVoList && data.feedBackVoList.forEach((item)=>{
			// 	item.collectionTime = (new Date(item.collectionTime*1000)).Format('yyyy-MM-dd hh:mm:ss');
			// });
            // this.setState({
            //     info: data
            // });
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})
	}


	onSwitch=()=>{
		Loading.show();
		$.ajaxE({
			type: 'GET',
			url: "/loanlater/collection/setLoanCollectionStatus",
			data: {
				loanId:this.state.id,
                loanCollectionStatus:!this.state.checked
            }
		}).then((data)=>{            
            this.setState({
                checked:!this.state.checked
            })
		}).catch((msg)=>{
			Modal.infoX(msg);
		}).finally(()=>{
			Loading.hide();
		})  
	}


	render () {
		return (
			<div className='view-collection'>
				<Accordion defaultActiveKey="" className="my-accordion">
					<Accordion.Panel header={'剩余提醒天数'+ this.state.collectionRestDays +'天'}>
						<List className="my-list">
							<List.Item
								extra={<span>{this.state.checked?'已开启':'未开启'}<Switch
								color="#FF9900"
								checked={this.state.checked}
								onChange={this.onSwitch}/></span>}>
								还款提醒
							</List.Item>
						</List>										
						<List className="my-list">
							<List.Item extra={this.state.borrowerName}>催收对象</List.Item>
						</List> 
						<List className="my-list">
							<List.Item extra={this.state.collectionAmount/100 + '元'}>催收金额</List.Item>
						</List> 
						<List className="my-list">
							<List.Item extra={this.state.overDueDays + '天'}>逾期天数</List.Item>
						</List>
					</Accordion.Panel>
				</Accordion>
				<div className="card_verdie">
					<div className="tip_rr">催收记录</div>
				</div>
				<div>
					{this.state.collectionRecords.map((item)=>{
						return <div className="cardFather" key={Math.random()}>
							<div className="top">{item.datef}</div>
							<div className="bottom_2">{item.collectionDetail}</div>
						</div>
					})}
				</div>
			</div>
		)
	}
}
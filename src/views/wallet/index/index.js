
//首页 => 钱包
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { List, Flex } from "antd-mobile"
import { Loading, Modal } from 'SERVICE'
import {Tap, PullAndPush} from 'COMPONENT'


const PlaceHolder = ({ className = '', text = "" }) => (
	<div className={className+ 'placeholder'} >{text}</div>
);

const Item = List.Item;
const Brief = Item.Brief

@withRouter
@inject('userStore')
@observer
export default class App extends Component {
	constructor(props, context) {
		document.title = "钱包";
		super(props, context)

		this.state = {
			isFilterShow:false,
            isNoneShow:false,
            amount:'', // 钱包余额(数字)
            withdrawAmount:'', // 可提现余额
            pageCount:'', // 明细科目总数量
            showMore: false,//显示加载更多按钮
            showMoring: false,//正在加载中
            refreshing: false,//正在刷新中
            pageInfo: {
                pageNo: 0,
                pageSize: 50
            },
            pages:[],
            filterList: [false, false, false, false, false, false,
                false, false, false, false, false, false,
                false, false, false, false, false, false,false,false,false,
            ],
            filterListOrigin: [false, false, false, false, false, false,
                false, false, false, false, false, false,
                false, false, false, false, false, false,false,false,false,
            ]
		};
	}

	//充值
	onRecharge = () => {
        this.props.history.push({
            pathname: '/card/charge'
        });
	}

	// 提现
	onTixian=()=>{
        this.getPaymentList();
				
    }
    getPaymentList=()=>{
        Loading.show()
        $.ajaxE( {
            type: 'GET',
            url: '/user/my/getPaymentList',
            data: {
                withdraw:1
            }
        }).then((json) => {
            if(json.usableBankList.length>0){
                this.props.history.push({
                    pathname: '/card/cash'
                });
            }else{
                Modal.alertX('提醒', '请绑定一张可以使用的银行卡', [
                    {
                        text: '取消', onPress: () => null
                    },
                    { text: '确定', onPress: () => {
                        if(this.props.userStore.creditInfo.idCardStatus){
                            this.props.history.push({
                                pathname: '/card/bind_card',
                                query:{
                                    payCredit:""
                                }
                            });
                        }else{
                            this.props.history.push({
                                pathname: '/user/id_auth',
                                query:{
                                    pathType:0,
                                    payCredit:""
                                }
                            });
                        }
                    }},
                ])
            }
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})      

    }

	toggleFilter=(e)=>{
		this.setState({
			isFilterShow:!this.state.isFilterShow,
		});
	}

    componentDidMount(){
        this.getMyAccountList();
    }
    
    // 日期格式转换
    formatDate=(time)=> {
        return new Date(time).Format("yyyy-MM-dd hh:mm:ss");
    }

    // 点击单个进行选择
    onItemSelected = (item) => {
        
        if(item != 0) {
            this.state.filterList[item] = !this.state.filterList[item];
        } else {
            for(var i = this.state.filterList.length - 1; i >= 0; i--) {
                this.state.filterList[i] = !this.state.filterList[0];
            }
        }
        this.setState({
            filterList:this.state.filterList
        })
        
    }
    // 筛选确定按钮事件
    confirmFilter= () => {
        for(var i = 0; i < this.state.filterListOrigin.length; i++) {
            this.state.filterListOrigin[i] = this.state.filterList[i];
        }
        this.getMyAccountList();
        this.setState({
            isFilterShow:false
        })
    }
    // 筛选取消按钮事件
    showFilter= () => {
        this.setState({
            isFilterShow:false
        })
    }
    onGetMore = ()=>{
        let {pageInfo} = this.state;
        pageInfo.pageNo = 0
        pageInfo.pageSize += 50
        this.setState({
            pageInfo
        },function(){
            this.getMyAccountList()
        })
    }
    //提交事件
    getMyAccountList= (type) => {
        var filter = [];
        var bAllSelect = true;
        for(var i = 1; i < this.state.filterList.length; i++) {
            bAllSelect = bAllSelect && this.state.filterList[i];
        }
        if(!bAllSelect) {
            for(var i = 0; i < this.state.filterList.length; i++) {
                if(i == 0) {
                    continue;
                }
                if(this.state.filterList[i]) {
                    if(i != (this.state.filterList.length - 1)) {
                        filter.push(i);
                    } else {
                        filter.push(20);
                    }
                }
            }
        }
        Loading.show();
        let {pageInfo} = this.state;
        $.ajaxE({
            type: 'POST',
            url: '/user/account/getMyAccountList',
            data:{
                pageNo:pageInfo.pageNo, // 当前页数，从0开始
                pageSize:pageInfo.pageSize, // 每页数据条数
                filter:filter,
            }
        }).then((data)=>{


            let myData = this.state.pages;
            let showMore = this.state;
            if(myData&&type=='refresh'){
                data.pages = myData.pages.concat(data.pages);
            }
            
            if(data.pageCount > data.pages.length){
                showMore = true
            }else{
                showMore = false
            }
            this.setState({
                amount:data.amount, 
                withdrawAmount:data.withdrawAmount, 
                pageCount:data.pageCount,
                pages:data.pages,showMore,showMoring: false,refreshing:false
            })
        }).catch((msg)=>{
            Modal.infoX(msg);
        }).finally(()=>{
			Loading.hide();
		})
    }


	render() {
        let { amount, pages, filterList } = this.state;
		return (
            
			<div className='view-wallet'>
                <div className="posi-bg" hidden={!this.state.isFilterShow}></div>
                <div className="posi-wa" hidden={!this.state.isFilterShow}>
                    <Flex className="table-tit-flex" justify="between">
                        <Flex.Item>收支明细</Flex.Item>
                        <Flex.Item>
                            <Tap onTap={this.toggleFilter}>
                                <span>筛选</span>
                                <img src={'/imgs/bank/select-icon.svg'} />
                            </Tap>
                        </Flex.Item>
                    </Flex>
                    <div className="flex-container">
                        <Flex className="mat30">
							<Flex.Item className={filterList[0]?'active':''} onTouchEnd={()=>{this.onItemSelected(0)}}><PlaceHolder text="全部" /></Flex.Item>
							<Flex.Item></Flex.Item>
							<Flex.Item></Flex.Item>
						</Flex>
                        <Flex>
							<Flex.Item className={filterList[1]?'active':''} onTouchEnd={()=>{this.onItemSelected(1)}}><PlaceHolder text="借入" /></Flex.Item>
							<Flex.Item className={filterList[2]?'active':''} onTouchEnd={()=>{this.onItemSelected(2)}}><PlaceHolder text="借出" /></Flex.Item>
                            <Flex.Item></Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item className={filterList[3]?'active':''} onTouchEnd={()=>{this.onItemSelected(3)}}><PlaceHolder text="收到还款" /></Flex.Item>
							<Flex.Item className={filterList[4]?'active':''} onTouchEnd={()=>{this.onItemSelected(4)}}><PlaceHolder text="支付还款" /></Flex.Item>
							<Flex.Item className={filterList[5]?'active':''} onTouchEnd={()=>{this.onItemSelected(5)}}><PlaceHolder text="充值" /></Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item className={filterList[6]?'active':''} onTouchEnd={()=>{this.onItemSelected(6)}}><PlaceHolder text="提现" /></Flex.Item>
							<Flex.Item className={filterList[7]?'active':''} onTouchEnd={()=>{this.onItemSelected(7)}}><PlaceHolder text="授信认证费" /></Flex.Item>
							<Flex.Item className={filterList[8]?'active':''} onTouchEnd={()=>{this.onItemSelected(8)}}><PlaceHolder text="交易手续费" /></Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item className={filterList[9]?'active':''} onTouchEnd={()=>{this.onItemSelected(9)}}><PlaceHolder text="服务费" /></Flex.Item>
							<Flex.Item className={filterList[10]?'active':''} onTouchEnd={()=>{this.onItemSelected(10)}}><PlaceHolder text="担保费" /></Flex.Item>
							<Flex.Item className={filterList[11]?'active':''} onTouchEnd={()=>{this.onItemSelected(11)}}><PlaceHolder text="催收费" /></Flex.Item>
						</Flex>
                        <Flex>
							<Flex.Item className={filterList[12]?'active':''} onTouchEnd={()=>{this.onItemSelected(12)}}><PlaceHolder text="逾期管理费" /></Flex.Item>
                            <Flex.Item className={filterList[20]?'active':''} onTouchEnd={()=>{this.onItemSelected(20)}}><PlaceHolder text="其他" /></Flex.Item>
                            <Flex.Item></Flex.Item>
                        </Flex>
					</div>
                    <div className='common-btn_box wall-noposi'>
                        <Tap className='span font16 active' onTap={this.showFilter}>取消</Tap>
                        <Tap className='c-black span font16 active' onTap={this.confirmFilter}>确定</Tap>
                    </div>
                </div>

                <div className="wallet-div">
                    <p>钱包余额(元)</p>
                    <p className="big"></p>
                    <List className="credit-base">
                        <Tap onTap={this.onRecharge}>
                            <Item thumb={'/imgs/bank/recharge.svg'}
                            arrow="horizontal"
                            onClick={() => {}}
                            >充值</Item>
                        </Tap>
                        <Tap onTap={this.onTixian}>
                            <Item thumb={'/imgs/bank/cach.svg'}
                            arrow="horizontal"
                            onClick={() => {}}
                            >提现</Item>
                        </Tap>
                    </List>
                </div>
                <div className="cred-line-br"></div>
                <div className="wall-detail">
                    <Flex className="table-tit-flex" justify="between">
                        <Flex.Item>收支明细</Flex.Item>
                        <Flex.Item>
                            <Tap onTap={this.toggleFilter}>
                                <span>筛选</span>
                                <img src={'/imgs/bank/select-icon.svg'} />
                            </Tap>
                        </Flex.Item>
                    </Flex>

                    <PullAndPush
                        refreshing={this.state.refreshing}
                        showMoring={this.state.showMoring}
                        showMore = {this.state.showMore}
                        onShowMore = {()=>{
                            this.setState({ showMoring: true },()=>{this.onGetMore('refresh')});                            
                        }}
                    >
                    {pages.length>0?pages.map((item,index)=>{
                        return(
                            <div hidden={this.state.isFilterShow}  key={index}>
                                <Flex className="table-li-flex" justify="between">
                                    <Flex.Item className="text-left">
                                        <span>{item.partnerName?item.partnerName:<span>无姓名</span>}</span>
                                        <span>
                                            {item.acountTypeStr}
                                            {item.receiveBankStatus?null:'-处理中'}
                                            {item.validStatus?null:'-失败'}
                                        </span>
                                        <span>成交时间：{this.formatDate(item.createTime)}</span>
                                    </Flex.Item>
                                    <Flex.Item className="text-right">
                                        <span className="num-font">{$.toYuan(item.amount)}</span>
                                        {item.validStatus==0?<span className="red">未成功</span>:null}
                                    </Flex.Item>
                                </Flex>
                            </div>
                            )
                    }):<div className='null' hidden={pages.length !== 0 || this.state.isFilterShow}>
                        <img src={'/imgs/iou/loan-null.svg'} className="null-img" />
                        <p className="font14 fontC1">空空如也～</p>
                    </div>}

                    </PullAndPush>

                </div>
			</div>
		)
	}
}
          
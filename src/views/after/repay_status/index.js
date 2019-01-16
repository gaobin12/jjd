
//展期状态(公共)
import './index.less';
import React, { Component,PropTypes } from 'react'
import { Tap } from "COMPONENT"
import { Loading, Modal } from 'SERVICE/popup'

export default class App extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        document.title = "还款状态";
        super(props, context)
        const { query } = this.props.location;
        let strs = query.id.split('___');
		this.state = {
            id:strs[0],
            oId:strs[1],
            isShare:strs[2],
            //0 借款人   1出借人    2其他人
            isSelf:2,
            show:false,
            repayStatus:'待处理',
            amt:0
        };
    }

    componentDidMount(){
        this.getShowStatus();
    }

    getShowStatus=()=>{
        Loading.show();
        $.ajaxE({
            type: 'GET',
            url: '/loanlater/loaninfo/getLoanRepayListById',
            data: {
                loanRepayListId: this.state.oId
            }
        }).then((data) => {   
            let self = 2;
            if(data.repayerUidE == $.getUserInfo().userId){
                self = 0;
            }
            if(data.lenderUidE == $.getUserInfo().userId){  
                self = 1;
            }

            if(self==1 && (data.repayStatus=='待出借人处理' || data.repayStatus=='待处理')){
                this.context.router.replace({
                    pathname: '/after/repay_detail',
                    query:{
                        id:this.state.id,
                        oId:this.state.oId,
                        isShare:this.state.isShare
                    }
                });
                return;
            }

            if(self==2){
                Modal.infoX('您不能操作此借条',()=>{
                    this.context.router.replace({
                        pathname: '/'
                    });
                });
                return;
            }else{
                this.setState({
                    show:true,
                    isSelf:self,
                    amt:$.toYuan(data.repayAmount),
                    repayStatus:data.repayStatus
                })    
            }
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    }

    onShare=()=>{
        $.setItem('wx_share',{
            id:this.state.id+'___'+this.state.oId+'___1',
            code:1,
            path:'/after/repay_status',
            amt:this.state.amt
        });
        this.context.router.push({
            pathname: '/after/share'
        });
    }

    onSuccess=()=>{
        if(this.state.isShare){
            if(this.state.isSelf==0){
                this.context.router.push({
                    pathname: '/after/borrow_detail',
                    query:{
                        id:this.state.id
                    }
                });
            }

            if(this.state.isSelf==1){
                this.context.router.push({
                    pathname: '/after/loan_detail',
                    query:{
                        id:this.state.id
                    }
                });
            }
            
        }else{
            history.go(-1)
        }
    }
    
    render() {
        if(!this.state.show){
            return null;
        }
        if(this.state.isSelf==0 && (this.state.repayStatus=='待出借人处理' || this.state.repayStatus=='待处理')){
            return (
                <div className='view-show-tatus'>
                    <div className="top-status">
                        <img src={'/imgs/com/cash_succ.svg'} alt="" />
                        <div>还款,{this.state.repayStatus}</div>
                    </div>
                    <div className='common-btn_box'>
                        <Tap className='c-white' onTap={this.onSuccess} >完成</Tap>
                        <Tap className='c-black' onTap={this.onShare} >提醒Ta确认</Tap>
                    </div>
                </div>
            )
        }else{
            return (
                <div className='view-show-tatus'>
                    <div className="top-status">
                        <img src={'/imgs/com/cash_succ.svg'} alt="" />
                        <div>还款,{this.state.repayStatus}</div>
                    </div>
                    <div className='common-btn_box'>
                        <Tap className='c-white' onTap={this.onSuccess} >完成</Tap>
                    </div>
                </div>
            )
        }
        
    }
}
import React, { Component } from 'react';
import { findDOMNode } from "react-dom";
import { Loading, Modal } from 'SERVICE/popup';
import { Tap } from 'COMPONENT';
// 引入样式
import "./index.less";
export default class Evidence extends Component {
	constructor(props) {
		// 定义标题
		document.title = "下载证据";
		super(props);
		const {query} = this.props.location;
		// 定义状态数据
		this.state = {
			// id:query.id,
            //是否线上
            // onlineStatus:query.onlineStatus,
            modal1: false,
			isChoose: [false, true, true],
			curChecked: null,
		}
	}

	// onChange = (val,num) => {
 //        let obj = {
 //            checked1: false,
 //            checked2: false,
 //            checked3: false,
 //        }
 //        obj[val] = true;
 //        this.setState({
 //            checkedStatus: obj,
 //            curChecked: num,
 //        })
 //    }
    onClose = () => {
        this.setState({
            modal1: false,
        });
    }

    //显示弹框
    onShowEmail=() =>{
        this.setState({
            modal1: true
        });
    }

    //发送到指定邮箱
    onSendEmail=() =>{
        let _this = this;
        let { curChecked } = _this.state;
        _this.setState({
            modal1: false
        });
        if(!curChecked){
            Modal.infoX('请选择类型!');
            return;
        }
        let email = this.refs.ref_email&&this.refs.ref_email.value;
        if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)){
            Modal.infoX('请输入正确的邮箱地址!');
            return;
        }
        let postData = {
            packType:curChecked,                    //打包类型：1-民事诉讼材料 2-仲裁申请材料 3-举报信息材料
            loanId:_this.state.id,                  //借条id
            receiveUser:email,                      //接收方邮箱
            b_online:_this.state.onlineStatus       //是否是线上
        };
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/protocol/packDownloadByType',
            data: postData
        }).then((data) =>{
            //////debugger;
            Modal.infoX('邮件发送成功!');
        }).catch((msg) =>{
            Modal.infoX(msg);
        }).finally(() =>{
            //Loading.show();
            Loading.hide();
        });
    }

    //复制下载链接
    onCopyLink=() =>{
        let _this = this;
        let { curChecked } = _this.state;
        if(!curChecked){
            Modal.infoX('请选择类型!');
            return;
        }
        let postData = {
            packType:curChecked,                //打包类型：1-民事诉讼材料 2-仲裁申请材料 3-举报信息材料
            loanId:_this.state.id,              //借条id
            receiveUser:'',                     //接收方邮箱
            b_online:_this.state.onlineStatus   //是否是线上
        };
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: '/loanlater/protocol/packDownloadByType',
            data: postData
        }).then((data) =>{

            let _div = document.createElement('div'),
                _btn = document.createElement('a'),
                _shadow = document.createElement('div');
            _shadow.className='am-modal-mask';
            _div.className = 'am-modal-content';
            _div.style.cssText = 'width:88vw;height:auto;position:absolute;z-index:999;top:50%;left:50%;transform:translate(-50%,-50%);padding:15px 15px 0;border-radius:5px;'
            _div.innerHTML = "<p class='am-modal-title' style='height:50px;line-height:50px;'>请手动复制</p><textarea readOnly style='margin-bottom:10px;'>"+data.downloadUrl+"</textarea>"
            _btn.innerHTML = '关闭';
            _btn.style.cssText = 'display:block;height:50px;line-height:50px;border-top: 1px solid #ddd;margin-left: -15px;width: 100%;padding: 0 15px;box-sizing: content-box;font-size: .16rem;'
            _btn.className='am-modal-button am-modal-button-group-normal';
            _div.appendChild(_btn);
            _btn.onclick = () =>{
                document.body.removeChild(_shadow)
            }
            document.body.appendChild(_shadow).appendChild(_div)

        }).catch((msg) =>{
            Modal.infoX(msg);
        }).finally(() =>{
            Loading.hide();
        });
    }
    onGoDownload=(type) =>{
        this.props.history.push({
            pathname: '/after/download_detail',
            query:{ type,id:this.state.id}
        })
    }
    method(idx) {
        this.chooseItem(idx);
        this.onGoDownload(idx);
        console.log(idx);
    }
	chooseItem(idx) {
		let arr = new Array(3).fill(true);
		this.state.isChoose.forEach(function(item, index) {
			item = true;
		})
		arr[idx] = false;
		this.setState({isChoose: arr, curChecked: idx})
	}
	createList() {
		return this.props.data.map((item, index) => (<div key={index} className="item_list inner" 
			onClick={ () => { this.method(item.id) } }>
			{/*onClick={() => this.onChange("checked2", 2)} */}
			<img className="circle" src={this.state.isChoose[index] ? item.circle_default : item.circle_active} alt=""/>
			<img className="download" src={this.state.isChoose[index] ? item.load_default : item.load_active} alt=""/>
			<div className="need_text">
				<div>{item.title}</div>
				<span className="sub_title">{item.sub_title}</span>
			</div>
			<img className="arrow" src="/imgs/pay/arrow-r.svg" alt=""/>
		</div>))
	}
	render() {
		return (
			<div className="g_pl20">
				{this.createList()}
				<div className="choose inner">请您选择以下任意方式下载材料</div>
				{/*<div className="btn">
					<div className="copy" onClick={() => {}}>复制下载链接</div>
					<div className="email" onClick={() => {}}>一键发送邮箱</div>
				</div>*/}
				<div className="btn">
                    <Tap className="copy" onTap={this.onCopyLink}>
                        <div>
                            复制下载链接
                        </div>
					</Tap>
                    <Tap className="email" onTap={this.onShowEmail}>
                        <div>
                            一键发送邮箱
                        </div>
					</Tap>
                </div>
                <Modal
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose}
                    title="提示"
                    footer={[{ text: '发送', onPress: () => { this.onSendEmail(); } }]}
                >
                    <div className="tsText" style={{ textAlign: "left", fontSize: "12px", }}>
                        请输入发送材料的电子邮箱
                        <input ref="ref_email" type="text" />
                    </div>
                </Modal>
			</div>
		)
	}
} 

Evidence.defaultProps = {
	data: [
		{
            id: 0,
			title: "民事诉讼材料",
			sub_title: "诉讼材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		},
		{
            id: 1,
			title: "仲裁申请材料",
			sub_title: "仲裁材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		},
		{
            id: 2,
			title: "举报信材料",
			sub_title: "举报材料_TJD201804131706076770443",
			circle_default: "/imgs/iou/default.svg",
			circle_active: "/imgs/iou/active.svg",
			load_default: "imgs/iou/load_default.svg",
			load_active: "imgs/iou/load_active.svg"
		}
	]
}
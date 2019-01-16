
import 'LESS/index'
import './index.less'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Tap,InputValid,Pay,InputCode } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'

@withRouter
@inject('userStore')
@observer
export default class Page extends Component {
    
    constructor() {
        super()
        this.state = {
        }
    }

    componentDidMount() {
        let _this = this;
        if($.isWeiXin){
            //this.getTencentSign();
        }else{
            //首页物理键返回  退出程序
            // document.addEventListener("deviceready", function(){
                
            // }, false);
            // document.addEventListener("backbutton", function(){
            //     alert(window.location.hash)
            //     if(window.location.hash == '#/'){
            //         navigator.app.exitApp();
            //     }
            // }, false);
        }

        //20181024

        //版本更新 js包 发生改变 刷新
        $._flag = false;
        setTimeout(()=>{
            if(window.history && window.history.pushState) {
                $(window).on('popstate', function() {
                    $.Dialog && $.Dialog.close()
                    Loading.hide()
                    $._flag = true
                    setTimeout(()=>{ 
                        if($._flag){
                            window.location.reload(true)
                        }
                    },1500)
                });
            }
        },2000)
    }

    componentWillUpdate(){
        //$.Dialog && $.Dialog.close();
    }

    componentDidUpdate(){
        $._flag = false;

        // if(!$.isWeiXin){
        //     let doc_title = document.getElementById('nav_title');
        //     if(doc_title){
        //         doc_title.innerHTML = document.title;
        //     }
        // }
    }

    onCloseAtten=()=>{
        this.props.userStore.setUserAtten(false);
    }

    onCloseBox=(type)=>{
        if(type=='pwd'){
            this.props.userStore.setBox({
                pwd:false
            });
        }

        if(type=='code'){
            this.props.userStore.setBox({
                code:false
            });
        }

        if(type=='pay'){
            this.props.userStore.setBox({
                pay:false
            });
        }        
    }

    render() {
        const { userStore,userStore:{box} } = this.props;
        return (
            <div className="view-layout">
                {this.props.children}
                {/* 没有关注弹窗 */}
                {userStore.atten?<Modal visible={userStore.atten}
                    transparent
                    maskClosable={false}
                    footer={[
                        { text: '知道了', onPress: this.onCloseAtten}]}>
                        <div className='atten_detail'>
                            <p>你还没有关注【今借到】公众号</p>
                            <span>长按下方图片</span>
                            <span>点击【识别图中二维码】</span>
                            <span>点击关注即可关注</span>
                            <img src={'/imgs/com/yyj_qr_small.jpg'} alt="" />
                        </div>
                </Modal>:null}

                {box.pwd?<InputValid
                         visible={box.pwd}
                         onEnd={box.onPwdEnd}
                         onClose={()=>{this.onCloseBox('pwd')}} />:null}
                
                {box.pay?<Pay 
                            payVisible={box.pay}
                            money={box.money}
                            onLine={box.onLine}
                            edit={box.edit}
                            poundage={box.poundage}
							onPayEnd={box.onPayEnd}
                            onClose={()=>{this.onCloseBox('pay')}}>	
                </Pay>:null}
                
                {box.code?<InputCode                         
                         visible={box.code} 
                         onEnd={box.onCodeEnd} 
                         onClose={()=>{this.onCloseBox('code')}} />:null}
            </div>
        )
    }
}

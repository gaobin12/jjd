
import './index.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'SERVICE'

export default class ImgUpload extends Component {
    //属性
    static propTypes = {
        className: PropTypes.string,
        imgLength: PropTypes.number,
        imgUrls: PropTypes.array,
        //属于借条 或  信用认证
        iou:PropTypes.bool,
        //是否可修改
        editable:PropTypes.bool,
        //选中图片后
        onChange: PropTypes.func
    }
    //设置属性默认值
    static defaultProps = {
        iou:true,
        editable:true,
        imgLength: 20,
        srcs: []
    }
    constructor(props) {
        super(props)        
        this.state = {
            isWeixin:$.isWeiXin,
            imgUrls:this.props.imgUrls
        }
    }

    //
    componentDidMount(){ 
        // let ele = document.getElementById('img_upload_ele');
        // ele.onclick = function(){
        //     alert('22');
        //     wx.chooseImage({
        //         success: function (res) {
        //           alert('已选择 ' + res.localIds.length + ' 张图片');
        //         }
        //       });
        // }
        
        if($.isWeiXin){
            this.getTencentSign();
        }
    }

    //获取微信签名
    getTencentSign = ()=>{
        const _this = this;
        $.ajaxE({
            type: 'GET',
            url: '/user/wx/signURL',
            data:{
                url: location.href
            }
        }).then((data)=>{
            $.WXConfig({
                appId:data.appId,
                timestamp:data.timestamp,
                nonceStr:data.nonceStr,
                signature:data.signature
            });
        }).catch((msg)=>{
            console.log(msg);
        })
    }

    choosePic11=()=>{
        wx.chooseImage({
            success: function (res) {
              alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });
    }

    //点击选择照片
    choosePic=()=>{
        const _this = this;
        let imgLength = _this.state.imgLength - _this.state.imgUrls.length;
        imgLength = imgLength>=9?9:imgLength;
        if ($.isWeiXin) {
            //微信
            wx.chooseImage({
                count: imgLength, // 默认9
                sizeType: ['original', 'compressed'],
                // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'],
                // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    //alert(JSON.stringify(res));
                    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    let num = 0;
                    //获取银行详情
                    Loading.show();
                    let uploadIMG = function(localId){
                        _this.upLoadAjaxWx(localId,(data)=>{
                            let imgUrl = data.key;
                            _this.state.imgUrls.push(imgUrl);
                            num++;
                            if(num < res.localIds.length){
                                uploadIMG(res.localIds[num]);
                            }else{
                                Loading.hide();
                                _this.props.onChange && _this.props.onChange(_this.state.imgUrls);
                                _this.setState({
                                    imgUrls:_this.state.imgUrls
                                });
                            }
                        });
                    }
                    uploadIMG(res.localIds[num]);
                }
            })
        }else{
            //App

        }
    }

    //上传服务器 微信
    upLoadAjaxWx=(imgData,callBack)=>{
        let ajaxUrl = '/user/my/uploadImgQiniu';
        if(!this.props.iou){
            ajaxUrl = '/credit/accredit/uploadImgQiniu';
        }
        if ($.isWeiXin) {
            //微信
            wx.uploadImage({
                localId: imgData,
                isShowProgressTips: 0,// 默认为1，显示进度提示
                success: function (res) {
                    $.ajaxE({
                        type: 'POST',
                        url: ajaxUrl,
                        data:{
                            img: res.serverId
                        }
                    }).then((data)=>{
                        callBack(data);
                    }).catch((msg)=>{
                        Modal.infoX(msg);
                    })
                },
                fail: function (res) {                
                    console.log(JSON.stringify(res));
                }
            });
        }else{
            //App
            wx.getLocalImgData({
                localId: imgData,// 图片的localID
                success: function(res) {
                    // localData是图片的base64数据，可以用img标签显示
                    $.ajaxE({
                        type: 'POST',
                        url: ajaxUrl,
                        data:{
                            img: res.localData
                        }
                    }).then((data)=>{
                        
                    }).catch((msg)=>{
                        Modal.infoX(msg);
                    })
                }
            })
        }        
    }

    //选择预览照片
    showCurrent=(e)=>{
		const _this = this;
        const currentUrl = e.target.src;
        if ($.isWeiXin) {
            //微信
            wx.previewImage({
                current:currentUrl, // 当前显示图片的http链接
                urls: _this.props.imgUrls // 需要预览的图片http链接列表
            })
        }else{
            //App

        }
    }    


    //微信获取本地图片的base64数据
    loadLocalPic=(img, serverId)=> {
        var _this = this;
    	wx.getLocalImgData({
            localId: img,// 图片的localID
            success: function(res) {
                // localData是图片的base64数据，可以用img标签显示
                //res.localData
            }
        })
    }

    //删除图片
    onCloseImg=(img)=>{
        let list = [];
        let { imgUrls } = this.state;
        imgUrls.forEach(item => {
            if(item != img){
                list.push(item);
            }
        });
        this.setState({
            imgUrls:list
        });
        this.props.onChange && this.props.onChange(list);
    }
    
    render() {
        const { className,editable } = this.props;
        const { imgUrls } = this.state;
        return (
            <div className={className?className+' img-upload':'img-upload'}>
                {imgUrls.map((item)=>{
                    return <div className='pic' key={Math.random()}>
                        <span>
                            <img src={$.jjd.imgUrl+item} onTouchEnd={this.showCurrent}/>
                            <span className="pic_close" onTouchEnd={()=>{this.onCloseImg(item)}}><img src={'/imgs/com/clear.svg'} /></span>
                        </span>
                    </div>
                })}
                {editable?<div className='pic upload' onTouchEnd={this.choosePic}>
                    <span>
                        <img src={'/imgs/com/plus.svg'} alt="" />
                    </span>
                </div>:null}
            </div>
        )
    }
}

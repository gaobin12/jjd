
import React, { Component } from 'react'
import { Toast,Modal } from 'antd-mobile';

const Loading = {
    //弹出loading
    show: function () {
        $.isTip = 0;
        Toast.info(<div>     
            <span style={{width: '.5rem',display:'block'}}>
                <svg width="100%"  height="100%"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{background: 'none'}}><g transform="rotate(0 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(30 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(60 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(90 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(120 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(150 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(180 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(210 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(240 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(270 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(300 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
                </rect>
                </g><g transform="rotate(330 50 50)">
                <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#ff9900">
                    <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                </rect>
                </g></svg>
            </span>
        </div>, 10);
    },
    //隐藏loading
    hide: function () {
        if($.isTip){
            return;
        }
        Toast.hide()
    },    
}

Modal.alertX = function(title, message, actions, platform){
    $.Dialog = Modal.alert(title, message, actions, platform);
}

Modal.infoX = function(msg,callBack){
    $.Dialog = Modal.alert('提示', msg, [
        { text: '知道了', onPress: () => {callBack && callBack()} },
    ])
}

Modal.confirmX = function(msg,onOk,onCancel){
    $.Dialog = Modal.alert('提示', msg, [
        { text: '取消', onPress: onCancel, style: 'default' },
        { text: '确定', onPress: onOk },
    ]);
}

Modal.tip = function(msg,duration=3){
    $.isTip = 1;
    Toast.info(msg, duration);
}
//被拉黑
Modal.report = function(){
    //限制补借条
    // if($.isUserExist() && $.getUserInfo().banStatus){
    //     $.Dialog = Modal.alert('提示', '由于您违规操作，现已被禁止使用补借条功能，请您先为被举报的借条反馈证据。如有疑问，请及时联系客服。', [
    //         { text: '取消', onPress: null, style: 'default' },
    //         { text: '确定', onPress: null },
    //     ]);
    //     return true;
    // }
    //拉黑
    
    if($.getUserInfo() && $.getUserInfo().banStatus){
        $.Dialog = Modal.alert('提示', '由于您违规操作，现已被平台拉黑，借条相关功能已限制使用。请您先为被举报的借条反馈证据。如有疑问，请及时联系客服。', [
            { text: '取消', onPress: null, style: 'default' },
            { text: '确定', onPress: null },
        ]);
        return true;
    }

    //冻结
    if($.getUserInfo() && $.getUserInfo().frozenStatus){
        $.Dialog = Modal.alert('提示', '由于您违规操作，现已被平台冻结。暂不可通过任何方式完成出借。请您先为被举报的借条反馈证据。如有疑问，请及时联系客服。', [
            { text: '取消', onPress: null, style: 'default' },
            { text: '确定', onPress: null },
        ]);
        return true;
    }
    return false;
}
export { Loading,Modal };
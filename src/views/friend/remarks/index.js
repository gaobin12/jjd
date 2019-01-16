
//好友 => 备注
import '../common.less'
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'
import { Loading, Modal } from 'SERVICE'
import {TextareaItem} from 'antd-mobile'

@withRouter
export default class Page extends Component {
    constructor(props, context) {
        document.title = "好友备注";
        super(props, context)
        
        this.state = {
            switchIndex: 1
        };
    }

    componentDidMount() {
        this.autoFocusInst.focus();
    }
    render() {
        return (
            <div className="view-friend view-friend-remark">
                <TextareaItem
                    ref={el => this.autoFocusInst = el}
                    maxLength={40}
                    rows={8}
                    placeholder='请填写备注'
                    labelNumber={5}
                    onChange = {()=>{}}
                />
                <div className='common-btn_box'>
                    <Tap className='c-black span'>
                        保存
                    </Tap>
                </div>
            </div>
        )
    }
}
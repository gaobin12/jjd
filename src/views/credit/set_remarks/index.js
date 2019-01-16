
//信用报告
import './index.less'
import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { List, InputItem, TextareaItem,Button } from 'antd-mobile'
import {Tap, Tips } from 'COMPONENT'
import { Loading, Modal, util } from 'SERVICE'

@withRouter
export default class Page extends Component {
  constructor (props, context) {
    document.title = "设置备注";   
    super(props, context)
      let query = util.getUrlParams(this.props.location.search);
    this.state = {    
        memo:query.memo,
        userId:query.userId  
    };
    //this.renderTree = renderTree.bind(this)
  }
    gotoPage=()=>{
        Loading.show();
        $.ajaxE({
            type: 'POST',
            url: "/user/friend/setFriendMemory",
            contentType: 'application/json',
            data: {
                friendId: this.state.userId,
                memo:this.refs.textArea.textareaRef.value
            }
        }).then((data) => {
            //debugger;
            // $.RouterMap['/credit/set_remarks'] = {
            //     pathname: '/after/receive_list'
            // };
            this.props.history.push({
                pathname: '/credit/report_simple',
                query: {
                    userId: this.state.userId
                }
            });
        }).catch((msg) => {
            Modal.infoX(msg);
        }).finally(()=>{
            Loading.hide();
        })
    } 

  render () {
    return (
      <div className='view-remark'>
        <List renderHeader={() => '备注信息(不超过40字)'}>
            <TextareaItem
                ref='textArea'
                defaultValue={this.state.memo}
                placeholder="请输入备注信息(<40字)"
                autoHeight
                rows={3}				
                count={40}
                labelNumber={5}
            />
        </List>

        <div className="bottom bottom_fixed">
            <Tap onTap={() => { this.gotoPage() }}>
                <div className="bottom_button">保存</div>
            </Tap>
        </div>
      </div>
    )
  }
}
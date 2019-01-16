
//版本介绍
import './index.less';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd-mobile';

const Item = List.Item;


export default class App extends Component {
    constructor(props, context) {
        document.title = "版本介绍";
        super(props, context)
        this.state = {
            id:'',
            title:'',//标题
            version:'',//版本号
            content1:'', //内容1
            content2:'', //内容2
            content3:'', //内容3
            content4:'', //内容4
            content5:'', //内容5

            contentInfo:[
            ],
        };
    }
    componentDidMount(){
        this.get_version()
    }

    get_version = (v) => {
        $.ajaxE( {
            type: 'GET',
            url: '/user/my/getHomePageUpdatePushList',
            data: {

            }
        }).then((data) => {
            this.setState({
                contentInfo:data
            })
           
        }).catch((msg) => {
            Modal.infoX(msg);
        })
    }
    render() {
        
        return (
            <div className='update_history'>
                {this.state.contentInfo.map((item, index) => {
                    return <List key={'valid' + index} >
                        <h3>{item.version}</h3>
                        <ul>
                            <li>{item.content1}</li>
                            <li>{item.content2}</li>
                            <li>{item.content3}</li>
                            <li>{item.content4}</li>
                            <li>{item.content5}</li>
                           
                        </ul>
                    </List>
                })}
              
            </div>
        )
    }
}

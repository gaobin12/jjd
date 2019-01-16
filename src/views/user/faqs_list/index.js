
//个人信息=>客服=>常见问题=>头部icon点击进来的页面
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link,withRouter } from 'react-router-dom'
import { List} from 'antd-mobile'
import { Tap } from 'COMPONENT'


const Item = List.Item


@withRouter
export default class App extends Component {
    
    constructor(props, context) {
        document.title = "问题详情";
        super(props, context)
        this.state = {
            name:'amy',
            faqList: [],//问题列表数据

           
        };
        
    }

    // 调接口
    componentDidMount() {
        if(this.props.location.query.faqs_list_data_id){
			var faqs_list_data_id = this.props.location.query.faqs_list_data_id;
            this.ListData(faqs_list_data_id);
		}
        
    }
   
    ListData = (faqs_list_data_id) => {
        // 通过类型查询常见问题
        $.ajaxE({
            type: 'GET',
            
            url: "/user/my/getFaqListByType",
            
            data:{
                 faqTypeId: faqs_list_data_id
            }

        }).then((data) => {
            this.setState({
                faqList: data.faqList,
            })
        }).catch((msg) => {
            //  Modal.infoX(msg);
        })

    }
    toFaqs_detail = (faqTypeId, faqc_title, index) => {
        let {faqList} = this.state;
       // 跳转页面(详情)
        this.props.history.push({
            // pathname: '/user/faqs_detail',query:{faqs_list_detail: JSON.stringify(faqList[index])}
            pathname: '/user/faqs_detail',query:{faqs_list_detail_id: faqTypeId}
        });
    }
    render() {
        let { faqList} = this.state
        return (
            <div className='view-faqs-list'>
                {/* 问题列表 从后台获取数据*/}
                <List className="query-list">
                    {
                        faqList.map((ele, index) => {
                                    let faqTypeId=ele.id
                                    let faqc_title = ele.title
                                    let faqTypeId_index = index
                            
                            return (
                                    <div>
                                        <Tap onTap={(e) => { this.toFaqs_detail(faqTypeId, faqc_title, index) }}> 
                                               <Item arrow="horizontal" key={'faqs' + index}>
                                                  {ele.title}
                                              </Item>
                                        </Tap>
                                    </div>



                                
                            )
                            
                        })

                    }
                </List>

            </div>
        )
    }
}

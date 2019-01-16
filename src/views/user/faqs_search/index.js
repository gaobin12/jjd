
//个人信息=>客服=>常见问题=>搜索
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, SearchBar } from 'antd-mobile'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'

const Item = List.Item

@withRouter
export default class App extends Component {
    
    constructor(props, context) {
        document.title = "搜索";
        super(props, context)
        this.state = {
            search_faqList:[],
        };
    }

    Fun = (value) =>{
        // 根据条件（title）模糊查询常见问题
        $.ajaxE( {
            type: 'GET',
            url: "/user/my/getFaqLike",
            data:{
                faqTitle:value
            }
        }).then((data) => {
            this.setState({
                search_faqList: data.faqList
            })
        }).catch((msg) => {
            console.log(msg);
        })
    }
    Fun2 = () =>{
        // 根据角色查询常见问题
        $.ajaxE( {
            type: 'GET',
            url: "/user/my/getFaqByRole",
            data:{}
        }).then((data) => {

        }).catch((msg) => {
            console.log(msg);
        })
    }

onChange = (value) =>{
    
    this.Fun(value);
    
}
search_toFaqsList_detail = (faqTypeId, faqTypeId_index) =>{
    
       // 跳转页面(详情)
        this.props.history.push({
            pathname: '/user/faqs_detail',query:{faqs_list_detail_id: faqTypeId}
        });
}

    render() {
        let{search_faqList}=this.state
        return (
            <div className='view-faqs-search'>
                {/* 搜索框 */}
                <SearchBar placeholder="可搜索关键字" 
                maxLength={8} 
                onChange = {this.onChange}
                />
                {/* 搜索出来的列表 */}
                <List className="query-list">
                     {
                        search_faqList.map((ele, index) => {
                            let faqTypeId=ele.id
                            let faqTypeId_index = index
                            return (
                                    <div>
                                        <Tap onTap={(e) => { this.search_toFaqsList_detail(faqTypeId, faqTypeId_index) }}> 
                                               <Item arrow="horizontal" key={'faqs' + index}>
                                                  {ele.title}
                                              </Item>
                                        </Tap>
                                    </div>
                                    )   
                        })
                     }

                    {/* <Link to="/user/faqs_detail">


                        <Item arrow="horizontal">
                            借款问题
                        </Item>


                    </Link> */}
                </List>
            </div>
        )
    }
}


//个人信息=>客服=>常见问题
import './index.less'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, Flex } from 'antd-mobile'
import { Link,withRouter } from 'react-router-dom'
import { Tap } from 'COMPONENT'

const Item = List.Item

@withRouter
export default class App extends Component {
    constructor(props, context) {
        document.title = "常见问题";
        super(props, context)
        this.state = {
            name:'amy',
            // faqTypeList: [{name:'信用认证'},{name:'求借款'}],//头部问题类型列表
            faqTypeList: [],//常见问题列表
            faqPopList: [],//热门问题列表
        };
        //this.renderTree = renderTree.bind(this)
    }

    // 调接口
    componentDidMount() {
        this.ListData();
    }
    ListData=()=>{
       
        let { faqTypeList, faqPopList} = this.state
        // 获取常见问题类型和热门问题
        $.ajaxE({
            type: 'GET',
            url: "/user/my/getFaqTypeAndPop",
            data: {}
        }).then((data) => {
            this.setState({
                faqTypeList: data.faqTypeList,
                faqPopList: data.faqPopList
            })
        }).catch((msg) => {
            console.log(msg);
        })

    }
    // 跳到问题列表

     toFaqsList = (TypeId, TypeName, faqTypeId_index)=>{
        let { faqTypeList } = this.state
        this.props.history.push({
                //   pathname: '/user/faqs_list',query :{faqs_list_data: JSON.stringify(faqTypeList[faqTypeId_index])} 
                pathname: '/user/faqs_list',query :{faqs_list_data_id: TypeId}  
                });
       }
    // 跳到问题详情
    list=()=>{
        // 跳转页面(待完善)
        this.props.history.push({
            pathname: '/user/faqs_detail'
        });
    }
//直接跳转到详情

        straight_list_detailst=(straight_faqTypeId, straight_faqTypeId_index)=>{
                // 跳转页面(待完善)
                let {faqPopList} = this.state;
                this.props.history.push({
                    pathname: '/user/faqs_detail' ,query :{faqs_list_detail_id: straight_faqTypeId}  
                });
            }

    render() {
        let { faqTypeList, faqPopList } = this.state
        return (
            <div className='view-faqs'>
            {/* 头部 从后台获取数据 */}
                <div style={{height:'100%',overflow:'auto'}}>
                    <div className="img-icon">
                        <List className="box1">
                            <Flex wrap="wrap"> 
                                {
                                faqTypeList.map((ele,index)=>{
                                        let faqTypeId=ele.id
                                        let faqTypeName = ele.typeName
                                        let faqTypeId_index = index
                                        return (
                                            <Tap onTap={(e) => { this.toFaqsList(faqTypeId, faqTypeName, faqTypeId_index) }}> 
                                                <div className="img-box" key={'faqs' + index}>
                                                    <img src={$.jjd.imgUrl + ele.img + '?v=1'} />
                                                    <div className="i-title">{ele.typeName}</div>
                                                </div>
                                            </Tap>
                                        )
                                        
                                    })

                                }
                            </Flex>
                        </List>
                    </div>
                    {/* 搜索框 */}
                    <div className="faq_tit">
                        <div className="faq_tit_font">
                            <i className="newdot"></i>
                            热门问题
                        </div> 
                        <Link to='/user/faqs_search'>
                            <div className="faq_tit_sac">
                                <img src={'/imgs/com/search.svg'} />
                                搜索相关问题
                            </div>
                        </Link>
                    
                    </div>

                    {/* 问题列表 从后台获取数据*/}
                    <List className="query-list">
                        {
                            faqPopList.map((ele, index) => {
                                let straight_faqTypeId=ele.id
                                let straight_faqTypeId_index = index
                                return (
                                    <Tap onTap={(e) => { this.straight_list_detailst(straight_faqTypeId, straight_faqTypeId_index)}}>
                                        <Item arrow="horizontal" key={'faqs' + index} className="query_list_item">
                                            {ele.title}
                                        </Item>
                                    </Tap>
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
                {/* 在线客服 */}
                <div className="faq_ser">
                    <a href='http://help.jinjiedao.cn/kchat/22629?from=%E5%9C%A8%E7%BA%BF%E6%94%AF%E6%8C%81'>
                        <img src={'/imgs/com/faq_ser.svg'} />
                        在线客服
                    </a>
				</div>


            </div>
        )
    }
}

//借入/借出列表 => 筛选
import React, {Component} from 'react'
import { DatePicker, List, Button,   } from 'antd-mobile';
import { Tap } from 'COMPONENT'
import { Loading, Modal, math, } from 'SERVICE'
import './index.less'
/**
  * 获取借入信息
  * @param{
  start //开始
  limit //条数
  userName //出借人/借款人姓名
  loanStatus //借条状态 0、待处理 1、全部待收 2、未逾期待收 3、已逾期待收 4、已完结 5、有争议
  sortType //排序类型 0、还款时间从早到晚 1、还款时间从晚到早 2、借条金额从少到多 3、借条金额从多到少
  minAmount // 查询条件 最小金额
  maxAmount // 查询条件 最大金额
  borrowTimeBgn // 查询条件 借款开始时间
  borrowTimeEnd // 查询条件 借款结束时间
  repayTimeBgn // 查询条件 还款开始时间
  repayTimeEnd // 查询条件 还款结束时间
  sourceTypeList // 来源0：补借条；1：求借款； 2去出借；3：急速借
  loanStatusList //筛选条件多选 借条状态 0、待处理 1、全部待收 2、未逾期待收 3、已逾期待收 4、已完结
  loanReportTypeList //筛选条件多选 举报状态 0.未举报 1.处理中 2.待反馈  3.已驳回 4.已接受
  loanWriteOffTypeList // 查询条件 字符串拼接的借条销账状态数组 0.未销账 1.已销账 2.待确认
  loanExtendTypeList // 查询条件 字符串拼接的借条展期状态数组 0.未展期 1.已展期 2.待确认
  loanCollectionTypeList // 查询条件 字符串拼接的借条催收状态数组 0.未催收 1.催收中 2.已结束
 }
  * @return {
  "code": "200",
  "message": "success",
  "data":{
   loanCount //查询出的条数
   repayAndReceiveAmount //待还/代收
   totalAmount //总本金
   loanInfoList[{ //借入/借出信息集合
   loanIdE // 借条id（加密后）
   name // 借款人/出借人姓名
   loanStatus // 借条状态 1.还款中 2.已还清 3.已逾期 4.有争议
   waitConfirmRepayStatus //是否有待确认还款
   reportStatus //是否有进行中的举报
   waitConfirmExceedStatus //是否有待确认展期
   waitConfirmWriteOffStatus //是否有待确认展期
   onlineStatus //0.线下 1.线上
   amount //借条原始本金 如展期过就是展期前的本金
   interestRate //年化利率
   borrowTime //借款时间
   repayTime //还款时间
   repayAndReceiveAmount 待还
   leftTime //剩余/逾期/曾逾期 多少天
   }]
  }
 }
  * @throws Exception
  */

export default class App extends Component {
    
    constructor(props, context) {
        document.title = "筛选";
        super(props, context)
        
        this.state = {
            _borrowTimeBgn: null,
            _borrowTimeEnd: null,
            _repayTimeBgn: null,
            _repayTimeEnd: null,
            _minAmount : 0,
            _maxAmount : 0,
            sourceTypeList: [], 
            loanStatusList: [],  
            loanReportTypeList: [],  
            loanWriteOffTypeList: [],  
            loanExtendTypeList: [],  
            loanCollectionTypeList: [], 
        };
    }
    componentDidMount(){
        
    }
    onReset=()=>{
        this.setState({
            _borrowTimeBgn: null,
            _borrowTimeEnd: null,
            _repayTimeBgn: null,
            _repayTimeEnd: null,
            _minAmount : 0,
            _maxAmount : 0,
            sourceTypeList: [], 
            loanStatusList: [],  
            loanReportTypeList: [],  
            loanWriteOffTypeList: [],  
            loanExtendTypeList: [],  
            loanCollectionTypeList: [], 
        })
    }
  //智行
  onFilter = () => {
        document.activeElement.blur()
        let query = this.state;
        query.maxAmount = $.toFen(query._maxAmount)
        query.minAmount = $.toFen(query._minAmount)
        query.borrowTimeBgn = query._borrowTimeBgn?(query._borrowTimeBgn).Format('yyyy-MM-dd'):null
        query.borrowTimeEnd = query._borrowTimeEnd?(query._borrowTimeEnd).Format('yyyy-MM-dd'):null
        query.repayTimeBgn = query._repayTimeBgn?(query._repayTimeBgn).Format('yyyy-MM-dd'):null
        query.repayTimeEnd = query._repayTimeEnd?(query._repayTimeEnd).Format('yyyy-MM-dd'):null
        
        if(query.sourceTypeList.length==0||query.sourceTypeList.length==4)delete query.sourceTypeList
        if(query.loanStatusList.length==0||query.loanStatusList.length==5) query.loanStatusList = null
        if(query.loanReportTypeList.length==0||query.loanReportTypeList.length==5)delete query.loanReportTypeList
        if(query.loanWriteOffTypeList.length==0||query.loanWriteOffTypeList.length==3)delete query.loanWriteOffTypeList
        if(query.loanExtendTypeList.length==0||query.loanExtendTypeList.length==3)delete query.loanExtendTypeList
        if(query.loanCollectionTypeList.length==0||query.loanCollectionTypeList.length==3)delete query.loanCollectionTypeList
        if(query.maxAmount==0)query.maxAmount=null;
        
        //删除无用属性
        for(let key in query){
            if(query.hasOwnProperty(key)&&key.substr(0,1)=='_'){
                delete  query[key]
            }
        }
        sessionStorage.setItem('list_filter',JSON.stringify(query))

        //安卓机键盘这
        setTimeout(() => {
            history.back()
        }, 500);
  }
   onChange(key,value){
        let list = this.state[key],
            index = list.indexOf(value);
        if(index!=-1){
            list.splice(index, 1);
        }else{
            list.push(value)
        }
        this.setState({
            [key]: list
        })
    }

  onMinAmount = (e)=>{
      this.setState({
        _minAmount : e.target.value
      })
  }
  onMaxAmount = (e)=>{
    this.setState({
        _maxAmount : e.target.value
    })
  }
  //   校验日期
  borrowTimeEnd=(v)=>{
    if(this.state._borrowTimeBgn<v){
        this.setState({
            _borrowTimeEnd : v
        })
    }else{
        Modal.alertX('提示', <div>结束时间应该大于开始时间</div>, [
            { text: '知道了', onPress: () => {
            }},
        ])
    }
  }
  repayTimeEnd=(v)=>{
    if(this.state._repayTimeBgn<v){
        this.setState({
            _repayTimeEnd : v
        })
    }else{
        Modal.alertX('提示', <div>结束时间应该大于开始时间</div>, [
            { text: '知道了', onPress: () => {
            }},
        ])
    }
  }
  render () {
    let  { sourceTypeList, loanStatusList, loanReportTypeList, loanWriteOffTypeList, loanExtendTypeList, loanCollectionTypeList, } = this.state;
    let type = this.props.location.query.type;
    return (
        <div className="view-filter-item">
            <div style={{overflow:'auto',height:'100%'}}>

                <div className="price-range">
                    <div className="left">借款金额</div>
                    <div className="right">
                        <input type="number" placeholder="请输入整数" placeholder='0' onChange={this.onMinAmount } value = {this.state._minAmount}/>元-
                        <input type="number" placeholder="请输入整数" placeholder='0' onChange={this.onMaxAmount }  value = {this.state._maxAmount}/>元
                    </div>
                </div>

                <div className="date-title">请输入借款期限区间</div>
                <div className="date-item">
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="--"
                        value={this.state._borrowTimeBgn&&this.state._borrowTimeBgn}
                        onChange={_borrowTimeBgn => this.setState({ _borrowTimeBgn })}
                    >
                        <List.Item arrow="horizontal">借款(出借)开始时间</List.Item>
                    </DatePicker>
                </div>
                <div className="date-item">
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="--"
                        value={this.state._borrowTimeEnd&&this.state._borrowTimeEnd}
                        onChange={this.borrowTimeEnd}
                    >
                        <List.Item arrow="horizontal">借款(出借)结束时间</List.Item>
                    </DatePicker>
                </div> 
                <div className="date-item">
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="--"
                        value={this.state._repayTimeBgn&&this.state._repayTimeBgn}
                        onChange={_repayTimeBgn => this.setState({ _repayTimeBgn })}
                    >
                        <List.Item arrow="horizontal">还款开始时间</List.Item>
                    </DatePicker>
                </div>
                <div className="date-item">
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="--"
                        value={this.state._repayTimeEnd&&this.state._repayTimeEnd}
                        onChange={this.repayTimeEnd}
                    >
                        <List.Item arrow="horizontal">还款开始时间</List.Item>
                    </DatePicker>
                </div> 
                <List className='tag-list'>
                    <div className='left'>借条类型：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('sourceTypeList',0)}}>
                            <div className={sourceTypeList&&sourceTypeList.indexOf(0)!=-1?'tag-div active':'tag-div'}>补借条</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('sourceTypeList',1)}}>
                            <div className={sourceTypeList&&sourceTypeList.indexOf(1)!=-1?'tag-div active':'tag-div'}>求借款</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('sourceTypeList',2)}}>
                            <div className={sourceTypeList&&sourceTypeList.indexOf(2)!=-1?'tag-div active':'tag-div'}>去出借</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('sourceTypeList',3)}}>
                            <div className={sourceTypeList&&sourceTypeList.indexOf(3)!=-1?'tag-div active':'tag-div'}>极速借条</div>
                        </Tap>
                    </div>
                </List>
                <List className='tag-list'>
                    <div className='left'>借条状态：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('loanStatusList',1)}}>
                            <div className={loanStatusList&&loanStatusList.indexOf(1)!=-1?'tag-div active':'tag-div'}>未逾期{type}</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanStatusList',2)}}>
                            <div className={loanStatusList&&loanStatusList.indexOf(2)!=-1?'tag-div active':'tag-div'}>已逾期{type}</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanStatusList',3)}}>
                            <div className={loanStatusList&&loanStatusList.indexOf(3)!=-1?'tag-div active':'tag-div'}>已完结</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanStatusList',4)}}>
                            <div className={loanStatusList&&loanStatusList.indexOf(4)!=-1?'tag-div active':'tag-div'}>有争议</div>
                        </Tap>
                    </div>
                </List>
                <List className='tag-list'>
                    <div className='left'>举报状态：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('loanReportTypeList',0)}}>
                            <div className={loanReportTypeList&&loanReportTypeList.indexOf(0)!=-1?'tag-div active':'tag-div'}>未举报</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanReportTypeList',1)}}>
                            <div className={loanReportTypeList&&loanReportTypeList.indexOf(1)!=-1?'tag-div active':'tag-div'}>处理中</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanReportTypeList',2)}}>
                            <div className={loanReportTypeList&&loanReportTypeList.indexOf(2)!=-1?'tag-div active':'tag-div'}>待反馈</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanReportTypeList',3)}}>
                            <div className={loanReportTypeList&&loanReportTypeList.indexOf(3)!=-1?'tag-div active':'tag-div'}>已驳回</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanReportTypeList',4)}}>
                            <div className={loanReportTypeList&&loanReportTypeList.indexOf(4)!=-1?'tag-div active':'tag-div'}>已接受</div>
                        </Tap>
                    </div>
                </List>
                <List className='tag-list'>
                    <div className='left'>销账状态：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('loanWriteOffTypeList',0)}}>
                            <div className={loanWriteOffTypeList&&loanWriteOffTypeList.indexOf(0)!=-1?'tag-div active':'tag-div'}>未销账</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanWriteOffTypeList',1)}}>
                            <div className={loanWriteOffTypeList&&loanWriteOffTypeList.indexOf(1)!=-1?'tag-div active':'tag-div'}>已销账</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanWriteOffTypeList',2)}}>
                            <div className={loanWriteOffTypeList&&loanWriteOffTypeList.indexOf(2)!=-1?'tag-div active':'tag-div'}>待确认</div>
                        </Tap>
                    </div>
                </List>
                <List className='tag-list'>
                    <div className='left'>展期状态：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('loanExtendTypeList',0)}}>
                            <div className={loanExtendTypeList&&loanExtendTypeList.indexOf(0)!=-1?'tag-div active':'tag-div'}>未展期</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanExtendTypeList',1)}}>
                            <div className={loanExtendTypeList&&loanExtendTypeList.indexOf(1)!=-1?'tag-div active':'tag-div'}>已展期</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanExtendTypeList',2)}}>
                            <div className={loanExtendTypeList&&loanExtendTypeList.indexOf(2)!=-1?'tag-div active':'tag-div'}>待确认</div>
                        </Tap>
                    </div>
                </List>
                <List className='tag-list'>
                    <div className='left'>电催状态：</div>
                    <div className='right multiple'>
                        <Tap onTap={()=>{this.onChange('loanCollectionTypeList',0)}}>
                            <div className={loanCollectionTypeList&&loanCollectionTypeList.indexOf(0)!=-1?'tag-div active':'tag-div'}>未催收</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanCollectionTypeList',1)}}>
                            <div className={loanCollectionTypeList&&loanCollectionTypeList.indexOf(1)!=-1?'tag-div active':'tag-div'}>催收中</div>
                        </Tap>
                        <Tap onTap={()=>{this.onChange('loanCollectionTypeList',2)}}>
                            <div className={loanCollectionTypeList&&loanCollectionTypeList.indexOf(2)!=-1?'tag-div active':'tag-div'}>已结束</div>
                        </Tap>
                    </div>
                </List>
            </div>
            <div className="bottom-btns" >
                <Tap onTap={()=>{this.onReset()}}>
                    <Button>重置</Button>
                </Tap>
                <Tap onTap={()=>{this.onFilter()}}>
                    <Button type='primary'>筛选</Button>
                </Tap>
            </div>
        </div>
    )
  }


}
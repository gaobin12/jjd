'use strict'
import {
    action,
    observable
} from 'mobx'
import {
    util
} from 'SERVICE'

//贷前 补借条
class AfterIou {

    //借条详情
    @observable tab = 0;

    //借条详情
    @observable detail = null;

    //列表详情
    @observable info = null;

    constructor() {
        let _detail = {
            amount: 0,
            bidCnt: 0,
            borrowCount: 0,
            borrowTime: null,
            borrowTimeBgn: null,
            borrowTimeEnd: null,
            borrowerAvatarUrl: null,
            borrowerEmail: null,
            borrowerHomeAddress: null,
            borrowerIdCardNo: null,
            borrowerIp: null,
            borrowerName: null,
            borrowerTelephone: null,
            borrowerUidE: null,
            borrowerUidList: null,
            checkedAmt: null,
            collectionStatus: null,
            createTime: null,
            downloadStatus: null,
            ecloudAgreementStatus: null,
            endStatus: null,
            excitationList: [],
            forfeitAmount: null,
            gatheringAmount: null,
            gatheringAmountForCalculation: null,
            getAmount: null,
            gotAmount: null,
            guaranteeAmount: null,
            guaranteeAvatarUrl: null,
            guaranteeEmail: null,
            guaranteeHomeAddress: null,
            guaranteeIdCardNo: null,
            guaranteeName: null,
            guaranteeTelephone: null,
            guaranteeUidE: null,
            imgList: [],
            interestAmount: null,
            interestRate: null,
            lendCount: null,
            lenderAvatarUrl: null,
            lenderEmail: null,
            lenderHomeAddress: null,
            lenderIdCardNo: null,
            lenderIp: null,
            lenderName: null,
            lenderTelephone: null,
            lenderToRepayManageFeeToUsAmount: null,
            lenderUidE: null,
            lenderUidList: null,
            limit: null,
            loanStatus: null,
            localAgreementStatus: null,
            maxAmount: null,
            memo: null,
            minAmount: null,
            nowAmount: null,
            nowInterestAmount: null,
            nowRepayTime: null,
            onlineStatus: null,
            originalId: null,
            overdueDay: null,
            overdueManageAmount: null,
            overdueManageAmountSpecial: null,
            overdueRate: null,
            overdueToUsAmount: null,
            paidAmount: null,
            paidForfeitAmount: null,
            paidInterestAmount: null,
            paidOverList: [],
            paidOverdueManageAmount: null,
            paidlist: [],
            period: null,
            picList: null,
            purposeType: null,
            queryOrder: null,
            receivedAmount: null,
            repayAmount: null,
            repayList: [],
            repayTime: null,
            repayTimeBgn: null,
            repayTimeEnd: null,
            repayType: null,
            reportCount: null,
            returnOverdueManageAmount: null,
            selfType: null,
            serviceAmount: null,
            sourceId: null,
            sourceType: null,
            sourceTypeList: null,
            start: null,
            status: null,
            toBeReceivedAmount: null,
            toBeReceivedInterestForfeitAmount: null,
            totalAmount: null,
            uncheckList: [],
            updateTime: null,
            validStatus: true,
            versionNumber: null,
            writeOffId: null,
            writeOffStatus: null
        };
        this.detail = util.getItem('afterIouDetailStore') || _detail;

        let _info = {
            amount: 0,
            bidCnt: null,
            borrowCount: null,
            borrowTime: null,
            borrowTimeBgn: null,
            borrowTimeEnd: null,
            borrowerAvatarUrl: null,
            borrowerEmail: null,
            borrowerHomeAddress: null,
            borrowerIdCardNo: null,
            borrowerIp: null,
            borrowerName: null,
            borrowerTelephone: null,
            borrowerUidE: null,
            borrowerUidList: null,
            checkedAmt: null,
            collectionStatus: null,
            createTime: null,
            downloadStatus: null,
            ecloudAgreementStatus: null,
            endStatus: null,
            excitationList: [],
            forfeitAmount: null,
            gatheringAmount: null,
            gatheringAmountForCalculation: null,
            getAmount: null,
            gotAmount: null,
            guaranteeAmount: null,
            guaranteeAvatarUrl: null,
            guaranteeEmail: null,
            guaranteeHomeAddress: null,
            guaranteeIdCardNo: null,
            guaranteeName: null,
            guaranteeTelephone: null,
            guaranteeUidE: null,
            imgList: [],
            interestAmount: null,
            interestRate: null,
            lendCount: null,
            lenderAvatarUrl: null,
            lenderEmail: null,
            lenderHomeAddress: null,
            lenderIdCardNo: null,
            lenderIp: null,
            lenderName: null,
            lenderTelephone: null,
            lenderToRepayManageFeeToUsAmount: null,
            lenderUidE: null,
            lenderUidList: null,
            limit: null,
            loanStatus: null,
            localAgreementStatus: null,
            maxAmount: null,
            memo: null,
            minAmount: null,
            nowAmount: null,
            nowInterestAmount: null,
            nowRepayTime: null,
            onlineStatus: null,
            originalId: null,
            overdueDay: null,
            overdueManageAmount: null,
            overdueManageAmountSpecial: null,
            overdueRate: null,
            overdueToUsAmount: null,
            paidAmount: null,
            paidForfeitAmount: null,
            paidInterestAmount: null,
            paidOverList: [],
            paidOverdueManageAmount: null,
            paidlist: [],
            period: null,
            picList: null,
            purposeType: null,
            queryOrder: null,
            receivedAmount: null,
            repayAmount: null,
            repayList: [],
            repayTime: null,
            repayTimeBgn: null,
            repayTimeEnd: null,
            repayType: 0,
            reportCount: 0,
            returnOverdueManageAmount: null,
            selfType: null,
            serviceAmount: null,
            sourceId: null,
            sourceType: null,
            sourceTypeList: null,
            start: null,
            status: null,
            toBeReceivedAmount: null,
            toBeReceivedInterestForfeitAmount: null,
            totalAmount: null,
            uncheckList: [],
            updateTime: null,
            validStatus: null,
            versionNumber: null,
            writeOffId: null,
            writeOffStatus: null
        };
        this.info = util.getItem('preIouInfoStore') || _info;
    }

    @action setTab = (ob, callBack) => {
        this.tab = ob;
        callBack && callBack();
    }

    @action setDetail = (ob, callBack) => {
        this.detail = Object.assign(this.detail, ob);
        $.setItem('afterIouDetailStore', this.detail);
        callBack && callBack();
    }

    @action setInfo = (ob, callBack) => {
        this.info = Object.assign(this.info, ob);
        $.setItem('preIouInfoStore', this.info);
        callBack && callBack();
    }

}

export default new AfterIou()
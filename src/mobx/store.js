

//主页
import homeStore from './homeStore'
import userStore from './userStore'
import creditStore from './creditStore'
import preIouStore from './preIouStore'
import preDraftStore from './preDraftStore'
import preBorrowStore from './preBorrowStore'
import preLoanStore from './preLoanStore'
import preProductStore from './preProductStore'
import afterIouStore from './afterIouStore'
import bankStore from './bankStore'
import friendStore from './friendStore'


const stores={
    homeStore,
    userStore,
    creditStore,
    preIouStore,
    preDraftStore,
    preBorrowStore,
    preLoanStore,
    preProductStore,
    afterIouStore, 
    bankStore,
    friendStore,
    clearStore:function(){
        preIouStore.clearInfo();
        preDraftStore.clearInfo();
        preBorrowStore.clearInfo();
        preLoanStore.clearInfo();
        preProductStore.clearInfo();
    }   
};
export default stores
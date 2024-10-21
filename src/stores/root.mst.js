import { makeAutoObservable, observable, computed, toJS } from 'mobx'
import CommonStore from './common.store'
import MobileStore from './mobile.store'
import ComposeStore from './pages/compose.store'
import PresaleStore from './pages/presale.store'
import EmailStore from './pages/email.store'
import GuideStore from './pages/guide.store'
import ContactsStore from './pages/contacts.store'

export class RootStore {
  common = new CommonStore()
  mobile = new MobileStore()
  compose = new ComposeStore()
  presale = new PresaleStore()
  email = new EmailStore()
  guide = new GuideStore()
  contacts = new ContactsStore()

  constructor() {
    makeAutoObservable(this)
  }

  resetStores() {
    this.common = new CommonStore()
    this.compose = new ComposeStore()
    this.presale = new PresaleStore()
    this.email = new EmailStore()
    this.mobile = new MobileStore()
    this.contacts = new ContactsStore()
  // this.guide = new GuideStore()
  }
}

const rootStore = new RootStore()
export default rootStore

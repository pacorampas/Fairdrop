import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'

import AddMailbox from '../Shared/AddMailbox'
import UnlockMailbox from '../Shared/UnlockMailbox'

class BSelectMailbox extends Component{
  
  constructor(props) {
    super(props);

    this.FDS = this.props.FDS;
    this.state = this.getInitialState();

    this.addMailbox = this.addMailbox.bind(this);    
    this.handleSelectMailbox = this.handleSelectMailbox.bind(this);
    this.mailboxUnlocked = this.mailboxUnlocked.bind(this)
    this.cancelAddMailbox = this.cancelAddMailbox.bind(this)


  }

  getInitialState(){
    let mailboxes = this.FDS.GetAccounts();

    if(mailboxes.length === 0){
      return {
        isAddingMailbox: true,        
        isUnlockingMailbox: false,
        mailboxes: mailboxes,
        activeMailboxSubDomain: false,
        dropDownValue: false,
        mailboxesExist: false
      }
    }else if(mailboxes.length > 0){
      return {
        isAddingMailbox: false,        
        isUnlockingMailbox: true,
        mailboxes: mailboxes,
        unlockingMailbox: mailboxes[0].subdomain,
        activeMailboxSubDomain: false,
        dropDownValue: mailboxes[0].subdomain,
        mailboxesExist: true
      }
    }
  }

  addMailbox(){
    this.setState({
      isAddingMailbox: true,
      isUnlockingMailbox: false
    });
  }

  cancelAddMailbox(){
    this.setState({
      isAddingMailbox: false,
      isUnlockingMailbox: true
    });
  }

  setUnlockingMailbox(subdomain){
    this.setState({
      unlockingMailbox: subdomain,
      isUnlockingMailbox: true,
      isAddingMailbox: false,
      dropDownValue: subdomain
    });
  }

  mailboxUnlocked(){
    if(this.props.parentState.isStoringFile){
      //skip select recipient
      this.props.setParentState({
        uiState: 3
      });
    }else{
      //select recipient 
      this.props.setParentState({
        uiState: 2
      });
    }
  }

  handleSelectMailbox(option){
    if(option.value === 'new-mailbox'){
      this.addMailbox();
    }else{
      this.setUnlockingMailbox(option.value);
    }
  }

  getDropDownOptions(mailboxes){
    return this.state.mailboxes.map((m)=>{
      return {label: m.subdomain, value:  m.subdomain};
    }).concat({label: 'new mailbox +', value: "new-mailbox" });
  }

  render(){
    return (
      <div id="select-mailbox" className={"select-mailbox green page-wrapper " + (this.props.parentState.uiState === 1 ? "fade-in" : "hidden")}> 
        <div className="select-mailbox-ui page-inner-centered">
          <div className="select-mailbox">            
            {this.state.isUnlockingMailbox &&
              <div className="page-inner-wrapper">
                <h1 className="select-account-header">Encrypt and Send</h1>
                <div className="form-group clearfix">
                  <div className="select-mailbox-mailboxes">
                    <Dropdown options={this.getDropDownOptions()} value={this.state.dropDownValue} onChange={this.handleSelectMailbox} placeholder="Select a mailbox" />
                  </div>
                  <label className="select-mailbox-label">Select mailbox</label>
                </div>
                {this.state.isUnlockingMailbox &&
                  <UnlockMailbox 
                    FDS={this.FDS}
                    subdomain={this.state.unlockingMailbox}
                    mailboxUnlocked={this.mailboxUnlocked}
                    setSelectedMailbox={this.props.setSelectedMailbox}
                  />
                }   
              </div>
            }         
            {this.state.isAddingMailbox &&
              <div className="page-inner-wrapper">
                <h1 className="select-account-header">New Mailbox</h1>
                <AddMailbox 
                  FDS={this.FDS}
                  mailboxUnlocked={this.mailboxUnlocked}
                  cancelAddMailbox={this.cancelAddMailbox}
                  mailboxesExist={this.state.mailboxesExist}
                  setSelectedMailbox={this.props.setSelectedMailbox}                 
                />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default BSelectMailbox;
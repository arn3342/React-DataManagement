import React, { Component } from 'react';
import createNoAuthFetchRequest from '../src/utils/fetchUtils';
import { getUnionRates, createUnionRates, updateUnionRates } from '../src/data/queries';
import endpoint from '../src/config/endpoints';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { faPowerOff, faSearch, faArrowRight, faArrowCircleRight, faPlus, faArrowCircleUp, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from './assets/graycor-main.PNG'
import sortIcon from './assets/sortIcon.png'
import sortAsc from './assets/sortIcon_asc.png'
import sortDesc from './assets/sortIcon_desc.png'
import {
  BrowserRouter as Router
} from "react-router-dom";
import moment from 'moment';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
var filteredArray = []
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    paddingBottom: '10px'
  }
};
var rowColor = '';
var unionRatesArray = []
var filteredData = {}
var updateIdArray = []
var unionRatesFromState = []
var isSortClicked = false
var newRecordData = {
  UnionCode: 0,
  StartEffectiveDate: new Date(),
  EndingEffectiveDate: new Date()
}
Modal.setAppElement('#root')
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddForm: false,
      unionRatesArray: [],
      dataAdded: false,
      searchIsCollapsed: false,
      showFinalizeModal: false,
      modalIsOpen: false,
      confirmClicked: false,
      rowStartDate: '',
      rowEndDate: '',
      calenderTitle: '',
      startDateRowIndex: -1,
      startDateForRow: new Date(),
      startDateRowArray: [],
      currentRowIndex: '',
      infoPopUp: '',
      visibleRowCount: 20,
      filterCount: 0,
      mustReload: false
    }

  }

  render() {
    if(this.state.mustReload){ unionRatesFromState = Array.from(this.state.unionRatesArray); }
    var sortObj = this.state.sort;

    if (sortObj && isSortClicked) {
      if (sortObj.dataType === 'int') {
        if (sortObj.direction === 'ASC') {
          unionRatesFromState = unionRatesFromState.sort((a, b) => b[sortObj.column] - a[sortObj.column])
        } else {
          unionRatesFromState = unionRatesFromState.sort((a, b) => a[sortObj.column] - b[sortObj.column])
        }
      }
      else if (sortObj.dataType === 'string') {
        if (sortObj.direction === 'ASC') {
          unionRatesFromState = unionRatesFromState.sort((a, b) => this.stringCompare(b[sortObj.column], a[sortObj.column]))
        } else {
          unionRatesFromState = unionRatesFromState.sort((a, b) => this.stringCompare(a[sortObj.column], b[sortObj.column]))
        }
      }
      else if (sortObj.dataType === 'date') {
        if (sortObj.direction === 'ASC') {
          unionRatesFromState = unionRatesFromState.sort((a, b) => this.dateCompare(b[sortObj.column], a[sortObj.column]))
        } else {
          unionRatesFromState = unionRatesFromState.sort((a, b) => this.dateCompare(a[sortObj.column], b[sortObj.column]))
        }
      }
      console.log('Sorted again!', unionRatesFromState)
    }

    return (
      <Router>
        <div className="App" onClick={(e) => this.HideCalendar(e)}>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            style={customStyles}
            contentLabel="Example Modal">
            <div>
              {this.state.infoPopUp &&
                <div style={{ minWidth: '350px' }}>
                  <div className="row" style={{ padding: '10px', background: '#edf4ff', margin: '0' }}>
                    <div className="col-md-9">
                      <h3 style={{ fontWeight: '500', fontSize: '1.3rem', color: this.state.infoPopUp.color }}>{this.state.infoPopUp.title}</h3>
                    </div>
                    <div className="col-md-2 ml-auto" style={{ paddingRight: '0' }}>
                      <FontAwesomeIcon icon={faPlus} onClick={(e) => this.closeModal()} style={{ float: 'right', transform: 'rotate(45deg)', fontSize: '25px', cursor: 'pointer', color: '#ff2f1c' }} />
                    </div>
                  </div>
                  <div className="row" style={{ padding: '10px 25px', margin: '0' }}>
                    <div className="col-md=12">
                      <h3 style={{ fontWeight: '400', fontSize: '1.2rem', color: '#000' }}>{this.state.infoPopUp.data}</h3>
                    </div>
                  </div>
                  <div className="row" style={{ padding: '10px', margin: '0' }}>
                    <div className="col-md-12">
                      <button className="btn-Blue" onClick={() => this.closeModal()} style={{
                        width: '30%',
                        float: 'right',
                        borderRadius: '8px'
                      }}>Ok</button>
                    </div>
                  </div>
                </div>
              }
            </div>
            {!this.state.infoPopUp && <Calendar onChange={(e) => this.setCalenderDate(e)} style={{ margin: '0px 20px' }} />}
          </Modal>
          <div className="topnav" id="myTopnav">
            <div className="topnav-right" style={{ width: '90px', height: '38px' }}>
              <button className="button-logOut" style={{ width: '90px', height: '30px', borderRadius: '2px', margin: '5px' }}><FontAwesomeIcon icon={faPowerOff} transform='rotate--90' style={{ fontSize: '14px', marginRight: '8px' }} />Log Out</button>
            </div>
            <div style={{ float: 'left' }}>
              <a href="#home"><img src={logo} alt="site-logo" style={{ height: '41px' }} /></a>
              <a href="#home" className="active">DASHBOARD</a>
              <a href="#home" className="active"><i className="arrows right"></i></a>
              <a href="#news" className="inactive-tab">Rates Union Management System</a>
            </div>
          </div>

          {/* Add box starts here*/}
          <div className={this.state.showAddForm ? 'hidden-element-visible' : 'hidden-element'}>
            <div className="row pt-5">
              <div className="col-md-4" style={{ marginLeft: '30px' }}>
                <h1 style={{ textAlign: 'left' }}>Add/Edit New Union</h1>
              </div>
            </div>
            <div className="row pt-5 last-row" id="field-container">
              <div className="col-md-3 first-column">
                <label>Union Code</label>
                <br></br>
                <input autoComplete="off" name="UnionCode" onChange={(e) => this.newRecordOnChange(e)}></input>
              </div>
              <div className="col-md-4 last-column">
                <label>Effective Date</label>
                <div className="row">
                  <div className="col-md-5">
                    <button onClick={() => this.DisplayCalendar('newstart', 0, true)}>{moment(newRecordData.StartEffectiveDate).format('MM-DD-YYYY')}</button>
                  </div>
                  <div className="col-md-1">
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '25px', marginRight: '8px', float: 'left', marginTop: '8px' }} />
                  </div>
                  <div className="col-md-5">
                    <button onClick={() => this.DisplayCalendar('newend', 0 ,true)}>{moment(newRecordData.EndingEffectiveDate).format('MM-DD-YYYY')}</button>
                  </div>
                </div>
              </div>
              <div className="col-md-3 ml-auto" style={{ marginTop: '32px' }}>
                <label style={{ visibility: 'hidden' }}>.</label>
                <button className="col-md-7 btn-Blue-active" onClick={() => { this.CreateUnionRate() }}><FontAwesomeIcon icon={faPlus} style={{ fontSize: '15px', margin: '0px 8px 1px 0px' }} />Add</button>
                <button className="col-md-4 btn-Blue" onClick={() => this.setState({ showAddForm: false })} style={{ marginLeft: '15px' }}>Cancel</button>
              </div>
            </div>
          </div>
          {/* Add box ends here*/}

          {/* Search box starts here*/}
          {unionRatesFromState.length !== 0 &&
            <div>
              <div className="row pt-4">
                <div className="col-md-2" style={{ marginLeft: '40px' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ fontSize: '35px', marginRight: '8px', float: 'left', marginTop: '8px' }} /><h1 style={{ textAlign: 'left' }}>Search</h1>
                </div>
                <div id="add-edit-container" className="col-md-3 ml-auto">
                  <h5 onClick={() => this.ShowAddForm()} style={{ marginTop: '15px', fontWeight: '400', color: '#237bff', cursor: 'pointer' }}>Add/Edit Union Code<FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: '20px', marginLeft: '8px' }} /></h5>
                </div>
              </div>
              <div className="row pt-5" id="field-container" style={{ display: this.state.searchIsCollapsed ? 'none' : '' }}>
                <div className="col-md-3 first-column">
                  <label>Union Code</label>
                  <br></br>
                  <input autoComplete="off" name="UnionCode" onChange={(e) => this.filterOnChange(e)}></input>
                </div>
                <div className="col-md-2">
                  <label>Job Step</label>
                  <br></br>
                  <input autoComplete="off" name="JobStep" onChange={(e) => this.filterOnChange(e)}></input>
                </div>
                <div className="col-md-3">
                  <label>Shift Code</label>
                  <br></br>
                  <input autoComplete="off" name="ShiftCode" onChange={(e) => this.filterOnChange(e)}></input>
                </div>
                <div className="col-md-4 last-column">
                  <label>Effective Date</label>
                  <div className="row">
                    <div className="col-md-5">
                      <button onClick={() => this.DisplayCalendar('filter start', 0, true)}>{filteredData.startDate ? moment(filteredData.startDate).format('MM/DD/YYYY') : 'Set Date'}</button>
                    </div>
                    <div className="col-md-1">
                      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '25px', marginRight: '8px', float: 'left', marginTop: '8px' }} />
                    </div>
                    <div className="col-md-5">
                      <button onClick={() => this.DisplayCalendar('filter end', 0, true)}>{filteredData.endDate ? moment(filteredData.endDate).format('MM/DD/YYYY') : 'Set Date'}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row last-row" id="field-container">
                <div className="col-md-2 ml-auto">
                  <div className="row">
                    <button className="col-md-8 btn-Blue-active" onClick={() => this.filterData()}>Search</button>
                    <button className="col-md-3 btn-transparent"><FontAwesomeIcon onClick={() => this.state.searchIsCollapsed ? this.setState({ searchIsCollapsed: false, }) : this.setState({ searchIsCollapsed: true })} icon={this.state.searchIsCollapsed ? faArrowCircleDown : faArrowCircleUp} style={{ fontSize: '28px', marginTop: '3px' }} /></button>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* Search box ends here*/}

          {/* Table starts here */}
          <div className="row pt-3">
            <div className="col-md-4" style={{ marginLeft: '30px' }}>
              <h1 style={{ textAlign: 'left' }}>Results</h1>
            </div>
            <div className="col-md-4 ml-auto" style={{ paddingTop: '10px', marginRight: '30px', paddingRight: '0' }}>
              <button style={{ display: 'inline-block', width: '60%' }} className="btn-Blue" onClick={() => this.GetUnionRates()}>Reload data</button>
              <button style={{ marginLeft: '20px', display: 'inline-block', width: '30%' }} className="btn-Blue" onClick={() => { this.UpdateAllUnionRates(); }}>Update records</button>
            </div>
          </div>
          <div className="headerContainer pt-3">
            {this.state.filterCount > 0 && <h4 style={{ textAlign: 'left', marginLeft: '10px' }}>Results found: {this.state.filterCount}</h4>}
            <table id="tableContainer" className="table table-hover table-borderless round-top-left round-top-right" style={{ marginBottom: '0px', background: '#eaf1f9', userSelect: 'none' }}>
              <thead>
                <tr className="column-container" style={{ paddingTop: '8px' }}>
                  <th id="thBottom" className="round-top-left" onClick={(e) => this.Sort(e, 'UnionCode', 'int')}>Union Code<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'UnionCodeDesc', 'string')}>Union Code Description<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'StartEffectiveDate', 'date')} id="thBottom">Effective Start Date<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'EndingEffectiveDate', 'date')} id="thBottom">Effective End Date<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'JobType', 'string')} id="thBottom" className="no-left">Job Type<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'JobTypeDesc', 'string')} id="thBottom" className="no-left">Job Type Description<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'JobStep', 'string')} className="no-left" id="thBottom">Job Step<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'JobStepDesc', 'string')} className="no-left" id="thBottom">Job Step Description<img src={sortIcon} alt="sort-icon" /></th>
                  <th onClick={(e) => this.Sort(e, 'HourlyRate', 'string')} id="thBottom" className="round-top-right no-left">Hourly Rate<img src={sortIcon} alt="sort-icon" /></th>
                </tr>
              </thead>
              <tbody id="dummyTableToAdd" onScroll={(e) => this.handleScroll(e)}>
                {unionRatesFromState.length === 0 && <div className="spinner-border" role="status" />}
                {unionRatesFromState && ( unionRatesFromState.map((data, index) => {
                  if (index <= this.state.visibleRowCount) {
                    var newData = this.state.unionRatesArray.filter(x => x.id === data.id)[0];
                    return (
                    <tr key={data.id} className="table-warning">
                      {this.SetRowColor(index)}
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onBlur={(event) => this.HideFieldOnBlur(event)} onClick={(e) => this.DisplayEditField(e)} value={newData ? newData.UnionCode : ''} onChange={(e) => {this.EditFieldOnChange(e, newData.id, 'UnionCode');}}/></td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onBlur={(event) => this.HideFieldOnBlur(event)} onClick={(e) => this.DisplayEditField(e)} value={newData ? newData.UnionCodeDesc : ''} onChange={(e) => this.EditFieldOnChange(e, newData.id, 'UnionCodeDesc')} /></td>
                      <td style={{ background: rowColor, position: (this.state.currentRowIndex === index && this.state.calenderTitle === 'Effecive start date') ? 'relative' : '' }} onClick={() => this.DisplayCalendar("Effecive start date", index)}>
                        {newData ? moment(newData.StartEffectiveDate).format("MM/DD/YYYY") : moment(new Date()).format("MM/DD/YYYY")}
                        {(this.state.currentRowIndex === index && this.state.calenderTitle === 'Effecive start date') &&
                          <div id="row-calendar" style={{ position: 'absolute' }}>
                            <Calendar onChange={(e) => this.setCalenderDate(e, newData.id)} />
                          </div>
                        }
                      </td>
                      <td style={{ background: rowColor, position: (this.state.currentRowIndex === index && this.state.calenderTitle === 'Effecive end date') ? 'relative' : '' }} onClick={() => this.DisplayCalendar("Effecive end date", index)}>
                        {newData ? moment(newData.EndingEffectiveDate).format("MM/DD/YYYY") : moment(new Date()).format("MM/DD/YYYY")}
                        {(this.state.currentRowIndex === index && this.state.calenderTitle === 'Effecive end date') &&
                          <div id="row-calendar" style={{ position: 'absolute' }}>
                            <Calendar onChange={(e) => this.setCalenderDate(e, newData.id)} />
                          </div>
                        }
                      </td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onKeyUp={(event, e) => this.HideField(event, e)} onBlur={(event) => this.HideFieldOnBlur(event)} onClick={(e) => this.DisplayEditField(e)} value={data.JobType ? data.JobType : ''} onChange={(e) => this.EditFieldOnChange(e, data.id, 'JobType')} /></td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onClick={(e) => this.DisplayEditField(e)} onBlur={(event) => this.HideFieldOnBlur(event)} value={newData ? newData.JobTypeDesc : ''} onChange={(e) => this.EditFieldOnChange(e, data.id, 'JobTypeDesc')} /></td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onClick={(e) => this.DisplayEditField(e)} onBlur={(event) => this.HideFieldOnBlur(event)} value={newData ? newData.JobStep : ''} onChange={(e) => this.EditFieldOnChange(e, data.id, 'JobStep')} /></td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onClick={(e) => this.DisplayEditField(e)} onBlur={(event) => this.HideFieldOnBlur(event)} value={newData ? newData.JobStepDesc : ''} onChange={(e) => this.EditFieldOnChange(e, data.id, 'JobStepDesc')} /></td>
                      <td style={{ background: rowColor }}><input autoComplete="off" className="input-transparent" onKeyDown={(event) => this.HideField(event)} onClick={(e) => this.DisplayEditField(e)} onBlur={(event) => this.HideFieldOnBlur(event)} value={newData ? newData.HourlyRate : '0'} onChange={(e) => this.EditFieldOnChange(e, data.id, 'HourlyRate')} /></td>
                    </tr>)
                  }
                  return '';
                }
                ))}
              </tbody>
            </table>
          </div>

          {/* Table ends here */}
        </div>
      </Router>
    )
  }

  SetRowColor(rowIndex) {
    var even = rowIndex % 2 === 0;
    if (even) { rowColor = '#fff' }
    else { rowColor = '#eaf1f9' }
  }

  GetUnionRates = async () => {
    filteredData = {}
    unionRatesFromState = []
    this.setState({
      unionRatesArray: [],
      filterCount: 0
    })
    const variables = {
      input: {
      },
    };
    await createNoAuthFetchRequest(
      endpoint.grayQl,
      'POST',
      { query: getUnionRates, variables },
    ).then(res => 
      {unionRatesArray = res.data.unionRatesQuery
      this.setState({
        unionRatesArray: res.data.unionRatesQuery
      })}
    );

    this.setState({mustReload: true})
  }

  CreateUnionRate = async () => {
    if (newRecordData.UnionCode !== '') {
      this.setState({
        newRecordData: newRecordData
      }, () => this.CallToCreateUnionRate())
    }
    else {
      this.showModalWithInfo('Error', 'Union code must not be empty')
    }
  }

  CallToCreateUnionRate = async () => {
    var startDate = new Date(newRecordData.StartEffectiveDate)
    var endDate = new Date(newRecordData.EndingEffectiveDate);

    if (startDate > endDate) {
      this.showModalWithInfo('Error', 'The effective start-date should not be greater than the end-date')
    }
    else {
      this.showModalWithInfo('Success', 'New record has been added succesfully!')
      const variables = {
        input: {
          UnionCode: newRecordData.UnionCode,
          StartEffectiveDate: newRecordData.StartEffectiveDate,
          EndingEffectiveDate: newRecordData.EndingEffectiveDate
        }
      };
      await createNoAuthFetchRequest(
        endpoint.grayQl,
        'POST',
        { query: createUnionRates, variables })
      this.GetUnionRates();
      this.setState({
        unionRatesArray: []
      })
    }
  }
  UpdateUnionRate = async (id) => {
    console.log('Index here: ', id)
    var input = this.state.unionRatesArray.filter(x => x.id === id)[0];
    console.log('Updated record(s)', input)
    input.StartEffectiveDate = new Date(input.StartEffectiveDate);
    input.EndingEffectiveDate = new Date(input.EndingEffectiveDate);
    if (input.StartEffectiveDate > input.EndingEffectiveDate) {
      this.showModalWithInfo('Error', 'The effective start-date should not be greater than the end-date')
    }
    else {
      this.showModalWithInfo('Success', "The record has been updated successfully!")
      const variables = {
        input: input
      };
      await createNoAuthFetchRequest(
        endpoint.grayQl,
        'POST',
        { query: updateUnionRates, variables })
    }
  }
  UpdateAllUnionRates = () => {
    console.log('Update IDs', updateIdArray)
    for (var i = 0; i < updateIdArray.length; i++) {
      this.UpdateUnionRate(updateIdArray[i]);
    }
  }
  Sort(e, column, dataType) {
    var sortObj = this.state.sort;
    var sortImg = e.target.children;
    if (sortObj && sortObj.column === column) {
      sortObj.direction = sortObj.direction === 'ASC' ? 'DESC' : 'ASC';
    }
    else {
      sortObj = {
        column: column,
        direction: 'ASC',
        dataType: dataType,
      }
    }
    if (sortImg[0])
      sortObj.direction === 'ASC' ? sortImg[0].src = sortDesc : sortImg[0].src = sortAsc
    console.log('Sorted array from CLONE: ', sortObj + " Non-sorted array from STATE: ", this.state.unionRatesArray)
    isSortClicked = true
    this.setState({ sort: sortObj })
  }
  SortNumbers() {
    var initialData = this.state.ProjectObjects;
    var sortedData = initialData.sort((a, b) => b.procoreNumber - a.procoreNumber)
    this.setState({
      ProjectObjects: sortedData
    })
  }
  stringCompare(a, b) {
    var x = a ? a.toLowerCase() : '';
    var y = b ? b.toLowerCase() : '';
    if (x < y) { return -1; }
    if (x > y) { return 1; }
    return 0;
  }
  dateCompare(a, b) {
    a = new Date(a);
    b = new Date(b)
    if (this.isValidDate(a) && this.isValidDate(b)) {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
    }
    return 0;
  }

  isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  componentDidMount() {
    if (!this.state.dataAdded) {
      this.GetUnionRates();
      this.setState({
        dataAdded: true
      })
    }
    this.setState({mustReload: true})
  }
  handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
    if (bottom) {
      var visibleRowCount = this.state.visibleRowCount;
      visibleRowCount += 20;
      this.setState({
        visibleRowCount: visibleRowCount
      })
    }
  }
  filterData = () => {
    filteredArray = [];
    var properties = Object.keys(filteredData);
    if (properties.length > 0) {
      console.log('Went inside filter', filteredData)
      properties.forEach((key, index) => {
        console.log('Key comes here:', key)
        filteredArray = filteredArray.length === 0 ? unionRatesArray.filter(val => val[key] === filteredData[key]) : filteredArray.filter(val => val[key] === filteredData[key])
        
        if (properties[index] === 'startDate') {
          filteredArray = filteredArray.length === 0 ?
            unionRatesArray.filter(val => new Date(val.StartEffectiveDate) >= new Date(filteredData[key])) : filteredArray.filter(val => new Date(val.StartEffectiveDate) >= new Date(filteredData[key]))
        }
        else if (properties[index] === 'endDate') {
          filteredArray = filteredArray.length === 0 ?
            unionRatesArray.filter(val => new Date(val.EndingEffectiveDate) <= new Date(filteredData[key])) : filteredArray.filter(val => new Date(val.EndingEffectiveDate) <= new Date(filteredData[key]))
        }
      }
      );
      if (filteredArray.length <= 0) {
        this.showModalWithInfo("Error", "No records found. Please try a different search criteria.")
      }
      filteredArray.length > 0 && this.setState({
        unionRatesArray: filteredArray,
        filterCount: filteredArray.length
      })
      console.log('First filter: ', filteredArray )
    }
    else {
      this.showModalWithInfo('Error', 'Please enter at-least one search criteria');
    }
  }
  filterOnChange = (e) => {
    filteredData[e.target.name] = e.target.value;
  }
  showModalWithInfo = (title, info) => {
    var infoPopUp = { title: title, data: info }
    if (title === 'Error') {
      infoPopUp.color = '#ff3838'
    }
    else {
      infoPopUp.color = '#00c936'
    }
    this.setState({
      infoPopUp: infoPopUp
    });
    this.openModal();
    setTimeout(() => this.closeModal(), 5000);
    setTimeout(() => this.setState({ infoPopUp: null }), 5000)
    //}
  }
  newRecordOnChange = (e) => {
    newRecordData[e.target.name] = e.target.value.toString();
  }
  setCalenderDate = (e, id) => {
    console.log('Date changed', this.state.calenderTitle)
    if (this.state.calenderTitle === 'newstart') {
      newRecordData.StartEffectiveDate = e;
      this.setState({
        newRecordData: newRecordData
      })
    }
    else if (this.state.calenderTitle === 'newend') {
      newRecordData.EndingEffectiveDate = e;
      this.setState({
        newRecordData: newRecordData
      })
    }
    else if (this.state.calenderTitle === 'Effecive start date') {
      var mainIndex = this.state.unionRatesArray.findIndex(x => x.id === id);
      this.setState(prevState => {
        const newItems = [...prevState.unionRatesArray];
        newItems[mainIndex].StartEffectiveDate = e;
        console.log('New date comes here', this.state.unionRatesArray[this.state.currentRowIndex].StartEffectiveDate)
        return { items: newItems };
      })
      if (!updateIdArray.some(x => x === id)) {
        updateIdArray.push(id)
      }
      this.setState({
        currentRowIndex: null
      })
    }
    else if (this.state.calenderTitle === 'Effecive end date') {
      mainIndex = this.state.unionRatesArray.findIndex(x => x.id === id);
      this.setState(prevState => {
        const newItems = [...prevState.unionRatesArray];
        newItems[mainIndex].EndingEffectiveDate = e;
        return { items: newItems };
      })
      if (!updateIdArray.some(x => x === id)) {
        updateIdArray.push(id)
      }
      this.setState({
        currentRowIndex: null
      })
    }
    else if (this.state.calenderTitle === 'filter start') {
      filteredData.startDate = e
      console.log('Filtered date', filteredData)
    }
    else if (this.state.calenderTitle === 'filter end') {
      filteredData.endDate = e
    }

    this.closeModal()
  }
  EditFieldOnChange = (e, id, property) => {
    console.log('NewData ID: ', id)
    isSortClicked = false
    this.setState({mustReload: false})
    var newValue = e.target.value
    if (!updateIdArray.some(x => x === id)) {
      updateIdArray.push(id)
      console.log('ID Inserted: ', updateIdArray)
    }
    var mainIndex = this.state.unionRatesArray.findIndex(x => x.id === id);
    //console.log('Updated data(s)', updateIdArray)
    this.setState(prevState => {
      const newItems = [...prevState.unionRatesArray];
      newItems[mainIndex][property] = newValue;
      return { items: newItems };
    })
  }
  onClickUpdate = (index) => {
    this.UpdateUnionRate(index);
  }
  DisplayCalendar = (title, index, showModal) => {
    this.setState({mustReload: false})
    if (showModal === true)
      this.openModal();
    // this.setState({
    //   
    //   currentRowIndex: index
    // })
    // this.state.currentRowIndex !== index &&
    this.setState({
      calenderTitle: title,
      currentRowIndex: index
    })
  }
  HideCalendar() {
    var parent = document.getElementById("row-calendar")
    var children = null;
    if (parent) {
      children = Array.from(parent.getElementsByTagName("*"));
      if (!children.some((x) => document.activeElement === x)) {
        this.setState({ currentRowIndex: null });
      }
    }

  }
  openModal = () => {
    this.setState({ modalIsOpen: true });
  }
  afterOpenModal = () => {

  }

  closeModal = () => {
    console.log('close called')
    this.setState({ modalIsOpen: false, confirmClicked: false, infoPopUp: null });
  }
  GetStyle = (element, name) => {
    return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
  }
  HideField = (event) => {
    if (event.keyCode === 13) {
      event.target.className = 'input-transparent'
      event.target.blur();
    }
  }
  HideFieldOnBlur = (event) => {
    event.target.className = 'input-transparent'
    event.target.blur();
  }
  DisplayEditField = (e) => {
    e.target.className = 'input-border'
  }
  ShowAddForm = () => {
    this.setState({
      showAddForm: true
    })
  }
  AddunionRatesArray = () => {
    var unionRatesArray = []
    for (var i = 0; i < 10; i++) {
      unionRatesArray.push({
        uninCode: 2622,
        uninCodeDesc: 'Ironworkers #22 - Indy, IN',
        startDate: '6/1/2019',
        endData: '12/31/2019',
        jobType: '08',
        jobTypeDesc: 'Ironworkers',
        jobStep: 'A60',
        jobStepDesc: 'Apprentice 65%',
        hourRate: '21.18'
      })
    }
    this.setState({
      unionRatesArray: unionRatesArray
    })
  }
}
export default App;

import React, { Component } from "react";
import SettingsMenu from "./tab-menus/SettingsMenu";
import CoursesMenu from "./tab-menus/CoursesMenu";
import AboutMenu from "./tab-menus/AboutMenu";

const CPSC313 = { id: 0, name: "CPSC 313", mustBeSemester: false, mustBeSection: "101" }
const CPSC313lab = { id: 1, name: "CPs C 313", mustBeSemester: "1,  2", mustBeSection: "L1B" }
const CPSC312 = { id: 2, name: "CPSC312", mustBeSemester: "1", mustBeSection: false }
const MATH221 = { id: 3, name: "MATH 221", mustBeSemester: "2", mustBeSection: false }

export default class InputMenu extends Component {
  constructor(props) {
    super(props);

    this.reindex = this.reindex.bind(this);
    this.changeCoursesFunction = this.changeCoursesFunction.bind(this);
    this.handleClickBigGoButton = this.handleClickBigGoButton.bind(this);
    this.setSettings = this.setSettings.bind(this);

    this.state = {
      inputCourses: [CPSC313, CPSC313lab, CPSC312, MATH221],
      customBlocks: [],
      settings: {
        school: undefined,
        session: undefined,
        maxParallelCourses: "5",
        maxConsecutiveHours: false,
        preferredTime: "afternoon",
        reduceGaps: true,
        reduceDays: true,
        increaseConsistency: true,
      }
    }
  }

  componentDidMount() {
    this.handleClickBigGoButton(); // for debugging of scheduling engine only
  }

  reindex(list) {
    let result = list;
    for (let i = 0; i < list.length; i++) {
      result[i].id = i;
    }
    return result;
  }

  changeCoursesFunction(userCourses) {
    this.setState({
      inputCourses: this.reindex(userCourses) 
    });
  }

  changeCustomsFunction(userCustoms) {
    this.setState({
      customBlocks: this.reindex(userCustoms),
    });
  }

  setSettings(settings) {
    this.setState({
      settings: settings
    })
  }

  checkSubmittable() {
    return true;
  }

  handleClickBigGoButton() {
    this.props.goFunction(this.state.inputCourses, this.state.customBlocks, this.state.settings);
  }

  render() {
    return (
      <div className="container-fluid p-0 m-0 h-100">

        <div className="container-fluid" id="wm-logo-row">
          <p>[LOGO] worklist \n machine lol</p>
        </div>

        <div className="container-fluids" id="wm-menu-row">
          <div className="container-fluid tab-content" id="wm-tab-menu-content">
            <div className="tab-pane fade " id="settings-menu" role="tabpanel" aria-labelledby="settings-menu">
              <SettingsMenu
                submitSettings={this.setSettings}
                settings={this.state.settings}
              />
            </div>
            <div className="tab-pane fade show active" id="courses-menu" role="tabpanel" aria-labelledby="courses-menu">
              <CoursesMenu
                coursesToRender={this.state.inputCourses}
                customsToRender={this.state.customBlocks}
                changeCoursesFunction={this.changeCoursesFunction}
                changeCustomsFunction={this.changeCustomsFunction}
              />
            </div>
            <div className="tab-pane fade" id="about-menu" role="tabpanel" aria-labelledby="about-menu">
              <AboutMenu />
            </div>
          </div>

          <ul className="nav nav-fill p-0" id="wm-tab-list" role="tablist">
            {/* Settings tab */}
            <li className="nav-item" role="presentation">
              <a className="nav-link shadow" id="settings-tab" data-toggle="tab" href="#settings-menu" role="tab" aria-controls="settings" aria-selected="true">
                {/*Gear icon*/}
                <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" className="bi bi-gear" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z" />
                  <path fillRule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z" />
                </svg>
              </a>
            </li>
            {/* Courses tab */}
            <li className="nav-item" role="presentation">
              <a className="nav-link active shadow" id="courses-tab" data-toggle="tab" href="#courses-menu" role="tab" aria-controls="courses" aria-selected="false">
                {/*Plus icon*/}
                <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" className="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
                  <path fillRule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z" />
                </svg>
              </a>
            </li>
            {/* About tab */}
            <li className="nav-item" role="presentation">
              <a className="nav-link shadow" id="about-tab" data-toggle="tab" href="#about-menu" role="tab" aria-controls="about" aria-selected="false">
                {/*Question mark in circle icon*/}
                <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" className="bi bi-question-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M5.25 6.033h1.32c0-.781.458-1.384 1.36-1.384.685 0 1.313.343 1.313 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.007.463h1.307v-.355c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.326 0-2.786.647-2.754 2.533zm1.562 5.516c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div className="container-fluid m-0" id="wm-submit-row">
          <button
            className="btn btn-block custom-corners shadow"
            type="button"
            id="wm-go-button"
            disabled={!this.checkSubmittable()}
            onClick={this.handleClickBigGoButton}><h5>GO!</h5></button>
        </div>
      </div>
    )
  }
}
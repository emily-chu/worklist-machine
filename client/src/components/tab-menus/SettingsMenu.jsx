import React, { Component } from "react";

export default class SettingsMenu extends Component {
  /**
   * @param {Function(Settings)} props.submitSettings
   * @param {Settings} props.settings
   */
  constructor(props) {
    super(props);

    this.handleChangeSchool = this.handleChangeSchool.bind(this);
    this.passChanges = this.passChanges.bind(this);

    // state holds available options
    // props.settings hold anything that matters to schedule generation
    this.state = { schools: [], sessions: [] };
  }
  
    componentDidMount() {
      fetch('http://localhost:5000/schools').then(resp => resp.json()).then(data => {
        // this.passChanges({ schools: data.schools, school: undefined });
        this.setState({ schools: data.schools })
      });
    }
  /**
   * @param {object} changes = a subset of props.settings
   */
  passChanges(changes) {
    console.log(changes)
    this.props.submitSettings({ ...this.props.settings, ...changes });
  }

  /**
   * @param {string} school 
   */
  handleChangeSchool(school) {
    if (!school || school === '[select]') return;
    this.passChanges({ school: school });
    fetch('http://localhost:5000/' + school + '/sessions').then(resp => resp.json()).then(data => {
      this.setState({ sessions: data.sessions });
    });
  }

  render() {
    return (

      <form>
        <h5>Settings</h5>
        <hr></hr>

        <div className="form-group">
          <label>School:</label>
          <select
            className="form-control form-control-sm"
            name="school"
            // value={this.props.settings.school && this.props.settings.school.name}
            onChange={e => { this.handleChangeSchool(e.target.value) }}
          >
            <option key={undefined} value={undefined} selected>[select]</option>
            {this.state.schools.map(school =>
              <option key={school.name} value={school.name}> {school.name} </option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Session:</label>
          <select
            className="form-control form-control-sm"
            disabled={!this.props.settings.school}
            name="session"
            // value={this.props.settings.session}
            onChange={e => { if (e.target.value) this.passChanges({ session: e.target.value }) }}
          >
            <option key={undefined} value={undefined} selected>[select]</option>
            {this.state.sessions.map(session =>
              <option key={session.name} value={session.name}> {session.name} </option>
            )}
          </select>
        </div>

        <hr></hr>
        <div className="form-group">
          <label>Maximum courses per term:</label>
          <select
            className="form-control form-control-sm"
            name="maxParallelCourses"
            value={this.props.settings.maxParallelCourses}
            onChange={e => this.passChanges({ maxParallelCourses: e.target.value })}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div className="form-group">
          <label>Maximum consecutive hours:</label>
          <select
            className="form-control form-control-sm"
            name="maxConsecutiveHours"
            value={this.props.settings.maxConsecutiveHours}
            onChange={e => this.passChanges({ maxConsecutiveHours: e.target.value })}
          >
            <option value={false}>No maximum</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div className="form-group">
          <label>Prefer time: </label>
          <select
            className="form-control form-control-sm"
            name="preferredTime"
            value={this.props.settings.preferredTime}
            onChange={e => this.passChanges({ preferredTime: e.target.value })}
          >
            <option value="morning">Morning (8:00 - 11:59)</option>
            <option value="afternoon">Afternoon (12:00 - 16:59)</option>
            <option value="evening">Evening (17:00 - 20:00)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              name="reduceGaps"
              type="checkbox"
              checked={this.props.settings.reduceGaps}
              onChange={e => this.passChanges({ reduceGaps: e.target.checked })}
            />
            {" "}Reduce breaks/day length?</label>
        </div>
        <div className="form-group">
          <label>
            <input
              name="reduceDays"
              type="checkbox"
              checked={this.props.settings.reduceDays}
              onChange={e => this.passChanges({ reduceDays: e.target.checked })}
            />
            {" "}Prefer having empty days?</label>
        </div>
        <div className="form-group">
          <label>
            <input
              name="increaseConsistency"
              type="checkbox"
              onChange={e => this.passChanges({ increaseConsistency: e.target.checked })}
              checked={this.props.settings.increaseConsistency}
            />
            {" "}Prefer consistency between days?</label>
        </div>
      </form>
    );
  }
}
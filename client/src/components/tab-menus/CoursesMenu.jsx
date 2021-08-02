import React, {Component} from "react";

/*
props = {
  coursesToRender={this.state.inputCourses} 
  customsToRender={this.state.customBlocks} 
  changeCoursesFunction={this.changeCoursesFunction} 
  changeCustomsFunction={this.changeCustomsFunction}
}
*/
export default class CoursesMenu extends Component {
  constructor(props) {
    super(props);

    this.onAddCourse = this.onAddCourse.bind(this);
    this.onModifyCourse = this.onModifyCourse.bind(this);
    this.onDeleteCourse = this.onDeleteCourse.bind(this);

    this.onAddCustomBlock = this.onAddCustomBlock.bind(this);

    this.state = {
      maxCourses: 16
    };
  }

  onAddCourse() {
    if (this.props.coursesToRender.length >= this.state.maxCourses) {
      console.log("slow down engineer, worklist machine can only deal with 16 courses for now");
    } else {
      let blankCourse = {
        id: "tbd",
        name: "", 
        mustBeSemester: false,
        mustBeSection: false
      }
      let updatedList = this.props.coursesToRender;
      updatedList.unshift(blankCourse);
      this.props.changeCoursesFunction(updatedList);
    }
  }

  onAddCustomBlock() {
    console.log("i am tired"); //TODO: Make this work
  }

  onModifyCourse(updatedCourse, id) {
    let updatedList = this.props.coursesToRender;
    updatedList[id] = updatedCourse;
    this.props.changeCoursesFunction(updatedList);
  }

  onDeleteCourse(id) {
    let updatedList = this.props.coursesToRender;
    console.log(updatedList.splice(id, 1));
    this.props.changeCoursesFunction(updatedList);
  }
  
  render() {
    return(
      <React.Fragment>
        <h5>Courses</h5>
        <button className="btn btn-outline-light btn-block my-2 " onClick={this.onAddCourse}>+ Add course</button>
        <button className="btn btn-sm btn-outline-light btn-block my-2 " onClick={this.onAddCustomBlock}>+ Add custom block</button>
        <hr></hr>
        {this.props.coursesToRender.map((ic) => 
          <div key={ic.id} className="p-0 m-0 container-fluid">
          <InputCourse 
            course={ic}
            changeFunction={this.onModifyCourse}
            deleteFunction={this.onDeleteCourse}
          />
          <hr></hr>
          </div>
        )}
      </React.Fragment>
    )
  }
}

class InputCourse extends Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    let newCourse = this.props.course;
    newCourse[event.target.name] = event.target.value;
    this.props.changeFunction(newCourse, this.props.course.id);
  }

  render() {
    return(
      <form className="">
        <label className="pb-1 m-0 input-group input-group-sm">
          <div className="input-group-prepend">
            <div className="input-group-text p-1">
              <button 
              className="btn btn-sm p-0 m-0 border-0"
              type="button" 
              data-toggle="collapse" 
              data-target={"#detailsofcourse" + this.props.course.id.toString()} 
              aria-expanded="false" aria-controls="multiCollapseExample2">
                +
              </button>
            </div>
          </div>
          <input
            className="form-control"
            name="name"
            type="text"
            placeholder="Course code"
            value={this.props.course.name}
            onChange={this.handleChange}
          >
          </input>
        </label>
      
        <div className="collapse row p-0 m-0 w-100" id={"detailsofcourse" + this.props.course.id.toString()}>
        
          <div className="col-2 p-0 m-0"></div>
          <div className="col-10 p-0 m-0">
            <input 
              className="form-control form-control-sm p-2 mb-1"
              name="mustBeSemester"
              type="text"
              placeholder="Any semester"
              value={this.props.course.mustBeSemester? this.props.course.mustBeSemester : ""}
              onChange={this.handleChange}
              >
            </input>
          
            <input 
              className="form-control form-control-sm p-2 mb-1"
              name="mustBeSection"
              type="text"
              placeholder="Any section"
              value={this.props.course.mustBeSection? this.props.course.mustBeSection : ""}
              onChange={this.handleChange}
              >
            </input>
            <button 
              className="btn btn-sm btn-outline-light p-0 m-0 w-100"
              type="button"
              data-toggle="collapse" 
              data-target={"#detailsofcourse" + this.props.course.id.toString()} 
              onClick={() => this.props.deleteFunction(this.props.course.id)}
            > - Remove course
            </button>
          </div>
        </div>
      </form>
    )
  }
}

// class InputCustom extends Component {
//   constructor(props) {
//     super(props);
//   }

//   handleChange() {
//   }
  
//   render() {
//     return(
//       <p>This is a InputCustom component!</p>
//     )
//   }
// }

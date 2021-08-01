import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import React, {useState} from 'react';

import engineFunction, {combineSchedules} from "./scheduling-engine.js"

import InputMenu from "./components/InputMenu"
import WorklistNavigatorBar from "./components/WorklistNavigatorBar";
import WorklistRendering from "./components/WorklistRendering";

export default function App() {
  // Using hooks to give App() a global state
  // https://reactjs.org/docs/hooks-state.html
  //    [state, functionToSetState] = useState(initial state)
  const [globalSettings, setGlobalSettings] = useState(loadSettings());
  const [globalLatestRequest, setGlobalLatestRequest] = useState({});
  const [globalResults, setGlobalResults] = useState([]);
  const [navigationResult, setNavigationResult] = useState(0);
  const [navigationVariation, setNavigationVariation] = useState(0);

  
  function loadSettings() {
    let tempSettings = {
      //TODO: from database
      schools: ["UBC"],
      campuses: ["", "Vancouver", "Okanagan"],
      sessions: ["", "2020W", "1999Z"],
      school: "",
      campus: "",
      session: "",

      //TODO: These ones don't actually have to be part of the global state
      maxParallelCourses: "5",
      maxConsecutiveHours: false,
      preferredTime: "afternoon",
      reduceGaps: false,
      reduceDays: false,
      increaseConsistency: false,
    };
    tempSettings.school= tempSettings.schools[0];
    tempSettings.campus= tempSettings.campuses[0];
    tempSettings.session= tempSettings.sessions[0];
    return tempSettings;
  }

  // Input:  
  // inputCourses: [inputCourse]
  // requestedCustoms: [requestedCustom]
  //
  // Formats inputCourses, then sends userRequest to the scheduler
  function globalSubmit(inputCourses, requestedCustoms) {
    let parsed = parseCourses(inputCourses);
    // TODO: Find duplicates here
    let userRequest = {
      settings: globalSettings,
      courses: parsed,
      customs: requestedCustoms
    };
    console.log("App.js is sending this request to the SE:", userRequest);
    let engineOutput = engineFunction(userRequest)
    if (engineOutput.databaseError) {
      console.log("Engine produced database errors:", engineOutput.databaseErrors)
    } else if (engineOutput.schedulingError) {
      console.log("Engine produced a scheduling error:", engineOutput.schedulingError)
    } else {
      setGlobalResults(engineOutput);
      setNavigationResult(1);
      setNavigationVariation(1);
      setGlobalLatestRequest(userRequest);
      console.log("Engine successfuly produced results:", engineOutput);
    }
  }

  // Input:  
  // [inputCourse]
  //
  // Output: 
  // [parsedCourse]
  //
  // Removes blank-named courses
  // formats course name, semester, and section for scheduler
  function parseCourses(inputCourses) {
    let result = []
    inputCourses.forEach(function(ic) {
      if (ic.name !== "" && ic.name !== null) {
        let parsed = {};
        parsed.name = ic.name
          .replace(/[^A-Za-z0-9]/g, '')
          .toUpperCase();
        parsed.mustBeSemester = (ic.mustBeSemester && ic.mustBeSemester
          .replace(/\s/g,'')
          .toUpperCase()
          .split(",")
          .filter(sem => sem));
        parsed.mustBeSection = (ic.mustBeSection && ic.mustBeSection
          .replace(/\s/g,'')
          .toUpperCase()
          .split(",")
          .filter(sec => sec));
        parsed.id = ic.id;
        result.push(parsed);
      }
    })
    return result;
  }
  
  // Output: Result
  function getCurrentResult(){
    let resultIndex = navigationResult - 1;
    if (globalResults.length > 0) {
      if (0 <= resultIndex && resultIndex < globalResults.length) {
        return (globalResults[resultIndex]);
      }
    }
    return ({variations:[]}); //an empty result
  }
  
  // Output: Variation
  function getCurrentVariation(){
    let result = getCurrentResult(); // one "result" with many variations inside
    let variationIndex = navigationVariation - 1;
    if (result !== undefined){
      if (0 <= variationIndex && variationIndex < result.variations.length) {
        // return combineSchedules(result.base, result.variations[variationIndex].modifier);
        return result.variations[variationIndex];
      } 
    }
    return ({semesters:[]}); //an empty variation
  }

  // Renderer will only ever access days (sun-sat) of a DBS
  // Package necessary info alongside DBS's
  function getRenderable() {
    let base = [];
    let variation = [];

    // let test = combineSchedules()

    return {
      info: {},
      dateSpans: [
        {semesterId: "1", 
        startDate: false, 
        endDate: false, 
        dayBlocks: {
          wednesday:[{courseId:"hello",startTime:900,endTime:1200},{courseId:"test",startTime:1300,endTime:1700}]}
        }, 
        {semesterId: "2", 
        startDate: false, 
        endDate: false, 
        dayBlocks: {
          wednesday:[{courseId:"middle",startTime:1200,endTime:1300}],
          thursday:[{courseId:"hello",startTime:900,endTime:1200},{courseId:"test",startTime:1300,endTime:1700}]
          }
        }, 
        {semesterId: "3", 
        startDate: false, 
        endDate: false, 
        dayBlocks: {}}
      ],
      unscheduled: []
    }
  }
  
  return (
    <div className="row" id="contains-everything">
      <div className="container-fluid col-md m-0" id="wm-input-column">
        <InputMenu 
          settings={globalSettings}
          previousRequest={globalLatestRequest}
          changeSettingsFunction={setGlobalSettings} 
          goFunction={globalSubmit}
        />
      </div>
      <div className="container-fluid col-md m-0 h-100" id="wm-output-column">
        <div className="shadow custom-corners h-100" id="wm-output-panel">
          <WorklistNavigatorBar 
            results={globalResults.length}
            variations={getCurrentResult().variations.length}
            currentResult={navigationResult}
            currentVariation={navigationVariation}
            navigateResultFn={setNavigationResult}
            navigateVariationFn={setNavigationVariation}
            worklistInfo={getCurrentVariation().info}
          />
          <WorklistRendering 
            currentResult={navigationResult}
            currentVariation={navigationVariation}
            worklist={getRenderable()}
          />
        </div>
      </div>
    </div>
  );
}
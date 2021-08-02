import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import React, { useState } from 'react';
import engineFunction from "./scheduling-engine.js";

import InputMenu from "./components/InputMenu";
import WorklistNavigatorBar from "./components/WorklistNavigatorBar";
import WorklistRendering from "./components/WorklistRendering";

export default function App() {
  // https://reactjs.org/docs/hooks-state.html
  //    [state, functionToSetState] = useState(initial state)
  const [cachedRequest, setCachedRequest] = useState({});
  const [results, setResults] = useState([]);
  const [schedulePage, setSchedulePage] = useState(0);
  const [variationPage, setVariationPage] = useState(0);

  /**
   * @param {InputCourse} inputCourses 
   * @param {InputCustom} requestedCustoms 
   * @param {Settings} settings 
   */
  // Formats inputCourses, then sends userRequest to the scheduler
  function globalSubmit(inputCourses, requestedCustoms, settings) {
    let userRequest = {
      settings: settings,
      customs: requestedCustoms
    };
    fetchCourses(inputCourses).then(parsed => {
      userRequest.courses = parsed;
      console.log("App.js is sending this request to the SE:", userRequest);
      return engineFunction(userRequest);
    }).then(engineOutput => {
      if (engineOutput.databaseError) {
        console.log("Engine produced database errors:", engineOutput.databaseErrors);
      } else if (engineOutput.schedulingError) {
        console.log("Engine produced a scheduling error:", engineOutput.schedulingError);
      } else {
        setResults(engineOutput);
        setSchedulePage(1);
        setVariationPage(1);
        setCachedRequest(userRequest);
        console.log("Engine successfuly produced results:", engineOutput);
      }
    });
  }

  // Removes blank-named courses
  // formats course name, semester, and section for scheduler
  function fetchCourses(inputCourses) {
    return new Promise((resolve, reject) => {

      let result = []
      inputCourses.forEach(function (ic) {
        if (ic.name !== "" && ic.name !== null) {
          let parsed = {};
          parsed.name = ic.name
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase();
          parsed.mustBeSemester = (ic.mustBeSemester && ic.mustBeSemester
            .replace(/\s/g, '')
            .toUpperCase()
            .split(",")
            .filter(sem => sem));
          parsed.mustBeSection = (ic.mustBeSection && ic.mustBeSection
            .replace(/\s/g, '')
            .toUpperCase()
            .split(",")
            .filter(sec => sec));
          parsed.id = ic.id;
          result.push(parsed);
        }
      })
      resolve(result);
    });
  }

  // Output: Result
  function getCurrentResult() {
    let resultIndex = schedulePage - 1;
    if (results.length > 0) {
      if (0 <= resultIndex && resultIndex < results.length) {
        return (results[resultIndex]);
      }
    }
    return ({ variations: [] }); //an empty result
  }

  // Output: Variation
  function getCurrentVariation() {
    let result = getCurrentResult(); // one "result" with many variations inside
    let variationIndex = variationPage - 1;
    if (result !== undefined) {
      if (0 <= variationIndex && variationIndex < result.variations.length) {
        // return combineSchedules(result.base, result.variations[variationIndex].modifier);
        return result.variations[variationIndex];
      }
    }
    return ({ semesters: [] }); //an empty variation
  }

  // Renderer will only ever access days (sun-sat) of a DBS
  // Package necessary info alongside DBS's
  function getRenderable() {
    // let base = [];
    // let variation = [];

    // let test = combineSchedules()

    return {
      info: {},
      dateSpans: [
        {
          semesterId: "1",
          startDate: false,
          endDate: false,
          dayBlocks: {
            wednesday: [{ courseId: "hello", startTime: 900, endTime: 1200 }, { courseId: "test", startTime: 1300, endTime: 1700 }]
          }
        },
        {
          semesterId: "2",
          startDate: false,
          endDate: false,
          dayBlocks: {
            wednesday: [{ courseId: "middle", startTime: 1200, endTime: 1300 }],
            thursday: [{ courseId: "hello", startTime: 900, endTime: 1200 }, { courseId: "test", startTime: 1300, endTime: 1700 }]
          }
        },
        {
          semesterId: "3",
          startDate: false,
          endDate: false,
          dayBlocks: {}
        }
      ],
      unscheduled: []
    }
  }

  return (
    <div className="row" id="contains-everything">
      <div className="container-fluid col-md m-0" id="wm-input-column">
        <InputMenu
          previousRequest={cachedRequest}
          goFunction={globalSubmit}
        />
      </div>
      <div className="container-fluid col-md m-0 h-100" id="wm-output-column">
        <div className="shadow custom-corners h-100" id="wm-output-panel">
          <WorklistNavigatorBar
            results={results.length}
            variations={getCurrentResult().variations.length}
            currentResult={schedulePage}
            currentVariation={variationPage}
            navigateResultFn={setSchedulePage}
            navigateVariationFn={setVariationPage}
            worklistInfo={getCurrentVariation().info}
          />
          <WorklistRendering
            currentResult={schedulePage}
            currentVariation={variationPage}
            worklist={getRenderable()}
          />
        </div>
      </div>
    </div>
  );
}
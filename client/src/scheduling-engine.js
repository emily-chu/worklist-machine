import { exportjust001, exportcpsc213, exportcpsc213a } from "./example-courses.js";

const emptyBlockSet = {
  standardBlock: false,

  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,

  semester: undefined,
  subsetStartDate: false,
  subsetEndDate: false,
};

// INPUT: 
// UserRequest
// 		All courses are formatted, with non-empty names, with no duplicate names
//
// OUTPUT: 
// [Result],
// or { databaseErrors: [] },
// or { schedulingError: "" }

/** Generates schedules according to UserRequest, or fails
 * 
 * @param {UserRequest} userRequest user input object
 * @param {InputCustoms[]} userRequest.customs user's custom blocks
 * @param {InputCourse[]} userRequest.courses user's requested courses
 * 
 * @returns {Result[] | Object} results, or error
 */

export default function generateResults(userRequest) {

  // STEP 1: CustomBlock[] => DayBlockSet[]
  // TODO: Returns basic empty two blocksets
  let step1BlockSets = customsToBlockSets(userRequest.customs);
  if (step1BlockSets === false) {
    return { schedulingError: "There was a problem with your custom blocks (step 1)." }
  }

  // STEP 2: Verify input courses, semesters, sections exist in database
  let step2CourseRequest = verifyCourses(userRequest.courses);
  console.info("step2Courserequest here:", step2CourseRequest);
  if (Array.isArray(step2CourseRequest)) {
    console.info("SE is returning database errors (step 2).");
    return { databaseErrors: step2CourseRequest };
  }

  // STEP 3: Create results using specific sections, if any
  // TODO: current
  let initializer = [
    {
      base: step1BlockSets,
      variations: [],
      //courseRequest: step2CourseRequest, // do we need this?
      satisfiedNeeds: [],
      solvableNeeds: []
    }
  ];
  let step3Bases = generateBaseResults(initializer, step2CourseRequest.specSection);
  console.info("step3Bases here:", step3Bases);

  // STEP 4: Multiplies each base by its possible arrangements
  // TODO
  let step4Solvables = step3Bases.flatMap((b) => generateArrangements(b, step2CourseRequest.specSemester, step2CourseRequest.unspec));
  // let step4Solvables = step3Bases.reduce((result, base) => {
  // 	let arrangedBase = generateArrangements(base, step2CourseRequest.specSemester, step2CourseRequest.unspec);
  // 	return arrangedBase ? result.concat(arrangedBase) : result, []
  // });
  console.info("step4Solvables here:", step4Solvables);

  // STEP 5: Make many results from each base
  // TODO: returns result
  step4Solvables = step4Solvables.map((s) => partialSolve(s));

  // STEP 6: Fill out the variations of each result
  // TODO: returns result
  step4Solvables = fillVariations(step4Solvables);

  // Output
  let __________test__________ =
    combineBlockSets(exportcpsc213.singleSemesters[0].sections[2].dayBlocks, emptyBlockSet);

  console.log("*********************************************************************");
  console.log("*********************************************************************");
  console.info("here arer you TEST results madam:");
  console.info(__________test__________);
  console.log("*********************************************************************");
  console.log("*********************************************************************");


  // return step4Solvables;
  return [{
    info: {},
    base: [
      { id: "1", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
      { id: "2", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
      { id: "A", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
      { id: "B", startDate: false, endDate: false, dayBlocks: emptyBlockSet }
    ],
    variations: [
      [
        { id: "1", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "2", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "A", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "B", startDate: false, endDate: false, dayBlocks: emptyBlockSet }
      ],
      [
        { id: "1", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "2", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "A", startDate: false, endDate: false, dayBlocks: emptyBlockSet },
        { id: "B", startDate: false, endDate: false, dayBlocks: emptyBlockSet }
      ]
    ],
    abnormalSections: []
  }];
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// HIGH-LEVEL FUNCTIONS ////////////////////////////////////////////////////////// HIGH-LEVEL FUNCTIONS /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO: returns basic sched
// CustomBlock[] => DayBlockSet[] or false
function customsToBlockSets(customBlocks) {
  console.log("Function customsToBlockSet(customBlocks)  was called!");
  //blockSet.reduce(combineBlockSets)
  let result1 = emptyBlockSet;
  let result2 = emptyBlockSet;
  result1.semester = "1";
  result2.semester = "2";
  return [result1, result2];
}

// ParsedCourse[] => CourseRequest, or DatabaseError[]
function verifyCourses(parsedCourses) {
  console.log("Function verifyCourses(parsedCourses) was called!");
  let badCourses = [];
  let sorted = {
    specSection: [],
    specSemester: [],
    unspec: []
  };
  parsedCourses.forEach((pc) => {
    let course = retrieveCourse(pc.name);
    if (!course) {
      badCourses.push({ index: pc.id, message: (`Could not find course ${pc.name}`) })
    } else {
      if (pc.mustBeSection) {
        let badSections = [];
        // if (pc.mustBeSemester){ //TODO: search with semesters
        // 	pc.mustBeSection.forEach((sec) => { 
        // 		if (!courseSectionExists(sec, false, pc.name)) { badSections.push(sec); }
        // 	})
        // } else {
        pc.mustBeSection.forEach((sec) => {
          if (!courseSectionExists(sec, false, pc.name)) { badSections.push(sec); }
        })
        // }
        if (badSections.length === 0) { sorted.specSection.push(pc) } else { badCourses.push(`Found ${pc.name}, but could not find all of the specified sections: ${badSections}`) }
      } else if (pc.mustBeSemester) {
        let badSemesters = [];
        pc.mustBeSemester.forEach((sem) => {
          if (!courseSemesterExists(sem, pc.name)) { badSemesters.push(sem); }
        })
        if (badSemesters.length === 0) { sorted.specSemester.push(pc) } else { badCourses.push(`Found ${pc.name}, but could not find ${pc.name} in ${badSemesters}`) }
      } else {
        sorted.unspec.push(pc)
      }
    }
  });
  return badCourses.length > 0 ? badCourses : sorted;
}

// Result[], parsedCourse[] => Result[] or false
function generateBaseResults(currentResults, toAdd) {
  console.log("Function generateBaseResults(customBlockSet, sectionCourses) was called!");
  if (toAdd.length === 0) {
    return currentResults;
  } else {
    return generateBaseResults(sectionsOnResults(currentResults, toAdd[0]), toAdd.slice(1));
  }

  // Result[], inputCourse => Result[]
  function sectionsOnResults(results, course) {
    if (!results) {
      return false;
    } else {
      let newResults = [];
      results.forEach((r) => {
        course.mustBeSection.forEach((sec) => {
          let test = addSection(retrieveSection(sec, false, course.name), r)
          if (test) { newResults.push(test); }
        })
      })
      return newResults;
    }
  }
  function insertSection(result, courseId, sectionId) {
    return result;
  }
}

// Result, parsedCourse[], parsedCourse[] => Result[]
function generateArrangements(baseResult, specSemCourses, unspecCourses) {
  console.log("Function generateArrangements(baseResult, semesterCourses, unspecCourses) was called!");
  let results = [baseResult];

  specSemCourses.forEach((sc) => {
    sc.mustBeSemester.forEach((sem) => {
      retrieveSolvableNeedsOf(sem, sc.name);
    });
  });
  unspecCourses.forEach(() => { });
  //retrieveSolvableNeedsOf
  return results;
}

//TODO:
// Result[] => Result[]
function partialSolve(solvables) {
  console.log("Function partialSolve(solvables) was called!");
  // solvables.forEach((s)=>{
  // 	s.solvableNeeds.forEach(()=>{
  // 		// fulfil the sn here
  //		// must check for the switch to variations
  // 	})
  // })
  return solvables;
}

//TODO:
// Result with a few complex solvableNeeds => Result (Solution)
function fillVariations(result) {
  console.log("Function fillVariations(result){ was called!");
  return result;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// SCHEDULING TOOLBOX //////////////////////////////////////////////////////////// SCHEDULING TOOLBOX //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO:
// Section
function addSection(section, result) {
  console.log("Function addSection(section, result) was called!");
  return result;
  // let test = combineSchedules([section.dayBlocks], result.base)
  // return ({
  // 	base: test,
  // 	variations: result.variations,
  // 	//solvableNeeds: result.solvableNeeds.slice(1)
  // })
  // For each blockset in the section, combine it with the relevant schedule blockset
}

// for debugging purposes
function dispose(thing, reason) {
  console.log("Function dispose(thing, reason)  was called!");
  console.log(thing, "was thrown out because", reason);
}

function arrangeCourse(courseName, arrangement) {
  console.log("Function arrangeCourse(courseName, arrangement){ was called!");
}

function makeResult(base, variations, initialNeeds, satisfied, solvableNeeds, expectedBranches) {
  console.log("Function makeResult(base, variations, initialNeeds, satisfied, solvableNeeds, expectedBranches) { was called!");
}

// DayBlockSet[], DayBlockSet[] => DayBlockSet[] or false
export function combineSchedules(schedule1, schedule2) {
  console.log("Function combineSchedules(schedule1, schedule2) was called!");
  if (!schedule1 || !schedule2) return schedule1 || schedule2;
  let result = schedule2;
  schedule1.forEach((dbs1) => {
    let target = result.findIndex((dbs2) => { return dbs1.semester === dbs2.semester });
    if (target > -1) {
      result[target] = combineBlockSets(dbs1, result[target]);
    } else {
      result.push(dbs1);
    }
  })
}

// (DayBlockSet, DayBlockSet) => DayBlockSet or false
// smallSet will usually have single blocks, and may have a standard block
function combineBlockSets(smallSet, largeSet) {
  console.log("Function combineBlockSets(smallSet, largeSet) was called!");
  let result = largeSet;
  let smallStandard = smallSet.standardBlock;
  ["sunday", "monday", "tuesday", "thursday", "friday", "saturday"].filter(day => smallSet[day])
    .forEach((day) => {
      let combined = combineDays(
        (smallStandard || smallSet[day]),
        (largeSet[day] || [])
      );
      if (combined) {
        result[day] = combined;
      } else {
        return false;
      }
    })
  return result;
}

// (Block, Block[]) => Block[] or false
// (Block[], Block[]) => Block[] or false
function combineDays(smallDay, largeDay) {
  console.log("Function combineDays(smallDay, largeDay) was called!");
  if (typeof smallDay === "object") {
    return (insertBlock([], smallDay, largeDay))
  } else {
    let result = largeDay
    smallDay.forEach((block) => { insertBlock([], block, result) })
    return result;
  }
}

// Block[]s are ORDERED
// ([], Block, Block[]) => Block[] or false
function insertBlock(earlier, block, blocks) {
  console.log("Function insertBlock(earlier, block, blocks)  was called!");
  if (earlier.length > 0 && block.startTime < earlier[earlier.length - 1].endTime) {
    return false;
  } else {
    if (blocks.length === 0 || block.endTime <= blocks[0].startTime) {
      return [...earlier, block, ...blocks]
    } else {
      return insertBlock([...earlier, blocks[0]], block, blocks.slice(1))
    }
  }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// DATABASE FUNCTIONS //////////////////////////////////////////////////////////// DATABASE FUNCTIONS //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const database = [exportjust001, exportcpsc213, exportcpsc213a] // TODO

function courseExists(courseId) { return true && retrieveCourse(courseId) }
function courseSemesterExists(courseId, semesterId) { return true && retrieveCourseSemester(courseId, semesterId) }
function courseSectionExists(courseId, semesterId, sectionId) { return true && retrieveSection(courseId, semesterId, sectionId) }

// string =DATABASE=> Course or false
function retrieveCourse(courseId) {
  return database.find((course) => course.id === courseId) || false;
  // for(let i = 0; i < database.length; i++) {
  // 	if (database[i].id === courseId) {return database[i];}
  // }
  // console.error("retrieveCourses couldn't find ", courseId, " in the database");;
  // return false;
}

// (string, string) =DATABASE=> CourseSemester or false
function retrieveCourseSemester(semesterId, courseId) {
  try {
    return (
      retrieveCourse(courseId).singleSemesters.find(sem => sem.id === semesterId)
      || retrieveCourse(courseId).otherSemesters.find(sem => sem.id === semesterId)
      || false
    );
  } catch (e) {
    console.log("Couldn't retrieve the specified course: ", courseId);
    return false;
  }
}

// (string, string? string) =DATABASE=> CourseSection or false
function retrieveSection(sectionId, semesterId, courseId) {
  try {
    if (semesterId) {
      return (
        retrieveCourseSemester(semesterId, courseId).sections.find(sec => sec.id === sectionId)
        || false
      );
    } else {
      return retrieveSemestersOf(courseId).reduce(
        (found, semId) => {
          return (found || retrieveSection(sectionId, semId, courseId))//retrieveCourseSemester(semId, courseId).sections.find(sec => sec.id === sectionId) 
        }, false
      )
    }
  } catch (e) {
    console.log("Couldn't retrieve the specified course or semester");
    return false;
  }
}

// string =DATABASE=> [string] or (rarely) false
function retrieveSemestersOf(courseId) {
  try {
    return retrieveSingleSemestersOf(courseId).concat(retrieveOtherSemestersOf(courseId));
  } catch (e) {
    console.log("Couldn't retrieve the specified course: ", courseId);
    return false;
  }
}

function retrieveSingleSemestersOf(courseId) {
  try {
    return retrieveCourse(courseId).singleSemesters.map(sem => sem.id);
  } catch (e) {
    console.log("Couldn't retrieve the specified course: ", courseId);
    return false;
  }
}

function retrieveOtherSemestersOf(courseId) {
  try {
    return retrieveCourse(courseId).otherSemesters.map(sem => sem.id);
  } catch (e) {
    console.log("Couldn't retrieve the specified course: ", courseId);
    return false;
  }
}

// TODO: The map is currently unnecessary
// string =DATABASE=> [SolvableNeed] (typical length = 1 or 2)
function retrieveSolvableNeedsOf(semesterId, courseId) {
  return retrieveCourseSemester(semesterId, courseId).requiredActivities.map(ra => {
    return {
      activity: ra.activity,
      solutions: ra.solutions,
      tiedTo: ra.tiedTo
    }
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// TYPE DEFINITIONS ////////////////////////////////////////////////////////////// TYPE DEFINITIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} UserRequest
 * @property {InputCustom[]} customs
 * @property {InputCourse[]} courses
 * @property {Object} settings
  * @property {string} settings.schools from database
  * @property {string} settings.campuses from school's info
  * @property {string} settings.sessions from school's info or school campus's info
  * @property {string} settings.school
  * @property {string} settings.campus
  * @property {string} settings.session
  * @property {string | false} settings.maxParallelCourses
  * @property {string | false} settings.maxConsecutiveHours
  * @property {string} settings.preferredTime
  * @property {boolean} settings.reduceGaps
  * @property {boolean} settings.reduceDays
  * @property {boolean} settings.increaseConsistency
  * @todo add more!
  * @todo (maybe) school, campus, and session may be stored as a number
 */

/**
* @typedef {Object} InputCustom
* @property {string} name
* @todo
*
* @todo (maybe) creation of custom DayBlockSets can happen within the state of the CoursesMenu
*/

/**
 * @typedef {Object} InputCourse
 * @property {string} name
 * @property {string[] | false} mustBeSemester
 * @property {string[] | false} mustBeSection
 */

/**
 * @typedef {Object} Block
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} alternating
 * @property {false | string} subsetSectionActivities
 * @property {string} location
 * @property {string} prof
 * @property {string | undefined} renderName
 */

/**
* @typedef {Object} DayBlockSet
* @property {Block | false} standardBlock
* @property {Block | Block[] | false} sunday
* @property {Block | Block[] | false} monday
* @property {Block | Block[] | false} tuesday
* @property {Block | Block[] | false} wednesday
* @property {Block | Block[] | false} thursday
* @property {Block | Block[] | false} friday
* @property {Block | Block[] | false} saturday
* @property {string} semester
* @property {Date | false} subsetStartDate
* @property {Date | false} subsetEndDate
*/

/**
 * @typedef {Object} CourseSection
 */

/**
 * @typedef {Object} CourseSemester
 */

/**
 * @typedef {Object} Course
 */
const janIndex = 0, febIndex = 1, marIndex = 2, aprIndex = 3, mayIndex = 4, junIndex = 5, julIndex = 6, augIndex = 7, sepIndex = 8, octIndex = 9, novIndex = 10, decIndex = 11;
 
const block700800 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 700,
  endTime: 800,
  alternating: 0
}

const block800900 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 800,
  endTime: 900,
  alternating: 0
}

const block9001000 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 900,
  endTime: 1000,
  alternating: 0
}

const block10001130 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 1000,
  endTime: 1130,
  alternating: 0
}

const block17001800 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 1700,
  endTime: 1800,
  alternating: 0
}

const block18001930 = {
  courseId: "BLOK 100",
  subsetSectionActivities: false,
  startTime: 1800,
  endTime: 1930,
  alternating: 0
}

const emptyDayBlockSet = {
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
}

const dayBlockSet1 = {
  sunday: false,
  monday: [block800900],
  tuesday: [block9001000],
  wednesday: [block10001130],
  thursday: [block10001130, block17001800],
  friday: [],
  saturday: false,
}

const dayBlockSet2 = {
  sunday: false,
  monday: [block17001800],
  tuesday: [block800900, block9001000, block10001130, block17001800],
  wednesday: [],
  thursday: [block10001130, block17001800],
  friday: [block800900],
  saturday: false,
}

const dayBlockSetAll = {
  sunday: [block800900, block9001000],
  monday: [block9001000],
  tuesday: [block10001130],
  wednesday: [block9001000],
  thursday: [block800900],
  friday: [block9001000],
  saturday: [block17001800],
}

const emptyWLSemester1 = {
  id: "1",
  startDate: new Date(2020, sepIndex, 8),
  endDate: new Date(2020, decIndex, 3),
  dayBlocks: {emptyDayBlockSet}
};

const emptyWLSemester2 = {
  id: "2",
  startDate: new Date(2020, janIndex, 4),
  endDate: new Date(2020, aprIndex, 8),
  dayBlocks: {emptyDayBlockSet}
};

const WLSemester1 = {
  id: "1",
  startDate: new Date(2020, sepIndex, 8),
  endDate: new Date(2020, decIndex, 3),
  dayBlocks: {dayBlockSet1}
};

const WLSemester2 = {
  id: "2",
  startDate: new Date(2020, janIndex, 4),
  endDate: new Date(2020, aprIndex, 8),
  dayBlocks: {dayBlockSet2}
};

const emptyWorklist1Sem = {
  info: {gapScore: 100, morningScore: 50, consistencyScore: 0},
  semesters: [
    emptyWLSemester1
  ],
  abnormalSections: []
};

const emptyWorklist2Sem = {
  info: {gapScore: 100, morningScore: 50, consistencyScore: 0},
  semesters: [
    emptyWLSemester1,
    emptyWLSemester2
  ],
  abnormalSections: []
};

const simpleWorklist2Sem1 = {
  info: {gapScore: 100, morningScore: 50, consistencyScore: 0},
  semesters: [
    WLSemester1,
    WLSemester2,
  ],
  abnormalSections: []
};

module.exports = {
  emptyDayBlockSet: emptyDayBlockSet, 
  emptyWorklist1Sem: emptyWorklist1Sem,
  emptyWorklist2Sem: emptyWorklist2Sem,
  wl1: simpleWorklist2Sem1
}
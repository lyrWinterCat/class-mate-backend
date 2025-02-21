"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSchoolInfo = exports.checkExistingSchool = exports.getSchoolInfo = void 0;
const tslib_1 = require("tslib");
const db_1 = (0, tslib_1.__importDefault)(require("../loaders/db"));
const getSchoolInfo = async (schoolId) => {
    const [schools] = await db_1.default.query('SELECT school_id, school_name, school_type FROM school_info WHERE school_id = ?', [schoolId]);
    return schools.length > 0 ? schools[0] : null;
};
exports.getSchoolInfo = getSchoolInfo;
const checkExistingSchool = async (schoolId) => {
    const [rows] = await db_1.default.query('SELECT school_id FROM school_info WHERE school_id = ?', [schoolId]);
    return rows.length > 0;
};
exports.checkExistingSchool = checkExistingSchool;
const insertSchoolInfo = async (school) => {
    const { school_id, school_name, school_type } = school;
    await db_1.default.query('INSERT INTO school_info (school_id, school_name, school_type) VALUES (?, ?, ?)', [school_id, school_name, school_type]);
};
exports.insertSchoolInfo = insertSchoolInfo;
//# sourceMappingURL=school.js.map
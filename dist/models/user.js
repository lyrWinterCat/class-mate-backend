"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserInfo = exports.handleUserLogin = exports.mapRowToUser = void 0;
const tslib_1 = require("tslib");
const db_1 = (0, tslib_1.__importDefault)(require("../loaders/db"));
function mapRowToUser(row) {
    return {
        user_email: row.user_email,
        user_name: row.user_name,
        birth_date: row.birth_date,
        school1_id: row.school1_id,
        school2_id: row.school2_id,
        school3_id: row.school3_id,
        profile_path: row.profile_path,
        chat_no: row.chat_no
    };
}
exports.mapRowToUser = mapRowToUser;
const handleUserLogin = async (userEmail) => {
    try {
        const [userRows] = await db_1.default.query('SELECT * FROM user_info WHERE user_email = ?', [userEmail]);
        if (!userRows || userRows.length === 0) {
            console.log(`이메일 ${userEmail}에 대한 사용자가 없습니다.`);
            return [];
        }
        const users = userRows.map(mapRowToUser);
        return users;
    }
    catch (error) {
        console.error(`데이터베이스 쿼리 중 오류가 발생했습니다. ${error}`);
        throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
    }
};
exports.handleUserLogin = handleUserLogin;
const insertUserInfo = async (user) => {
    const { user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path } = user;
    await db_1.default.query('INSERT INTO user_info (user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path]);
};
exports.insertUserInfo = insertUserInfo;
//# sourceMappingURL=user.js.map
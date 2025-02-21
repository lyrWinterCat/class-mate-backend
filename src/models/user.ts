// user.ts
import { RowDataPacket } from 'mysql2';
import pool from '../loaders/db';

export interface User {
    user_email: string;
    user_name: string;
    birth_date: Date;
    school1_id: number | null;
    school2_id: number | null;
    school3_id: number | null;
    profile_path: string | null;
    chat_no: number | null;
}

export function mapRowToUser(row: RowDataPacket): User {
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

export const handleUserLogin = async (userEmail: string): Promise<User[]> => {
    try {
        const [userRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM user_info WHERE user_email = ?',
            [userEmail]
        );

        if (!userRows || userRows.length === 0) {
            console.log(`이메일 ${userEmail}에 대한 사용자가 없습니다.`);
            return [];
        }

        const users = userRows.map(mapRowToUser);
        return users;
    } catch (error) {
        console.error(`데이터베이스 쿼리 중 오류가 발생했습니다. ${error}`);
        throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
    }
};

export const insertUserInfo = async (user: User): Promise<void> => {
    const { user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path } = user;
    
    await pool.query(
        'INSERT INTO user_info (user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path]
    );
};

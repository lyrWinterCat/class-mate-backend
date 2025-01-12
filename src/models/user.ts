import { RowDataPacket } from 'mysql2';
import pool from '../loaders/db';

export interface User {
    user_email: string;
    user_name: string;
    birth_date: Date;
    school1_id: number;
    school2_id: number;
    school3_id: number;
    profile_path: string;
    chat_no: number;
  }

export interface School {
    school_id: number;
    school_name: string;
    school_type: string;
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
  
    // 쿼리 결과 확인
    console.log('쿼리 결과:', userRows);
  
    // userRows가 비어 있지 않은지 확인
    if (!userRows || userRows.length === 0) {
      console.log(`이메일 ${userEmail}에 대한 사용자가 없습니다.`);
      return [];
    }

    const users = userRows.map(mapRowToUser);
  
    // 변환된 사용자 확인
    console.log('변환된 사용자:', users);
  
    return users;
  } catch (error) {
    console.error(`데이터베이스 쿼리 중 오류가 발생했습니다. ${error}`);
    throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
  }
};

// 학교 정보가 존재하는지 확인하는 함수
export const checkExistingSchool = async (schoolId: number): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT school_id FROM school_info WHERE school_id = ?', [schoolId]);
  return rows.length > 0; // 학교가 존재하면 true, 아니면 false 반환
};

// 사용자 정보를 데이터베이스에 추가하는 함수
export const insertUserInfo = async (user: User): Promise<void> => {
  const { user_email, user_name, birth_date, school1_id, profile_path } = user;
  await pool.query('INSERT INTO user_info (user_email, user_name, birth_date, school1_id, profile_path) VALUES (?, ?, ?, ?, ?)', [
    user_email,
    user_name,
    birth_date,
    school1_id,
    profile_path,
  ]);
};

// 학교 정보를 데이터베이스에 추가하는 함수
export const insertSchoolInfo = async (school: School): Promise<void> => {
  const { school_id, school_name, school_type} = school;
  await pool.query('INSERT INTO school_info (school_id, school_name, school_type) VALUES (?, ?, ?)', [
    school_id,
    school_name,
    school_type,
  ]);
};
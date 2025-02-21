// school.ts
import { RowDataPacket } from 'mysql2';
import pool from '../loaders/db';

export interface School {
    school_id: number;
    school_name: string;
    school_type: string;
}

export const getSchoolInfo = async (schoolId: number): Promise<School | null> => {
    const [schools] = await pool.query<RowDataPacket[]>(
        'SELECT school_id, school_name, school_type FROM school_info WHERE school_id = ?',
        [schoolId]
    );
    return schools.length > 0 ? schools[0] as School : null;
};

export const checkExistingSchool = async (schoolId: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT school_id FROM school_info WHERE school_id = ?',
        [schoolId]
    );
    return rows.length > 0;
};

export const insertSchoolInfo = async (school: School): Promise<void> => {
    const { school_id, school_name, school_type } = school;
    await pool.query(
        'INSERT INTO school_info (school_id, school_name, school_type) VALUES (?, ?, ?)',
        [school_id, school_name, school_type]
    );
};

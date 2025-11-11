import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

/**
 * loginAdmin - Verifies admin credentials
 * @param {string} username - The admin's username
 * @param {string} inputPassword - The password entered by admin
 * @returns {object} - { success: boolean, admin?: object, message?: string }
 */

export async function loginAdmin(username, inputPassword) {
    try{
        //query to find admin by username
        const adminQuery = await pool.query(
         "SELECT * FROM admins WHERE username = $1",
        [username]
        );

        //if admin not found
        if (!adminQuery.rows.length) {
            return {success: false, message: "Invalid Credentials"}; //return error message
        }

        const admin = adminQuery.rows[0];

        //check if the password inputed and the password on the db is correct
        const isValid = await bcrypt.compare(inputPassword,admin.password);

        if (isValid){
            //if password is correct, return success and admin details
            return{
                success:true,
                admin: {
                    id:admin.id,
                    username: admin.username,
                    fullname: admin.fullname
                }
            };
        } else{
            //incorrect password
            return {success: false, message: "Invalid Credentials"};
        }
    }catch (error){
        //log error and return generic message
        console.error("Login error:", error);
        return {success: false, message: "Server Error"};
    }
}
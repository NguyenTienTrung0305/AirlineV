import { auth, db } from "../../database/firebaseAdmin.js"

import Admin from "../../models/users/Admin.model.js"

const ADMIN_COLLECTION_NAME = 'admins'

export const dbCreateAdmin = async ({
    email,
    password,
    firstName,
    lastName
}) => {
    try {
        const adminRecord = await auth.createUser({ email, password })

        const newAdmin = new Admin({ firstName, lastName, email })
        newAdmin.uid = adminRecord.uid

        const adminRef = db.collection(ADMIN_COLLECTION_NAME).doc(adminRecord.uid)
        await adminRef.set(newAdmin.toObject())
        return newAdmin
    } catch (error) {
        throw new Error(`error creating admin: ${error.message}`)
    }
}


export const dbGetAdminById = async (uid) => {
    try {
        const docRef = db.collection(ADMIN_COLLECTION_NAME).doc(uid)
        const docSnap = await docRef.get()

        if (docSnap.exists) {
            const adminData = new Admin({ ...docSnap.data() })
            adminData.uid = docSnap.id
            return adminData
        }
        throw new Error('Admin not found')
    } catch (error) {
        throw new Error(`Error getting admin by id: ${error.message}`)
    }
}


export const dbGetAllAdmins = async () => {
    try {
        const snapshot = await db.collection(ADMIN_COLLECTION_NAME).get()
        const admins = snapshot.docs.map(doc => {
            const data = doc.data()
            data.uid = doc.id
            return data
        })
        return admins
    } catch (error) {
        throw new Error(`Error getting all admins: ${error.message}`)
    }
}

export const dbUpdateAdmin = async (uid, data) => {
    try {
        const adminRef = db.collection(ADMIN_COLLECTION_NAME).doc(uid)
        await adminRef.update(data)
        return true
    } catch (error) {
        console.log(`updating admin ${uid} failed: ${error.message}`)
        return false
    }
}
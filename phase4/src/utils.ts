export enum userType {
    STUDENT,
    ADMIN,
    EMPLOYEE
}

export type user = {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    role: userType,
    isLabTech: boolean,
    isSiteTester: boolean
}

export const defaultUser: user = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: userType.ADMIN,
    isLabTech: false,
    isSiteTester: true
}
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

export type covidtest = {
    test_id: number
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

export const defaultTest: covidtest = {
    test_id: 100001
}

export type testingSite = {
    site_name: string,
    street: string,
    city: string, 
    state: string,
    zip: string,
    location: string
}

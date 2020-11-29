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

export const states: string[] = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
];

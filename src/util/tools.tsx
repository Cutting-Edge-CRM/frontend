import RegexParser from 'regex-parser';

export const emailValid = (email: any) => {
    // eslint-disable-next-line
    let validEmail = RegexParser(
    "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/."
    );
    return validEmail.test(email);
};
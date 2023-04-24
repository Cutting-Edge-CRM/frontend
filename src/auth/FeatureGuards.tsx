import dayjs from "dayjs";
import { subscription, currentUserClaims } from "./firebase"

export const isAllowed = (type: any) => {
    switch (type) {
        case 'team-feature':
            return subscription.subscription === 'team' || subscription.subscription === 'enterprise' || isFreeTrial();
        case 'edit-quote':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'edit-job':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'edit-invoice':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'edit-client':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'edit-note':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner' || currentUserClaims.role === 'staff';
        case 'add-note':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner' || currentUserClaims.role === 'staff';
        case 'edit-property':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'add-property':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'edit-visit':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'add-visit':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-full-schedule':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-company-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-employee-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';   
        case 'view-template-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';    
        case 'view-payment-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-proposal-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-billing-settings':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-all-timesheets':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'add-resource':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        case 'view-pricing':
            return currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner';
        default:
            return false;
    }
}

export const isCanceled = () => {
    return subscription.canceled;
}

export const pastDue = () => {
    return dayjs.unix(subscription.expiry).isBefore(dayjs()) && dayjs.unix(subscription.expiry).isAfter(dayjs().subtract(7, 'days'));
}

export const isClient = () => {
    return (!(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner' || currentUserClaims.role === 'staff'));
}

export const hasMaxEmployees = (count: number) => {
    return (subscription.subscription === 'team' || isFreeTrial()) && count >= 5;
}

export const isFreeTrial = () => {
    return dayjs(subscription.company?.created).isValid() && dayjs().isBefore(dayjs(subscription.company?.created).add(30, 'days')) && subscription.subscription === 'basic'
}

export const daysLeftInFreeTrial = () => {
    return dayjs(subscription.company?.created).add(30, 'days').diff(dayjs(), 'days');
}
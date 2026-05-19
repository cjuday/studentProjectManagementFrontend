import { PROJECT_STATUS } from "../../../constants/ProjectStatus";

export const getStatusBadge = (status: number) => {
    const statuses: Record<number, { label: string; className: string }> = {
        [PROJECT_STATUS.PENDING]: {
            label: 'Pending',
            className: 'bg-secondary',
        },
        [PROJECT_STATUS.UNDER_REVIEW]: {
            label: 'Under Review',
            className: 'bg-primary',
        },
        [PROJECT_STATUS.NEED_CHANGES]: {
            label: 'Need Changes',
            className: 'bg-warning text-dark',
        },
        [PROJECT_STATUS.APPROVED]: {
            label: 'Approved',
            className: 'bg-success',
        },
        [PROJECT_STATUS.REJECTED]: {
            label: 'Rejected',
            className: 'bg-danger',
        },
    };

    const currentStatus = statuses[status] || {
        label: 'Unknown',
        className: 'bg-dark',
    };

    return (
        <span className={`badge ${currentStatus.className}`}>
            {currentStatus.label}
        </span>
    );
};
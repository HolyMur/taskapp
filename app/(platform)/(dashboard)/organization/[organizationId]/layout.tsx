import {OrgControl} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";

const OrganizationIdLayout = ({children}:{children: React.ReactNode}) => {
    return (
        <div>
            <OrgControl/>
            {children}
        </div>
    );
};

export default OrganizationIdLayout;
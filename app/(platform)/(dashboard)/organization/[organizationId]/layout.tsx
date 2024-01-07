import {OrgControl} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";
import { startCase } from "lodash"
import {auth} from "@clerk/nextjs";

export async function generateMetadata(){
    const { orgSlug } = auth()

    return{
        title: startCase(orgSlug || "Проект")
    }
}

const OrganizationIdLayout = ({children}:{children: React.ReactNode}) => {
    return (
        <div>
            <OrgControl/>
            {children}
        </div>
    );
};

export default OrganizationIdLayout;
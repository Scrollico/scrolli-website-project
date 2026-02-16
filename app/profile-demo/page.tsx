"use client"

export const runtime = "edge";

import { AccountSettings } from "@/components/ui/account-settings";

export default function ProfileDemoPage() {
    return (
        <div className="bg-background min-h-screen">
            <AccountSettings />
        </div>
    );
}

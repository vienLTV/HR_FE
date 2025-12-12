import { EventSideSheet } from "@/app/components/EventSideSheet";
import { HomeChart } from "@/app/components/HomeChart";

export default function AdminPage() {
    return (
        <div className="w-full">
        {/* TITLE */}
        <div className="mt-2">
            <h1 className="text-primary-heading ml-4">Home Page</h1>
        </div>
        

        {/* TITLE */}
        {/* CHART */}
        <div className="w-full flex items-start justify-start">
            <div className="w-4/5">
              <HomeChart />
            </div>
            <div className="w-1/5">
                <EventSideSheet />
            </div>
        </div>
    </div>
    )
}
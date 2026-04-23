import { useState } from "react";
import { useGetList } from "ra-core";

import type { Contact, ContactNote } from "../types";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { DealsChart } from "./DealsChart";
import { HotContacts } from "./HotContacts";
import { TasksList } from "./TasksList";
import { Welcome } from "./Welcome";
import { DomesticWasteMonitoring } from "./DomesticWasteMonitoring";
import { IndustrialWasteMonitoring } from "./IndustrialWasteMonitoring";
import { PollutionHeatmap } from "./PollutionHeatmap";
import { RaiseAlertSection } from "./RaiseAlertSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

export const Dashboard = () => {
  const [isDashboardMode] = useState(true);
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const { total: totalDeal, isPending: isPendingDeal } = useGetList<Contact>(
    "deals",
    {
      pagination: { page: 1, perPage: 1 },
    },
  );

  const isPending = isPendingContact || isPendingContactNotes || isPendingDeal;

  if (isPending) {
    return null;
  }

  if (isDashboardMode) {
    return (
      <div className="w-full space-y-6 mt-1">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Waste Management & Pollution Monitoring Dashboard</h1>
          <p className="text-slate-300">Real-time environmental monitoring and waste management system</p>
        </div>

        <Tabs defaultValue="domestic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-200">
            <TabsTrigger value="domestic" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              🏘️ Domestic Waste
            </TabsTrigger>
            <TabsTrigger value="industrial" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              🏭 Industrial Waste
            </TabsTrigger>
            <TabsTrigger value="pollution" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              🌍 Pollution Map
            </TabsTrigger>
            <TabsTrigger value="alert" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              🚨 Raise Alert
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domestic" className="space-y-6 mt-6">
            <DomesticWasteMonitoring />
          </TabsContent>

          <TabsContent value="industrial" className="space-y-6 mt-6">
            <IndustrialWasteMonitoring />
          </TabsContent>

          <TabsContent value="pollution" className="space-y-6 mt-6">
            <PollutionHeatmap />
          </TabsContent>

          <TabsContent value="alert" className="space-y-6 mt-6">
            <RaiseAlertSection />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-1">
      <div className="md:col-span-3">
        <div className="flex flex-col gap-4">
          {import.meta.env.VITE_IS_DEMO === "true" ? <Welcome /> : null}
          <HotContacts />
        </div>
      </div>
      <div className="md:col-span-6">
        <div className="flex flex-col gap-6">
          {totalDeal ? <DealsChart /> : null}
          <DashboardActivityLog />
        </div>
      </div>

      <div className="md:col-span-3">
        <TasksList />
      </div>
    </div>
  );
};

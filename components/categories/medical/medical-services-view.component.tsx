import { useState } from "react";
import type { FC } from "react";
import MedicalHeaderBanner from "./medical-header-banner.component";
import MedicalTabNavigation, { type MedicalTab } from "./medical-tab-navigation.component";
import DoctorTabContent from "./doctor-tab-content.component";
import MedicineTabContent from "./medicine-tab-content.component";
import LabTestsTabContent from "./lab-tests-tab-content.component";

const MedicalServicesView: FC = () => {
  const [active_tab, setActiveTab] = useState<MedicalTab>("medicine");

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-3 pb-8">
      {/* Top Hero Banner */}
      <MedicalHeaderBanner />

      {/* Tab Navigation */}
      <MedicalTabNavigation
        active_tab={active_tab}
        on_tab_change={setActiveTab}
      />

      {/* Active Tab View */}
      <div className="pt-2">
        {active_tab === "doctor" && <DoctorTabContent />}
        {active_tab === "medicine" && <MedicineTabContent />}
        {active_tab === "lab_tests" && <LabTestsTabContent />}
      </div>
    </div>
  );
};

export default MedicalServicesView;

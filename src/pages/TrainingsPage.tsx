import { useState } from "react";
import Layout from "../components/layout";
import Trainings from "./Trainings";
import Schedules from "./Schedules";
import "./Trainings.css";

export default function TrainingsPage() {
  const [activeTab, setActiveTab] = useState<"schedules" | "trainings">("schedules");

  return (
    <Layout>
      <div className="pageWrap">
        <div className="pageHead">
          <div>
            <h1>Tréningy</h1>
            <p>Správa tréningov a automatických rozvrhov.</p>
          </div>

          <div className="tabBar">
            <button
              className={`tabBtn ${activeTab === "trainings" ? "active" : ""}`}
              onClick={() => setActiveTab("trainings")}
            >
              Tréningy
            </button>
            <button
              className={`tabBtn ${activeTab === "schedules" ? "active" : ""}`}
              onClick={() => setActiveTab("schedules")}
            >
              Automatické rozvrhy
            </button>
          </div>
        </div>

        {activeTab === "trainings" ? <Trainings /> : <Schedules />}
      </div>
    </Layout>
  );
}

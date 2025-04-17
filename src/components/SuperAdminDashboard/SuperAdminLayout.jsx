import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminheader from "./SuperAdminheader";

export default function SuperAdminLayout() {
  return (
    <div className="bg-neutral-100 h-screen w-screen flex">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full overflow-y-auto">
        <SuperAdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Header */}
        {/* <SuperAdminheader /> */}

        {/* Main content area */}
        <div className="flex-1 p-4 min-h-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

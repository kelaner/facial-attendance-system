import DashboardLayout from "@/layouts/common/DashboardLayout";
import SessionView from "@/sections/session/view";
import React from "react";

export const metadata = {
	title: '人脸检测考勤机系统',
};

export default function Home() {
	return (
		<DashboardLayout>
			<SessionView/>
		</DashboardLayout>
	);
}

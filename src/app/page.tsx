import DashboardLayout from "@/layouts/common/DashboardLayout";
import HomeView from "@/sections/home/view";
import React from "react";

export const metadata = {
	title: '人脸检测考勤机系统',
};

export default function Home() {
	return (
		<DashboardLayout>
			<HomeView/>
		</DashboardLayout>
	);
}

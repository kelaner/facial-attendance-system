import {Role} from "@/utils/user";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from '@mui/material/Collapse';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {usePathname, useSearchParams} from "next/navigation";
import React, {useState} from 'react';


export default function CustomDrawer({role}: { role?: Role }) {

	const [open, setOpen] = useState<boolean[]>(
		[true, true, true, true, true]
	)
	const path = usePathname()


	const searchParams = useSearchParams()
	const aiStatus = searchParams.get("ai");


	const handleClick = (index: number) => {
		setOpen((prevState) => {
			const updatedState = [...prevState];
			updatedState[ index ] = !updatedState[ index ];
			return updatedState;
		});
	};


	return (
		<Box sx={{height: "100vh", background: "linear-gradient(102deg, #F1F5FE 8.4%, #FEF8F1 83.36%)",}}>


			<List>
				<ListItemButton onClick={() => handleClick(0)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>考勤</Typography>
					{open[ 0 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>
				<Collapse in={open[ 0 ]} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton
							onClick={() => window.location.replace("/session")}
							sx={{
								color: path === "/session" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="考勤管理"/>
						</ListItemButton>

					</List>
				</Collapse>


				<ListItemButton onClick={() => handleClick(1)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>班级</Typography>
					{open[ 0 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>
				<Collapse in={open[ 0 ]} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton
							onClick={() => window.location.replace("/class")}
							sx={{
								color: path === "/class" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="班级管理"/>
						</ListItemButton>

					</List>
				</Collapse>


				<ListItemButton onClick={() => window.location.replace("/home")}>
					<Typography
						variant={"h6"}
						sx={{width: "100%", color: path === "/home" ? "#2395F1" : "#2B2D30", pl: 1}}>首页</Typography>
				</ListItemButton>

				<ListItemButton onClick={() => handleClick(0)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>消息</Typography>
					{open[ 0 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>
				<Collapse in={open[ 0 ]} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton
							onClick={() => window.location.replace("/student/message/meeting")}
							sx={{
								color: path === "/student/message/meeting" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="会面安排"/>
						</ListItemButton>

					</List>
				</Collapse>


				<ListItemButton onClick={() => handleClick(1)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>测试</Typography>
					{open[ 1 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>
				<Collapse in={open[ 1 ]} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton
							onClick={() => window.location.replace("/student/test/test")}
							sx={{
								color: ( path === "/student/test/test" && aiStatus == null ) ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="测试"/>
						</ListItemButton>


						<ListItemButton
							onClick={() => window.location.replace("/student/test/log")}
							sx={{
								color: path === "/student/test/log" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="记录"/>
						</ListItemButton>
					</List>
				</Collapse>


				<ListItemButton onClick={() => window.location.replace("/teacher/warning")}>
					<Typography
						variant={"h6"}
						sx={{
							width: "100%",
							color: path === "/teacher/warning" ? "#2395F1" : "#2B2D30",
							pl: 1
						}}>预警名单</Typography>
				</ListItemButton>

				<ListItemButton onClick={() => handleClick(2)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>记录查询</Typography>
					{open[ 2 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>
				<Collapse in={open[ 2 ]} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton
							onClick={() => window.location.replace("/teacher/record/test")}
							sx={{
								color: path === "/teacher/record/test" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="测试记录"/>
						</ListItemButton>
						<ListItemButton
							onClick={() => window.location.replace("/teacher/record/meet")}
							sx={{
								color: path === "/teacher/record/meet" ? "#2395F1" : "#2B2D30",
								pl: 5
							}}>
							<ListItemText primary="会面记录"/>
						</ListItemButton>
					</List>
				</Collapse>


				<ListItemButton onClick={() => handleClick(3)}>
					<Typography variant={"h6"} sx={{width: "100%", color: "#2B2D30", pl: 1}}>设置</Typography>
					{open[ 3 ] ? <ExpandLess/> : <ExpandMore/>}
				</ListItemButton>


			</List>
		</Box>
	)
}
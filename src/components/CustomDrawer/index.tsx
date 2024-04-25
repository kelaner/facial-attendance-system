import {Role} from "@/utils/user";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from '@mui/material/Collapse';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {usePathname} from "next/navigation";
import React, {useState} from 'react';


export default function CustomDrawer({role}: { role?: Role }) {

	const path = usePathname()
	const [open, setOpen] = useState<boolean[]>(
		[true, true]
	)


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
							<ListItemText primary="考勤总览"/>
						</ListItemButton>

						{path === "/session/attendance" &&
                <ListItemButton
                    sx={{
											color: path === "/session/attendance" ? "#2395F1" : "#2B2D30",
											pl: 5
										}}>
                    <ListItemText primary="考勤启动"/>
                </ListItemButton>
						}

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
							<ListItemText primary="班级总览"/>
						</ListItemButton>

					</List>
				</Collapse>


			</List>
		</Box>
	)
}
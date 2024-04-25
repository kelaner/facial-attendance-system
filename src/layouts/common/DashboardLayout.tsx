"use client"


import CustomDrawer from "@/components/CustomDrawer";
import DrawerHeaderBox from "@/components/DrawerHeaderBox/DrawerHeaderBox";
import {AppBar, DrawerHeader, drawerWidth, Main, theme} from "@/layouts/themeVariables";
import {Role} from "@/utils/user";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from "@mui/icons-material/Menu";
import {Divider, Stack, ThemeProvider, Toolbar, Typography} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import {usePathname} from "next/navigation";
import * as React from 'react';
import {useEffect, useState} from 'react';
import {isMobile} from "react-device-detect";

interface Props {
	children: React.ReactNode;
	role?: Role
}

export default function PersistentDrawerLeft({children, role}: Props) {

	const [open, setOpen] = React.useState(true);
	const path = usePathname()
	const [pathName, setPathName] = useState("")

	useEffect(() => {
		{
			switch (path) {
				case "/":
					setPathName("考勤总览")
					break
				case "/session":
					setPathName("考勤总览")
					break
				case "/session/attendance":
					setPathName("考勤启动中")
					break
				case "/class":
					setPathName("班级总览")
					break
				default:
					setPathName("未匹配到任何路径")
					break
			}
		}
	}, [path])

	useEffect(() => {
		setOpen(!isMobile)
	}, [])

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};


	return (
		<Stack direction={"column"}>
			<CssBaseline/>
			<ThemeProvider theme={theme}>

				<AppBar position="fixed" open={open}>
					<Toolbar sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row-reverse",
						alignItems: "center",
						justifyContent: "space-between",
					}}>

						<DrawerHeaderBox/>

						<Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"center"}>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								sx={{...( open && {display: 'none'} )}}
							>
								<MenuIcon/>
							</IconButton>

							<Typography variant={"h6"}>
								{pathName}
							</Typography>

						</Stack>
					</Toolbar>
				</AppBar>
			</ThemeProvider>

			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader sx={{background: "linear-gradient(102deg, #F1F5FE 8.4%, #FEF8F1 83.36%)"}}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
					</IconButton>

				</DrawerHeader>
				<Divider/>
				<CustomDrawer role={role}/>
			</Drawer>


			<Main open={open}>

				<DrawerHeader/>
				{children}

			</Main>

		</Stack>
	);
}



"use client"

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import {GetSessions} from "@/sections/session/data";
import {ClassWithIDType, SessionType, SessionWithIDType, StudentType} from "@/type/system";
import {Icon} from "@iconify/react";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Popover,
	PopoverProps,
	Stack,
	Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import React, {useEffect, useState} from 'react';


function SessionView() {


	const {memoizedValue: {data: SessionData, isLoading}, mutate} = GetSessions()
	const [anchorEl, setAnchorEl] = React.useState<PopoverProps['anchorEl']>(null);
	const open = Boolean(anchorEl);
	const [popList, setPopList] = React.useState<{
		id: number,
		attributes: StudentType | SessionType
	}[]>([]);
	const [actionDialog, setActionDialog] = useState<boolean>(false)
	const [selectSession, setSelectSession] = useState<SessionWithIDType>()
	const [selectClass, setSelectClass] = useState<ClassWithIDType>()


	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, value: any) => {
		if (value?.length > 0) {
			setAnchorEl(event.currentTarget);
			setPopList(value);
		}
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	function startAttendance() {
		// 跳转到考勤页面
		const searchParams = new URLSearchParams({
			session_id: selectSession!.id.toString(),
			class_id: selectClass!.id.toString(),
		});

		window.open(`/session/attendance?${searchParams}`, "_self");
	}


	useEffect(() => {
		console.log("SessionData", SessionData)
	}, [SessionData])

	const sessionColumns: GridColDef[] = [
		{field: "id", headerName: 'ID', minWidth: 50, maxWidth: 50, align: "center", headerAlign: "center"},
		{field: 'name', headerName: '考勤', flex: 2, minWidth: 100, align: "center", headerAlign: "center"},


		{
			type: "actions",
			field: 'actions',
			headerName: "开始考勤",
			minWidth: 20,
			align: "center",
			sortable: false,
			disableColumnMenu: true,
			getActions: (params) => [
				<GridActionsCellItem
					key={params.row.uid}
					icon={<Icon icon="solar:play-bold" width={24} color={"#1B75D1"}/>}
					label="删除"
					onClick={() => {
						setSelectSession(() => params.row)
						setActionDialog(true)
					}}
					sx={{color: "error.main"}}
				/>
			]
		},


		{
			field: 'completed',
			headerName: '完成状态',
			flex: 1,
			minWidth: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
						{params.row.completed ? <CheckCircleIcon color={"success"}/> : <CancelIcon color={"error"}/>}
					</Stack>
				)
			}
		},


		{
			field: 'complete_students',
			headerName: '已完成学生',
			flex: 2,
			minWidth: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<>
						<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
							<Button
								aria-owns={open ? 'mouse-over-popover' : undefined}
								aria-haspopup="true"
								onMouseEnter={(e) => handlePopoverOpen(e, params.row.complete_students.data)}
								onMouseLeave={handlePopoverClose}
								variant="contained"
								size={"small"}
								sx={{borderRadius: 2}}
							>
								<Typography sx={{fontSize: 14}}>
									{`${params.row.complete_students.data.length} 名学生`}
								</Typography>
							</Button>
						</Stack>
					</>
				)
			}
		},
		{
			field: 'classes',
			headerName: '使用班级',
			flex: 2,
			minWidth: 100,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<>
						<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"100%"}>
							<Button
								aria-owns={open ? 'mouse-over-popover' : undefined}
								aria-haspopup="true"
								onMouseEnter={(e) => handlePopoverOpen(e, params.row.classes.data)}
								onMouseLeave={handlePopoverClose}
								variant="contained"
								size={"small"}
								sx={{borderRadius: 2}}
								color={"secondary"}
							>
								<Typography sx={{fontSize: 14}}>
									{`${params.row.classes.data.length} 个班级`}
								</Typography>
							</Button>
						</Stack>
					</>
				)
			}
		},

		{
			field: 'start_time',
			headerName: '开始时间',
			flex: 3,
			minWidth: 200,
			align: "center",
			headerAlign: "center"
		},
		{
			field: 'end_time',
			headerName: '结束时间',
			flex: 3,
			minWidth: 200,
			align: "center",
			headerAlign: "center"
		},

	];

	if (isLoading) {
		return <LoadingScreen/>
	}


	return (
		<Container maxWidth={"xl"}>

			<Stack direction={"row"} justifyContent={"center"}>
				<Typography variant={"h5"} my={3}>
					考勤总览
				</Typography>
			</Stack>

			<Stack direction={"column"} spacing={4} sx={{py: 2, minHeight: "63vh"}}>
				<DataGrid
					rows={SessionData?.map(i => {
						return {
							...i.attributes,
							id: i.id,
						}
					}) ?? []}
					columns={sessionColumns}
					initialState={{
						pagination: {
							paginationModel: {page: 0, pageSize: 5},
						},
					}}
					pageSizeOptions={[5, 10, 20, 30]}

					disableMultipleRowSelection
					hideFooterSelectedRowCount
					getRowId={row => row.id}
					sx={{overflowY: "hidden"}}
				/>


			</Stack>

			<Popover
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Box sx={{background: "linear-gradient(102deg, #F1F5FE 8.4%, #FEF8F1 83.36%)", p: 1}}>
					{popList?.map((i, index) => {
						return (
							<MenuItem key={index} sx={{py: 0}}>
								{i.attributes.name}
							</MenuItem>
						)
					})
					}
				</Box>

			</Popover>

			<Dialog open={actionDialog} maxWidth={"sm"} fullWidth>
				<DialogTitle align={"center"}>请选择要考勤的班级</DialogTitle>
				<DialogContent>
					<Stack spacing={2} p={2} pb={0} direction={"column"} alignItems={"center"} justifyContent={"center"}>

						{selectSession?.classes ?
							<>
								{selectSession?.classes.data.map((i) => {
									return (
										<Button
											fullWidth
											key={i.id}
											variant={selectClass?.uid === i.attributes.uid ? "contained" : "outlined"}
											onClick={() => {
												setSelectClass({
													...i.attributes,
													id: i.id,
												})
											}}
										>{i.attributes.name}</Button>
									)
								})}
							</>
							:
							<Typography variant={"h6"} sx={{color: "gray"}}>暂无使用班级</Typography>
						}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Stack
						direction={"row"}
						justifyContent={"space-between"}
						alignItems={"center"}
						sx={{width: "100%", px: 4, my: 2}}
					>
						<Button
							color={"inherit"}
							variant={"contained"}
							onClick={() => {
								setActionDialog(false)
								setSelectSession(undefined)
								setSelectClass(undefined)
							}}
						>
							取消
						</Button>

						<Button
							disabled={!selectClass}
							variant={"contained"}
							color={"error"}
							onClick={startAttendance}
						>
							开始考勤
						</Button>
					</Stack>

				</DialogActions>
			</Dialog>


		</Container>
	);
}

export default SessionView;
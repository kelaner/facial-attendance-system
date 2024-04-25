"use client"

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import {GetClasses} from "@/sections/class/data";
import {SessionType, StudentType} from "@/type/system";
import {Button, Container, Dialog, MenuItem, Popover, PopoverProps, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React, {useEffect, useState} from 'react';

function ClassView() {

	const {memoizedValue: {data: ClassData, isLoading}, mutate} = GetClasses()
	const [anchorEl, setAnchorEl] = React.useState<PopoverProps['anchorEl']>(null);
	const open = Boolean(anchorEl);
	const [popList, setPopList] = React.useState<{
		id: number,
		attributes: StudentType | SessionType
	}[]>([]);
	const [actionDialog, setActionDialog] = useState<boolean>(false)

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, value: any) => {
		if (value?.length > 0) {
			setAnchorEl(event.currentTarget);
			setPopList(() => value)
		}
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};


	useEffect(() => {
		console.log("ClassData", ClassData)
	}, [ClassData])

	const classColumns: GridColDef[] = [
		{field: "sid", headerName: 'ID', minWidth: 50, maxWidth: 50, align: "center", headerAlign: "center"},
		{field: 'name', headerName: '班级', flex: 5, minWidth: 50, align: "center", headerAlign: "center"},
		{
			field: 'students',
			headerName: '学生',
			flex: 5,
			minWidth: 50,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<>
						<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"100%"} width={"100%"}>
							<Button
								aria-owns={open ? 'mouse-over-popover' : undefined}
								aria-haspopup="true"
								onMouseEnter={(e) => handlePopoverOpen(e, params.row.students.data)}
								onMouseLeave={handlePopoverClose}
								variant="contained"
								size={"small"}
								sx={{borderRadius: 2}}
							>
								<Typography sx={{fontSize: 14}}>
									{`${params.row.students.data.length} 名学生`}
								</Typography>
							</Button>
						</Stack>
					</>
				)
			}
		},
		{
			field: 'sessions',
			headerName: '考勤',
			flex: 5,
			minWidth: 50,
			align: "center",
			headerAlign: "center",
			renderCell: (params) => {
				return (
					<>
						<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} height={"100%"}>
							<Button
								aria-owns={open ? 'mouse-over-popover' : undefined}
								aria-haspopup="true"
								onMouseEnter={(e) => handlePopoverOpen(e, params.row.sessions.data)}
								onMouseLeave={handlePopoverClose}
								variant="contained"
								size={"small"}
								sx={{borderRadius: 2}}
								color={"secondary"}
							>
								<Typography sx={{fontSize: 14}}>
									{`${params.row.sessions.data.length} 项考勤`}
								</Typography>
							</Button>
						</Stack>
					</>
				)
			}
		},
	];

	if (isLoading) {
		return <LoadingScreen/>
	}

	return (
		<Container maxWidth={"xl"}>

			<Stack direction={"row"} justifyContent={"center"}>
				<Typography variant={"h5"} my={3}>
					班级总览
				</Typography>
			</Stack>

			<Stack direction={"column"} spacing={4} sx={{py: 2, minHeight: "63vh"}}>
				<DataGrid
					rows={ClassData?.map(i => {
						return {
							...i.attributes,
							sid: i.id,
						}
					}) ?? []}
					columns={classColumns}
					initialState={{
						pagination: {
							paginationModel: {page: 0, pageSize: 5},
						},
					}}
					pageSizeOptions={[5, 10, 20, 30]}
					disableMultipleRowSelection
					hideFooterSelectedRowCount
					getRowId={row => row.sid}
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

			<Dialog open={actionDialog} onClose={() => setActionDialog(false)}>

			</Dialog>

		</Container>
	);
}

export default ClassView;
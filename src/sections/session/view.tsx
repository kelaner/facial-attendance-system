"use client"

import {GetSessions} from "@/sections/session/data";
import {Icon} from "@iconify/react";
import {Stack, Typography} from "@mui/material";
import {DataGrid, GridActionsCellItem, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import React, {useEffect} from 'react';

function SessionView() {

	const [selected, setSelected] = React.useState<string[]>([]);
	const {memoizedValue: {data: SessionData, isLoading}, mutate} = GetSessions()

	useEffect(() => {
		console.log("SessionData", SessionData)
	}, [SessionData])

	const sessionColumns: GridColDef[] = [
		{field: "sid", headerName: 'ID', flex: 2, minWidth: 20, align: "center", headerAlign: "center"},
		{field: 'name', headerName: '考勤', flex: 5, minWidth: 50, align: "center", headerAlign: "center"},
		{field: 'completed', headerName: '完成状态', flex: 5, minWidth: 20, align: "center", headerAlign: "center"},
		{field: 'start_time', headerName: '开始时间', flex: 10, minWidth: 100, align: "center", headerAlign: "center"},
		{field: 'end_time', headerName: '结束时间', flex: 10, minWidth: 100, align: "center", headerAlign: "center"},
		{
			type: "actions",
			field: 'actions',
			headerName: "操作",
			minWidth: 50,
			align: "center",
			sortable: false,
			disableColumnMenu: true,
			getActions: (params) => [
				<GridActionsCellItem
					key={params.row.sid}
					icon={<Icon icon="solar:trash-bin-trash-bold" width={24} color={"red"}/>}
					label="删除"
					// onClick={() => deleteFunc(params.row.sid, params.row.sname)}
					sx={{color: "error.main"}}
				/>
			]
		},
	];


	return (
		<Stack>

			<Stack direction={"row"} justifyContent={"center"}>
				<Typography variant={"h6"}>
					考勤管理
				</Typography>
			</Stack>

			<Stack direction={"column"} spacing={4} sx={{py: 2, minHeight: "63vh"}}>
				<DataGrid
					rows={SessionData?.map(i => {
						return {
							...i.attributes,
							sid: i.id,
						}
					}) ?? []}
					columns={sessionColumns}
					initialState={{
						pagination: {
							paginationModel: {page: 0, pageSize: 5},
						},
					}}
					pageSizeOptions={[5, 10, 20, 30]}
					// checkboxSelection
					disableMultipleRowSelection
					hideFooterSelectedRowCount
					getRowId={row => row.sid}
					onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
						setSelected(rowSelectionModel as string[])
					}}
					sx={{overflowY: "hidden"}}
				/>


			</Stack>


		</Stack>
	);
}

export default SessionView;
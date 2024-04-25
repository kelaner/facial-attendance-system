"use client"

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import {GetClassByID} from "@/sections/class/data";
import {GetSessionByID} from "@/sections/session/data";
import {Avatar, Container, Stack} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from 'react';

function AttendanceView() {
	const searchParams = useSearchParams()
	const session_id = searchParams.get("session_id");
	const class_id = searchParams.get("class_id");

	const {
		memoizedValue: {data: ClassData, isLoading: isLoadingClass},
		mutate: mutateClass
	} = GetClassByID(Number(class_id))
	const {
		memoizedValue: {data: SessionData, isLoading: isLoadingSession},
		mutate: mutateSession
	} = GetSessionByID(Number(session_id))

	useEffect(() => {
		console.log("ClassData", ClassData)
	}, [ClassData])


	const [video, setVideo] = useState<HTMLVideoElement>()

	useEffect(() => {
		setVideo(document.getElementById("video") as HTMLVideoElement)
	}, [])

	const startVideo = () => {
		navigator.mediaDevices.getUserMedia({video: true})
		.then(stream => {
			video!.srcObject = stream;
		})
		.catch(err => {
			console.error("Error accessing camera:", err);
		});
	}


	if (isLoadingClass || isLoadingSession) {
		return <LoadingScreen/>
	}

	return (
		<Container maxWidth={"xl"}>
			<Stack direction={"row"} justifyContent={"space-between"}>

				<Stack sx={{width: "75%", p: 2}}>
					{/*	添加一个视频框，可以调取设备摄像头，如果没有，则调用public目录下的/video/face.mp4文件*/}
					<video
						// src={session_id ? `/video/face.mp4` : navigator.mediaDevices.getUserMedia("camera")}
						controls
						autoPlay
						muted
						width={"100%"}
						height={"auto"}
						id={"video"}
					/>
				</Stack>

				<Stack sx={{width: "25%", p: 2}}>
					{/*	创建一个带学生头像的学生列表,学生列表是ClassData.attributes.students */}
					<List>
						{ClassData?.attributes.students?.data.map(student => (
							<ListItemButton key={student.id}>
								<Avatar variant={"square"} src={student.attributes.avatar} alt={student.attributes.name}/>
								<ListItemText>{student.attributes.name}</ListItemText>
							</ListItemButton>
						))}
					</List>
				</Stack>

			</Stack>

		</Container>
	);
}

export default AttendanceView;
"use client"

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import {GetClassByID} from "@/sections/class/data";
import {GetSessionByID} from "@/sections/session/data";
import {Avatar, Container, Stack} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as faceApi from 'face-api.js';
import {useSearchParams} from "next/navigation";
import {enqueueSnackbar} from "notistack";
import React, {useEffect, useRef} from 'react';
import {isMobile} from "react-device-detect";


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


	const cameraVideoRef = useRef<HTMLVideoElement>(null);
	const canvasDivRef = useRef<HTMLCanvasElement>(null);
	const canvasEl = useRef<HTMLCanvasElement>(null);
	const backgroundCanvasEl = useRef<HTMLCanvasElement>(null);


	// 启动摄像头
	function openMedia() {
		const opt = {
			audio: false,
			video: true
		};

		navigator.mediaDevices.getUserMedia(opt)
		.then((mediaStream) => {
			const video = cameraVideoRef.current;
			// 旧的浏览器可能没有srcObject
			if (video) {
				if ('srcObject' in video) {
					video.srcObject = mediaStream;
					video.play().then()
				} else {
					enqueueSnackbar("您的浏览器不支持摄像头访问", {variant: "error"})
				}
			}
		})
		.catch((err) => {
			enqueueSnackbar(`未识别到有用设备`, {
				variant: "warning",
				anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
				preventDuplicate: true,
			})

			console.log("error", err)

			// const video = cameraVideoRef.current;
			// if (video) {
			// 	video.src = "/video/face.mp4";
			// 	video.play().then();
			// 	video.width = 304
			// 	video.height = 504
			// }

		});
	}

	useEffect(() => {
		// 模型加载
		Promise.all([
			// 轻量人脸识别模型
			faceApi.nets.tinyFaceDetector.loadFromUri("/models"),
			// 识别五官
			faceApi.nets.faceLandmark68Net.loadFromUri("/models"),
			// 识别范围内人脸
			faceApi.nets.faceRecognitionNet.loadFromUri("/models"),
			// 识别情绪
			faceApi.nets.faceExpressionNet.loadFromUri("/models"),
		]).then(openMedia)
	}, [])


	async function onPlay(): Promise<any> {
		if (!cameraVideoRef.current) return;
		const video = cameraVideoRef.current;

		if (video.paused || video.ended) {
			return setTimeout(() => onPlay());
		}

		const canvas = faceApi.createCanvasFromMedia(video);

		if (canvasDivRef.current) {
			canvasDivRef.current.append(canvas);
		}

		const result = await faceApi.detectAllFaces(
			video,
			new faceApi.TinyFaceDetectorOptions()
		)
		.withFaceLandmarks()
		.withFaceExpressions();

		const displaySize = {
			width: video.width,
			height: video.height,
		}

		// 绘制人脸
		if (result) {
			const canvas = canvasDivRef.current
			if (canvas) {
				faceApi.matchDimensions(canvas, displaySize, true);
				const resizedDetections = faceApi.resizeResults(result, displaySize);

				canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

				faceApi.draw.drawDetections(canvas, resizedDetections);
				faceApi.draw.drawFaceLandmarks(canvas, resizedDetections);
				faceApi.draw.drawFaceExpressions(canvas, resizedDetections);
			}

		}

		setTimeout(() => onPlay());
	}


	if (isLoadingClass || isLoadingSession) {
		return <LoadingScreen/>
	}

	return (
		<Container maxWidth={"xl"}>

			<Stack direction={isMobile ? "column" : "row"} justifyContent={"space-between"}>

				<Stack
					sx={{width: isMobile ? "100%" : "75%", p: 0, height: "80vh"}}
					alignItems={"center"}
					justifyContent={"center"}
					justifyItems={"center"}
				>
					{/*	添加一个视频框，可以调取设备摄像头，如果没有，则调用public目录下的/video/face.mp4文件*/}
					<video
						autoPlay
						loop
						muted
						// controls
						width="720"
						height="560"
						id={"cameraVideo"}
						onLoadedData={onPlay}
						ref={cameraVideoRef}
					/>

					<canvas
						ref={canvasDivRef}
						id={"canvas"}
						style={{
							position: "absolute"
						}}
					/>

				</Stack>

				<Stack
					direction={isMobile ? "row" : "column"}
					justifyContent={isMobile ? "space-between" : "flex-start"}
					sx={{width: isMobile ? "100%" : "25%", p: 2}}
				>
					{/*	创建一个带学生头像的学生列表 */}
					<List>
						<ListItemText sx={{whiteSpace: "nowrap"}}>学生列表</ListItemText>
						{ClassData?.attributes.students?.data.length === 0 &&
                <ListItemText sx={{whiteSpace: "nowrap"}}>无</ListItemText>}
						{ClassData?.attributes.students?.data.map(student => (
							<ListItemButton key={student.id}>
								<Avatar variant={"square"} src={student.attributes.avatar} alt={student.attributes.name}/>
								<ListItemText>{student.attributes.name}</ListItemText>
							</ListItemButton>
						))}
					</List>

					<List>
						<ListItemText sx={{whiteSpace: "nowrap"}}>已签到学生</ListItemText>
						{SessionData?.attributes.complete_students?.data.length === 0 &&
                <ListItemText sx={{whiteSpace: "nowrap", textAlign: "center"}}>无</ListItemText>}
						{SessionData?.attributes.complete_students?.data.map(student => (
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